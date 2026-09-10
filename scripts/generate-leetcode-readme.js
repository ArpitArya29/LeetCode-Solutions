const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const LEETCODE_API_BASE =
  "https://leetcode-api-pied.vercel.app/problem";

const API_TIMEOUT_MS = 15000;
const MAX_API_RESPONSE_BYTES = 2 * 1024 * 1024;
const MAX_OVERVIEW_LENGTH = 1000;

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

function isValidCommitSha(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{40}$/i.test(value)
  );
}

async function fetchProblem(problemNumber) {
  const url = `${LEETCODE_API_BASE}/${encodeURIComponent(
    problemNumber
  )}`;

  console.log(
    `Fetching problem #${problemNumber} from public problem API...`
  );

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, API_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "LeetCode-Solutions-README-Generator",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Problem API request failed with HTTP ${response.status}.`
      );
    }

    const contentLength = response.headers.get("content-length");

    if (
      contentLength &&
      Number(contentLength) > MAX_API_RESPONSE_BYTES
    ) {
      throw new Error(
        "Problem API response is unexpectedly large."
      );
    }

    const buffer = await response.arrayBuffer();

    if (buffer.byteLength > MAX_API_RESPONSE_BYTES) {
      throw new Error(
        "Problem API response exceeded the allowed size."
      );
    }

    const text = new TextDecoder().decode(buffer);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        "Problem API returned invalid JSON."
      );
    }

    if (!data || typeof data !== "object") {
      throw new Error(
        "Problem API returned an invalid response."
      );
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Problem API request timed out."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function stripHtml(html) {
  return html
    // Remove script/style blocks and their contents.
    .replace(
      /<(script|style)[^>]*>[\s\S]*?<\/\1>/gi,
      " "
    )
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
  if (
    typeof content !== "string" ||
    content.trim().length === 0
  ) {
    throw new Error(
      "Problem description is missing."
    );
  }

  const paragraphs = content
    .split(/<\/p>/i)
    .map((paragraph) => stripHtml(paragraph))
    .filter(Boolean);

  if (paragraphs.length === 0) {
    throw new Error(
      "Could not extract problem description."
    );
  }

  let overview = paragraphs[0];

  if (
    overview.length < 200 &&
    paragraphs.length > 1
  ) {
    overview += ` ${paragraphs[1]}`;
  }

  if (overview.length > MAX_OVERVIEW_LENGTH) {
    overview =
      overview
        .substring(0, MAX_OVERVIEW_LENGTH)
        .split(" ")
        .slice(0, -1)
        .join(" ") + "...";
  }

  return overview;
}

function getChangedFiles() {
  if (
    isValidCommitSha(BEFORE_SHA) &&
    isValidCommitSha(AFTER_SHA) &&
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
          maxBuffer: 1024 * 1024,
        }
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

  if (!isValidCommitSha(AFTER_SHA)) {
    throw new Error(
      "Invalid GitHub commit SHA."
    );
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
      maxBuffer: 1024 * 1024,
    }
  )
    .split("\n")
    .map((file) => file.trim())
    .filter(Boolean);
}

function getProblemDirectories(changedFiles) {
  const directories = new Set();

  for (const file of changedFiles) {
    const extension =
      path.extname(file).toLowerCase();

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

function extractProblemInfo(folderName) {
  const match = folderName.match(
    /^\s*(\d+)[.\-_ ]+(.+?)\s*$/
  );

  if (!match) {
    return null;
  }

  return {
    number: match[1],
    title: match[2].trim(),
  };
}

function getSolutionFiles(problemDirectory) {
  return fs
    .readdirSync(problemDirectory)
    .filter((file) => {
      const fullPath =
        path.join(problemDirectory, file);

      if (!fs.statSync(fullPath).isFile()) {
        return false;
      }

      return SOLUTION_EXTENSIONS.has(
        path.extname(file).toLowerCase()
      );
    })
    .sort();
}

function validateLeetCodeUrl(value) {
  if (typeof value !== "string") {
    throw new Error(
      "Problem URL is missing from API response."
    );
  }

  let parsed;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(
      "Problem API returned an invalid URL."
    );
  }

  if (
    parsed.protocol !== "https:" ||
    parsed.hostname !== "leetcode.com"
  ) {
    throw new Error(
      "Problem API returned an untrusted URL."
    );
  }

  if (
    !parsed.pathname.startsWith("/problems/")
  ) {
    throw new Error(
      "Problem API returned an invalid LeetCode problem URL."
    );
  }

  return parsed.toString();
}

function createReadme({
  problemNumber,
  title,
  overview,
  problemUrl,
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

[View Problem on LeetCode](${problemUrl})
`;
}

async function processProblemDirectory(
  problemDirectory
) {
  const readmePath = path.join(
    problemDirectory,
    "README.md"
  );

  // Never overwrite an existing README.
  if (fs.existsSync(readmePath)) {
    console.log(
      `README already exists: ${readmePath}`
    );
    console.log("Skipping.");
    return null;
  }

  const folderName =
    path.basename(problemDirectory);

  const problemInfo =
    extractProblemInfo(folderName);

  if (!problemInfo) {
    throw new Error(
      `Could not determine problem number and title from folder: ${folderName}`
    );
  }

  const {
    number: problemNumber,
    title,
  } = problemInfo;

  console.log(
    `Looking up LeetCode problem #${problemNumber}...`
  );

  const problem =
    await fetchProblem(problemNumber);

  /*
   * We deliberately take the problem number and title
   * from the trusted folder created by Leet2Hub.
   *
   * The external API is used only for the description
   * and official LeetCode URL.
   */
  const apiProblemNumber =
    problem.questionFrontendId;

  const content =
    problem.content;

  const problemUrl =
    validateLeetCodeUrl(problem.url);

  // Cross-check the problem number.
  if (
    apiProblemNumber &&
    String(apiProblemNumber) !==
      String(problemNumber)
  ) {
    throw new Error(
      `Problem number mismatch: folder says ${problemNumber}, API says ${apiProblemNumber}.`
    );
  }

  const overview =
    createProblemOverview(content);

  const solutionFiles =
    getSolutionFiles(problemDirectory);

  if (solutionFiles.length === 0) {
    throw new Error(
      `No solution files found in ${problemDirectory}.`
    );
  }

  const readme = createReadme({
    problemNumber,
    title,
    overview,
    problemUrl,
    solutionFiles,
  });

  /*
   * IMPORTANT:
   *
   * The README is written only after every required
   * value has passed validation.
   */
  fs.writeFileSync(
    readmePath,
    readme,
    "utf8"
  );

  console.log(
    `Created README: ${readmePath}`
  );

  return readmePath;
}

async function main() {
  console.log(
    "Starting LeetCode README generation..."
  );

  const changedFiles =
    getChangedFiles();

  const problemDirectories =
    getProblemDirectories(changedFiles);

  if (problemDirectories.length === 0) {
    console.log(
      "No solution files detected."
    );
    return;
  }

  console.log(
    `Detected ${problemDirectories.length} problem directory/directories.`
  );

  const generatedReadmes = [];

  try {
    for (
      const directory of problemDirectories
    ) {
      const readme =
        await processProblemDirectory(
          directory
        );

      if (readme) {
        generatedReadmes.push(readme);
      }
    }
  } catch (error) {
    console.error(
      "README generation failed."
    );
    console.error(error.message);

    /*
     * Fail closed:
     * remove every README generated during
     * this workflow run.
     */
    for (
      const readme of generatedReadmes
    ) {
      if (fs.existsSync(readme)) {
        fs.unlinkSync(readme);

        console.log(
          `Removed generated README: ${readme}`
        );
      }
    }

    throw error;
  }

  if (generatedReadmes.length === 0) {
    console.log(
      "No new READMEs were generated."
    );
    return;
  }

  /*
   * Stage ONLY generated README files.
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
    error.message
  );

  process.exit(1);
});
