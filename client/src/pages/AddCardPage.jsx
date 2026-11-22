import React, { useState } from 'react';
import { Camera, Lock, Plus, X, Check } from 'lucide-react';

export default function AddCardPage({
  onCardAdded,
  onNavigateToScanner,
  initialData
}) {
  const [bankName, setBankName] = useState(initialData?.bankName || 'HDFC Bank');
  const [cardNetwork, setCardNetwork] = useState(initialData?.cardNetwork || 'VISA');
  const [cardVariant, setCardVariant] = useState(initialData?.cardVariant || 'Regalia');
  const [last4Digits, setLast4Digits] = useState(initialData?.last4Digits || '4821');
  const [limitAvailable, setLimitAvailable] = useState(initialData?.limitAvailable || '₹ 1,50,000');
  const [processingFee, setProcessingFee] = useState('1% of product value');

  const [offers, setOffers] = useState(
    initialData?.suggestedOffers || [
      '10% instant discount on Flipkart',
      '5% instant discount on Amazon',
      'No-cost EMI'
    ]
  );
  const [newOfferText, setNewOfferText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddOffer = () => {
    if (newOfferText.trim()) {
      setOffers([...offers, newOfferText.trim()]);
      setNewOfferText('');
    }
  };

  const handleRemoveOffer = (index) => {
    setOffers(offers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const numericLimit = parseInt(String(limitAvailable).replace(/\D/g, ''), 10) || 150000;
    const cleanLast4 = String(last4Digits).replace(/\D/g, '').slice(-4) || '4821';

    const cardPayload = {
      bankName,
      cardNetwork,
      cardVariant,
      last4Digits: cleanLast4,
      limitAvailable: numericLimit,
      processingFee,
      offers
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        onCardAdded(cardPayload);
      }, 1000);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Add Your Card
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          List a card so others can use its offers
        </p>
      </div>

      {/* Main Form Container (matching Screenshot 3) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
        {/* Top Scan action row */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-slate-100">
          <button
            type="button"
            onClick={onNavigateToScanner}
            className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl text-sm transition shadow-md shadow-indigo-500/20 flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Scan Card with Camera
          </button>
          <span className="text-xs font-medium text-slate-400">
            or fill details manually
          </span>
        </div>

        {showSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Card Listed Successfully!</h3>
            <p className="text-sm text-slate-600">
              Your {bankName} {cardVariant} is now live. Other users can request your offers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bank Name */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="HDFC Bank"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
              />
            </div>

            {/* Row: Card Network & Card Variant */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Card Network
                </label>
                <input
                  type="text"
                  value={cardNetwork}
                  onChange={(e) => setCardNetwork(e.target.value)}
                  placeholder="VISA"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Card Variant
                </label>
                <input
                  type="text"
                  value={cardVariant}
                  onChange={(e) => setCardVariant(e.target.value)}
                  placeholder="Regalia"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
                />
              </div>
            </div>

            {/* Row: Last 4 Digits & Card Limit Available */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Last 4 Digits
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={last4Digits}
                  onChange={(e) => setLast4Digits(e.target.value.replace(/\D/g, ''))}
                  placeholder="4821"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 font-mono text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Card Limit Available
                </label>
                <input
                  type="text"
                  value={limitAvailable}
                  onChange={(e) => setLimitAvailable(e.target.value)}
                  placeholder="₹ 1,50,000"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
                />
              </div>
            </div>

            {/* Available Offers on this Card */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Available Offers on this Card
              </label>

              {/* Tag Pills matching Screenshot 3 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {offers.map((offer, idx) => {
                  const isEmi = offer.toLowerCase().includes('emi');
                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        isEmi
                          ? 'bg-[#D1FAE5] text-[#065F46]'
                          : 'bg-[#E0E7FF] text-[#3730A3]'
                      }`}
                    >
                      {offer}
                      <button
                        type="button"
                        onClick={() => handleRemoveOffer(idx)}
                        className="hover:opacity-75"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>

              {/* Add offer input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOfferText}
                  onChange={(e) => setNewOfferText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddOffer();
                    }
                  }}
                  placeholder="Add custom offer (e.g. 10% instant discount on Myntra)"
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4F46E5]"
                />
                <button
                  type="button"
                  onClick={handleAddOffer}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            {/* Processing Fee Charged */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Processing Fee Charged
              </label>
              <input
                type="text"
                value={processingFee}
                onChange={(e) => setProcessingFee(e.target.value)}
                placeholder="1% of product value"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
              />
            </div>

            {/* Security Guarantee Note (exact replica of Screenshot 3) */}
            <div className="p-3.5 bg-[#EFF6FF] rounded-xl flex items-center gap-2 text-xs text-[#1E40AF]">
              <Lock className="w-4 h-4 text-[#3B82F6] shrink-0" />
              <span>Full card number and CVV are never stored on this platform.</span>
            </div>

            {/* Submit Button (exact replica of Screenshot 3: Green button) */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl text-sm transition shadow-md shadow-emerald-500/20 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Listing Card...
                  </>
                ) : (
                  'List My Card'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
