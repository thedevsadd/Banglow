export interface Unit {
  id: string;
  unitNumber: string;          // "A-4B"
  floor: number;
  sizeSqft: number;
  bedroom: number;
  bathroom: number;
  totalPrice: number;          // in BDT
  available: boolean;
}

export interface Property {
  id: string;
  slug: string;
  name: string;               // "Anindya"
  tagline: string;             // short poetic one-liner
  area: "Uttara" | "Purbachal" | "Jalshiri" | "Gulshan" | "Dhanmondi" | "Bashundhara";
  fullAddress: string;
  status: "ongoing" | "upcoming";
  description: string;         // long-form paragraph
  heroImage: string;           // public url or path
  gallery: string[];
  floorPlans: { title: string; image: string }[];
  atAGlance: {
    landArea: string;          // "8 Katha"
    floors: string;            // "B+G+8"
    apartmentsPerFloor: number;
    unitSizeRange: string;     // "2100 to 2200+ sft"
    bedroom: number;
    bathroom: number;
    launchDate: string;
    expectedCompletion: string;
  };
  pricing: {
    pricePerSqftMin: number;
    pricePerSqftMax: number;
    totalPriceMin: number;     // in BDT
    totalPriceMax: number;
    bookingMoneyPercent: number; // 5–10
  };
  location: {
    lat: number;
    lng: number;
  };
  units: Unit[];
}

export const PROPERTIES: Property[] = [
  {
    id: "prop-anindya",
    slug: "anindya",
    name: "Anindya",
    tagline: "Symphony of light and space in Uttara's quietest pocket",
    area: "Uttara",
    fullAddress: "Plot 42, Road 18, Sector 3, Uttara, Dhaka",
    status: "ongoing",
    description: "Anindya stands as a tribute to classical geometry blended with contemporary minimalism. Situated in the heart of Sector 3, Uttara, it offers residents a sanctuary of calm away from the metropolitan buzz. The building is meticulously designed to optimize cross-ventilation and allow maximum natural light into every room. Expansive windows frame green street views, while double-height entryways make a grand architectural statement.",
    heroImage: "/Assets/Anindya (Uttara)/uttara-cover.jpeg",
    gallery: [
      "/Assets/Anindya (Uttara)/Angle-1.jpeg",
      "/Assets/Anindya (Uttara)/Angle-2.jpeg",
      "/Assets/Anindya (Uttara)/Angle-3.jpeg",
      "/Assets/Anindya (Uttara)/Angle-4.jpeg",
      "/Assets/Anindya (Uttara)/Angle-5.jpeg",
      "/Assets/Anindya (Uttara)/Angle-6.jpeg"
    ],
    floorPlans: [
      { title: "Type A (2,100 sft) - 3 Bed, 3 Bath", image: "/Assets/Anindya (Uttara)/ART-1.jpeg" },
      { title: "Type B (2,200 sft) - 3 Bed, 4 Bath", image: "/Assets/Anindya (Uttara)/ART-2.jpeg" }
    ],
    atAGlance: {
      landArea: "6.5 Katha",
      floors: "B+G+8",
      apartmentsPerFloor: 2,
      unitSizeRange: "2,100 - 2,200 sft",
      bedroom: 3,
      bathroom: 4,
      launchDate: "Jan 2025",
      expectedCompletion: "Dec 2027"
    },
    pricing: {
      pricePerSqftMin: 11500,
      pricePerSqftMax: 13000,
      totalPriceMin: 24150000, // 2.41 Crore
      totalPriceMax: 28600000, // 2.86 Crore
      bookingMoneyPercent: 5
    },
    location: {
      lat: 23.8683,
      lng: 90.3924
    },
    units: [
      { id: "anindya-2a", unitNumber: "A-2", floor: 2, sizeSqft: 2100, bedroom: 3, bathroom: 3, totalPrice: 24150000, available: true },
      { id: "anindya-3b", unitNumber: "B-3", floor: 3, sizeSqft: 2200, bedroom: 3, bathroom: 4, totalPrice: 28600000, available: false },
      { id: "anindya-4a", unitNumber: "A-4", floor: 4, sizeSqft: 2100, bedroom: 3, bathroom: 3, totalPrice: 24650000, available: true },
      { id: "anindya-6b", unitNumber: "B-6", floor: 6, sizeSqft: 2200, bedroom: 3, bathroom: 4, totalPrice: 29000000, available: true },
      { id: "anindya-8a", unitNumber: "Penthouse-A", floor: 8, sizeSqft: 2200, bedroom: 3, bathroom: 4, totalPrice: 31000000, available: true }
    ]
  },
  {
    id: "prop-aronno",
    slug: "aronno",
    name: "Aronno",
    tagline: "Biophilic architectural haven nestled within Purbachal",
    area: "Purbachal",
    fullAddress: "Sector 4, Road 202, Purbachal New Town, Dhaka",
    status: "upcoming",
    description: "Aronno is designed to be an extension of the earth itself. Utilizing biophilic design guidelines, this upcoming flagship tower incorporates vertical gardens, deep-soil planters on balconies, and a central water court that aids in natural cooling. Situated in the clean, green expanse of Purbachal, Aronno offers space and fresh air that is rarely found in Dhaka's core. The architectural layouts prioritize expansive open terraces for each home.",
    heroImage: "/Assets/Aronno (Purbachal)/Purbachal-cover.jpeg",
    gallery: [
      "/Assets/Aronno (Purbachal)/Angle-1.jpeg",
      "/Assets/Aronno (Purbachal)/Angle-2.jpeg",
      "/Assets/Aronno (Purbachal)/Angle-3.jpeg",
      "/Assets/Aronno (Purbachal)/Angle-4.jpeg",
      "/Assets/Aronno (Purbachal)/Angle-5.jpeg",
      "/Assets/Aronno (Purbachal)/Angle-6.jpeg"
    ],
    floorPlans: [
      { title: "Type A (1,900 sft) - 3 Bed, 3 Bath", image: "/Assets/Aronno (Purbachal)/ART-1.jpeg" },
      { title: "Type B (2,400 sft) - 4 Bed, 4 Bath", image: "/Assets/Aronno (Purbachal)/ART-2.jpeg" }
    ],
    atAGlance: {
      landArea: "10 Katha",
      floors: "B+G+10",
      apartmentsPerFloor: 2,
      unitSizeRange: "1,900 - 2,400 sft",
      bedroom: 3,
      bathroom: 3,
      launchDate: "Nov 2026",
      expectedCompletion: "Jun 2030"
    },
    pricing: {
      pricePerSqftMin: 7500,
      pricePerSqftMax: 8500,
      totalPriceMin: 14250000, // 1.42 Crore
      totalPriceMax: 20400000, // 2.04 Crore
      bookingMoneyPercent: 8
    },
    location: {
      lat: 23.8617,
      lng: 90.5204
    },
    units: [
      { id: "aronno-2a", unitNumber: "A-2", floor: 2, sizeSqft: 1900, bedroom: 3, bathroom: 3, totalPrice: 14250000, available: true },
      { id: "aronno-3b", unitNumber: "B-3", floor: 3, sizeSqft: 2400, bedroom: 4, bathroom: 4, totalPrice: 20400000, available: true },
      { id: "aronno-5a", unitNumber: "A-5", floor: 5, sizeSqft: 1900, bedroom: 3, bathroom: 3, totalPrice: 14600000, available: true },
      { id: "aronno-7b", unitNumber: "B-7", floor: 7, sizeSqft: 2400, bedroom: 4, bathroom: 4, totalPrice: 20800000, available: true }
    ]
  },
  {
    id: "prop-nilashri",
    slug: "nilashri",
    name: "Nilashri",
    tagline: "Serene glass-forward luxury overlooking Jalshiri's central lake",
    area: "Jalshiri",
    fullAddress: "Sector 1, Lake Road, Jalshiri Cantonment Town, Dhaka",
    status: "ongoing",
    description: "Nilashri is a state-of-the-art residential tower utilizing ultra-transparent low-E glass facade technology. Perched directly at the waterfront of Jalshiri's central lake, it offers unobstructed panoramic views. The morning mist over the lake filters directly into its spacious double-aspect living rooms. Nilashri embodies quiet luxury, with custom marble flooring, premium automation fittings, and an exclusive residents-only lakeside boardwalk.",
    heroImage: "/Assets/Nilashri (Jalshiri)/Jalshiri-cover.jpeg",
    gallery: [
      "/Assets/Nilashri (Jalshiri)/Angle-1.jpeg",
      "/Assets/Nilashri (Jalshiri)/Angle-2.jpeg",
      "/Assets/Nilashri (Jalshiri)/Angle-3.jpeg",
      "/Assets/Nilashri (Jalshiri)/Angle-4.jpeg",
      "/Assets/Nilashri (Jalshiri)/Angle-5.jpeg",
      "/Assets/Nilashri (Jalshiri)/Angle-6.jpeg"
    ],
    floorPlans: [
      { title: "Standard Layout (2,000 sft) - 3 Bed, 3 Bath", image: "/Assets/Nilashri (Jalshiri)/ART-1.jpeg" },
      { title: "Grand Layout (2,300 sft) - 3 Bed, 4 Bath", image: "/Assets/Nilashri (Jalshiri)/ART-2.jpeg" }
    ],
    atAGlance: {
      landArea: "8 Katha",
      floors: "B+G+8",
      apartmentsPerFloor: 2,
      unitSizeRange: "2,000 - 2,300 sft",
      bedroom: 3,
      bathroom: 4,
      launchDate: "Mar 2025",
      expectedCompletion: "Sep 2028"
    },
    pricing: {
      pricePerSqftMin: 9000,
      pricePerSqftMax: 10500,
      totalPriceMin: 18000000, // 1.80 Crore
      totalPriceMax: 24150000, // 2.41 Crore
      bookingMoneyPercent: 6
    },
    location: {
      lat: 23.8342,
      lng: 90.5011
    },
    units: [
      { id: "nilashri-1a", unitNumber: "A-1", floor: 1, sizeSqft: 2000, bedroom: 3, bathroom: 3, totalPrice: 18000000, available: false },
      { id: "nilashri-2b", unitNumber: "B-2", floor: 2, sizeSqft: 2300, bedroom: 3, bathroom: 4, totalPrice: 21850000, available: true },
      { id: "nilashri-4a", unitNumber: "A-4", floor: 4, sizeSqft: 2000, bedroom: 3, bathroom: 3, totalPrice: 18800000, available: true },
      { id: "nilashri-6b", unitNumber: "B-6", floor: 6, sizeSqft: 2300, bedroom: 3, bathroom: 4, totalPrice: 22800000, available: true }
    ]
  },
  {
    id: "prop-belmonte",
    slug: "belmonte",
    name: "Belmonte",
    tagline: "The pinnacle of ultra-luxury living in Dhaka's diplomatic enclave",
    area: "Gulshan",
    fullAddress: "Road 71, Gulshan 2, Dhaka",
    status: "ongoing",
    description: "Belmonte redefines luxury living in Bangladesh. Located on a quiet tree-lined road in Gulshan 2, Belmonte is tailored for those who accept nothing short of global top-tier quality. Architectural features include a copper-toned louvered exterior facade, private elevators opening directly into each foyer, automated smart-home systems, and double-insulated glass. The rooftop features a 20-meter infinity pool, private cigar lounge, and sky garden overlooking the Gulshan skyline.",
    heroImage: "/Assets/Belmonte (Gulshan)/Gulshan-cover.jpeg",
    gallery: [
      "/Assets/Belmonte (Gulshan)/Angle-1.jpeg",
      "/Assets/Belmonte (Gulshan)/Angle-2.jpeg",
      "/Assets/Belmonte (Gulshan)/Angle-3.jpeg",
      "/Assets/Belmonte (Gulshan)/Angle-4.jpeg",
      "/Assets/Belmonte (Gulshan)/Angle-5.jpeg",
      "/Assets/Belmonte (Gulshan)/Angle-6.jpeg"
    ],
    floorPlans: [
      { title: "Executive Suite (2,600 sft) - 3 Bed, 4 Bath", image: "/Assets/Belmonte (Gulshan)/ART-1.jpeg" },
      { title: "Imperial Suite (3,200 sft) - 4 Bed, 5 Bath", image: "/Assets/Belmonte (Gulshan)/ART-2.jpeg" }
    ],
    atAGlance: {
      landArea: "12 Katha",
      floors: "B+G+10",
      apartmentsPerFloor: 2,
      unitSizeRange: "2,600 - 3,200 sft",
      bedroom: 4,
      bathroom: 5,
      launchDate: "Oct 2024",
      expectedCompletion: "Dec 2028"
    },
    pricing: {
      pricePerSqftMin: 23000,
      pricePerSqftMax: 28000,
      totalPriceMin: 59800000, // 5.98 Crore
      totalPriceMax: 89600000, // 8.96 Crore
      bookingMoneyPercent: 10
    },
    location: {
      lat: 23.7925,
      lng: 90.4156
    },
    units: [
      { id: "belmonte-2a", unitNumber: "A-2", floor: 2, sizeSqft: 2600, bedroom: 3, bathroom: 4, totalPrice: 59800000, available: true },
      { id: "belmonte-4b", unitNumber: "B-4", floor: 4, sizeSqft: 3200, bedroom: 4, bathroom: 5, totalPrice: 86400000, available: true },
      { id: "belmonte-6a", unitNumber: "A-6", floor: 6, sizeSqft: 2600, bedroom: 3, bathroom: 4, totalPrice: 61500000, available: false },
      { id: "belmonte-8b", unitNumber: "B-8", floor: 8, sizeSqft: 3200, bedroom: 4, bathroom: 5, totalPrice: 89600000, available: true },
      { id: "belmonte-10a", unitNumber: "Penthouse", floor: 10, sizeSqft: 3200, bedroom: 4, bathroom: 5, totalPrice: 96000000, available: true }
    ]
  },
  {
    id: "prop-sarovar",
    slug: "sarovar",
    name: "Sarovar",
    tagline: "Cultured modern-heritage architecture along Dhanmondi lake's premium axis",
    area: "Dhanmondi",
    fullAddress: "Road 12/A, Dhanmondi, Dhaka",
    status: "upcoming",
    description: "Sarovar captures the romantic red-brick heritage of classic Dhanmondi architectural design, fusing it with contemporary dark steel frames and oversized balconies. Set in a quiet residential node close to Dhanmondi Lake, Sarovar is planned as a sanctuary for art lovers and culture enthusiasts. The building incorporates a private library and gallery lobby, a landscaped central atrium, and low-energy lighting systems.",
    heroImage: "/Assets/Sarovar (Dhanmondi)/Dhanmondi-cover.jpeg",
    gallery: [
      "/Assets/Sarovar (Dhanmondi)/Angle-1.jpeg",
      "/Assets/Sarovar (Dhanmondi)/Angle-2.jpeg",
      "/Assets/Sarovar (Dhanmondi)/Angle-3.jpeg",
      "/Assets/Sarovar (Dhanmondi)/Angle-4.jpeg",
      "/Assets/Sarovar (Dhanmondi)/Angle-5.jpeg",
      "/Assets/Sarovar (Dhanmondi)/Angle-6.jpeg"
    ],
    floorPlans: [
      { title: "Standard Residence (2,200 sft) - 3 Bed, 3 Bath", image: "/Assets/Sarovar (Dhanmondi)/ART-1.jpeg" },
      { title: "Lakeside Residence (2,700 sft) - 4 Bed, 4 Bath", image: "/Assets/Sarovar (Dhanmondi)/ART-2.jpeg" }
    ],
    atAGlance: {
      landArea: "9 Katha",
      floors: "B+G+9",
      apartmentsPerFloor: 2,
      unitSizeRange: "2,200 - 2,700 sft",
      bedroom: 3,
      bathroom: 3,
      launchDate: "Mar 2026",
      expectedCompletion: "Dec 2029"
    },
    pricing: {
      pricePerSqftMin: 16000,
      pricePerSqftMax: 18500,
      totalPriceMin: 35200000, // 3.52 Crore
      totalPriceMax: 49950000, // 4.99 Crore
      bookingMoneyPercent: 8
    },
    location: {
      lat: 23.7461,
      lng: 90.3742
    },
    units: [
      { id: "sarovar-2a", unitNumber: "A-2", floor: 2, sizeSqft: 2200, bedroom: 3, bathroom: 3, totalPrice: 35200000, available: true },
      { id: "sarovar-3b", unitNumber: "B-3", floor: 3, sizeSqft: 2700, bedroom: 4, bathroom: 4, totalPrice: 47250000, available: true },
      { id: "sarovar-5a", unitNumber: "A-5", floor: 5, sizeSqft: 2200, bedroom: 3, bathroom: 3, totalPrice: 36300000, available: true },
      { id: "sarovar-7b", unitNumber: "B-7", floor: 7, sizeSqft: 2700, bedroom: 4, bathroom: 4, totalPrice: 49950000, available: true }
    ]
  },
  {
    id: "prop-solvera",
    slug: "solvera",
    name: "Solvera",
    tagline: "Sleek, futuristic urban homes for the young professional",
    area: "Bashundhara",
    fullAddress: "Block I, Road 12, Bashundhara R/A, Dhaka",
    status: "ongoing",
    description: "Solvera is engineered for the fast-paced life of modern entrepreneurs and professionals. Positioned inside Bashundhara R/A, it is designed with a sleek concrete, glass, and steel facade. The units feature smart lock entries, space-optimizing modular layouts, and acoustic double glazing. Solvera provides extensive shared workspaces, a high-tech gym, and an organic juice bar on the rooftop lounge.",
    heroImage: "/Assets/Solvera (Bashundhara)/Bashundhara-cover.jpeg",
    gallery: [
      "/Assets/Solvera (Bashundhara)/Angle-1.jpeg",
      "/Assets/Solvera (Bashundhara)/Angle-2.jpeg",
      "/Assets/Solvera (Bashundhara)/Angle-3.jpeg",
      "/Assets/Solvera (Bashundhara)/Angle-4.jpeg",
      "/Assets/Solvera (Bashundhara)/Angle-5.jpeg",
      "/Assets/Solvera (Bashundhara)/Angle-6.jpeg"
    ],
    floorPlans: [
      { title: "Type A (1,600 sft) - 3 Bed, 3 Bath", image: "/Assets/Solvera (Bashundhara)/ART-1.jpeg" },
      { title: "Type B (1,850 sft) - 3 Bed, 3 Bath", image: "/Assets/Solvera (Bashundhara)/ART-2.jpeg" },
      { title: "Type C (2,100 sft) - 3 Bed, 4 Bath", image: "/Assets/Solvera (Bashundhara)/ART-3.jpeg" }
    ],
    atAGlance: {
      landArea: "8.5 Katha",
      floors: "B+G+10",
      apartmentsPerFloor: 3,
      unitSizeRange: "1,600 - 2,100 sft",
      bedroom: 3,
      bathroom: 3,
      launchDate: "Jun 2025",
      expectedCompletion: "Jun 2029"
    },
    pricing: {
      pricePerSqftMin: 11000,
      pricePerSqftMax: 12500,
      totalPriceMin: 17600000, // 1.76 Crore
      totalPriceMax: 26250000, // 2.62 Crore
      bookingMoneyPercent: 5
    },
    location: {
      lat: 23.8184,
      lng: 90.4312
    },
    units: [
      { id: "solvera-2a", unitNumber: "A-2", floor: 2, sizeSqft: 1600, bedroom: 3, bathroom: 3, totalPrice: 17600000, available: true },
      { id: "solvera-3b", unitNumber: "B-3", floor: 3, sizeSqft: 1850, bedroom: 3, bathroom: 3, totalPrice: 21275000, available: false },
      { id: "solvera-4c", unitNumber: "C-4", floor: 4, sizeSqft: 2100, bedroom: 3, bathroom: 4, totalPrice: 25200000, available: true },
      { id: "solvera-5a", unitNumber: "A-5", floor: 5, sizeSqft: 1600, bedroom: 3, bathroom: 3, totalPrice: 18000000, available: true },
      { id: "solvera-7c", unitNumber: "C-7", floor: 7, sizeSqft: 2100, bedroom: 3, bathroom: 4, totalPrice: 26250000, available: true }
    ]
  }
];
