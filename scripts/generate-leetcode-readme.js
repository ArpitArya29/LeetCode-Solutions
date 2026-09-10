const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const SOLUTION_EXTENSIONS = new Set([
  ".java",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".cpp",
  ".c",
  ".cs",
  ".go",
  ".rs",
]);

const BEFORE_SHA = process.env.BEFORE_SHA;
const AFTER_SHA = process.env.AFTER_SHA;

async function leetCodeRequest(query, variables) {
  const response = await fetch(LEETCODE_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `LeetCode request failed with HTTP ${response.status}`
    );
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(
      `LeetCode GraphQL error: ${JSON.stringify(data.errors)}`
    );
  }

  return data;
}

async function findProblem(problemNumber) {
  const query = `
    query problemsetQuestionListV2(
      $limit: Int,
      $searchKeyword: String,
      $skip: Int,
      $categorySlug: String
    ) {
      problemsetQuestionListV2(
        limit: $limit,
        searchKeyword: $searchKeyword,
        skip: $skip,
        categorySlug: $categorySlug
      ) {
        questions {
          questionFrontendId
          title
          titleSlug
        }
      }
    }
  `;

  const result = await leetCodeRequest(query, {
    limit: 100,
    searchKeyword: String(problemNumber),
    skip: 0,
    categorySlug: "",
  });

  const questions =
    result.data?.problemsetQuestionListV2?.questions || [];

  return questions.find(
    (question) =>
      String(question.questionFrontendId) ===
      String(problemNumber)
  );
}

async function fetchProblemContent(titleSlug) {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionFrontendId
        title
        titleSlug
        content
      }
    }
  `;

  const result = await leetCodeRequest(query, {
    titleSlug,
  });

  return result.data?.question;
}

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function createProblemOverview(content) {
  if (!content) {
    return "";
  }

  /*
   * Extract the first meaningful paragraph from
   * LeetCode's HTML problem description.
   */
  const paragraphs = content
    .split(/<\/p>/i)
    .map((paragraph) => stripHtml(paragraph))
    .filter((paragraph) => paragraph.length > 0);

  if (paragraphs.length === 0) {
    return "";
  }

  let overview = paragraphs[0];

  /*
   * If the first paragraph is very short,
   * include the second one as additional context.
   */
  if (overview.length < 200 && paragraphs.length > 1) {
    overview += ` ${paragraphs[1]}`;
  }

  /*
   * Keep the README concise.
   */
  if (overview.length > 1000) {
    overview =
      overview.substring(0, 1000).split(" ").slice(0, -1).join(" ") +
      "...";
  }

  return overview;
}

function getChangedFiles() {
  if (
    BEFORE_SHA &&
    BEFORE_SHA !== "0000000000000000000000000000000000000000"
  ) {
    try {
      return execFileSync(
        "git",
        [
          "diff",
          "--name-only",
          BEFORE_SHA,
          AFTER_SHA,
        ],
        {
          encoding: "utf8",
        }
      )
        .split("\n")
        .map((file) => file.trim())
        .filter(Boolean);
    } catch (error) {
      console.log(
        "Could not compare commits. Falling back to current commit."
      );
    }
  }

  return execFileSync(
    "git",
    [
      "show",
      "--pretty=",
      "--name-only",
      AFTER_SHA,
    ],
    {
      encoding: "utf8",
    }
  )
    .split("\n")
    .map((file) => file.trim())
    .filter(Boolean);
}

function getProblemDirectories(changedFiles) {
  const directories = new Set();

  for (const file of changedFiles) {
    const extension = path.extname(file).toLowerCase();

    if (!SOLUTION_EXTENSIONS.has(extension)) {
      continue;
    }

    const directory = path.dirname(file);

    if (directory && directory !== ".") {
      directories.add(directory);
    }
  }

  return [...directories].sort();
}

function extractProblemNumber(folderName) {
  const match = folderName.match(
    /^\s*(\d+)[.\-_ ]+(.+?)\s*$/
  );

  return match ? match[1] : null;
}

function getSolutionFiles(problemDirectory) {
  return fs
    .readdirSync(problemDirectory)
    .filter((file) => {
      const fullPath = path.join(
        problemDirectory,
        file
      );

      if (!fs.statSync(fullPath).isFile()) {
        return false;
      }

      return SOLUTION_EXTENSIONS.has(
        path.extname(file).toLowerCase()
      );
    })
    .sort();
}

function createReadme({
  problemNumber,
  title,
  overview,
  titleSlug,
  solutionFiles,
}) {
  const solutionList = solutionFiles
    .map((file) => `- \`${file}\``)
    .join("\n");

  return `# ${problemNumber}. ${title}

## Problem Overview

${overview}

## Solution

This directory contains my submitted solution for this problem.

${solutionList}

## LeetCode

[View Problem on LeetCode](https://leetcode.com/problems/${titleSlug}/)
`;
}

async function processProblemDirectory(problemDirectory) {
  const readmePath = path.join(
    problemDirectory,
    "README.md"
  );

  /*
   * IMPORTANT:
   * Never overwrite an existing README.
   */
  if (fs.existsSync(readmePath)) {
    console.log(
      `README already exists: ${readmePath}`
    );
    console.log("Skipping.");
    return null;
  }

  const folderName = path.basename(problemDirectory);

  const problemNumber =
    extractProblemNumber(folderName);

  if (!problemNumber) {
    console.log(
      `Could not determine problem number from: ${folderName}`
    );
    return null;
  }

  console.log(
    `Looking up LeetCode problem #${problemNumber}...`
  );

  try {
    const problem =
      await findProblem(problemNumber);

    if (!problem) {
      console.log(
        `Problem #${problemNumber} was not found on LeetCode.`
      );
      return null;
    }

    const details =
      await fetchProblemContent(
        problem.titleSlug
      );

    if (!details) {
      console.log(
        `Could not retrieve details for #${problemNumber}.`
      );
      return null;
    }

    const overview =
      createProblemOverview(
        details.content
      );

    if (!overview) {
      console.log(
        `Could not create an overview for #${problemNumber}.`
      );
      return null;
    }

    const solutionFiles =
      getSolutionFiles(problemDirectory);

    const readme =
      createReadme({
        problemNumber,
        title: problem.title,
        overview,
        titleSlug: problem.titleSlug,
        solutionFiles,
      });

    fs.writeFileSync(
      readmePath,
      readme,
      "utf8"
    );

    console.log(
      `Created README: ${readmePath}`
    );

    return readmePath;
  } catch (error) {
    /*
     * IMPORTANT:
     * Errors are logged only in GitHub Actions.
     * They are NEVER written to README.md.
     */
    console.error(
      `Failed to generate README for ${folderName}:`
    );
    console.error(error.message);

    return null;
  }
}

async function main() {
  console.log(
    "Starting LeetCode README generation..."
  );

  const changedFiles =
    getChangedFiles();

  const problemDirectories =
    getProblemDirectories(
      changedFiles
    );

  if (problemDirectories.length === 0) {
    console.log(
      "No solution files detected."
    );
    return;
  }

  const generatedReadmes = [];

  for (const directory of problemDirectories) {
    const readme =
      await processProblemDirectory(
        directory
      );

    if (readme) {
      generatedReadmes.push(readme);
    }
  }

  if (generatedReadmes.length === 0) {
    console.log(
      "No new READMEs were generated."
    );
    return;
  }

  /*
   * Stage ONLY READMEs created by this workflow.
   */
  execFileSync(
    "git",
    [
      "add",
      "--",
      ...generatedReadmes,
    ],
    {
      stdio: "inherit",
    }
  );

  /*
   * Don't create an empty commit.
   */
  try {
    execFileSync(
      "git",
      [
        "diff",
        "--cached",
        "--quiet",
      ],
      {
        stdio: "ignore",
      }
    );

    console.log(
      "No staged changes."
    );

    return;
  } catch {
    // Exit code 1 means staged changes exist.
  }

  execFileSync(
    "git",
    [
      "config",
      "user.name",
      "github-actions[bot]",
    ],
    {
      stdio: "inherit",
    }
  );

  execFileSync(
    "git",
    [
      "config",
      "user.email",
      "41898282+github-actions[bot]@users.noreply.github.com",
    ],
    {
      stdio: "inherit",
    }
  );

  execFileSync(
    "git",
    [
      "commit",
      "-m",
      "docs: add LeetCode problem README",
    ],
    {
      stdio: "inherit",
    }
  );

  execFileSync(
    "git",
    ["push"],
    {
      stdio: "inherit",
    }
  );

  console.log(
    "README generation completed successfully."
  );
}

main().catch((error) => {
  console.error(
    "Workflow failed:",
    error
  );

  process.exit(1);
});
