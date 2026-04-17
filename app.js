/* ============================================
   PropNest — Application Logic
   ============================================ */

'use strict';

// ── Constants ─────────────────────────────────
const STORAGE_KEY_LEADS   = 'propnest_leads';
const STORAGE_KEY_FAVS    = 'propnest_favs';
const STORAGE_KEY_USERS   = 'propnest_users';
const STORAGE_KEY_SESSION = 'propnest_session';

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
  { state: 'Maharashtra',         cities: ['Mumbai','Pune','Nagpur','Thane','Nashik','Aurangabad','Solapur','Kolhapur','Navi Mumbai','Pimpri-Chinchwad','Amravati','Nanded','Sangli','Malegaon','Jalgaon','Akola','Latur'] },
  { state: 'Delhi NCR',           cities: ['Delhi','Gurgaon','Noida','Faridabad','Ghaziabad','Greater Noida','Gurugram'] },
  { state: 'Karnataka',           cities: ['Bangalore','Mysore','Hubli','Mangalore','Belgaum','Davangere','Bellary','Tumkur','Shimoga'] },
  { state: 'Tamil Nadu',          cities: ['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Tiruppur','Vellore','Erode','Thoothukudi','Kanchipuram','Pondicherry'] },
  { state: 'Telangana',           cities: ['Hyderabad','Warangal','Karimnagar','Khammam','Nizamabad'] },
  { state: 'Andhra Pradesh',      cities: ['Visakhapatnam','Vijayawada','Guntur','Nellore','Rajahmundry','Kurnool','Tirupati','Kakinada','Anantapur'] },
  { state: 'Gujarat',             cities: ['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Jamnagar','Junagadh','Gandhinagar','Anand','Morbi','Mehsana'] },
  { state: 'Rajasthan',           cities: ['Jaipur','Jodhpur','Udaipur','Kota','Ajmer','Bikaner','Alwar','Bharatpur','Sikar','Pali'] },
  { state: 'Uttar Pradesh',       cities: ['Lucknow','Kanpur','Agra','Varanasi','Meerut','Prayagraj','Bareilly','Aligarh','Moradabad','Gorakhpur','Mathura','Firozabad','Ghazipur','Jhansi','Muzaffarnagar'] },
  { state: 'West Bengal',         cities: ['Kolkata','Howrah','Durgapur','Asansol','Siliguri','Bardhaman','Malda','Kalyani'] },
  { state: 'Madhya Pradesh',      cities: ['Bhopal','Indore','Gwalior','Jabalpur','Ujjain','Rewa','Sagar','Dewas','Satna'] },
  { state: 'Bihar',               cities: ['Patna','Gaya','Muzaffarpur','Bhagalpur','Darbhanga','Purnia','Begusarai','Arrah'] },
  { state: 'Jharkhand',           cities: ['Ranchi','Dhanbad','Jamshedpur','Bokaro','Hazaribagh','Deoghar'] },
  { state: 'Punjab',              cities: ['Ludhiana','Amritsar','Jalandhar','Patiala','Bathinda','Mohali','Pathankot'] },
  { state: 'Haryana',             cities: ['Chandigarh','Ambala','Yamunanagar','Rohtak','Hisar','Karnal','Panipat','Sonipat','Gurgaon (HR)'] },
  { state: 'Kerala',              cities: ['Kochi','Thiruvananthapuram','Kozhikode','Thrissur','Kollam','Kannur','Alappuzha','Palakkad','Malappuram'] },
  { state: 'Odisha',              cities: ['Bhubaneswar','Cuttack','Rourkela','Berhampur','Sambalpur','Puri'] },
  { state: 'Assam',               cities: ['Guwahati','Silchar','Dibrugarh','Jorhat','Nagaon'] },
  { state: 'Chhattisgarh',        cities: ['Raipur','Bhilai','Bilaspur','Korba','Durg'] },
  { state: 'Uttarakhand',         cities: ['Dehradun','Haridwar','Rishikesh','Roorkee','Nainital','Mussoorie'] },
  { state: 'Himachal Pradesh',    cities: ['Shimla','Manali','Dharamsala','Mandi','Solan','Kullu'] },
  { state: 'Goa',                 cities: ['Panaji','Margao','Vasco da Gama','Mapusa'] },
  { state: 'Jammu & Kashmir',     cities: ['Srinagar','Jammu','Leh','Kargil'] },
  { state: 'Tripura & Northeast', cities: ['Agartala','Aizawl','Imphal','Kohima','Itanagar','Shillong'] },
  { state: 'Other Cities',        cities: ['Aurangabad (BR)','Jhansi','Amritsar','Puducherry','Raigarh','Bokaro','Bhagalpur'] },
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
function saveFavourites(){ localStorage.setItem(STORAGE_KEY_FAVS,  JSON.stringify(state.favourites)); }

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
  ['tab-mine','tab-admin','mobile-tab-mine','mobile-tab-admin'].forEach(id => {
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

  panel.style.display = 'block';
  panel.innerHTML = `
    <div class="container" style="padding-bottom:80px;">
      <h2 class="listings-title" style="margin-bottom:24px;padding-top:20px;">⚙️ Admin Dashboard</h2>
      <div class="admin-stats">
        <div class="admin-stat-card"><div class="admin-stat-icon">🏠</div><div class="admin-stat-num">${leads.length}</div><div class="admin-stat-label">Total Listings</div></div>
        <div class="admin-stat-card" style="border-color:rgba(74,222,128,0.3);"><div class="admin-stat-icon">✅</div><div class="admin-stat-num" style="background:linear-gradient(135deg,#4ade80,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${liveC}</div><div class="admin-stat-label">Live & Verified</div></div>
        <div class="admin-stat-card" style="${pendingC > 0 ? 'border-color:rgba(251,191,36,0.4);' : ''}"><div class="admin-stat-icon">⏳</div><div class="admin-stat-num" style="${pendingC > 0 ? 'background:linear-gradient(135deg,#fbbf24,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;' : ''}">${pendingC}</div><div class="admin-stat-label">Pending</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">👥</div><div class="admin-stat-num">${users.length}</div><div class="admin-stat-label">Registered Users</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">🔑</div><div class="admin-stat-num">${rentC}</div><div class="admin-stat-label">Rent</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">🏷️</div><div class="admin-stat-num">${sellC}</div><div class="admin-stat-label">Sale</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">🛒</div><div class="admin-stat-num">${buyC}</div><div class="admin-stat-label">Buy</div></div>
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
          <th>Name</th><th>Email</th><th>Role</th><th>Agent Status</th><th>Joined</th><th>Listings</th><th>Action</th>
        </tr></thead><tbody>
          ${users.map(u => {
            const cnt     = leads.filter(l => l.postedBy === u.id).length;
            const isAgent = u.role === 'agent';
            const verHtml = isAgent
              ? (u.agentVerified
                  ? '<span class="user-role-pill pill-agent">✓ Verified Agent</span>'
                  : `<button class="btn-verify-agent" onclick="adminVerifyAgent('${u.id}')">⭐ Verify Agent</button>`)
              : '<span style="color:var(--text-muted);font-size:0.78rem;">N/A</span>';
            return `<tr>
              <td>${u.name}</td>
              <td>${u.email}</td>
              <td><span class="user-role-pill pill-${u.role}">${u.role}</span></td>
              <td>${verHtml}</td>
              <td>${formatDate(u.createdAt)}</td>
              <td>${cnt}</td>
              <td></td>
            </tr>`;
          }).join('')}
        </tbody></table>
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

  // Role cards
  authState.signupRole = 'user';
  document.querySelectorAll('.role-card').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.role-card').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      authState.signupRole = btn.dataset.role;
    });
  });

  // Login submit
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errEl    = document.getElementById('loginError');
    clearAuthError(errEl);
    if (!email || !password) { showAuthError(errEl, 'Please fill in all fields.'); return; }
    const user = loginUser(email, password);
    if (!user) { showAuthError(errEl, 'Invalid email or password. Try a demo account below.'); return; }
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
    const result = registerUser(name, email, password, authState.signupRole);
    if (result.error) { showAuthError(errEl, result.error); return; }
    authState.currentUser = result;
    saveSession(result.id);
    hideAuthScreen();
    updateNavForUser();
    renderListings();
    showToast(`Welcome to PropNest, ${name.split(' ')[0]}! \ud83c\udf89`, 'success');
  });

  // Demo quick-login
  const demoMap = {
    demoUser:  { email: 'user@propnest.com',  password: 'User@123'  },
    demoAgent: { email: 'agent@propnest.com', password: 'Agent@123' },
    demoAdmin: { email: 'admin@propnest.com', password: 'Admin@123' },
  };
  Object.entries(demoMap).forEach(([btnId, creds]) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      document.getElementById('loginTabBtn').click();
      document.getElementById('loginEmail').value    = creds.email;
      document.getElementById('loginPassword').value = creds.password;
      setTimeout(() => document.getElementById('loginForm').dispatchEvent(new Event('submit', { cancelable: true })), 60);
    });
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

window.adminApproveLead = adminApproveLead;
window.adminRejectLead  = adminRejectLead;
window.adminVerifyAgent = adminVerifyAgent;

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
  document.body.style.overflow = '';
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

  // Verified badge
  const vBadge = document.getElementById('detailVerifiedBadge');
  if (vBadge) vBadge.style.display = (lead.status === 'live') ? '' : 'none';

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
      `<div class="detail-thumb-item ${i === 0 ? 'active' : ''}" onclick="detailGalleryGoTo(${i})">
         <img src="${img}" alt="Photo ${i+1}" loading="lazy" />
       </div>`
    ).join('') : '';
  }
}

function openLightboxFromDetail() {
  openLightbox(detailGalleryState.leadId, detailGalleryState.currentIndex);
}

window.openLightboxFromDetail = openLightboxFromDetail;

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
  const tabLabels = { all: 'All Properties', rent: 'Properties for Rent', sell: 'Properties for Sale', buy: 'Looking to Buy', mine: 'My Listings' };
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
  grid.querySelectorAll('.btn-delete-card').forEach(btn => {
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
  const amenShow = (lead.amenities || []).slice(0, 3);
  const images   = getLeadImages(lead);
  const img      = images[0];
  const isLive   = lead.status === 'live' || !lead.status;
  const isPending = lead.status === 'pending';
  const isRejected = lead.status === 'rejected';

  return `
  <article class="property-card" data-id="${lead.id}" role="listitem" tabindex="0"
    aria-label="${lead.title} - ${priceStr}"
    style="animation-delay:${index * 0.06}s"
    onkeydown="if(event.key==='Enter')openDetail('${lead.id}')">
    <div class="card-image">
      <img src="${img}" alt="${lead.title}" loading="lazy" onerror="this.src='${PROPERTY_IMAGES[0]}'" onclick="event.stopPropagation();openLightbox('${lead.id}',0)" style="cursor:zoom-in;" />
      <span class="card-type-badge ${badgeCls}">${badgeTxt}</span>
      ${isLive ? '<span class="card-verified-badge">✓ Verified</span>' : ''}
      ${isPending ? '<span class="card-status-badge badge-pending">⏳ Pending</span>' : ''}
      ${isRejected ? '<span class="card-status-badge badge-rejected">✕ Rejected</span>' : ''}
      ${images.length > 1 ? `<span class="card-photo-count">📷 ${images.length}</span>` : ''}
      <button class="card-fav ${isFav ? 'active' : ''}" data-id="${lead.id}" aria-label="${isFav ? 'Remove from favourites' : 'Add to favourites'}" aria-pressed="${isFav}">
        ${isFav ? '❤️' : '🤍'}
      </button>
    </div>
    <div class="card-body">
      <div class="card-price">${priceStr}<span>${unitStr}</span></div>
      <div class="card-title" title="${lead.title}">${lead.title}</div>
      <div class="card-location">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${lead.address}, ${lead.city}
      </div>
      ${amenShow.length ? `<div class="card-amenities">${amenShow.map(a => `<span class="amenity-tag">${a}</span>`).join('')}</div>` : ''}
      <div class="card-specs">
        <div class="spec-item"><span class="spec-icon">🛏</span>${lead.bedrooms === 0 ? 'Studio' : lead.bedrooms + ' Bed'}</div>
        <div class="spec-item"><span class="spec-icon">🚿</span>${lead.bathrooms} Bath</div>
        ${lead.area ? `<div class="spec-item"><span class="spec-icon">📐</span>${fmt(lead.area)} sqft</div>` : ''}
      </div>
      <div class="card-footer">
        <div class="card-agent">
          <div class="agent-avatar">${initials(lead.contact.name)}</div>
          <div>
            <div class="agent-name">${lead.contact.name}${lead.postedByRole === 'agent' ? '<span class="agent-verified-badge">✓ Agent</span>' : ''}</div>
          </div>
        </div>
        <span class="card-date">${formatDate(lead.postedAt)}</span>
      </div>
    </div>
    ${canDeleteLead(lead) ? `<button class="btn-delete-card" onclick="deleteLead('${lead.id}', event)" aria-label="Delete listing">🗑 Delete</button>` : ''}
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

  document.getElementById('detailSpecs').innerHTML = `
    <div class="detail-spec"><span class="detail-spec-icon">🛏</span><span class="detail-spec-val">${lead.bedrooms === 0 ? 'Studio' : lead.bedrooms}</span><span class="detail-spec-key">Beds</span></div>
    <div class="detail-spec"><span class="detail-spec-icon">🚿</span><span class="detail-spec-val">${lead.bathrooms}</span><span class="detail-spec-key">Baths</span></div>
    ${lead.area ? `<div class="detail-spec"><span class="detail-spec-icon">📐</span><span class="detail-spec-val">${fmt(lead.area)}</span><span class="detail-spec-key">Sq. Ft.</span></div>` : ''}
    <div class="detail-spec"><span class="detail-spec-icon">🏠</span><span class="detail-spec-val">${lead.type === 'rent' ? 'Rent' : lead.type === 'sell' ? 'Sale' : 'Buy'}</span><span class="detail-spec-key">Type</span></div>
    <div class="detail-spec"><span class="detail-spec-icon">📅</span><span class="detail-spec-val">${formatDate(lead.postedAt)}</span><span class="detail-spec-key">Posted</span></div>
    ${lead.status === 'live' ? `<div class="detail-spec"><span class="detail-spec-icon">✅</span><span class="detail-spec-val" style="color:#4ade80;">Verified</span><span class="detail-spec-key">Status</span></div>` : ''}`;

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

  // Wire up gallery nav inside detail
  document.getElementById('detailGalleryPrev').onclick = () => detailGalleryNav(-1);
  document.getElementById('detailGalleryNext').onclick = () => detailGalleryNav(1);

  openModal('detailModal');
}

// ── Post Lead Modal ────────────────────────────
function openPostModal() {
  if (!authState.currentUser) { showToast('Please login to post a lead.', 'error'); return; }
  applyPostFormRoleRestrictions();
  state.selectedPhotos    = [];
  state.selectedAmenities = [];
  initPhotoSelector();
  buildAmenities();
  openModal('postModal');
}

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

  const newLead = {
    id:          genId(),
    type,
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

  if (tab === 'admin') {
    if (ls) ls.style.display = 'none';
    if (ss) ss.style.display = 'none';
    renderAdminPanel();
  } else {
    if (ls) ls.style.display = '';
    if (ss) ss.style.display = '';
    if (ap) ap.style.display = 'none';
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
  loadFromStorage();
  populateCityDropdowns();
  buildAmenities();
  initAuth();

  // Stat counter
  const statEl = document.getElementById('statListings');
  animateCounter(statEl, state.leads.length, '');

  renderListings();

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

// ── Debounce ───────────────────────────────────
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── Run ────────────────────────────────────────
window.openDetail    = openDetail;
window.openPostModal = openPostModal;
document.addEventListener('DOMContentLoaded', init);
