import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { blogs, projects, contentChunks, about, experiences } from '@/lib/schema';
import { embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import * as cheerio from 'cheerio';
import { eq } from 'drizzle-orm';

// A static UUID for the "about" section since it doesn't have an ID in the schema
const ABOUT_UUID = '00000000-0000-0000-0000-000000000001';

// A simple text chunker: splits by words to approximate ~500 tokens
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

export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const allBlogs = await db.select().from(blogs);
        const allProjects = await db.select().from(projects);
        const allExperiences = await db.select().from(experiences);
        const aboutData = await db.select().from(about);

        let totalChunks = 0;

        // --- Process Blogs ---
        for (const blog of allBlogs) {
            await db.delete(contentChunks).where(eq(contentChunks.sourceId, blog.id));

            const $ = cheerio.load(blog.content);
            const plainText = $.text();
            const fullText = `Blog Title: ${blog.title}\nExcerpt: ${blog.excerpt}\n\nContent:\n${plainText}`;

            const chunks = chunkText(fullText);
            if (chunks.length === 0) continue;

            const { embeddings } = await embedMany({
                model: google.embedding('gemini-embedding-2'),
                values: chunks,
            });

            for (let i = 0; i < chunks.length; i++) {
                await db.insert(contentChunks).values({
                    sourceId: blog.id,
                    sourceType: 'blog',
                    chunkText: chunks[i],
                    embedding: embeddings[i],
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
                model: google.embedding('gemini-embedding-2'),
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

        // --- Process Work Experiences ---
        for (const exp of allExperiences) {
            await db.delete(contentChunks).where(eq(contentChunks.sourceId, exp.id));

            const fullText = `Work Experience:\nPosition: ${exp.position}\nCompany: ${exp.companyName}\nDuration: ${exp.startDate} to ${exp.isCurrent ? 'Present' : (exp.endDate || 'Unknown')}\nDescription: ${exp.description || ''}`;

            const chunks = chunkText(fullText);
            if (chunks.length === 0) continue;

            const { embeddings } = await embedMany({
                model: google.embedding('gemini-embedding-2'),
                values: chunks,
            });

            for (let i = 0; i < chunks.length; i++) {
                await db.insert(contentChunks).values({
                    sourceId: exp.id,
                    sourceType: 'experience',
                    chunkText: chunks[i],
                    embedding: embeddings[i],
                });
                totalChunks++;
            }
        }

        // --- Process About Section ---
        if (aboutData.length > 0 && aboutData[0].description) {
            await db.delete(contentChunks).where(eq(contentChunks.sourceId, ABOUT_UUID));

            const fullText = `About Samir:\n${aboutData[0].description}`;

            const chunks = chunkText(fullText);
            if (chunks.length > 0) {
                const { embeddings } = await embedMany({
                    model: google.embedding('gemini-embedding-2'),
                    values: chunks,
                });

                for (let i = 0; i < chunks.length; i++) {
                    await db.insert(contentChunks).values({
                        sourceId: ABOUT_UUID,
                        sourceType: 'about',
                        chunkText: chunks[i],
                        embedding: embeddings[i],
                    });
                    totalChunks++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully generated and stored ${totalChunks} embedded chunks from blogs, projects, work experiences, and about page.`
        });
    } catch (error) {
        console.error("Error generating embeddings:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
