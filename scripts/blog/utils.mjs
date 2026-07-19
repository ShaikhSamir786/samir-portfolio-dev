/**
 * Validates that a required environment variable exists.
 * Exits the process immediately if the variable is missing.
 * @param {string} name - The environment variable name to check
 * @returns {string} The value of the environment variable
 */
export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

/**
 * Converts a string into a URL-safe slug.
 * - Lowercases and trims whitespace
 * - Replaces non-alphanumeric characters with hyphens
 * - Removes leading/trailing hyphens
 * - Truncates to 80 characters max
 * @param {string} text - The text to slugify
 * @returns {string} URL-safe slug
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
