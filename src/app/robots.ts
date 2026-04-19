import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://mountainretreatrealty.com'
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/account/', '/api/'] },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
