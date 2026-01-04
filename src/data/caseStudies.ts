export interface CaseStudyResult {
  metric: string;
  label: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  author: string;
  title: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  location: string;
  industry: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  testimonial: CaseStudyTestimonial;
  equipment: string[];
  image: string;
  featured: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'regional-hospital-mri-upgrade',
    title: 'Regional Hospital Saves $400,000 on MRI Upgrade',
    client: 'Regional Medical Center',
    location: 'Houston, TX',
    industry: 'Hospital',
    challenge: 'Their 15-year-old GE Signa Excite was experiencing frequent downtime, costing them $8,000 per day in lost revenue. They needed a reliable replacement within a tight 90-day timeline but had a limited capital budget that couldn\'t accommodate new OEM pricing.',
    solution: 'LASO provided a certified refurbished GE Signa HDxt 1.5T with a complete 16-channel coil package. Our team managed the full deinstallation of the old system, site preparation, and installation within 75 days—15 days ahead of schedule.',
    results: [
      { metric: '$400K', label: 'Cost Savings vs New' },
      { metric: '99.2%', label: 'System Uptime' },
      { metric: '30%', label: 'Faster Scan Times' },
      { metric: '75 Days', label: 'Full Installation' }
    ],
    testimonial: {
      quote: 'LASO delivered exactly what they promised—a high-quality system at a fraction of the cost. Our radiologists love the image quality, and we\'ve had zero unplanned downtime since installation.',
      author: 'Dr. Sarah Chen',
      title: 'Chief of Radiology'
    },
    equipment: ['GE Signa HDxt 1.5T MRI', '16-Channel Coil Package', 'Cardiac & Neuro Software'],
    image: '/src/assets/hero-mri.jpg',
    featured: true
  },
  {
    slug: 'orthopedic-clinic-mobile-mri',
    title: 'Orthopedic Clinic Launches Mobile MRI Service',
    client: 'Advanced Orthopedic Associates',
    location: 'Dallas, TX',
    industry: 'Orthopedic Clinic',
    challenge: 'As a multi-location orthopedic practice, they were referring 200+ patients per month to external imaging centers, resulting in lost revenue and patient inconvenience. Building permanent MRI suites at each location wasn\'t financially viable.',
    solution: 'LASO designed a turnkey mobile MRI solution featuring a Siemens Espree 1.5T open-bore system. The mobile trailer rotates between their 4 locations on a weekly schedule, maximizing utilization and patient access.',
    results: [
      { metric: '200+', label: 'Monthly In-House Scans' },
      { metric: '$1.2M', label: 'Annual Revenue Increase' },
      { metric: '4', label: 'Locations Served' },
      { metric: '85%', label: 'Patient Satisfaction' }
    ],
    testimonial: {
      quote: 'The mobile MRI has transformed our practice. Patients love the convenience, and we\'ve captured imaging revenue that was previously going elsewhere. LASO handled everything from permits to training.',
      author: 'Dr. Michael Torres',
      title: 'Practice Owner'
    },
    equipment: ['Siemens Espree 1.5T Mobile MRI', 'DOT-Certified Trailer', 'Full Extremity Coil Set'],
    image: '/src/assets/mobile-mri.jpg',
    featured: true
  },
  {
    slug: 'imaging-center-3t-expansion',
    title: 'Imaging Center Expands with 3T Capability',
    client: 'Metro Diagnostic Imaging',
    location: 'Phoenix, AZ',
    industry: 'Imaging Center',
    challenge: 'Competing imaging centers were marketing 3T capabilities, leading to patient migration. The center needed to add high-field imaging without the $2.5M+ price tag of new equipment while maintaining operations during the upgrade.',
    solution: 'LASO sourced a low-hours Siemens MAGNETOM Verio 3.0T with Tim technology. We coordinated overnight installations and weekend training to minimize operational disruption, completing the full project in 45 days.',
    results: [
      { metric: '40%', label: 'New Patient Volume' },
      { metric: '$1.8M', label: 'Equipment Savings' },
      { metric: '45 Days', label: 'Project Timeline' },
      { metric: '0 Days', label: 'Operation Downtime' }
    ],
    testimonial: {
      quote: 'Adding 3T capability was a game-changer for our referral patterns. Neurologists and orthopedic surgeons specifically request our center now. LASO made a complex project feel effortless.',
      author: 'Jennifer Walsh',
      title: 'Operations Director'
    },
    equipment: ['Siemens MAGNETOM Verio 3.0T', 'Tim Technology Suite', '32-Channel Head Coil'],
    image: '/src/assets/mri-system-1.jpg',
    featured: false
  },
  {
    slug: 'rural-hospital-first-mri',
    title: 'Rural Hospital Brings MRI Services to Underserved Community',
    client: 'Valley Community Hospital',
    location: 'Amarillo, TX',
    industry: 'Rural Hospital',
    challenge: 'Patients had to travel 90+ miles for MRI scans, causing delayed diagnoses and patient hardship. The hospital\'s limited budget and facility constraints seemed to make MRI installation impossible.',
    solution: 'LASO provided a compact Philips Achieva 1.5T system designed for smaller spaces. Our engineers created a custom RF shielding solution that worked within their existing building footprint, saving $200K in construction costs.',
    results: [
      { metric: '2,400+', label: 'Patients Served Annually' },
      { metric: '90 Miles', label: 'Travel Eliminated' },
      { metric: '$200K', label: 'Construction Savings' },
      { metric: '2 Days', label: 'Average Scan Wait Time' }
    ],
    testimonial: {
      quote: 'Our patients no longer have to make that 3-hour round trip for an MRI. LASO understood our constraints and delivered a solution that fit our budget and our building. This has been life-changing for our community.',
      author: 'Dr. Robert Garcia',
      title: 'Hospital Administrator'
    },
    equipment: ['Philips Achieva 1.5T Compact', 'Custom RF Shielding', 'Spine & Body Coil Package'],
    image: '/src/assets/promo-install.jpg',
    featured: false
  },
  {
    slug: 'veterinary-specialty-mri',
    title: 'Veterinary Specialty Hospital Adds Advanced Imaging',
    client: 'Southwest Veterinary Specialists',
    location: 'San Antonio, TX',
    industry: 'Veterinary',
    challenge: 'As the only specialty veterinary hospital in the region, they were referring critical neuro cases to facilities 150 miles away. Pet owners wanted local options for their animals\' diagnostic imaging needs.',
    solution: 'LASO adapted a refurbished GE Signa HDe 1.5T for veterinary use, including custom patient tables and coil adapters. The compact footprint fit their existing surgery wing expansion.',
    results: [
      { metric: '500+', label: 'Pets Scanned First Year' },
      { metric: '35%', label: 'Revenue Increase' },
      { metric: '150 Miles', label: 'Travel Saved for Pet Owners' },
      { metric: 'Same Day', label: 'Emergency Scan Availability' }
    ],
    testimonial: {
      quote: 'LASO understood the unique requirements of veterinary imaging. From custom coils to training our staff on animal positioning, they went above and beyond. Our clients are thrilled to have this capability locally.',
      author: 'Dr. Amanda Foster, DVM',
      title: 'Chief of Veterinary Neurology'
    },
    equipment: ['GE Signa HDe 1.5T', 'Veterinary Table Adapter', 'Multi-size Coil Package'],
    image: '/src/assets/ct-scanner.jpg',
    featured: false
  }
];

export const getIndustries = () => {
  const industries = new Set(caseStudies.map(cs => cs.industry));
  return Array.from(industries);
};

export const getCaseStudyBySlug = (slug: string) => {
  return caseStudies.find(cs => cs.slug === slug);
};

export const getFeaturedCaseStudies = () => {
  return caseStudies.filter(cs => cs.featured);
};
