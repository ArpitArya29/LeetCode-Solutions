const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const LEETCODE_API_BASE =
  "https://leetcode-api-pied.vercel.app/problem";

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

async function fetchProblem(problemNumber) {
  const url = `${LEETCODE_API_BASE}/${problemNumber}`;

  console.log(
    `Fetching problem #${problemNumber} from public problem API...`
  );

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "LeetCode-Solutions-README-Generator",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Problem API request failed with HTTP ${response.status}`
    );
  }

  const data = await response.json();

  if (!data || typeof data !== "object") {
    throw new Error("Problem API returned an invalid response.");
  }

  return data;
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
  if (!content || typeof content !== "string") {
    throw new Error("Problem description is missing.");
  }

  const paragraphs = content
    .split(/<\/p>/i)
    .map((paragraph) => stripHtml(paragraph))
    .filter(Boolean);

  if (paragraphs.length === 0) {
    throw new Error("Could not extract problem description.");
  }

  let overview = paragraphs[0];

  if (overview.length < 200 && paragraphs.length > 1) {
    overview += ` ${paragraphs[1]}`;
  }

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
        ["diff", "--name-only", BEFORE_SHA, AFTER_SHA],
        { encoding: "utf8" }
      )
        .split("\n")
        .map((file) => file.trim())
        .filter(Boolean);
    } catch {
      console.log(
        "Could not compare commits. Falling back to current commit."
      );
    }
  }

  return execFileSync(
    "git",
    ["show", "--pretty=", "--name-only", AFTER_SHA],
    { encoding: "utf8" }
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
  const match = folderName.match(/^\s*(\d+)[.\-_ ]+/);

  return match ? match[1] : null;
}

function getSolutionFiles(problemDirectory) {
  return fs
    .readdirSync(problemDirectory)
    .filter((file) => {
      const fullPath = path.join(problemDirectory, file);

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
  const readmePath = path.join(problemDirectory, "README.md");

  // Never overwrite an existing README.
  if (fs.existsSync(readmePath)) {
    console.log(`README already exists: ${readmePath}`);
    console.log("Skipping.");
    return null;
  }

  const folderName = path.basename(problemDirectory);
  const problemNumber = extractProblemNumber(folderName);

  if (!problemNumber) {
    throw new Error(
      `Could not determine problem number from folder: ${folderName}`
    );
  }

  console.log(`Looking up LeetCode problem #${problemNumber}...`);

  const problem = await fetchProblem(problemNumber);

  const title =
    problem.title ||
    problem.questionTitle ||
    problem.name;

  const titleSlug =
    problem.titleSlug ||
    problem.slug;

  const content =
    problem.content ||
    problem.description ||
    problem.question;

  // Validate everything BEFORE creating the README.
  if (!title) {
    throw new Error(
      `Problem #${problemNumber}: title missing from API response.`
    );
  }

  if (!titleSlug) {
    throw new Error(
      `Problem #${problemNumber}: titleSlug missing from API response.`
    );
  }

  if (!content) {
    throw new Error(
      `Problem #${problemNumber}: problem description missing from API response.`
    );
  }

  const overview = createProblemOverview(content);

  const solutionFiles = getSolutionFiles(problemDirectory);

  if (solutionFiles.length === 0) {
    throw new Error(
      `No solution files found in ${problemDirectory}.`
    );
  }

  const readme = createReadme({
    problemNumber,
    title,
    overview,
    titleSlug,
    solutionFiles,
  });

  // README is written ONLY after all validation succeeds.
  fs.writeFileSync(readmePath, readme, "utf8");

  console.log(`Created README: ${readmePath}`);

  return readmePath;
}

async function main() {
  console.log("Starting LeetCode README generation...");

  const changedFiles = getChangedFiles();
  const problemDirectories =
    getProblemDirectories(changedFiles);

  if (problemDirectories.length === 0) {
    console.log("No solution files detected.");
    return;
  }

  console.log(
    `Detected ${problemDirectories.length} problem directory/directories.`
  );

  const generatedReadmes = [];

  try {
    for (const directory of problemDirectories) {
      const readme =
        await processProblemDirectory(directory);

      if (readme) {
        generatedReadmes.push(readme);
      }
    }
  } catch (error) {
    console.error(
      "README generation failed."
    );
    console.error(error.message);

    // Remove READMEs generated during this run.
    for (const readme of generatedReadmes) {
      if (fs.existsSync(readme)) {
        fs.unlinkSync(readme);
        console.log(
          `Removed generated README: ${readme}`
        );
      }
    }

    // Make sure nothing from this run remains staged.
    if (generatedReadmes.length > 0) {
      execFileSync(
        "git",
        ["reset", "--", ...generatedReadmes],
        { stdio: "inherit" }
      );
    }

    throw error;
  }

  if (generatedReadmes.length === 0) {
    console.log("No new READMEs were generated.");
    return;
  }

  execFileSync(
    "git",
    ["add", "--", ...generatedReadmes],
    { stdio: "inherit" }
  );

  try {
    execFileSync(
      "git",
      ["diff", "--cached", "--quiet"],
      { stdio: "ignore" }
    );

    console.log("No staged changes.");
    return;
  } catch {
    // Exit code 1 means staged changes exist.
  }

  execFileSync(
    "git",
    ["config", "user.name", "github-actions[bot]"],
    { stdio: "inherit" }
  );

  execFileSync(
    "git",
    [
      "config",
      "user.email",
      "41898282+github-actions[bot]@users.noreply.github.com",
    ],
    { stdio: "inherit" }
  );

  execFileSync(
    "git",
    ["commit", "-m", "docs: add LeetCode problem README"],
    { stdio: "inherit" }
  );

  execFileSync(
    "git",
    ["push"],
    { stdio: "inherit" }
  );

  console.log(
    "README generation completed successfully."
  );
}

main().catch((error) => {
  console.error("Workflow failed:", error);
  process.exit(1);
});
