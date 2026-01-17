// Quotable services catalog derived from serviceContent.ts
export interface QuotableService {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
  priceType: 'fixed' | 'estimate' | 'hourly' | 'per_visit' | 'per_day';
  priceLabel?: string;
}

export const serviceCategories = [
  { id: 'installation', label: 'Installation', color: 'bg-blue-100 text-blue-800' },
  { id: 'maintenance', label: 'Maintenance', color: 'bg-green-100 text-green-800' },
  { id: 'cryogenic', label: 'Cryogenic', color: 'bg-purple-100 text-purple-800' },
  { id: 'consulting', label: 'Consulting', color: 'bg-orange-100 text-orange-800' },
  { id: 'training', label: 'Training', color: 'bg-pink-100 text-pink-800' },
  { id: 'parts', label: 'Parts & Upgrades', color: 'bg-cyan-100 text-cyan-800' },
];

export const quotableServices: QuotableService[] = [
  // Installation Services
  {
    id: 'mri-installation',
    name: 'MRI Installation',
    category: 'installation',
    basePrice: 15000,
    description: 'Complete MRI system installation from site prep to first scan',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
  {
    id: 'ct-installation',
    name: 'CT Scanner Installation',
    category: 'installation',
    basePrice: 12000,
    description: 'Full CT system installation with calibration',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
  {
    id: 'relocation',
    name: 'Equipment Relocation',
    category: 'installation',
    basePrice: 25000,
    description: 'Safe de-install, transport, and reinstall at new location',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
  {
    id: 'deinstallation',
    name: 'De-installation & Removal',
    category: 'installation',
    basePrice: 8000,
    description: 'Professional equipment removal with helium recovery',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
  
  // Maintenance Services
  {
    id: 'preventive-maintenance',
    name: 'Preventive Maintenance Visit',
    category: 'maintenance',
    basePrice: 3500,
    description: 'Comprehensive PM including calibration and testing',
    priceType: 'per_visit',
    priceLabel: 'Per visit',
  },
  {
    id: 'pm-annual-contract',
    name: 'Annual PM Contract',
    category: 'maintenance',
    basePrice: 12000,
    description: '4 quarterly PM visits with priority scheduling',
    priceType: 'fixed',
    priceLabel: 'Per year',
  },
  {
    id: 'emergency-repair',
    name: 'Emergency Repair Service',
    category: 'maintenance',
    basePrice: 2500,
    description: '24/7 emergency response for critical failures',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
  {
    id: 'remote-diagnostics',
    name: 'Remote Diagnostics',
    category: 'maintenance',
    basePrice: 500,
    description: 'Remote system analysis and troubleshooting',
    priceType: 'fixed',
  },
  
  // Cryogenic Services
  {
    id: 'helium-refill',
    name: 'Helium Refill Service',
    category: 'cryogenic',
    basePrice: 8000,
    description: 'MRI helium refill including monitoring and quality checks',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
  {
    id: 'coldhead-service',
    name: 'Coldhead Service/Replacement',
    category: 'cryogenic',
    basePrice: 15000,
    description: 'Cryogenic coldhead maintenance or replacement',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
  {
    id: 'compressor-service',
    name: 'Compressor Service',
    category: 'cryogenic',
    basePrice: 5000,
    description: 'Helium compressor maintenance and repair',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
  {
    id: 'quench-recovery',
    name: 'Quench Recovery',
    category: 'cryogenic',
    basePrice: 35000,
    description: 'Complete magnet quench recovery service',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
  
  // Consulting Services
  {
    id: 'site-planning',
    name: 'Site Planning & Assessment',
    category: 'consulting',
    basePrice: 5000,
    description: 'Complete site evaluation for MRI/CT installation',
    priceType: 'fixed',
  },
  {
    id: 'rf-shielding-design',
    name: 'RF Shielding Design',
    category: 'consulting',
    basePrice: 7500,
    description: 'Custom RF shielding specification and design',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
  {
    id: 'equipment-evaluation',
    name: 'Equipment Evaluation',
    category: 'consulting',
    basePrice: 2500,
    description: 'Pre-purchase equipment condition assessment',
    priceType: 'fixed',
  },
  {
    id: 'regulatory-consulting',
    name: 'Regulatory Compliance Consulting',
    category: 'consulting',
    basePrice: 3500,
    description: 'FDA, state, and accreditation compliance guidance',
    priceType: 'fixed',
  },
  
  // Training Services
  {
    id: 'operator-training',
    name: 'Operator Training',
    category: 'training',
    basePrice: 2500,
    description: 'Hands-on operator training for technologists',
    priceType: 'per_day',
    priceLabel: 'Per day',
  },
  {
    id: 'applications-training',
    name: 'Applications Training',
    category: 'training',
    basePrice: 3500,
    description: 'Advanced protocol and applications training',
    priceType: 'per_day',
    priceLabel: 'Per day',
  },
  {
    id: 'service-training',
    name: 'Service Engineer Training',
    category: 'training',
    basePrice: 5000,
    description: 'Technical service and maintenance training',
    priceType: 'per_day',
    priceLabel: 'Per day',
  },
  
  // Parts & Upgrades
  {
    id: 'software-upgrade',
    name: 'Software Upgrade',
    category: 'parts',
    basePrice: 10000,
    description: 'System software upgrade to latest version',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
  {
    id: 'coil-repair',
    name: 'RF Coil Repair',
    category: 'parts',
    basePrice: 3000,
    description: 'MRI RF coil diagnosis and repair',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
  {
    id: 'gradient-amp-repair',
    name: 'Gradient Amplifier Repair',
    category: 'parts',
    basePrice: 8000,
    description: 'Gradient amplifier diagnosis and repair',
    priceType: 'estimate',
    priceLabel: 'Starting at',
  },
];

export const getServicesByCategory = (category: string) => {
  return quotableServices.filter(s => s.category === category);
};

export const getServiceById = (id: string) => {
  return quotableServices.find(s => s.id === id);
};

export const formatServicePrice = (service: QuotableService) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(service.basePrice);
  
  if (service.priceLabel) {
    return `${service.priceLabel} ${formatted}`;
  }
  return formatted;
};
