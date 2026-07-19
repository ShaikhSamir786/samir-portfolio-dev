import { db } from '@/lib/db';
import { contentChunks, about, experiences as experiencesSchema } from '@/lib/schema';
import { embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import * as cheerio from 'cheerio';
import { eq } from 'drizzle-orm';

export const ABOUT_UUID = '00000000-0000-0000-0000-000000000001';

const EMBED_BATCH_SIZE = 100;

async function embedInBatches(chunks: string[]): Promise<number[][]> {
  const allEmbeddings: number[][] = [];
  for (let i = 0; i < chunks.length; i += EMBED_BATCH_SIZE) {
    const batch = chunks.slice(i, i + EMBED_BATCH_SIZE);
    const { embeddings } = await embedMany({
      model: google.embedding('gemini-embedding-2'),
      values: batch,
    });
    allEmbeddings.push(...embeddings);
  }
  return allEmbeddings;
}

function chunkText(text: string, maxTokens = 500, overlapTokens = 50) {
  const maxChars = maxTokens * 4;
  const overlapChars = overlapTokens * 4;

  // Prefer paragraph-level splitting first
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    // Single paragraph already exceeds max — fall back to word-split with overlap
    if (para.length > maxChars) {
      if (current) {
        chunks.push(current.trim());
        current = '';
      }
      const words = para.split(/\s+/);
      let buffer = '';
      for (const word of words) {
        if ((buffer + ' ' + word).length > maxChars && buffer) {
          chunks.push(buffer.trim());
          buffer = buffer.slice(-overlapChars) + ' ' + word;
        } else {
          buffer += (buffer ? ' ' : '') + word;
        }
      }
      if (buffer) chunks.push(buffer.trim());
      continue;
    }

    if ((current + '\n\n' + para).length > maxChars && current) {
      chunks.push(current.trim());
      current = current.slice(-overlapChars) + '\n\n' + para;
    } else {
      current += (current ? '\n\n' : '') + para;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

function htmlToPlainText(html: string) {
  const $ = cheerio.load(html);
  $('h1, h2, h3, h4, h5, h6, p, li, br').after('\n');
  return $.text().replace(/\n{3,}/g, '\n\n').trim();
}

interface RagResult {
  success: boolean;
  chunks?: number;
  error?: string;
}

export async function indexDocumentForRag(options: {
  id: string;
  type: 'blog' | 'project';
  title: string;
  excerpt: string;
  content: string; // HTML or Text
  technologies?: string[];
}): Promise<RagResult> {
  try {
    const plainText = htmlToPlainText(options.content);

    let fullText = `${options.type === 'blog' ? 'Blog Title' : 'Project Title'}: ${options.title}\n`;
    if (options.technologies?.length) {
      fullText += `Technologies: ${options.technologies.join(', ')}\n`;
    }
    fullText += `Excerpt: ${options.excerpt}\n\nContent:\n${plainText}`;

    const chunks = chunkText(fullText);
    if (chunks.length === 0) {
      await db.delete(contentChunks).where(eq(contentChunks.sourceId, options.id));
      return { success: true, chunks: 0 };
    }

    const embeddings = await embedInBatches(chunks);

    await db.transaction(async (tx) => {
      await tx.delete(contentChunks).where(eq(contentChunks.sourceId, options.id));
      await tx.insert(contentChunks).values(
        chunks.map((chunk, i) => ({
          sourceId: options.id,
          sourceType: options.type,
          chunkText: chunk,
          embedding: embeddings[i],
        }))
      );
    });

    console.log(`[RAG] Successfully indexed ${options.type} ${options.id} (${chunks.length} chunks)`);
    return { success: true, chunks: chunks.length };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[RAG] Failed to index ${options.type} ${options.id}:`, error);
    return { success: false, error: msg };
  }
}

export async function deleteDocumentFromRag(id: string): Promise<RagResult> {
  try {
    await db.delete(contentChunks).where(eq(contentChunks.sourceId, id));
    console.log(`[RAG] Successfully deleted chunks for document ${id}`);
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[RAG] Failed to delete chunks for document ${id}:`, error);
    return { success: false, error: msg };
  }
}

export async function reindexAboutForRag(): Promise<RagResult> {
  try {
    const aboutData = await db.select().from(about);

    if (aboutData.length === 0) {
      await db.delete(contentChunks).where(eq(contentChunks.sourceId, ABOUT_UUID));
      return { success: true, chunks: 0 };
    }

    const row = aboutData[0];
    const sections: string[] = [];
    if (row.description) sections.push(`Past:\n${row.description}`);
    if (row.present) sections.push(`Present:\n${row.present}`);
    if (row.future) sections.push(`Future:\n${row.future}`);

    if (sections.length === 0) {
      await db.delete(contentChunks).where(eq(contentChunks.sourceId, ABOUT_UUID));
      return { success: true, chunks: 0 };
    }

    const fullText = `About Samir:\n${sections.join('\n\n')}`;
    const chunks = chunkText(fullText);

    if (chunks.length === 0) {
      await db.delete(contentChunks).where(eq(contentChunks.sourceId, ABOUT_UUID));
      return { success: true, chunks: 0 };
    }

    const embeddings = await embedInBatches(chunks);

    await db.transaction(async (tx) => {
      await tx.delete(contentChunks).where(eq(contentChunks.sourceId, ABOUT_UUID));
      await tx.insert(contentChunks).values(
        chunks.map((chunk, i) => ({
          sourceId: ABOUT_UUID,
          sourceType: 'about',
          chunkText: chunk,
          embedding: embeddings[i],
        }))
      );
    });

    console.log(`[RAG] Successfully reindexed about section`);
    return { success: true, chunks: chunks.length };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[RAG] Failed to reindex about section:`, error);
    return { success: false, error: msg };
  }
}

export async function reindexExperiencesForRag(): Promise<RagResult> {
  try {
    const allExperiences = await db.select().from(experiencesSchema);

    // Build all chunks first, then embed in one batch
    const allChunks: { expId: string; chunk: string }[] = [];

    for (const exp of allExperiences) {
      const fullText = `Work Experience:\nPosition: ${exp.position}\nCompany: ${exp.companyName}\nDuration: ${exp.startDate} to ${exp.isCurrent ? 'Present' : (exp.endDate || 'Unknown')}\nDescription: ${exp.description || ''}`;
      const chunks = chunkText(fullText);
      for (const chunk of chunks) {
        allChunks.push({ expId: exp.id, chunk });
      }
    }

    if (allChunks.length === 0) {
      await db.delete(contentChunks).where(eq(contentChunks.sourceType, 'experience'));
      return { success: true, chunks: 0 };
    }

    const allEmbeddings = await embedInBatches(allChunks.map((c) => c.chunk));

    await db.transaction(async (tx) => {
      await tx.delete(contentChunks).where(eq(contentChunks.sourceType, 'experience'));
      await tx.insert(contentChunks).values(
        allChunks.map((c, i) => ({
          sourceId: c.expId,
          sourceType: 'experience',
          chunkText: c.chunk,
          embedding: allEmbeddings[i],
        }))
      );
    });

    console.log(`[RAG] Successfully reindexed ${allExperiences.length} experiences`);
    return { success: true, chunks: allChunks.length };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[RAG] Failed to reindex experiences:`, error);
    return { success: false, error: msg };
  }
}
