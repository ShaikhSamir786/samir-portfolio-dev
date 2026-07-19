import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from '@/lib/db';
import { contentChunks, blogs, projects } from '@/lib/schema';
import { cosineDistance, inArray } from 'drizzle-orm';
import { getRecentGithubEvents } from '@/lib/github';

const MAX_DISTANCE = 0.5;

const GITHUB_INTENT_RE =
  /\b(github|commit[s]?|repo(?:s|sitory|sitories)?|pull\s*request|pr\b|issue[s]?|push(?:ed)?|open\s*source|contribut(?:e|ion|ed|ing)|star(?:red)?|fork(?:ed)?|activity|recent|latest|working\s*on|coding|develop(?:ing|ed)?)\b/i;

function isGithubRelevant(text: string): boolean {
  return GITHUB_INTENT_RE.test(text);
}

let githubEventsCache: { ok: true; data: string } | null = null;
let githubEventsCacheExpiry = 0;
const GITHUB_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function getGithubEventsCached(): Promise<string | null> {
  const now = Date.now();
  if (githubEventsCache && now < githubEventsCacheExpiry) {
    return githubEventsCache.data;
  }
  const result = await getRecentGithubEvents(
    process.env.GITHUB_TOKEN || '',
    'ShaikhSamir786'
  );
  if (result.ok) {
    githubEventsCache = result;
    githubEventsCacheExpiry = now + GITHUB_CACHE_TTL_MS;
    return result.data;
  }
  return null;
}

export async function getRelevantContext(messages: string[]): Promise<string> {
  try {
    // Embed last 2-3 messages joined for better follow-up understanding
    const embedWindow = messages.slice(-3).join(' ');

    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-2'),
      value: embedWindow,
    });

    const relevantChunks = await db
      .select({
        sourceId: contentChunks.sourceId,
        text: contentChunks.chunkText,
        sourceType: contentChunks.sourceType,
        distance: cosineDistance(contentChunks.embedding, embedding),
      })
      .from(contentChunks)
      .orderBy(cosineDistance(contentChunks.embedding, embedding))
      .limit(4);

    const filteredChunks = relevantChunks.filter((c) => (c.distance as number) <= MAX_DISTANCE);
    if (filteredChunks.length === 0) return '';

    // Fetch metadata for blogs and projects
    const blogIds = filteredChunks
      .filter((c) => c.sourceType === 'blog')
      .map((c) => c.sourceId);
    const projectIds = filteredChunks
      .filter((c) => c.sourceType === 'project')
      .map((c) => c.sourceId);

    const [blogsData, projectsData] = await Promise.all([
      blogIds.length
        ? db
            .select({ id: blogs.id, slug: blogs.slug, title: blogs.title })
            .from(blogs)
            .where(inArray(blogs.id, blogIds))
        : Promise.resolve([]),
      projectIds.length
        ? db
            .select({ id: projects.id, slug: projects.slug, title: projects.title })
            .from(projects)
            .where(inArray(projects.id, projectIds))
        : Promise.resolve([]),
    ]);

    const urlMap = new Map<string, string>();
    const titleMap = new Map<string, string>();

    blogsData.forEach((b) => {
      urlMap.set(b.id, `/blogs/${b.slug}`);
      titleMap.set(b.id, b.title);
    });

    projectsData.forEach((p) => {
      urlMap.set(p.id, `/projects/${p.slug}`);
      titleMap.set(p.id, p.title);
    });

    // Build context with proper titles for all source types
    let contextText = filteredChunks
      .map((chunk, i) => {
        const exactUrl = urlMap.get(chunk.sourceId);
        const exactTitle = titleMap.get(chunk.sourceId);

        let header = `--- Context ${i + 1} (${chunk.sourceType}) ---`;
        if (exactTitle) header += `\nExact Title: ${exactTitle}`;
        if (exactUrl) header += `\nURL: ${exactUrl}`;
        if (chunk.sourceType === 'about' && !exactTitle)
          header += `\nExact Title: About Samir`;
        if (chunk.sourceType === 'experience' && !exactTitle)
          header += `\nExact Title: Work Experience`;

        return `${header}\n${chunk.text}`;
      })
      .join('\n\n');

    // Only fetch GitHub activity if the message is plausibly about it
    const latestMessage = messages[messages.length - 1] || '';
    if (isGithubRelevant(latestMessage)) {
      const githubEvents = await getGithubEventsCached();
      if (githubEvents) {
        contextText += `\n\n--- Context ${filteredChunks.length + 1} (github_activity) ---\n${githubEvents}`;
      }
    }

    return contextText;
  } catch (error) {
    console.error('[RAG] Failed to retrieve context:', error);
    return '';
  }
}