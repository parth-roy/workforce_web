const fs = require('fs');
const crypto = require('crypto');

const eText = `
Switch & socket
Switch/socket repair & replacement
Switchboard repair & replacement
Plug replacement
New switchbox installation
Fan
Fan repair
Regular ceiling fan installation
Decorative fan installation
Exhaust/pedestal/tower fan installation
Fan regulator replacement
Light
Fancy light installation/replacement
Tubelight repair & installation
Bulb installation/replacement
Ceiling light installation
Hanging light/chandelier installation
Chandelier installation
Wiring
New internal wiring (per 5m)
New external wiring (per 5m)
Doorbell & security
Video doorbell installation
Wireless CCTV installation
Regular doorbell installation
MCB/fuse
MCB/fuse repair
MCB/fuse replacement
Submeter installation
Appliances
Home theatre installation
TV installation
TV uninstallation
Sound bar installation
Karbon Airzone installation
Inverter installation
Stabiliser installation
Inverter fuse replacement
Inverter servicing
Inverter check-up
Inverter uninstallation
Book a consultation
Electrician consultation
`;

const pText = `
Tap & mixer
Combo for tap & mixer
Tap repair
Tap installation/replacement
Tap accessory installation
Toilet
Combo for toilet
Jet spray repair/replacement
Toilet seat cover installation
Flush tank repair
External flush tank replacement
Toilet repair
Toilet replacement
Pot blockage
Bath & shower
Shower repair
Shower installation
Shower filter installation
Shower mixer tap installation
Bath accessories
Combo for bath accessories
Soap holder installation
Towel holder installation
Shelf installation
Basin & sink
Wash basin leakage repair
Wash basin blockage removal
Wash basin installation
Waste coupling installation
Drainage & blockage
Drain cover installation
Drain blockage removal
Appliance connections
Connection hose installation
Washing machine inlet installation
RO water connection installation
Water tank & motor
Combo for water tank & motor
Overhead water tank installation
Water tank repair
Motor installation
Motor air cavity removal
At home consultation
Plumber consultation
`;

const cText = `
Cupboard & drawer
Cupboard repair
Cupboard lock & latches
Drawer repair & installation
Kitchen fittings
Pull out drawer repair/replacement
Cabinet hinges
Cabinet hydraulic repair
Utensil rack installation
Shelves & decor
Decor installation
Mirror installation
Shelf installation
Wall cabinet assembly & installation
Bathroom mirror cabinet installation
Bath fittings & mirrors
Mirror installation
Soap holder installation
Towel holder installation
Shelf installation
Wooden door
Door repair
Door accessories & mesh installation
Door installation
Door lock repair & installation
Window & curtain
Window AC frame installation
Mosquito net installation
Blinds inspection & measurement
Window accessories
Window AC frame uninstallation
Window misalignment/jam repair
Curtain rod installation
Furniture repair
Bed support repair
Headboard repair
Wooden chair repair
Wooden table repair
Plastic buffer installation
Table/chair wheel fitting
Clothes hanger
Ceiling-mounted hanger installation
Wall hanger installation
Cloth drying rope installation
Book a consultation
Carpenters consultation
`;

const iconMap = {
  'Switch & socket': 'Power',
  'Fan': 'Fan',
  'Light': 'Lightbulb',
  'Wiring': 'Cable',
  'Doorbell & security': 'Bell',
  'MCB/fuse': 'Zap',
  'Appliances': 'Tv',
  'Tap & mixer': 'Droplets',
  'Toilet': 'CheckSquare',
  'Bath & shower': 'Droplet',
  'Bath accessories': 'Paperclip',
  'Basin & sink': 'Box',
  'Drainage & blockage': 'CircleSlash',
  'Appliance connections': 'Link2',
  'Water tank & motor': 'Database',
  'Cupboard & drawer': 'Layout',
  'Kitchen fittings': 'Wrench',
  'Shelves & decor': 'Layers',
  'Bath fittings & mirrors': 'Grid',
  'Wooden door': 'DoorOpen',
  'Window & curtain': 'Monitor',
  'Furniture repair': 'Hammer',
  'Clothes hanger': 'Scissors',
  'Book a consultation': 'Users',
  'At home consultation': 'Users'
};

const images = [
  'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1648085444654-b52e00.jpeg',
  'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413661131-ab108a.png',
  'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413663737-01054b.png',
  'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1647413664796-0ba71f.png'
];

function generate(text, filename) {
  const lines = text.trim().split('\n').map(x => x.trim()).filter(x => x);
  let categories = [];
  let services = [];
  let currentCategory = '';
  let catId = '';
  let idx = 0;

  for (const line of lines) {
    if (iconMap[line] || line === 'Book a consultation' || line === 'At home consultation') {
      currentCategory = line;
      catId = line.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
      const icon = iconMap[line] || 'Tool';
      categories.push(`{ id: '${catId}', label: '${line}', icon: '${icon}' }`);
    } else {
      const id = crypto.randomBytes(4).toString('hex');
      const img = images[idx % images.length];
      idx++;
      services.push(`{ 
        id: '${id}', 
        categoryId: '${catId}', 
        title: '${line}', 
        rating: '4.85', 
        reviews: '10K', 
        priceText: 'Starts at ₹99', 
        optionsCount: 2, 
        price: 99, 
        image: '${img}',
        process: [
          { step: 1, title: 'Inspection', desc: 'We inspect and share a quote for approval.' },
          { step: 2, title: 'Approval', desc: 'Approve to proceed or pay visiting fee.' }
        ],
        options: [
          {id:'${id}-o1', title: '1 Unit', rating:'4.85', reviews:'5K', price:99, image: '${img}'}, 
          {id:'${id}-o2', title:'2 Units', rating:'4.85', reviews:'2K', price:189, image: '${img}'}
        ] 
      }`);
    }
  }

  const js = `export const categories = [\n  ${categories.join(',\n  ')}\n];\n\nexport const services = [\n  ${services.join(',\n  ')}\n];`;
  fs.writeFileSync('src/data/mock/' + filename, js);
}

generate(eText, 'electricianCatalog.js');
generate(pText, 'plumberCatalog.js');
generate(cText, 'carpenterCatalog.js');
