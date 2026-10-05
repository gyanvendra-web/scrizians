import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control Panel & Dashboards | Scrizians',
  description: 'Manage hiring requirements, candidate applications, talent rosters, technical articles, and staff ops via Scrizians.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Control Panel & Dashboards | Scrizians',
    description: 'Manage hiring requirements, candidate applications, talent rosters, technical articles, and staff ops via Scrizians.',
    url: 'https://scrizians.com/dashboard',
    siteName: 'Scrizians',
    type: 'website',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
