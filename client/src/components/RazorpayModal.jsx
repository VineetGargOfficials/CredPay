import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, Smartphone, CreditCard, Building } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RazorpayModal({
  isOpen,
  onClose,
  request,
  onPaymentSuccess
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('rahul@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  if (!isOpen || !request) return null;

  const totalAmount = request.totalPayable || 50600;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
      setTimeout(() => {
        onPaymentSuccess();
        setIsPaid(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#3395FF] flex items-center justify-center font-black text-white text-base">
              R
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-300 font-medium">Razorpay Escrow</div>
              <div className="font-bold text-base leading-tight">CredPay Protection</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Order ID: {request.id}</div>
            <div className="text-sm font-semibold text-slate-800">{request.product}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Amount Payable</div>
            <div className="text-xl font-bold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {isPaid ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Escrow Payment Secured!</h3>
            <p className="text-sm text-slate-600 mb-4">
              Funds are held safely in escrow. The card owner will now proceed to complete the purchase on {request.platform}.
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-4 h-4" /> 100% Protected
            </span>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Select Payment Method
            </div>

            {/* Methods */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'upi'
                    ? 'border-[#3395FF] bg-blue-50/50 text-[#0C2340] font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Smartphone className="w-5 h-5 text-[#3395FF]" />
                <span className="text-xs">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'card'
                    ? 'border-[#3395FF] bg-blue-50/50 text-[#0C2340] font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#3395FF]" />
                <span className="text-xs">Debit/Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('netbanking')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'netbanking'
                    ? 'border-[#3395FF] bg-blue-50/50 text-[#0C2340] font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Building className="w-5 h-5 text-[#3395FF]" />
                <span className="text-xs">NetBanking</span>
              </button>
            </div>

            {/* UPI Input */}
            {selectedMethod === 'upi' && (
              <div className="mb-5 space-y-2">
                <label className="block text-xs font-medium text-slate-700">UPI ID / VPA</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@okaxis"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#3395FF]"
                />
                <div className="flex gap-2 pt-1">
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-200" onClick={() => setUpiId('demo@okhdfcbank')}>@okhdfcbank</span>
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-200" onClick={() => setUpiId('demo@oksbi')}>@oksbi</span>
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-200" onClick={() => setUpiId('demo@icici')}>@icici</span>
                </div>
              </div>
            )}

            {selectedMethod !== 'upi' && (
              <div className="mb-5 p-3 rounded-lg bg-slate-50 text-xs text-slate-600">
                Simulated {selectedMethod.toUpperCase()} gateway enabled. Click button below to complete escrow deposit.
              </div>
            )}

            {/* Escrow assurance note */}
            <div className="flex items-start gap-2 p-3 bg-blue-50/80 rounded-xl border border-blue-100 mb-6 text-xs text-blue-900">
              <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Razorpay Escrow:</strong> Your money is held securely and only released when you confirm delivery of your product.
              </span>
            </div>

            {/* CTA Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-[#3395FF] hover:bg-[#2084f0] text-white font-bold rounded-xl text-sm transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authorizing Escrow Deposit...
                </>
              ) : (
                `Pay ₹${totalAmount.toLocaleString('en-IN')} via Escrow`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
