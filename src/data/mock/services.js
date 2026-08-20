
/**
 * indexabilityStatus values:
 *   "eligible"         - confirmed indexable
 *   "not-yet-eligible" - architecturally valid, lacking verified evidence
 *   "noindex"          - explicitly excluded
 */
export const mockServices = [
  {
    id: 'srv-1',
    slug: 'warehouse-staffing',
    name: 'Warehouse Staffing',
    shortName: 'Warehouse',
    tagline: 'Reliable teams for your warehouse operations',
    description: 'Workforce support for warehouse operations including loading, unloading, picking, and packing.',
    longDescription: 'Metro Mitra connects warehouses with verified helpers, loaders, and pickers on flexible shift schedules. Whether you need a team for a single day or an ongoing deployment, our platform helps you staff your floor efficiently.',
    category: 'Logistics',
    audiences: ['corporate', 'contractor'],
    icon: 'Package',
    image: '/images/warehouse-hero.webp',
    roles: ['warehouse-helper', 'loader', 'packer'],
    serviceType: 'shift',
    availability: 'active',
    status: 'active',
    useCases: ['Loading & Unloading', 'Inventory Management', 'Packaging', 'Sorting & Dispatch'],
    whoIsItFor: ['Warehouses', 'Fulfillment Centers', 'E-commerce Operations', 'Cold Storage Facilities'],
    whatThisCovers: [
      'Manual loading and unloading of goods',
      'Inventory sorting and shelving',
      'Order picking and packing',
      'Goods dispatch preparation',
      'General warehouse upkeep'
    ],
    howItWorks: [
      { step: 1, title: 'Specify Requirement', description: 'Tell us how many workers you need, for what roles, and the shift timings.' },
      { step: 2, title: 'Worker Matching', description: 'Metro Mitra matches your requirement with verified workers in your area.' },
      { step: 3, title: 'Deployment', description: 'Workers arrive at your facility at the scheduled time.' },
      { step: 4, title: 'Task Completion', description: 'Track attendance and completion through the platform.' }
    ],
    faqs: [
      { question: 'What is the minimum team size?', answer: 'You can request anywhere from a single worker to a team of 50+, depending on local availability.' },
      { question: 'Can I request workers for night shifts?', answer: 'Yes, we support day, afternoon, and night shift deployments.' },
      { question: 'Are the workers verified?', answer: 'All workers go through our standard profile verification process before being eligible for deployment.' }
    ],
    requirements: ['Clear task description', 'Safe working environment', 'Supervision on site'],
    indexabilityStatus: 'eligible'
  },
  {
    id: 'srv-2',
    slug: 'electrical-services',
    name: 'Electrical Services',
    shortName: 'Electrician',
    tagline: 'Professional electrical installation and repair',
    description: 'Hire certified electricians for wiring, fixtures, and electrical maintenance.',
    longDescription: 'Access skilled electricians for your residential, commercial, or construction needs. From simple fixture installations to complex wiring projects, our network of technicians ensures safe and compliant electrical work.',
    category: 'Technical',
    audiences: ['individual', 'contractor', 'corporate'],
    icon: 'Zap',
    image: '/images/electrician-hero.webp',
    roles: ['electrician'],
    serviceType: 'task',
    availability: 'active',
    status: 'active',
    useCases: ['Fixture Installation', 'Wiring Repair', 'Panel Upgrades', 'Commercial Maintenance'],
    whoIsItFor: ['Homeowners', 'Office Managers', 'Construction Contractors', 'Facility Managers'],
    whatThisCovers: [
      'Diagnosis of electrical faults',
      'Installation of lights, fans, and switches',
      'Wiring and rewiring tasks',
      'Electrical panel maintenance',
      'Safety inspections'
    ],
    howItWorks: [
      { step: 1, title: 'Describe the Issue', description: 'Provide details about the electrical work needed and your location.' },
      { step: 2, title: 'Get Matched', description: 'We assign a qualified electrician to your request.' },
      { step: 3, title: 'Service Visit', description: 'The electrician visits the site to diagnose and complete the work.' },
      { step: 4, title: 'Review & Pay', description: 'Review the completed work and process payment securely.' }
    ],
    faqs: [
      { question: 'Do electricians bring their own tools?', answer: 'Yes, all electricians arrive equipped with standard tools required for diagnosis and repair.' },
      { question: 'Are materials included in the service cost?', answer: 'The base cost covers labor. Any required materials (wires, switches, fixtures) are billed separately or provided by you.' },
      { question: 'Is the work guaranteed?', answer: 'Workmanship is backed by our platform service standards.' }
    ],
    requirements: ['Clear access to electrical panels', 'Description of the fault', 'Safe working conditions'],
    indexabilityStatus: 'eligible'
  },
  {
    id: 'srv-3',
    slug: 'cleaning-services',
    name: 'Cleaning & Sanitation',
    shortName: 'Cleaning',
    tagline: 'Deep cleaning for homes, offices, and worksites',
    description: 'Professional cleaning staff for routine maintenance, deep cleaning, or post-construction clearing.',
    longDescription: 'Maintain a pristine environment with our cleaning and sanitation services. We provide trained cleaners for residential deep cleaning, daily office upkeep, and heavy-duty post-construction site clearing.',
    category: 'Service',
    audiences: ['individual', 'corporate', 'contractor'],
    icon: 'Sparkles',
    image: '/images/cleaning-hero.webp',
    roles: ['cleaner'],
    serviceType: 'task',
    availability: 'active',
    status: 'active',
    useCases: ['Office Cleaning', 'Residential Deep Clean', 'Post-Construction Clearing', 'Event Cleanup'],
    whoIsItFor: ['Homeowners', 'Facility Managers', 'Event Organizers', 'Site Contractors'],
    whatThisCovers: [
      'Sweeping, mopping, and vacuuming',
      'Restroom and kitchen sanitation',
      'Dusting and surface wiping',
      'Waste removal and disposal',
      'Specialized deep cleaning (upon request)'
    ],
    howItWorks: [
      { step: 1, title: 'Select Cleaning Type', description: 'Choose between routine, deep, or post-construction cleaning.' },
      { step: 2, title: 'Set Schedule', description: 'Pick a date and time that works for you.' },
      { step: 3, title: 'Cleaners Arrive', description: 'Our verified cleaners arrive to perform the requested tasks.' },
      { step: 4, title: 'Inspection', description: 'Review the area to ensure it meets your standards.' }
    ],
    faqs: [
      { question: 'Do I need to provide cleaning supplies?', answer: 'You can opt for cleaners to bring their own supplies or use yours at a discounted rate.' },
      { question: 'Can I book a recurring service?', answer: 'Yes, daily, weekly, and monthly schedules are available for corporate clients.' }
    ],
    requirements: ['Access to water and electricity', 'Clear scope of work'],
    indexabilityStatus: 'eligible'
  },
  {
    id: 'srv-4',
    slug: 'plumbing-services',
    name: 'Plumbing Services',
    shortName: 'Plumbing',
    tagline: 'Expert plumbing repair and installation',
    description: 'Fix leaks, unclog drains, and install new plumbing fixtures.',
    longDescription: 'Resolve water and drainage issues quickly with our plumbing services. Our network includes experienced plumbers capable of handling everything from minor leaks to major pipe installations.',
    category: 'Technical',
    audiences: ['individual', 'contractor', 'corporate'],
    icon: 'Wrench',
    image: '/images/plumbing-hero.webp',
    roles: ['plumber'],
    serviceType: 'task',
    availability: 'active',
    status: 'active',
    useCases: ['Leak Repair', 'Drain Cleaning', 'Fixture Installation', 'Pipe Maintenance'],
    whoIsItFor: ['Homeowners', 'Property Managers', 'Construction Sites'],
    whatThisCovers: [
      'Leak detection and repair',
      'Clearing blocked drains and toilets',
      'Installing taps, sinks, and showers',
      'Pipe repair and replacement'
    ],
    howItWorks: [
      { step: 1, title: 'Report Issue', description: 'Describe the plumbing problem.' },
      { step: 2, title: 'Plumber Assigned', description: 'A qualified plumber is dispatched to your location.' },
      { step: 3, title: 'Diagnosis & Fix', description: 'The plumber assesses the issue and performs the repair.' },
      { step: 4, title: 'Confirmation', description: 'Confirm the leak is fixed or the fixture is working.' }
    ],
    faqs: [
      { question: 'What if emergency parts are needed?', answer: 'The plumber will provide an estimate for the parts before proceeding with the purchase and repair.' }
    ],
    requirements: ['Access to main water shutoff', 'Clear description of the problem'],
    indexabilityStatus: 'eligible'
  },
  {
    id: 'srv-5',
    slug: 'appliance-repair',
    name: 'Appliance Repair',
    shortName: 'Appliance',
    tagline: 'Fast repair for household and commercial appliances',
    description: 'Diagnose and fix issues with ACs, washing machines, refrigerators, and more.',
    longDescription: 'Get your essential appliances back in working order. Our technicians specialize in diagnosing and repairing major white goods, ensuring your home or business runs smoothly.',
    category: 'Technical',
    audiences: ['individual', 'corporate'],
    icon: 'Settings',
    image: '/images/appliance-hero.webp',
    roles: ['technician'],
    serviceType: 'task',
    availability: 'active',
    status: 'active',
    useCases: ['AC Servicing', 'Washing Machine Repair', 'Refrigerator Repair', 'Microwave Repair'],
    whoIsItFor: ['Homeowners', 'Restaurants', 'Offices'],
    whatThisCovers: [
      'Fault diagnosis',
      'Part replacement and repair',
      'Routine maintenance (e.g., AC cleaning)',
      'Safety and functional testing'
    ],
    howItWorks: [
      { step: 1, title: 'Select Appliance', description: 'Tell us which appliance needs repair and the symptoms.' },
      { step: 2, title: 'Technician Visit', description: 'A specialist technician visits for diagnosis.' },
      { step: 3, title: 'Repair Execution', description: 'The repair is carried out, pending part availability.' },
      { step: 4, title: 'Testing', description: 'The appliance is tested to ensure proper function.' }
    ],
    faqs: [
      { question: 'Is there a visitation fee?', answer: 'A standard diagnostic fee applies, which is often waived if you proceed with the repair.' },
      { question: 'Are replacement parts genuine?', answer: 'Technicians source OEM or high-quality compatible parts based on your preference and budget.' }
    ],
    requirements: ['Appliance make and model', 'Access to power supply'],
    indexabilityStatus: 'eligible'
  },
  {
    id: 'srv-6',
    slug: 'last-mile-delivery',
    name: 'Last-Mile Delivery Support',
    shortName: 'Delivery',
    tagline: 'Delivery associates for your local logistics needs',
    description: 'Hire delivery personnel for package, food, or grocery distribution.',
    longDescription: 'Scale your delivery operations with on-demand delivery associates. Perfect for e-commerce, local retail, and food businesses needing reliable last-mile fulfillment support.',
    category: 'Logistics',
    audiences: ['corporate', 'contractor'],
    icon: 'Truck',
    image: '/images/delivery-hero.webp',
    roles: ['delivery-associate'],
    serviceType: 'shift',
    availability: 'active',
    status: 'active',
    useCases: ['E-commerce Delivery', 'Food Delivery', 'Grocery Fulfillment', 'Courier Services'],
    whoIsItFor: ['E-commerce Companies', 'Restaurants', 'Local Retailers', 'Logistics Providers'],
    whatThisCovers: [
      'Route-based package delivery',
      'Proof of delivery capture',
      'Cash on delivery (COD) handling',
      'Customer handover'
    ],
    howItWorks: [
      { step: 1, title: 'Request Associates', description: 'Specify the number of associates and vehicle types required.' },
      { step: 2, title: 'Deployment', description: 'Associates report to your hub for route assignment.' },
      { step: 3, title: 'Execution', description: 'Deliveries are executed using your preferred routing app.' },
      { step: 4, title: 'Reconciliation', description: 'End-of-day COD and undelivered package reconciliation.' }
    ],
    faqs: [
      { question: 'Do associates provide their own vehicles?', answer: 'Yes, associates typically use their own two-wheelers or three-wheelers.' },
      { question: 'Can they handle COD?', answer: 'Yes, associates are trained in basic COD handling and reconciliation processes.' }
    ],
    requirements: ['Ready delivery routes', 'Clear pickup hub location'],
    indexabilityStatus: 'eligible'
  }
];
