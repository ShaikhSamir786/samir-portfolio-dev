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
    
    await db.update(blogs)
      .set({ stars: sql`${blogs.stars} + 1` })
      .where(eq(blogs.slug, slug));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Star error:', error);
    return NextResponse.json({ error: 'Failed to add star' }, { status: 500 });
  }
}
