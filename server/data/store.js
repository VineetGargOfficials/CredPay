// In-memory data store with 4 classified users matching CredPay specifications
export const store = {
  // 4 Classified Users
  users: [
    {
      id: "usr_001",
      name: "Vineet Sharma",
      email: "vineet@example.com",
      password: "Vineet@123",
      role: "owner",
      classification: "Multiple Cards",
      isKycVerified: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      stats: {
        listedCards: 3,
        activeRequests: 5,
        ordersCompleted: 18,
        feeEarned: 4250
      }
    },
    {
      id: "usr_002",
      name: "Priya Patel",
      email: "priya@example.com",
      password: "Priya@123",
      role: "owner",
      classification: "One Card",
      isKycVerified: true,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
      stats: {
        listedCards: 1,
        activeRequests: 1,
        ordersCompleted: 4,
        feeEarned: 1200
      }
    },
    {
      id: "usr_003",
      name: "Rahul Verma",
      email: "rahul@example.com",
      password: "Rahul@123",
      role: "seeker",
      classification: "None / Shopper",
      isKycVerified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      stats: {
        listedCards: 0,
        activeRequests: 2,
        ordersCompleted: 3,
        feeEarned: 0
      }
    },
    {
      id: "usr_004",
      name: "Ananya Singh",
      email: "ananya@example.com",
      password: "Ananya@123",
      role: "seeker",
      classification: "None / New User",
      isKycVerified: false,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80",
      stats: {
        listedCards: 0,
        activeRequests: 0,
        ordersCompleted: 0,
        feeEarned: 0
      }
    }
  ],

  // Current session user (default Vineet)
  currentUser: {
    id: "usr_001",
    name: "Vineet Sharma",
    email: "vineet@example.com",
    password: "Vineet@123",
    role: "owner",
    classification: "Multiple Cards",
    isKycVerified: true,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    stats: {
      listedCards: 3,
      activeRequests: 5,
      ordersCompleted: 18,
      feeEarned: 4250
    }
  },

  cards: [
    {
      id: "card_hdfc_4821",
      bankName: "HDFC Bank",
      cardNetwork: "VISA",
      cardVariant: "Regalia",
      last4Digits: "4821",
      limitAvailable: 150000,
      processingFee: "1% of product value",
      processingFeePercent: 1.0,
      ownerId: "usr_001",
      ownerEmail: "vineet@example.com",
      ownerName: "Vineet Sharma",
      ownerRating: 4.8,
      kycVerified: true,
      colorGradient: "from-[#4F46E5] to-[#7C3AED]",
      bgHex: "#4F46E5",
      offers: [
        {
          id: "off_1",
          platform: "Flipkart",
          title: "10% instant discount on Flipkart",
          discountPercent: 10,
          maxDiscount: 5000,
          validTill: "30 Nov",
          isBestMatch: true
        },
        {
          id: "off_2",
          platform: "Amazon",
          title: "5% instant discount on Amazon",
          discountPercent: 5,
          maxDiscount: 2500,
          validTill: "15 Dec",
          isBestMatch: false
        },
        {
          id: "off_3",
          platform: "General",
          title: "No-cost EMI",
          discountPercent: 0,
          maxDiscount: 0,
          validTill: "31 Dec",
          isBestMatch: false
        }
      ]
    },
    {
      id: "card_icici_7302",
      bankName: "ICICI Bank",
      cardNetwork: "VISA",
      cardVariant: "Amazon Pay",
      last4Digits: "7302",
      limitAvailable: 200000,
      processingFee: "1% of product value",
      processingFeePercent: 1.0,
      ownerId: "usr_001",
      ownerEmail: "vineet@example.com",
      ownerName: "Vineet Sharma",
      ownerRating: 4.9,
      kycVerified: true,
      colorGradient: "from-[#0D9488] to-[#047857]",
      bgHex: "#0D9488",
      offers: [
        {
          id: "off_4",
          platform: "Amazon",
          title: "5% unlimited cashback on Amazon",
          discountPercent: 5,
          maxDiscount: 10000,
          validTill: "31 Dec",
          isBestMatch: false
        },
        {
          id: "off_5",
          platform: "Flipkart",
          title: "5% instant discount on Flipkart",
          discountPercent: 5,
          maxDiscount: 2000,
          validTill: "20 Dec",
          isBestMatch: false
        }
      ]
    },
    {
      id: "card_sbi_1190",
      bankName: "SBI Card",
      cardNetwork: "MasterCard",
      cardVariant: "Cashback",
      last4Digits: "1190",
      limitAvailable: 80000,
      processingFee: "1% of product value",
      processingFeePercent: 1.0,
      ownerId: "usr_001",
      ownerEmail: "vineet@example.com",
      ownerName: "Vineet Sharma",
      ownerRating: 4.7,
      kycVerified: true,
      colorGradient: "from-[#D97706] to-[#B45309]",
      bgHex: "#D97706",
      offers: [
        {
          id: "off_6",
          platform: "Flipkart",
          title: "5% cashback on Flipkart",
          discountPercent: 5,
          maxDiscount: 1500,
          validTill: "25 Dec",
          isBestMatch: false
        },
        {
          id: "off_7",
          platform: "Amazon",
          title: "5% cashback on online spends",
          discountPercent: 5,
          maxDiscount: 1500,
          validTill: "31 Dec",
          isBestMatch: false
        }
      ]
    },
    {
      id: "card_axis_6034",
      bankName: "Axis Bank",
      cardNetwork: "VISA",
      cardVariant: "Flipkart Axis",
      last4Digits: "6034",
      limitAvailable: 120000,
      processingFee: "1% of product value",
      processingFeePercent: 1.0,
      ownerId: "usr_002",
      ownerEmail: "priya@example.com",
      ownerName: "Priya Patel",
      ownerRating: 4.6,
      kycVerified: true,
      colorGradient: "from-[#E11D48] to-[#9F1239]",
      bgHex: "#E11D48",
      offers: [
        {
          id: "off_8",
          platform: "Flipkart",
          title: "7.5% instant discount on Flipkart",
          discountPercent: 7.5,
          maxDiscount: 3750,
          validTill: "15 Dec",
          isBestMatch: false
        }
      ]
    }
  ],

  requests: [
    {
      id: "CR-10428",
      product: "Laptop 15\"",
      platform: "Flipkart",
      cardId: "card_hdfc_4821",
      cardName: "HDFC ..4821",
      cardVariant: "Regalia",
      seekerEmail: "rahul@example.com",
      seekerName: "Rahul Verma",
      ownerEmail: "vineet@example.com",
      ownerName: "Vineet Sharma",
      originalPrice: 55000,
      discountAmount: 5000,
      productPriceAfterOffer: 50000,
      processingFee: 500,
      gatewayCharges: 100,
      totalPayable: 50600,
      status: "Payment",
      step: 3,
      createdAt: "2026-11-20T10:30:00.000Z",
      trackingNumber: "",
      escrowReleased: false
    },
    {
      id: "CR-10427",
      product: "Smartphone",
      platform: "Amazon",
      cardId: "card_icici_7302",
      cardName: "ICICI ..7302",
      cardVariant: "Amazon Pay",
      seekerEmail: "amit@example.com",
      seekerName: "Amit Kumar",
      ownerEmail: "vineet@example.com",
      ownerName: "Vineet Sharma",
      originalPrice: 30000,
      discountAmount: 1500,
      productPriceAfterOffer: 28500,
      processingFee: 300,
      gatewayCharges: 60,
      totalPayable: 28860,
      status: "Completed",
      step: 5,
      createdAt: "2026-11-18T14:20:00.000Z",
      trackingNumber: "AWB-AMZ-998124",
      escrowReleased: true
    },
    {
      id: "CR-10426",
      product: "Headphones",
      platform: "Flipkart",
      cardId: "card_sbi_1190",
      cardName: "SBI ..1190",
      cardVariant: "Cashback",
      seekerEmail: "neha@example.com",
      seekerName: "Neha Gupta",
      ownerEmail: "vineet@example.com",
      ownerName: "Vineet Sharma",
      originalPrice: 12000,
      discountAmount: 600,
      productPriceAfterOffer: 11400,
      processingFee: 120,
      gatewayCharges: 25,
      totalPayable: 11545,
      status: "Approved",
      step: 2,
      createdAt: "2026-11-19T09:15:00.000Z",
      trackingNumber: "",
      escrowReleased: false
    },
    {
      id: "CR-10425",
      product: "Smart Watch",
      platform: "Flipkart",
      cardId: "card_axis_6034",
      cardName: "Axis ..6034",
      cardVariant: "Flipkart Axis",
      seekerEmail: "rahul@example.com",
      seekerName: "Rahul Verma",
      ownerEmail: "priya@example.com",
      ownerName: "Priya Patel",
      originalPrice: 18000,
      discountAmount: 1350,
      productPriceAfterOffer: 16650,
      processingFee: 180,
      gatewayCharges: 35,
      totalPayable: 16865,
      status: "Pending",
      step: 1,
      createdAt: "2026-11-21T11:00:00.000Z",
      trackingNumber: "",
      escrowReleased: false
    }
  ],

  cardPresets: [
    {
      bankName: "HDFC Bank",
      cardNetwork: "VISA",
      cardVariant: "Regalia",
      last4Digits: "4821",
      fullSimulated: "4532 •••• •••• 4821",
      cvvStatus: "Discarded",
      colorGradient: "from-[#4F46E5] to-[#7C3AED]",
      suggestedOffers: [
        "10% instant discount on Flipkart",
        "5% instant discount on Amazon",
        "No-cost EMI"
      ]
    },
    {
      bankName: "ICICI Bank",
      cardNetwork: "VISA",
      cardVariant: "Amazon Pay",
      last4Digits: "7302",
      fullSimulated: "4315 •••• •••• 7302",
      cvvStatus: "Discarded",
      colorGradient: "from-[#0D9488] to-[#047857]",
      suggestedOffers: [
        "5% unlimited cashback on Amazon",
        "15% off on Zomato",
        "No-cost EMI on electronics"
      ]
    },
    {
      bankName: "SBI Card",
      cardNetwork: "MasterCard",
      cardVariant: "Cashback",
      last4Digits: "1190",
      fullSimulated: "5241 •••• •••• 1190",
      cvvStatus: "Discarded",
      colorGradient: "from-[#D97706] to-[#B45309]",
      suggestedOffers: [
        "5% cashback on Flipkart & Amazon",
        "Complimentary domestic lounge access"
      ]
    },
    {
      bankName: "Axis Bank",
      cardNetwork: "VISA",
      cardVariant: "Flipkart Axis",
      last4Digits: "6034",
      fullSimulated: "4111 •••• •••• 6034",
      cvvStatus: "Discarded",
      colorGradient: "from-[#E11D48] to-[#9F1239]",
      suggestedOffers: [
        "7.5% instant discount on Flipkart",
        "4% cashback on Swiggy and Uber"
      ]
    }
  ]
};
