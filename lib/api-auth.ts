import { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";
import { auth } from "@/lib/auth";

/**
 * Constant-time string comparison to avoid leaking token length/prefix
 * via response-time side channels.
 */
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Authorizes write-access API routes that need to be callable both from the
 * logged-in admin panel AND from unattended automation (e.g. the GitHub
 * Actions blog-generation workflow, which has no browser session).
 *
 * Accepts EITHER:
 *   1. A valid NextAuth admin session (cookie-based, used by the admin UI), or
 *   2. `Authorization: Bearer <BLOG_AUTOMATION_TOKEN>` (used by server-to-server
 *      callers like scripts/generate-blog.mjs)
 *
 * Do not reuse this for routes that should only ever accept a human session
 * (e.g. account settings) — only for automation-eligible write endpoints.
 */
export async function isAuthorized(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  const token = process.env.BLOG_AUTOMATION_TOKEN;
  const isAutomationEnabled = process.env.ENABLE_BLOG_AUTOMATION === "true";

  if (isAutomationEnabled && authHeader?.startsWith("Bearer ") && token) {
    const provided = authHeader.slice("Bearer ".length).trim();
    if (provided.length > 0 && safeCompare(provided, token)) {
      return true;
    }
  }

  const session = await auth();
  return !!session;
}
