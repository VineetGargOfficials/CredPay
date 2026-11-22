import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KycModal from './components/KycModal';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddCardPage from './pages/AddCardPage';
import OcrScannerPage from './pages/OcrScannerPage';
import FindOffersPage from './pages/FindOffersPage';
import RequestPaymentPage from './pages/RequestPaymentPage';
import RequestsListPage from './pages/RequestsListPage';
import EarningsPage from './pages/EarningsPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [scannedCardData, setScannedCardData] = useState(null);

  // User state
  const [user, setUser] = useState({
    id: "usr_001",
    name: "Vineet Sharma",
    email: "vineet@example.com",
    role: "owner",
    isKycVerified: true,
    stats: {
      listedCards: 3,
      activeRequests: 5,
      ordersCompleted: 18,
      feeEarned: 4250
    }
  });

  // Cards state (matching Chapter 4 screenshots)
  const [cards, setCards] = useState([
    {
      id: "card_hdfc_4821",
      bankName: "HDFC Bank",
      cardNetwork: "VISA",
      cardVariant: "Regalia",
      last4Digits: "4821",
      limitAvailable: 150000,
      processingFee: "1% of product value",
      ownerId: "usr_001",
      ownerName: "Vineet S.",
      ownerRating: 4.8,
      kycVerified: true,
      offers: [
        { title: "10% instant discount on Flipkart", platform: "Flipkart", discountPercent: 10, maxDiscount: 5000 },
        { title: "5% instant discount on Amazon", platform: "Amazon", discountPercent: 5, maxDiscount: 2500 },
        { title: "No-cost EMI", platform: "General", discountPercent: 0 }
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
      ownerId: "usr_001",
      ownerName: "Vineet S.",
      ownerRating: 4.9,
      kycVerified: true,
      offers: [
        { title: "5% unlimited cashback on Amazon", platform: "Amazon", discountPercent: 5, maxDiscount: 10000 },
        { title: "15% off on Zomato", platform: "Zomato", discountPercent: 15, maxDiscount: 150 }
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
      ownerId: "usr_001",
      ownerName: "Vineet S.",
      ownerRating: 4.7,
      kycVerified: true,
      offers: [
        { title: "5% cashback on Flipkart", platform: "Flipkart", discountPercent: 5, maxDiscount: 1500 },
        { title: "5% cashback on online spends", platform: "General", discountPercent: 5, maxDiscount: 1500 }
      ]
    }
  ]);

  // Requests state (matching Chapter 4 screenshots)
  const [requests, setRequests] = useState([
    {
      id: "CR-10428",
      product: "Laptop 15\"",
      platform: "Flipkart",
      cardId: "card_hdfc_4821",
      cardName: "HDFC ..4821",
      cardVariant: "Regalia",
      seekerName: "Rahul Verma",
      ownerName: "Vineet Sharma",
      originalPrice: 55000,
      discountAmount: 5000,
      productPriceAfterOffer: 50000,
      processingFee: 500,
      gatewayCharges: 100,
      totalPayable: 50600,
      status: "Payment",
      step: 3,
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
      seekerName: "Amit Kumar",
      ownerName: "Vineet Sharma",
      originalPrice: 30000,
      discountAmount: 1500,
      productPriceAfterOffer: 28500,
      processingFee: 300,
      gatewayCharges: 60,
      totalPayable: 28860,
      status: "Completed",
      step: 5,
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
      seekerName: "Neha Gupta",
      ownerName: "Vineet Sharma",
      originalPrice: 12000,
      discountAmount: 600,
      productPriceAfterOffer: 11400,
      processingFee: 120,
      gatewayCharges: 25,
      totalPayable: 11545,
      status: "Approved",
      step: 2,
      trackingNumber: "",
      escrowReleased: false
    }
  ]);

  // Active selected order for RequestPaymentPage
  const [selectedOrder, setSelectedOrder] = useState(requests[0]);

  // Fetch initial data from backend if running
  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) setUser(prev => ({ ...prev, stats: data.stats }));
        if (data.myCards && data.myCards.length > 0) setCards(data.myCards);
      })
      .catch(() => {
        // Fallback to local state if backend not immediately reached
      });
  }, []);

  // Handlers
  const handleLoginSuccess = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    setIsAuthenticated(true);
    setActiveTab('dashboard');

    // Fetch refreshed stats & cards for the selected user
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) setUser(prev => ({ ...prev, ...userData, stats: data.stats }));
        if (Array.isArray(data.myCards)) {
          setCards(data.myCards);
        }
      })
      .catch(() => {
        // Fallback filter based on email
        if (userData.email === 'priya@example.com') {
          setCards([
            {
              id: "card_axis_6034",
              bankName: "Axis Bank",
              cardNetwork: "VISA",
              cardVariant: "Flipkart Axis",
              last4Digits: "6034",
              limitAvailable: 120000,
              processingFee: "1% of product value",
              ownerId: "usr_002",
              ownerName: "Priya Patel",
              ownerRating: 4.6,
              kycVerified: true,
              offers: [
                { title: "7.5% instant discount on Flipkart", platform: "Flipkart", discountPercent: 7.5, maxDiscount: 3750 }
              ]
            }
          ]);
        } else if (userData.email === 'rahul@example.com' || userData.email === 'ananya@example.com') {
          setCards([]);
        }
      });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleCardAdded = (newCardData) => {
    const newCard = {
      id: `card_${Date.now()}`,
      ...newCardData,
      ownerId: user.id,
      ownerName: user.name,
      ownerRating: 5.0,
      kycVerified: user.isKycVerified
    };

    setCards([newCard, ...cards]);
    setUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        listedCards: prev.stats.listedCards + 1
      }
    }));
    setScannedCardData(null);
    setActiveTab('dashboard');

    // Sync to backend
    fetch('/api/cards/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCardData)
    }).catch(() => {});
  };

  const handleConfirmOcrScan = (data) => {
    setScannedCardData(data);
    setActiveTab('add-card');
  };

  const handleRequestOffer = (orderData) => {
    const newReq = {
      id: `CR-${Math.floor(10000 + Math.random() * 90000)}`,
      product: orderData.product,
      platform: orderData.platform,
      cardId: orderData.card.id,
      cardName: `${orderData.card.bankName.split(' ')[0]} ..${orderData.card.last4Digits}`,
      cardVariant: orderData.card.cardVariant,
      seekerName: user.name,
      ownerName: 'Vineet Sharma',
      originalPrice: orderData.originalPrice,
      discountAmount: orderData.discountAmount,
      productPriceAfterOffer: orderData.productPriceAfterOffer,
      processingFee: orderData.processingFee,
      gatewayCharges: orderData.gatewayCharges,
      totalPayable: orderData.totalPayable,
      status: 'Payment',
      step: 3,
      trackingNumber: '',
      escrowReleased: false
    };

    setRequests([newReq, ...requests]);
    setSelectedOrder(newReq);
    setActiveTab('request-payment');
  };

  const handlePaySuccess = (updatedOrder) => {
    setRequests(prev => prev.map(r => r.id === updatedOrder.id ? updatedOrder : r));
    setSelectedOrder(updatedOrder);

    // If order progressed to delivered/completed, update earnings
    if (updatedOrder.step === 5) {
      setUser(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          ordersCompleted: prev.stats.ordersCompleted + 1,
          feeEarned: prev.stats.feeEarned + updatedOrder.processingFee
        }
      }));
    }
  };

  const handleApproveRequest = (orderId) => {
    setRequests(prev => prev.map(r => {
      if (r.id === orderId) {
        return { ...r, status: 'Payment', step: 3 };
      }
      return r;
    }));
  };

  const handleCancelRequest = () => {
    if (selectedOrder) {
      setRequests(prev => prev.map(r => r.id === selectedOrder.id ? { ...r, status: 'Cancelled', step: 0 } : r));
    }
    setActiveTab('dashboard');
  };

  // If user is logged out, show Login & Auth page (Screenshot 1)
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'my-cards') {
            setActiveTab('add-card');
          } else {
            setActiveTab(tab);
          }
        }}
        user={user}
        onLogout={handleLogout}
        onOpenKyc={() => setIsKycModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardPage
            stats={user.stats}
            cards={cards}
            requests={requests}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectRequest={(req) => {
              setSelectedOrder(req);
              setActiveTab('request-payment');
            }}
          />
        )}

        {activeTab === 'add-card' && (
          <AddCardPage
            initialData={scannedCardData}
            onCardAdded={handleCardAdded}
            onNavigateToScanner={() => setActiveTab('ocr-scanner')}
          />
        )}

        {activeTab === 'ocr-scanner' && (
          <OcrScannerPage
            onConfirmScan={handleConfirmOcrScan}
            onBack={() => setActiveTab('add-card')}
          />
        )}

        {activeTab === 'find-offers' && (
          <FindOffersPage
            onRequestOffer={handleRequestOffer}
          />
        )}

        {activeTab === 'request-payment' && (
          <RequestPaymentPage
            order={selectedOrder || requests[0]}
            onBack={() => setActiveTab('dashboard')}
            onPaySuccess={handlePaySuccess}
            onCancelRequest={handleCancelRequest}
          />
        )}

        {activeTab === 'requests' && (
          <RequestsListPage
            requests={requests}
            onSelectRequest={(req) => {
              setSelectedOrder(req);
              setActiveTab('request-payment');
            }}
            onApproveRequest={handleApproveRequest}
            onOpenPayment={(req) => {
              setSelectedOrder(req);
              setActiveTab('request-payment');
            }}
          />
        )}

        {activeTab === 'earnings' && (
          <EarningsPage
            stats={user.stats}
            requests={requests}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CredPay</span>
            <span>— AI-Based Credit Card Offer Sharing Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>PCI-DSS Compliant</span>
            <span>•</span>
            <span>Zero-Trust Card Masking</span>
            <span>•</span>
            <span>Razorpay Escrow Protected</span>
          </div>
        </div>
      </footer>

      {/* KYC Verification Modal */}
      <KycModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        onVerifySuccess={() => {
          setUser(prev => ({ ...prev, isKycVerified: true }));
        }}
      />
    </div>
  );
}
