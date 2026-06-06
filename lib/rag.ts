import { db } from '@/lib/db';
import { contentChunks } from '@/lib/schema';
import { embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import * as cheerio from 'cheerio';
import { eq } from 'drizzle-orm';

function chunkText(text: string, maxTokens = 500) {
  const maxChars = maxTokens * 4;
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const word of words) {
    if ((currentChunk + ' ' + word).length > maxChars) {
      chunks.push(currentChunk.trim());
      currentChunk = word;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + word;
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

export async function indexDocumentForRag(options: {
  id: string;
  type: 'blog' | 'project';
  title: string;
  excerpt: string;
  content: string; // HTML or Text
  technologies?: string[];
}) {
  try {
    // 1. Delete existing chunks for this document
    await db.delete(contentChunks).where(eq(contentChunks.sourceId, options.id));

    // 2. Parse clean text
    const $ = cheerio.load(options.content);
    const plainText = $.text();

    // 3. Construct context
    let fullText = `${options.type === 'blog' ? 'Blog Title' : 'Project Title'}: ${options.title}\n`;
    if (options.technologies?.length) {
      fullText += `Technologies: ${options.technologies.join(', ')}\n`;
    }
    fullText += `Excerpt: ${options.excerpt}\n\nContent:\n${plainText}`;

    // 4. Chunk
    const chunks = chunkText(fullText);
    if (chunks.length === 0) return;

    // 5. Generate embeddings
    const { embeddings } = await embedMany({
      model: google.embedding('gemini-embedding-2'),
      values: chunks,
    });

    // 6. Insert new chunks
    for (let i = 0; i < chunks.length; i++) {
      await db.insert(contentChunks).values({
        sourceId: options.id,
        sourceType: options.type,
        chunkText: chunks[i],
        embedding: embeddings[i],
      });
    }

    console.log(`[RAG] Successfully indexed ${options.type} ${options.id} (${chunks.length} chunks)`);
  } catch (error) {
    console.error(`[RAG] Failed to index ${options.type} ${options.id}:`, error);
  }
}

export async function deleteDocumentFromRag(id: string) {
  try {
    await db.delete(contentChunks).where(eq(contentChunks.sourceId, id));
    console.log(`[RAG] Successfully deleted chunks for document ${id}`);
  } catch (error) {
    console.error(`[RAG] Failed to delete chunks for document ${id}:`, error);
  }
}
