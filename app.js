/* ============================================
   PropNest — Application Logic
   ============================================ */

'use strict';

// ── Constants ─────────────────────────────────
const STORAGE_KEY_LEADS   = 'propnest_leads';
const STORAGE_KEY_FAVS    = 'propnest_favs';
const STORAGE_KEY_USERS   = 'propnest_users';
const STORAGE_KEY_SESSION = 'propnest_session';
const STORAGE_KEY_CHATS   = 'propnest_chats';

// ── Cloudinary Config ──────────────────────────
// These are SAFE to expose: only the cloud name and an unsigned upload preset are used.
// No API secret is included. The upload preset is set to "unsigned" in the Cloudinary dashboard.
const CLOUDINARY_CLOUD_NAME    = 'dvi8bmhnf';
const CLOUDINARY_UPLOAD_PRESET = 'propnest_uploads';
const CLOUDINARY_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const CLOUDINARY_UPLOAD_URL    = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const AMENITIES_LIST = [
  'Parking', 'Swimming Pool', 'Gym', 'Power Backup', 'Lift/Elevator',
  'Security', 'Garden/Park', 'Club House', 'WiFi', 'Air Conditioning',
  'Furnished', 'Semi-Furnished', 'Pet Friendly', 'Water Supply 24/7',
  'CCTV', 'Play Area', 'Shopping Nearby', 'Metro Nearby',
];

// ── All India Cities (by state — used for dropdowns) ──────────────
const INDIA_CITIES_BY_STATE = [
  { state: 'Andaman & Nicobar Islands', cities: ['Port Blair', 'Diglipur', 'Mayabunder', 'Rangat', 'Havelock'] },
  { state: 'Andhra Pradesh',      cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur', 'Vizianagaram', 'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Chittoor', 'Hindupur', 'Proddatur', 'Bhimavaram', 'Madanapalle'] },
  { state: 'Arunachal Pradesh',   cities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Roing', 'Tezu', 'Ziro', 'Tawang'] },
  { state: 'Assam',               cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Diphu', 'Dhubri', 'Sivasagar', 'Karimganj'] },
  { state: 'Bihar',               cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Saharsa', 'Hajipur', 'Sasaram'] },
  { state: 'Chandigarh',          cities: ['Chandigarh'] },
  { state: 'Chhattisgarh',        cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Raigarh', 'Jagdalpur', 'Ambikapur', 'Dhamtari', 'Mahasamund'] },
  { state: 'Dadra & Nagar Haveli and Daman & Diu', cities: ['Silvassa', 'Daman', 'Diu'] },
  { state: 'Delhi',               cities: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'] },
  { state: 'Goa',                 cities: ['Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem'] },
  { state: 'Gujarat',             cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Nadiad', 'Bharuch', 'Anand', 'Morbi', 'Mehsana', 'Surendranagar', 'Gandhidham', 'Vapi', 'Navsari', 'Bhuj', 'Godhra', 'Palanpur'] },
  { state: 'Haryana',             cities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Thanesar', 'Kaithal', 'Rewari'] },
  { state: 'Himachal Pradesh',    cities: ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Baddi', 'Nahan', 'Kullu', 'Manali', 'Chamba'] },
  { state: 'Jammu & Kashmir',     cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua', 'Sopore', 'Udhampur', 'Rajouri', 'Poonch', 'Kupwara'] },
  { state: 'Jharkhand',           cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda', 'Gumia'] },
  { state: 'Karnataka',           cities: ['Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Davanagere', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru', 'Raichur', 'Bidar', 'Hosapete', 'Hassan', 'Gadag', 'Udupi'] },
  { state: 'Kerala',              cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur', 'Alappuzha', 'Palakkad', 'Kannur', 'Kottayam', 'Manjeri', 'Thalassery', 'Ponnani', 'Malappuram'] },
  { state: 'Ladakh',              cities: ['Leh', 'Kargil'] },
  { state: 'Lakshadweep',         cities: ['Kavaratti', 'Agatti', 'Amini', 'Minicoy'] },
  { state: 'Madhya Pradesh',      cities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Morena', 'Bhind', 'Chhindwara', 'Guna', 'Shivpuri'] },
  { state: 'Maharashtra',         cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Pimpri-Chinchwad', 'Nashik', 'Kalyan-Dombivli', 'Vasai-Virar', 'Aurangabad', 'Navi Mumbai', 'Solapur', 'Mira-Bhayandar', 'Bhiwandi', 'Amravati', 'Nanded', 'Kolhapur', 'Akola', 'Ulhasnagar', 'Sangli-Miraj & Kupwad', 'Malegaon', 'Jalgaon', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Ichalkaranji'] },
  { state: 'Manipur',             cities: ['Imphal', 'Thoubal', 'Kakching', 'Churachandpur'] },
  { state: 'Meghalaya',           cities: ['Shillong', 'Tura', 'Nongstoin', 'Jowai'] },
  { state: 'Mizoram',             cities: ['Aizawl', 'Lunglei', 'Saiha', 'Champhai'] },
  { state: 'Nagaland',            cities: ['Dimapur', 'Kohima', 'Mokokchung', 'Tuensang'] },
  { state: 'Odisha',              cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Bargarh'] },
  { state: 'Puducherry',          cities: ['Puducherry', 'Ozhukarai', 'Karaikal', 'Yanam', 'Mahe'] },
  { state: 'Punjab',              cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Ajitgarh (Mohali)', 'Hoshiarpur', 'Batala', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 'Khanna', 'Phagwara', 'Muktsar'] },
  { state: 'Rajasthan',           cities: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sriganganagar', 'Sikar', 'Pali', 'Tonk', 'Kishangarh', 'Beawar', 'Hanumangarh', 'Dhaulpur', 'Sawai Madhopur', 'Churu', 'Gangapur'] },
  { state: 'Sikkim',              cities: ['Gangtok', 'Namchi', 'Mangan', 'Gyalshing'] },
  { state: 'Tamil Nadu',          cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Tiruppur', 'Salem', 'Erode', 'Tirunelveli', 'Vellore', 'Thoothukkudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur', 'Udhagamandalam (Ooty)', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Kumarapalayam'] },
  { state: 'Telangana',           cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam', 'Khammam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda'] },
  { state: 'Tripura',             cities: ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar'] },
  { state: 'Uttar Pradesh',       cities: ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida', 'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Budaun', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Ayodhya', 'Maunath Bhanjan', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr'] },
  { state: 'Uttarakhand',         cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Kotdwar'] },
  { state: 'West Bengal',         cities: ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'English Bazar', 'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian', 'Ranaghat', 'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur', 'Jalpaiguri', 'Balurghat', 'Basirhat'] }
];

// Flat sorted list for quick lookup
const INDIA_CITIES_FLAT = [...new Set(INDIA_CITIES_BY_STATE.flatMap(g => g.cities))].sort();


// Property image placeholder URLs (via picsum with seeds for consistency)
const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
  'https://images.unsplash.com/photo-1549517045-bc93de075e53?w=600&q=80',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
];

// Photo presets for the post-lead picker (interior + exterior variety)
const PROPERTY_PHOTO_PRESETS = [
  { url:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',  label:'Modern Exterior'   },
  { url:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',  label:'Villa Front'       },
  { url:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',  label:'House Exterior'    },
  { url:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',  label:'Luxury Home'       },
  { url:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',  label:'Garden Villa'      },
  { url:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',     label:'Modern Kitchen'    },
  { url:'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',  label:'Living Room'       },
  { url:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',  label:'Bedroom Suite'     },
  { url:'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',     label:'Master Bathroom'   },
  { url:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',     label:'Apartment View'    },
  { url:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',  label:'Pool Area'         },
  { url:'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',  label:'Cozy Interior'     },
  { url:'https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&q=80',     label:'Balcony View'      },
  { url:'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',  label:'Penthouse Lobby'   },
];

// ── Seed Data ──────────────────────────────────
const SEED_LEADS = [
  {
    id: 'seed-1', type: 'rent', status: 'live',
    title: 'Spacious 2BHK Flat in Bandra West',
    description: 'Beautiful fully furnished 2BHK apartment on the 5th floor with sea view. Modern kitchen, marble flooring throughout. Walking distance to Bandra station and shopping malls. Ideal for professionals.',
    city: 'Mumbai', address: 'Bandra West',
    price: 45000, priceUnit: 'per month',
    bedrooms: 2, bathrooms: 2, area: 1100,
    images: [PROPERTY_IMAGES[0], PROPERTY_IMAGES[5], PROPERTY_IMAGES[6]],
    amenities: ['Parking', 'Lift/Elevator', 'Security', 'WiFi', 'Furnished', 'Air Conditioning'],
    contact: { name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@email.com' },
    postedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    verifiedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-2', type: 'sell', status: 'live',
    title: 'Luxurious 4BHK Villa in Whitefield',
    description: 'Premium gated community villa with private garden and rooftop terrace. Italian marble floors, modular kitchen, and a private pool. Close to top IT parks and international schools.',
    city: 'Bangalore', address: 'Whitefield',
    price: 2, priceUnit: 'total', priceDisplay: '₹2 Cr',
    bedrooms: 4, bathrooms: 4, area: 3200,
    images: [PROPERTY_IMAGES[1], PROPERTY_IMAGES[4], PROPERTY_IMAGES[7], PROPERTY_IMAGES[9]],
    amenities: ['Parking', 'Swimming Pool', 'Gym', 'Club House', 'Garden/Park', 'Security', 'CCTV'],
    contact: { name: 'Priya Mehta', phone: '9812345678', email: 'priya@realty.in' },
    postedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    verifiedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-3', type: 'rent', status: 'live',
    title: '1BHK Studio in Cyber City',
    description: 'Fully air-conditioned studio apartment steps from Cyber City metro. Perfect for IT professionals. 24/7 security, power backup, and shared gym on premises.',
    city: 'Hyderabad', address: 'Cyber City / HITEC',
    price: 18000, priceUnit: 'per month',
    bedrooms: 1, bathrooms: 1, area: 600,
    images: [PROPERTY_IMAGES[2], PROPERTY_IMAGES[8]],
    amenities: ['Power Backup', 'Gym', 'Lift/Elevator', 'Security', 'Metro Nearby', 'Air Conditioning'],
    contact: { name: 'Sanjay Reddy', phone: '9900887766', email: '' },
    postedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    verifiedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-4', type: 'sell', status: 'live',
    title: 'Ready-to-Move 3BHK in Koregaon Park',
    description: 'Premium apartment in sought-after Koregaon Park. Vaastu compliant, south-facing, unobstructed views. With covered parking, modular kitchen, and storage room.',
    city: 'Pune', address: 'Koregaon Park',
    price: 1.2, priceUnit: 'total', priceDisplay: '₹1.2 Cr',
    bedrooms: 3, bathrooms: 3, area: 1800,
    images: [PROPERTY_IMAGES[3], PROPERTY_IMAGES[0], PROPERTY_IMAGES[5]],
    amenities: ['Parking', 'Lift/Elevator', 'Security', 'Garden/Park', 'Club House', 'Power Backup'],
    contact: { name: 'Anjali Desai', phone: '9823001122', email: 'anjali@homes.com' },
    postedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    verifiedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-5', type: 'buy', status: 'live',
    title: 'Looking for 2BHK Flat in South Delhi',
    description: 'Serious buyer looking for a 2BHK flat in South Delhi (Lajpat Nagar, Saket, or Vasant Kunj). Budget up to ₹90 lakhs. Prefer ready-to-move, good ventilation, and a parking spot.',
    city: 'Delhi', address: 'South Delhi',
    price: 9000000, priceUnit: 'total', priceDisplay: '₹90 Lakhs Budget',
    bedrooms: 2, bathrooms: 2, area: 1000,
    images: [PROPERTY_IMAGES[4], PROPERTY_IMAGES[1]],
    amenities: ['Parking', 'Security', 'Lift/Elevator'],
    contact: { name: 'Vikram Nair', phone: '9811223344', email: 'vikram.nair@gmail.com' },
    postedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    verifiedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-6', type: 'rent', status: 'live',
    title: 'Newly Renovated 3BHK in Anna Nagar',
    description: 'Freshly painted 3BHK with modular kitchen and teak wood wardrobes. Easy access to Anna Nagar main road, bus stops, and schools. Children play area and swimming pool in complex.',
    city: 'Chennai', address: 'Anna Nagar West',
    price: 30000, priceUnit: 'per month',
    bedrooms: 3, bathrooms: 2, area: 1400,
    images: [PROPERTY_IMAGES[5], PROPERTY_IMAGES[9], PROPERTY_IMAGES[3]],
    amenities: ['Swimming Pool', 'Power Backup', 'Parking', 'Security', 'Play Area', 'Water Supply 24/7'],
    contact: { name: 'Kavitha Rajan', phone: '9941523678', email: '' },
    postedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    verifiedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-7', type: 'buy', status: 'live',
    title: 'Urgent: Buyer for 3BHK in Prahlad Nagar',
    description: 'NRI looking to invest in a 3BHK flat in Prahlad Nagar or Satellite area, Ahmedabad. Ready-to-move preferred. Budget is flexible for the right property with parking.',
    city: 'Ahmedabad', address: 'Prahlad Nagar / Satellite',
    price: 7500000, priceUnit: 'total', priceDisplay: '₹75 Lakhs Budget',
    bedrooms: 3, bathrooms: 2, area: 1500,
    images: [PROPERTY_IMAGES[6], PROPERTY_IMAGES[2]],
    amenities: ['Parking', 'Security', 'Power Backup'],
    contact: { name: 'Niraj Patel', phone: '9978234000', email: 'niraj@nri.org' },
    postedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    verifiedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-8', type: 'sell', status: 'live',
    title: 'Corner Plot House in Salt Lake',
    description: 'Independent 3-storey house on a corner plot with ample natural light. Consists of 5 bedrooms, 3 bathrooms, and a large terrace. Can be used for residential or commercial purpose.',
    city: 'Kolkata', address: 'Salt Lake City Sector V',
    price: 1.8, priceUnit: 'total', priceDisplay: '₹1.8 Cr',
    bedrooms: 5, bathrooms: 3, area: 2800,
    images: [PROPERTY_IMAGES[7], PROPERTY_IMAGES[0], PROPERTY_IMAGES[4]],
    amenities: ['Parking', 'Garden/Park', 'CCTV', 'Pet Friendly', 'Shopping Nearby'],
    contact: { name: 'Debashish Bose', phone: '9830001212', email: 'dbose@gmail.com' },
    postedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    verifiedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-9', type: 'rent', status: 'live',
    title: 'Premium 2BHK near Hawa Mahal',
    description: 'Brand new apartment with 24/7 security, power backup, and landscaped garden. Excellent connectivity to Jaipur city center and major IT hubs. Ideal for families or working couples.',
    city: 'Jaipur', address: 'Malviya Nagar',
    price: 22000, priceUnit: 'per month',
    bedrooms: 2, bathrooms: 2, area: 1050,
    images: [PROPERTY_IMAGES[8], PROPERTY_IMAGES[6]],
    amenities: ['Parking', 'Garden/Park', 'Security', 'Power Backup', 'Water Supply 24/7', 'CCTV'],
    contact: { name: 'Meena Sharma', phone: '9828119922', email: 'meena.s@gmail.com' },
    postedAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
    verifiedAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-10', type: 'sell', status: 'live',
    title: '1BHK Investment Flat — Diamond Borsad Road',
    description: 'Great investment opportunity — a well-located 1BHK in Surat ideal for rental income. Gated society, close to textile market and railway station. Possession in 3 months.',
    city: 'Surat', address: 'Adajan',
    price: 3500000, priceUnit: 'total', priceDisplay: '₹35 Lakhs',
    bedrooms: 1, bathrooms: 1, area: 540,
    images: [PROPERTY_IMAGES[9], PROPERTY_IMAGES[3], PROPERTY_IMAGES[8]],
    amenities: ['Lift/Elevator', 'Parking', 'Security', 'CCTV', 'Metro Nearby'],
    contact: { name: 'Hitesh Gajjar', phone: '9824567890', email: '' },
    postedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    verifiedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
];

// ── Seed Users ──────────────────────────────
const SEED_USERS = [
  { id: 'u-admin', name: 'Admin SuperUser',  email: 'admin@propnest.com', password: 'Admin@123', role: 'admin', agentVerified: false, createdAt: Date.now() - 30*86400*1000 },
  { id: 'u-agent', name: 'Raj Properties',   email: 'agent@propnest.com', password: 'Agent@123', role: 'agent', agentVerified: true,  createdAt: Date.now() - 20*86400*1000 },
  { id: 'u-user',  name: 'Demo User',        email: 'user@propnest.com',  password: 'User@123',  role: 'user',  agentVerified: false, createdAt: Date.now() - 10*86400*1000 },
];

// ── Auth State ──────────────────────────────
let authState = {
  users:      [],
  currentUser: null,
  signupRole: 'user',
};

// ── State ──────────────────────────────────────
let state = {
  leads:       [],
  favourites:  [],
  chats:       [],
  activeTab:   'all',
  searchQuery: '',
  filterCity:  '',
  filterBeds:  '',
  filterPrice: '',
  sortBy:      'newest',
  viewMode:    'grid',
  selectedAmenities: [],
  selectedPhotos:    [],
  currentDetailId: null,
  editingLeadId:   null,
};

// ── Utility helpers ────────────────────────────
function fmt(n) { return new Intl.NumberFormat('en-IN').format(n); }

function formatPrice(lead) {
  if (lead.priceDisplay) return lead.priceDisplay;
  if (lead.type === 'rent') return `₹${fmt(lead.price)}`;
  if (lead.price >= 10000000) return `₹${(lead.price / 10000000).toFixed(2)} Cr`;
  if (lead.price >= 100000)   return `₹${(lead.price / 100000).toFixed(1)} Lakh`;
  return `₹${fmt(lead.price)}`;
}

function formatDate(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 2)  return 'Just now';
  if (m < 60) return `${m} min ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function genId() { return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

function randomImage() { return PROPERTY_IMAGES[Math.floor(Math.random() * PROPERTY_IMAGES.length)]; }

// ── LocalStorage ───────────────────────────────
function loadFromStorage() {
  try {
    const leads = JSON.parse(localStorage.getItem(STORAGE_KEY_LEADS) || 'null');
    const favs  = JSON.parse(localStorage.getItem(STORAGE_KEY_FAVS)  || '[]');
    const chats = JSON.parse(localStorage.getItem(STORAGE_KEY_CHATS) || '[]');
    state.chats = chats;
    if (!leads) {
      // First run — seed data
      state.leads      = [...SEED_LEADS];
      state.favourites = favs;
      saveLeads();
    } else {
      state.leads      = leads;
      state.favourites = favs;
    }
  } catch {
    state.leads      = [...SEED_LEADS];
    state.favourites = [];
    saveLeads();
  }
}

function saveLeads()     { localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(state.leads)); }
function saveFavourites(){ localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(state.favourites)); }
function saveChats()     { localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(state.chats)); }

// ══════════════════════════════════════════
// AUTH MODULE
// ══════════════════════════════════════════

function loadUsers() {
  try {
    const u = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || 'null');
    authState.users = u || [...SEED_USERS];
    if (!u) saveUsers();
  } catch { authState.users = [...SEED_USERS]; saveUsers(); }
}
function saveUsers() { localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(authState.users)); }

function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY_SESSION) || 'null');
    if (s) {
      const user = authState.users.find(u => u.id === s.userId);
      if (user) { authState.currentUser = user; return true; }
    }
  } catch {}
  return false;
}
function saveSession(userId) { localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({ userId })); }
function clearSession()      { localStorage.removeItem(STORAGE_KEY_SESSION); authState.currentUser = null; }

function loginUser(email, password) {
  return authState.users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  ) || null;
}

function registerUser(name, email, password, role) {
  if (authState.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: 'Email already registered. Try logging in.' };
  }
  const user = { id: `u-${Date.now()}`, name: name.trim(), email: email.toLowerCase().trim(), password, role, createdAt: Date.now() };
  authState.users.push(user);
  saveUsers();
  return user;
}

function logoutUser() {
  clearSession();
  const ap = document.getElementById('adminPanel');
  const ls = document.querySelector('.listings-section');
  const ss = document.querySelector('.search-section');
  if (ap) ap.style.display = 'none';
  if (ls) ls.style.display = '';
  if (ss) ss.style.display = '';
  document.getElementById('navUser').style.display = 'none';
  ['tab-mine','tab-admin','mobile-tab-mine','mobile-tab-admin','tab-favs','mobile-tab-favs'].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.display = 'none';
  });
  state.activeTab = 'all';
  document.querySelectorAll('.nav-tab').forEach(t => { t.classList.toggle('active', t.dataset.tab === 'all'); });
  showAuthScreen();
}

// ── Role Helpers ──────────────────────────────
function getRole()          { return authState.currentUser?.role || 'user'; }
function isAdmin()          { return getRole() === 'admin'; }
function isAgent()          { return getRole() === 'agent'; }
function canDeleteLead(lead) {
  if (!authState.currentUser) return false;
  return isAdmin() || (lead.postedBy && lead.postedBy === authState.currentUser.id);
}

// ── Auth Screen ──────────────────────────────
function showAuthScreen() {
  const el = document.getElementById('authScreen');
  if (!el) return;
  el.style.display = 'flex';
  el.classList.remove('hiding');
}
function hideAuthScreen() {
  const el = document.getElementById('authScreen');
  if (!el) return;
  el.classList.add('hiding');
  setTimeout(() => { el.style.display = 'none'; }, 400);
}
function showAuthError(el, msg)  { el.textContent = msg; el.style.display = 'block'; }
function clearAuthError(el)      { el.textContent = ''; el.style.display = 'none'; }

// ── Nav UI Update ────────────────────────────
function updateNavForUser() {
  const user = authState.currentUser;
  if (!user) return;
  const navUser = document.getElementById('navUser');
  navUser.style.display  = 'flex';
  document.getElementById('navAvatar').textContent   = initials(user.name).slice(0, 2);
  document.getElementById('navUserName').textContent = user.name.split(' ')[0];
  const badge = document.getElementById('navRoleBadge');
  badge.textContent = user.role;
  badge.className   = `role-badge role-${user.role}`;
  const postBtn = document.getElementById('openPostModal');
  postBtn.innerHTML = `<span class="plus">＋</span> ${user.role === 'user' ? 'Post Inquiry' : 'Post Lead'}`;
  const mobilePost = document.getElementById('mobilePostLead');
  if (mobilePost) mobilePost.textContent = user.role === 'user' ? '＋ Post Inquiry' : '＋ Post Lead';
  const showMine  = user.role === 'agent' || user.role === 'admin';
  const showAdmin = user.role === 'admin';
  ['tab-mine','mobile-tab-mine'].forEach(id => { const e = document.getElementById(id); if (e) e.style.display = showMine  ? '' : 'none'; });
  ['tab-admin','mobile-tab-admin'].forEach(id => { const e = document.getElementById(id); if (e) e.style.display = showAdmin ? '' : 'none'; });
  ['tab-favs','mobile-tab-favs'].forEach(id => { const e = document.getElementById(id); if (e) e.style.display = ''; });

  const upgradeBtn = document.getElementById('upgradeBtn');
  if (upgradeBtn) {
    if (user.role === 'agent' && user.plan !== 'premium') {
      upgradeBtn.style.display = 'inline-block';
    } else {
      upgradeBtn.style.display = 'none';
    }
  }
}

// ── My Listings Count Badge ────────────────────
function updateMineTabCount() {
  const tab = document.getElementById('tab-mine');
  if (!tab || !authState.currentUser) return;
  const count = state.leads.filter(l => l.postedBy === authState.currentUser.id).length;
  const existing = tab.querySelector('.mine-count');
  if (existing) existing.remove();
  if (count > 0) {
    const b = document.createElement('span');
    b.className = 'mine-count'; b.textContent = count;
    tab.appendChild(b);
  }
}

// ── Post Form Role Restrictions ────────────────
function applyPostFormRoleRestrictions() {
  const role = getRole();
  const typeRent = document.getElementById('typeRent');
  const typeSell = document.getElementById('typeSell');
  const typeBuy  = document.getElementById('typeBuy');
  if (role === 'user') {
    typeRent?.classList.add('restricted');
    typeSell?.classList.add('restricted');
    typeBuy?.classList.remove('restricted');
    resetTypeButtons('buy');
  } else {
    typeRent?.classList.remove('restricted');
    typeSell?.classList.remove('restricted');
    typeBuy?.classList.remove('restricted');
    resetTypeButtons('rent');
  }
}

function updateDynamicFormFields() {
  const propGroup = document.getElementById('formPropType')?.value || 'residential';
  const leadType = document.getElementById('selectedType')?.value || 'rent';

  const wBeds = document.getElementById('wrapBedrooms');
  const wBaths = document.getElementById('wrapBathrooms');
  const lblBaths = document.getElementById('lblBathrooms');
  const wPhotos = document.getElementById('wrapPhotos');
  const wAmen = document.getElementById('wrapAmenities');

  if (leadType === 'buy') {
    if (wPhotos) wPhotos.style.display = 'none';
  } else {
    // If not buy, show photos
    if (wPhotos) wPhotos.style.display = 'block';
  }

  if (propGroup === 'land') {
    if (wBeds) wBeds.style.display = 'none';
    if (wBaths) wBaths.style.display = 'none';
    if (wAmen) wAmen.style.display = 'none';
  } else if (propGroup === 'commercial') {
    if (wBeds) wBeds.style.display = 'none';
    if (wBaths) { wBaths.style.display = 'block'; if (lblBaths) lblBaths.textContent = 'Washrooms'; }
    if (wAmen) wAmen.style.display = 'block';
  } else {
    // residential
    if (wBeds) wBeds.style.display = 'block';
    if (wBaths) { wBaths.style.display = 'block'; if (lblBaths) lblBaths.textContent = 'Bathrooms'; }
    if (wAmen) wAmen.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const formPropType = document.getElementById('formPropType');
  if (formPropType) formPropType.addEventListener('change', updateDynamicFormFields);
});

// ── Admin Panel ──────────────────────────────
function renderAdminPanel() {
  const panel = document.getElementById('adminPanel');
  if (!panel) return;
  const users = authState.users;
  const leads = state.leads;
  const rentC    = leads.filter(l => l.type === 'rent').length;
  const sellC    = leads.filter(l => l.type === 'sell').length;
  const buyC     = leads.filter(l => l.type === 'buy').length;
  const pendingC = leads.filter(l => l.status === 'pending').length;
  const liveC    = leads.filter(l => l.status === 'live' || !l.status).length;
  const pendingLeads = leads.filter(l => l.status === 'pending');

  const premiumUsers = users.filter(u => u.plan === 'premium').length;
  const mockMRR = premiumUsers * 999;

  panel.style.display = 'block';
  panel.innerHTML = `
    <div class="container" style="padding-bottom:80px;">
      <h2 class="listings-title" style="margin-bottom:24px;padding-top:20px;">⚙️ Admin Dashboard</h2>
      <div class="admin-stats">
        <div class="admin-stat-card"><div class="admin-stat-icon">🏠</div><div class="admin-stat-num">${leads.length}</div><div class="admin-stat-label">Total Listings</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">🌆</div><div class="admin-stat-num">${new Set(leads.map(l => l.city)).size}</div><div class="admin-stat-label">Cities Covered</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">👥</div><div class="admin-stat-num">${users.filter(u => u.role === 'agent').length}</div><div class="admin-stat-label">Total Agents</div></div>
        <div class="admin-stat-card" style="border-color:rgba(74,222,128,0.3);"><div class="admin-stat-icon">✅</div><div class="admin-stat-num" style="background:linear-gradient(135deg,#4ade80,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${liveC}</div><div class="admin-stat-label">Verified Listings</div></div>
        <div class="admin-stat-card" style="${pendingC > 0 ? 'border-color:rgba(251,191,36,0.4);' : ''}"><div class="admin-stat-icon">⏳</div><div class="admin-stat-num" style="${pendingC > 0 ? 'background:linear-gradient(135deg,#fbbf24,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;' : ''}">${pendingC}</div><div class="admin-stat-label">Pending</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">🔑</div><div class="admin-stat-num">${rentC}</div><div class="admin-stat-label">Rent</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">🏷️</div><div class="admin-stat-num">${sellC}</div><div class="admin-stat-label">Sale</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">🛒</div><div class="admin-stat-num">${buyC}</div><div class="admin-stat-label">Buy</div></div>
      </div>

      <h3 class="admin-section-title" style="margin-top:32px;">📈 Financials & Analytics</h3>
      <div class="admin-stats" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
        <div class="admin-stat-card" style="border-color:rgba(245,158,11,0.3); background:rgba(245,158,11,0.02);">
          <div class="admin-stat-icon">👑</div>
          <div class="admin-stat-num" style="color:#f59e0b;">${premiumUsers}</div>
          <div class="admin-stat-label">Premium Subscribers</div>
        </div>
        <div class="admin-stat-card" style="border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.02);">
          <div class="admin-stat-icon">💰</div>
          <div class="admin-stat-num" style="color:#10b981;">₹${mockMRR.toLocaleString()}</div>
          <div class="admin-stat-label">Mock MRR</div>
        </div>
      </div>

      ${pendingLeads.length > 0 ? `
      <h3 class="admin-section-title" style="color:#fbbf24;">⏳ Pending Approval (${pendingLeads.length})</h3>
      <div class="admin-table-wrap">
        <table class="admin-table"><thead><tr>
          <th>Title</th><th>Type</th><th>City</th><th>Posted By</th><th>Role</th><th>Actions</th>
        </tr></thead><tbody>
          ${pendingLeads.map(lead => {
            const poster = users.find(u => u.id === lead.postedBy);
            return `<tr style="background:rgba(251,191,36,0.04);">
              <td title="${lead.title}">${lead.title.length > 30 ? lead.title.slice(0,30)+'…' : lead.title}</td>
              <td><span class="card-type-badge badge-${lead.type}" style="position:static;display:inline-block;">${lead.type.toUpperCase()}</span></td>
              <td>${lead.city}</td>
              <td>${poster ? poster.name : '<em style="color:var(--text-muted)">Unknown</em>'}</td>
              <td>${poster ? `<span class="user-role-pill pill-${poster.role}">${poster.role}</span>` : '-'}</td>
              <td>
                <div class="admin-action-row">
                  <button class="btn-approve" onclick="adminApproveLead('${lead.id}')">\u2713 Approve</button>
                  <button class="btn-reject"  onclick="adminRejectLead('${lead.id}')">\u2715 Reject</button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody></table>
      </div>` : `<div class="admin-all-clear">✅ No pending listings — all caught up!</div>`}

      <h3 class="admin-section-title">📋 All Listings</h3>
      <div class="admin-table-wrap">
        <table class="admin-table"><thead><tr>
          <th>Title</th><th>Type</th><th>Status</th><th>City</th><th>Price</th><th>Posted By</th><th>Date</th><th>Action</th>
        </tr></thead><tbody>
          ${leads.map(lead => {
            const poster = users.find(u => u.id === lead.postedBy);
            const statusHtml = lead.status === 'live' ? '<span class="user-role-pill" style="background:rgba(74,222,128,0.1);color:#4ade80;">✓ Live</span>'
                             : lead.status === 'pending' ? '<span class="user-role-pill" style="background:rgba(251,191,36,0.1);color:#fbbf24;">⏳ Pending</span>'
                             : lead.status === 'rejected' ? '<span class="user-role-pill" style="background:rgba(239,68,68,0.1);color:#f87171;">✕ Rejected</span>'
                             : '<span class="user-role-pill" style="background:rgba(74,222,128,0.1);color:#4ade80;">✓ Live</span>';
            return `<tr>
              <td title="${lead.title}">${lead.title.length > 30 ? lead.title.slice(0,30)+'…' : lead.title}</td>
              <td><span class="card-type-badge badge-${lead.type}" style="position:static;display:inline-block;">${lead.type.toUpperCase()}</span></td>
              <td>${statusHtml}</td>
              <td>${lead.city}</td>
              <td>${formatPrice(lead)}</td>
              <td>${poster ? poster.name : '<em style="color:var(--text-muted)">Seeded</em>'}</td>
              <td>${formatDate(lead.postedAt)}</td>
              <td><button class="btn-admin-delete" onclick="adminDeleteLead('${lead.id}')">\ud83d\uddd1 Del</button></td>
            </tr>`;
          }).join('')}
        </tbody></table>
      </div>

      <h3 class="admin-section-title">👥 Registered Users</h3>
      <div class="admin-table-wrap">
        <table class="admin-table"><thead><tr>
          <th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Listings</th><th>Action</th>
        </tr></thead><tbody>
          ${users.map(u => {
            const cnt = leads.filter(l => l.postedBy === u.id).length;
            let actionHtml;
            if (u.role === 'admin') {
              actionHtml = '<span style="color:var(--text-muted);font-size:0.78rem;">Super Admin</span>';
            } else if (u.role === 'agent') {
              actionHtml = `<div class="admin-action-row">
                <span class="user-role-pill pill-agent">✓ Agent</span>
                <button class="btn-reject" onclick="adminDemoteToUser('${u.id}')">↩ Revoke</button>
              </div>`;
            } else {
              actionHtml = `<button class="btn-verify-agent" onclick="adminPromoteToAgent('${u.id}')">&#11088; Make Agent</button>`;
            }
            return `<tr>
              <td>${u.name}</td>
              <td>${u.email}</td>
              <td><span class="user-role-pill pill-${u.role}">${u.role}</span></td>
              <td>${formatDate(u.createdAt)}</td>
              <td>${cnt}</td>
              <td>${actionHtml}</td>
            </tr>`;
          }).join('')}
        </tbody></table>
      </div>

      <!-- Webhook Tester -->
      <div class="webhook-tester" id="webhookTester">
        <h3 class="admin-section-title">🤖 WhatsApp Intake (Webhook Mock)</h3>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:8px;">Paste a mock WhatsApp message below. The system will parse it to auto-create a draft listing.</p>
        <textarea id="webhookPayload" placeholder='e.g. "I have a 2 BHK in Bandra for 40000 rent. Amenities: Gym, Parking"'></textarea>
        <button class="btn-primary" onclick="simulateWhatsAppWebhook()">Simulate Incoming Webhook</button>
      </div>

    </div>`;
}

function adminDeleteLead(id) {
  if (!isAdmin()) return;
  if (!confirm('Permanently delete this listing?')) return;
  state.leads = state.leads.filter(l => l.id !== id);
  saveLeads();
  renderAdminPanel();
  showToast('Listing deleted.', 'success');
}

function deleteLead(id, e) {
  if (e) { e.stopPropagation(); e.preventDefault(); }
  const lead = state.leads.find(l => l.id === id);
  if (!lead || !canDeleteLead(lead)) return;
  if (!confirm('Delete this listing?')) return;
  state.leads = state.leads.filter(l => l.id !== id);
  saveLeads();
  renderListings();
  updateMineTabCount();
  showToast('Listing deleted.', 'success');
}

// ── Init Auth ──────────────────────────────────
function initAuth() {
  loadUsers();
  const loggedIn = loadSession();
  if (loggedIn) { hideAuthScreen(); updateNavForUser(); }
  else           { showAuthScreen(); }

  // Password toggles
  ['login','signup'].forEach(p => {
    const toggle = document.getElementById(`${p}PassToggle`);
    const input  = document.getElementById(`${p}Password`);
    if (toggle && input) toggle.addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
      toggle.textContent = input.type === 'password' ? '\ud83d\udc41' : '\ud83d\ude48';
    });
  });

  // Auth tab switch
  document.getElementById('loginTabBtn').addEventListener('click', () => {
    document.getElementById('loginTabBtn').classList.add('active');
    document.getElementById('signupTabBtn').classList.remove('active');
    document.getElementById('loginForm').style.display  = '';
    document.getElementById('signupForm').style.display = 'none';
    clearAuthError(document.getElementById('loginError'));
  });
  document.getElementById('signupTabBtn').addEventListener('click', () => {
    document.getElementById('signupTabBtn').classList.add('active');
    document.getElementById('loginTabBtn').classList.remove('active');
    document.getElementById('signupForm').style.display = '';
    document.getElementById('loginForm').style.display  = 'none';
    clearAuthError(document.getElementById('signupError'));
  });

  // Wire Google sign-in button (placeholder — shows coming-soon toast)
  const googleBtn = document.getElementById('googleSignInBtn');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      showToast('Google Sign-In coming soon! Use email & password for now.', 'error');
    });
  }

  // Login submit
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errEl    = document.getElementById('loginError');
    clearAuthError(errEl);
    if (!email || !password) { showAuthError(errEl, 'Please fill in all fields.'); return; }
    const user = loginUser(email, password);
    if (!user) { showAuthError(errEl, 'Invalid email or password. Please try again.'); return; }
    authState.currentUser = user;
    saveSession(user.id);
    hideAuthScreen();
    updateNavForUser();
    renderListings();
    updateMineTabCount();
    showToast(`Welcome back, ${user.name.split(' ')[0]}! \ud83d\udc4b`, 'success');
  });

  // Signup submit
  document.getElementById('signupForm').addEventListener('submit', e => {
    e.preventDefault();
    const name     = document.getElementById('signupName').value.trim();
    const email    = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const errEl    = document.getElementById('signupError');
    clearAuthError(errEl);
    if (!name || !email || !password) { showAuthError(errEl, 'Please fill in all fields.'); return; }
    if (password.length < 6)          { showAuthError(errEl, 'Password must be at least 6 characters.'); return; }
    if (!/\S+@\S+\.\S+/.test(email))  { showAuthError(errEl, 'Please enter a valid email address.'); return; }
    const result = registerUser(name, email, password, 'user'); // Everyone starts as a user; agents are promoted by admin
    if (result.error) { showAuthError(errEl, result.error); return; }
    authState.currentUser = result;
    saveSession(result.id);
    hideAuthScreen();
    updateNavForUser();
    renderListings();
    showToast(`Welcome to PropNest, ${name.split(' ')[0]}! \ud83c\udf89`, 'success');
  });

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
}

window.adminDeleteLead = adminDeleteLead;
window.deleteLead      = deleteLead;

// ── Verification Helpers ────────────────────────
function getNewLeadStatus() {
  const role = getRole();
  if (role === 'admin') return 'live';
  if (role === 'agent') return (authState.currentUser?.agentVerified === true) ? 'live' : 'pending';
  return 'pending';
}

function adminApproveLead(id) {
  if (!isAdmin()) return;
  const lead = state.leads.find(l => l.id === id);
  if (!lead) return;
  lead.status = 'live';
  lead.verifiedAt = Date.now();
  saveLeads();
  renderAdminPanel();
  showToast('Listing approved — now live! ✓', 'success');
}

function adminRejectLead(id) {
  if (!isAdmin()) return;
  const lead = state.leads.find(l => l.id === id);
  if (!lead) return;
  const reason = prompt('Reason for rejection (optional):') || '';
  lead.status = 'rejected';
  lead.rejectionNote = reason;
  saveLeads();
  renderAdminPanel();
  showToast('Listing rejected.', 'success');
}

function adminVerifyAgent(userId) {
  if (!isAdmin()) return;
  const user = authState.users.find(u => u.id === userId);
  if (!user || user.role !== 'agent') return;
  user.agentVerified = true;
  user.agentVerifiedAt = Date.now();
  saveUsers();
  renderAdminPanel();
  showToast(`🏆 ${user.name} is now a Verified Agent! Their listings will auto-approve.`, 'success');
}

window.adminApproveLead  = adminApproveLead;
window.adminRejectLead   = adminRejectLead;
window.adminVerifyAgent  = adminVerifyAgent;

// ── Admin: Promote / Demote User Role ─────────
function adminPromoteToAgent(userId) {
  if (!isAdmin()) return;
  const user = authState.users.find(u => u.id === userId);
  if (!user || user.role === 'admin') return;
  if (!confirm(`Promote "${user.name}" to Verified Agent? They will be able to post and manage listings.`)) return;
  user.role = 'agent';
  user.agentVerified = true;
  user.agentVerifiedAt = Date.now();
  saveUsers();
  renderAdminPanel();
  showToast(`🏆 ${user.name} is now a Verified Agent!`, 'success');
}

function adminDemoteToUser(userId) {
  if (!isAdmin()) return;
  const user = authState.users.find(u => u.id === userId);
  if (!user || user.role === 'admin') return;
  if (!confirm(`Revoke Agent access for "${user.name}"? They will become a regular user.`)) return;
  user.role = 'user';
  user.agentVerified = false;
  saveUsers();
  renderAdminPanel();
  showToast(`${user.name} has been demoted to User.`, 'success');
}

window.adminPromoteToAgent = adminPromoteToAgent;
window.adminDemoteToUser   = adminDemoteToUser;

// ── Photo Selector ────────────────────────────
function initPhotoSelector() {
  state.selectedPhotos = [];

  // Preset grid
  const grid = document.getElementById('photoPresetGrid');
  if (!grid) return;
  grid.innerHTML = PROPERTY_PHOTO_PRESETS.map((p, i) =>
    `<div class="photo-preset-item" id="preset-img-${i}" data-url="${p.url}" onclick="togglePhotoPreset('${p.url}',${i})" title="${p.label}">
       <img src="${p.url}" alt="${p.label}" loading="lazy" />
       <span class="photo-preset-label">${p.label}</span>
       <div class="photo-preset-check">✓</div>
     </div>`
  ).join('');

  updateSelectedStrip();

  // Wire custom URL button
  const addBtn = document.getElementById('addCustomPhotoBtn');
  if (addBtn) addBtn.onclick = addCustomPhotoUrl;

  // Wire file input onchange (label triggers it natively via for="photoFileInput")
  const fileInput = document.getElementById('photoFileInput');
  if (fileInput) {
    fileInput.onchange = (e) => handlePhotoUpload(e.target.files);
  }
}

// ── Cloudinary Upload ─────────────────────────

// Upload a single File object → returns secure_url string
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.secure_url;
}

// Batch upload handler — called when user picks files from device
async function handlePhotoUpload(fileList) {
  if (!fileList || fileList.length === 0) return;

  const files = Array.from(fileList);
  const remaining = 5 - state.selectedPhotos.length;

  if (remaining <= 0) {
    showToast('Maximum 5 photos already selected.', 'error');
    return;
  }

  const toUpload = files.slice(0, remaining);
  if (files.length > remaining) {
    showToast(`Only ${remaining} more photo${remaining === 1 ? '' : 's'} allowed. Uploading first ${remaining}.`, 'success');
  }

  // Validate file types and sizes before uploading
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
  for (const file of toUpload) {
    if (!validTypes.includes(file.type)) {
      showToast(`"${file.name}" is not a supported image type.`, 'error');
      return;
    }
    if (file.size > CLOUDINARY_MAX_FILE_SIZE) {
      showToast(`"${file.name}" exceeds 10 MB limit.`, 'error');
      return;
    }
  }

  // Show uploading state on the button
  const uploadBtn = document.getElementById('uploadDeviceBtn');
  if (uploadBtn) { uploadBtn.disabled = true; uploadBtn.innerHTML = '⏳ Uploading…'; }

  // Add placeholder entries for each file
  const placeholderIds = toUpload.map((_, i) => `upload-placeholder-${Date.now()}-${i}`);
  const strip = document.getElementById('selectedPhotosStrip');

  // Add uploading placeholders to the strip immediately
  const existingRow = strip.querySelector('.selected-photos-row');
  placeholderIds.forEach((pid, i) => {
    const ph = document.createElement('div');
    ph.className = 'selected-photo-item upload-uploading';
    ph.id = pid;
    ph.innerHTML = `
      <div class="upload-progress-overlay">
        <div class="upload-spinner"></div>
        <span>${toUpload[i].name.length > 12 ? toUpload[i].name.slice(0,12)+'…' : toUpload[i].name}</span>
      </div>`;
    if (existingRow) {
      existingRow.appendChild(ph);
    } else {
      // If strip doesn't have a row yet, re-render it
      state.selectedPhotos.push('__placeholder__');
      updateSelectedStrip();
      state.selectedPhotos.pop();
      const newRow = strip.querySelector('.selected-photos-row') || strip;
      newRow.appendChild(ph);
    }
  });

  // Upload all files in parallel
  let successCount = 0;
  await Promise.all(toUpload.map(async (file, i) => {
    const phEl = document.getElementById(placeholderIds[i]);
    try {
      const url = await uploadToCloudinary(file);
      state.selectedPhotos.push(url);
      successCount++;
      // Remove placeholder (full strip re-render at end)
      phEl?.remove();
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      if (phEl) {
        phEl.classList.replace('upload-uploading', 'upload-error');
        phEl.innerHTML = `
          <div class="upload-progress-overlay">
            <span style="font-size:1.4rem;">✕</span>
            <span style="font-size:0.65rem;color:#f87171;">Failed</span>
          </div>`;
        // Remove error placeholder after 3s
        setTimeout(() => phEl?.remove(), 3000);
      }
    }
  }));

  // Reset file input so same files can be re-selected if needed
  const fileInput = document.getElementById('photoFileInput');
  if (fileInput) fileInput.value = '';

  // Re-render the strip with all successfully uploaded photos
  updateSelectedStrip();

  // Restore upload button
  if (uploadBtn) { uploadBtn.disabled = false; uploadBtn.innerHTML = '📁 Upload from Device'; }

  if (successCount > 0) {
    showToast(`✅ ${successCount} photo${successCount === 1 ? '' : 's'} uploaded successfully!`, 'success');
  }
}

window.handlePhotoUpload = handlePhotoUpload;


function togglePhotoPreset(url, index) {
  const idx = state.selectedPhotos.indexOf(url);
  const el  = document.getElementById(`preset-img-${index}`);
  if (idx !== -1) {
    state.selectedPhotos.splice(idx, 1);
    el?.classList.remove('selected');
  } else {
    if (state.selectedPhotos.length >= 5) { showToast('Maximum 5 photos allowed.', 'error'); return; }
    state.selectedPhotos.push(url);
    el?.classList.add('selected');
  }
  updateSelectedStrip();
}

function addCustomPhotoUrl() {
  const input = document.getElementById('customPhotoUrl');
  const url   = (input?.value || '').trim();
  if (!url) return;
  if (!url.startsWith('http')) { showToast('Enter a valid image URL (http…).', 'error'); return; }
  if (state.selectedPhotos.length >= 5) { showToast('Maximum 5 photos allowed.', 'error'); return; }
  if (state.selectedPhotos.includes(url)) { showToast('Already added.', 'error'); return; }
  state.selectedPhotos.push(url);
  if (input) input.value = '';
  updateSelectedStrip();
}

function removeSelectedPhoto(index) {
  const url = state.selectedPhotos[index];
  state.selectedPhotos.splice(index, 1);
  PROPERTY_PHOTO_PRESETS.forEach((p, i) => {
    if (p.url === url) document.getElementById(`preset-img-${i}`)?.classList.remove('selected');
  });
  updateSelectedStrip();
}

function updateSelectedStrip() {
  const strip = document.getElementById('selectedPhotosStrip');
  if (!strip) return;
  if (state.selectedPhotos.length === 0) {
    strip.innerHTML = '<p class="photo-none-hint">💡 No photos selected — a random photo will be used automatically.</p>';
    return;
  }
  strip.innerHTML = `
    <p class="photo-selected-count">📸 Selected (${state.selectedPhotos.length}/5) — drag to reorder</p>
    <div class="selected-photos-row">
      ${state.selectedPhotos.map((url, i) => `
        <div class="selected-photo-item">
          <img src="${url}" alt="Selected ${i+1}" />
          <button type="button" class="remove-photo-btn" onclick="removeSelectedPhoto(${i})" aria-label="Remove">✕</button>
          ${i === 0 ? '<span class="photo-primary-badge">Cover</span>' : ''}
        </div>`).join('')}
    </div>`;
}

window.togglePhotoPreset   = togglePhotoPreset;
window.addCustomPhotoUrl   = addCustomPhotoUrl;
window.removeSelectedPhoto = removeSelectedPhoto;

// ── Lightbox ──────────────────────────────────
let lightboxState = { images: [], currentIndex: 0 };

function openLightbox(leadId, startIndex) {
  const idx  = (typeof startIndex === 'number') ? startIndex : 0;
  const lead = state.leads.find(l => l.id === leadId);
  if (!lead) return;
  const images = getLeadImages(lead);
  lightboxState = { images, currentIndex: idx };
  // Build thumbs
  const thumbsEl = document.getElementById('lightboxThumbs');
  thumbsEl.innerHTML = images.length > 1 ? images.map((img, i) =>
    `<img class="lightbox-thumb ${i === idx ? 'active' : ''}" src="${img}" alt="Photo ${i+1}" onclick="lightboxGoTo(${i})" loading="lazy" />`
  ).join('') : '';
  updateLightboxDisplay();
  document.getElementById('lightbox').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  // Restore body scroll only if no modal is still open
  const modalOpen = document.querySelector('.modal-overlay.open');
  if (!modalOpen) document.body.style.overflow = '';
}

function navLightbox(dir) {
  const len = lightboxState.images.length;
  if (len < 2) return;
  lightboxState.currentIndex = (lightboxState.currentIndex + dir + len) % len;
  updateLightboxDisplay();
}

function lightboxGoTo(i) {
  lightboxState.currentIndex = i;
  updateLightboxDisplay();
}

function updateLightboxDisplay() {
  const { images, currentIndex } = lightboxState;
  const img = document.getElementById('lightboxImg');
  if (img) img.src = images[currentIndex];
  const counter = document.getElementById('lightboxCounter');
  if (counter) counter.textContent = `${currentIndex + 1} / ${images.length}`;
  document.querySelectorAll('.lightbox-thumb').forEach((t, i) => t.classList.toggle('active', i === currentIndex));
  const multi = images.length > 1;
  const prevEl = document.getElementById('lightboxPrev');
  const nextEl = document.getElementById('lightboxNext');
  if (prevEl) prevEl.style.display = multi ? '' : 'none';
  if (nextEl) nextEl.style.display = multi ? '' : 'none';
}

window.openLightbox  = openLightbox;
window.closeLightbox = closeLightbox;
window.navLightbox   = navLightbox;
window.lightboxGoTo  = lightboxGoTo;

// ── Detail Gallery ────────────────────────────
let detailGalleryState = { images: [], currentIndex: 0, leadId: null };

function getLeadImages(lead) {
  if (lead.images && lead.images.length > 0) return lead.images;
  if (lead.image) return [lead.image];
  return [PROPERTY_IMAGES[0]];
}

function renderDetailGallery(lead) {
  const images = getLeadImages(lead);
  detailGalleryState = { images, currentIndex: 0, leadId: lead.id };

  document.getElementById('detailImg').src = images[0];

  // Verified badge — shown below thumbnail strip, left-aligned
  const vRow = document.getElementById('detailVerifiedRow');
  if (vRow) vRow.style.display = (lead.status === 'live') ? '' : 'none';

  const prevBtn  = document.getElementById('detailGalleryPrev');
  const nextBtn  = document.getElementById('detailGalleryNext');
  const counter  = document.getElementById('detailPhotoCounter');
  const thumbsEl = document.getElementById('detailThumbs');
  const hasMulti = images.length > 1;

  if (prevBtn) prevBtn.style.display  = hasMulti ? '' : 'none';
  if (nextBtn) nextBtn.style.display  = hasMulti ? '' : 'none';
  if (counter) { counter.style.display = hasMulti ? '' : 'none'; counter.textContent = `1 / ${images.length}`; }

  if (thumbsEl) {
    thumbsEl.style.display = hasMulti ? 'flex' : 'none';
    thumbsEl.innerHTML = hasMulti ? images.map((img, i) =>
      `<div class="detail-thumb-item ${i === 0 ? 'active' : ''}"
            onclick="detailGallerySelectAndOpen(${i})"
            style="cursor:zoom-in;"
            title="Click to view full screen">
         <img src="${img}" alt="Photo ${i+1}" loading="lazy" />
         <div class="detail-thumb-expand">⛶</div>
       </div>`
    ).join('') : '';
  }
}

function openLightboxFromDetail() {
  openLightbox(detailGalleryState.leadId, detailGalleryState.currentIndex);
}

window.openLightboxFromDetail = openLightboxFromDetail;

// Combined: switch gallery index AND open lightbox (used by thumbnails)
window.detailGallerySelectAndOpen = function(index) {
  detailGalleryGoTo(index);
  openLightbox(detailGalleryState.leadId, index);
};

window.detailGalleryNav = function(dir) {
  const { images } = detailGalleryState;
  const idx = (detailGalleryState.currentIndex + dir + images.length) % images.length;
  detailGalleryGoTo(idx);
};

window.detailGalleryGoTo = function(index) {
  detailGalleryState.currentIndex = index;
  const { images } = detailGalleryState;
  const imgEl = document.getElementById('detailImg');
  if (imgEl) imgEl.src = images[index];
  const counter = document.getElementById('detailPhotoCounter');
  if (counter) counter.textContent = `${index + 1} / ${images.length}`;
  document.querySelectorAll('.detail-thumb-item').forEach((t, i) => t.classList.toggle('active', i === index));
};

// ── Filter + Sort ──────────────────────────────
function getFilteredLeads() {
  let list = [...state.leads];

  // Tab filter
  if (state.activeTab === 'mine') {
    list = list.filter(l => l.postedBy === authState.currentUser?.id);
    // mine tab shows all statuses (pending/live/rejected)
  } else if (state.activeTab === 'favs') {
    list = list.filter(l => state.favourites.includes(l.id));
  } else if (state.activeTab !== 'all' && state.activeTab !== 'admin') {
    list = list.filter(l => l.type === state.activeTab);
    // non-admins only see live listings
    if (!isAdmin()) list = list.filter(l => l.status === 'live' || !l.status);
  } else if (state.activeTab === 'all') {
    if (!isAdmin()) list = list.filter(l => l.status === 'live' || !l.status);
  }

  // Search query
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(l =>
      l.title.toLowerCase().includes(q)   ||
      l.city.toLowerCase().includes(q)    ||
      l.address.toLowerCase().includes(q) ||
      (l.description || '').toLowerCase().includes(q)
    );
  }

  // City filter
  if (state.filterCity) {
    list = list.filter(l => l.city === state.filterCity);
  }

  // Beds filter
  if (state.filterBeds) {
    const b = parseInt(state.filterBeds);
    list = list.filter(l => (b >= 4 ? l.bedrooms >= 4 : l.bedrooms === b));
  }

  // Price filter (works on rentals primarily)
  if (state.filterPrice) {
    const [min, max] = state.filterPrice.split('-').map(Number);
    list = list.filter(l => {
      const p = l.type === 'rent' ? l.price : 0;
      return p >= min && p <= max;
    });
  }

  // Sort
  if (state.sortBy === 'newest')     list.sort((a, b) => b.postedAt - a.postedAt);
  if (state.sortBy === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (state.sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);

  return list;
}

// ── Render cards ───────────────────────────────
function renderListings() {
  const grid   = document.getElementById('listingsGrid');
  const count  = document.getElementById('listingsCount');
  const title  = document.getElementById('listingsTitle');
  const stat   = document.getElementById('statListings');
  const list   = getFilteredLeads();

  // Update header
  const tabLabels = { all: 'All Properties', rent: 'Properties for Rent', sell: 'Properties for Sale', buy: 'Looking to Buy', mine: 'My Listings', favs: '❤️ Favourites' };
  title.textContent = tabLabels[state.activeTab] || 'All Properties';
  count.textContent = `${list.length} ${list.length === 1 ? 'property' : 'properties'} found`;

  // Animate stat counter
  animateCounter(stat, list.length, state.leads.length + ' listings'); 
  stat.textContent = state.leads.length + '+';

  // Grid/List mode
  grid.className = 'listings-grid' + (state.viewMode === 'list' ? ' list-view' : '');

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" role="status">
        <div class="empty-icon">🏚️</div>
        <h3>No properties found</h3>
        <p>Try adjusting your filters or <button onclick="openPostModal()" style="color:var(--primary-light);background:none;border:none;cursor:pointer;font-size:inherit;text-decoration:underline;">post the first lead</button>.</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map((lead, i) => buildCard(lead, i)).join('');

  // Attach card event listeners
  grid.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.card-fav')) return; // don't open on fav click
      openDetail(card.dataset.id);
    });
  });

  grid.querySelectorAll('.card-fav').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleFav(btn.dataset.id, btn);
    });
  });

  // Also prevent delete btn from opening card
  grid.querySelectorAll('.btn-card-action').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); });
  });

  updateMineTabCount();
}

function buildCard(lead, index) {
  const isFav    = state.favourites.includes(lead.id);
  const priceStr = formatPrice(lead);
  const unitStr  = (lead.type === 'rent' && !lead.priceDisplay) ? `/${lead.priceUnit.replace('per ', '')}` : '';
  const badgeCls = `badge-${lead.type}`;
  const badgeTxt = lead.type === 'rent' ? 'For Rent' : lead.type === 'sell' ? 'For Sale' : 'Want to Buy';
  let amenShow = (lead.amenities || []).slice(0, 3);
  if (lead.customFields && amenShow.length < 3) {
    const cfTags = lead.customFields.slice(0, 3 - amenShow.length).map(cf => `${cf.key}: ${cf.value}`);
    amenShow = amenShow.concat(cfTags);
  }
  const images   = getLeadImages(lead);
  const img      = images[0];
  const isLive   = lead.status === 'live' || !lead.status;
  const isPending = lead.status === 'pending';
  const isRejected = lead.status === 'rejected';

  const posterUser = authState.users.find(u => u.id === lead.postedBy);
  const isPremium = posterUser && posterUser.plan === 'premium';

  return `
  <article class="property-card" data-id="${lead.id}" role="listitem" tabindex="0"
    aria-label="${lead.title} - ${priceStr}"
    style="animation-delay:${index * 0.06}s"
    onkeydown="if(event.key==='Enter')openDetail('${lead.id}')">
    <div class="card-image">
      <img src="${img}" alt="${lead.title}" loading="lazy" onerror="this.src='${PROPERTY_IMAGES[0]}'" onclick="event.stopPropagation();openLightbox('${lead.id}',0)" style="cursor:zoom-in;" />
      <span class="card-type-badge ${badgeCls}">${badgeTxt}</span>
      ${isPending ? '<span class="card-status-badge badge-pending">⏳ Pending</span>' : ''}
      ${isRejected ? '<span class="card-status-badge badge-rejected">✕ Rejected</span>' : ''}
      ${lead.hasTranslations ? '<span class="card-photo-count" style="left:8px; right:auto; background:var(--primary); color:white;">🌐 22 Langs</span>' : ''}
      ${images.length > 1 ? `<span class="card-photo-count">📷 ${images.length}</span>` : ''}
      <button class="card-fav ${isFav ? 'active' : ''}" data-id="${lead.id}" aria-label="${isFav ? 'Remove from favourites' : 'Add to favourites'}" aria-pressed="${isFav}">
        ${isFav ? '❤️' : '🤍'}
      </button>
    </div>
    <div class="card-body">
      ${isLive ? '<div style="margin-bottom:8px;"><span class="card-verified-badge">✓ Verified Listing</span></div>' : ''}
      <div class="card-price">${priceStr}<span>${unitStr}</span></div>
      <div class="card-title" title="${lead.title}">${lead.title}</div>
      <div class="card-location">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${lead.address}, ${lead.city}
      </div>
      ${amenShow.length ? `<div class="card-amenities">${amenShow.map(a => `<span class="amenity-tag">${a}</span>`).join('')}</div>` : ''}
      <div class="card-specs">
        ${lead.propertyType !== 'land' && lead.propertyType !== 'commercial' ? `<div class="spec-item"><span class="spec-icon">🛏</span>${lead.bedrooms === 0 ? 'Studio' : lead.bedrooms + ' Bed'}</div>` : ''}
        ${lead.propertyType !== 'land' ? `<div class="spec-item"><span class="spec-icon">🚿</span>${lead.bathrooms} ${lead.propertyType === 'commercial' ? 'Wash' : 'Bath'}</div>` : ''}
        ${lead.area ? `<div class="spec-item"><span class="spec-icon">📐</span>${fmt(lead.area)} sqft</div>` : ''}
        ${lead.propertyType === 'land' ? `<div class="spec-item"><span class="spec-icon">🌳</span>Plot/Land</div>` : lead.propertyType === 'commercial' ? `<div class="spec-item"><span class="spec-icon">🏢</span>Commercial</div>` : ''}
      </div>
      <div class="card-footer">
        <div class="card-agent">
          <div class="agent-avatar">${initials(lead.contact.name)}</div>
          <div>
            <div class="agent-name">${lead.contact.name}${isPremium ? '<span class="agent-verified-badge" style="background:rgba(245,158,11,0.1); color:#f59e0b; border-color:rgba(245,158,11,0.3);">👑 Premium</span>' : lead.postedByRole === 'agent' ? '<span class="agent-verified-badge">✓ Agent</span>' : ''}</div>
          </div>
        </div>
        <span class="card-date">${formatDate(lead.postedAt)}</span>
      </div>
    </div>
    ${canDeleteLead(lead) ? `
      <div class="card-actions">
        <button class="btn-card-action edit" onclick="openEditListing('${lead.id}', event)" aria-label="Edit listing">✏️ Edit</button>
        <button class="btn-card-action delete" onclick="deleteLead('${lead.id}', event)" aria-label="Delete listing">🗑 Delete</button>
      </div>` : ''}
  </article>`;
}

// ── Counter animation ──────────────────────────
function animateCounter(el, target, label) {
  let current = 0;
  const step  = Math.ceil(target / 30);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + '+';
    if (current >= target) clearInterval(timer);
  }, 30);
}

// ── Favourites ─────────────────────────────────
function toggleFav(id, btn) {
  const idx = state.favourites.indexOf(id);
  if (idx === -1) {
    state.favourites.push(id);
    btn.classList.add('active');
    btn.innerHTML = '❤️';
    btn.setAttribute('aria-pressed', 'true');
    showToast('Added to favourites ❤️', 'success');
  } else {
    state.favourites.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '🤍';
    btn.setAttribute('aria-pressed', 'false');
    showToast('Removed from favourites', 'success');
  }
  saveFavourites();

  // Update detail modal fav if open
  if (state.currentDetailId === id) {
    const dBtn = document.getElementById('detailFavBtn');
    if (dBtn) {
      const isFav = state.favourites.includes(id);
      dBtn.innerHTML    = isFav ? '❤️' : '🤍';
      dBtn.classList.toggle('active', isFav);
    }
  }

  // Reload grid if on favs tab
  if (state.activeTab === 'favs') renderListings();
}

// ── Detail Modal ───────────────────────────────
function openDetail(id) {
  const lead = state.leads.find(l => l.id === id);
  if (!lead) return;

  state.currentDetailId = id;
  const isFav = state.favourites.includes(id);

  // Gallery
  renderDetailGallery(lead);

  const badge = document.getElementById('detailBadge');
  badge.textContent = lead.type === 'rent' ? 'For Rent' : lead.type === 'sell' ? 'For Sale' : 'Want to Buy';
  badge.className   = `card-type-badge badge-${lead.type}`;

  const favBtn  = document.getElementById('detailFavBtn');
  favBtn.innerHTML = isFav ? '❤️' : '🤍';
  favBtn.classList.toggle('active', isFav);
  favBtn.dataset.id = id;

  document.getElementById('detailPrice').textContent = formatPrice(lead) + (lead.type === 'rent' && !lead.priceDisplay ? `/${lead.priceUnit.replace('per ', '')}` : '');
  document.getElementById('detailTitle').textContent = lead.title;
  document.getElementById('detailLocation').innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    ${lead.address}, ${lead.city}`;

  let specsHTML = `
    ${lead.propertyType !== 'land' && lead.propertyType !== 'commercial' ? `<div class="detail-spec"><span class="detail-spec-icon">🛏</span><span class="detail-spec-val">${lead.bedrooms === 0 ? 'Studio' : lead.bedrooms}</span><span class="detail-spec-key">Beds</span></div>` : ''}
    ${lead.propertyType !== 'land' ? `<div class="detail-spec"><span class="detail-spec-icon">🚿</span><span class="detail-spec-val">${lead.bathrooms}</span><span class="detail-spec-key">${lead.propertyType === 'commercial' ? 'Washrooms' : 'Baths'}</span></div>` : ''}
    ${lead.area ? `<div class="detail-spec"><span class="detail-spec-icon">📐</span><span class="detail-spec-val">${fmt(lead.area)}</span><span class="detail-spec-key">Sq. Ft.</span></div>` : ''}
    <div class="detail-spec"><span class="detail-spec-icon">🏠</span><span class="detail-spec-val">${lead.propertyType === 'commercial' ? 'Commercial' : lead.propertyType === 'land' ? 'Plot/Land' : 'Residential'}</span><span class="detail-spec-key">Category</span></div>
    <div class="detail-spec"><span class="detail-spec-icon">📅</span><span class="detail-spec-val">${formatDate(lead.postedAt)}</span><span class="detail-spec-key">Posted</span></div>
    ${lead.status === 'live' ? `<div class="detail-spec"><span class="detail-spec-icon">✅</span><span class="detail-spec-val" style="color:#4ade80;">Verified</span><span class="detail-spec-key">Status</span></div>` : ''}`;

  if (lead.customFields && lead.customFields.length > 0) {
    lead.customFields.forEach(cf => {
      specsHTML += `<div class="detail-spec"><span class="detail-spec-icon">✨</span><span class="detail-spec-val">${cf.value}</span><span class="detail-spec-key">${cf.key}</span></div>`;
    });
  }
  
  if (lead.hasTranslations) {
    specsHTML += `<div class="detail-spec" style="grid-column:1/-1; background:rgba(37,211,102,0.1); border-color:rgba(37,211,102,0.3);"><span class="detail-spec-icon">🌐</span><span class="detail-spec-val" style="color:#25D366;">22 Indian Languages Available</span><span class="detail-spec-key">Auto-Translated by AI</span></div>`;
  }
  
  document.getElementById('detailSpecs').innerHTML = specsHTML;

  document.getElementById('detailDesc').textContent = lead.description || 'No description provided.';

  const amenHTML = (lead.amenities || []).map(a => `<span class="amenity-tag">${a}</span>`).join('');
  document.getElementById('detailAmenities').innerHTML = amenHTML;

  document.getElementById('detailContactName').textContent  = lead.contact.name;
  document.getElementById('detailContactPhone').textContent = lead.contact.phone;

  const callBtn = document.getElementById('detailCallBtn');
  callBtn.onclick = () => {
    window.location.href = `tel:${lead.contact.phone}`;
    showToast(`Calling ${lead.contact.name}…`, 'success');
  };

  const waBtn = document.getElementById('detailWaBtn');
  if (waBtn) {
    waBtn.onclick = () => {
      const text = encodeURIComponent(`Hi ${lead.contact.name}, I found your property "${lead.title}" on PropNest and I'm interested.`);
      window.open(`https://wa.me/91${lead.contact.phone}?text=${text}`, '_blank');
    };
  }

  const shareBtn = document.getElementById('detailShareBtn');
  if (shareBtn) {
    shareBtn.onclick = async () => {
      const shareData = { title: 'PropNest Listing', text: `Check out ${lead.title}`, url: window.location.href };
      try {
        if (navigator.share) await navigator.share(shareData);
        else { await navigator.clipboard.writeText(window.location.href); showToast('Link copied to clipboard!', 'success'); }
      } catch (e) { console.error(e); }
    };
  }

  const chatBtn = document.getElementById('detailChatBtn');
  if (chatBtn) {
    // Show chat button if someone is logged in and it's not their own lead
    const myId = authState.currentUser ? authState.currentUser.id : null;
    const isMine = myId && lead.postedBy === myId;
    // We only enable chat if the lead has a postedBy (broker ID)
    if (lead.postedBy && !isMine) {
      chatBtn.style.display = 'inline-block';
    } else {
      chatBtn.style.display = 'none';
    }
  }

  // Wire up gallery nav inside detail
  document.getElementById('detailGalleryPrev').onclick = () => detailGalleryNav(-1);
  document.getElementById('detailGalleryNext').onclick = () => detailGalleryNav(1);

  openModal('detailModal');
}

// ── Post Lead Modal ────────────────────────────
function openPostModal() {
  if (!authState.currentUser) { showToast('Please login to post a lead.', 'error'); return; }
  state.editingLeadId = null;
  document.getElementById('postModalTitle').innerHTML = 'Post a <span>Lead</span>';
  document.getElementById('submitLead').textContent = '🚀 Post My Lead';
  document.getElementById('postLeadForm').reset();
  
  applyPostFormRoleRestrictions();
  state.selectedPhotos    = [];
  state.selectedAmenities = [];
  document.getElementById('formPropType').value = 'residential';
  initPhotoSelector();
  buildAmenities();
  openModal('postModal');
}

function openEditListing(id, e) {
  if (e) { e.stopPropagation(); e.preventDefault(); }
  const lead = state.leads.find(l => l.id === id);
  if (!lead || !canDeleteLead(lead)) return;

  state.editingLeadId = id;
  document.getElementById('postModalTitle').innerHTML = 'Edit Your <span>Listing</span>';
  document.getElementById('submitLead').textContent = 'Save Changes';

  // Populate form
  document.getElementById('formPropType').value = lead.propertyType || 'residential';
  resetTypeButtons(lead.type);
  document.getElementById('formTitle').value = lead.title;
  document.getElementById('formCity').value = lead.city;
  document.getElementById('formAddress').value = lead.address;
  document.getElementById('formBedrooms').value = lead.bedrooms;
  document.getElementById('formBathrooms').value = lead.bathrooms;
  document.getElementById('formArea').value = lead.area || '';
  document.getElementById('formPrice').value = lead.price;
  document.getElementById('formPriceUnit').value = lead.priceUnit;
  document.getElementById('formDescription').value = lead.description || '';
  document.getElementById('formContactName').value = lead.contact.name;
  document.getElementById('formContactPhone').value = lead.contact.phone;
  document.getElementById('formContactEmail').value = lead.contact.email || '';

  state.selectedAmenities = [...(lead.amenities || [])];
  state.selectedPhotos = [...(lead.images || [])];
  
  applyPostFormRoleRestrictions();
  initPhotoSelector();
  buildAmenities();
  
  openModal('postModal');
}

window.openEditListing = openEditListing;

function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// ── City Dropdowns ─────────────────────────────
function populateCityDropdowns() {
  const selects = ['filterCity', 'formCity'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    // Preserve first option (All Cities / Select city)
    const firstOpt = el.options[0];
    el.innerHTML = '';
    el.appendChild(firstOpt);

    INDIA_CITIES_BY_STATE.forEach(group => {
      const og = document.createElement('optgroup');
      og.label = group.state;
      group.cities.forEach(city => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city;
        og.appendChild(opt);
      });
      el.appendChild(og);
    });
  });
}

// ── Locate Me (Geolocation + Nominatim) ────────
function locateMe(targetSelectId) {
  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser.', 'error');
    return;
  }
  const btn = targetSelectId === 'filterCity'
    ? document.getElementById('locateFilterBtn')
    : document.getElementById('locateFormBtn');

  const origText = btn ? btn.innerHTML : '';
  if (btn) { btn.innerHTML = '⏳'; btn.disabled = true; }
  showToast('📡 Detecting your location…', 'success');

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const { latitude: lat, longitude: lon } = pos.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`;
        const res = await fetch(url, { headers: { 'User-Agent': 'PropNest/1.0' } });
        const data = await res.json();

        // Try city > town > village > county
        const detected =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.county ||
          data.address?.state_district ||
          '';

        if (!detected) throw new Error('City not found');

        // Match against known cities (case-insensitive fuzzy)
        const lower = detected.toLowerCase();
        const match = INDIA_CITIES_FLAT.find(c =>
          c.toLowerCase() === lower ||
          lower.includes(c.toLowerCase()) ||
          c.toLowerCase().includes(lower.split(' ')[0])
        );

        const cityToSet = match || detected;

        const sel = document.getElementById(targetSelectId);
        if (sel) {
          // If it's not in the list, add a temporary option
          if (!match) {
            const tmpOpt = document.createElement('option');
            tmpOpt.value = cityToSet;
            tmpOpt.textContent = `📍 ${cityToSet}`;
            sel.appendChild(tmpOpt);
          }
          sel.value = cityToSet;

          // Trigger filter if it's the filter dropdown
          if (targetSelectId === 'filterCity') {
            state.filterCity = cityToSet;
            renderListings();
          }
        }
        showToast(`📍 Location set to ${cityToSet}`, 'success');
      } catch (err) {
        showToast('Could not detect city. Try selecting manually.', 'error');
      } finally {
        if (btn) { btn.innerHTML = origText; btn.disabled = false; }
      }
    },
    (err) => {
      if (btn) { btn.innerHTML = origText; btn.disabled = false; }
      const msgs = {
        1: 'Location access denied. Please allow location in your browser.',
        2: 'Location unavailable. Check your GPS/network.',
        3: 'Location request timed out. Try again.',
      };
      showToast(msgs[err.code] || 'Location error.', 'error');
    },
    { timeout: 10000, enableHighAccuracy: false }
  );
}
window.locateMe = locateMe;

// ── Amenity Chips ──────────────────────────────
function buildAmenities() {
  const grid = document.getElementById('amenitiesGrid');
  grid.innerHTML = AMENITIES_LIST.map(a => `
    <button type="button" class="amenity-chip" data-amenity="${a}" aria-pressed="false">${a}</button>
  `).join('');

  grid.querySelectorAll('.amenity-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const a = btn.dataset.amenity;
      const i = state.selectedAmenities.indexOf(a);
      if (i === -1) {
        state.selectedAmenities.push(a);
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        state.selectedAmenities.splice(i, 1);
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  });
}

// ── Form Validation & Submit ───────────────────
function validateAndSubmit() {
  const fields = {
    formTitle:        { errId: 'errTitle',   check: v => v.trim().length >= 3 },
    formCity:         { errId: 'errCity',    check: v => v !== '' },
    formAddress:      { errId: 'errAddress', check: v => v.trim().length >= 2 },
    formPrice:        { errId: 'errPrice',   check: v => v !== '' && +v >= 0 },
    formContactName:  { errId: 'errName',    check: v => v.trim().length >= 2 },
    formContactPhone: { errId: 'errPhone',   check: v => /^\d{10}$/.test(v.trim()) },
  };

  let valid = true;

  for (const [id, { errId, check }] of Object.entries(fields)) {
    const val = document.getElementById(id).value;
    const err = document.getElementById(errId);
    if (!check(val)) {
      err.classList.add('show');
      valid = false;
    } else {
      err.classList.remove('show');
    }
  }

  if (!valid) {
    showToast('Please fix the errors above.', 'error');
    return;
  }

  const price = parseFloat(document.getElementById('formPrice').value);
  const type  = document.getElementById('selectedType').value;

  if (state.editingLeadId) {
    const lead = state.leads.find(l => l.id === state.editingLeadId);
    if (lead) {
      lead.type = type;
      lead.title = document.getElementById('formTitle').value.trim();
      lead.description = document.getElementById('formDescription').value.trim();
      lead.propertyType = document.getElementById('formPropType')?.value || 'residential';
      lead.city = document.getElementById('formCity').value;
      lead.address = document.getElementById('formAddress').value.trim();
      lead.price = price;
      lead.priceUnit = document.getElementById('formPriceUnit').value;
      lead.bedrooms = parseInt(document.getElementById('formBedrooms').value);
      lead.bathrooms = parseInt(document.getElementById('formBathrooms').value);
      lead.area = parseInt(document.getElementById('formArea').value) || 0;
      lead.images = state.selectedPhotos.length > 0 ? [...state.selectedPhotos] : [randomImage()];
      lead.amenities = [...state.selectedAmenities];
      lead.contact.name = document.getElementById('formContactName').value.trim();
      lead.contact.phone = document.getElementById('formContactPhone').value.trim();
      lead.contact.email = document.getElementById('formContactEmail').value.trim();
      lead.customFields = getCustomFieldsFromForm();
      
      saveLeads();
      closeModal('postModal');
      renderListings();
      showToast('Listing updated successfully.', 'success');
      return;
    }
  }

  const newLead = {
    id:          genId(),
    type,
    propertyType: document.getElementById('formPropType')?.value || 'residential',
    title:       document.getElementById('formTitle').value.trim(),
    description: document.getElementById('formDescription').value.trim(),
    city:        document.getElementById('formCity').value,
    address:     document.getElementById('formAddress').value.trim(),
    price,
    priceUnit:   document.getElementById('formPriceUnit').value,
    bedrooms:    parseInt(document.getElementById('formBedrooms').value),
    bathrooms:   parseInt(document.getElementById('formBathrooms').value),
    area:        parseInt(document.getElementById('formArea').value) || 0,
    images:      state.selectedPhotos.length > 0 ? [...state.selectedPhotos] : [randomImage()],
    amenities:   [...state.selectedAmenities],
    contact: {
      name:  document.getElementById('formContactName').value.trim(),
      phone: document.getElementById('formContactPhone').value.trim(),
      email: document.getElementById('formContactEmail').value.trim(),
    },
    customFields: getCustomFieldsFromForm(),
    hasTranslations: state.pendingTranslations || false,
    postedAt:     Date.now(),
    postedBy:     authState.currentUser?.id   || null,
    postedByRole: authState.currentUser?.role || null,
    status:       getNewLeadStatus(),
    verifiedAt:   getNewLeadStatus() === 'live' ? Date.now() : null,
  };

  state.leads.unshift(newLead);
  saveLeads();

  // Reset form
  document.getElementById('postLeadForm').reset();
  state.selectedAmenities = [];
  state.selectedPhotos    = [];
  state.pendingTranslations = false;
  document.getElementById('customFieldsContainer').innerHTML = ''; // Clear custom fields
  document.getElementById('waQuickFill').value = '';
  document.querySelectorAll('.amenity-chip').forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
  document.querySelectorAll('.photo-preset-item').forEach(p => p.classList.remove('selected'));
  updateSelectedStrip();
  resetTypeButtons('rent');

  closeModal('postModal');
  renderListings();

  const status = newLead.status;
  if (status === 'live') {
    showToast('🎉 Your listing is live and verified!', 'success');
    state.activeTab = type;
    setActiveTab(type);
  } else {
    showToast('⏳ Lead submitted! Awaiting admin verification before going live.', 'success');
    state.activeTab = 'mine';
    setActiveTab('mine');
  }
}

function resetTypeButtons(type) {
  document.querySelectorAll('.type-btn').forEach(b => {
    b.className = 'type-btn';
    if (b.dataset.type === type) b.classList.add(`selected-${type}`);
  });
  document.getElementById('selectedType').value = type;
  if (typeof updateDynamicFormFields === 'function') updateDynamicFormFields();
}

// ── Toast ──────────────────────────────────────
function showToast(msg, kind = 'success') {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = `<span class="toast-icon">${kind === 'success' ? '✅' : '❌'}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(30px)'; el.style.transition = 'all 0.3s ease'; setTimeout(() => el.remove(), 300); }, 3000);
}

// ── Nav Tab switching ──────────────────────────
function setActiveTab(tab) {
  state.activeTab = tab;

  const ls = document.querySelector('.listings-section');
  const ss = document.querySelector('.search-section');
  const ap = document.getElementById('adminPanel');
  const crm = document.getElementById('crmPanel');
  const inbox = document.getElementById('inboxPanel');
  const hero = document.querySelector('.hero');
  const agentProfile = document.getElementById('agentProfilePanel');

  if (inbox) inbox.style.display = 'none';
  if (agentProfile) agentProfile.style.display = 'none';

  if (tab === 'admin') {
    if (ls) ls.style.display = 'none';
    if (ss) ss.style.display = 'none';
    if (crm) crm.style.display = 'none';
    if (hero) hero.style.display = 'none';
    if (ap) ap.style.display = 'block';
    renderAdminPanel();
  } else if (tab === 'mine') {
    if (ls) ls.style.display = 'none';
    if (ss) ss.style.display = 'none';
    if (ap) ap.style.display = 'none';
    if (hero) hero.style.display = 'none';
    if (crm) crm.style.display = 'block';
    renderCRMBoard();
  } else {
    if (ls) ls.style.display = '';
    if (ss) ss.style.display = '';
    if (hero) hero.style.display = '';
    if (ap) ap.style.display = 'none';
    if (crm) crm.style.display = 'none';
    renderListings();
  }

  // Desktop tabs
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
    t.setAttribute('aria-selected', String(t.dataset.tab === tab));
  });

  // Mobile tabs
  document.querySelectorAll('.mobile-nav-tab[data-tab]').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
}

// ── Navbar scroll effect ───────────────────────
function onScroll() {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 20);
}

// ── Init ───────────────────────────────────────
function init() {
  initTheme();
  loadFromStorage();
  populateCityDropdowns();
  buildAmenities();
  initAuth();

  // Stat counter
  const statEl = document.getElementById('statListings');
  animateCounter(statEl, state.leads.length, '');

  renderListings();

  // Check URL routing
  const params = new URLSearchParams(window.location.search);
  const agentId = params.get('agent');
  if (agentId) {
    setTimeout(() => openBrokerProfile(agentId), 100);
  }

  // ── Nav events ──────────────────────────────
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('mobileNav').classList.remove('open');
      setActiveTab(btn.dataset.tab);
    });
  });

  document.querySelectorAll('.mobile-nav-tab[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('mobileNav').classList.remove('open');
      setActiveTab(btn.dataset.tab);
    });
  });

  // Hamburger
  const burger  = document.getElementById('navBurger');
  const mobileNav = document.getElementById('mobileNav');
  burger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  // Post Lead buttons
  document.getElementById('openPostModal').addEventListener('click', openPostModal);
  const mobilePost = document.getElementById('mobilePostLead');
  if (mobilePost) mobilePost.addEventListener('click', () => { document.getElementById('mobileNav').classList.remove('open'); openPostModal(); });

  // Lightbox wiring
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxBackdrop').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', () => navLightbox(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => navLightbox(1));

  // Locate Me wiring
  const locateFilterBtn = document.getElementById('locateFilterBtn');
  const locateFormBtn   = document.getElementById('locateFormBtn');
  if (locateFilterBtn) locateFilterBtn.addEventListener('click', () => locateMe('filterCity'));
  if (locateFormBtn)   locateFormBtn.addEventListener('click',   () => locateMe('formCity'));

  // Close modals
  document.getElementById('closePostModal').addEventListener('click', () => closeModal('postModal'));
  document.getElementById('closeDetailModal').addEventListener('click', () => { closeModal('detailModal'); state.currentDetailId = null; });

  // Close on overlay click
  document.getElementById('postModal').addEventListener('click', e => { if (e.target === document.getElementById('postModal')) closeModal('postModal'); });
  document.getElementById('detailModal').addEventListener('click', e => { if (e.target === document.getElementById('detailModal')) { closeModal('detailModal'); state.currentDetailId = null; } });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (document.getElementById('lightbox').style.display !== 'none') { closeLightbox(); return; }
      if (document.getElementById('postModal').classList.contains('open'))   closeModal('postModal');
      if (document.getElementById('detailModal').classList.contains('open')) { closeModal('detailModal'); state.currentDetailId = null; }
    }
    if (e.key === 'ArrowLeft'  && document.getElementById('lightbox').style.display !== 'none') navLightbox(-1);
    if (e.key === 'ArrowRight' && document.getElementById('lightbox').style.display !== 'none') navLightbox(1);
  });

  // Type buttons in form
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      resetTypeButtons(type);
    });
  });

  // Detail modal fav
  document.getElementById('detailFavBtn').addEventListener('click', function() {
    toggleFav(this.dataset.id, this);
  });

  // Filters
  document.getElementById('searchInput').addEventListener('input', debounce(e => {
    state.searchQuery = e.target.value;
    renderListings();
  }, 300));

  document.getElementById('filterCity').addEventListener('change', e  => { state.filterCity  = e.target.value; renderListings(); });
  document.getElementById('filterBeds').addEventListener('change', e  => { state.filterBeds  = e.target.value; renderListings(); });
  document.getElementById('filterPrice').addEventListener('change', e => { state.filterPrice = e.target.value; renderListings(); });
  document.getElementById('sortSelect').addEventListener('change', e  => { state.sortBy      = e.target.value; renderListings(); });

  // View toggle
  document.getElementById('gridViewBtn').addEventListener('click', () => {
    state.viewMode = 'grid';
    document.getElementById('gridViewBtn').classList.add('active');
    document.getElementById('listViewBtn').classList.remove('active');
    renderListings();
  });
  document.getElementById('listViewBtn').addEventListener('click', () => {
    state.viewMode = 'list';
    document.getElementById('listViewBtn').classList.add('active');
    document.getElementById('gridViewBtn').classList.remove('active');
    renderListings();
  });

  // Form submit
  document.getElementById('postLeadForm').addEventListener('submit', validateAndSubmit);

  // Inline clear errors on input
  ['formTitle','formCity','formAddress','formPrice','formContactName','formContactPhone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => { const err = el.parentElement.querySelector('.form-error'); if (err) err.classList.remove('show'); });
  });

  // Navbar scroll effect
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── Theme Toggle ───────────────────────────────
const STORAGE_KEY_THEME = 'propnest_theme';

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  applyTheme(saved);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY_THEME, next);
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.classList.toggle('theme-light', theme === 'light');
  btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  // Update meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'light' ? '#F4F4FF' : '#7C5CFC';
}

// ── Debounce ───────────────────────────────────
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── Run ────────────────────────────────────────
window.openDetail    = openDetail;
window.openPostModal = openPostModal;
document.addEventListener('DOMContentLoaded', init);

// ══════════════════════════════════════════
// BROKER PROFILES & CHAT MODULE
// ══════════════════════════════════════════

// ── Broker Profile ──
function openBrokerProfile(userId) {
  const broker = authState.users.find(u => u.id === userId);
  if (!broker) return showToast('User not found', 'error');

  const isPremium = broker.plan === 'premium';
  
  // Hide other main panels
  const ls = document.querySelector('.listings-section');
  const ss = document.querySelector('.search-section');
  const ap = document.getElementById('adminPanel');
  const ip = document.getElementById('inboxPanel');
  if(ls) ls.style.display = 'none';
  if(ss) ss.style.display = 'none';
  if(ap) ap.style.display = 'none';
  if(ip) ip.style.display = 'none';

  // Populate data
  document.getElementById('apAvatar').textContent = initials(broker.name);
  document.getElementById('apName').innerHTML = `
    ${broker.name}
    ${isPremium ? '<span style="font-size:1.5rem; color:#f59e0b; margin-left:8px;" title="Premium Agent">👑</span>' : broker.agentVerified ? '<span style="color:#4ade80" title="Verified Agent">✓</span>' : ''}
  `;
  document.getElementById('apRoleBadge').innerHTML = `
    <span class="role-badge role-${broker.role}">${broker.role}</span>
    ${isPremium ? '<span class="role-badge" style="background:rgba(245,158,11,0.1); color:#f59e0b; border-color:rgba(245,158,11,0.3);">Premium</span>' : ''}
  `;
  document.getElementById('apContactInfo').textContent = `${broker.email} • Phone: ${broker.phone || 'N/A'}`;

  // Company Branding
  const logoEl = document.getElementById('apCompanyLogo');
  const cnameEl = document.getElementById('apCompanyName');
  if (broker.companyLogo) {
    logoEl.src = broker.companyLogo;
    logoEl.style.display = 'block';
  } else {
    logoEl.style.display = 'none';
  }
  
  if (broker.companyName) {
    cnameEl.textContent = broker.companyName;
    cnameEl.style.display = 'block';
  } else {
    cnameEl.style.display = 'none';
  }

  // Edit button visibility
  const editBtn = document.getElementById('apEditBtn');
  if (authState.currentUser && authState.currentUser.id === userId) {
    editBtn.style.display = 'inline-block';
    editBtn.onclick = () => openEditAgentProfile(broker);
  } else {
    editBtn.style.display = 'none';
  }

  // Share button
  document.getElementById('apShareBtn').onclick = () => {
    const url = window.location.origin + window.location.pathname + "?agent=" + userId;
    navigator.clipboard.writeText(url).then(() => showToast('Profile link copied to clipboard!', 'success'));
  };

  const brokerLeads = state.leads.filter(l => l.postedBy === userId && l.status === 'live');
  const grid = document.getElementById('apListingsGrid');
  if (brokerLeads.length === 0) {
    grid.innerHTML = '<div class="empty-state">No active listings.</div>';
  } else {
    grid.innerHTML = brokerLeads.map((l, i) => buildCard(l, i)).join('');
  }

  document.getElementById('agentProfilePanel').style.display = 'block';
  window.scrollTo(0, 0);
}

// ── Edit Profile ──
function openEditAgentProfile(broker) {
  document.getElementById('epCompanyName').value = broker.companyName || '';
  document.getElementById('epCompanyLogo').value = broker.companyLogo || '';
  document.getElementById('editProfileModal').style.display = 'flex';
}

window.saveAgentProfile = function() {
  const cname = document.getElementById('epCompanyName').value.trim();
  const clogo = document.getElementById('epCompanyLogo').value.trim();
  const userId = authState.currentUser.id;
  
  const uidx = authState.users.findIndex(u => u.id === userId);
  if (uidx > -1) {
    authState.users[uidx].companyName = cname;
    authState.users[uidx].companyLogo = clogo;
    authState.currentUser.companyName = cname;
    authState.currentUser.companyLogo = clogo;
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authState));
  }
  
  document.getElementById('editProfileModal').style.display = 'none';
  showToast('Profile updated successfully!', 'success');
  openBrokerProfile(userId);
};

document.getElementById('closeEditProfileModal').addEventListener('click', () => {
  document.getElementById('editProfileModal').style.display = 'none';
});

// ── Inbox ──
function renderInbox() {
  if (!authState.currentUser) return;
  const myId = authState.currentUser.id;
  
  // Find all chats where user is buyer or broker
  const myChats = state.chats.filter(c => c.buyerId === myId || c.brokerId === myId);
  const list = document.getElementById('inboxList');
  
  if (myChats.length === 0) {
    list.innerHTML = '<div class="empty-state" style="text-align:center; padding: 40px;">No messages yet.</div>';
    return;
  }

  // Sort by latest message timestamp
  myChats.sort((a, b) => {
    const timeA = a.messages.length ? a.messages[a.messages.length - 1].timestamp : 0;
    const timeB = b.messages.length ? b.messages[b.messages.length - 1].timestamp : 0;
    return timeB - timeA;
  });

  list.innerHTML = myChats.map(chat => {
    const isBuyer = chat.buyerId === myId;
    const otherUserId = isBuyer ? chat.brokerId : chat.buyerId;
    const otherUser = users.find(u => u.id === otherUserId) || { name: 'Unknown User' };
    const lead = state.leads.find(l => l.id === chat.propertyId);
    const title = lead ? lead.title : 'Deleted Property';
    const lastMsg = chat.messages.length ? chat.messages[chat.messages.length - 1] : null;
    const lastText = lastMsg ? lastMsg.text : 'No messages';
    const time = lastMsg ? new Date(lastMsg.timestamp).toLocaleDateString() : '';

    return `
      <div class="inbox-item" onclick="openChat('${chat.propertyId}', '${chat.brokerId}')">
        <div class="inbox-avatar">${initials(otherUser.name)}</div>
        <div class="inbox-details">
          <div class="inbox-title">${otherUser.name} <span style="font-weight:400; font-size:0.9rem; color:var(--text-muted)">via ${title}</span></div>
          <div class="inbox-last-msg">${lastText}</div>
        </div>
        <div class="inbox-time">${time}</div>
      </div>
    `;
  }).join('');
}

// ── Chat Flow ──
let currentChatId = null;

function openChat(propertyId, brokerId) {
  if (!authState.currentUser) {
    showToast('Please login to chat', 'error');
    return document.getElementById('authScreen').style.display = 'flex';
  }
  
  const lead = state.leads.find(l => l.id === propertyId);
  const broker = users.find(u => u.id === brokerId);
  const myId = authState.currentUser.id;
  
  if (!lead || !broker) return showToast('Property or Broker not found', 'error');

  // Find existing chat or create new
  const isBuyer = myId !== brokerId;
  const actualBuyerId = isBuyer ? myId : null; // If a broker opens it, they must click from inbox, so it's already created.
  
  let chat = state.chats.find(c => c.propertyId === propertyId && c.brokerId === brokerId && (isBuyer ? c.buyerId === myId : true));
  
  if (!chat && isBuyer) {
    chat = {
      id: 'chat-' + Date.now(),
      propertyId,
      brokerId,
      buyerId: myId,
      messages: []
    };
    state.chats.push(chat);
    saveChats();
  }

  if (!chat) return showToast('Chat not found', 'error');

  currentChatId = chat.id;
  const otherUser = users.find(u => u.id === (isBuyer ? brokerId : chat.buyerId)) || { name: 'Unknown' };

  document.getElementById('chatModalTitle').textContent = otherUser.name;
  document.getElementById('chatModalSubtitle').textContent = lead.title;
  
  renderChatMessages(chat);
  document.getElementById('chatModal').style.display = 'flex';
  
  // Close detail modal if open
  document.getElementById('detailModal').style.display = 'none';
}

function renderChatMessages(chat) {
  const container = document.getElementById('chatMessages');
  if (chat.messages.length === 0) {
    container.innerHTML = '<div style="text-align:center; color:var(--text-muted); margin-top: auto; margin-bottom: auto;">Start the conversation!</div>';
    return;
  }

  const myId = authState.currentUser.id;
  container.innerHTML = chat.messages.map(m => {
    const isMe = m.senderId === myId;
    const time = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `
      <div class="chat-bubble ${isMe ? 'sent' : 'received'}">
        ${m.text}
        <span class="chat-time">${time}</span>
      </div>
    `;
  }).join('');
  container.scrollTop = container.scrollHeight;
}

document.getElementById('sendChatBtn').addEventListener('click', () => {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || !currentChatId || !authState.currentUser) return;

  const chat = state.chats.find(c => c.id === currentChatId);
  if (chat) {
    chat.messages.push({
      senderId: authState.currentUser.id,
      text,
      timestamp: Date.now()
    });
    saveChats();
    renderChatMessages(chat);
    input.value = '';
    renderInbox(); // Update last message in inbox if it's open
  }
});

document.getElementById('chatInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('sendChatBtn').click();
});

document.getElementById('closeChatModal').addEventListener('click', () => {
  document.getElementById('chatModal').style.display = 'none';
  currentChatId = null;
});

document.addEventListener('DOMContentLoaded', () => {
  // Inbox tabs
  ['tab-msgs', 'mobile-tab-msgs'].forEach(id => {
    const el = document.getElementById(id);
    if(el) {
      el.addEventListener('click', () => {
        if (!authState.currentUser) {
           showToast('Please login to view messages', 'error');
           return document.getElementById('authScreen').style.display = 'flex';
        }
        // Hide others, show inbox
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('inboxPanel').style.display = 'block';
        document.querySelector('.hero').style.display = 'none';
        document.querySelector('.search-section').style.display = 'none';
        
        // Remove active class from nav
        document.querySelectorAll('.nav-tab, .mobile-nav-tab').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        
        if (id.startsWith('mobile')) {
           document.getElementById('mobileNav').classList.remove('active');
           document.getElementById('navBurger').classList.remove('active');
        }
        
        renderInbox();
      });
    }
  });

  // Broker name click
  const nameEl = document.getElementById('detailContactName');
  if (nameEl) {
    nameEl.style.cursor = 'pointer';
    nameEl.style.color = 'var(--primary)';
    nameEl.style.textDecoration = 'underline';
    nameEl.addEventListener('click', (e) => {
      const leadId = document.getElementById('detailFavBtn').dataset.id;
      const lead = state.leads.find(l => l.id === leadId);
      if (lead && lead.postedBy) {
        openBrokerProfile(lead.postedBy);
      }
    });
  }

  // Chat Btn click
  const chatBtn = document.getElementById('detailChatBtn');
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      const leadId = document.getElementById('detailFavBtn').dataset.id;
      const lead = state.leads.find(l => l.id === leadId);
      if (lead && lead.postedBy) {
        openChat(lead.id, lead.postedBy);
      }
    });
  }

  // Intercept tab changes to hide inbox
  const originalTabClick = document.querySelectorAll('.nav-tab[data-tab], .mobile-nav-tab[data-tab]');
  originalTabClick.forEach(btn => {
    const tab = btn.dataset.tab;
    if (tab !== 'msgs' && tab !== 'admin') {
      btn.addEventListener('click', () => {
        const inbox = document.getElementById('inboxPanel');
        if (inbox) inbox.style.display = 'none';
      });
    }
  });
});

// ══════════════════════════════════════════
// CRM DASHBOARD (Phase 2)
// ══════════════════════════════════════════

function renderCRMBoard() {
  if (!authState.currentUser) return;
  const myId = authState.currentUser.id;
  const myLeads = state.leads.filter(l => l.postedBy === myId);
  const board = document.getElementById('crmBoard');

  if (myLeads.length === 0) {
    board.innerHTML = '<div class="empty-state" style="width:100%; text-align:center; padding: 40px;">No leads found. Post a property to start managing.</div>';
    return;
  }

  const stages = ['draft', 'active', 'negotiation', 'closed'];
  const stageLabels = {
    draft: 'Draft',
    active: 'Active',
    negotiation: 'In Negotiation',
    closed: 'Closed / Sold'
  };

  board.innerHTML = stages.map(stage => {
    // Ensure leads have a default stage if undefined
    const stageLeads = myLeads.filter(l => (l.stage || 'active') === stage);
    
    return `
      <div class="crm-column" data-stage="${stage}">
        <div class="crm-column-header">
          <span>${stageLabels[stage]}</span>
          <span style="background:var(--bg-color); padding: 2px 8px; border-radius: 12px; font-size: 0.85rem;">${stageLeads.length}</span>
        </div>
        <div class="crm-column-cards">
          ${stageLeads.map(l => {
            return `
              <div class="crm-card" onclick="openDetail('${l.id}')">
                <div class="crm-card-price">${formatPrice(l)}${l.type==='rent'?'/mo':''}</div>
                <div class="crm-card-title" title="${l.title}">${l.title}</div>
                <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:8px;">${l.city}</div>
                <select class="crm-stage-select" onclick="event.stopPropagation()" onchange="changeLeadStage('${l.id}', this.value)">
                  ${stages.map(s => `<option value="${s}" ${s === stage ? 'selected' : ''}>Move to: ${stageLabels[s]}</option>`).join('')}
                </select>
              </div>
            `;
          }).join('')}
          ${stageLeads.length === 0 ? `<div style="text-align:center; padding: 20px; color:var(--text-muted); font-size:0.9rem; border:1px dashed var(--border); border-radius:8px;">Drop here</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

window.changeLeadStage = function(leadId, newStage) {
  const lead = state.leads.find(l => l.id === leadId);
  if (lead) {
    lead.stage = newStage;
    saveLeads();
    renderCRMBoard();
    showToast(`Lead moved to ${newStage}`, 'success');
  }
};

// ══════════════════════════════════════════
// WHATSAPP WEBHOOK PARSER (Phase 2)
// ══════════════════════════════════════════

window.simulateWhatsAppWebhook = function() {
  const input = document.getElementById('webhookPayload');
  if (!input) return;
  const text = input.value.trim().toLowerCase();
  if (!text) return showToast('Please enter a mock message', 'error');

  // Simple Regex-based Entity Extraction Mock
  let extractedCity = 'Unknown';
  const knownCities = INDIA_CITIES_BY_STATE.flatMap(s => s.cities).map(c => c.toLowerCase());
  for (let city of knownCities) {
    if (text.includes(city)) {
      extractedCity = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  let extractedType = 'rent';
  if (text.includes('sell') || text.includes('sale') || text.includes('crore') || text.includes('lakh')) {
    extractedType = 'sell';
  }

  let extractedBeds = 1;
  const bedMatch = text.match(/(\d+)\s*(bhk|bed)/i);
  if (bedMatch) {
    extractedBeds = parseInt(bedMatch[1]);
  }

  let extractedPrice = 0;
  // Match things like 40000, 40k, 1.5 cr
  const priceMatch = text.match(/(\d+(?:\.\d+)?)\s*(k|lakh|cr|thousand)?/i);
  if (priceMatch) {
    let rawNum = parseFloat(priceMatch[1]);
    let suffix = priceMatch[2] ? priceMatch[2].toLowerCase() : '';
    if (suffix === 'k' || suffix === 'thousand') extractedPrice = rawNum * 1000;
    else if (suffix === 'lakh') extractedPrice = rawNum * 100000;
    else if (suffix === 'cr') extractedPrice = rawNum * 10000000;
    else extractedPrice = rawNum;
  }

  // Generate Lead
  const newLead = {
    id: genId(),
    type: extractedType,
    status: 'pending', // Requires admin approval or direct broker activation
    stage: 'draft',    // Broker CRM Stage
    title: `[WA Auto] ${extractedBeds} BHK in ${extractedCity}`,
    description: `Auto-generated from WhatsApp. Original message: "${input.value}"`,
    city: extractedCity,
    address: 'To be updated',
    price: extractedPrice || 0,
    priceUnit: extractedType === 'rent' ? 'per month' : 'total',
    bedrooms: extractedBeds,
    bathrooms: extractedBeds > 1 ? extractedBeds - 1 : 1,
    area: extractedBeds * 500,
    images: [PROPERTY_IMAGES[Math.floor(Math.random() * PROPERTY_IMAGES.length)]],
    amenities: ['Parking', 'Security'],
    postedBy: authState.currentUser?.id || 'admin',
    contact: {
      name: authState.currentUser?.name || 'WhatsApp User',
      phone: authState.currentUser?.phone || '+910000000000',
      email: authState.currentUser?.email || 'wa@example.com'
    },
    postedAt: Date.now()
  };

  state.leads.push(newLead);
  saveLeads();

  showToast('Webhook processed! Draft lead created.', 'success');
  input.value = '';
  
  // Refresh views
  if (state.activeTab === 'admin') renderAdminPanel();
};

// ══════════════════════════════════════════
// MULTILINGUAL (i18n) (Phase 3)
// ══════════════════════════════════════════
const translations = {
  en: {
    hero_badge: "India's fastest growing property platform",
    hero_title1: "Find Your",
    hero_title2: "Dream Property",
    hero_desc: "Post leads for rent, sell, or buy — connect with verified owners, agents, and buyers across India.",
    tab_all: "All",
    tab_rent: "🔑 Rent",
    tab_sell: "🏷️ Sell",
    tab_buy: "🛒 Buy",
    post_lead: "Post Lead",
    upgrade: "Upgrade"
  },
  hi: {
    hero_badge: "भारत का सबसे तेज़ी से बढ़ता प्रॉपर्टी प्लेटफॉर्म",
    hero_title1: "अपना सपनों का",
    hero_title2: "घर खोजें",
    hero_desc: "किराये, बिक्री या खरीद के लिए लीड पोस्ट करें — भारत भर में सत्यापित मालिकों, एजेंटों और खरीदारों से जुड़ें।",
    tab_all: "सभी",
    tab_rent: "🔑 किराये पर",
    tab_sell: "🏷️ बिक्री",
    tab_buy: "🛒 खरीदें",
    post_lead: "लीड डालें",
    upgrade: "प्रीमियम"
  }
};

let currentLang = 'en';

window.changeLanguage = function(langCode) {
  currentLang = langCode;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[currentLang] && translations[currentLang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[currentLang][key];
      } else {
        el.textContent = translations[currentLang][key];
      }
    } else if (translations['en'] && translations['en'][key]) {
      // Fallback to English if translation missing
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations['en'][key];
      } else {
        el.textContent = translations['en'][key];
      }
    }
  });
};
// ══════════════════════════════════════════
// WHATSAPP AUTO-FILL & CUSTOM FIELDS (PHASE 3 EXTRA)
// ══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const btnWaQuickFill = document.getElementById('btnWaQuickFill');
  const btnAddCustomField = document.getElementById('btnAddCustomField');
  
  if (btnWaQuickFill) {
    btnWaQuickFill.addEventListener('click', async () => {
      const text = document.getElementById('waQuickFill').value;
      if (!text.trim()) return showToast('Please paste a description first', 'error');
      
      const doTranslate = document.getElementById('waAutoTranslate')?.checked;
      const btnOrigText = btnWaQuickFill.innerHTML;
      
      if (doTranslate) {
        btnWaQuickFill.innerHTML = '✨ Detecting Language...';
        btnWaQuickFill.disabled = true;
        // Simulate network request
        await new Promise(r => setTimeout(r, 1200));
        btnWaQuickFill.innerHTML = '🌐 Translating to 22 Languages...';
        await new Promise(r => setTimeout(r, 1500));
      }
      
      parseWhatsAppDescription(text);
      
      if (doTranslate) {
        // Mock that we generated translations
        state.pendingTranslations = true;
        showToast('Detected Language & generated 22 translated variants!', 'success');
      } else {
        state.pendingTranslations = false;
        showToast('Magic Fill complete! Please review the extracted details.', 'success');
      }
      
      btnWaQuickFill.innerHTML = btnOrigText;
      btnWaQuickFill.disabled = false;
    });
  }

  if (btnAddCustomField) {
    btnAddCustomField.addEventListener('click', () => addCustomFieldRow());
  }
});

function addCustomFieldRow(key = '', value = '') {
  const container = document.getElementById('customFieldsContainer');
  const rowId = `cf-${Date.now()}-${Math.floor(Math.random()*1000)}`;
  
  const div = document.createElement('div');
  div.id = rowId;
  div.style.display = 'flex';
  div.style.gap = '8px';
  div.style.alignItems = 'center';
  
  div.innerHTML = `
    <input type="text" class="form-input cf-key" placeholder="Detail (e.g. Facing)" value="${key}" style="flex:1;">
    <input type="text" class="form-input cf-val" placeholder="Value (e.g. North)" value="${value}" style="flex:2;">
    <button type="button" class="btn-secondary" onclick="document.getElementById('${rowId}').remove()" style="padding:8px; border-radius:8px; color:#ef4444; border-color:rgba(239,68,68,0.3);">🗑</button>
  `;
  container.appendChild(div);
}

function getCustomFieldsFromForm() {
  const container = document.getElementById('customFieldsContainer');
  if (!container) return [];
  const rows = container.querySelectorAll('div[id^="cf-"]');
  const fields = [];
  rows.forEach(row => {
    const key = row.querySelector('.cf-key').value.trim();
    const val = row.querySelector('.cf-val').value.trim();
    if (key && val) fields.push({ key, value: val });
  });
  return fields;
}

function parseWhatsAppDescription(text) {
  const t = text.toLowerCase();
  
  // 1. Type
  if (t.includes('rent') || t.includes('lease') || t.includes('bhaade') || t.includes('kiraya')) resetTypeButtons('rent');
  else if (t.includes('sell') || t.includes('sale') || t.includes('selling') || t.includes('bikri')) resetTypeButtons('sell');
  else if (t.includes('buy') || t.includes('looking for') || t.includes('chahiye')) resetTypeButtons('buy');

  // 2. City
  const allCities = INDIA_CITIES_BY_STATE.flatMap(s => s.cities);
  const matchedCity = allCities.find(c => t.includes(c.toLowerCase()));
  if (matchedCity) {
    const citySelect = document.getElementById('formCity');
    // Ensure the city is an option
    let exists = Array.from(citySelect.options).some(o => o.value === matchedCity);
    if (!exists) {
      const opt = document.createElement('option');
      opt.value = matchedCity; opt.textContent = matchedCity;
      citySelect.appendChild(opt);
    }
    citySelect.value = matchedCity;
  }

  // 3. Price
  // Match things like 50k, 50,000, 1.5 cr, 2L
  const priceMatch = t.match(/([\d,.]+)\s*(k|l|lakh|lakhs|cr|crore)?/);
  if (priceMatch) {
    let num = parseFloat(priceMatch[1].replace(/,/g, ''));
    const mult = priceMatch[2];
    if (mult === 'k') num *= 1000;
    else if (mult === 'l' || mult === 'lakh' || mult === 'lakhs') num *= 100000;
    else if (mult === 'cr' || mult === 'crore') num *= 10000000;
    document.getElementById('formPrice').value = num;
  }

  // 4. BHK
  const bhkMatch = t.match(/(\d+)\s*(bhk|bed|bedroom)/);
  if (bhkMatch) document.getElementById('formBedrooms').value = bhkMatch[1];
  
  const bathMatch = t.match(/(\d+)\s*(bath|bathroom)/);
  if (bathMatch) document.getElementById('formBathrooms').value = bathMatch[1];

  // 5. Title & Desc
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  if (lines.length > 0) {
    document.getElementById('formTitle').value = lines[0].substring(0, 100);
    document.getElementById('formDescription').value = text;
  }

  // 6. Custom Fields Extraction
  // Look for lines that look like "Key: Value" or "Key - Value"
  const cfLines = lines.filter(l => l.includes(':') || l.includes('-'));
  document.getElementById('customFieldsContainer').innerHTML = ''; // clear existing
  
  cfLines.forEach(line => {
    let parts = line.split(':');
    if (parts.length < 2) parts = line.split('-');
    if (parts.length === 2) {
      const k = parts[0].trim();
      const v = parts[1].trim();
      if (k.length > 1 && k.length < 30 && v.length > 1) {
        addCustomFieldRow(k, v);
      }
    }
  });
}
document.addEventListener('DOMContentLoaded', () => {
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      changeLanguage(e.target.value);
    });
  }
});

// ══════════════════════════════════════════
// PAID PLANS & MOCK CHECKOUT (Phase 3)
// ══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const upgradeBtn = document.getElementById('upgradeBtn');
  const rzpModal = document.getElementById('razorpayModal');
  const rzpSuccess = document.getElementById('rzpSuccessBtn');
  const rzpCancel = document.getElementById('rzpCancelBtn');

  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      if (!authState.currentUser) return showAuthScreen();
      rzpModal.style.display = 'flex';
    });
  }

  if (rzpCancel) {
    rzpCancel.addEventListener('click', () => rzpModal.style.display = 'none');
  }

  if (rzpSuccess) {
    rzpSuccess.addEventListener('click', () => {
      // Mock payment success
      rzpModal.style.display = 'none';
      if (authState.currentUser) {
        authState.currentUser.plan = 'premium';
        
        // Update user in authState.users array
        const uidx = authState.users.findIndex(u => u.id === authState.currentUser.id);
        if (uidx > -1) authState.users[uidx].plan = 'premium';
        
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authState));
        showToast('Payment successful! You are now Premium 👑', 'success');
        updateNavForUser();
        renderListings();
      }
    });
  }
});

// ══════════════════════════════════════════
// AI ASSISTANT WIDGET (Phase 3)
// ══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const fab = document.getElementById('aiFab');
  const widget = document.getElementById('aiWidget');
  const closeBtn = document.getElementById('closeAiWidget');
  const sendBtn = document.getElementById('aiSendBtn');
  const input = document.getElementById('aiInput');
  const msgContainer = document.getElementById('aiChatMessages');

  if (fab) fab.addEventListener('click', () => widget.style.display = 'flex');
  if (closeBtn) closeBtn.addEventListener('click', () => widget.style.display = 'none');

  function addAiMessage(text, type = 'sent') {
    const div = document.createElement('div');
    div.className = `chat-bubble ${type}`;
    div.textContent = text;
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function handleAiQuery(query) {
    query = query.toLowerCase();
    addAiMessage(query, 'sent');
    input.value = '';

    // Simple heuristic parser
    setTimeout(() => {
      let type = null;
      if (query.includes('rent')) type = 'rent';
      if (query.includes('buy') || query.includes('sell')) type = 'sell';

      let results = state.leads.filter(l => l.status === 'live');
      if (type) results = results.filter(l => l.type === type);
      
      const cityMatch = INDIA_CITIES_BY_STATE.flatMap(s => s.cities).find(c => query.includes(c.toLowerCase()));
      if (cityMatch) results = results.filter(l => l.city.toLowerCase() === cityMatch.toLowerCase());

      if (results.length > 0) {
        const top = results.slice(0, 2);
        addAiMessage(`I found ${results.length} matching properties! Here are the top ones:`, 'received');
        top.forEach(l => {
          addAiMessage(`- ${l.title} in ${l.city} (${formatPrice(l)})`, 'received');
        });
      } else {
        addAiMessage(`I couldn't find any exact matches for that query. Try adjusting your search!`, 'received');
      }
    }, 600);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (input.value.trim()) handleAiQuery(input.value.trim());
    });
  }
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && input.value.trim()) handleAiQuery(input.value.trim());
    });
  }
});
