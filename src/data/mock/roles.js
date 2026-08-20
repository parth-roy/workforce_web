
/**
 * indexabilityStatus values:
 *   "eligible"         - confirmed indexable
 *   "not-yet-eligible" - architecturally valid, lacking verified evidence
 *   "noindex"          - explicitly excluded
 */
export const mockRoles = [
  {
    id: 'role-1',
    slug: 'warehouse-helper',
    name: 'Warehouse Helper',
    tagline: 'Essential support for warehouse and logistics operations',
    description: 'Assist in daily warehouse operations, inventory management, and manual labor tasks.',
    longDescription: 'Warehouse Helpers form the backbone of logistics operations. They assist with loading, unloading, sorting, and stacking goods, ensuring warehouses run smoothly and efficiently.',
    responsibilities: [
      'Loading and unloading goods from vehicles',
      'Sorting and organising inventory in storage areas',
      'Assisting with order picking and packing',
      'Maintaining cleanliness and organisation of the work area',
      'Following safety protocols for heavy goods handling',
    ],
    requirements: ['Physical fitness and ability to lift 20-30kg', 'Basic reading skills', 'Willingness to work in shift-based schedules', 'Punctuality and reliability'],
    workEnvironment: 'Indoor warehouses, fulfillment centers, and cold storage facilities. Work typically involves standing and physical activity for extended periods.',
    category: 'Logistics',
    relatedRoles: ['loader', 'packer', 'delivery-associate'],
    indexabilityStatus: 'eligible'
  },
  {
    id: 'role-2',
    slug: 'electrician',
    name: 'Electrician',
    tagline: 'Skilled electrical installation, maintenance, and repair',
    description: 'Provide certified electrical services for residential, commercial, and industrial settings.',
    longDescription: 'Electricians handle the installation, maintenance, and repair of electrical wiring, equipment, and fixtures. They ensure that work is in accordance with relevant codes.',
    responsibilities: [
      'Installing and repairing electrical wiring, systems, and fixtures',
      'Troubleshooting electrical issues using testing devices',
      'Reading technical diagrams and blueprints',
      'Performing general electrical maintenance',
      'Ensuring compliance with local and national safety codes'
    ],
    requirements: ['Valid electrician certification or license', 'Proven experience as an electrician', 'Deep understanding of electrical safety procedures', 'Ability to read blueprints'],
    workEnvironment: 'Varies between residential homes, construction sites, and commercial buildings. May require working in tight spaces or at heights.',
    category: 'Technical',
    relatedRoles: ['plumber', 'technician'],
    indexabilityStatus: 'eligible'
  },
  {
    id: 'role-3',
    slug: 'cleaner',
    name: 'Cleaner',
    tagline: 'Professional cleaning for commercial and residential properties',
    description: 'Maintain cleanliness and hygiene standards in offices, homes, and worksites.',
    longDescription: 'Cleaners provide essential sanitation and hygiene maintenance. Tasks range from routine office cleaning and residential deep cleaning to post-construction site clearing.',
    responsibilities: [
      'Sweeping, mopping, vacuuming, and dusting',
      'Sanitising restrooms, kitchens, and common areas',
      'Emptying trash receptacles and disposing of waste safely',
      'Reporting maintenance issues or safety hazards',
      'Handling cleaning chemicals safely'
    ],
    requirements: ['Attention to detail', 'Physical stamina for active work', 'Knowledge of safe chemical handling (preferred)', 'Punctuality and trustworthiness'],
    workEnvironment: 'Indoor environments including offices, homes, hospitals, and retail stores. May involve exposure to cleaning agents.',
    category: 'Service',
    relatedRoles: ['warehouse-helper'],
    indexabilityStatus: 'eligible'
  },
  {
    id: 'role-4',
    slug: 'loader',
    name: 'Loader',
    tagline: 'Heavy lifting and cargo handling specialists',
    description: 'Load and unload cargo from trucks, containers, and staging areas safely.',
    longDescription: 'Loaders are critical for the transportation and logistics supply chain, responsible for the safe and efficient loading and unloading of heavy cargo, ensuring items are secured for transit.',
    responsibilities: [
      'Loading and unloading heavy cargo safely',
      'Securing loads within transport vehicles',
      'Operating pallet jacks and basic handling equipment',
      'Checking cargo against manifests for accuracy'
    ],
    requirements: ['High physical stamina and strength', 'Ability to lift heavy objects repeatedly', 'Understanding of manual handling safety', 'Team player'],
    workEnvironment: 'Loading docks, transport yards, and warehouse bays. Often exposed to outdoor weather conditions.',
    category: 'Logistics',
    relatedRoles: ['warehouse-helper', 'packer'],
    indexabilityStatus: 'eligible'
  },
  {
    id: 'role-5',
    slug: 'packer',
    name: 'Packer',
    tagline: 'Precision packing for safe transport and fulfillment',
    description: 'Package, wrap, and label goods for dispatch and safe transportation.',
    longDescription: 'Packers prepare items for shipment by assembling packaging, wrapping protective materials, and correctly labeling outbound goods in fulfillment centers or moving scenarios.',
    responsibilities: [
      'Selecting appropriate packaging materials',
      'Wrapping and securing items to prevent transit damage',
      'Applying shipping labels and documentation correctly',
      'Maintaining a steady packing rate to meet dispatch times'
    ],
    requirements: ['Attention to detail', 'Manual dexterity and speed', 'Basic reading and numeracy skills', 'Ability to stand for long periods'],
    workEnvironment: 'Fast-paced indoor fulfillment centers, warehouses, or on-site at customer premises during relocations.',
    category: 'Logistics',
    relatedRoles: ['loader', 'warehouse-helper'],
    indexabilityStatus: 'eligible'
  },
  {
    id: 'role-6',
    slug: 'plumber',
    name: 'Plumber',
    tagline: 'Installation and repair of water and drainage systems',
    description: 'Fix leaks, install pipes, and maintain plumbing infrastructure.',
    longDescription: 'Plumbers install, repair, and maintain pipes, fixtures, and other plumbing used for water distribution and wastewater disposal in residential and commercial buildings.',
    responsibilities: [
      'Installing pipes, fixtures, and plumbing equipment',
      'Diagnosing plumbing issues and repairing leaks',
      'Clearing blockages in drainage systems',
      'Ensuring installations meet plumbing codes'
    ],
    requirements: ['Proven plumbing experience', 'Relevant trade certification', 'Problem-solving skills', 'Physical ability to work in confined spaces'],
    workEnvironment: 'Residential, commercial, and construction sites. Work often involves cramped spaces and exposure to water and waste systems.',
    category: 'Technical',
    relatedRoles: ['electrician', 'technician'],
    indexabilityStatus: 'eligible'
  },
  {
    id: 'role-7',
    slug: 'technician',
    name: 'Appliance Technician',
    tagline: 'Repair and maintenance of household and commercial appliances',
    description: 'Diagnose and repair white goods, AC units, and electrical appliances.',
    longDescription: 'Appliance Technicians specialize in the troubleshooting, repair, and routine maintenance of major appliances like refrigerators, washing machines, and air conditioning units.',
    responsibilities: [
      'Diagnosing faults in electrical and mechanical appliances',
      'Replacing defective parts and reassembling equipment',
      'Testing appliances post-repair for safety and function',
      'Advising customers on appliance care'
    ],
    requirements: ['Technical certification in appliance repair', 'Strong diagnostic and troubleshooting skills', 'Customer service skills', 'Knowledge of electrical safety'],
    workEnvironment: 'Primarily working at customer premises (homes or businesses). Requires travel between sites.',
    category: 'Technical',
    relatedRoles: ['electrician'],
    indexabilityStatus: 'eligible'
  },
  {
    id: 'role-8',
    slug: 'delivery-associate',
    name: 'Delivery Associate',
    tagline: 'Last-mile delivery and logistics support',
    description: 'Safely transport and deliver goods to end customers and businesses.',
    longDescription: 'Delivery Associates are responsible for the safe, timely, and accurate delivery of packages, groceries, or commercial goods to designated addresses on their route.',
    responsibilities: [
      'Loading vehicles with assigned route packages',
      'Navigating delivery routes efficiently',
      'Handing over packages and capturing proof of delivery',
      'Providing excellent customer service at the door'
    ],
    requirements: ['Valid driving license (two-wheeler or commercial vehicle depending on role)', 'Clean driving record', 'Smartphone proficiency for delivery apps', 'Good time management'],
    workEnvironment: 'Outdoors, driving or riding on local routes in varying traffic and weather conditions.',
    category: 'Logistics',
    relatedRoles: ['loader', 'warehouse-helper'],
    indexabilityStatus: 'eligible'
  }
];
