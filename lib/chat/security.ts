// --- Constants ---
const WINDOW_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

const aiLimit = Number.isFinite(parseInt(process.env.AI_LIMIT || '', 10))
  ? parseInt(process.env.AI_LIMIT!, 10)
  : 5;

const isSecurityEnabled = process.env.AI_SECURITY === 'true';

// --- In-memory rate limiter ---
// NOTE: This does NOT persist across serverless cold starts or multiple Vercel
// function instances. Traffic spread across instances gets independent buckets.
// Good enough for casual abuse prevention; move to Redis for real production use.
interface RateLimitInfo {
  count: number;
  resetAt: number;
}
const rateLimits = new Map<string, RateLimitInfo>();

// Periodic cleanup to prevent unbounded growth from unique visitors
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // hourly
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, info] of rateLimits) {
      if (now > info.resetAt) rateLimits.delete(key);
    }
  }, CLEANUP_INTERVAL_MS);
}

const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const info = rateLimits.get(key);
  if (!info || now > info.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (info.count >= limit) {
    return false;
  }
  info.count += 1;
  return true;
};

// --- Response helpers ---
export const staticChatResponse = (message: string, status: 429 | 403 = 429) => {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

// --- Main security pipeline ---
export async function runSecurityChecks(req: Request) {
  // NOTE: On Vercel, x-forwarded-for is set by their edge proxy — the leftmost
  // value is the original client IP. This assumption breaks if deployed elsewhere
  // without a trusted proxy in front.
  let ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  // NOTE: x-visitor-id is client-supplied (FingerprintJS in the browser). It
  // prevents casual limit-resetting but is not tamper-proof — a motivated user
  // can rotate it freely. The IP-based limit below is the stronger backstop.
  // A signed httpOnly cookie would be needed for real tamper resistance.
  const visitorId = req.headers.get('x-visitor-id');

  if (!visitorId) {
    return {
      errorResponse: new Response(
        JSON.stringify({ error: 'Missing visitor ID. Please enable JavaScript or refresh.' }),
        { status: 400 }
      ),
    };
  }

  // --- 1. VPN / Proxy check (fail open) ---
  // If IPinfo is unreachable or quota-exhausted, we allow the request through
  // rather than blocking all chat. Availability > strictness here.
  if (isSecurityEnabled && ip && ip !== '127.0.0.1' && ip !== '::1') {
    try {
      const ipinfoRes = await fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_API}`, {
        signal: AbortSignal.timeout(2000),
      });
      if (ipinfoRes.ok) {
        const ipData = await ipinfoRes.json();
        if (ipData.privacy && (ipData.privacy.vpn || ipData.privacy.proxy || ipData.privacy.tor || ipData.privacy.hosting)) {
          return {
            errorResponse: staticChatResponse(
              "Hey there! I noticed you're using a VPN or Proxy. To prevent abuse, I'm only allowed to chat with direct connections. Please disable it to continue chatting!",
              403
            ),
          };
        }
      }
    } catch (e) {
      // Fail open — IPinfo error means we skip the VPN check, not block the user.
      console.error("IPinfo fetch error:", e);
    }
  }

  // --- 2. Rate limiting (in-memory, per IP + per visitor) ---
  if (isSecurityEnabled) {
    const ipKey = `chat_ip:${ip}`;
    const visitorKey = `chat_visitor:${visitorId}`;

    if (!checkRateLimit(ipKey, aiLimit, WINDOW_MS)) {
      return {
        errorResponse: staticChatResponse(
          `Whoa, slow down there! You've reached your limit of ${aiLimit} questions for today. I'm taking a little nap. Come back tomorrow and we can chat some more!`
        ),
      };
    }

    if (!checkRateLimit(visitorKey, aiLimit, WINDOW_MS)) {
      return {
        errorResponse: staticChatResponse(
          `Whoa, slow down there! You've reached your limit of ${aiLimit} questions for today. I'm taking a little nap. Come back tomorrow and we can chat some more!`
        ),
      };
    }
  }

  return { errorResponse: null };
}
