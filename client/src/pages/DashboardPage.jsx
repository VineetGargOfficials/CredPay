import React from 'react';
import { Plus, ArrowUpRight, Search, Camera, Sparkles } from 'lucide-react';
import CreditCardGraphic from '../components/CreditCardGraphic';

export default function DashboardPage({
  stats,
  cards,
  requests,
  onNavigate,
  onSelectRequest
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track your cards, requests and earnings
        </p>
      </div>

      {/* 4 Top Stat Cards (exact replica of Screenshot 2) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Listed Cards */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow transition">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Listed Cards
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#4F46E5]">
            {stats?.listedCards || 3}
          </div>
        </div>

        {/* Active Requests */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow transition">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Active Requests
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#D97706]">
            {stats?.activeRequests || 5}
          </div>
        </div>

        {/* Orders Completed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow transition">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Orders Completed
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#10B981]">
            {stats?.ordersCompleted || 18}
          </div>
        </div>

        {/* Fee Earned */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow transition">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Fee Earned
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#BE123C]">
            ₹{(stats?.feeEarned || 4250).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* My Listed Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            My Listed Cards
          </h2>
          <button
            onClick={() => onNavigate('add-card')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-4 h-4" /> Add Card
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards && cards.length > 0 ? (
            cards.map((card) => (
              <CreditCardGraphic
                key={card.id || card._id}
                bankName={card.bankName}
                cardVariant={card.cardVariant}
                cardNetwork={card.cardNetwork}
                last4Digits={card.last4Digits}
              />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center space-y-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No Cards Listed (Shopper Mode)</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You currently have 0 cards listed. You can browse live credit card offers to save on your shopping or scan your own card using OCR to start earning fees.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('find-offers')}
                  className="px-4 py-2 bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#4338CA] transition"
                >
                  Find Offers to Save
                </button>
                <button
                  onClick={() => onNavigate('ocr-scanner')}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition"
                >
                  Scan Card with OCR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Need a card discount for a purchase?</h4>
            <p className="text-xs text-slate-600">Find matching bank cards on Flipkart, Amazon, and save up to 10% instantly.</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('ocr-scanner')}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-600" />
            Scan with OCR
          </button>
          <button
            onClick={() => onNavigate('find-offers')}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-[#4F46E5] text-white hover:bg-[#4338CA] transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            Find Offers
          </button>
        </div>
      </div>

      {/* Recent Requests Section (exact replica of Screenshot 2) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Recent Requests
          </h2>
          <button
            onClick={() => onNavigate('requests')}
            className="text-xs font-semibold text-[#4F46E5] hover:underline inline-flex items-center gap-1"
          >
            View all requests <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Platform</th>
                <th className="py-3.5 px-6">Card</th>
                <th className="py-3.5 px-6">Fee</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {/* Row 1: Laptop 15" */}
              <tr 
                onClick={() => {
                  const req = requests.find(r => r.id === 'CR-10428') || requests[0];
                  onSelectRequest(req);
                }}
                className="hover:bg-slate-50/80 cursor-pointer transition"
              >
                <td className="py-4 px-6 font-semibold text-slate-900">
                  Laptop 15"
                </td>
                <td className="py-4 px-6 text-slate-600">
                  Flipkart
                </td>
                <td className="py-4 px-6 font-mono text-xs text-slate-600">
                  HDFC ..4821
                </td>
                <td className="py-4 px-6 font-semibold text-slate-900">
                  ₹500
                </td>
                <td className="py-4 px-6">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#FEF3C7] text-[#B45309]">
                    Pending
                  </span>
                </td>
              </tr>

              {/* Row 2: Smartphone */}
              <tr 
                onClick={() => {
                  const req = requests.find(r => r.id === 'CR-10427') || requests[1];
                  onSelectRequest(req);
                }}
                className="hover:bg-slate-50/80 cursor-pointer transition"
              >
                <td className="py-4 px-6 font-semibold text-slate-900">
                  Smartphone
                </td>
                <td className="py-4 px-6 text-slate-600">
                  Amazon
                </td>
                <td className="py-4 px-6 font-mono text-xs text-slate-600">
                  ICICI ..7302
                </td>
                <td className="py-4 px-6 font-semibold text-slate-900">
                  ₹300
                </td>
                <td className="py-4 px-6">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#D1FAE5] text-[#047857]">
                    Completed
                  </span>
                </td>
              </tr>

              {/* Row 3: Headphones */}
              <tr 
                onClick={() => {
                  const req = requests.find(r => r.id === 'CR-10426') || requests[2];
                  onSelectRequest(req);
                }}
                className="hover:bg-slate-50/80 cursor-pointer transition"
              >
                <td className="py-4 px-6 font-semibold text-slate-900">
                  Headphones
                </td>
                <td className="py-4 px-6 text-slate-600">
                  Flipkart
                </td>
                <td className="py-4 px-6 font-mono text-xs text-slate-600">
                  SBI ..1190
                </td>
                <td className="py-4 px-6 font-semibold text-slate-900">
                  ₹120
                </td>
                <td className="py-4 px-6">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#E0E7FF] text-[#4338CA]">
                    Approved
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
