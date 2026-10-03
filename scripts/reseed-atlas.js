const mongoose = require('mongoose');

const SCRIZIANS_URI = 'mongodb+srv://gyanvendra_db:Ramayan%239026@cluster0.lmd3dvm.mongodb.net/scrizians?retryWrites=true&w=majority&appName=Cluster0';

const leadsList = [
  {
    _id: 'lead-201',
    name: 'Alexander Wright (VP Engineering)',
    email: 'alex.w@enterprise-cloud.io',
    phone: '+1 (555) 987-6543',
    company: 'Enterprise Cloud Systems',
    serviceRequested: 'Dedicated Developer / Staff Augmentation',
    scrizianIdReferenced: 'SCR-9950',
    stage: 'Requirement Confirmed',
    message: 'Looking to hire 3 Lead Next.js & Full-Stack engineers with EST overlap.',
    createdAt: '2026-10-03'
  },
  {
    _id: 'lead-202',
    name: 'Sophia Martinez (Head of Talent)',
    email: 'sophia@fintech-pay.co.uk',
    phone: '+44 20 7123 4567',
    company: 'Fintech Pay Global',
    serviceRequested: 'Interview Scrizian Talent',
    scrizianIdReferenced: 'SCR-8841',
    stage: 'Talent Shortlisted',
    message: 'Requesting technical interviews for Senior Cloud Architect.',
    createdAt: '2026-10-03'
  }
];

const talentList = [
  {
    id: 'SCR-9950',
    scrizianId: 'SCR-9950',
    displayName: 'Vikramaditya R.',
    title: 'Lead AI & Cloud Solutions Architect',
    category: 'Full Stack Developers',
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
  }
];

const jobsList = [
  {
    id: 'job-201',
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
    id: 'job-202',
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
  }
];

const articlesList = [
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
  }
];

async function fillFreshData() {
  try {
    console.log('Connecting to MongoDB Atlas "scrizians" database...');
    await mongoose.connect(SCRIZIANS_URI);
    console.log('Connected!');

    const db = mongoose.connection.db;

    // Clear and insert fresh leads
    await db.collection('leads').deleteMany({});
    await db.collection('leads').insertMany(leadsList);
    console.log(`✓ Leads collection filled with ${leadsList.length} items!`);

    // Clear and insert fresh talent
    await db.collection('talents').deleteMany({});
    await db.collection('talents').insertMany(talentList);
    console.log(`✓ Talents collection filled with ${talentList.length} items!`);

    // Clear and insert fresh jobs
    await db.collection('jobs').deleteMany({});
    await db.collection('jobs').insertMany(jobsList);
    console.log(`✓ Jobs collection filled with ${jobsList.length} items!`);

    // Clear and insert fresh insights
    await db.collection('insights').deleteMany({});
    await db.collection('insights').insertMany(articlesList);
    console.log(`✓ Insights collection filled with ${articlesList.length} items!`);

    // Update seedmarkers
    const seedMarkerCollection = db.collection('seedmarkers');
    const markers = ['leads', 'talent', 'jobs', 'insights'];
    for (const key of markers) {
      await seedMarkerCollection.updateOne({ key: key }, { $set: { key, seededAt: new Date() } }, { upsert: true });
    }
    console.log(`✓ Seedmarkers updated!`);

    console.log('\n--- FRESH DATA SUCCESSFULLY FILLED IN MONGODB ATLAS ---');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error filling fresh data:', err);
    process.exit(1);
  }
}

fillFreshData();
