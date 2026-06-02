import { MetadataRoute } from 'next';

const APP_URL = process.env.NEXTAUTH_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
