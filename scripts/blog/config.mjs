import { requireEnv } from "./utils.mjs";

const rawSiteUrl = process.env.SITE_URL || process.env.NEXTAUTH_URL;
if (!rawSiteUrl) {
  console.error(`Missing required env var: SITE_URL or NEXTAUTH_URL`);
  process.exit(1);
}

export const SITE_URL = rawSiteUrl.replace(/\/$/, "");
export const GROQ_API_KEY = requireEnv("GROQ_API_KEY");
export const AUTOMATION_TOKEN = requireEnv("BLOG_AUTOMATION_TOKEN");
export const AUTO_PUBLISH = (process.env.AUTO_PUBLISH ?? "true").toLowerCase() !== "false";
export const ENABLE_BLOG_AUTOMATION = process.env.ENABLE_BLOG_AUTOMATION === "true";
export const MIN_WORD_COUNT = Number(process.env.MIN_WORD_COUNT ?? 350);
