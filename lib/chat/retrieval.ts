import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from '@/lib/db';
import { contentChunks, blogs, projects } from '@/lib/schema';
import { cosineDistance, inArray } from 'drizzle-orm';
import { getRecentGithubEvents } from '@/lib/github';

export async function getRelevantContext(latestMessageText: string) {
  // 1. Embed the user's latest message
  const { embedding } = await embed({
    model: google.embedding('gemini-embedding-2'),
    value: latestMessageText,
  });

  // 2. Perform Vector Similarity Search
  const relevantChunks = await db
    .select({
      sourceId: contentChunks.sourceId,
      text: contentChunks.chunkText,
      sourceType: contentChunks.sourceType,
    })
    .from(contentChunks)
    .orderBy(cosineDistance(contentChunks.embedding, embedding))
    .limit(4);

  // Fetch exact slugs to prevent hallucinated URLs
  const blogIds = relevantChunks.filter(c => c.sourceType === 'blog').map(c => c.sourceId);
  const projectIds = relevantChunks.filter(c => c.sourceType === 'project').map(c => c.sourceId);

  // Fetch titles as well to prevent hallucinated names
  const [blogsData, projectsData, githubEvents] = await Promise.all([
    blogIds.length ? db.select({ id: blogs.id, slug: blogs.slug, title: blogs.title }).from(blogs).where(inArray(blogs.id, blogIds)) : Promise.resolve([]),
    projectIds.length ? db.select({ id: projects.id, slug: projects.slug, title: projects.title }).from(projects).where(inArray(projects.id, projectIds)) : Promise.resolve([]),
    getRecentGithubEvents(process.env.GITHUB_TOKEN || '', 'Shreyash0712')
  ]);

  const urlMap = new Map();
  const titleMap = new Map();
  
  blogsData.forEach(b => {
    urlMap.set(b.id, `/blogs/${b.slug}`);
    titleMap.set(b.id, b.title);
  });
  
  projectsData.forEach(p => {
    urlMap.set(p.id, `/projects/${p.slug}`);
    titleMap.set(p.id, p.title);
  });

  // 3. Construct the context
  let contextText = relevantChunks
    .map((chunk, i) => {
      const exactUrl = urlMap.get(chunk.sourceId) || '';
      const exactTitle = titleMap.get(chunk.sourceId) || '';
      
      let header = `--- Context ${i + 1} (${chunk.sourceType}) ---`;
      if (exactTitle) header += `\nExact Title: ${exactTitle}`;
      if (exactUrl) header += `\nURL: ${exactUrl}`;
      
      return `${header}\n${chunk.text}`;
    })
    .join('\n\n');

  if (githubEvents && githubEvents !== "GitHub token missing." && githubEvents !== "Failed to fetch GitHub activity." && githubEvents !== "No recent GitHub activity available.") {
    contextText += `\n\n--- Context ${relevantChunks.length + 1} (github_activity) ---\n${githubEvents}`;
  }

  return contextText;
}
