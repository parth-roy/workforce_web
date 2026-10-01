/**
 * src/data/cityLocalities.js
 * Comprehensive registry of prominent employment hubs, industrial belts, and residential localities
 * mapped to Indian cities.
 */

export const CITY_LOCALITIES_MAP = {
  kolkata: [
    { name: "Salt Lake (Sector I-V)", popular: true },
    { name: "New Town & Action Area", popular: true },
    { name: "Howrah & Shibpur", popular: true },
    { name: "Barrackpore & Titagarh", popular: true },
    { name: "Dum Dum & Airport", popular: true },
    { name: "Behala & Taratala", popular: true },
    { name: "Jadavpur & Garia", popular: true },
    { name: "Rajarhat & Chinar Park", popular: true },
    { name: "Park Street & Camac St", popular: true },
    { name: "Ballygunge & Gariahat", popular: true },
    { name: "Alipore & New Alipore", popular: true },
    { name: "Burrabazar & Posta", popular: true },
    { name: "Dankuni Logistics Terminus", popular: true },
    { name: "Barasat & Madhyamgram", popular: false },
    { name: "Sodepur & Khardaha", popular: false },
    { name: "Tollygunge & Kudghat", popular: false },
    { name: "Kasba & Ruby Connector", popular: false },
    { name: "Ultadanga & Kankurgachi", popular: false },
    { name: "Shyambazar & Bagbazar", popular: false },
    { name: "Bhowanipore & Kalighat", popular: false },
    { name: "Sealdah & Entally", popular: false },
    { name: "Budge Budge & Maheshtala", popular: false },
    { name: "Sonarpur & Baruipur", popular: false },
    { name: "Dhulagarh & Sankrail", popular: false },
  ],

  barrackpore: [
    { name: "Talpukur & Math Para", popular: true },
    { name: "Anandapuri & Station Rd", popular: true },
    { name: "Palta & Bengal Enamel", popular: true },
    { name: "Titagarh & BT Road", popular: true },
    { name: "Monirampore & Riverside", popular: true },
    { name: "Khardaha & Rahara", popular: true },
    { name: "Sukchar & Panihati", popular: true },
    { name: "Sodepur & HB Town", popular: true },
    { name: "Agarpara & Station Rd", popular: false },
    { name: "Shyamnagar & Feeder Rd", popular: false },
    { name: "Ichapore & Rifle Factory Area", popular: false },
    { name: "Naihati & Ghoshpara", popular: false },
    { name: "Kankinara & Bhatpara", popular: false },
    { name: "Barasat Road Corridor", popular: false },
    { name: "Madhyamgram & Jessore Rd", popular: false },
    { name: "Barrackpore Cantonment", popular: false },
  ],

  howrah: [
    { name: "Shibpur & Mandirtala", popular: true },
    { name: "Howrah Station & Golabari", popular: true },
    { name: "Salkia & Bandhaghat", popular: true },
    { name: "Bally & Belur", popular: true },
    { name: "Liluah & Don Bosco Area", popular: true },
    { name: "Santragachi & Kona Expressway", popular: true },
    { name: "Dhulagarh Truck Terminal", popular: true },
    { name: "Sankrail Industrial Park", popular: true },
    { name: "Uluberia Industrial Area", popular: false },
    { name: "Domjur & Salap Junction", popular: false },
    { name: "Mourigram & Andul", popular: false },
    { name: "Bagnan Commercial Hub", popular: false },
  ],

  mumbai: [
    { name: "Andheri East (MIDC / SEEPZ)", popular: true },
    { name: "Andheri West (Lokhandwala)", popular: true },
    { name: "Bandra West & Bandra East", popular: true },
    { name: "BKC (Bandra Kurla Complex)", popular: true },
    { name: "Borivali West & East", popular: true },
    { name: "Goregaon East & West", popular: true },
    { name: "Malad (Mindspace / West)", popular: true },
    { name: "Kandivali East & West", popular: true },
    { name: "Powai & Hiranandani", popular: true },
    { name: "Ghatkopar East & West", popular: true },
    { name: "Dadar & Shivaji Park", popular: true },
    { name: "Kurla & Phoenix Marketcity", popular: true },
    { name: "Chembur & Tilak Nagar", popular: false },
    { name: "Thane West (Ghodbunder Rd)", popular: true },
    { name: "Thane East & Wagle Estate", popular: true },
    { name: "Navi Mumbai (Vashi / Sanpada)", popular: true },
    { name: "Navi Mumbai (Nerul / Belapur)", popular: true },
    { name: "Navi Mumbai (Airoli / Mahape)", popular: true },
    { name: "Panvel & Khandeshwar", popular: false },
    { name: "Kalyan & Dombivli", popular: false },
    { name: "Mira Road & Bhayandar", popular: false },
    { name: "Bhiwandi Logistics Hub", popular: false },
  ],

  "delhi-ncr": [
    { name: "Connaught Place & Central Delhi", popular: true },
    { name: "Dwarka (Sector 6-21)", popular: true },
    { name: "Rohini (Sector 3-18)", popular: true },
    { name: "Saket & South Ext", popular: true },
    { name: "Laxmi Nagar & Preet Vihar", popular: true },
    { name: "Janakpuri & Uttam Nagar", popular: true },
    { name: "Karol Bagh & Rajendra Nagar", popular: true },
    { name: "Pitampura & Netaji Subhash Place", popular: true },
    { name: "Okhla Industrial Area (Ph I-III)", popular: true },
    { name: "Noida Sector 18 & Atta", popular: true },
    { name: "Noida Sector 62 & 63 Hub", popular: true },
    { name: "Greater Noida (Pari Chowk)", popular: false },
    { name: "Gurgaon Cyber City & DLF", popular: true },
    { name: "Gurgaon Sector 29 & 44", popular: true },
    { name: "Gurgaon Sohna Road & Golf Course", popular: true },
    { name: "Manesar IMT Industrial Belt", popular: false },
    { name: "Faridabad (Sector 15-28)", popular: false },
    { name: "Ghaziabad (Indirapuram / Vaishali)", popular: false },
  ],

  bengaluru: [
    { name: "Koramangala (Block 1-8)", popular: true },
    { name: "Indiranagar & 100ft Road", popular: true },
    { name: "Whitefield & ITPL", popular: true },
    { name: "HSR Layout (Sector 1-7)", popular: true },
    { name: "Electronic City (Phase 1 & 2)", popular: true },
    { name: "Jayanagar & JP Nagar", popular: true },
    { name: "Marathahalli & Outer Ring Rd", popular: true },
    { name: "Bellandur & Sarjapur Rd", popular: true },
    { name: "BTM Layout & Silk Board", popular: true },
    { name: "Hebbal & Manyata Tech Park", popular: true },
    { name: "Yelahanka & New Town", popular: false },
    { name: "Rajajinagar & Malleshwaram", popular: false },
    { name: "Banashankari & Basavanagudi", popular: false },
    { name: "Peenya Industrial Area", popular: false },
    { name: "Kalyan Nagar & Kammanahalli", popular: false },
  ],

  hyderabad: [
    { name: "HITEC City & Cyber Towers", popular: true },
    { name: "Gachibowli & Financial District", popular: true },
    { name: "Madhapur & Kavuri Hills", popular: true },
    { name: "Kondapur & Botanical Garden", popular: true },
    { name: "Banjara Hills & Jubilee Hills", popular: true },
    { name: "Kukatpally & KPHB Colony", popular: true },
    { name: "Ameerpet & SR Nagar", popular: true },
    { name: "Begumpet & Somajiguda", popular: true },
    { name: "Secunderabad Station & Marredpally", popular: true },
    { name: "Miyapur & Chandanagar", popular: false },
    { name: "Dilsukhnagar & Kothapet", popular: false },
    { name: "Charminar & Old City", popular: false },
    { name: "Uppal & Habsiguda", popular: false },
    { name: "LB Nagar & Nagole", popular: false },
    { name: "Manikonda & Puppalaguda", popular: false },
  ],

  pune: [
    { name: "Hinjewadi (Phase 1, 2, 3)", popular: true },
    { name: "Kothrud & Karve Nagar", popular: true },
    { name: "Viman Nagar & Airport Rd", popular: true },
    { name: "Hadapsar & Magarpatta City", popular: true },
    { name: "Baner & Balewadi High Street", popular: true },
    { name: "Wakad & Vishal Nagar", popular: true },
    { name: "Aundh & Pashan", popular: true },
    { name: "Shivaji Nagar & FC Road", popular: true },
    { name: "Pimpri & Chinchwad Auto Hub", popular: true },
    { name: "Kharadi & EON IT Park", popular: true },
    { name: "Koregaon Park & Kalyani Nagar", popular: false },
    { name: "Katraj & Dhankawadi", popular: false },
    { name: "Bhosari MIDC Industrial Area", popular: false },
    { name: "Chakan Industrial Zone", popular: false },
  ],

  ahmedabad: [
    { name: "SG Highway Commercial Belt", popular: true },
    { name: "Satellite & Shivranjani", popular: true },
    { name: "Vastrapur & IIM Road", popular: true },
    { name: "Navrangpura & CG Road", popular: true },
    { name: "Bodakdev & Judges Bungalow", popular: true },
    { name: "Prahlad Nagar & Anand Nagar", popular: true },
    { name: "Maninagar & Kankaria", popular: true },
    { name: "Chandkheda & Motera", popular: true },
    { name: "Bopal & South Bopal", popular: false },
    { name: "Gota & New SG Road", popular: false },
    { name: "Naroda GIDC Industrial Belt", popular: false },
    { name: "Sanand Auto Industrial Belt", popular: false },
    { name: "Thaltej & Shilaj", popular: false },
  ],

  chennai: [
    { name: "T Nagar & Pondy Bazaar", popular: true },
    { name: "Velachery & Phoenix Marketcity", popular: true },
    { name: "Anna Nagar & Shanti Colony", popular: true },
    { name: "Adyar & Besant Nagar", popular: true },
    { name: "Guindy Industrial Estate", popular: true },
    { name: "OMR IT Corridor & Thoraipakkam", popular: true },
    { name: "Sholinganallur Junction", popular: true },
    { name: "Tambaram & Chromepet", popular: true },
    { name: "Porur & Ramapuram", popular: false },
    { name: "Mylapore & Mandaveli", popular: false },
    { name: "Nungambakkam & Sterling Rd", popular: false },
    { name: "Perambur & Kolathur", popular: false },
  ],

  jaipur: [
    { name: "Malviya Nagar & GT Mall", popular: true },
    { name: "Mansarovar & Madhyam Marg", popular: true },
    { name: "Vaishali Nagar & Amrapali", popular: true },
    { name: "Raja Park & Tilak Nagar", popular: true },
    { name: "C-Scheme & MI Road", popular: true },
    { name: "Tonk Road & Sitapura Industrial", popular: true },
    { name: "Jagatpura & Pratap Nagar", popular: true },
    { name: "Ajmer Road & DCM", popular: false },
    { name: "Vidhyadhar Nagar & Sikar Rd", popular: false },
    { name: "Sanganer Textile & Airport Zone", popular: false },
  ],

  lucknow: [
    { name: "Gomti Nagar & Patrakarpuram", popular: true },
    { name: "Hazratganj & Vidhan Sabha", popular: true },
    { name: "Alambagh & Transport Nagar", popular: true },
    { name: "Indira Nagar & Munshipulia", popular: true },
    { name: "Mahanagar & Gole Market", popular: true },
    { name: "Aliganj & Kapoorthala", popular: true },
    { name: "Ashiyana & Bangla Bazar", popular: true },
    { name: "Chinhat Industrial Area", popular: false },
    { name: "Charbagh & Station Rd", popular: false },
    { name: "Aminabad Commercial Market", popular: false },
  ],

  patna: [
    { name: "Boring Road & Chauraha", popular: true },
    { name: "Kankarbagh Main Road", popular: true },
    { name: "Danapur & Khagaul", popular: true },
    { name: "Bailey Road & Rupaspur", popular: true },
    { name: "Fraser Road & Dak Bungalow", popular: true },
    { name: "Rajendra Nagar & Stadium Area", popular: true },
    { name: "Patliputra Industrial Area", popular: true },
    { name: "Ashiana Nagar & Digha", popular: false },
    { name: "Exhibition Road & Gandhi Maidan", popular: false },
  ],

  bhubaneswar: [
    { name: "Saheed Nagar & Vani Vihar", popular: true },
    { name: "Chandrasekharpur & Infocity", popular: true },
    { name: "Patia & KIIT Square", popular: true },
    { name: "Nayapalli & IRC Village", popular: true },
    { name: "Jayadev Vihar & Ekamra", popular: true },
    { name: "Khandagiri & Aiginia", popular: true },
    { name: "Rasulgarh Industrial Area", popular: true },
    { name: "Mancheswar Industrial Estate", popular: false },
  ],
};

/**
 * Helper to get clean, sorted localities for any city input
 */
export function getCityLocalities(cityName) {
  if (!cityName) return [];
  const clean = cityName.trim().toLowerCase();

  // Try direct key match
  for (const [key, list] of Object.entries(CITY_LOCALITIES_MAP)) {
    if (
      clean === key ||
      clean.includes(key) ||
      key.includes(clean) ||
      (clean.includes('kolkata') && key === 'kolkata') ||
      (clean.includes('barrackpur') && key === 'barrackpore') ||
      (clean.includes('barrackpore') && key === 'barrackpore') ||
      (clean.includes('delhi') && key === 'delhi-ncr') ||
      (clean.includes('bombay') && key === 'mumbai') ||
      (clean.includes('bangalore') && key === 'bengaluru')
    ) {
      return list;
    }
  }

  // Fallback: return common commercial/central localities
  return [
    { name: `${cityName} Central`, popular: true },
    { name: `${cityName} Industrial Area`, popular: true },
    { name: `${cityName} Railway Station Area`, popular: true },
    { name: `${cityName} Main Market`, popular: true },
    { name: `${cityName} North Zone`, popular: false },
    { name: `${cityName} South Zone`, popular: false },
    { name: `${cityName} Bypass / Highway`, popular: false },
  ];
}
