export interface ServiceContent {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  overview: string;
  processSteps: { step: string; description: string }[];
  benefits: string[];
  equipmentBrands: string[];
  faqs: { question: string; answer: string }[];
  relatedServices: { slug: string; title: string }[];
  keywords: string[];
  geoKeywords: string[];
}

export const serviceContent: Record<string, ServiceContent> = {
  // INSTALLATION SERVICES
  'mri-installation': {
    slug: 'mri-installation',
    title: 'MRI Installation Services',
    metaTitle: 'MRI Installation Services | Expert System Setup | LASO Imaging',
    metaDescription: 'Professional MRI installation services in Sun Valley, CA. Our certified engineers ensure seamless system setup, RF shielding, and compliance. Nationwide service available.',
    heroDescription: 'Complete MRI system installation from site preparation to first scan. Our certified engineers have installed 500+ systems nationwide.',
    overview: `LASO's MRI installation team brings decades of combined experience to every project. We handle everything from initial site assessment to final calibration, ensuring your system is operational on schedule and within budget. Our engineers are OEM-trained on GE, Siemens, Philips, and Canon/Toshiba systems, providing the expertise needed for seamless installations.

Whether you're adding imaging capacity, upgrading existing equipment, or building a new facility, our project managers coordinate every detail. We work directly with contractors, architects, and your facility team to minimize disruptions and maximize efficiency.`,
    processSteps: [
      { step: 'Site Assessment', description: 'Our engineers evaluate your facility for RF shielding requirements, power needs, structural considerations, and HVAC capacity.' },
      { step: 'Project Planning', description: 'We develop a detailed timeline, coordinate with vendors, and create contingency plans to ensure on-time delivery.' },
      { step: 'Equipment Delivery', description: 'Professional rigging and transport of MRI components with specialized equipment and trained personnel.' },
      { step: 'Magnet Installation', description: 'Precise positioning and leveling of the magnet, followed by cryogenic system connection and cooling.' },
      { step: 'System Integration', description: 'Connection of all components including gradient amplifiers, RF systems, patient table, and workstation.' },
      { step: 'Calibration & Testing', description: 'Complete system calibration, phantom imaging, and quality assurance verification.' },
      { step: 'Training & Handoff', description: 'Operator training for your staff and final documentation package delivery.' }
    ],
    benefits: [
      'Single-source accountability from start to finish',
      'OEM-trained engineers for all major manufacturers',
      'Minimized downtime with detailed project management',
      'Compliance with all FDA, state, and local regulations',
      'Warranty protection from day one',
      '24/7 support during critical installation phases'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'How long does a typical MRI installation take?', answer: 'Most installations are completed in 2-4 weeks, depending on site readiness and system complexity. We provide detailed timelines during the planning phase.' },
      { question: 'Do you handle RF shielding?', answer: 'Yes, we work with certified RF shielding contractors and can manage the entire shielding project or coordinate with your existing vendors.' },
      { question: 'What about permits and inspections?', answer: 'Our team handles all necessary permits and coordinates required inspections, including state radiation control and local building inspections.' },
      { question: 'Can you install systems purchased elsewhere?', answer: 'Absolutely. We install systems regardless of where they were purchased and can evaluate equipment before your purchase.' }
    ],
    relatedServices: [
      { slug: 'site-planning', title: 'Site Planning & RF Shielding' },
      { slug: 'relocation', title: 'Equipment Relocation' },
      { slug: 'operator-training', title: 'Operator Training' }
    ],
    keywords: ['MRI installation', 'MRI system setup', 'medical imaging installation', 'MRI site preparation'],
    geoKeywords: ['MRI installation California', 'MRI installation Los Angeles', 'MRI installation Sun Valley CA']
  },

  'relocation': {
    slug: 'relocation',
    title: 'MRI Relocation Services',
    metaTitle: 'MRI Relocation Services | Safe Equipment Moving | LASO Imaging',
    metaDescription: 'Expert MRI relocation services from Sun Valley, CA. We safely de-install, transport, and reinstall your imaging equipment. Nationwide coverage with certified engineers.',
    heroDescription: 'Safe and efficient MRI relocation with minimal downtime. We handle every aspect from de-installation to recommissioning at your new site.',
    overview: `Relocating an MRI system requires specialized expertise to protect your multi-million dollar investment. LASO's relocation team has successfully moved hundreds of systems across the country, from single-room relocations to complete facility moves.

Our comprehensive relocation service includes careful de-installation, specialized crating and transport, and professional reinstallation at the destination. We maintain cryogenic systems throughout the move when possible, saving significant time and helium costs.`,
    processSteps: [
      { step: 'Pre-Move Assessment', description: 'Evaluate current and destination sites, identify potential challenges, and develop a detailed relocation plan.' },
      { step: 'Cryogenic Planning', description: 'Determine if magnet can remain cold during transport or if a controlled ramp-down is needed.' },
      { step: 'Safe De-installation', description: 'Systematic disconnection and removal of all components with detailed documentation.' },
      { step: 'Professional Crating', description: 'Custom crating and packaging to protect sensitive components during transport.' },
      { step: 'Specialized Transport', description: 'Air-ride transport with real-time monitoring for temperature-sensitive components.' },
      { step: 'Reinstallation', description: 'Complete system reinstallation following manufacturer specifications.' },
      { step: 'Testing & Certification', description: 'Comprehensive testing to verify system performance meets original specifications.' }
    ],
    benefits: [
      'Preserve your equipment investment with proper handling',
      'Minimize downtime with experienced project management',
      'Cost savings through cold magnet moves when feasible',
      'Insurance coverage throughout the relocation process',
      'Single point of contact for the entire project',
      'Performance guarantee after reinstallation'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'Can the magnet stay cold during the move?', answer: 'In many cases, yes. Cold moves save significant time and helium costs. We evaluate each situation to determine the best approach.' },
      { question: 'How long does relocation take?', answer: 'Most relocations take 3-6 weeks from de-installation to operational status, depending on site readiness and distance.' },
      { question: 'What if we need to store the equipment?', answer: 'We offer climate-controlled storage in our facilities if there is a gap between de-installation and reinstallation.' },
      { question: 'Do you handle international relocations?', answer: 'Yes, we coordinate international relocations including customs documentation and overseas shipping.' }
    ],
    relatedServices: [
      { slug: 'deinstallation', title: 'De-installation Services' },
      { slug: 'mri-installation', title: 'MRI Installation' },
      { slug: 'site-planning', title: 'Site Planning' }
    ],
    keywords: ['MRI relocation', 'MRI moving', 'medical equipment relocation', 'imaging equipment transport'],
    geoKeywords: ['MRI relocation California', 'MRI moving Los Angeles', 'medical equipment transport nationwide']
  },

  'site-planning': {
    slug: 'site-planning',
    title: 'Site Planning & RF Shielding',
    metaTitle: 'MRI Site Planning & RF Shielding | Expert Consultation | LASO Imaging',
    metaDescription: 'Comprehensive MRI site planning and RF shielding services from Sun Valley, CA. Ensure optimal installation with expert guidance on space, power, and shielding requirements.',
    heroDescription: 'Expert site planning ensures your MRI installation is successful from day one. We evaluate every requirement before equipment arrives.',
    overview: `Proper site planning is critical for MRI installation success. LASO's site planning services evaluate all technical requirements including structural support, RF shielding, electrical infrastructure, HVAC capacity, and regulatory compliance.

Our engineers work with your architects and contractors to ensure the space meets all manufacturer specifications. We identify potential issues early, preventing costly delays and change orders during installation.`,
    processSteps: [
      { step: 'Initial Consultation', description: 'Discuss your imaging needs, equipment selection, and facility constraints.' },
      { step: 'Site Survey', description: 'On-site evaluation of existing conditions, measurements, and infrastructure assessment.' },
      { step: 'RF Environment Analysis', description: 'Measure ambient RF levels and determine shielding requirements.' },
      { step: 'Design Review', description: 'Review architectural plans and provide feedback on MRI room specifications.' },
      { step: 'Shielding Specification', description: 'Develop RF shielding specifications and coordinate with certified installers.' },
      { step: 'Vendor Coordination', description: 'Work with electrical, HVAC, and construction contractors to ensure compliance.' },
      { step: 'Final Verification', description: 'Pre-installation verification that all site requirements are met.' }
    ],
    benefits: [
      'Avoid costly construction delays and change orders',
      'Ensure optimal image quality with proper shielding',
      'Meet all regulatory requirements from the start',
      'Reduce installation timeline with thorough preparation',
      'Expert guidance on equipment selection',
      'Long-term planning for future upgrades'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'How early should site planning begin?', answer: 'Ideally, site planning should begin 6-12 months before the planned installation date to allow time for construction and equipment procurement.' },
      { question: 'What are typical RF shielding costs?', answer: 'RF shielding typically costs $50,000-$150,000 depending on room size and local RF environment. We help optimize designs to control costs.' },
      { question: 'Can you retrofit existing MRI rooms?', answer: 'Yes, we specialize in upgrading existing MRI suites for new equipment, including shielding improvements and infrastructure upgrades.' },
      { question: 'Do you work with our existing contractors?', answer: 'Absolutely. We collaborate with your team and provide the specifications they need to complete the work correctly.' }
    ],
    relatedServices: [
      { slug: 'mri-installation', title: 'MRI Installation' },
      { slug: 'relocation', title: 'Equipment Relocation' },
      { slug: 'preventive-maintenance', title: 'Preventive Maintenance' }
    ],
    keywords: ['MRI site planning', 'RF shielding', 'MRI room design', 'medical imaging construction'],
    geoKeywords: ['MRI site planning California', 'RF shielding Los Angeles', 'MRI construction Sun Valley']
  },

  'deinstallation': {
    slug: 'deinstallation',
    title: 'MRI De-installation & Removal',
    metaTitle: 'MRI De-installation & Removal Services | LASO Imaging',
    metaDescription: 'Professional MRI de-installation and removal services from Sun Valley, CA. Safe equipment removal, disposal, and site restoration. Nationwide service.',
    heroDescription: 'Safe and compliant MRI de-installation with proper disposal or preparation for resale. We handle the entire removal process.',
    overview: `When it's time to replace or remove your MRI system, LASO provides comprehensive de-installation services. Our team safely removes all components while protecting your facility and ensuring environmental compliance.

Whether you're selling the equipment, disposing of it, or preparing for a new installation, we manage every aspect of the removal process. We also offer equipment buyback programs for systems with remaining value.`,
    processSteps: [
      { step: 'Pre-Removal Assessment', description: 'Evaluate system condition, cryogenic status, and removal requirements.' },
      { step: 'Helium Recovery', description: 'Safely recover and recycle helium from the cryogenic system when applicable.' },
      { step: 'System Disconnect', description: 'Proper disconnection of all electrical, cryogenic, and data systems.' },
      { step: 'Component Removal', description: 'Careful removal of magnet, patient table, electronics, and accessories.' },
      { step: 'Site Restoration', description: 'Remove RF shielding if requested and restore the room to shell condition.' },
      { step: 'Documentation', description: 'Provide all necessary documentation for regulatory compliance and disposal.' }
    ],
    benefits: [
      'EPA-compliant disposal of all materials',
      'Helium recovery and recycling',
      'Equipment buyback programs available',
      'Minimized facility disruption',
      'Complete documentation for audits',
      'Site restoration services'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'Can you buy our old MRI system?', answer: 'Yes, we offer competitive buyback pricing for systems with resale value. Contact us for an equipment evaluation.' },
      { question: 'What happens to the helium?', answer: 'We recover and recycle helium whenever possible. This is both environmentally responsible and can offset some removal costs.' },
      { question: 'How long does de-installation take?', answer: 'Most de-installations are completed in 3-5 days, depending on the system and site conditions.' },
      { question: 'Do you remove the RF shielding?', answer: 'We can remove shielding if requested, or leave it in place if you are installing replacement equipment.' }
    ],
    relatedServices: [
      { slug: 'relocation', title: 'Equipment Relocation' },
      { slug: 'mri-installation', title: 'MRI Installation' },
      { slug: 'system-recovery', title: 'System Recovery' }
    ],
    keywords: ['MRI de-installation', 'MRI removal', 'medical equipment disposal', 'MRI decommissioning'],
    geoKeywords: ['MRI removal California', 'MRI de-installation Los Angeles', 'medical equipment disposal nationwide']
  },

  // MAINTENANCE SERVICES
  'preventive-maintenance': {
    slug: 'preventive-maintenance',
    title: 'MRI Preventive Maintenance Programs',
    metaTitle: 'MRI Preventive Maintenance Programs | Expert Service | LASO Imaging',
    metaDescription: 'Comprehensive MRI preventive maintenance programs from Sun Valley, CA. Maximize uptime, extend equipment life, and reduce costs. 24/7 support available.',
    heroDescription: 'Proactive maintenance keeps your MRI running at peak performance. Our PM programs prevent failures before they happen.',
    overview: `LASO's preventive maintenance programs are designed to maximize your MRI system uptime and extend equipment lifespan. Our OEM-trained engineers perform comprehensive inspections and proactive component replacement based on manufacturer guidelines and real-world experience.

We offer flexible PM programs tailored to your budget and operational needs, from basic inspection packages to comprehensive full-coverage plans. Every program includes detailed reporting and recommendations to help you plan for future maintenance needs.`,
    processSteps: [
      { step: 'System Assessment', description: 'Initial evaluation of your equipment condition, history, and maintenance needs.' },
      { step: 'Program Design', description: 'Develop a customized PM schedule based on manufacturer guidelines and usage patterns.' },
      { step: 'Scheduled Visits', description: 'Regular on-site inspections by certified engineers following detailed checklists.' },
      { step: 'Component Testing', description: 'Test and calibrate critical systems including gradients, RF, and cryogenics.' },
      { step: 'Proactive Replacement', description: 'Replace wear components before they fail to prevent unexpected downtime.' },
      { step: 'Documentation', description: 'Provide detailed reports on system condition and recommendations.' },
      { step: 'Remote Monitoring', description: 'Optional remote system monitoring for early problem detection.' }
    ],
    benefits: [
      'Reduce unexpected downtime by up to 70%',
      'Extend equipment lifespan by 5-10 years',
      'Lower total cost of ownership',
      'Maintain optimal image quality',
      'Meet regulatory compliance requirements',
      'Priority response for PM customers'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'How often should PM be performed?', answer: 'We recommend quarterly PM visits for most systems, with monthly checks on critical components like cryogenics.' },
      { question: 'What is included in a typical PM visit?', answer: 'Each visit includes system testing, calibration verification, cryogenic checks, cleaning, and a detailed condition report.' },
      { question: 'Do you offer PM for older systems?', answer: 'Yes, we support systems regardless of age and can often extend the life of older equipment through proper maintenance.' },
      { question: 'How does PM affect my warranty?', answer: 'Our PM programs are designed to maintain warranty compliance. We document all work to manufacturer standards.' }
    ],
    relatedServices: [
      { slug: 'emergency-repairs', title: 'Emergency Repairs' },
      { slug: 'software-updates', title: 'Software Updates' },
      { slug: 'remote-diagnostics', title: 'Remote Diagnostics' }
    ],
    keywords: ['MRI preventive maintenance', 'MRI PM program', 'medical equipment maintenance', 'MRI service contract'],
    geoKeywords: ['MRI maintenance California', 'MRI service Los Angeles', 'MRI maintenance Sun Valley']
  },

  'emergency-repairs': {
    slug: 'emergency-repairs',
    title: '24/7 Emergency MRI Repair Services',
    metaTitle: '24/7 Emergency MRI Repair Services | Fast Response | LASO Imaging',
    metaDescription: 'Emergency MRI repair services with 2-4 hour response time. Our certified engineers are available 24/7 to get your system back online. Call 1-800-MRI-LASO.',
    heroDescription: 'When your MRI goes down, every minute counts. Our emergency team responds in 2-4 hours to get you back online fast.',
    overview: `MRI downtime costs facilities $5,000-$10,000 per day in lost revenue and rescheduled patients. LASO's emergency repair service minimizes that impact with rapid response from experienced engineers who arrive with the parts and expertise to fix problems fast.

Our 24/7 emergency hotline connects you directly with our dispatch team, not an answering service. We maintain extensive parts inventory and strategic locations nationwide to ensure the fastest possible response.`,
    processSteps: [
      { step: 'Call Our Hotline', description: 'Call 1-800-MRI-LASO and speak directly with our emergency dispatch team.' },
      { step: 'Remote Diagnostics', description: 'Our engineers connect remotely to diagnose the problem within 15 minutes when possible.' },
      { step: 'Engineer Dispatch', description: 'A certified engineer is dispatched with the parts most likely needed for the repair.' },
      { step: 'On-site Arrival', description: 'Engineer arrives on-site within 2-4 hours for most US locations.' },
      { step: 'Rapid Repair', description: 'Expert diagnosis and repair using OEM-quality parts and procedures.' },
      { step: 'System Verification', description: 'Complete testing to verify the system is operating within specifications.' },
      { step: 'Follow-up Support', description: 'Post-repair monitoring and follow-up to ensure lasting resolution.' }
    ],
    benefits: [
      '2-4 hour on-site response for most locations',
      '24/7/365 availability including holidays',
      'Remote diagnostics to speed up repairs',
      'Extensive parts inventory reduces wait times',
      'OEM-trained engineers on all major brands',
      'Guaranteed response times available'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'What is your typical response time?', answer: 'We arrive on-site within 2-4 hours for most US locations. Remote areas may require slightly longer.' },
      { question: 'Do you stock commonly needed parts?', answer: 'Yes, our engineers carry extensive parts inventory and we maintain regional warehouses for quick access.' },
      { question: 'What if you need a part you do not have?', answer: 'We have overnight shipping arrangements and loaner components to minimize downtime for complex repairs.' },
      { question: 'Is emergency service available for non-contract customers?', answer: 'Yes, we provide emergency service to all customers. Service contract customers receive priority dispatch and preferred rates.' }
    ],
    relatedServices: [
      { slug: 'preventive-maintenance', title: 'Preventive Maintenance' },
      { slug: 'remote-diagnostics', title: 'Remote Diagnostics' },
      { slug: 'cold-head-service', title: 'Cold Head Service' }
    ],
    keywords: ['emergency MRI repair', 'MRI breakdown', '24/7 MRI service', 'urgent MRI repair'],
    geoKeywords: ['emergency MRI repair California', 'MRI repair Los Angeles', '24/7 MRI service nationwide']
  },

  'software-updates': {
    slug: 'software-updates',
    title: 'MRI Software Updates & Upgrades',
    metaTitle: 'MRI Software Updates & Upgrades | Performance Enhancement | LASO Imaging',
    metaDescription: 'MRI software updates and upgrades to enhance performance and security. Unlock new capabilities and improve workflow efficiency. Expert installation.',
    heroDescription: 'Keep your MRI current with the latest software. Updates improve image quality, add features, and address security vulnerabilities.',
    overview: `Software is the brain of your MRI system, controlling everything from image acquisition to workflow management. LASO's software services help you maximize your equipment investment by keeping software current and optimizing configurations for your clinical needs.

We offer both routine updates and major upgrades, including new pulse sequences, workflow enhancements, and cybersecurity patches. Our applications specialists can also optimize protocols to improve image quality and efficiency.`,
    processSteps: [
      { step: 'Software Assessment', description: 'Review current software versions and identify available updates and upgrades.' },
      { step: 'Compatibility Check', description: 'Verify hardware compatibility and identify any prerequisites.' },
      { step: 'Backup Creation', description: 'Create complete system backup before any software changes.' },
      { step: 'Installation', description: 'Professional installation during scheduled downtime.' },
      { step: 'Configuration', description: 'Configure new features and optimize settings for your protocols.' },
      { step: 'Testing', description: 'Comprehensive testing to verify proper operation.' },
      { step: 'Training', description: 'Train your staff on new features and capabilities.' }
    ],
    benefits: [
      'Access to latest imaging sequences and features',
      'Improved cybersecurity and HIPAA compliance',
      'Enhanced workflow efficiency',
      'Better image quality through optimized protocols',
      'Extended equipment lifespan',
      'Reduced risk of software-related failures'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'How do I know if updates are available?', answer: 'We can audit your system and identify all available updates. Many systems have updates that were never installed.' },
      { question: 'Will updates affect my protocols?', answer: 'We carefully test after updates and can adjust protocols as needed. Most updates are backward compatible.' },
      { question: 'Can you upgrade older systems?', answer: 'Many older systems can receive significant upgrades. We evaluate each situation to determine the best options.' },
      { question: 'What about cybersecurity updates?', answer: 'We prioritize security patches and can help you meet HIPAA technical requirements for software currency.' }
    ],
    relatedServices: [
      { slug: 'preventive-maintenance', title: 'Preventive Maintenance' },
      { slug: 'operator-training', title: 'Operator Training' },
      { slug: 'technical-courses', title: 'Technical Courses' }
    ],
    keywords: ['MRI software update', 'MRI upgrade', 'MRI software installation', 'medical imaging software'],
    geoKeywords: ['MRI software update California', 'MRI upgrade Los Angeles', 'MRI software service']
  },

  'remote-diagnostics': {
    slug: 'remote-diagnostics',
    title: 'Remote Diagnostics & Monitoring',
    metaTitle: 'Remote MRI Diagnostics & Monitoring | Proactive Support | LASO Imaging',
    metaDescription: 'Remote MRI diagnostics and monitoring services detect problems before they cause downtime. Proactive alerts and expert analysis keep your system running.',
    heroDescription: 'Catch problems before they cause downtime. Our remote monitoring team watches your system 24/7 and alerts you to developing issues.',
    overview: `LASO's remote diagnostics service provides an extra layer of protection for your MRI investment. Our monitoring systems analyze system performance data continuously, identifying trends that indicate developing problems before they cause failures.

When issues arise, our engineers can often diagnose and sometimes resolve problems remotely, reducing on-site visits and minimizing downtime. For problems requiring on-site service, remote diagnosis means our engineers arrive with the right parts and solutions.`,
    processSteps: [
      { step: 'System Connection', description: 'Establish secure VPN connection to your MRI system.' },
      { step: 'Baseline Establishment', description: 'Document normal operating parameters for your specific system.' },
      { step: 'Continuous Monitoring', description: 'Automated monitoring of key system parameters 24/7.' },
      { step: 'Alert Generation', description: 'Automatic alerts when parameters exceed normal ranges.' },
      { step: 'Expert Analysis', description: 'Our engineers review alerts and determine appropriate action.' },
      { step: 'Proactive Communication', description: 'Contact you with recommendations before problems occur.' },
      { step: 'Remote Resolution', description: 'Resolve software issues remotely when possible.' }
    ],
    benefits: [
      'Early problem detection prevents failures',
      'Reduced on-site service visits',
      'Faster resolution when issues occur',
      'Detailed system performance tracking',
      'Trend analysis for predictive maintenance',
      'HIPAA-compliant secure connections'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'Is remote connection secure?', answer: 'Yes, we use encrypted VPN connections that meet HIPAA technical safeguard requirements. Patient data is never accessed.' },
      { question: 'What parameters do you monitor?', answer: 'We track cryogenic levels, error logs, gradient and RF performance, and other key indicators specific to your system.' },
      { question: 'How quickly are alerts reviewed?', answer: 'Critical alerts are reviewed within 15 minutes. Routine alerts are reviewed during normal business hours.' },
      { question: 'Can you resolve all problems remotely?', answer: 'No, hardware issues require on-site service. However, remote diagnosis ensures our engineers arrive prepared.' }
    ],
    relatedServices: [
      { slug: 'preventive-maintenance', title: 'Preventive Maintenance' },
      { slug: 'emergency-repairs', title: 'Emergency Repairs' },
      { slug: 'software-updates', title: 'Software Updates' }
    ],
    keywords: ['remote MRI diagnostics', 'MRI monitoring', 'remote MRI support', 'predictive maintenance'],
    geoKeywords: ['remote MRI support California', 'MRI monitoring nationwide', 'remote diagnostics']
  },

  // CRYOGENIC SERVICES
  'helium-refills': {
    slug: 'helium-refills',
    title: 'Helium Refill & Management Services',
    metaTitle: 'Helium Refill & Management Services | Expert Cryogenics | LASO Imaging',
    metaDescription: 'Professional helium refill and management services for MRI systems. Competitive pricing, scheduled refills, and emergency delivery available from Sun Valley, CA.',
    heroDescription: 'Keep your magnet cold with reliable helium supply. We offer scheduled refills, emergency delivery, and helium conservation consulting.',
    overview: `Helium is essential for superconducting MRI magnets, and proper helium management is critical for reliable operation. LASO provides comprehensive helium services including scheduled refills, emergency delivery, and consulting on helium conservation strategies.

With global helium supply challenges, having a reliable helium partner is more important than ever. We maintain helium inventory and have established relationships with major suppliers to ensure availability for our customers.`,
    processSteps: [
      { step: 'Level Assessment', description: 'Evaluate current helium levels and consumption rate.' },
      { step: 'Schedule Planning', description: 'Establish optimal refill schedule based on your system.' },
      { step: 'Delivery Coordination', description: 'Schedule delivery to minimize operational impact.' },
      { step: 'Professional Fill', description: 'Certified technicians perform the helium transfer.' },
      { step: 'Level Verification', description: 'Verify proper fill levels and document the service.' },
      { step: 'System Check', description: 'Inspect cryogenic system for leaks or issues.' },
      { step: 'Consumption Tracking', description: 'Track consumption trends to optimize future scheduling.' }
    ],
    benefits: [
      'Competitive helium pricing',
      'Scheduled refills prevent emergencies',
      'Emergency delivery available 24/7',
      'Certified technicians ensure safe transfer',
      'Consumption tracking identifies problems early',
      'Helium conservation consulting available'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'How often do MRI systems need helium?', answer: 'Most systems need refills every 4-12 months depending on age and cold head condition. We help establish the right schedule.' },
      { question: 'What if we have an emergency low level?', answer: 'We offer emergency helium delivery, typically within 24 hours for most locations.' },
      { question: 'Why is our helium consumption high?', answer: 'High consumption often indicates cold head issues. We can evaluate your system and recommend solutions.' },
      { question: 'Can you help reduce helium costs?', answer: 'Yes, through cold head maintenance, leak repairs, and zero-boil-off technology upgrades.' }
    ],
    relatedServices: [
      { slug: 'cold-head-service', title: 'Cold Head Service' },
      { slug: 'compressor-service', title: 'Compressor Service' },
      { slug: 'system-recovery', title: 'System Recovery' }
    ],
    keywords: ['helium refill', 'MRI helium', 'helium management', 'cryogenic service'],
    geoKeywords: ['helium refill California', 'MRI helium Los Angeles', 'helium delivery nationwide']
  },

  'cold-head-service': {
    slug: 'cold-head-service',
    title: 'Cold Head Service & Replacement',
    metaTitle: 'Cold Head Service & Replacement | MRI Cryogenics | LASO Imaging',
    metaDescription: 'Expert cold head service and replacement for MRI systems. Prevent helium loss and system downtime with proactive cold head maintenance from Sun Valley, CA.',
    heroDescription: 'The cold head keeps your magnet cold. Our service programs prevent failures and extend cold head life by 50% or more.',
    overview: `The cold head is a critical component that recondenses helium vapor back to liquid, maintaining your magnet at operating temperature. Cold head failures are a leading cause of helium loss and system downtime.

LASO's cold head service program provides proactive maintenance to extend cold head life and prevent unexpected failures. We also offer 24/7 emergency cold head replacement when failures occur.`,
    processSteps: [
      { step: 'Performance Analysis', description: 'Measure cold head performance indicators and compare to baselines.' },
      { step: 'Trend Review', description: 'Analyze performance trends to predict remaining life.' },
      { step: 'Preventive Service', description: 'Perform maintenance to extend cold head life.' },
      { step: 'Replacement Planning', description: 'Schedule replacement before failure when needed.' },
      { step: 'Cold Head Exchange', description: 'Replace cold head with minimal system downtime.' },
      { step: 'System Verification', description: 'Verify proper operation and cryogenic stability.' },
      { step: 'Ongoing Monitoring', description: 'Continue monitoring to ensure optimal performance.' }
    ],
    benefits: [
      'Prevent helium loss from cold head failures',
      'Extend cold head life through proactive service',
      'Reduce emergency replacement costs',
      '24/7 emergency replacement available',
      'Performance tracking and trending',
      'Reduced helium consumption'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'How often should cold heads be serviced?', answer: 'We recommend service every 20,000-25,000 operating hours. Performance monitoring helps optimize timing.' },
      { question: 'What are signs of cold head problems?', answer: 'Increasing helium consumption, unusual sounds, and performance parameter changes all indicate potential issues.' },
      { question: 'How long does cold head replacement take?', answer: 'Most replacements are completed in 4-8 hours, with the system back online the same day.' },
      { question: 'Do you have exchange cold heads available?', answer: 'Yes, we maintain an inventory of exchange cold heads for fast replacement when needed.' }
    ],
    relatedServices: [
      { slug: 'helium-refills', title: 'Helium Refills' },
      { slug: 'compressor-service', title: 'Compressor Service' },
      { slug: 'preventive-maintenance', title: 'Preventive Maintenance' }
    ],
    keywords: ['cold head service', 'cold head replacement', 'MRI cryogenics', 'cold head maintenance'],
    geoKeywords: ['cold head service California', 'cold head replacement Los Angeles', 'MRI cryogenics nationwide']
  },

  'compressor-service': {
    slug: 'compressor-service',
    title: 'Compressor Maintenance & Repair',
    metaTitle: 'MRI Compressor Maintenance & Repair | Expert Service | LASO Imaging',
    metaDescription: 'Professional MRI compressor maintenance and repair services. Prevent failures with proactive service. Emergency repair available 24/7.',
    heroDescription: 'The compressor is the workhorse of your cryogenic system. Proper maintenance prevents costly failures and extends equipment life.',
    overview: `The helium compressor works continuously to maintain your MRI magnet at operating temperature. These units require regular maintenance to ensure reliable operation and prevent catastrophic failures.

LASO provides comprehensive compressor services including scheduled maintenance, emergency repairs, and compressor replacements. Our technicians are factory-trained on all major compressor brands.`,
    processSteps: [
      { step: 'System Inspection', description: 'Thorough inspection of compressor and connections.' },
      { step: 'Oil Analysis', description: 'Test compressor oil for contamination and degradation.' },
      { step: 'Filter Replacement', description: 'Replace oil and air filters per maintenance schedule.' },
      { step: 'Performance Testing', description: 'Verify compressor performance meets specifications.' },
      { step: 'Cleaning', description: 'Clean condenser coils and enclosure.' },
      { step: 'Electrical Check', description: 'Inspect electrical connections and controls.' },
      { step: 'Documentation', description: 'Document service and provide maintenance records.' }
    ],
    benefits: [
      'Prevent compressor failures and system downtime',
      'Extend compressor life through proper maintenance',
      'Reduce energy consumption with optimized performance',
      'Factory-trained technicians on all brands',
      '24/7 emergency repair available',
      'Exchange compressors for minimal downtime'
    ],
    equipmentBrands: ['Sumitomo', 'Leybold', 'CTI', 'Brooks Automation', 'Oxford Instruments'],
    faqs: [
      { question: 'How often does the compressor need service?', answer: 'Compressors typically need service annually, with oil and filter changes every 6-12 months depending on operating conditions.' },
      { question: 'What causes compressor failures?', answer: 'Common causes include oil degradation, filter neglect, and environmental factors like heat or dust.' },
      { question: 'How long do compressors last?', answer: 'With proper maintenance, compressors can last 15-20 years. Neglected units may fail in 5-7 years.' },
      { question: 'Do you have replacement compressors?', answer: 'Yes, we maintain an inventory of refurbished compressors for exchange when repairs are not feasible.' }
    ],
    relatedServices: [
      { slug: 'cold-head-service', title: 'Cold Head Service' },
      { slug: 'helium-refills', title: 'Helium Refills' },
      { slug: 'preventive-maintenance', title: 'Preventive Maintenance' }
    ],
    keywords: ['compressor service', 'compressor maintenance', 'MRI compressor repair', 'helium compressor'],
    geoKeywords: ['compressor service California', 'MRI compressor repair Los Angeles', 'compressor maintenance nationwide']
  },

  'system-recovery': {
    slug: 'system-recovery',
    title: 'Magnet Quench Recovery Services',
    metaTitle: 'Magnet Quench Recovery Services | Emergency Response | LASO Imaging',
    metaDescription: 'Expert magnet quench recovery services to minimize downtime and costs. Fast response, safe helium recovery, and system restoration.',
    heroDescription: 'After a quench, quick expert response minimizes damage and recovery time. Our team has recovered hundreds of magnets successfully.',
    overview: `A magnet quench is a serious event where the superconducting magnet suddenly loses its superconducting state, causing rapid helium boil-off. Quick, expert response is critical to minimize damage and reduce recovery time and costs.

LASO's quench recovery team provides 24/7 emergency response to quench events. We assess the situation, recover remaining helium when possible, evaluate magnet condition, and guide the recovery process.`,
    processSteps: [
      { step: 'Emergency Response', description: 'Immediate phone consultation to assess the situation and guide initial actions.' },
      { step: 'Site Arrival', description: 'Our engineers arrive to evaluate the magnet and cryogenic system.' },
      { step: 'Helium Recovery', description: 'Recover any remaining liquid or gaseous helium.' },
      { step: 'Magnet Assessment', description: 'Evaluate magnet condition and determine recovery options.' },
      { step: 'Cool Down', description: 'Controlled cool down of the magnet with proper helium fill.' },
      { step: 'Ramping', description: 'Careful magnet ramp-up to operating field strength.' },
      { step: 'Verification', description: 'Complete system testing to verify performance.' }
    ],
    benefits: [
      '24/7 emergency response nationwide',
      'Experienced engineers who have recovered hundreds of magnets',
      'Helium recovery to reduce costs',
      'Thorough assessment before recovery',
      'Proven ramp procedures for all major systems',
      'Full documentation for insurance purposes'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'What should we do immediately after a quench?', answer: 'Evacuate the room if helium is venting, ensure ventilation, and call our emergency line immediately.' },
      { question: 'How long does quench recovery take?', answer: 'Typical recovery takes 5-10 days from quench to operational status, depending on helium availability and magnet condition.' },
      { question: 'Will the magnet be damaged?', answer: 'Most magnets survive quenches without permanent damage, especially if recovery begins promptly.' },
      { question: 'What caused the quench?', answer: 'We investigate the cause as part of recovery, including cryogenic system evaluation and power quality analysis.' }
    ],
    relatedServices: [
      { slug: 'helium-refills', title: 'Helium Refills' },
      { slug: 'cold-head-service', title: 'Cold Head Service' },
      { slug: 'emergency-repairs', title: 'Emergency Repairs' }
    ],
    keywords: ['quench recovery', 'magnet quench', 'MRI emergency', 'magnet recovery'],
    geoKeywords: ['quench recovery California', 'magnet recovery Los Angeles', 'MRI emergency nationwide']
  },

  // TRAINING SERVICES
  'operator-training': {
    slug: 'operator-training',
    title: 'MRI Operator Training Programs',
    metaTitle: 'MRI Operator Training Programs | Expert Instruction | LASO Imaging',
    metaDescription: 'Comprehensive MRI operator training for technologists and radiographers. Hands-on instruction, protocol optimization, and best practices.',
    heroDescription: 'Train your team to get the most from your MRI investment. Our applications specialists teach best practices for optimal imaging.',
    overview: `Well-trained operators are essential for consistent, high-quality MRI imaging. LASO's operator training programs are designed by experienced applications specialists who understand both the technical and clinical aspects of MRI operation.

Our training is customized to your equipment and clinical needs, covering everything from basic operation to advanced protocol optimization. We offer on-site training at your facility and can incorporate your specific imaging protocols.`,
    processSteps: [
      { step: 'Needs Assessment', description: 'Evaluate your team current skill levels and identify training needs.' },
      { step: 'Curriculum Development', description: 'Develop customized training content for your equipment and applications.' },
      { step: 'Scheduling', description: 'Schedule training sessions to minimize operational impact.' },
      { step: 'Classroom Instruction', description: 'Foundational concepts, safety, and system overview.' },
      { step: 'Hands-on Training', description: 'Practical experience with your actual equipment.' },
      { step: 'Protocol Review', description: 'Review and optimize protocols for your clinical needs.' },
      { step: 'Competency Assessment', description: 'Evaluate trainee proficiency and provide certificates.' }
    ],
    benefits: [
      'Customized training for your equipment',
      'Experienced applications specialists as instructors',
      'Hands-on practice with your system',
      'Protocol optimization included',
      'Flexible scheduling options',
      'Training certificates for documentation'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'How long are training programs?', answer: 'Programs range from 1-5 days depending on skill level and content covered.' },
      { question: 'Can you train new staff on older systems?', answer: 'Yes, we train on all system versions including legacy equipment.' },
      { question: 'Do you provide training materials?', answer: 'Yes, we provide training manuals and quick reference guides for your team.' },
      { question: 'Can you train staff from multiple locations?', answer: 'We can coordinate training for staff from multiple facilities, either on-site or at a central location.' }
    ],
    relatedServices: [
      { slug: 'safety-certification', title: 'MRI Safety Certification' },
      { slug: 'technical-courses', title: 'Technical Training' },
      { slug: 'software-updates', title: 'Software Updates' }
    ],
    keywords: ['MRI operator training', 'MRI technologist training', 'MRI education', 'MRI protocol training'],
    geoKeywords: ['MRI training California', 'MRI operator training Los Angeles', 'MRI education nationwide']
  },

  'safety-certification': {
    slug: 'safety-certification',
    title: 'MRI Safety Certification Programs',
    metaTitle: 'MRI Safety Certification Programs | MRSO & MRMD Training | LASO Imaging',
    metaDescription: 'MRI safety certification and training for healthcare personnel. MRSO and MRMD preparation, screening procedures, and emergency response training.',
    heroDescription: 'Keep your patients and staff safe with comprehensive MRI safety training. We help you meet regulatory requirements and best practices.',
    overview: `MRI safety is critical for protecting patients, staff, and equipment. LASO's safety certification programs cover all aspects of MRI safety from screening procedures to emergency response, helping your facility meet regulatory requirements and ACR accreditation standards.

Our programs prepare personnel for MRSO (MRI Safety Officer) and MRMD (MRI Medical Director) roles, and provide comprehensive safety training for all staff who work in or near the MRI environment.`,
    processSteps: [
      { step: 'Safety Audit', description: 'Review your current safety practices and identify gaps.' },
      { step: 'Curriculum Selection', description: 'Choose appropriate training for each role (Level 1, Level 2, MRSO, MRMD).' },
      { step: 'Classroom Training', description: 'Comprehensive instruction on MRI safety principles.' },
      { step: 'Practical Scenarios', description: 'Hands-on practice with screening and emergency procedures.' },
      { step: 'Policy Development', description: 'Develop or update your facility MRI safety policies.' },
      { step: 'Assessment', description: 'Written and practical evaluation of safety competency.' },
      { step: 'Certification', description: 'Certificates of completion for documentation and credentialing.' }
    ],
    benefits: [
      'Meet ACR accreditation requirements',
      'Reduce risk of safety incidents',
      'Prepare staff for MRSO and MRMD roles',
      'Customized for your facility layout',
      'Policy development assistance',
      'Ongoing safety consultation available'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'What is Level 1 vs Level 2 training?', answer: 'Level 1 is for non-MRI personnel who may enter Zone III. Level 2 is for personnel who work directly with patients in the MRI environment.' },
      { question: 'How often should training be renewed?', answer: 'We recommend annual refresher training for all MRI personnel, with more comprehensive recertification every 2-3 years.' },
      { question: 'Do you help with ACR accreditation?', answer: 'Yes, our safety programs are designed to meet ACR requirements, and we can assist with documentation for accreditation.' },
      { question: 'Can you train housekeeping and maintenance staff?', answer: 'Yes, we provide Level 1 safety training for all personnel who may enter Zone III or IV.' }
    ],
    relatedServices: [
      { slug: 'operator-training', title: 'Operator Training' },
      { slug: 'technical-courses', title: 'Technical Training' },
      { slug: 'onsite-training', title: 'On-site Training' }
    ],
    keywords: ['MRI safety training', 'MRSO certification', 'MRI safety officer', 'MRI safety program'],
    geoKeywords: ['MRI safety training California', 'MRSO certification Los Angeles', 'MRI safety program nationwide']
  },

  'technical-courses': {
    slug: 'technical-courses',
    title: 'Technical Training for Engineers',
    metaTitle: 'MRI Technical Training for Engineers | Service Training | LASO Imaging',
    metaDescription: 'Technical MRI training for biomedical engineers and service technicians. Learn troubleshooting, component repair, and preventive maintenance procedures.',
    heroDescription: 'Develop your team in-house MRI service capabilities. Our technical courses teach troubleshooting, repairs, and preventive maintenance.',
    overview: `Building in-house MRI service capabilities can significantly reduce your operating costs and improve system uptime. LASO's technical training programs teach biomedical engineers and technicians the skills needed to perform routine maintenance, troubleshoot problems, and make basic repairs.

Our courses are hands-on and practical, focusing on real-world skills your team can apply immediately. We offer training on all major MRI platforms from basic maintenance to advanced subsystem troubleshooting.`,
    processSteps: [
      { step: 'Skill Assessment', description: 'Evaluate your team current technical knowledge and experience.' },
      { step: 'Course Selection', description: 'Choose appropriate courses based on equipment and skill goals.' },
      { step: 'Theory Training', description: 'System architecture, subsystems, and troubleshooting methodology.' },
      { step: 'Hands-on Labs', description: 'Practical experience with components and test equipment.' },
      { step: 'Troubleshooting Practice', description: 'Work through real-world scenarios and fault conditions.' },
      { step: 'System-Specific Training', description: 'Detailed training on your specific MRI model.' },
      { step: 'Ongoing Support', description: 'Phone support for your team as they apply new skills.' }
    ],
    benefits: [
      'Reduce service contract costs',
      'Faster problem resolution with in-house expertise',
      'Hands-on training with actual components',
      'Training on your specific equipment',
      'Ongoing phone support included',
      'Credentials for your engineering staff'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'How much experience is required?', answer: 'Basic electronics and mechanical skills are recommended. We offer courses for various skill levels.' },
      { question: 'How long are technical courses?', answer: 'Courses range from 3-10 days depending on content depth and system complexity.' },
      { question: 'Do you train on cryogenic systems?', answer: 'Yes, we offer specialized cryogenic system training for engineers responsible for helium and cold head management.' },
      { question: 'Can we get OEM-level training?', answer: 'Our training is based on OEM procedures and provides the skills needed for most service tasks. Some advanced repairs may still require specialized support.' }
    ],
    relatedServices: [
      { slug: 'operator-training', title: 'Operator Training' },
      { slug: 'safety-certification', title: 'Safety Certification' },
      { slug: 'preventive-maintenance', title: 'Preventive Maintenance' }
    ],
    keywords: ['MRI technical training', 'MRI service training', 'biomed MRI training', 'MRI troubleshooting'],
    geoKeywords: ['MRI technical training California', 'MRI service training Los Angeles', 'MRI engineering courses']
  },

  'onsite-training': {
    slug: 'onsite-training',
    title: 'Custom On-site Training Programs',
    metaTitle: 'Custom On-site MRI Training Programs | LASO Imaging',
    metaDescription: 'Custom on-site MRI training programs at your facility. Tailored content, flexible scheduling, and hands-on practice with your equipment.',
    heroDescription: 'Training at your facility means less travel, more practice time on your equipment, and content customized to your specific needs.',
    overview: `On-site training eliminates travel costs and allows your team to learn on the equipment they use every day. LASO's applications specialists and engineers come to your facility with customized training programs designed for your specific needs.

Whether you need operator training, technical courses, or safety certification, we bring the expertise to you. On-site training also allows us to address your specific protocols, workflows, and challenges.`,
    processSteps: [
      { step: 'Consultation', description: 'Discuss your training needs, goals, and scheduling preferences.' },
      { step: 'Curriculum Development', description: 'Develop customized training content for your situation.' },
      { step: 'Logistics Planning', description: 'Coordinate schedules, materials, and training space requirements.' },
      { step: 'On-site Delivery', description: 'Our trainers come to your facility for hands-on instruction.' },
      { step: 'Equipment Practice', description: 'Training on your actual MRI system for immediate skill transfer.' },
      { step: 'Protocol Optimization', description: 'Review and improve your specific imaging protocols.' },
      { step: 'Follow-up Support', description: 'Ongoing phone and email support after training.' }
    ],
    benefits: [
      'No travel costs for your team',
      'Training on your actual equipment',
      'Customized to your protocols and workflows',
      'Flexible scheduling around your operations',
      'Multiple staff can participate',
      'Immediate application of skills'
    ],
    equipmentBrands: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical', 'Hitachi'],
    faqs: [
      { question: 'How many people can participate?', answer: 'On-site training can accommodate groups of 2-10 participants, depending on content and available scanner time.' },
      { question: 'How much scanner time is needed?', answer: 'We work around your imaging schedule, often using early morning or evening time for hands-on practice.' },
      { question: 'What about travel costs?', answer: 'We include travel in our on-site training quotes with no hidden fees.' },
      { question: 'Can you combine operator and technical training?', answer: 'Yes, we can design combined programs that address both operational and technical needs during the same visit.' }
    ],
    relatedServices: [
      { slug: 'operator-training', title: 'Operator Training' },
      { slug: 'technical-courses', title: 'Technical Training' },
      { slug: 'safety-certification', title: 'Safety Certification' }
    ],
    keywords: ['on-site MRI training', 'custom MRI training', 'MRI training at your facility', 'MRI education'],
    geoKeywords: ['on-site MRI training California', 'custom MRI training Los Angeles', 'MRI training nationwide']
  }
};

export const getServiceContent = (slug: string): ServiceContent | undefined => {
  return serviceContent[slug];
};

export const getAllServices = (): ServiceContent[] => {
  return Object.values(serviceContent);
};
