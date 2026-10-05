import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with demo and admin accounts, companies, applications, and interviews...');

  // Clean existing data
  await prisma.document.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.company.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 1. Create Admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Sarah Connor (Admin & Employer)',
      email: 'admin@jobtrack.dev',
      password: hashedPassword,
      role: 'ADMIN',
      activePersona: 'EMPLOYER',
      title: 'Talent Acquisition & Technical Recruiter',
      companyName: 'TechVentures & Partners',
      bio: 'Hiring world-class engineering and product talent across global distributed teams.',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  // 2. Create Demo Job Seeker user
  const demoUser = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'demo@jobtrack.dev',
      password: hashedPassword,
      role: 'USER',
      activePersona: 'JOB_SEEKER',
      title: 'Full-Stack Developer & UI Enthusiast',
      bio: 'Passionate developer building sleek web applications with React, TypeScript, Node.js, and Postgres.',
      skills: 'React, TypeScript, Node.js, PostgreSQL, TailwindCSS, Next.js',
      hourlyRate: 65,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  // Seed Job Marketplace Postings (Created by Sarah / Employer)
  await prisma.jobPosting.create({
    data: {
      employerId: admin.id,
      title: 'Senior Full-Stack Engineer',
      companyName: 'Stripe',
      location: 'San Francisco, CA / Remote',
      locationType: 'REMOTE',
      employmentType: 'FULL_TIME',
      salaryRange: '$160,000 - $195,000',
      description: 'Join Stripe to build the next generation of global economic infrastructure. You will work on real-time billing, payment routing, and developer API engines.',
      requirements: '5+ years experience with distributed systems, React, Node.js or Ruby, and cloud architecture.',
      skills: 'React, Node.js, TypeScript, PostgreSQL, Distributed Systems',
      status: 'OPEN',
    },
  });

  await prisma.jobPosting.create({
    data: {
      employerId: admin.id,
      title: 'Product Engineer (Frontend & UI Craft)',
      companyName: 'Linear',
      location: 'San Francisco, CA / Remote',
      locationType: 'REMOTE',
      employmentType: 'FULL_TIME',
      salaryRange: '$145,000 - $180,000',
      description: 'Linear is looking for a product-minded frontend engineer with extreme attention to visual craft, keyboard-first interactions, and real-time local sync.',
      requirements: 'Deep mastery of React, TypeScript, CSS transitions, WebSockets, and indexedDB offline engines.',
      skills: 'React, TypeScript, TailwindCSS, State Management, Sync Engines',
      status: 'OPEN',
    },
  });

  await prisma.jobPosting.create({
    data: {
      employerId: admin.id,
      title: 'Next.js & Edge Runtime Specialist',
      companyName: 'Vercel',
      location: 'Remote',
      locationType: 'REMOTE',
      employmentType: 'FULL_TIME',
      salaryRange: '$150,000 - $190,000',
      description: 'Help scale the frontend cloud for millions of developers worldwide. You will optimize SSR, Server Components, and edge middleware performance.',
      requirements: 'Experience maintaining open-source libraries, deep understanding of web standards, HTTP/2, and React 19.',
      skills: 'Next.js, React 19, TypeScript, Edge Computing, Web Standards',
      status: 'OPEN',
    },
  });

  await prisma.jobPosting.create({
    data: {
      employerId: admin.id,
      title: 'Freelance Mobile App Developer (Expo & React Native)',
      companyName: 'TechVentures Studio',
      location: 'Remote',
      locationType: 'REMOTE',
      employmentType: 'CONTRACT',
      salaryRange: '$75 - $110 / hour',
      description: 'Seeking a seasoned mobile freelancer to develop an MVP cross-platform iOS and Android app for high-growth consumer fintech.',
      requirements: 'Demonstrated portfolio of published App Store & Play Store apps, React Native, Zustand, and GraphQL.',
      skills: 'React Native, Expo, Mobile UI, TypeScript, GraphQL',
      status: 'OPEN',
    },
  });

  // 3. Create Companies for demo user
  const stripe = await prisma.company.create({
    data: {
      userId: demoUser.id,
      name: 'Stripe',
      website: 'https://stripe.com',
      location: 'San Francisco, CA / Remote',
      industry: 'Fintech / Payments',
      contactPerson: 'David Chen',
      contactEmail: 'david.chen@stripe.com',
      notes: 'Leading payment infrastructure. High engineering bar with systems focus.',
    },
  });

  const linear = await prisma.company.create({
    data: {
      userId: demoUser.id,
      name: 'Linear',
      website: 'https://linear.app',
      location: 'Remote',
      industry: 'Developer Tools',
      contactPerson: 'Tuomas Artman',
      contactEmail: 'talent@linear.app',
      notes: 'Exceptional UX culture, React + TypeScript stack, sync engine.',
    },
  });

  const vercel = await prisma.company.create({
    data: {
      userId: demoUser.id,
      name: 'Vercel',
      website: 'https://vercel.com',
      location: 'Remote',
      industry: 'Cloud / Web Platform',
      contactPerson: 'Jessica Alba',
      contactEmail: 'jessica@vercel.com',
      notes: 'Next.js creators. Fast-paced, high developer advocacy presence.',
    },
  });

  const datadog = await prisma.company.create({
    data: {
      userId: demoUser.id,
      name: 'Datadog',
      website: 'https://datadoghq.com',
      location: 'New York, NY / Hybrid',
      industry: 'Observability & Cloud',
      contactPerson: 'Marc Dupont',
      contactEmail: 'm.dupont@datadoghq.com',
      notes: 'Real-time telemetry, distributed tracing, strong backend focus.',
    },
  });

  const spotify = await prisma.company.create({
    data: {
      userId: demoUser.id,
      name: 'Spotify',
      website: 'https://spotify.com',
      location: 'Stockholm / Remote EU',
      industry: 'Audio Streaming',
      contactPerson: 'Astrid Lind',
      contactEmail: 'astrid.l@spotify.com',
      notes: 'Squad model, audio streaming infrastructure and recommendations.',
    },
  });

  const github = await prisma.company.create({
    data: {
      userId: demoUser.id,
      name: 'GitHub',
      website: 'https://github.com',
      location: 'Remote',
      industry: 'Developer Tools',
      contactPerson: 'Erika Ramirez',
      contactEmail: 'erika@github.com',
      notes: 'Developer workflow, actions, copilot integration.',
    },
  });

  // 4. Create Applications across all stages
  // Stage: OFFER
  const appOffer1 = await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyId: linear.id,
      companyName: 'Linear',
      position: 'Frontend Engineer (Design Systems)',
      location: 'Remote',
      locationType: 'REMOTE',
      employmentType: 'FULL_TIME',
      salary: '$145,000 - $165,000 + Equity',
      status: 'OFFER',
      applicationDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      jobDescription: 'Build next-generation keyboard-first desktop UI components in React and Canvas.',
      jobUrl: 'https://linear.app/careers',
      contactPerson: 'Tuomas Artman',
      contactEmail: 'talent@linear.app',
      cvUsed: 'Alex_Rivera_Frontend_Resume_v3.pdf',
      notes: 'Received written offer package! 4 weeks PTO, equipment budget included.',
      rating: 5,
    },
  });

  const appOffer2 = await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyId: vercel.id,
      companyName: 'Vercel',
      position: 'Full-Stack Developer (DX)',
      location: 'Remote (US/EU)',
      locationType: 'REMOTE',
      employmentType: 'FULL_TIME',
      salary: '$140,000 - $155,000',
      status: 'OFFER',
      applicationDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      jobDescription: 'Craft starter templates, docs, and SDK components for modern web developers.',
      jobUrl: 'https://vercel.com/careers',
      contactPerson: 'Jessica Alba',
      contactEmail: 'jessica@vercel.com',
      cvUsed: 'Alex_Rivera_FullStack_Resume.pdf',
      notes: 'Negotiating start date. Excellent health benefits and annual summit.',
      rating: 5,
    },
  });

  // Stage: INTERVIEW
  const appInterview1 = await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyId: stripe.id,
      companyName: 'Stripe',
      position: 'Software Engineer - Billing Infrastructure',
      location: 'San Francisco, CA / Remote',
      locationType: 'HYBRID',
      employmentType: 'FULL_TIME',
      salary: '$160,000 - $185,000',
      status: 'INTERVIEW',
      applicationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      jobDescription: 'Scale recurring billing systems processing billions of dollars in transaction volume.',
      jobUrl: 'https://stripe.com/jobs',
      contactPerson: 'David Chen',
      contactEmail: 'david.chen@stripe.com',
      cvUsed: 'Alex_Rivera_Backend_Resume.pdf',
      notes: 'Passed initial technical screen. Next up: Architecture and debugging pairing session.',
      rating: 5,
    },
  });

  const appInterview2 = await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyId: datadog.id,
      companyName: 'Datadog',
      position: 'Full Stack Engineer - Dashboard Analytics',
      location: 'New York, NY',
      locationType: 'HYBRID',
      employmentType: 'FULL_TIME',
      salary: '$150,000 - $170,000',
      status: 'INTERVIEW',
      applicationDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      jobDescription: 'Build high-performance real-time visualizations for time-series infrastructure metrics.',
      jobUrl: 'https://datadoghq.com/careers',
      contactPerson: 'Marc Dupont',
      contactEmail: 'm.dupont@datadoghq.com',
      cvUsed: 'Alex_Rivera_FullStack_Resume.pdf',
      notes: 'Preparing for live React state management coding session.',
      rating: 4,
    },
  });

  // Stage: SCREENING
  const appScreening1 = await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyId: spotify.id,
      companyName: 'Spotify',
      position: 'Web Platform Engineer',
      location: 'Remote EU / London',
      locationType: 'REMOTE',
      employmentType: 'FULL_TIME',
      salary: '£85,000 - £95,000',
      status: 'SCREENING',
      applicationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      jobDescription: 'Optimize core web player performance, bundle size, and accessibility.',
      jobUrl: 'https://lifeatspotify.com',
      contactPerson: 'Astrid Lind',
      contactEmail: 'astrid.l@spotify.com',
      cvUsed: 'Alex_Rivera_Frontend_Resume_v3.pdf',
      notes: 'HR recruiter contacted via LinkedIn. 30-min intro chat booked.',
      rating: 4,
    },
  });

  const appScreening2 = await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyId: github.id,
      companyName: 'GitHub',
      position: 'Junior Software Engineer (Actions)',
      location: 'Remote',
      locationType: 'REMOTE',
      employmentType: 'FULL_TIME',
      salary: '$125,000 - $140,000',
      status: 'SCREENING',
      applicationDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      jobDescription: 'Support workflow automation and runner ecosystems.',
      jobUrl: 'https://github.com/careers',
      contactPerson: 'Erika Ramirez',
      contactEmail: 'erika@github.com',
      cvUsed: 'Alex_Rivera_FullStack_Resume.pdf',
      notes: 'Recruiter asked for updated portfolio links.',
      rating: 4,
    },
  });

  // Stage: APPLIED
  await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Notion',
      position: 'Frontend Systems Engineer',
      location: 'San Francisco, CA / Remote',
      locationType: 'REMOTE',
      employmentType: 'FULL_TIME',
      salary: '$150,000 - $175,000',
      status: 'APPLIED',
      applicationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      jobDescription: 'Block-based collaborative editor development with rich interactions.',
      jobUrl: 'https://notion.so/careers',
      cvUsed: 'Alex_Rivera_Frontend_Resume_v3.pdf',
      notes: 'Applied via employee referral from college classmate.',
      rating: 5,
    },
  });

  await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Airbnb',
      position: 'Software Engineer - Guest Experience',
      location: 'Remote US',
      locationType: 'REMOTE',
      employmentType: 'FULL_TIME',
      salary: '$155,000 - $180,000',
      status: 'APPLIED',
      applicationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      jobDescription: 'Build seamless checkout and discovery flows for travelers.',
      jobUrl: 'https://careers.airbnb.com',
      cvUsed: 'Alex_Rivera_FullStack_Resume.pdf',
      notes: 'Submitted application on company career portal.',
      rating: 4,
    },
  });

  await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Supabase',
      position: 'Developer Relations / Full-Stack Engineer',
      location: 'Remote Worldwide',
      locationType: 'REMOTE',
      employmentType: 'FULL_TIME',
      salary: '$130,000 - $150,000',
      status: 'APPLIED',
      applicationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      jobDescription: 'Build PostgreSQL integrations, authentication demos, and tutorials.',
      jobUrl: 'https://supabase.com/careers',
      cvUsed: 'Alex_Rivera_FullStack_Resume.pdf',
      notes: 'Created an open source demo app with pgvector to showcase in application.',
      rating: 5,
    },
  });

  // Stage: REJECTED
  await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Meta',
      position: 'Frontend Engineer (React Core)',
      location: 'Menlo Park, CA / Remote',
      locationType: 'HYBRID',
      employmentType: 'FULL_TIME',
      salary: '$170,000 - $195,000',
      status: 'REJECTED',
      applicationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      jobDescription: 'Work on compilers and virtual DOM optimizations for React.',
      jobUrl: 'https://metacareers.com',
      cvUsed: 'Alex_Rivera_Frontend_Resume_v3.pdf',
      notes: 'Position filled internally. Good learning experience with recruiter chat.',
      rating: 4,
    },
  });

  await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Amazon Web Services',
      position: 'Cloud Support Associate',
      location: 'Seattle, WA',
      locationType: 'ONSITE',
      employmentType: 'FULL_TIME',
      salary: '$110,000 - $125,000',
      status: 'REJECTED',
      applicationDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
      jobDescription: 'Troubleshoot cloud infrastructure and serverless workloads.',
      notes: 'Decided to focus exclusively on Full-Stack developer positions rather than support.',
      rating: 3,
    },
  });

  // 5. Create Interviews
  await prisma.interview.create({
    data: {
      userId: demoUser.id,
      applicationId: appInterview1.id,
      title: 'Stripe - Technical Deep-Dive & System Design',
      type: 'TECHNICAL',
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      location: 'https://meet.google.com/xyz-jobtrack-stripe',
      interviewer: 'Sarah Jenkins (Staff Eng)',
      notes: 'Review idempotency keys, distributed locks, and retry queues.',
      status: 'SCHEDULED',
    },
  });

  await prisma.interview.create({
    data: {
      userId: demoUser.id,
      applicationId: appInterview2.id,
      title: 'Datadog - React Performance & State Architecture',
      type: 'TECHNICAL',
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      location: 'https://zoom.us/j/datadog-alex-interview',
      interviewer: 'Marc Dupont & Kevin Zhang',
      notes: 'Demonstrate custom hooks, memoization, and canvas rendering.',
      status: 'SCHEDULED',
    },
  });

  await prisma.interview.create({
    data: {
      userId: demoUser.id,
      applicationId: appScreening1.id,
      title: 'Spotify - Initial Recruiter Screening',
      type: 'HR',
      scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      location: 'Phone call (+44 20 7946 0991)',
      interviewer: 'Astrid Lind',
      notes: 'Discuss career aspirations, visa eligibility, and team fit.',
      status: 'SCHEDULED',
    },
  });

  await prisma.interview.create({
    data: {
      userId: demoUser.id,
      applicationId: appOffer1.id,
      title: 'Linear - Final Founder Chat with Karri & Tuomas',
      type: 'FINAL',
      scheduledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      location: 'https://meet.google.com/lin-ear-final',
      interviewer: 'Tuomas Artman (CTO)',
      notes: 'Discussed product philosophy and craftsmanship. Led to verbal offer!',
      status: 'COMPLETED',
      feedback: 'Very impressed with attention to detail and polish.',
    },
  });

  // 6. Create Documents
  await prisma.document.create({
    data: {
      userId: demoUser.id,
      applicationId: appOffer1.id,
      title: 'Alex_Rivera_Frontend_Resume_2026.pdf',
      fileName: 'Alex_Rivera_Frontend_Resume_2026.pdf',
      fileType: 'RESUME',
      fileUrl: '/uploads/Alex_Rivera_Frontend_Resume_2026.pdf',
      fileSize: 245000,
    },
  });

  await prisma.document.create({
    data: {
      userId: demoUser.id,
      applicationId: appOffer2.id,
      title: 'Alex_Rivera_FullStack_Resume.pdf',
      fileName: 'Alex_Rivera_FullStack_Resume.pdf',
      fileType: 'RESUME',
      fileUrl: '/uploads/Alex_Rivera_FullStack_Resume.pdf',
      fileSize: 278000,
    },
  });

  await prisma.document.create({
    data: {
      userId: demoUser.id,
      applicationId: appInterview1.id,
      title: 'Stripe_Cover_Letter_Customized.pdf',
      fileName: 'Stripe_Cover_Letter_Customized.pdf',
      fileType: 'COVER_LETTER',
      fileUrl: '/uploads/Stripe_Cover_Letter_Customized.pdf',
      fileSize: 184000,
    },
  });

  console.log('Seed completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Admin account: admin@jobtrack.dev / Password123!');
  console.log('Demo user:     demo@jobtrack.dev  / Password123!');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
