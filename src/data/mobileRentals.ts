export interface RentalSpecification {
  label: string;
  value: string;
}

export interface RentalRate {
  period: string;
  rate: string;
  notes?: string;
}

export interface SiteRequirement {
  category: string;
  requirements: string[];
}

export interface RentalFAQ {
  question: string;
  answer: string;
}

export interface MobileRentalContent {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  answerCapsule: string;
  heroSubtitle: string;
  description: string;
  specifications: RentalSpecification[];
  siteRequirements: SiteRequirement[];
  rates: RentalRate[];
  faqs: RentalFAQ[];
  keywords: string[];
  relatedLinks: { label: string; href: string }[];
}

export const mobileRentals: Record<string, MobileRentalContent> = {
  'mri': {
    slug: 'mri',
    title: 'Mobile MRI Rental',
    metaTitle: 'Mobile MRI Rental | Nationwide Delivery | LASO Imaging',
    metaDescription: 'Rent mobile MRI units with flexible terms from $15,000/month. 1.5T and 3T systems available nationwide. 48-hour deployment, full technical support included.',
    answerCapsule: 'Mobile MRI rental costs range from $15,000 to $45,000 per month depending on field strength and lease duration. LASO Imaging provides 1.5T and 3T mobile MRI systems with nationwide delivery, on-site installation, and 24/7 technical support included in all rental agreements.',
    heroSubtitle: 'Flexible mobile MRI solutions for hospitals, imaging centers, and healthcare facilities nationwide',
    description: `## Why Rent a Mobile MRI?

Mobile MRI rental provides healthcare facilities with immediate access to advanced imaging capabilities without the capital investment required for permanent installation. Whether you're expanding capacity during peak demand, replacing equipment during renovations, or testing new service lines, mobile MRI units offer the flexibility modern healthcare requires.

### Ideal Use Cases for Mobile MRI Rental

**Capacity Expansion:** When patient volumes exceed your current imaging capacity, a mobile MRI unit can be deployed within 48-72 hours to eliminate backlogs and reduce wait times.

**Construction & Renovation:** During facility upgrades or MRI suite renovations, maintain continuous imaging services with a mobile unit positioned on-site.

**Disaster Recovery:** After equipment failures or natural disasters, mobile MRI provides critical backup imaging while repairs or replacements are completed.

**New Service Evaluation:** Test patient demand for MRI services in new markets before committing to permanent installation.

## Our Mobile MRI Fleet

LASO Imaging maintains a diverse fleet of mobile MRI systems from leading manufacturers including GE Healthcare, Siemens Healthineers, and Philips Healthcare. All units undergo rigorous quality assurance protocols and are maintained to OEM specifications.

### 1.5T Mobile MRI Systems

Our 1.5T mobile fleet includes popular models such as the GE Signa HDxt, Siemens Avanto, and Philips Achieva. These workhorse systems deliver excellent image quality for routine clinical applications including:

- Neuroimaging (brain, spine)
- Musculoskeletal imaging
- Abdominal and pelvic imaging
- Cardiac MRI
- Breast MRI

### 3T Mobile MRI Systems

For facilities requiring higher resolution imaging, our 3T mobile units provide enhanced signal-to-noise ratio and superior image quality. Available models include the GE Discovery MR750 and Siemens Skyra.

## Rental Process

**1. Consultation:** Our team assesses your imaging needs, site requirements, and preferred timeline.

**2. Site Survey:** We evaluate your location for power availability, pad dimensions, and patient access.

**3. Deployment:** Our installation team delivers, positions, and commissions the mobile unit.

**4. Operations:** Comprehensive training and 24/7 technical support throughout the rental period.

**5. Return:** We handle all deinstallation and removal logistics at lease end.`,
    specifications: [
      { label: 'Field Strength', value: '1.5T and 3T options' },
      { label: 'Manufacturers', value: 'GE, Siemens, Philips' },
      { label: 'Trailer Length', value: '48-53 feet' },
      { label: 'Patient Throughput', value: '8-12 exams/day' },
      { label: 'Deployment Time', value: '48-72 hours' },
      { label: 'Coverage', value: 'All 50 states' },
    ],
    siteRequirements: [
      {
        category: 'Electrical',
        requirements: [
          '480V 3-phase power (200A minimum)',
          'Dedicated transformer may be required',
          'Backup generator connection available',
        ],
      },
      {
        category: 'Site Preparation',
        requirements: [
          'Level concrete or asphalt pad (minimum 12\' x 60\')',
          'Adequate weight capacity (80,000+ lbs)',
          'Clear access for trailer delivery',
        ],
      },
      {
        category: 'Patient Access',
        requirements: [
          'ADA-compliant ramp or lift',
          'Covered walkway (recommended)',
          'Adequate parking for patients',
        ],
      },
    ],
    rates: [
      { period: 'Daily', rate: '$2,500 - $4,500', notes: 'Minimum 5-day rental' },
      { period: 'Weekly', rate: '$12,000 - $25,000', notes: '7-day rate' },
      { period: 'Monthly', rate: '$15,000 - $45,000', notes: '30-day minimum' },
      { period: 'Long-term (6+ months)', rate: '$12,000 - $35,000/mo', notes: 'Significant discounts available' },
    ],
    faqs: [
      {
        question: 'How quickly can a mobile MRI be delivered?',
        answer: 'Standard deployment is 48-72 hours from contract signing for locations within the continental United States. Emergency deployments may be available within 24 hours depending on unit availability and location.',
      },
      {
        question: 'What is included in the rental rate?',
        answer: 'All rentals include delivery, installation, commissioning, operator training, 24/7 technical support, preventive maintenance, and removal at lease end. Helium fills and major repairs are typically included in long-term rentals.',
      },
      {
        question: 'Do we need to provide our own technologists?',
        answer: 'Yes, you must provide licensed MRI technologists to operate the equipment. LASO provides comprehensive training on the specific system. We can recommend staffing agencies if you need temporary technologists.',
      },
      {
        question: 'What happens if the MRI breaks down?',
        answer: 'Our 24/7 support team responds to all service calls. For critical issues, an engineer is dispatched within 4 hours. We maintain backup units that can be deployed if repairs extend beyond 48 hours.',
      },
      {
        question: 'Can we extend the rental period?',
        answer: 'Yes, rental extensions are accommodated based on unit availability. We recommend discussing extension options at least 30 days before your original end date to ensure availability.',
      },
    ],
    keywords: [
      'mobile MRI rental',
      'portable MRI unit',
      'mobile MRI lease',
      'temporary MRI',
      'MRI trailer rental',
      'mobile imaging rental',
    ],
    relatedLinks: [
      { label: 'MRI Installation Services', href: '/services/mri-installation' },
      { label: 'Mobile MRI Systems for Sale', href: '/products?query=product_type:"Mobile MRI Systems"' },
      { label: 'Preventive Maintenance', href: '/services/preventive-maintenance' },
      { label: 'Mobile Rental Rates Guide', href: '/guides/mobile-rental-rates' },
      { label: 'California Service', href: '/service-areas/california' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  'ct': {
    slug: 'ct',
    title: 'Mobile CT Rental',
    metaTitle: 'Mobile CT Scanner Rental | Nationwide Service | LASO Imaging',
    metaDescription: 'Rent mobile CT scanners from $8,000/month. 16-slice to 128-slice systems available. Rapid deployment nationwide with full technical support and training included.',
    answerCapsule: 'Mobile CT rental costs range from $8,000 to $25,000 per month based on slice count and lease duration. LASO Imaging offers 16-slice through 128-slice mobile CT scanners with nationwide delivery, installation, and 24/7 technical support as standard with all rental agreements.',
    heroSubtitle: 'Flexible mobile CT solutions for emergency rooms, trauma centers, and outpatient facilities',
    description: `## Mobile CT Rental Solutions

Mobile CT scanners provide healthcare facilities with rapid access to diagnostic imaging when permanent installation isn't feasible or when demand exceeds existing capacity. From emergency departments requiring backup scanning to construction projects displacing existing equipment, mobile CT delivers flexibility without compromising image quality.

### When to Consider Mobile CT Rental

**Emergency Backup:** Equipment failures in busy ERs can't wait for repairs. A mobile CT unit maintains trauma and stroke imaging capabilities during downtime.

**Seasonal Demand:** Tourist destinations and seasonal communities often experience imaging volume fluctuations that mobile CT can address cost-effectively.

**Event Coverage:** Major sporting events, music festivals, and large gatherings may require on-site CT capability for emergency response.

**Facility Transitions:** New facility construction or major renovations frequently require mobile CT to maintain services during the transition.

## Our Mobile CT Fleet

LASO Imaging's mobile CT fleet includes multi-slice scanners from GE Healthcare, Siemens Healthineers, and Canon Medical Systems. All units are maintained to OEM standards and undergo regular quality assurance testing.

### Available Configurations

**16-Slice CT:** Cost-effective option for routine imaging including:
- Chest CT
- Abdominal imaging
- Musculoskeletal studies
- Basic trauma protocols

**64-Slice CT:** Enhanced capability for:
- CT angiography
- Cardiac imaging
- Complex trauma
- High-resolution chest imaging

**128-Slice CT:** Premium imaging for:
- Advanced cardiac CTA
- Stroke protocols
- Whole-body trauma
- Pediatric imaging (dose optimization)

## Rental Process

Our streamlined rental process ensures rapid deployment:

**Assessment:** We evaluate your clinical needs, patient volumes, and site conditions.

**Site Survey:** Power requirements, pad specifications, and access routes are confirmed.

**Deployment:** Delivery, positioning, and commissioning typically complete within 24-48 hours.

**Training:** Comprehensive orientation for your CT technologists on the specific system.

**Support:** 24/7 technical assistance throughout the rental period.`,
    specifications: [
      { label: 'Slice Count', value: '16, 64, or 128-slice options' },
      { label: 'Manufacturers', value: 'GE, Siemens, Canon' },
      { label: 'Trailer Length', value: '40-48 feet' },
      { label: 'Scan Time', value: 'Sub-second rotation' },
      { label: 'Deployment Time', value: '24-48 hours' },
      { label: 'Coverage', value: 'All 50 states' },
    ],
    siteRequirements: [
      {
        category: 'Electrical',
        requirements: [
          '480V 3-phase power (100A minimum)',
          'Stable voltage regulation',
          'UPS recommended for critical applications',
        ],
      },
      {
        category: 'Site Preparation',
        requirements: [
          'Level paved surface (minimum 12\' x 50\')',
          'Weight capacity 60,000+ lbs',
          'Clear overhead (no low branches or wires)',
        ],
      },
      {
        category: 'Access',
        requirements: [
          'Patient stretcher access via ramp or lift',
          'Proximity to emergency department (recommended)',
          'Staff and patient parking',
        ],
      },
    ],
    rates: [
      { period: 'Daily', rate: '$1,500 - $3,000', notes: 'Minimum 3-day rental' },
      { period: 'Weekly', rate: '$8,000 - $18,000', notes: '7-day rate' },
      { period: 'Monthly', rate: '$8,000 - $25,000', notes: '30-day minimum' },
      { period: 'Long-term (6+ months)', rate: '$6,500 - $20,000/mo', notes: 'Volume discounts available' },
    ],
    faqs: [
      {
        question: 'How fast can you deploy a mobile CT?',
        answer: 'Emergency deployments can be completed within 24 hours depending on unit availability and location. Standard deployments typically require 48-72 hours from contract execution.',
      },
      {
        question: 'What protocols are available on rental CT units?',
        answer: 'All units come with comprehensive protocol libraries for routine clinical applications. Our team can assist in transferring your facility-specific protocols to the mobile unit for workflow consistency.',
      },
      {
        question: 'Is contrast injector included?',
        answer: 'Contrast injectors are available as an add-on option. We can provide dual-head power injectors compatible with your facility\'s contrast media protocols.',
      },
      {
        question: 'What about radiation safety?',
        answer: 'All mobile CT units meet state and federal radiation safety requirements. We provide radiation survey documentation and can assist with state registration if required.',
      },
      {
        question: 'Can the mobile CT connect to our PACS?',
        answer: 'Yes, our mobile CT units include DICOM connectivity. We work with your IT team to establish secure connections to your PACS, RIS, and HIS systems.',
      },
    ],
    keywords: [
      'mobile CT rental',
      'portable CT scanner',
      'mobile CT lease',
      'temporary CT scanner',
      'CT trailer rental',
      'emergency CT rental',
    ],
    relatedLinks: [
      { label: 'CT Installation Services', href: '/services/ct-installation' },
      { label: 'CT Scanners for Sale', href: '/products?query=product_type:"8-Slice CT" OR product_type:"16-Slice CT" OR product_type:"64-Slice CT"' },
      { label: 'Emergency Repairs', href: '/services/emergency-repairs' },
      { label: 'Mobile Rental Rates Guide', href: '/guides/mobile-rental-rates' },
      { label: 'Nationwide Coverage', href: '/service-areas/nationwide' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  'pet-ct': {
    slug: 'pet-ct',
    title: 'Mobile PET/CT Rental',
    metaTitle: 'Mobile PET/CT Scanner Rental | Oncology Imaging | LASO Imaging',
    metaDescription: 'Rent mobile PET/CT scanners for oncology imaging. Full-service rentals include radiopharmaceutical coordination, physicist support, and nationwide delivery.',
    answerCapsule: 'Mobile PET/CT rental costs range from $35,000 to $75,000 per month depending on system configuration and service level. LASO Imaging provides comprehensive mobile PET/CT solutions including radiopharmaceutical coordination, physics support, and 24/7 technical service nationwide.',
    heroSubtitle: 'Advanced molecular imaging for oncology, cardiology, and neurology applications',
    description: `## Mobile PET/CT Rental for Advanced Molecular Imaging

Mobile PET/CT scanners bring advanced molecular imaging capabilities to facilities without the significant capital investment required for permanent installation. These hybrid systems combine the metabolic imaging of PET with the anatomical detail of CT, providing critical diagnostic information for oncology, cardiology, and neurology applications.

### Clinical Applications

**Oncology:** Mobile PET/CT enables comprehensive cancer care including:
- Initial staging and tumor characterization
- Treatment response monitoring
- Recurrence surveillance
- Radiation therapy planning

**Cardiology:** Assess myocardial viability and perfusion for:
- Coronary artery disease evaluation
- Heart failure assessment
- Cardiac sarcoidosis

**Neurology:** Brain imaging for:
- Dementia evaluation
- Epilepsy localization
- Brain tumor assessment

## Mobile PET/CT Fleet

Our mobile PET/CT units feature the latest digital detector technology from leading manufacturers. Each system is maintained to the highest standards and calibrated for optimal imaging performance.

### System Features

- **Digital Detectors:** Enhanced sensitivity and resolution
- **Time-of-Flight (TOF):** Improved image quality and reduced dose
- **Extended Axial Coverage:** Faster whole-body imaging
- **Low-Dose CT:** Minimized radiation exposure
- **Advanced Reconstruction:** AI-enhanced image processing

## Full-Service PET/CT Rental

Unlike mobile MRI or CT rental, mobile PET/CT requires additional coordination for radiopharmaceuticals and physics support. LASO provides comprehensive service packages:

### Radiopharmaceutical Coordination

We coordinate FDG and other radiopharmaceutical delivery with certified nuclear pharmacies. Our team manages:
- Dose scheduling and delivery logistics
- Quality assurance and documentation
- Regulatory compliance

### Physics Support

Licensed medical physicists provide:
- Equipment quality assurance
- Protocol optimization
- Regulatory compliance documentation
- Staff training and competency assessment

### Technical Support

- 24/7 remote monitoring and diagnostics
- On-site engineering support
- Preventive maintenance
- Emergency response within 4 hours`,
    specifications: [
      { label: 'PET Detector', value: 'Digital SiPM technology' },
      { label: 'CT Capability', value: '16-64 slice configurations' },
      { label: 'Manufacturers', value: 'GE, Siemens, Philips' },
      { label: 'Trailer Length', value: '53 feet' },
      { label: 'Patient Throughput', value: '8-15 exams/day' },
      { label: 'Deployment Time', value: '72-96 hours' },
    ],
    siteRequirements: [
      {
        category: 'Electrical',
        requirements: [
          '480V 3-phase power (200A minimum)',
          'Uninterruptible power supply (recommended)',
          'Dedicated electrical panel',
        ],
      },
      {
        category: 'Site Preparation',
        requirements: [
          'Large level pad (minimum 14\' x 65\')',
          'Weight capacity 90,000+ lbs',
          'Clear access for 53\' trailer',
        ],
      },
      {
        category: 'Radiopharmaceutical',
        requirements: [
          'Secure dose storage area',
          'Hot lab or dose preparation space',
          'Waste storage and disposal plan',
        ],
      },
      {
        category: 'Regulatory',
        requirements: [
          'NRC or Agreement State license',
          'Authorized user credentials',
          'Radiation safety program',
        ],
      },
    ],
    rates: [
      { period: 'Daily', rate: '$4,000 - $7,500', notes: 'Minimum 2-day rental' },
      { period: 'Weekly', rate: '$25,000 - $45,000', notes: 'Includes physics support' },
      { period: 'Monthly', rate: '$35,000 - $75,000', notes: 'Full service package' },
      { period: 'Per-scan model', rate: 'Contact for pricing', notes: 'Available for high-volume facilities' },
    ],
    faqs: [
      {
        question: 'Do you provide FDG and other radiopharmaceuticals?',
        answer: 'Yes, we coordinate radiopharmaceutical delivery with certified nuclear pharmacies. FDG, NaF, and other tracers can be arranged based on your clinical needs and local availability.',
      },
      {
        question: 'What licensing is required to operate mobile PET/CT?',
        answer: 'Facilities must hold a valid NRC or Agreement State radioactive materials license with authorization for the radiopharmaceuticals being used. An authorized user (physician) must be designated for the program.',
      },
      {
        question: 'Is physics support included?',
        answer: 'Yes, our full-service rental includes licensed medical physicist support for equipment QA, protocol optimization, and regulatory compliance. Weekly or monthly physicist visits are scheduled based on scan volume.',
      },
      {
        question: 'How many patients can be scanned per day?',
        answer: 'Patient throughput depends on protocols and uptake times. Typical FDG oncology schedules accommodate 8-12 patients per day. Extended hours can increase capacity to 15+ patients.',
      },
      {
        question: 'Can we bill for mobile PET/CT services?',
        answer: 'Yes, mobile PET/CT services are billable under the same codes as fixed installations. We provide documentation required for Medicare and commercial payer billing compliance.',
      },
    ],
    keywords: [
      'mobile PET/CT rental',
      'portable PET scanner',
      'mobile PET CT lease',
      'oncology imaging rental',
      'mobile molecular imaging',
      'PET/CT trailer',
    ],
    relatedLinks: [
      { label: 'PET/CT Systems for Sale', href: '/products?query=product_type:"PET/CT"' },
      { label: 'Oncology Imaging Solutions', href: '/services' },
      { label: 'Mobile Rental Rates Guide', href: '/guides/mobile-rental-rates' },
      { label: 'Nationwide Coverage', href: '/service-areas/nationwide' },
      { label: 'Request a Quote', href: '/quote' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
};

export const getMobileRental = (slug: string): MobileRentalContent | undefined => {
  return mobileRentals[slug];
};

export const getAllMobileRentals = (): MobileRentalContent[] => {
  return Object.values(mobileRentals);
};
