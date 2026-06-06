import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogs, projects, contentChunks } from '@/lib/schema';
import { embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import * as cheerio from 'cheerio';
import { eq } from 'drizzle-orm';

// A simple text chunker: splits by words to approximate ~500 tokens
function chunkText(text: string, maxTokens = 500) {
    // 1 token is roughly 4 characters in English
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

export async function GET() {
    try {
        const allBlogs = await db.select().from(blogs);
        const allProjects = await db.select().from(projects);

        let totalChunks = 0;

        // --- Process Blogs ---
        for (const blog of allBlogs) {
            // Remove old chunks if they exist to prevent duplicates
            await db.delete(contentChunks).where(eq(contentChunks.sourceId, blog.id));

            // Extract plain text from TipTap HTML
            const $ = cheerio.load(blog.content);
            const plainText = $.text();

            // Build the context string
            const fullText = `Blog Title: ${blog.title}\nExcerpt: ${blog.excerpt}\n\nContent:\n${plainText}`;

            const chunks = chunkText(fullText);
            if (chunks.length === 0) continue;

            // Generate Gemini embeddings for all chunks in one API call
            const { embeddings } = await embedMany({
                model: google.textEmbeddingModel('gemini-embedding-2'),
                values: chunks,
            });

            // Insert into neon DB
            for (let i = 0; i < chunks.length; i++) {
                await db.insert(contentChunks).values({
                    sourceId: blog.id,
                    sourceType: 'blog',
                    chunkText: chunks[i],
                    embedding: embeddings[i], // The 768-dimensional vector
                });
                totalChunks++;
            }
        }

        // --- Process Projects ---
        for (const project of allProjects) {
            await db.delete(contentChunks).where(eq(contentChunks.sourceId, project.id));

            const $ = cheerio.load(project.content);
            const plainText = $.text();

            const techStr = project.technologies?.join(', ') || '';
            const fullText = `Project Title: ${project.title}\nTechnologies: ${techStr}\nExcerpt: ${project.excerpt}\n\nContent:\n${plainText}`;

            const chunks = chunkText(fullText);
            if (chunks.length === 0) continue;

            const { embeddings } = await embedMany({
                model: google.textEmbeddingModel('gemini-embedding-2'),
                values: chunks,
            });

            for (let i = 0; i < chunks.length; i++) {
                await db.insert(contentChunks).values({
                    sourceId: project.id,
                    sourceType: 'project',
                    chunkText: chunks[i],
                    embedding: embeddings[i],
                });
                totalChunks++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully generated and stored ${totalChunks} embedded chunks from ${allBlogs.length} blogs and ${allProjects.length} projects.`
        });
    } catch (error) {
        console.error("Error generating embeddings:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
