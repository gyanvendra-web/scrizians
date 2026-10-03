/**
 * Scrizians Real-Time Data Sync Engine
 * Canonical dataset, version control migration, and synchronization layer connecting website forms, public pages, Admin CRM, and Contributor portals.
 */

import { addNotification } from './notificationSync';

const CURRENT_DATA_VERSION = 'scrizians_v4_unified_2026';

export const initialLeadsList = [
  {
    _id: 'lead-101',
    name: 'Michael R. (VP Engineering)',
    email: 'm.ross@techus.com',
    phone: '+1 (555) 234-5678',
    company: 'CloudScale Inc (USA)',
    serviceRequested: 'Dedicated Developer / Staff Augmentation',
    scrizianIdReferenced: 'SCR-8841',
    stage: 'Requirement Confirmed',
    message: 'Looking for 2 Senior Next.js & Node.js architects for 6-month contract with 4-hour EST overlap.',
    createdAt: '2026-10-02'
  },
  {
    _id: 'lead-102',
    name: 'David K. (CTO)',
    email: 'david@fintechglobal.uk',
    phone: '+44 20 7946 0912',
    company: 'Fintech Systems (UK)',
    serviceRequested: 'Interview Scrizian Talent',
    scrizianIdReferenced: 'SCR-6102',
    stage: 'Talent Shortlisted',
    message: 'Interested in interviewing SCR-6102 (Senior Cloud & DevOps Engineer) for AWS migration.',
    createdAt: '2026-10-01'
  },
  {
    _id: 'lead-103',
    name: 'Sarah Chen (Director of Product)',
    email: 'schen@innovate.sg',
    phone: '+65 6789 0123',
    company: 'Innovate Asia (Singapore)',
    serviceRequested: 'Dedicated Team Setup',
    scrizianIdReferenced: 'SCR-3928',
    stage: 'New Inbound Lead',
    message: 'Setting up offshore product team in India: 1 Tech Lead, 2 Fullstack devs, 1 QA.',
    createdAt: '2026-09-29'
  }
];

export const initialTalentList = [
  {
    id: 'SCR-8841',
    scrizianId: 'SCR-8841',
    displayName: 'Aarav M.',
    title: 'Lead Full-Stack Architect (Next.js, Node.js & Cloud)',
    category: 'Full Stack Developers',
    summary: '9+ years architecting enterprise Next.js, Node.js and Python microservices on AWS.',
    experienceYears: 9,
    skills: ['Next.js', 'Node.js', 'Python', 'AWS', 'MongoDB'],
    availability: 'Available now',
    hourlyRateUSD: 42,
    monthlyRateINR: 240000,
    relationshipBadge: 'Scriza Team Member',
    avatarText: '41',
    avatarUrl: '/images/logo.png',
    status: 'Verified'
  },
  {
    id: 'SCR-3928',
    scrizianId: 'SCR-3928',
    displayName: 'Ananya S.',
    title: 'Principal UI/UX Product Designer',
    category: 'UI/UX Designers',
    summary: '8+ years creating design systems, complex SaaS dashboards and B2B user journeys in Figma.',
    experienceYears: 8,
    skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
    availability: 'Partially available',
    hourlyRateUSD: 35,
    monthlyRateINR: 190000,
    relationshipBadge: 'Verified Scrizian',
    avatarText: '28',
    avatarUrl: '/images/logo.png',
    status: 'Verified'
  },
  {
    id: 'SCR-6648',
    scrizianId: 'SCR-6648',
    displayName: 'Priya K.',
    title: 'Java & Spring Boot Engineer',
    category: 'Backend Developers',
    summary: '8+ years building high-throughput banking APIs, microservices and Kafka event streams.',
    experienceYears: 8,
    skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka'],
    availability: 'Available now',
    hourlyRateUSD: 36,
    monthlyRateINR: 200000,
    relationshipBadge: 'Verified Scrizian',
    avatarText: '48',
    avatarUrl: '/images/logo.png',
    status: 'Verified'
  },
  {
    id: 'SCR-6102',
    scrizianId: 'SCR-6102',
    displayName: 'Rohan V.',
    title: 'Senior Cloud & DevOps Engineer',
    category: 'DevOps Engineers',
    summary: '7+ years deploying multi-region Kubernetes clusters, Terraform IaC, and GCP/AWS pipelines.',
    experienceYears: 7,
    skills: ['Kubernetes', 'Terraform', 'GCP', 'AWS', 'CI/CD'],
    availability: 'Available now',
    hourlyRateUSD: 38,
    monthlyRateINR: 210000,
    relationshipBadge: 'Verified Scrizian',
    avatarText: '02',
    avatarUrl: '/images/logo.png',
    status: 'Verified'
  },
  {
    id: 'SCR-7719',
    scrizianId: 'SCR-7719',
    displayName: 'Vikram S.',
    title: 'Senior Data & AI Specialist',
    category: 'Data & AI Specialists',
    summary: '6+ years deploying LLM pipelines, RAG systems, PyTorch models and vector databases.',
    experienceYears: 6,
    skills: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Vector DB'],
    availability: 'Available now',
    hourlyRateUSD: 45,
    monthlyRateINR: 260000,
    relationshipBadge: 'Verified Scrizian',
    avatarText: '19',
    avatarUrl: '/images/logo.png',
    status: 'Verified'
  }
];

export const initialJobsList = [
  {
    id: 'job-101',
    slug: 'senior-nextjs-nodejs-architect',
    dept: 'ENGINEERING',
    typeBadge: 'Full Time',
    typeKey: 'Full-time',
    title: 'Senior Next.js & Node.js Architect',
    company: 'CloudScale Inc (USA)',
    companyLogoUrl: '/images/logo.png',
    location: 'Remote (India / Global)',
    experience: '5+ years',
    skills: ['Next.js', 'Node.js', 'AWS', 'TypeScript'],
    salaryUSD: '$35 – $45 / hr',
    salaryINR: '₹28,00,000 – ₹38,00,000',
    rate: '$35 - $45 / hr',
    status: 'Active',
    applicantsCount: 7
  },
  {
    id: 'job-102',
    slug: 'senior-devops-kubernetes-engineer',
    dept: 'DEVOPS',
    typeBadge: 'Full Time',
    typeKey: 'Full-time',
    title: 'Senior DevOps & Kubernetes Engineer',
    company: 'Fintech Systems (UK)',
    companyLogoUrl: '/images/logo.png',
    location: 'Remote (India / Global)',
    experience: '4+ years',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Docker'],
    salaryUSD: '$35 – $40 / hr',
    salaryINR: '₹26,00,000 – ₹34,00,000',
    rate: '$35 - $40 / hr',
    status: 'Active',
    applicantsCount: 4
  },
  {
    id: 'job-103',
    slug: 'lead-uiux-product-designer',
    dept: 'DESIGN',
    typeBadge: 'Contract',
    typeKey: 'Contract',
    title: 'Lead UI/UX Product Designer',
    company: 'Innovate Asia (Singapore)',
    companyLogoUrl: '/images/logo.png',
    location: 'Remote (India / Global)',
    experience: '5+ years',
    skills: ['Figma', 'Design Systems', 'User Research'],
    salaryUSD: '$30 – $38 / hr',
    salaryINR: '₹22,00,000 – ₹30,00,000',
    rate: '$30 - $38 / hr',
    status: 'Active',
    applicantsCount: 5
  }
];

export const initialArticlesList = [
  {
    id: 'how-to-hire-react-developers-from-india-in-2026',
    cat: 'HIRING GUIDES',
    category: 'Hiring Guides',
    filterKey: 'Hiring Guides',
    title: 'How to Hire High-Performing React & Next.js Developers from India',
    excerpt: 'A comprehensive step-by-step framework to evaluate, interview, and onboard senior React & Next.js developers from India.',
    meta: 'Scrizians Editorial · 27 Sept 2026 · 6 min read',
    author: 'Scrizians Editorial',
    publishedDate: '27 Sept 2026',
    readTime: '6 min read',
    coverImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70',
    status: 'Published'
  },
  {
    id: 'multi-tenant-saas-architecture-with-nodejs-and-mongodb',
    cat: 'TECHNICAL GUIDES',
    category: 'Technical Guides',
    filterKey: 'Technical Guides',
    title: 'Multi-Tenant SaaS Architecture with Node.js and MongoDB',
    excerpt: 'Deep dive architectural guide on isolation, database tenant routing, and scaling multi-tenant SaaS platforms.',
    meta: 'Scrizians Technical Desk · 20 Sept 2026 · 8 min read',
    author: 'Scrizians Technical Desk',
    publishedDate: '20 Sept 2026',
    readTime: '8 min read',
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=70',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=70',
    status: 'Published'
  },
  {
    id: 'staff-augmentation-vs-dedicated-team-which-model-fits-you',
    cat: 'ENGAGEMENT MODELS',
    category: 'Engagement Models',
    filterKey: 'Engagement Models',
    title: 'Staff Augmentation vs Dedicated Team: Which Model Fits You?',
    excerpt: 'Compare cost, control, and speed across the most common offshore engineering engagement models.',
    meta: 'Scrizians Editorial · 15 Sept 2026 · 6 min read',
    author: 'Scrizians Editorial',
    publishedDate: '15 Sept 2026',
    readTime: '6 min read',
    coverImageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=70',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=70',
    status: 'Published'
  },
  {
    id: 'kubernetes-interview-questions-for-senior-devops-roles',
    cat: 'INTERVIEW RESOURCES',
    category: 'Interview Resources',
    filterKey: 'Interview Resources',
    title: 'Kubernetes Interview Questions for Senior DevOps Roles',
    excerpt: 'Practical, scenario-based technical questions that separate real cluster operators from resume keywords.',
    meta: 'SCR-8841 · 10 Sept 2026 · 6 min read',
    author: 'SCR-8841',
    publishedDate: '10 Sept 2026',
    readTime: '6 min read',
    coverImageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=70',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=70',
    status: 'Published'
  }
];

export const getStoredData = (key: string, fallback: any[]) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    if (data === null) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
};

export const syncFromMongoDB = (key: string) => {
  if (typeof window === 'undefined') return;
  const routeMap: Record<string, string> = {
    scrizians_leads_list: 'leads',
    scrizians_talent_list: 'talent',
    scrizians_jobs_list: 'jobs',
    scrizians_insights_list: 'insights'
  };

  const route = routeMap[key];
  if (!route) return;

  fetch(`/api/${route}`)
    .then(res => res.json())
    .then(resData => {
      if (resData.success && Array.isArray(resData.data)) {
        const newDataStr = JSON.stringify(resData.data);
        const currentDataStr = localStorage.getItem(key);
        if (newDataStr !== currentDataStr) {
          localStorage.setItem(key, newDataStr);
          window.dispatchEvent(new Event('scrizians_storage_updated'));
        }
      }
    })
    .catch(err => {
      console.warn(`MongoDB ${route} sync error:`, err);
    });
};

export const syncAllFromMongoDB = () => {
  if (typeof window === 'undefined') return;
  syncFromMongoDB('scrizians_leads_list');
  syncFromMongoDB('scrizians_talent_list');
  syncFromMongoDB('scrizians_jobs_list');
  syncFromMongoDB('scrizians_insights_list');
};

export const saveStoredData = (key: string, data: any[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('scrizians_storage_updated'));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

export const deleteStoredData = (key: string, id: string, updatedList: any[]) => {
  if (typeof window === 'undefined') return;
  saveStoredData(key, updatedList);

  const routeMap: Record<string, string> = {
    scrizians_leads_list: 'leads',
    scrizians_talent_list: 'talent',
    scrizians_jobs_list: 'jobs',
    scrizians_insights_list: 'insights'
  };

  const route = routeMap[key];
  if (route) {
    fetch(`/api/${route}?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(err => {
      console.warn('MongoDB Delete error:', err);
    });
  }
};

export const addInboundLead = (leadData: Partial<typeof initialLeadsList[0]>) => {
  if (typeof window === 'undefined') return;
  
  let currentLeads = getStoredData('scrizians_leads_list', initialLeadsList);
  
  if (!Array.isArray(currentLeads)) {
    currentLeads = [];
  }

  const newLead = {
    _id: `lead-${Date.now()}`,
    name: leadData.name || 'Anonymous Inquiry',
    email: leadData.email || 'contact@client.com',
    phone: leadData.phone || '+1 (555) 000-0000',
    company: leadData.company || 'Enterprise Client',
    serviceRequested: leadData.serviceRequested || 'Talent Requirement Inquiry',
    scrizianIdReferenced: leadData.scrizianIdReferenced || 'N/A',
    stage: 'New Inbound Lead',
    message: leadData.message || 'Inbound request submitted via website.',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updated = [newLead, ...currentLeads];
  saveStoredData('scrizians_leads_list', updated);

  fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newLead)
  }).catch(err => console.warn('MongoDB Lead POST error:', err));

  addNotification({
    title: '⚡ New Inbound Client Lead',
    message: `${newLead.name} (${newLead.company}) submitted a new inquiry.`,
    type: 'lead',
    link: '/dashboard/admin'
  });

  return newLead;
};
