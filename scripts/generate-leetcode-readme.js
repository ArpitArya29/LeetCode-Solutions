const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const API_BASE_URL = "https://leetcode-api-pied.vercel.app/problem";
const API_TIMEOUT_MS = 15000;
const MAX_API_RESPONSE_BYTES = 2 * 1024 * 1024;

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
  ".rs"
]);

const GENERATED_READMES = [];

/**
 * Execute a git command safely without invoking a shell.
 */
function git(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

/**
 * Validate a Git commit SHA.
 */
function isValidSha(value) {
  return /^[0-9a-f]{40}$/i.test(value || "");
}

/**
 * Escape Markdown-sensitive characters when necessary.
 */
function escapeMarkdownText(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\*/g, "\\*")
    .replace(/_/g, "\\_")
    .replace(/`/g, "\\`");
}

/**
 * Decode common HTML entities.
 */
function decodeHtmlEntities(text) {
  return text
    .replace(/&quot;/gi, '"')
    .replace(/&#34;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ");
}

/**
 * Convert HTML into readable plain text while preserving
 * meaningful line breaks.
 */
function htmlToText(html) {
  return html
    // Preserve code/pre blocks as text.
    .replace(/<pre[^>]*>/gi, "\n")
    .replace(/<\/pre>/gi, "\n")

    // Preserve common block-level boundaries.
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")

    // Remove remaining HTML tags.
    .replace(/<[^>]+>/g, "")

    // Decode entities.
    .pipe ? "" : ""
}

/**
 * Small helper because String.prototype.pipe does not exist.
 * Kept separate so htmlToText stays easy to read.
 */
function convertHtmlToText(html) {
  let text = html
    // Preserve code/pre blocks as text.
    .replace(/<pre[^>]*>/gi, "\n")
    .replace(/<\/pre>/gi, "\n")

    // Preserve common block-level boundaries.
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")

    // Remove remaining HTML tags.
    .replace(/<[^>]+>/g, "");

  text = decodeHtmlEntities(text);

  // Normalize line endings.
  text = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  // Normalize whitespace while preserving line structure.
  text = text
    .split("\n")
    .map(line => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text;
}

/**
 * Extract the first meaningful paragraph from the problem HTML.
 */
function createProblemOverview(content) {
  const paragraphs = [];

  const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = paragraphRegex.exec(content)) !== null) {
    const paragraph = convertHtmlToText(match[1]).trim();

    if (paragraph) {
      paragraphs.push(paragraph);
    }
  }

  if (paragraphs.length === 0) {
    const fallback = convertHtmlToText(content);

    if (!fallback) {
      throw new Error("Could not extract problem description.");
    }

    return fallback.slice(0, 1000);
  }

  let overview = paragraphs[0];

  // If the first paragraph is extremely short, include the next
  // paragraph as well when available.
  if (overview.length < 200 && paragraphs.length > 1) {
    overview += ` ${paragraphs[1]}`;
  }

  // Prevent unexpectedly huge README sections.
  return overview.slice(0, 1000);
}

/**
 * Extract sample examples from LeetCode's problem HTML.
 *
 * LeetCode's HTML structure varies between problems.
 * For example, it may contain:
 *
 * <strong>Example 1:</strong>
 *
 * or:
 *
 * <strong class="example">Example 1:
 *
 * Therefore we first convert the HTML to plain text and then
 * parse the resulting structure.
 */
function extractExamples(content) {
  const text = convertHtmlToText(content);

  /*
   * Example blocks are separated by:
   *
   * Example 1:
   * ...
   *
   * Example 2:
   * ...
   *
   * We stop at the next Example heading or Constraints.
   */
  const exampleRegex =
    /(?:^|\n)\s*Example\s+(\d+)\s*:?\s*\n([\s\S]*?)(?=\n\s*Example\s+\d+\s*:?\s*(?:\n|$)|\n\s*Constraints\s*:?\s*(?:\n|$)|$)/gi;

  const examples = [];
  let match;

  while ((match = exampleRegex.exec(text)) !== null) {
    const number = match[1];
    const block = match[2].trim();

    /*
     * Extract Input.
     */
    const inputMatch = block.match(
      /(?:^|\n)\s*Input\s*:\s*([\s\S]*?)(?=\n\s*Output\s*:|\n\s*Explanation\s*:|$)/i
    );

    /*
     * Extract Output.
     */
    const outputMatch = block.match(
      /(?:^|\n)\s*Output\s*:\s*([\s\S]*?)(?=\n\s*Explanation\s*:|$)/i
    );

    /*
     * Explanation is optional because not every example necessarily
     * contains one.
     */
    const explanationMatch = block.match(
      /(?:^|\n)\s*Explanation\s*:\s*([\s\S]*?)$/i
    );

    // Input and Output are required for a valid sample.
    if (!inputMatch || !outputMatch) {
      continue;
    }

    const input = inputMatch[1].trim();
    const output = outputMatch[1].trim();

    const explanation = explanationMatch
      ? explanationMatch[1].trim()
      : "";

    if (!input || !output) {
      continue;
    }

    examples.push({
      number,
      input,
      output,
      explanation
    });
  }

  if (examples.length === 0) {
    throw new Error(
      "Could not find any sample examples in the problem content."
    );
  }

  return examples;
}

/**
 * Validate a LeetCode URL received from the API.
 */
function validateLeetCodeUrl(url) {
  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error("API returned an invalid LeetCode URL.");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("API returned a non-HTTPS LeetCode URL.");
  }

  if (parsed.hostname !== "leetcode.com") {
    throw new Error("API returned a URL outside leetcode.com.");
  }

  if (!parsed.pathname.startsWith("/problems/")) {
    throw new Error("API returned an invalid LeetCode problem URL.");
  }

  return parsed.toString();
}

/**
 * Fetch problem information from the public problem API.
 *
 * No LeetCode cookies, credentials, API keys, or personal tokens
 * are used here.
 */
async function fetchProblem(problemNumber) {
  const url = `${API_BASE_URL}/${encodeURIComponent(problemNumber)}`;

  console.log(`Fetching problem #${problemNumber} from public problem API...`);

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    API_TIMEOUT_MS
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(
        `Problem API returned HTTP ${response.status}.`
      );
    }

    const contentLength = response.headers.get("content-length");

    if (
      contentLength &&
      Number(contentLength) > MAX_API_RESPONSE_BYTES
    ) {
      throw new Error("Problem API response is too large.");
    }

    const arrayBuffer = await response.arrayBuffer();

    if (arrayBuffer.byteLength > MAX_API_RESPONSE_BYTES) {
      throw new Error("Problem API response exceeded the size limit.");
    }

    const rawText = Buffer.from(arrayBuffer).toString("utf8");

    let data;

    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error("Problem API returned invalid JSON.");
    }

    if (!data || typeof data !== "object") {
      throw new Error("Problem API returned an invalid response.");
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        `Problem API request timed out after ${API_TIMEOUT_MS} ms.`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Recursively find solution files inside a problem directory.
 */
function findSolutionFiles(directory) {
  const results = [];

  function walk(currentDirectory) {
    const entries = fs.readdirSync(currentDirectory, {
      withFileTypes: true
    });

    for (const entry of entries) {
      const fullPath = path.join(currentDirectory, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const extension = path.extname(entry.name).toLowerCase();

      if (SOLUTION_EXTENSIONS.has(extension)) {
        results.push(fullPath);
      }
    }
  }

  walk(directory);

  return results.sort();
}

/**
 * Find problem directories affected by the current push.
 */
function getChangedProblemDirectories() {
  const beforeSha = process.env.BEFORE_SHA;
  const afterSha = process.env.AFTER_SHA;

  if (!isValidSha(afterSha)) {
    throw new Error("Invalid AFTER_SHA received from GitHub Actions.");
  }

  let changedFiles = [];

  if (isValidSha(beforeSha)) {
    const output = git([
      "diff",
      "--name-only",
      beforeSha,
      afterSha
    ]);

    changedFiles = output
      ? output.split("\n").filter(Boolean)
      : [];
  } else {
    /*
     * First push / unusual event.
     * Fall back to files tracked by git.
     */
    const output = git([
      "ls-files"
    ]);

    changedFiles = output
      ? output.split("\n").filter(Boolean)
      : [];
  }

  const problemDirectories = new Set();

  for (const file of changedFiles) {
    const extension = path.extname(file).toLowerCase();

    if (!SOLUTION_EXTENSIONS.has(extension)) {
      continue;
    }

    const parts = file.split("/");

    /*
     * A problem directory is expected to have a name such as:
     *
     * 3019. Number of Changing Keys
     *
     * Find the first path component matching that format.
     */
    for (let i = 0; i < parts.length - 1; i++) {
      const directoryName = parts[i];

      if (/^\d+\.\s+.+$/.test(directoryName)) {
        const directoryPath = parts
          .slice(0, i + 1)
          .join("/");

        problemDirectories.add(directoryPath);
        break;
      }
    }
  }

  return [...problemDirectories].sort();
}

/**
 * Extract problem number and title from the folder name.
 *
 * Example:
 *
 * 3019. Number of Changing Keys
 */
function parseProblemDirectory(directoryPath) {
  const directoryName = path.basename(directoryPath);

  const match = directoryName.match(
    /^(\d+)\.\s+(.+)$/
  );

  if (!match) {
    throw new Error(
      `Invalid LeetCode problem directory name: ${directoryName}`
    );
  }

  return {
    number: match[1],
    title: match[2].trim()
  };
}

/**
 * Generate README content.
 */
function createReadme({
  problemNumber,
  problemTitle,
  overview,
  examples,
  solutionFiles,
  leetCodeUrl
}) {
  let readme = `# ${problemNumber}. ${problemTitle}

## Problem Overview

${overview}

## Examples

`;

  for (const example of examples) {
    readme += `### Example ${example.number}

**Input:**
\`\`\`text
${example.input}
\`\`\`

**Output:**
\`\`\`text
${example.output}
\`\`\`
`;

    if (example.explanation) {
      readme += `
**Explanation:**

${example.explanation}
`;
    }

    readme += "\n";
  }

  readme += `## Solution

This directory contains my submitted solution for this problem.

`;

  for (const solutionFile of solutionFiles) {
    readme += `- \`${path.basename(solutionFile)}\`\n`;
  }

  readme += `
## LeetCode

[View Problem on LeetCode](${leetCodeUrl})
`;

  return readme;
}

/**
 * Process one problem directory.
 */
async function processProblemDirectory(directoryPath) {
  const {
    number: problemNumber,
    title: problemTitle
  } = parseProblemDirectory(directoryPath);

  console.log(
    `Looking up LeetCode problem #${problemNumber}...`
  );

  const readmePath = path.join(
    directoryPath,
    "README.md"
  );

  /*
   * Never modify an existing README.
   */
  if (fs.existsSync(readmePath)) {
    console.log(
      `README already exists for #${problemNumber}. Skipping.`
    );

    return null;
  }

  const solutionFiles = findSolutionFiles(directoryPath);

  if (solutionFiles.length === 0) {
    throw new Error(
      `No supported solution file found in ${directoryPath}.`
    );
  }

  const problem = await fetchProblem(problemNumber);

  /*
   * Validate the problem number returned by the API.
   */
  const apiProblemNumber = String(
    problem.questionFrontendId ?? ""
  ).trim();

  if (apiProblemNumber !== problemNumber) {
    throw new Error(
      `Problem number mismatch. Folder has #${problemNumber}, API returned #${apiProblemNumber}.`
    );
  }

  /*
   * Validate problem content.
   */
  if (
    typeof problem.content !== "string" ||
    problem.content.trim() === ""
  ) {
    throw new Error(
      `Problem #${problemNumber} has no valid content in API response.`
    );
  }

  /*
   * Validate the URL instead of trusting it blindly.
   */
  if (typeof problem.url !== "string") {
    throw new Error(
      `Problem #${problemNumber} has no valid URL in API response.`
    );
  }

  const leetCodeUrl = validateLeetCodeUrl(problem.url);

  /*
   * Generate overview.
   */
  const overview = createProblemOverview(
    problem.content
  );

  /*
   * Extract sample examples.
   */
  const examples = extractExamples(
    problem.content
  );

  console.log(
    `Found ${examples.length} example(s) for #${problemNumber}.`
  );

  /*
   * Create README only after all validation/extraction succeeds.
   */
  const readme = createReadme({
    problemNumber,
    problemTitle,
    overview,
    examples,
    solutionFiles,
    leetCodeUrl
  });

  fs.writeFileSync(
    readmePath,
    readme,
    "utf8"
  );

  GENERATED_READMES.push(readmePath);

  console.log(
    `Generated README for #${problemNumber}.`
  );

  return readmePath;
}

/**
 * Remove READMEs generated during this workflow run.
 *
 * This guarantees fail-closed behavior:
 * if one problem fails, we don't leave behind
 * partially generated README files.
 */
function cleanupGeneratedReadmes() {
  for (const readmePath of GENERATED_READMES) {
    try {
      if (fs.existsSync(readmePath)) {
        fs.unlinkSync(readmePath);

        console.log(
          `Removed generated README: ${readmePath}`
        );
      }
    } catch (error) {
      console.error(
        `Failed to remove ${readmePath}: ${error.message}`
      );
    }
  }
}

/**
 * Commit and push generated README files.
 */
function commitAndPush() {
  if (GENERATED_READMES.length === 0) {
    console.log("No new README files were generated.");
    return;
  }

  /*
   * Configure commit identity.
   *
   * This is only Git commit metadata.
   * It is NOT authentication.
   */
  git([
    "config",
    "user.name",
    "github-actions[bot]"
  ]);

  git([
    "config",
    "user.email",
    "41898282+github-actions[bot]@users.noreply.github.com"
  ]);

  /*
   * Stage ONLY the README files generated by this run.
   */
  for (const readmePath of GENERATED_READMES) {
    git([
      "add",
      "--",
      readmePath
    ]);
  }

  /*
   * Check whether anything is staged.
   */
  let stagedFiles = "";

  try {
    stagedFiles = git([
      "diff",
      "--cached",
      "--name-only"
    ]);
  } catch {
    stagedFiles = "";
  }

  if (!stagedFiles) {
    console.log("No staged changes to commit.");
    return;
  }

  git([
    "commit",
    "-m",
    "docs: generate LeetCode problem README"
  ]);

  /*
   * Authentication is provided by GitHub Actions' GITHUB_TOKEN
   * through the workflow environment.
   */
  git([
    "push",
    "origin",
    "HEAD"
  ]);

  console.log(
    "Generated README files committed and pushed successfully."
  );
}

/**
 * Main execution.
 */
async function main() {
  console.log(
    "Starting LeetCode README generation..."
  );

  const problemDirectories =
    getChangedProblemDirectories();

  console.log(
    `Detected ${problemDirectories.length} problem directory/directories.`
  );

  if (problemDirectories.length === 0) {
    console.log(
      "No changed LeetCode solution directories found."
    );

    return;
  }

  try {
    for (const directory of problemDirectories) {
      await processProblemDirectory(directory);
    }

    /*
     * Only commit after ALL problems have successfully processed.
     */
    commitAndPush();

    console.log(
      "LeetCode README generation completed successfully."
    );
  } catch (error) {
    console.error(
      "README generation failed."
    );

    console.error(error.message);

    /*
     * Fail closed.
     */
    cleanupGeneratedReadmes();

    throw error;
  }
}

main().catch(error => {
  console.error(
    `Workflow failed: ${error.message}`
  );

  process.exit(1);
});
