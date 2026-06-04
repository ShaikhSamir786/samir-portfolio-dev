import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogs } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slug } = await params;
    const body = await req.json();
    const { name, comment } = body;

    // Server-side validation to prevent abuse and crashes
    if (!name || typeof name !== 'string' || name.length > 50) {
      return NextResponse.json({ error: 'Invalid name. Must be 1-50 characters.' }, { status: 400 });
    }
    
    if (!comment || typeof comment !== 'string' || comment.length > 1000) {
      return NextResponse.json({ error: 'Invalid comment. Must be 1-1000 characters.' }, { status: 400 });
    }

    const newComment = {
      name: name.trim(),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    // Append to jsonb array using coalesce to handle nulls
    await db.update(blogs)
      .set({ 
        comments: sql`coalesce(${blogs.comments}, '[]'::jsonb) || ${JSON.stringify([newComment])}::jsonb` 
      })
      .where(eq(blogs.slug, slug));
    
    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Comment error:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
