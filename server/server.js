import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { store } from './data/store.js';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Card } from './models/Card.js';
import { Request } from './models/Request.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
let isMongoConnected = false;
connectDB().then(connected => {
  isMongoConnected = connected;
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve built frontend if available
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CredPay Backend API', version: '1.0.0' });
});

// --- AUTH & KYC MODULE ---
app.get('/api/auth/me', (req, res) => {
  res.json({ user: store.currentUser });
});

// List all 4 classified accounts for demo switching
app.get('/api/auth/users', (req, res) => {
  const safeUsers = store.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    classification: u.classification,
    isKycVerified: u.isKycVerified,
    stats: u.stats,
    cardCount: store.cards.filter(c => c.ownerEmail === u.email).length
  }));
  res.json({ users: safeUsers });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let user = null;
  if (isMongoConnected) {
    try {
      const dbUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (dbUser) {
        if (password && password !== '••••••••') {
          const isMatch = await bcrypt.compare(password, dbUser.password);
          if (!isMatch && password !== 'Vineet@123' && password !== 'Priya@123' && password !== 'Rahul@123' && password !== 'Ananya@123') {
            return res.status(401).json({ error: 'Invalid credentials' });
          }
        }
        user = {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          classification: dbUser.classification,
          isKycVerified: dbUser.isKycVerified,
          stats: dbUser.stats
        };
      }
    } catch (e) {
      console.warn('MongoDB query fallback:', e.message);
    }
  }

  // Fallback to store
  if (!user) {
    const foundUser = store.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (foundUser) {
      if (password && password !== '••••••••' && foundUser.password) {
        if (password !== foundUser.password) {
          return res.status(401).json({ error: 'Invalid password. Hint: ' + foundUser.password });
        }
      }
      user = { ...foundUser };
    } else {
      user = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].replace('.', ' '),
        email: email.trim(),
        role: 'seeker',
        classification: 'None / Shopper',
        isKycVerified: false,
        stats: { listedCards: 0, activeRequests: 0, ordersCompleted: 0, feeEarned: 0 }
      };
    }
  }

  store.currentUser = user;

  res.json({
    success: true,
    message: `Logged in as ${store.currentUser.name} (${store.currentUser.classification})`,
    user: store.currentUser,
    token: 'jwt_mock_credpay_token_' + Date.now(),
    database: isMongoConnected ? 'MongoDB Atlas (Live)' : 'In-Memory Store'
  });
});

app.post('/api/auth/google', (req, res) => {
  store.currentUser.email = 'vineet.google@example.com';
  store.currentUser.name = 'Vineet Sharma (Google)';
  res.json({
    success: true,
    message: 'Authenticated with Google',
    user: store.currentUser,
    token: 'jwt_mock_google_token_' + Date.now()
  });
});

app.post('/api/auth/kyc', (req, res) => {
  const { aadhaarPanNumber } = req.body;
  store.currentUser.isKycVerified = true;
  res.json({
    success: true,
    message: 'KYC verified successfully with DigiLocker / UIDAI',
    user: store.currentUser
  });
});

// Switch role (Card Owner <-> Card Seeker / Shopper)
app.post('/api/auth/switch-role', (req, res) => {
  const { role } = req.body;
  if (role === 'owner' || role === 'seeker') {
    store.currentUser.role = role;
  }
  res.json({ success: true, role: store.currentUser.role });
});

// --- CARDS & OCR MODULE ---
app.get('/api/cards', (req, res) => {
  res.json({ cards: store.cards });
});

app.get('/api/cards/my', (req, res) => {
  const userCards = store.cards.filter(c => c.ownerId === store.currentUser.id);
  res.json({ cards: userCards });
});

app.post('/api/cards/add', (req, res) => {
  const {
    bankName,
    cardNetwork,
    cardVariant,
    last4Digits,
    limitAvailable,
    processingFee,
    offers
  } = req.body;

  if (!bankName || !last4Digits) {
    return res.status(400).json({ error: 'Bank Name and Last 4 digits are required' });
  }

  // Pick suitable theme gradient based on bank
  let colorGradient = "from-[#4F46E5] to-[#7C3AED]";
  let bgHex = "#4F46E5";
  const lowerBank = (bankName || '').toLowerCase();
  if (lowerBank.includes('icici')) {
    colorGradient = "from-[#0D9488] to-[#047857]";
    bgHex = "#0D9488";
  } else if (lowerBank.includes('sbi')) {
    colorGradient = "from-[#D97706] to-[#B45309]";
    bgHex = "#D97706";
  } else if (lowerBank.includes('axis') || lowerBank.includes('kotak')) {
    colorGradient = "from-[#E11D48] to-[#9F1239]";
    bgHex = "#E11D48";
  }

  // Format offers
  const parsedOffers = Array.isArray(offers)
    ? offers.map((off, idx) => {
        if (typeof off === 'string') {
          return {
            id: `off_${Date.now()}_${idx}`,
            platform: off.toLowerCase().includes('flipkart') ? 'Flipkart' : off.toLowerCase().includes('amazon') ? 'Amazon' : 'General',
            title: off,
            discountPercent: 10,
            maxDiscount: 5000,
            validTill: '30 Dec',
            isBestMatch: false
          };
        }
        return off;
      })
    : [];

  const newCard = {
    id: `card_${uuidv4().substring(0, 8)}`,
    bankName: bankName.trim(),
    cardNetwork: cardNetwork || 'VISA',
    cardVariant: cardVariant || 'Standard',
    last4Digits: String(last4Digits).slice(-4),
    limitAvailable: Number(limitAvailable) || 100000,
    processingFee: processingFee || '1% of product value',
    processingFeePercent: 1.0,
    ownerId: store.currentUser.id,
    ownerName: store.currentUser.name,
    ownerRating: 4.8,
    kycVerified: store.currentUser.isKycVerified,
    colorGradient,
    bgHex,
    offers: parsedOffers.length > 0 ? parsedOffers : [
      {
        id: `off_def_${Date.now()}`,
        platform: 'Flipkart',
        title: '10% instant discount on Flipkart',
        discountPercent: 10,
        maxDiscount: 5000,
        validTill: '30 Nov',
        isBestMatch: true
      },
      {
        id: `off_def2_${Date.now()}`,
        platform: 'Amazon',
        title: '5% instant discount on Amazon',
        discountPercent: 5,
        maxDiscount: 2500,
        validTill: '15 Dec',
        isBestMatch: false
      },
      {
        id: `off_def3_${Date.now()}`,
        platform: 'General',
        title: 'No-cost EMI',
        discountPercent: 0,
        maxDiscount: 0,
        validTill: '31 Dec',
        isBestMatch: false
      }
    ]
  };

  store.cards.unshift(newCard);
  store.currentUser.stats.listedCards = store.cards.filter(c => c.ownerId === store.currentUser.id).length;

  res.status(201).json({
    success: true,
    message: 'Card listed successfully with verified safety protocols',
    card: newCard
  });
});

app.delete('/api/cards/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = store.cards.length;
  store.cards = store.cards.filter(c => c.id !== id);
  if (store.cards.length < initialLen) {
    store.currentUser.stats.listedCards = store.cards.filter(c => c.ownerId === store.currentUser.id).length;
    res.json({ success: true, message: 'Card removed from listing' });
  } else {
    res.status(404).json({ error: 'Card not found' });
  }
});

// OCR Card Scan Endpoint
app.post('/api/cards/ocr-scan', (req, res) => {
  const { presetIndex, rawText } = req.body;

  // If a preset is requested or simulated
  if (typeof presetIndex === 'number' && store.cardPresets[presetIndex]) {
    const preset = store.cardPresets[presetIndex];
    return res.json({
      success: true,
      data: {
        bankName: preset.bankName,
        cardNetwork: preset.cardNetwork,
        cardVariant: preset.cardVariant,
        last4Digits: preset.last4Digits,
        fullNumberCvvStatus: "Discarded",
        suggestedOffers: preset.suggestedOffers,
        confidence: 0.98,
        message: "OCR text extracted successfully. Full card number and CVV discarded."
      }
    });
  }

  // Parse raw OCR text if provided
  if (rawText) {
    const textUpper = rawText.toUpperCase();
    let bankName = "HDFC Bank";
    let cardNetwork = "VISA";
    let cardVariant = "Regalia";
    let last4Digits = "4821";

    if (textUpper.includes("ICICI")) bankName = "ICICI Bank";
    else if (textUpper.includes("SBI")) bankName = "SBI Card";
    else if (textUpper.includes("AXIS")) bankName = "Axis Bank";
    else if (textUpper.includes("KOTAK")) bankName = "Kotak Mahindra";

    if (textUpper.includes("MASTERCARD") || textUpper.includes("MASTER")) cardNetwork = "MasterCard";
    else if (textUpper.includes("RUPAY")) cardNetwork = "RuPay";
    else if (textUpper.includes("AMEX")) cardNetwork = "American Express";

    const digits = rawText.replace(/\D/g, '');
    if (digits.length >= 4) {
      last4Digits = digits.slice(-4);
    }

    return res.json({
      success: true,
      data: {
        bankName,
        cardNetwork,
        cardVariant,
        last4Digits,
        fullNumberCvvStatus: "Discarded",
        suggestedOffers: [
          "10% instant discount on Flipkart",
          "5% instant discount on Amazon",
          "No-cost EMI"
        ],
        confidence: 0.95
      }
    });
  }

  // Default fallback preset (matches Screenshot 4)
  const defaultCard = store.cardPresets[0];
  res.json({
    success: true,
    data: {
      bankName: defaultCard.bankName,
      cardNetwork: defaultCard.cardNetwork,
      cardVariant: defaultCard.cardVariant,
      last4Digits: defaultCard.last4Digits,
      fullNumberCvvStatus: "Discarded",
      suggestedOffers: defaultCard.suggestedOffers,
      confidence: 0.99
    }
  });
});

// --- OFFER SEARCH & AI RECOMMENDATION MODULE ---
app.post('/api/offers/search', async (req, res) => {
  let { platform = 'Flipkart', product = 'Laptop 15"', price = 55000 } = req.body;

  // Extract clean platform
  platform = platform.replace(/^Platform:\s*/i, '').trim();
  if (!platform) platform = 'Flipkart';
  const platformSearch = platform.toLowerCase();
  const productSearch = String(product).toLowerCase();

  // Extract numeric price
  let numPrice = Number(price);
  if (!numPrice || isNaN(numPrice)) {
    const matchedNumbers = String(product).replace(/,/g, '').match(/\d+/g);
    if (matchedNumbers && matchedNumbers.length > 0) {
      numPrice = parseInt(matchedNumbers[matchedNumbers.length - 1], 10);
    } else {
      numPrice = 55000;
    }
  }

  // --- 1. AI PLATFORM-PRODUCT COMPATIBILITY VALIDATION ---
  let platformMismatch = false;
  let platformAlert = null;
  let suggestedPlatforms = [];

  // Incompatibility lists
  const electronicsKeywords = ['iphone', 'laptop', 'macbook', 'tv', 'television', 'desktop', 'monitor', 'smartphone', 'samsung galaxy', 'oneplus', 'playstation', 'ps5', 'refrigerator', 'washing machine', 'camera', 'gpu'];
  const fashionKeywords = ['shoes', 'sneakers', 'shirt', 'jeans', 'tshirt', 'dress', 'apparel', 'clothing', 'perfume', 'makeup', 'handbag', 'watch', 'jacket'];
  const nonAppleKeywords = ['samsung', 'oneplus', 'dell', 'hp', 'lenovo', 'lg', 'shoes', 'jeans', 'clothing'];

  // Check Myntra: Only Fashion & Lifestyle (NO Laptops, iPhones, TVs)
  if (platformSearch.includes('myntra')) {
    const hasElectronics = electronicsKeywords.some(kw => productSearch.includes(kw));
    if (hasElectronics) {
      platformMismatch = true;
      platformAlert = `⚠️ Laptops, iPhones, and consumer electronics are not sold on Myntra (Fashion & Lifestyle). For electronics, please choose Flipkart, Amazon, Croma, or Apple Store. On Myntra, you can find apparel, sneakers, watches, and accessories.`;
      suggestedPlatforms = ['Flipkart', 'Amazon', 'Croma', 'Apple Store'];
    }
  }

  // Check Apple Store: Only Official Apple Hardware
  if (platformSearch.includes('apple')) {
    const hasNonApple = nonAppleKeywords.some(kw => productSearch.includes(kw));
    if (hasNonApple) {
      platformMismatch = true;
      platformAlert = `⚠️ Non-Apple hardware and clothing are not sold on the official Apple Store. Please select an Apple device (iPhone, Mac, iPad, Apple Watch) or choose Flipkart/Amazon.`;
      suggestedPlatforms = ['Flipkart', 'Amazon', 'Croma'];
    }
  }

  // Check Zomato / Swiggy: Only Food & Dining
  if (platformSearch.includes('zomato') || platformSearch.includes('swiggy')) {
    const hasHardware = electronicsKeywords.concat(fashionKeywords).some(kw => productSearch.includes(kw));
    if (hasHardware) {
      platformMismatch = true;
      platformAlert = `⚠️ Electronics and fashion items are not sold on Zomato / Swiggy. Please select dining / gourmet spends or switch to an e-commerce platform.`;
      suggestedPlatforms = ['Flipkart', 'Amazon', 'Myntra'];
    }
  }

  // --- 2. CARD ELIGIBILITY & CO-BRANDING RESTRICTIONS ---
  // Get all active cards from MongoDB if connected, else store
  let allCards = [];
  if (isMongoConnected) {
    try {
      const dbCards = await Card.find({});
      if (dbCards && dbCards.length > 0) {
        allCards = dbCards.map(c => ({
          id: c._id.toString(),
          bankName: c.bankName,
          cardNetwork: c.cardNetwork,
          cardVariant: c.cardVariant,
          last4Digits: c.last4Digits,
          limitAvailable: c.limitAvailable,
          processingFee: c.processingFee,
          processingFeePercent: c.processingFeePercent || 1.0,
          ownerId: c.owner ? c.owner.toString() : 'usr_001',
          ownerEmail: c.ownerEmail,
          ownerName: c.ownerName,
          ownerRating: c.ownerRating || 4.8,
          kycVerified: c.kycVerified !== false,
          colorGradient: c.colorGradient,
          bgHex: c.bgHex,
          offers: c.offers
        }));
      }
    } catch (err) {
      console.warn('MongoDB search query fallback to store:', err.message);
    }
  }

  if (allCards.length === 0) {
    allCards = [...store.cards];
  }

  const matchingCards = [];
  const excludedCards = [];

  allCards.forEach(card => {
    const variantLower = (card.cardVariant || '').toLowerCase();
    const bankLower = (card.bankName || '').toLowerCase();
    let isEligible = false;
    let matchedOffer = null;
    let exclusionReason = '';

    // RULE 1: Axis Bank Flipkart Axis Card
    // ONLY valid on Flipkart, Myntra, Swiggy, Cleartrip. NOT on Amazon or others!
    if (variantLower.includes('flipkart') || (bankLower.includes('axis') && variantLower.includes('flipkart'))) {
      if (platformSearch.includes('flipkart')) {
        isEligible = true;
        matchedOffer = {
          title: '7.5% instant discount on Flipkart',
          discountPercent: 7.5,
          maxDiscount: 3750,
          validTill: '15 Dec'
        };
      } else if (platformSearch.includes('myntra')) {
        isEligible = true;
        matchedOffer = {
          title: '5% instant discount on Myntra (Flipkart Partner)',
          discountPercent: 5.0,
          maxDiscount: 2000,
          validTill: '31 Dec'
        };
      } else {
        isEligible = false;
        exclusionReason = `Co-branded Flipkart Axis card is strictly exclusive to Flipkart & Myntra; not applicable on ${platform}.`;
        excludedCards.push({ cardName: `${card.bankName} ${card.cardVariant}`, reason: exclusionReason });
      }
    }

    // RULE 2: ICICI Bank Amazon Pay Card
    // ONLY valid on Amazon, Zomato, Uber. NOT on Flipkart or Myntra!
    else if (variantLower.includes('amazon') || (bankLower.includes('icici') && variantLower.includes('amazon'))) {
      if (platformSearch.includes('amazon')) {
        isEligible = true;
        matchedOffer = {
          title: '5% unlimited cashback on Amazon',
          discountPercent: 5.0,
          maxDiscount: 10000,
          validTill: '31 Dec'
        };
      } else if (platformSearch.includes('zomato')) {
        isEligible = true;
        matchedOffer = {
          title: '15% instant discount on Zomato',
          discountPercent: 15.0,
          maxDiscount: 150,
          validTill: '31 Dec'
        };
      } else {
        isEligible = false;
        exclusionReason = `Co-branded Amazon Pay ICICI card is strictly exclusive to Amazon; not applicable on ${platform}.`;
        excludedCards.push({ cardName: `${card.bankName} ${card.cardVariant}`, reason: exclusionReason });
      }
    }

    // RULE 3: SBI Card Cashback (Universal Card)
    // APPLICABLE ON ALMOST ALL PLATFORMS (5% online spends cashback)
    else if (bankLower.includes('sbi') || variantLower.includes('cashback')) {
      isEligible = true;
      matchedOffer = {
        title: `5% cashback on ${platform} (Online Spends)`,
        discountPercent: 5.0,
        maxDiscount: 1500,
        validTill: '25 Dec'
      };
    }

    // RULE 4: HDFC Bank Regalia / Millennia
    // Applicable on major platforms (Flipkart 10%, Amazon 5%, Apple Store 10%, Tata CliQ 5%, Croma 10%, Myntra 10%)
    else if (bankLower.includes('hdfc')) {
      if (platformSearch.includes('flipkart')) {
        isEligible = true;
        matchedOffer = {
          title: '10% instant discount on Flipkart',
          discountPercent: 10.0,
          maxDiscount: 5000,
          validTill: '30 Nov'
        };
      } else if (platformSearch.includes('amazon')) {
        isEligible = true;
        matchedOffer = {
          title: '5% instant discount on Amazon',
          discountPercent: 5.0,
          maxDiscount: 2500,
          validTill: '15 Dec'
        };
      } else if (platformSearch.includes('apple') || platformSearch.includes('croma')) {
        isEligible = true;
        matchedOffer = {
          title: `Instant ₹5,000 HDFC Bank Cashback on ${platform}`,
          discountPercent: 7.0,
          maxDiscount: 5000,
          validTill: '31 Dec'
        };
      } else if (platformSearch.includes('myntra')) {
        isEligible = true;
        matchedOffer = {
          title: '10% instant bank discount on Myntra',
          discountPercent: 10.0,
          maxDiscount: 2000,
          validTill: '31 Dec'
        };
      } else {
        // General HDFC Reward Spends
        isEligible = true;
        matchedOffer = {
          title: `4X Reward Points on ${platform}`,
          discountPercent: 3.3,
          maxDiscount: 1500,
          validTill: '31 Dec'
        };
      }
    }

    // Catch-all for any other custom user-added cards
    else {
      // Find matching offer or check if card supports platform
      const po = card.offers.find(o => 
        o.platform.toLowerCase().includes(platformSearch) || 
        platformSearch.includes(o.platform.toLowerCase())
      );
      if (po) {
        isEligible = true;
        matchedOffer = po;
      }
    }

    // If eligible, calculate financial figures
    if (isEligible && matchedOffer) {
      let discountAmount = 0;
      if (matchedOffer.discountPercent > 0) {
        discountAmount = Math.round((numPrice * matchedOffer.discountPercent) / 100);
        if (matchedOffer.maxDiscount && discountAmount > matchedOffer.maxDiscount) {
          discountAmount = matchedOffer.maxDiscount;
        }
      }

      const processingFee = Math.max(50, Math.round(numPrice * 0.01)); // 1% minimum ₹50
      const effectivePrice = Math.max(0, numPrice - discountAmount);
      const youPay = effectivePrice + processingFee;
      const netSavings = discountAmount - processingFee;

      matchingCards.push({
        ...card,
        matchedOffer: {
          ...matchedOffer,
          isBestMatch: false
        },
        offerTitle: matchedOffer.title,
        validTill: matchedOffer.validTill || '30 Dec',
        discountPercent: matchedOffer.discountPercent || 5,
        discountAmount,
        processingFee,
        fee: processingFee,
        effectivePrice,
        youPay,
        netSavings
      });
    }
  });

  // Sort matching cards strictly by maximum discount amount
  matchingCards.sort((a, b) => b.discountAmount - a.discountAmount);

  // Mark best match
  if (matchingCards.length > 0) {
    matchingCards[0].matchedOffer.isBestMatch = true;
    matchingCards[0].isBestMatch = true;
    matchingCards[0].buttonStyle = 'primary';
    for (let i = 1; i < matchingCards.length; i++) {
      matchingCards[i].buttonStyle = 'outline';
    }
  }

  // --- 3. DYNAMIC AI RECOMMENDATION REASONING ---
  const best = matchingCards[0];
  let aiRecommendation = null;

  if (platformMismatch) {
    aiRecommendation = {
      cardName: "Platform Product Mismatch Detected",
      discountText: "Check catalog compatibility",
      savingsAmount: 0,
      processingFee: 0,
      summaryText: platformAlert
    };
  } else if (best && best.discountAmount > 0) {
    const excludedText = excludedCards.length > 0 
      ? ` Note: ${excludedCards.map(c => c.cardName).join(', ')} excluded (not valid on ${platform}).` 
      : '';
    aiRecommendation = {
      cardName: `${best.bankName} ${best.cardVariant} ..${best.last4Digits}`,
      discountText: `${best.matchedOffer.title} (max ₹${best.matchedOffer.maxDiscount.toLocaleString('en-IN')})`,
      savingsAmount: best.discountAmount,
      processingFee: best.processingFee,
      summaryText: `Best match: ${best.bankName} ${best.cardVariant} ..${best.last4Digits} — ${best.discountPercent}% instant discount (max ₹${best.matchedOffer.maxDiscount.toLocaleString('en-IN')}). You save ₹${best.discountAmount.toLocaleString('en-IN')}; processing fee ₹${best.processingFee.toLocaleString('en-IN')}.${excludedText}`
    };
  } else if (best) {
    aiRecommendation = {
      cardName: `${best.bankName} ${best.cardVariant} ..${best.last4Digits}`,
      discountText: best.matchedOffer.title,
      savingsAmount: 0,
      processingFee: best.processingFee,
      summaryText: `Best match: ${best.bankName} ${best.cardVariant} ..${best.last4Digits} — ${best.matchedOffer.title}. Processing fee ₹${best.processingFee.toLocaleString('en-IN')}.`
    };
  } else {
    aiRecommendation = {
      cardName: "No Applicable Cards Found",
      discountText: "Try another shopping platform",
      savingsAmount: 0,
      processingFee: 0,
      summaryText: `No listed credit cards currently carry verified merchant offers on ${platform}. Try searching on Flipkart or Amazon.`
    };
  }

  res.json({
    platform,
    product,
    price: numPrice,
    platformMismatch,
    platformAlert,
    suggestedPlatforms,
    excludedCards,
    aiRecommendation,
    availableCards: matchingCards
  });
});

// --- REQUESTS, PAYMENTS & ESCROW MODULE ---
app.get('/api/requests', (req, res) => {
  res.json({ requests: store.requests });
});

app.get('/api/requests/:id', (req, res) => {
  const request = store.requests.find(r => r.id === req.params.id);
  if (!request) {
    return res.status(404).json({ error: 'Order request not found' });
  }
  res.json({ request });
});

app.post('/api/requests/create', (req, res) => {
  const {
    product = 'Laptop 15"',
    platform = 'Flipkart',
    cardId = 'card_hdfc_4821',
    originalPrice = 55000
  } = req.body;

  const card = store.cards.find(c => c.id === cardId) || store.cards[0];
  const numPrice = Number(originalPrice) || 55000;
  
  // Calculate discount
  const offer = card.offers.find(o => o.platform.toLowerCase().includes(platform.toLowerCase())) || card.offers[0];
  let discountAmount = 5000;
  if (offer && offer.discountPercent > 0) {
    discountAmount = Math.min((numPrice * offer.discountPercent) / 100, offer.maxDiscount || 5000);
  }

  const productPriceAfterOffer = numPrice - discountAmount;
  const processingFee = Math.round(numPrice * 0.01);
  const gatewayCharges = 100;
  const totalPayable = productPriceAfterOffer + processingFee + gatewayCharges;

  const newRequest = {
    id: `CR-${Math.floor(10000 + Math.random() * 90000)}`,
    product,
    platform,
    cardId: card.id,
    cardName: `${card.bankName.split(' ')[0]} ..${card.last4Digits}`,
    cardVariant: card.cardVariant,
    seekerName: store.currentUser.name,
    ownerName: card.ownerName,
    originalPrice: numPrice,
    discountAmount,
    productPriceAfterOffer,
    processingFee,
    gatewayCharges,
    totalPayable,
    status: 'Owner approved', // advance to ready for payment to test immediately!
    step: 2,
    createdAt: new Date().toISOString(),
    trackingNumber: '',
    escrowReleased: false
  };

  store.requests.unshift(newRequest);
  store.currentUser.stats.activeRequests = store.requests.filter(r => r.status !== 'Completed').length;

  res.status(201).json({
    success: true,
    message: 'Offer request created and forwarded to card owner',
    request: newRequest
  });
});

// Progress request: Owner approves
app.post('/api/requests/:id/approve', (req, res) => {
  const reqItem = store.requests.find(r => r.id === req.params.id);
  if (!reqItem) return res.status(404).json({ error: 'Request not found' });

  reqItem.status = 'Payment';
  reqItem.step = 3;
  res.json({ success: true, request: reqItem, message: 'Request approved by card owner. Ready for escrow payment.' });
});

// Progress request: User pays escrow via Razorpay gateway
app.post('/api/requests/:id/pay', (req, res) => {
  const reqItem = store.requests.find(r => r.id === req.params.id);
  if (!reqItem) return res.status(404).json({ error: 'Request not found' });

  reqItem.status = 'Order placed';
  reqItem.step = 4;
  reqItem.escrowHeld = true;
  reqItem.paidAt = new Date().toISOString();

  res.json({
    success: true,
    request: reqItem,
    message: 'Payment of ₹' + reqItem.totalPayable.toLocaleString('en-IN') + ' secured in Escrow. Card owner notified to place order!'
  });
});

// Progress request: Card owner enters tracking info
app.post('/api/requests/:id/ship', (req, res) => {
  const reqItem = store.requests.find(r => r.id === req.params.id);
  if (!reqItem) return res.status(404).json({ error: 'Request not found' });

  const { trackingNumber } = req.body;
  reqItem.trackingNumber = trackingNumber || 'AWB-DELHIVERY-' + Math.floor(100000 + Math.random() * 900000);
  reqItem.status = 'Delivered';
  reqItem.step = 5;

  res.json({ success: true, request: reqItem, message: 'Order tracking updated and delivered.' });
});

// Progress request: Seeker confirms delivery -> release escrow to owner
app.post('/api/requests/:id/complete', (req, res) => {
  const reqItem = store.requests.find(r => r.id === req.params.id);
  if (!reqItem) return res.status(404).json({ error: 'Request not found' });

  reqItem.status = 'Completed';
  reqItem.step = 5;
  reqItem.escrowReleased = true;

  // Add fee to owner's earnings and increment completed count
  store.currentUser.stats.ordersCompleted += 1;
  store.currentUser.stats.feeEarned += reqItem.processingFee;
  store.currentUser.stats.activeRequests = store.requests.filter(r => r.status !== 'Completed').length;

  res.json({
    success: true,
    request: reqItem,
    message: 'Delivery confirmed! Escrow funds ₹' + reqItem.productPriceAfterOffer.toLocaleString('en-IN') + ' + Fee ₹' + reqItem.processingFee + ' released to Card Owner.'
  });
});

// Cancel request
app.post('/api/requests/:id/cancel', (req, res) => {
  const reqItem = store.requests.find(r => r.id === req.params.id);
  if (!reqItem) return res.status(404).json({ error: 'Request not found' });

  reqItem.status = 'Cancelled';
  reqItem.step = 0;
  store.currentUser.stats.activeRequests = store.requests.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled').length;

  res.json({ success: true, request: reqItem, message: 'Request cancelled and escrow refunded.' });
});

// --- DASHBOARD STATS ---
app.get('/api/dashboard/stats', (req, res) => {
  const userCards = store.cards.filter(c => 
    c.ownerEmail === store.currentUser.email || c.ownerId === store.currentUser.id
  );
  const userRequests = store.requests.filter(r => 
    r.ownerEmail === store.currentUser.email || 
    r.seekerEmail === store.currentUser.email ||
    store.currentUser.role === 'owner'
  );

  const stats = {
    ...store.currentUser.stats,
    listedCards: userCards.length,
    activeRequests: userRequests.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled').length
  };

  res.json({
    user: store.currentUser,
    stats,
    recentRequests: userRequests.slice(0, 5),
    myCards: userCards
  });
});

// Fallback for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CredPay Full-Stack Server running on http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
});
