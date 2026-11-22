import React, { useState } from 'react';
import { DollarSign, TrendingUp, ShieldCheck, ArrowDownToLine, CheckCircle2, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EarningsPage({ stats, requests }) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const totalFeeEarned = stats?.feeEarned || 4250;
  const completedOrders = requests.filter(r => r.status === 'Completed' || r.status === 'Delivered');

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawn(true);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
      setTimeout(() => {
        setWithdrawn(false);
      }, 4000);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Earnings & Payouts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Realized processing fee share from listed cards
          </p>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={isWithdrawing || withdrawn}
          className="px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl text-sm transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          {isWithdrawing ? (
            'Processing IMPS Transfer...'
          ) : withdrawn ? (
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Transferred to Bank</span>
          ) : (
            <>
              <ArrowDownToLine className="w-4 h-4" />
              Withdraw ₹{totalFeeEarned.toLocaleString('en-IN')} to Bank
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Fee Earned
          </div>
          <div className="text-3xl font-extrabold text-[#BE123C] mt-1 font-mono">
            ₹{totalFeeEarned.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">100% credited to your linked UPI/Account</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Successful Orders
          </div>
          <div className="text-3xl font-extrabold text-[#10B981] mt-1">
            {stats?.ordersCompleted || 18}
          </div>
          <div className="text-xs text-slate-500 mt-1">Zero default or fraud chargebacks</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Fee per Order
          </div>
          <div className="text-3xl font-extrabold text-[#4F46E5] mt-1 font-mono">
            ₹236
          </div>
          <div className="text-xs text-slate-500 mt-1">Based on 1% standard processing fee</div>
        </div>
      </div>

      {/* Transaction Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Completed Payout History</h2>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
            Escrow Released
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {completedOrders.length > 0 ? (
            completedOrders.map((ord) => (
              <div key={ord.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition">
                <div>
                  <div className="font-bold text-sm text-slate-900">{ord.product}</div>
                  <div className="text-xs text-slate-500 font-mono">
                    Order #{ord.id} · {ord.platform} · Card: {ord.cardName || 'HDFC ..4821'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-sm text-emerald-600 font-mono">
                    +₹{ord.processingFee}
                  </div>
                  <div className="text-[11px] text-slate-400">IMPS Auto-Settled</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">
              No completed orders yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
