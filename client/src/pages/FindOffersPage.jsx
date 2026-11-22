import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Search, Star, ShieldCheck, Tag, ShoppingBag, 
  ChevronDown, Check, Loader2, Smartphone, Laptop, Tv, Headphones, 
  Watch, AlertTriangle, Info, Shirt, Utensils, ArrowRight
} from 'lucide-react';
import CreditCardGraphic from '../components/CreditCardGraphic';

export default function FindOffersPage({ onRequestOffer }) {
  // Platform state
  const [platform, setPlatform] = useState('Flipkart');
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const platformRef = useRef(null);

  // Available platform list
  const platformOptions = [
    { name: 'Flipkart', icon: '🛍️', badge: 'General & Electronics', category: 'General' },
    { name: 'Amazon', icon: '📦', badge: 'General & Prime', category: 'General' },
    { name: 'Myntra', icon: '👗', badge: 'Fashion & Lifestyle Only', category: 'Fashion' },
    { name: 'Apple Store', icon: '🍏', badge: 'Official Apple Only', category: 'Apple' },
    { name: 'Tata CliQ', icon: '✨', badge: 'Fashion & Luxury', category: 'General' },
    { name: 'Croma', icon: '⚡', badge: 'Consumer Electronics', category: 'Electronics' },
    { name: 'Reliance Digital', icon: '📱', badge: 'Gadgets & Appliances', category: 'Electronics' },
    { name: 'Zomato / Swiggy', icon: '🍔', badge: 'Food & Dining Only', category: 'Food' }
  ];

  // Product state
  const [productInput, setProductInput] = useState('Laptop 15 inch — ₹55,000');
  const [price, setPrice] = useState(55000);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const productRef = useRef(null);

  // Platform-Specific Catalogs for 100% Realistic Suggestions
  const catalogByPlatform = {
    Myntra: [
      { name: 'Nike Air Jordan 1 Retro High', price: 12995, category: 'Footwear', icon: '👟' },
      { name: 'Fossil Townsman Chronograph Watch', price: 11995, category: 'Watches', icon: '⌚' },
      { name: "Levi's 511 Slim Fit Denim Jacket", price: 4599, category: 'Apparel', icon: '👕' },
      { name: 'Ray-Ban Aviator Classic Sunglasses', price: 8490, category: 'Accessories', icon: '🕶️' },
      { name: 'Puma Deviate Nitro Running Shoes', price: 8999, category: 'Footwear', icon: '👟' },
      { name: 'Titan Smart Touchscreen Watch', price: 7995, category: 'Wearable', icon: '⌚' },
      { name: 'Tommy Hilfiger Leather Travel Bag', price: 14500, category: 'Accessories', icon: '👜' }
    ],
    'Apple Store': [
      { name: 'iPhone 16 Pro (256GB Desert Titanium)', price: 129900, category: 'Smartphone', icon: '📱' },
      { name: 'iPhone 15 (128GB Blue)', price: 71999, category: 'Smartphone', icon: '📱' },
      { name: 'MacBook Air 13" (M3 Chip / 16GB)', price: 114900, category: 'Laptop', icon: '💻' },
      { name: 'MacBook Pro 14" (M3 Pro Chip)', price: 199900, category: 'Laptop', icon: '💻' },
      { name: 'iPad Air 11-inch (M2 / Wi-Fi)', price: 59900, category: 'Tablet', icon: '📱' },
      { name: 'AirPods Pro (2nd Generation with USB-C)', price: 24900, category: 'Audio', icon: '🎧' },
      { name: 'Apple Watch Series 10 GPS 46mm', price: 49900, category: 'Wearable', icon: '⌚' }
    ],
    'Zomato / Swiggy': [
      { name: 'Weekend Family Dining Banquet Spends', price: 3500, category: 'Dining', icon: '🍽️' },
      { name: 'Gourmet Luxury Dinner Buffet (2 Guests)', price: 4200, category: 'Dining', icon: '🍲' },
      { name: 'Weekly Office Team Lunch Package', price: 5800, category: 'Food', icon: '🍱' },
      { name: 'Monthly Coffee & Cafe Subscription', price: 2200, category: 'Beverage', icon: '☕' }
    ],
    Default: [
      { name: 'Laptop 15 inch (Core i7 / 16GB / 512GB)', price: 55000, category: 'Laptop', icon: '💻' },
      { name: 'iPhone 15 (128GB)', price: 71999, category: 'Smartphone', icon: '📱' },
      { name: 'Samsung Galaxy S24 Ultra 5G', price: 129999, category: 'Smartphone', icon: '📱' },
      { name: 'Smart TV 55 inch 4K Ultra HD', price: 38000, category: 'TV', icon: '📺' },
      { name: 'Sony WH-1000XM5 Wireless Headphones', price: 26990, category: 'Audio', icon: '🎧' },
      { name: 'Dell XPS 15 OLED Laptop', price: 145000, category: 'Laptop', icon: '💻' },
      { name: 'OnePlus 12 5G (16GB RAM)', price: 64999, category: 'Smartphone', icon: '📱' }
    ]
  };

  // Select appropriate catalog based on active platform
  const getActiveCatalog = () => {
    if (platform.toLowerCase().includes('myntra')) return catalogByPlatform.Myntra;
    if (platform.toLowerCase().includes('apple')) return catalogByPlatform['Apple Store'];
    if (platform.toLowerCase().includes('zomato') || platform.toLowerCase().includes('swiggy')) return catalogByPlatform['Zomato / Swiggy'];
    return catalogByPlatform.Default;
  };

  const activeCatalog = getActiveCatalog();

  // Filter suggestions
  const filteredSuggestions = activeCatalog.filter(item => {
    const query = productInput.toLowerCase().replace(/—.*$/, '').trim();
    if (!query) return true;
    return item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
  });

  // Loading delay state
  const [loading, setLoading] = useState(false);

  // AI & Mismatch state
  const [platformMismatch, setPlatformMismatch] = useState(false);
  const [platformAlert, setPlatformAlert] = useState(null);
  const [suggestedPlatforms, setSuggestedPlatforms] = useState([]);
  const [excludedCards, setExcludedCards] = useState([]);

  // AI Recommendation state
  const [aiRecommendation, setAiRecommendation] = useState({
    summaryText: "Best match: HDFC Regalia ..4821 — 10% instant discount (max ₹5,000). You save ₹5,000; processing fee ₹500."
  });

  const [availableCards, setAvailableCards] = useState([]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (platformRef.current && !platformRef.current.contains(event.target)) {
        setIsPlatformOpen(false);
      }
      if (productRef.current && !productRef.current.contains(event.target)) {
        setIsSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Execute AI Search with loading delay
  const executeSearch = async (targetPlatform, targetProduct, directPrice) => {
    setLoading(true);
    setIsPlatformOpen(false);
    setIsSuggestionsOpen(false);

    const cleanPlatform = (targetPlatform || platform).replace(/^Platform:\s*/i, '').trim() || 'Flipkart';
    const prodStr = targetProduct !== undefined ? targetProduct : productInput;

    // Parse price
    let numPrice = directPrice || price;
    if (!directPrice) {
      const numbers = String(prodStr).replace(/,/g, '').match(/\d+/g);
      if (numbers && numbers.length > 0) {
        const parsed = parseInt(numbers[numbers.length - 1], 10);
        if (parsed > 100) numPrice = parsed;
      }
    }

    try {
      // 700ms realistic AI delay
      await new Promise(resolve => setTimeout(resolve, 700));

      const res = await fetch('/api/offers/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: cleanPlatform,
          product: prodStr,
          price: numPrice
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAvailableCards(data.availableCards || []);
        setAiRecommendation(data.aiRecommendation);
        setPlatformMismatch(Boolean(data.platformMismatch));
        setPlatformAlert(data.platformAlert || null);
        setSuggestedPlatforms(data.suggestedPlatforms || []);
        setExcludedCards(data.excludedCards || []);
        setPrice(data.price || numPrice);
      }
    } catch (err) {
      console.warn('Search API fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  // Perform search on mount
  useEffect(() => {
    executeSearch('Flipkart', 'Laptop 15 inch — ₹55,000', 55000);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(platform, productInput);
  };

  const handleSelectPlatform = (selectedName) => {
    setPlatform(selectedName);
    setIsPlatformOpen(false);

    // If switching to platform with specialized catalog, update suggested product
    let newProd = productInput;
    let newPrice = price;

    if (selectedName.toLowerCase().includes('myntra')) {
      newProd = 'Nike Air Jordan 1 Retro High — ₹12,995';
      newPrice = 12995;
    } else if (selectedName.toLowerCase().includes('apple')) {
      newProd = 'iPhone 16 Pro (256GB) — ₹1,29,900';
      newPrice = 129900;
    } else if (selectedName.toLowerCase().includes('zomato') || selectedName.toLowerCase().includes('swiggy')) {
      newProd = 'Weekend Family Dining Banquet Spends — ₹3,500';
      newPrice = 3500;
    } else if (productInput.includes('Air Jordan') || productInput.includes('Dining')) {
      newProd = 'Laptop 15 inch — ₹55,000';
      newPrice = 55000;
    }

    setProductInput(newProd);
    setPrice(newPrice);
    executeSearch(selectedName, newProd, newPrice);
  };

  const handleSelectSuggestion = (item) => {
    const formatted = `${item.name} — ₹${item.price.toLocaleString('en-IN')}`;
    setProductInput(formatted);
    setPrice(item.price);
    setIsSuggestionsOpen(false);
    executeSearch(platform, formatted, item.price);
  };

  const handleCardSelect = (card) => {
    onRequestOffer({
      product: productInput.split('—')[0].trim() || 'Product',
      platform: platform.replace(/^Platform:\s*/i, '').trim() || 'Flipkart',
      card: card,
      originalPrice: price,
      discountAmount: card.discountAmount || 5000,
      productPriceAfterOffer: Math.max(0, price - (card.discountAmount || 5000)),
      processingFee: card.fee || card.processingFee || 500,
      gatewayCharges: 100,
      totalPayable: Math.max(0, price - (card.discountAmount || 5000)) + (card.fee || 500) + 100
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Find Card Offers
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          AI-powered offer matching with strict merchant eligibility and catalog validation
        </p>
      </div>

      {/* Popular Platform Quick Switcher Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5 text-indigo-500" /> Stores:
        </span>
        {['Flipkart', 'Amazon', 'Myntra', 'Apple Store'].map((storeName) => (
          <button
            key={storeName}
            type="button"
            onClick={() => handleSelectPlatform(storeName)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
              platform.toLowerCase() === storeName.toLowerCase()
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {storeName}
          </button>
        ))}
      </div>

      {/* Search Bar Form with Platform Dropdown and Dynamic Product Auto-Complete */}
      <form onSubmit={handleSearchSubmit} className="relative z-30">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Platform Input with Dropdown (sm:col-span-4) */}
          <div ref={platformRef} className="sm:col-span-4 relative">
            <div
              onClick={() => setIsPlatformOpen(!isPlatformOpen)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white cursor-pointer hover:border-indigo-400 transition flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs text-slate-400 font-normal">Platform:</span>
                <span className="text-slate-900 font-bold">{platform}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isPlatformOpen ? 'rotate-180 text-indigo-600' : ''}`} />
            </div>

            {/* Platform Dropdown Menu */}
            {isPlatformOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 max-h-80 overflow-y-auto animate-fadeIn">
                <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Shopping App / Site
                </div>
                {platformOptions.map((opt) => (
                  <div
                    key={opt.name}
                    onClick={() => handleSelectPlatform(opt.name)}
                    className={`px-3.5 py-2.5 mx-1.5 rounded-xl text-xs font-medium cursor-pointer transition flex items-center justify-between ${
                      platform.toLowerCase() === opt.name.toLowerCase()
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{opt.icon}</span>
                      <span className="font-semibold">{opt.name}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      {opt.badge}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Input with Real-time Suggestions (sm:col-span-6) */}
          <div ref={productRef} className="sm:col-span-6 relative">
            <div className="relative">
              <input
                type="text"
                value={productInput}
                onChange={(e) => {
                  setProductInput(e.target.value);
                  setIsSuggestionsOpen(true);
                }}
                onFocus={() => setIsSuggestionsOpen(true)}
                placeholder={`Search products on ${platform}...`}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] bg-white transition shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>

            {/* Suggestions Dropdown tailored to platform */}
            {isSuggestionsOpen && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 max-h-80 overflow-y-auto animate-fadeIn">
                <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span>Available on {platform}</span>
                  <span>Estimated Price</span>
                </div>
                {filteredSuggestions.slice(0, 7).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSuggestion(item)}
                    className="px-3.5 py-2.5 mx-1.5 rounded-xl cursor-pointer hover:bg-indigo-50/70 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon || '🛍️'}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.category}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 group-hover:text-indigo-700">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Button (sm:col-span-2) */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl text-sm transition shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI Scanning...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>

      {/* Category Mismatch Warning Banner */}
      {platformMismatch && platformAlert && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <div className="font-bold text-amber-900">Platform Product Catalog Mismatch</div>
            <p className="leading-relaxed">{platformAlert}</p>
            {suggestedPlatforms.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <span className="font-semibold text-amber-800">Switch to:</span>
                {suggestedPlatforms.map(sp => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => handleSelectPlatform(sp)}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-300 transition"
                  >
                    {sp}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Recommendation Banner */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 ${
        loading ? 'bg-indigo-50/40 border-indigo-200 animate-pulse' : 'bg-[#EEF2FF] border-[#C7D2FE]'
      }`}>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] mb-1">
          <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>AI Card Recommendation Engine</span>
          {loading && <span className="text-[10px] font-normal text-indigo-400 ml-2">Evaluating co-branded exclusions & bank partnerships...</span>}
        </div>
        <p className="text-sm text-slate-800 font-normal leading-relaxed">
          {loading ? (
            <span className="text-slate-400">Verifying bank discounts on {platform} for "{productInput}"...</span>
          ) : (
            aiRecommendation?.summaryText
          )}
        </p>
      </div>

      {/* Section: Available Cards with Shimmer Loading */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Available Cards</span>
            {!loading && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">({availableCards.length})</span>}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {loading ? 'Evaluating platform rules...' : `Eligible cards for ${platform}`}
          </span>
        </div>

        {/* Shimmer Skeleton during loading delay */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 animate-pulse"
              >
                <div className="flex items-center gap-5">
                  <div className="w-32 h-20 bg-slate-200 rounded-xl"></div>
                  <div className="space-y-2.5">
                    <div className="w-48 h-4 bg-slate-200 rounded"></div>
                    <div className="w-36 h-3 bg-slate-100 rounded"></div>
                    <div className="flex gap-2">
                      <div className="w-16 h-5 bg-indigo-50 rounded-full"></div>
                      <div className="w-24 h-5 bg-indigo-50 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="w-28 h-10 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : availableCards.length === 0 ? (
          <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-800">No applicable card offers for this search</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Selected platform ({platform}) does not have active bank promotions for this item.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {availableCards.map((card, idx) => (
              <div
                key={card.id || card._id || idx}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-200 transition"
              >
                {/* Left & Middle: Card Graphic + Offer Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="shrink-0">
                    <CreditCardGraphic
                      bankName={card.bankName}
                      cardVariant={card.cardVariant}
                      cardNetwork={card.cardNetwork}
                      last4Digits={card.last4Digits}
                      variant="mini"
                    />
                  </div>

                  {/* Offer Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">
                        {card.offerTitle || card.matchedOffer?.title || 'Card Offer'}
                      </h3>
                      {(card.isBestMatch || idx === 0) && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D1FAE5] text-[#065F46]">
                          Best match
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      Valid till {card.validTill || '30 Nov'} · Owner rating {card.ownerRating || 4.8} ★ · {card.kycVerified ? 'KYC verified' : 'Verified'}
                    </div>

                    {/* Fee & You Pay Pills (matches Screenshot 5) */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E0E7FF] text-[#4338CA]">
                        Fee ₹{card.fee || card.processingFee || 500}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E0E7FF] text-[#4338CA]">
                        You pay ₹{(card.youPay || 50500).toLocaleString('en-IN')}
                      </span>
                      {card.discountAmount > 0 && (
                        <span className="text-xs text-emerald-600 font-bold ml-1">
                          (Save ₹{card.discountAmount.toLocaleString('en-IN')})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Request Offer Button */}
                <div className="shrink-0">
                  {idx === 0 || card.buttonStyle === 'primary' ? (
                    <button
                      onClick={() => handleCardSelect(card)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl text-sm transition shadow-md shadow-indigo-500/20"
                    >
                      Request Offer
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCardSelect(card)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-white border border-[#4F46E5] text-[#4F46E5] hover:bg-indigo-50 font-bold rounded-xl text-sm transition"
                    >
                      Request Offer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Excluded Cards Explanation Box (Strict Transparency) */}
        {excludedCards.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-500" />
              <span>Ineligible Cards on {platform} (AI Rule Enforcement):</span>
            </div>
            <ul className="space-y-1 list-disc list-inside text-slate-500">
              {excludedCards.map((ec, idx) => (
                <li key={idx}>
                  <strong className="text-slate-700">{ec.cardName}</strong>: {ec.reason}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
