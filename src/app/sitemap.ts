import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://scrizians.com';
  const currentDate = new Date().toISOString();

  const routes = [
    '',
    '/hire-talent',
    '/talent',
    '/solutions',
    '/technologies',
    '/case-studies',
    '/jobs',
    '/insights',
    '/portfolio',
    '/about',
    '/contact',
    '/become-a-scrizian',
    '/write-for-scrizians',
    '/policies/privacy',
    '/policies/terms',
    '/policies/talent-terms',
    '/policies/client-terms',
    '/policies/contributor-policy',
    '/policies/portfolio-policy',
    '/policies/cookie-policy',
    '/policies/acceptable-use',
    '/policies/refund-policy',
    '/policies/disclaimer',
    '/policies/grievance',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
