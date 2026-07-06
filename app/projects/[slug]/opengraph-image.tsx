import { ImageResponse } from 'next/og';
import { db } from "@/lib/db";
import { projects as projectsSchema } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export const runtime = 'nodejs';
export const alt = 'Project by Samir Shaikh';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;

  let title = 'Project | Samir Shaikh';
  let excerpt = 'Backend engineering and AI projects by Samir Shaikh.';
  let technologies: string[] = [];

  try {
    const result = await db
      .select({ title: projectsSchema.title, excerpt: projectsSchema.excerpt, technologies: projectsSchema.technologies })
      .from(projectsSchema)
      .where(and(eq(projectsSchema.slug, slug), eq(projectsSchema.isPublished, true)))
      .limit(1);

    if (result[0]) {
      title = result[0].title;
      excerpt = result[0].excerpt || excerpt;
      technologies = (result[0].technologies as string[] | null) ?? [];
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
        {/* Gradient overlay spots */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 15% 25%, rgba(80,200,120,0.1) 0%, transparent 55%), radial-gradient(ellipse at 85% 75%, rgba(120,80,255,0.1) 0%, transparent 55%)',
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
            Projects
          </div>
        </div>

        {/* Tech badges */}
        {technologies.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}
          >
            {technologies.slice(0, 5).map((tech) => (
              <div
                key={tech}
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.6)',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        )}

        {/* Accent line */}
        <div
          style={{
            width: '48px',
            height: '3px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #50c878, #7c4fff)',
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
