const mongoose = require('mongoose');

const SCRIZIANS_URI = 'mongodb+srv://gyanvendra_db:Ramayan%239026@cluster0.lmd3dvm.mongodb.net/scrizians?retryWrites=true&w=majority&appName=Cluster0';

const leadsList = [
  {
    _id: 'lead-101',
    name: 'Michael Ross (VP Engineering)',
    email: 'm.ross@cloudscale.io',
    phone: '+1 (555) 234-5678',
    company: 'CloudScale Inc (USA)',
    serviceRequested: 'Dedicated Developer / Staff Augmentation',
    scrizianIdReferenced: 'SCR-8841',
    stage: 'Requirement Confirmed',
    message: 'Looking for 2 Senior Next.js & Node.js architects for 6-month contract with 4-hour EST overlap.',
    createdAt: '2026-10-03'
  },
  {
    _id: 'lead-102',
    name: 'David Kowalski (CTO)',
    email: 'david@fintechglobal.uk',
    phone: '+44 20 7946 0912',
    company: 'Fintech Systems (UK)',
    serviceRequested: 'Interview Scrizian Talent',
    scrizianIdReferenced: 'SCR-6102',
    stage: 'Talent Shortlisted',
    message: 'Interested in interviewing SCR-6102 (Senior Cloud & DevOps Engineer) for AWS migration.',
    createdAt: '2026-10-03'
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
    createdAt: '2026-10-02'
  },
  {
    _id: 'lead-104',
    name: 'Alexander Wright (VP Engineering)',
    email: 'alex.w@enterprise-cloud.io',
    phone: '+1 (555) 987-6543',
    company: 'Enterprise Cloud Systems (USA)',
    serviceRequested: 'Dedicated Developer / Staff Augmentation',
    scrizianIdReferenced: 'SCR-9950',
    stage: 'Contract Sent',
    message: 'Need 3 Lead AI & Cloud Architects with full US Eastern overlap.',
    createdAt: '2026-10-02'
  },
  {
    _id: 'lead-105',
    name: 'Sophia Martinez (Head of Hiring)',
    email: 'sophia@fintech-pay.co.uk',
    phone: '+44 20 7123 4567',
    company: 'Fintech Pay Global (UK)',
    serviceRequested: 'Interview Scrizian Talent',
    scrizianIdReferenced: 'SCR-6648',
    stage: 'Hired / Closed',
    message: 'Hired Java Spring Boot lead for banking microservices.',
    createdAt: '2026-10-01'
  },
  {
    _id: 'lead-106',
    name: 'Marcus Vance (Founder & CEO)',
    email: 'marcus@vancetech.de',
    phone: '+49 30 1234 5678',
    company: 'Vance Tech Berlin (Germany)',
    serviceRequested: 'Dedicated Developer / Staff Augmentation',
    scrizianIdReferenced: 'SCR-7719',
    stage: 'Talent Shortlisted',
    message: 'Evaluating 2 Data & AI Specialists for LLM pipeline integration.',
    createdAt: '2026-10-01'
  },
  {
    _id: 'lead-107',
    name: 'Emily Watson (Head of Engineering)',
    email: 'emily@nexushealth.ca',
    phone: '+1 (416) 555-0199',
    company: 'Nexus Health AI (Canada)',
    serviceRequested: 'Dedicated Team Setup',
    scrizianIdReferenced: 'SCR-9950',
    stage: 'Requirement Confirmed',
    message: 'Building HIPAA compliant healthcare AI backend team.',
    createdAt: '2026-09-30'
  },
  {
    _id: 'lead-108',
    name: 'Takahashi Kenji (Managing Director)',
    email: 'takahashi@tokyostartup.jp',
    phone: '+81 3 5555 0144',
    company: 'Tokyo Digital Ventures (Japan)',
    serviceRequested: 'Interview Scrizian Talent',
    scrizianIdReferenced: 'SCR-8841',
    stage: 'New Inbound Lead',
    message: 'Seeking React & Next.js leads fluent in English for global SaaS app.',
    createdAt: '2026-09-29'
  },
  {
    _id: 'lead-109',
    name: 'Liam O\'Connor (CTO)',
    email: 'liam@dublinfintech.ie',
    phone: '+353 1 496 0123',
    company: 'Dublin Payments Ltd (Ireland)',
    serviceRequested: 'Dedicated Developer / Staff Augmentation',
    scrizianIdReferenced: 'SCR-6648',
    stage: 'Contract Sent',
    message: 'Contracting 2 Senior Backend Java engineers for ISO20022 migration.',
    createdAt: '2026-09-28'
  },
  {
    _id: 'lead-110',
    name: 'Priya Sharma (VP Ops)',
    email: 'priya@aetherglobal.au',
    phone: '+61 2 9876 5432',
    company: 'Aether Cloud Sydney (Australia)',
    serviceRequested: 'Dedicated Team Setup',
    scrizianIdReferenced: 'SCR-6102',
    stage: 'Requirement Confirmed',
    message: 'Setting up 24/7 DevOps and Cloud infrastructure operation desk.',
    createdAt: '2026-09-27'
  }
];

const talentList = [
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
    id: 'SCR-9950',
    scrizianId: 'SCR-9950',
    displayName: 'Vikramaditya R.',
    title: 'Lead AI & Cloud Solutions Architect',
    category: 'Data & AI Specialists',
    summary: '10+ years building LLM pipelines, microservices, Next.js apps, and AWS cloud infrastructures.',
    experienceYears: 10,
    skills: ['Next.js', 'Python', 'AWS', 'LLMs', 'Node.js'],
    availability: 'Available now',
    hourlyRateUSD: 48,
    monthlyRateINR: 280000,
    relationshipBadge: 'Scriza Team Member',
    avatarText: '50',
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
    title: 'Java & Spring Boot Backend Lead',
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
    title: 'Senior Cloud & DevOps Specialist',
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
    title: 'Senior Data & LLM Specialist',
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
  },
  {
    id: 'SCR-5421',
    scrizianId: 'SCR-5421',
    displayName: 'Kabir Nair',
    title: 'Senior Mobile Engineer (React Native & Flutter)',
    category: 'Mobile Developers',
    summary: '7+ years crafting cross-platform iOS & Android apps with offline sync and WebRTC.',
    experienceYears: 7,
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'GraphQL'],
    availability: 'Available now',
    hourlyRateUSD: 37,
    monthlyRateINR: 205000,
    relationshipBadge: 'Verified Scrizian',
    avatarText: '21',
    avatarUrl: '/images/logo.png',
    status: 'Verified'
  },
  {
    id: 'SCR-4182',
    scrizianId: 'SCR-4182',
    displayName: 'Neha Kapoor',
    title: 'Lead QA Automation Engineer',
    category: 'QA & Testing',
    summary: '6+ years designing Cypress, Playwright, and Selenium test suites for SaaS applications.',
    experienceYears: 6,
    skills: ['Playwright', 'Cypress', 'Selenium', 'TypeScript', 'CI/CD'],
    availability: 'Available now',
    hourlyRateUSD: 32,
    monthlyRateINR: 175000,
    relationshipBadge: 'Verified Scrizian',
    avatarText: '82',
    avatarUrl: '/images/logo.png',
    status: 'Verified'
  },
  {
    id: 'SCR-9034',
    scrizianId: 'SCR-9034',
    displayName: 'Siddharth Gupta',
    title: 'Senior Rust & Golang Systems Specialist',
    category: 'Backend Developers',
    summary: '8+ years building low-latency crypto trading engines, gRPC services, and Rust microservices.',
    experienceYears: 8,
    skills: ['Rust', 'Golang', 'gRPC', 'PostgreSQL', 'Docker'],
    availability: 'Partially available',
    hourlyRateUSD: 46,
    monthlyRateINR: 270000,
    relationshipBadge: 'Scriza Team Member',
    avatarText: '34',
    avatarUrl: '/images/logo.png',
    status: 'Verified'
  },
  {
    id: 'SCR-3115',
    scrizianId: 'SCR-3115',
    displayName: 'Meera Joshi',
    title: 'Principal Frontend Architect (Vue 3 & Nuxt)',
    category: 'Frontend Developers',
    summary: '7+ years building enterprise web apps, micro-frontends, and high-converting portals.',
    experienceYears: 7,
    skills: ['Vue 3', 'Nuxt.js', 'TypeScript', 'TailwindCSS', 'Pinia'],
    availability: 'Available now',
    hourlyRateUSD: 39,
    monthlyRateINR: 215000,
    relationshipBadge: 'Verified Scrizian',
    avatarText: '15',
    avatarUrl: '/images/logo.png',
    status: 'Verified'
  }
];

const jobsList = [
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
  },
  {
    id: 'job-104',
    slug: 'lead-ai-cloud-architect',
    dept: 'AI & CLOUD',
    typeBadge: 'Full Time',
    typeKey: 'Full-time',
    title: 'Lead AI & Cloud Solutions Architect',
    company: 'Enterprise Cloud Systems (USA)',
    companyLogoUrl: '/images/logo.png',
    location: 'Remote (India / Global)',
    experience: '6+ years',
    skills: ['Next.js', 'Python', 'AWS', 'PyTorch'],
    salaryUSD: '$45 – $55 / hr',
    salaryINR: '₹35,00,000 – ₹45,00,000',
    rate: '$45 - $55 / hr',
    status: 'Active',
    applicantsCount: 3
  },
  {
    id: 'job-105',
    slug: 'senior-fullstack-nextjs-engineer',
    dept: 'ENGINEERING',
    typeBadge: 'Full Time',
    typeKey: 'Full-time',
    title: 'Senior Full-Stack Next.js Engineer',
    company: 'Fintech Pay Global (UK)',
    companyLogoUrl: '/images/logo.png',
    location: 'Remote (India / Global)',
    experience: '5+ years',
    skills: ['Next.js', 'Node.js', 'TypeScript', 'MongoDB'],
    salaryUSD: '$38 – $45 / hr',
    salaryINR: '₹30,00,000 – ₹38,00,000',
    rate: '$38 - $45 / hr',
    status: 'Active',
    applicantsCount: 5
  },
  {
    id: 'job-106',
    slug: 'senior-java-spring-boot-lead',
    dept: 'BACKEND',
    typeBadge: 'Full Time',
    typeKey: 'Full-time',
    title: 'Senior Java & Spring Boot Lead',
    company: 'Vance Tech Berlin (Germany)',
    companyLogoUrl: '/images/logo.png',
    location: 'Remote (India / Global)',
    experience: '6+ years',
    skills: ['Java', 'Spring Boot', 'Kafka', 'Microservices'],
    salaryUSD: '$40 – $48 / hr',
    salaryINR: '₹32,00,000 – ₹40,00,000',
    rate: '$40 - $48 / hr',
    status: 'Active',
    applicantsCount: 8
  },
  {
    id: 'job-107',
    slug: 'mobile-react-native-architect',
    dept: 'MOBILE',
    typeBadge: 'Full Time',
    typeKey: 'Full-time',
    title: 'Mobile React Native Architect',
    company: 'Nexus Health AI (Canada)',
    companyLogoUrl: '/images/logo.png',
    location: 'Remote (India / Global)',
    experience: '5+ years',
    skills: ['React Native', 'TypeScript', 'iOS', 'Android'],
    salaryUSD: '$36 – $44 / hr',
    salaryINR: '₹28,00,000 – ₹36,00,000',
    rate: '$36 - $44 / hr',
    status: 'Active',
    applicantsCount: 6
  },
  {
    id: 'job-108',
    slug: 'lead-qa-automation-engineer',
    dept: 'QA & TESTING',
    typeBadge: 'Contract',
    typeKey: 'Contract',
    title: 'Lead QA Automation Engineer',
    company: 'Tokyo Digital Ventures (Japan)',
    companyLogoUrl: '/images/logo.png',
    location: 'Remote (India / Global)',
    experience: '4+ years',
    skills: ['Playwright', 'Cypress', 'CI/CD', 'TypeScript'],
    salaryUSD: '$30 – $36 / hr',
    salaryINR: '₹24,00,000 – ₹30,00,000',
    rate: '$30 - $36 / hr',
    status: 'Active',
    applicantsCount: 4
  },
  {
    id: 'job-109',
    slug: 'rust-golang-systems-engineer',
    dept: 'SYSTEMS',
    typeBadge: 'Full Time',
    typeKey: 'Full-time',
    title: 'Rust & Golang Systems Engineer',
    company: 'Dublin Payments Ltd (Ireland)',
    companyLogoUrl: '/images/logo.png',
    location: 'Remote (India / Global)',
    experience: '5+ years',
    skills: ['Rust', 'Golang', 'gRPC', 'PostgreSQL'],
    salaryUSD: '$42 – $52 / hr',
    salaryINR: '₹34,00,000 – ₹44,00,000',
    rate: '$42 - $52 / hr',
    status: 'Active',
    applicantsCount: 2
  },
  {
    id: 'job-110',
    slug: 'frontend-vue-nuxt-lead',
    dept: 'FRONTEND',
    typeBadge: 'Full Time',
    typeKey: 'Full-time',
    title: 'Frontend Vue 3 & Nuxt Lead',
    company: 'Aether Cloud Sydney (Australia)',
    companyLogoUrl: '/images/logo.png',
    location: 'Remote (India / Global)',
    experience: '5+ years',
    skills: ['Vue 3', 'Nuxt.js', 'TailwindCSS', 'Pinia'],
    salaryUSD: '$38 – $46 / hr',
    salaryINR: '₹30,00,000 – ₹38,00,000',
    rate: '$38 - $46 / hr',
    status: 'Active',
    applicantsCount: 9
  }
];

const articlesList = [
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
  },
  {
    id: 'how-to-scale-nextjs-apps-with-mongodb-atlas-in-2026',
    cat: 'TECHNICAL GUIDES',
    category: 'Technical Guides',
    filterKey: 'Technical Guides',
    title: 'How to Scale Enterprise Next.js Applications with MongoDB Atlas',
    excerpt: 'Architectural blueprint on connection pooling, indexing strategies, and real-time syncing for Next.js 14 App Router.',
    meta: 'Scrizians Technical Desk · 03 Oct 2026 · 7 min read',
    author: 'Scrizians Technical Desk',
    publishedDate: '03 Oct 2026',
    readTime: '7 min read',
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=70',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=70',
    status: 'Published'
  },
  {
    id: 'offshore-engineering-hiring-guide-2026',
    cat: 'HIRING GUIDES',
    category: 'Hiring Guides',
    filterKey: 'Hiring Guides',
    title: '2026 Offshore Engineering Hiring Guide: India Tech Talent Ecosystem',
    excerpt: 'Everything global CTOs and VP Engineers need to know about salary benchmarks, time zones, and vetting senior developers in India.',
    meta: 'Scrizians Editorial · 02 Oct 2026 · 6 min read',
    author: 'Scrizians Editorial',
    publishedDate: '02 Oct 2026',
    readTime: '6 min read',
    coverImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70',
    status: 'Published'
  },
  {
    id: 'building-rag-pipelines-with-langchain-and-vector-databases',
    cat: 'TECHNICAL GUIDES',
    category: 'Technical Guides',
    filterKey: 'Technical Guides',
    title: 'Building Enterprise RAG Pipelines with LangChain and Vector DBs',
    excerpt: 'Step-by-step production guide for retrieval-augmented generation in LLM applications.',
    meta: 'SCR-7719 · 28 Sept 2026 · 9 min read',
    author: 'SCR-7719',
    publishedDate: '28 Sept 2026',
    readTime: '9 min read',
    coverImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=70',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=70',
    status: 'Published'
  },
  {
    id: 'micro-frontends-with-module-federation-in-nextjs',
    cat: 'TECHNICAL GUIDES',
    category: 'Technical Guides',
    filterKey: 'Technical Guides',
    title: 'Micro-Frontends with Module Federation in Next.js & React',
    excerpt: 'Scaling large engineering organizations by breaking monolithic frontends into independent deployments.',
    meta: 'Scrizians Technical Desk · 22 Sept 2026 · 8 min read',
    author: 'Scrizians Technical Desk',
    publishedDate: '22 Sept 2026',
    readTime: '8 min read',
    coverImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=70',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=70',
    status: 'Published'
  },
  {
    id: 'time-zone-overlap-strategies-for-us-and-india-teams',
    cat: 'ENGAGEMENT MODELS',
    category: 'Engagement Models',
    filterKey: 'Engagement Models',
    title: 'Time Zone Overlap Strategies for US & India Engineering Teams',
    excerpt: 'How modern engineering leaders configure 4-hour synchronous overlaps for seamless daily velocity.',
    meta: 'Scrizians Editorial · 18 Sept 2026 · 5 min read',
    author: 'Scrizians Editorial',
    publishedDate: '18 Sept 2026',
    readTime: '5 min read',
    coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=70',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=70',
    status: 'Published'
  },
  {
    id: 'java-microservices-performance-tuning-for-banking-apis',
    cat: 'TECHNICAL GUIDES',
    category: 'Technical Guides',
    filterKey: 'Technical Guides',
    title: 'Java Microservices Performance Tuning for Banking APIs',
    excerpt: 'Optimizing JVM heap, Spring Boot thread pools, and Kafka consumers for high TPS production environments.',
    meta: 'SCR-6648 · 12 Sept 2026 · 7 min read',
    author: 'SCR-6648',
    publishedDate: '12 Sept 2026',
    readTime: '7 min read',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=70',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=70',
    status: 'Published'
  }
];

async function seedTenItems() {
  try {
    console.log('Connecting to MongoDB Atlas "scrizians" database...');
    await mongoose.connect(SCRIZIANS_URI);
    console.log('Connected!');

    const db = mongoose.connection.db;

    // 1. Leads
    await db.collection('leads').deleteMany({});
    await db.collection('leads').insertMany(leadsList);
    console.log(`✓ Leads collection populated with ${leadsList.length} items!`);

    // 2. Talents
    await db.collection('talents').deleteMany({});
    await db.collection('talents').insertMany(talentList);
    console.log(`✓ Talents collection populated with ${talentList.length} items!`);

    // 3. Jobs
    await db.collection('jobs').deleteMany({});
    await db.collection('jobs').insertMany(jobsList);
    console.log(`✓ Jobs collection populated with ${jobsList.length} items!`);

    // 4. Insights
    await db.collection('insights').deleteMany({});
    await db.collection('insights').insertMany(articlesList);
    console.log(`✓ Insights collection populated with ${articlesList.length} items!`);

    // SeedMarkers
    const seedMarkerCollection = db.collection('seedmarkers');
    const markers = ['leads', 'talent', 'jobs', 'insights'];
    for (const key of markers) {
      await seedMarkerCollection.updateOne({ key: key }, { $set: { key, seededAt: new Date() } }, { upsert: true });
    }
    console.log(`✓ Seedmarkers updated!`);

    console.log('\n======================================================');
    console.log('🎉 SUCCESSFULLY POPULATED 10 ITEMS IN EACH COLLECTION!');
    console.log('======================================================');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error populating 10 items:', err);
    process.exit(1);
  }
}

seedTenItems();
