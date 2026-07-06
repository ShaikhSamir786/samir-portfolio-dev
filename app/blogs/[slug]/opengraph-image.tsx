import { ImageResponse } from 'next/og';
import { db } from "@/lib/db";
import { blogs as blogsSchema } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export const runtime = 'nodejs';
export const alt = 'Blog post by Samir Shaikh';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;

  let title = 'Blog | Samir Shaikh';
  let excerpt = 'Technical articles on backend engineering, AI, and system design.';

  try {
    const result = await db
      .select({ title: blogsSchema.title, excerpt: blogsSchema.excerpt })
      .from(blogsSchema)
      .where(and(eq(blogsSchema.slug, slug), eq(blogsSchema.isPublished, true)))
      .limit(1);

    if (result[0]) {
      title = result[0].title;
      excerpt = result[0].excerpt || excerpt;
    }
  } catch {
    // fallback to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '64px',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #1a1a1a 100%)',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Subtle grid/noise texture via pseudo-lines */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 20% 20%, rgba(120,80,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(60,180,255,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Top branding bar */}
        <div
          style={{
            position: 'absolute',
            top: '48px',
            left: '64px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Samir Shaikh
          </div>
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>·</div>
          <div
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.06em',
            }}
          >
            Blog
          </div>
        </div>

        {/* Accent line */}
        <div
          style={{
            width: '48px',
            height: '3px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #7c4fff, #3bb4ff)',
            marginBottom: '24px',
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: '52px',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.15',
            letterSpacing: '-0.02em',
            maxWidth: '900px',
            marginBottom: '20px',
          }}
        >
          {title.length > 70 ? title.slice(0, 70) + '…' : title}
        </div>

        {/* Excerpt */}
        {excerpt && (
          <div
            style={{
              fontSize: '22px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: '1.5',
              maxWidth: '800px',
            }}
          >
            {excerpt.length > 120 ? excerpt.slice(0, 120) + '…' : excerpt}
          </div>
        )}

        {/* Bottom domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '64px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.04em',
          }}
        >
          samir-portfolio-dev.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
