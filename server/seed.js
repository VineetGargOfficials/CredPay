import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Card } from './models/Card.js';
import { Request } from './models/Request.js';

dotenv.config();

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/credpay';

// Allow passing cluster URL via command line argument: node seed.js cluster0.xxxx.mongodb.net
const argCluster = process.argv[2];
if (argCluster) {
  if (argCluster.startsWith('mongodb')) {
    MONGODB_URI = argCluster;
  } else {
    MONGODB_URI = `mongodb+srv://contactvineetgarg_db_user:QMti1kyuEwY48eOS@${argCluster}/credpay?retryWrites=true&w=majority`;
  }
}

export const seedDatabase = async () => {
  if (MONGODB_URI.includes('<CLUSTER_ADDRESS>')) {
    console.log('⚠️  Notice: MongoDB Atlas username (contactvineetgarg_db_user) and password are set!');
    console.log('👉 Please provide your cluster host name to complete connection.');
    console.log('Usage:');
    console.log('  node seed.js <cluster-hostname>');
    console.log('Example:');
    console.log('  node seed.js cluster0.abcde.mongodb.net');
    process.exit(1);
  }
  try {
    console.log(`⏳ Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
    console.log('✅ Connected to MongoDB.');

    // Clear existing
    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Card.deleteMany({});
    await Request.deleteMany({});

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashVineet = await bcrypt.hash('Vineet@123', salt);
    const hashPriya = await bcrypt.hash('Priya@123', salt);
    const hashRahul = await bcrypt.hash('Rahul@123', salt);
    const hashAnanya = await bcrypt.hash('Ananya@123', salt);

    // 1. Create 4 classified users
    console.log('👤 Inserting 4 classified user accounts...');
    const users = await User.insertMany([
      {
        name: 'Vineet Sharma',
        email: 'vineet@example.com',
        password: hashVineet,
        role: 'owner',
        classification: 'Multiple Cards',
        isKycVerified: true,
        stats: {
          listedCards: 3,
          activeRequests: 5,
          ordersCompleted: 18,
          feeEarned: 4250
        }
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: hashPriya,
        role: 'owner',
        classification: 'One Card',
        isKycVerified: true,
        stats: {
          listedCards: 1,
          activeRequests: 1,
          ordersCompleted: 4,
          feeEarned: 1200
        }
      },
      {
        name: 'Rahul Verma',
        email: 'rahul@example.com',
        password: hashRahul,
        role: 'seeker',
        classification: 'None / Shopper',
        isKycVerified: true,
        stats: {
          listedCards: 0,
          activeRequests: 2,
          ordersCompleted: 3,
          feeEarned: 0
        }
      },
      {
        name: 'Ananya Singh',
        email: 'ananya@example.com',
        password: hashAnanya,
        role: 'seeker',
        classification: 'None / New User',
        isKycVerified: false,
        stats: {
          listedCards: 0,
          activeRequests: 0,
          ordersCompleted: 0,
          feeEarned: 0
        }
      }
    ]);

    const vineetUser = users[0];
    const priyaUser = users[1];
    const rahulUser = users[2];

    // 2. Insert Cards
    console.log('💳 Inserting Cards for Vineet (3 cards) and Priya (1 card)...');
    const cards = await Card.insertMany([
      {
        bankName: 'HDFC Bank',
        cardNetwork: 'VISA',
        cardVariant: 'Regalia',
        last4Digits: '4821',
        limitAvailable: 150000,
        processingFee: '1% of product value',
        processingFeePercent: 1.0,
        owner: vineetUser._id,
        ownerEmail: vineetUser.email,
        ownerName: vineetUser.name,
        ownerRating: 4.8,
        kycVerified: true,
        colorGradient: 'from-[#4F46E5] to-[#7C3AED]',
        bgHex: '#4F46E5',
        offers: [
          {
            platform: 'Flipkart',
            title: '10% instant discount on Flipkart',
            discountPercent: 10,
            maxDiscount: 5000,
            validTill: '30 Nov',
            isBestMatch: true
          },
          {
            platform: 'Amazon',
            title: '5% instant discount on Amazon',
            discountPercent: 5,
            maxDiscount: 2500,
            validTill: '15 Dec',
            isBestMatch: false
          },
          {
            platform: 'General',
            title: 'No-cost EMI',
            discountPercent: 0,
            maxDiscount: 0,
            validTill: '31 Dec',
            isBestMatch: false
          }
        ]
      },
      {
        bankName: 'ICICI Bank',
        cardNetwork: 'VISA',
        cardVariant: 'Amazon Pay',
        last4Digits: '7302',
        limitAvailable: 200000,
        processingFee: '1% of product value',
        processingFeePercent: 1.0,
        owner: vineetUser._id,
        ownerEmail: vineetUser.email,
        ownerName: vineetUser.name,
        ownerRating: 4.9,
        kycVerified: true,
        colorGradient: 'from-[#0D9488] to-[#047857]',
        bgHex: '#0D9488',
        offers: [
          {
            platform: 'Amazon',
            title: '5% unlimited cashback on Amazon',
            discountPercent: 5,
            maxDiscount: 10000,
            validTill: '31 Dec',
            isBestMatch: false
          },
          {
            platform: 'Flipkart',
            title: '5% instant discount on Flipkart',
            discountPercent: 5,
            maxDiscount: 2000,
            validTill: '20 Dec',
            isBestMatch: false
          }
        ]
      },
      {
        bankName: 'SBI Card',
        cardNetwork: 'MasterCard',
        cardVariant: 'Cashback',
        last4Digits: '1190',
        limitAvailable: 80000,
        processingFee: '1% of product value',
        processingFeePercent: 1.0,
        owner: vineetUser._id,
        ownerEmail: vineetUser.email,
        ownerName: vineetUser.name,
        ownerRating: 4.7,
        kycVerified: true,
        colorGradient: 'from-[#D97706] to-[#B45309]',
        bgHex: '#D97706',
        offers: [
          {
            platform: 'Flipkart',
            title: '5% cashback on Flipkart',
            discountPercent: 5,
            maxDiscount: 1500,
            validTill: '25 Dec',
            isBestMatch: false
          },
          {
            platform: 'Amazon',
            title: '5% cashback on online spends',
            discountPercent: 5,
            maxDiscount: 1500,
            validTill: '31 Dec',
            isBestMatch: false
          }
        ]
      },
      {
        bankName: 'Axis Bank',
        cardNetwork: 'VISA',
        cardVariant: 'Flipkart Axis',
        last4Digits: '6034',
        limitAvailable: 120000,
        processingFee: '1% of product value',
        processingFeePercent: 1.0,
        owner: priyaUser._id,
        ownerEmail: priyaUser.email,
        ownerName: priyaUser.name,
        ownerRating: 4.6,
        kycVerified: true,
        colorGradient: 'from-[#E11D48] to-[#9F1239]',
        bgHex: '#E11D48',
        offers: [
          {
            platform: 'Flipkart',
            title: '7.5% instant discount on Flipkart',
            discountPercent: 7.5,
            maxDiscount: 3750,
            validTill: '15 Dec',
            isBestMatch: false
          }
        ]
      }
    ]);

    // 3. Insert Requests
    console.log('📦 Inserting sample escrow requests and orders...');
    await Request.insertMany([
      {
        orderId: 'CR-10428',
        product: 'Laptop 15"',
        platform: 'Flipkart',
        cardId: cards[0]._id.toString(),
        cardName: 'HDFC ..4821',
        cardVariant: 'Regalia',
        seekerEmail: rahulUser.email,
        seekerName: rahulUser.name,
        ownerEmail: vineetUser.email,
        ownerName: vineetUser.name,
        originalPrice: 55000,
        discountAmount: 5000,
        productPriceAfterOffer: 50000,
        processingFee: 500,
        gatewayCharges: 100,
        totalPayable: 50600,
        status: 'Payment',
        step: 3,
        trackingNumber: '',
        escrowReleased: false
      },
      {
        orderId: 'CR-10427',
        product: 'Smartphone',
        platform: 'Amazon',
        cardId: cards[1]._id.toString(),
        cardName: 'ICICI ..7302',
        cardVariant: 'Amazon Pay',
        seekerEmail: 'amit@example.com',
        seekerName: 'Amit Kumar',
        ownerEmail: vineetUser.email,
        ownerName: vineetUser.name,
        originalPrice: 30000,
        discountAmount: 1500,
        productPriceAfterOffer: 28500,
        processingFee: 300,
        gatewayCharges: 60,
        totalPayable: 28860,
        status: 'Completed',
        step: 5,
        trackingNumber: 'AWB-AMZ-998124',
        escrowReleased: true
      },
      {
        orderId: 'CR-10426',
        product: 'Headphones',
        platform: 'Flipkart',
        cardId: cards[2]._id.toString(),
        cardName: 'SBI ..1190',
        cardVariant: 'Cashback',
        seekerEmail: 'neha@example.com',
        seekerName: 'Neha Gupta',
        ownerEmail: vineetUser.email,
        ownerName: vineetUser.name,
        originalPrice: 12000,
        discountAmount: 600,
        productPriceAfterOffer: 11400,
        processingFee: 120,
        gatewayCharges: 25,
        totalPayable: 11545,
        status: 'Approved',
        step: 2,
        trackingNumber: '',
        escrowReleased: false
      }
    ]);

    console.log('🎉 MongoDB Seed completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Login credentials created:');
    console.log('1. Vineet Sharma (Multiple Cards): vineet@example.com / Vineet@123');
    console.log('2. Priya Patel   (One Card):       priya@example.com / Priya@123');
    console.log('3. Rahul Verma   (None / Shopper): rahul@example.com / Rahul@123');
    console.log('4. Ananya Singh  (None / New):     ananya@example.com / Ananya@123');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Seed Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
