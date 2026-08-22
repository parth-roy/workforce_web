export const electricianCategories = [
  { id: 'switch-socket', label: 'Switch & socket', icon: 'Power' },
  { id: 'fan', label: 'Fan', icon: 'Fan' },
  { id: 'light', label: 'Light', icon: 'Lightbulb' },
  { id: 'wiring', label: 'Wiring', icon: 'Cable' },
  { id: 'doorbell', label: 'Doorbell & security', icon: 'Bell' },
  { id: 'mcb', label: 'MCB/fuse', icon: 'Zap' },
  { id: 'appliances', label: 'Appliances', icon: 'Tv' },
  { id: 'consultation', label: 'Book a consultation', icon: 'Users' },
];

export const electricianServices = [
  // Switch & socket
  {
    id: 's1',
    categoryId: 'switch-socket',
    title: 'Switch/socket repair & replacement',
    rating: '4.85',
    reviews: '19K',
    priceText: 'Starts at ₹69',
    image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg',
    optionsCount: 2,
    process: [
      { step: 1, title: 'Inspection', desc: 'We inspect your switch/socket & share a repair quote for approval.' },
      { step: 2, title: 'Quote approval', desc: 'You can approve the quote to proceed, or pay a visitation charge if you cancel.' }
    ],
    options: [
      { id: 's1-o1', title: '1 switch', rating: '4.83', reviews: '10K', price: 69, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg' },
      { id: 's1-o2', title: '2 switches', rating: '4.82', reviews: '9K', price: 109, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg' }
    ]
  },
  {
    id: 's2',
    categoryId: 'switch-socket',
    title: 'Switchboard repair & replacement',
    rating: '4.85',
    reviews: '56K',
    priceText: 'Starts at ₹149',
    bullets: ['Repair or replacement using existing in-wall wiring'],
    image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg',
    optionsCount: 4,
    process: [
      { step: 1, title: 'Inspection', desc: 'We inspect your switchboard & share a repair quote for approval.' },
      { step: 2, title: 'Quote approval', desc: 'You can approve the quote to proceed, or pay a visitation charge if you cancel.' },
      { step: 3, title: 'Repair & spare parts', desc: 'If needed, we will source spare parts from the local market.' },
      { step: 4, title: 'Replacement, if needed', desc: 'If repair is not possible, we will replace the switchboard.' }
    ],
    options: [
      { id: 's2-o1', title: '1 switch', rating: '4.83', reviews: '44K', price: 149, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg' },
      { id: 's2-o2', title: '2 switches', rating: '4.82', reviews: '19K', price: 199, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg' },
      { id: 's2-o3', title: 'More than 2 switches', rating: '4.82', reviews: '28K', price: 249, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg' },
      { id: 's2-o4', title: 'AC Switchboard', rating: '4.85', reviews: '17K', price: 249, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg' }
    ]
  },
  {
    id: 's3',
    categoryId: 'switch-socket',
    title: 'Plug replacement',
    rating: '4.85',
    reviews: '14K',
    priceText: 'Starts at ₹69',
    image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg',
    optionsCount: 2,
    process: [
      { step: 1, title: 'Inspection', desc: 'We inspect your plug & share a replacement quote for approval.' }
    ],
    options: [
      { id: 's3-o1', title: '1 plug', rating: '4.83', reviews: '10K', price: 69, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg' },
      { id: 's3-o2', title: '2 plugs', rating: '4.82', reviews: '4K', price: 129, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg' }
    ]
  },
  {
    id: 's4',
    categoryId: 'switch-socket',
    title: 'New switchbox installation',
    rating: '4.79',
    reviews: '42K',
    priceText: 'Starts at ₹149',
    bullets: ['Installed in specified area for new power outlet'],
    image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg',
    optionsCount: 4,
    process: [
      { step: 1, title: 'Inspection', desc: 'We inspect & share an installation quote for approval.' }
    ],
    options: [
      { id: 's4-o1', title: '1 switchbox', rating: '4.83', reviews: '10K', price: 149, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg' },
      { id: 's4-o2', title: '2 switchboxes', rating: '4.82', reviews: '12K', price: 298, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg' },
      { id: 's4-o3', title: '3 switchboxes', rating: '4.82', reviews: '10K', price: 447, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg' },
      { id: 's4-o4', title: '4 switchboxes', rating: '4.82', reviews: '10K', price: 596, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg' }
    ]
  },
  
  // Fan
  {
    id: 'f1',
    categoryId: 'fan',
    title: 'Fan repair',
    rating: '4.85',
    reviews: '102K',
    priceText: 'Starts at ₹149',
    bullets: ['BLDC/Smart fan repair service is not provided.'],
    image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413661131-ab108a.png',
    optionsCount: 3,
    process: [
      { step: 1, title: 'Inspection', desc: 'We inspect your fan & share a repair quote for approval.' }
    ],
    options: [
      { id: 'f1-o1', title: '1 fan', rating: '4.85', reviews: '50K', price: 149, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413661131-ab108a.png' },
      { id: 'f1-o2', title: '2 fans', rating: '4.85', reviews: '30K', price: 298, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413661131-ab108a.png' },
      { id: 'f1-o3', title: '3 fans', rating: '4.85', reviews: '22K', price: 447, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413661131-ab108a.png' }
    ]
  },
  {
    id: 'f2',
    categoryId: 'fan',
    title: 'Regular ceiling fan installation',
    rating: '4.84',
    reviews: '34K',
    priceText: 'Starts at ₹99',
    image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413661131-ab108a.png',
    optionsCount: 2,
    process: [
      { step: 1, title: 'Installation', desc: 'We will install your regular ceiling fan securely.' }
    ],
    options: [
      { id: 'f2-o1', title: '1 fan', rating: '4.84', reviews: '20K', price: 99, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413661131-ab108a.png' },
      { id: 'f2-o2', title: '2 fans', rating: '4.84', reviews: '14K', price: 198, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413661131-ab108a.png' }
    ]
  },
  
  // Light
  {
    id: 'l1',
    categoryId: 'light',
    title: 'Fancy light installation/replacement',
    rating: '4.82',
    reviews: '34K',
    priceText: 'Starts at ₹149',
    image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413663737-01054b.png',
    optionsCount: 0,
    price: 149,
    process: [
      { step: 1, title: 'Installation', desc: 'Secure installation of fancy lights.' }
    ]
  },
  
  // Wiring
  {
    id: 'w1',
    categoryId: 'wiring',
    title: 'New internal wiring (per 5m)',
    rating: '4.75',
    reviews: '18K',
    priceText: 'Starts at ₹199',
    image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413664796-0ba71f.png',
    optionsCount: 2,
    process: [
      { step: 1, title: 'Installation', desc: 'Internal concealed wiring per 5 meter length.' }
    ],
    options: [
      { id: 'w1-o1', title: 'Up to 5m', rating: '4.75', reviews: '10K', price: 199, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413664796-0ba71f.png' },
      { id: 'w1-o2', title: 'Up to 10m', rating: '4.75', reviews: '8K', price: 398, image: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413664796-0ba71f.png' }
    ]
  }
];
