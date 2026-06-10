import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const isSecurityEnabled = process.env.AI_SECURITY === 'true';
const aiLimit = parseInt(process.env.AI_LIMIT || '5', 10);

const redis = Redis.fromEnv();
const ratelimit = isSecurityEnabled ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(aiLimit, "1 d"),
}) : null;

export const staticChatResponse = (message: string) => {
  return new Response(JSON.stringify({ error: message }), {
    status: 429,
    headers: { 'Content-Type': 'application/json' }
  });
};

export async function runSecurityChecks(req: Request) {
  let ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  const visitorId = req.headers.get('x-visitor-id');

  if (!visitorId) {
    return { errorResponse: new Response(JSON.stringify({ error: 'Missing visitor ID. Please enable JavaScript or refresh.' }), { status: 400 }) };
  }

  // 1. IPinfo VPN/Proxy Check
  if (isSecurityEnabled && ip && ip !== '127.0.0.1' && ip !== '::1') {
    try {
      const ipinfoRes = await fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_API}`);
      if (ipinfoRes.ok) {
        const ipData = await ipinfoRes.json();
        if (ipData.privacy && (ipData.privacy.vpn || ipData.privacy.proxy || ipData.privacy.tor || ipData.privacy.hosting)) {
          return { errorResponse: staticChatResponse("Hey there! I noticed you're using a VPN or Proxy. To prevent abuse, I'm only allowed to chat with direct connections. Please disable it to continue chatting!") };
        }
      }
    } catch (e) {
      console.error("IPinfo fetch error:", e);
    }
  }

  if (isSecurityEnabled && ratelimit) {
    // 2. Rate limiting by IP
    const ipLimit = await ratelimit.limit(`chat_ip_${ip}`);
    if (!ipLimit.success) {
      return { errorResponse: staticChatResponse(`Whoa, slow down there! You've reached your limit of ${aiLimit} questions for today. I'm taking a little nap. Come back tomorrow and we can chat some more!`) };
    }

    // 3. Rate limiting by Visitor ID
    const visitorLimit = await ratelimit.limit(`chat_visitor_${visitorId}`);
    if (!visitorLimit.success) {
      return { errorResponse: staticChatResponse(`Whoa, slow down there! You've reached your limit of ${aiLimit} questions for today. I'm taking a little nap. Come back tomorrow and we can chat some more!`) };
    }
  }

  return { errorResponse: null };
}
