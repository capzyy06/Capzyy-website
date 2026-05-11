const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding...');

  // ── 1. CATEGORIES ──────────────────────────────────────────────
  await Category.deleteMany({});

  const categoryData = [
    { name: 'Snapback',    description: 'Flat-brim, adjustable snap closure caps',  displayOrder: 1 },
    { name: 'Trucker Cap', description: 'Mesh back, foam front caps',                displayOrder: 2 },
    { name: 'Bucket Hat',  description: 'Wide brim, all-around brim hats',           displayOrder: 3 },
    { name: 'Beanie',      description: 'Knit winter headwear',                      displayOrder: 4 },
    { name: 'Fitted Cap',  description: 'Structured baseball-style caps',            displayOrder: 5 },
    { name: 'Dad Cap',     description: 'Unstructured curved-brim caps',             displayOrder: 6 },
    { name: '5-Panel',     description: 'Minimal skate-influenced caps',             displayOrder: 7 },
  ];

  const cats = [];
  for (const c of categoryData) {
    cats.push(await Category.create(c));
  }
  console.log(`✅ ${cats.length} categories seeded`);

  const cat = (name) => cats.find(c => c.name === name)._id;

  // ── 2. PRODUCTS ─────────────────────────────────────────────────
  await Product.deleteMany({});

  const productData = [

    // ════════════════════════════════
    // SNAPBACKS (6 products)
    // ════════════════════════════════
    {
      name: 'Black Ace Snapback',
      description: 'Clean all-black flat-brim snapback with embroidered logo. Six-panel structured crown with plastic snap closure. The go-to for any fit.',
      price: 899,
      compareAtPrice: 1199,
      category: cat('Snapback'),
      tags: ['snapback', 'black', 'flat-brim', 'embroidered'],
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      stock: 50,
      variants: [
        { color: 'Black', colorHex: '#000000', size: 'One Size', stock: 50, sku: 'SNP-BLK-001' },
      ],
    },
    {
      name: 'Olive Camo Snapback',
      description: 'Camo-print snapback with flat brim and tonal embroidery. Adjustable snap for a perfect fit every time.',
      price: 999,
      compareAtPrice: null,
      category: cat('Snapback'),
      tags: ['snapback', 'camo', 'olive', 'flat-brim'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      stock: 35,
      variants: [
        { color: 'Olive Camo', colorHex: '#4B5320', size: 'One Size', stock: 35, sku: 'SNP-OLV-002' },
      ],
    },
    {
      name: 'Washed Grey Snapback',
      description: 'Vintage washed grey snapback with distressed brim and tonal snap closure. Relaxed street-ready look straight out of the box.',
      price: 849,
      compareAtPrice: 999,
      category: cat('Snapback'),
      tags: ['snapback', 'grey', 'washed', 'vintage'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      stock: 40,
      variants: [
        { color: 'Washed Grey', colorHex: '#9E9E9E', size: 'One Size', stock: 40, sku: 'SNP-GRY-003' },
      ],
    },
    {
      name: 'Red Strike Snapback',
      description: 'Bold red snapback with white contrast stitching and flat brim. Six-panel construction with fully structured crown.',
      price: 949,
      compareAtPrice: 1199,
      category: cat('Snapback'),
      tags: ['snapback', 'red', 'contrast', 'bold'],
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      stock: 38,
      variants: [
        { color: 'Red', colorHex: '#CC0000', size: 'One Size', stock: 38, sku: 'SNP-RED-004' },
      ],
    },
    {
      name: 'Navy Gold Snapback',
      description: 'Premium navy snapback with gold embroidered detailing and flat brim. Snap closure with gold hardware for that premium touch.',
      price: 1099,
      compareAtPrice: null,
      category: cat('Snapback'),
      tags: ['snapback', 'navy', 'gold', 'premium'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      stock: 30,
      variants: [
        { color: 'Navy', colorHex: '#1B2A4A', size: 'One Size', stock: 30, sku: 'SNP-NVY-005' },
      ],
    },
    {
      name: 'All White Snapback',
      description: 'Clean all-white flat-brim snapback with tonal embroidery. Minimal and fresh — pairs with everything.',
      price: 899,
      compareAtPrice: 1099,
      category: cat('Snapback'),
      tags: ['snapback', 'white', 'minimal', 'clean'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      stock: 42,
      variants: [
        { color: 'White', colorHex: '#FFFFFF', size: 'One Size', stock: 42, sku: 'SNP-WHT-006' },
      ],
    },

    // ════════════════════════════════
    // TRUCKER CAPS (5 products)
    // ════════════════════════════════
    {
      name: 'White Mesh Trucker',
      description: 'Classic white foam-front trucker with mesh back panels. Adjustable snapback closure and pre-curved brim. The OG trucker silhouette.',
      price: 749,
      compareAtPrice: null,
      category: cat('Trucker Cap'),
      tags: ['trucker', 'white', 'mesh', 'classic'],
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      stock: 60,
      variants: [
        { color: 'White', colorHex: '#FFFFFF', size: 'One Size', stock: 60, sku: 'TRK-WHT-001' },
      ],
    },
    {
      name: 'Navy Blue Trucker',
      description: 'Navy foam-front trucker cap with contrast white mesh back. Minimalist front embroidery with clean snap closure.',
      price: 799,
      compareAtPrice: 999,
      category: cat('Trucker Cap'),
      tags: ['trucker', 'navy', 'mesh', 'minimal'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      stock: 45,
      variants: [
        { color: 'Navy', colorHex: '#1B2A4A', size: 'One Size', stock: 45, sku: 'TRK-NVY-002' },
      ],
    },
    {
      name: 'Tan Desert Trucker',
      description: 'Earthy tan trucker with worn-in foam front and breathable mesh rear. Built for the streets and beyond.',
      price: 849,
      compareAtPrice: null,
      category: cat('Trucker Cap'),
      tags: ['trucker', 'tan', 'desert', 'earthy'],
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      stock: 30,
      variants: [
        { color: 'Tan', colorHex: '#D2B48C', size: 'One Size', stock: 30, sku: 'TRK-TAN-003' },
      ],
    },
    {
      name: 'Black Camo Trucker',
      description: 'Black and dark camo foam-front trucker with tonal mesh back. Stealthy design for understated drip.',
      price: 899,
      compareAtPrice: 1099,
      category: cat('Trucker Cap'),
      tags: ['trucker', 'black', 'camo', 'mesh'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      stock: 35,
      variants: [
        { color: 'Black Camo', colorHex: '#1C1C1C', size: 'One Size', stock: 35, sku: 'TRK-BCM-004' },
      ],
    },
    {
      name: 'Washed Red Trucker',
      description: 'Vintage washed red foam-front trucker with off-white mesh back. Faded finish for that perfectly broken-in feel.',
      price: 849,
      compareAtPrice: null,
      category: cat('Trucker Cap'),
      tags: ['trucker', 'red', 'washed', 'vintage'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      stock: 28,
      variants: [
        { color: 'Washed Red', colorHex: '#A0522D', size: 'One Size', stock: 28, sku: 'TRK-WRD-005' },
      ],
    },

    // ════════════════════════════════
    // BUCKET HATS (5 products)
    // ════════════════════════════════
    {
      name: 'Black Ripstop Bucket',
      description: 'Tactical ripstop bucket hat with all-around brim and metal eyelets. Lightweight and packable for everyday carry.',
      price: 1099,
      compareAtPrice: 1399,
      category: cat('Bucket Hat'),
      tags: ['bucket', 'black', 'ripstop', 'tactical'],
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      stock: 40,
      variants: [
        { color: 'Black', colorHex: '#000000', size: 'S/M',  stock: 20, sku: 'BCK-BLK-SM-001' },
        { color: 'Black', colorHex: '#000000', size: 'L/XL', stock: 20, sku: 'BCK-BLK-LX-001' },
      ],
    },
    {
      name: 'Cream Terry Bucket',
      description: 'Soft terry cloth bucket hat in off-white cream. Relaxed summer silhouette with wide floppy brim.',
      price: 949,
      compareAtPrice: null,
      category: cat('Bucket Hat'),
      tags: ['bucket', 'cream', 'terry', 'summer'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      stock: 35,
      variants: [
        { color: 'Cream', colorHex: '#FFFDD0', size: 'S/M',  stock: 18, sku: 'BCK-CRM-SM-002' },
        { color: 'Cream', colorHex: '#FFFDD0', size: 'L/XL', stock: 17, sku: 'BCK-CRM-LX-002' },
      ],
    },
    {
      name: 'Forest Camo Bucket',
      description: 'Forest camo print bucket hat with contrast stitching and adjustable drawcord. Two looks in one reversible design.',
      price: 1149,
      compareAtPrice: 1299,
      category: cat('Bucket Hat'),
      tags: ['bucket', 'camo', 'forest', 'reversible'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      stock: 25,
      variants: [
        { color: 'Forest Camo', colorHex: '#228B22', size: 'S/M',  stock: 13, sku: 'BCK-FCM-SM-003' },
        { color: 'Forest Camo', colorHex: '#228B22', size: 'L/XL', stock: 12, sku: 'BCK-FCM-LX-003' },
      ],
    },
    {
      name: 'Washed Denim Bucket',
      description: 'Light washed denim bucket hat with raw-edge brim and brass eyelets. Timeless and versatile for every season.',
      price: 1049,
      compareAtPrice: null,
      category: cat('Bucket Hat'),
      tags: ['bucket', 'denim', 'washed', 'classic'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
      stock: 32,
      variants: [
        { color: 'Light Denim', colorHex: '#6A8EAE', size: 'S/M',  stock: 16, sku: 'BCK-DNM-SM-004' },
        { color: 'Light Denim', colorHex: '#6A8EAE', size: 'L/XL', stock: 16, sku: 'BCK-DNM-LX-004' },
      ],
    },
    {
      name: 'Olive Nylon Bucket',
      description: 'Water-resistant nylon bucket hat in military olive. Packable design with cinch cord and minimal branding.',
      price: 1199,
      compareAtPrice: 1399,
      category: cat('Bucket Hat'),
      tags: ['bucket', 'olive', 'nylon', 'packable', 'water-resistant'],
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: false,
      stock: 28,
      variants: [
        { color: 'Olive', colorHex: '#4B5320', size: 'S/M',  stock: 14, sku: 'BCK-OLV-SM-005' },
        { color: 'Olive', colorHex: '#4B5320', size: 'L/XL', stock: 14, sku: 'BCK-OLV-LX-005' },
      ],
    },

    // ════════════════════════════════
    // BEANIES (4 products)
    // ════════════════════════════════
    {
      name: 'Black Ribbed Beanie',
      description: 'Classic ribbed knit beanie in jet black. Fold-over cuff with embroidered logo patch. The winter essential.',
      price: 649,
      compareAtPrice: null,
      category: cat('Beanie'),
      tags: ['beanie', 'black', 'ribbed', 'knit', 'winter'],
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      stock: 80,
      variants: [
        { color: 'Black', colorHex: '#000000', size: 'One Size', stock: 80, sku: 'BNE-BLK-001' },
      ],
    },
    {
      name: 'Charcoal Pom Beanie',
      description: 'Chunky knit charcoal beanie with oversized pom-pom. Extra thick for the coldest winter days.',
      price: 749,
      compareAtPrice: 899,
      category: cat('Beanie'),
      tags: ['beanie', 'charcoal', 'pom', 'chunky', 'winter'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      stock: 55,
      variants: [
        { color: 'Charcoal', colorHex: '#36454F', size: 'One Size', stock: 55, sku: 'BNE-CHR-002' },
      ],
    },
    {
      name: 'Cream Slouch Beanie',
      description: 'Oversized slouch beanie in warm cream. Relaxed fit that sits back on the head for that effortless look.',
      price: 699,
      compareAtPrice: null,
      category: cat('Beanie'),
      tags: ['beanie', 'cream', 'slouch', 'oversized'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      stock: 45,
      variants: [
        { color: 'Cream', colorHex: '#FFFDD0', size: 'One Size', stock: 45, sku: 'BNE-CRM-003' },
      ],
    },
    {
      name: 'Forest Green Cuffed Beanie',
      description: 'Deep forest green ribbed beanie with double-fold cuff and woven label. Clean, minimal, warm.',
      price: 649,
      compareAtPrice: 799,
      category: cat('Beanie'),
      tags: ['beanie', 'green', 'cuffed', 'ribbed'],
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      stock: 60,
      variants: [
        { color: 'Forest Green', colorHex: '#228B22', size: 'One Size', stock: 60, sku: 'BNE-FGN-004' },
      ],
    },

    // ════════════════════════════════
    // FITTED CAPS (5 products)
    // ════════════════════════════════
    {
      name: 'All Black Fitted',
      description: 'Premium structured fitted cap in all black with under-brim taping. No adjustable, no compromises. Pure fitted culture.',
      price: 1299,
      compareAtPrice: null,
      category: cat('Fitted Cap'),
      tags: ['fitted', 'black', 'structured', 'premium'],
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      stock: 45,
      variants: [
        { color: 'Black', colorHex: '#000000', size: '7',     stock: 10, sku: 'FIT-BLK-7-001' },
        { color: 'Black', colorHex: '#000000', size: '7 1/8', stock: 12, sku: 'FIT-BLK-718-001' },
        { color: 'Black', colorHex: '#000000', size: '7 1/4', stock: 13, sku: 'FIT-BLK-714-001' },
        { color: 'Black', colorHex: '#000000', size: '7 3/8', stock: 10, sku: 'FIT-BLK-738-001' },
      ],
    },
    {
      name: 'Royal Blue Fitted',
      description: 'Vibrant royal blue structured fitted with contrast grey underbrim. A bold statement for fitted collectors.',
      price: 1199,
      compareAtPrice: 1499,
      category: cat('Fitted Cap'),
      tags: ['fitted', 'blue', 'royal', 'structured'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      stock: 30,
      variants: [
        { color: 'Royal Blue', colorHex: '#4169E1', size: '7',     stock: 8, sku: 'FIT-RBL-7-002' },
        { color: 'Royal Blue', colorHex: '#4169E1', size: '7 1/8', stock: 8, sku: 'FIT-RBL-718-002' },
        { color: 'Royal Blue', colorHex: '#4169E1', size: '7 1/4', stock: 7, sku: 'FIT-RBL-714-002' },
        { color: 'Royal Blue', colorHex: '#4169E1', size: '7 3/8', stock: 7, sku: 'FIT-RBL-738-002' },
      ],
    },
    {
      name: 'Burgundy Fitted Cap',
      description: 'Deep burgundy structured fitted with embroidered side panel detail. A rich colorway for those who know.',
      price: 1349,
      compareAtPrice: null,
      category: cat('Fitted Cap'),
      tags: ['fitted', 'burgundy', 'structured', 'embroidered'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      stock: 24,
      variants: [
        { color: 'Burgundy', colorHex: '#800020', size: '7',     stock: 6, sku: 'FIT-BRG-7-003' },
        { color: 'Burgundy', colorHex: '#800020', size: '7 1/8', stock: 6, sku: 'FIT-BRG-718-003' },
        { color: 'Burgundy', colorHex: '#800020', size: '7 1/4', stock: 6, sku: 'FIT-BRG-714-003' },
        { color: 'Burgundy', colorHex: '#800020', size: '7 3/8', stock: 6, sku: 'FIT-BRG-738-003' },
      ],
    },
    {
      name: 'Forest Green Fitted',
      description: 'Structured forest green fitted cap with tonal embroidery and grey underbrim. Outdoors meets the streets.',
      price: 1249,
      compareAtPrice: 1499,
      category: cat('Fitted Cap'),
      tags: ['fitted', 'green', 'forest', 'structured'],
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      stock: 28,
      variants: [
        { color: 'Forest Green', colorHex: '#228B22', size: '7',     stock: 7, sku: 'FIT-FGN-7-004' },
        { color: 'Forest Green', colorHex: '#228B22', size: '7 1/8', stock: 7, sku: 'FIT-FGN-718-004' },
        { color: 'Forest Green', colorHex: '#228B22', size: '7 1/4', stock: 7, sku: 'FIT-FGN-714-004' },
        { color: 'Forest Green', colorHex: '#228B22', size: '7 3/8', stock: 7, sku: 'FIT-FGN-738-004' },
      ],
    },
    {
      name: 'Wheat Fitted Cap',
      description: 'Natural wheat tan fitted cap with brown underbrim and tonal stitching. Earthy tones done right.',
      price: 1199,
      compareAtPrice: null,
      category: cat('Fitted Cap'),
      tags: ['fitted', 'wheat', 'tan', 'earthy'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      stock: 20,
      variants: [
        { color: 'Wheat', colorHex: '#F5DEB3', size: '7',     stock: 5, sku: 'FIT-WHT-7-005' },
        { color: 'Wheat', colorHex: '#F5DEB3', size: '7 1/8', stock: 5, sku: 'FIT-WHT-718-005' },
        { color: 'Wheat', colorHex: '#F5DEB3', size: '7 1/4', stock: 5, sku: 'FIT-WHT-714-005' },
        { color: 'Wheat', colorHex: '#F5DEB3', size: '7 3/8', stock: 5, sku: 'FIT-WHT-738-005' },
      ],
    },

    // ════════════════════════════════
    // DAD CAPS (5 products)
    // ════════════════════════════════
    {
      name: 'Vintage White Dad Cap',
      description: 'Unstructured soft-front dad cap in vintage white. Low profile with curved brim and brass buckle strap.',
      price: 799,
      compareAtPrice: null,
      category: cat('Dad Cap'),
      tags: ['dad cap', 'white', 'vintage', 'unstructured'],
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      stock: 65,
      variants: [
        { color: 'Vintage White', colorHex: '#F5F5DC', size: 'One Size', stock: 65, sku: 'DAD-WHT-001' },
      ],
    },
    {
      name: 'Faded Black Dad Cap',
      description: 'Stone-washed faded black dad cap with tonal stitching. Lived-in look straight out of the box.',
      price: 849,
      compareAtPrice: 999,
      category: cat('Dad Cap'),
      tags: ['dad cap', 'black', 'faded', 'washed'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      stock: 50,
      variants: [
        { color: 'Faded Black', colorHex: '#2C2C2C', size: 'One Size', stock: 50, sku: 'DAD-FBK-002' },
      ],
    },
    {
      name: 'Sage Green Dad Cap',
      description: 'Soft sage green unstructured dad cap with minimal embroidery. The everyday essential you reach for every morning.',
      price: 799,
      compareAtPrice: null,
      category: cat('Dad Cap'),
      tags: ['dad cap', 'sage', 'green', 'minimal'],
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      stock: 55,
      variants: [
        { color: 'Sage Green', colorHex: '#B2AC88', size: 'One Size', stock: 55, sku: 'DAD-SGN-003' },
      ],
    },
    {
      name: 'Camel Corduroy Dad Cap',
      description: 'Soft corduroy dad cap in warm camel. Unstructured six-panel with brass slider buckle. Texture meets minimalism.',
      price: 899,
      compareAtPrice: 1099,
      category: cat('Dad Cap'),
      tags: ['dad cap', 'camel', 'corduroy', 'texture'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      stock: 40,
      variants: [
        { color: 'Camel', colorHex: '#C19A6B', size: 'One Size', stock: 40, sku: 'DAD-CML-004' },
      ],
    },
    {
      name: 'Washed Navy Dad Cap',
      description: 'Lightly washed navy dad cap with faded finish and curved brim. Relaxed, effortless, and endlessly wearable.',
      price: 799,
      compareAtPrice: null,
      category: cat('Dad Cap'),
      tags: ['dad cap', 'navy', 'washed', 'relaxed'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      stock: 48,
      variants: [
        { color: 'Washed Navy', colorHex: '#2C3E6B', size: 'One Size', stock: 48, sku: 'DAD-WNV-005' },
      ],
    },

    // ════════════════════════════════
    // 5-PANEL (4 products)
    // ════════════════════════════════
    {
      name: 'Black 5-Panel Camp Cap',
      description: 'Minimal 5-panel camp cap in ripstop black. Flat unstructured crown with woven label. Skate heritage at its finest.',
      price: 899,
      compareAtPrice: null,
      category: cat('5-Panel'),
      tags: ['5-panel', 'black', 'camp', 'minimal', 'skate'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      stock: 40,
      variants: [
        { color: 'Black', colorHex: '#000000', size: 'One Size', stock: 40, sku: 'FVP-BLK-001' },
      ],
    },
    {
      name: 'Off-White 5-Panel',
      description: 'Clean off-white 5-panel with contrast navy seam tape and adjustable strap. Skate heritage for the modern era.',
      price: 949,
      compareAtPrice: 1099,
      category: cat('5-Panel'),
      tags: ['5-panel', 'off-white', 'navy', 'skate'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      stock: 30,
      variants: [
        { color: 'Off-White', colorHex: '#FAF9F6', size: 'One Size', stock: 30, sku: 'FVP-OWT-002' },
      ],
    },
    {
      name: 'Olive Ripstop 5-Panel',
      description: 'Military olive ripstop 5-panel with flat brim and clip buckle closure. Minimal meets utilitarian.',
      price: 999,
      compareAtPrice: null,
      category: cat('5-Panel'),
      tags: ['5-panel', 'olive', 'ripstop', 'utilitarian'],
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      stock: 35,
      variants: [
        { color: 'Olive', colorHex: '#4B5320', size: 'One Size', stock: 35, sku: 'FVP-OLV-003' },
      ],
    },
    {
      name: 'Grey Wool 5-Panel',
      description: 'Heathered grey wool-blend 5-panel with suede brim and leather strap. Premium materials for a refined camp cap.',
      price: 1199,
      compareAtPrice: 1399,
      category: cat('5-Panel'),
      tags: ['5-panel', 'grey', 'wool', 'premium', 'suede'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      stock: 22,
      variants: [
        { color: 'Heather Grey', colorHex: '#9E9E9E', size: 'One Size', stock: 22, sku: 'FVP-GRY-004' },
      ],
    },
  ];

  // Insert one by one so the pre-save slug hook fires on each document
  const inserted = [];
  for (const p of productData) {
    inserted.push(await Product.create(p));
  }
  console.log(`✅ ${inserted.length} products seeded`);

  // ── 3. ADMIN USER ────────────────────────────────────────────────
  await User.deleteMany({ role: 'admin' });
  await User.create({
    name: 'Capzyy Admin',
    email: 'admin@capzyy.com',
    password: 'capzyy@admin123',
    role: 'admin',
  });
  console.log('✅ Admin: admin@capzyy.com / capzyy@admin123');

  await mongoose.disconnect();
  console.log('🎉 Seeding complete!');
};

seed().catch(console.error);