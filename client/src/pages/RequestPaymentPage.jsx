import React, { useState } from 'react';
import { Lock, ShieldCheck, CheckCircle2, Truck, Package, ArrowLeft } from 'lucide-react';
import RazorpayModal from '../components/RazorpayModal';

export default function RequestPaymentPage({
  order,
  onBack,
  onPaySuccess,
  onCancelRequest
}) {
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [currentStep, setCurrentStep] = useState(order?.step || 3);
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [awbInput, setAwbInput] = useState('AWB-FLIPKART-882194');

  const orderId = order?.id || 'CR-10428';
  const product = order?.product || 'Laptop 15"';
  const platform = order?.platform || 'Flipkart';
  const priceAfterOffer = order?.productPriceAfterOffer || 50000;
  const processingFee = order?.processingFee || 500;
  const gatewayCharges = order?.gatewayCharges || 100;
  const totalPayable = order?.totalPayable || 50600;

  // Stepper steps matching Screenshot 6
  const steps = [
    { id: 1, label: 'Request sent' },
    { id: 2, label: 'Owner approved' },
    { id: 3, label: 'Payment' },
    { id: 4, label: 'Order placed' },
    { id: 5, label: 'Delivered' }
  ];

  const handlePaymentSuccess = () => {
    setCurrentStep(4);
    if (onPaySuccess) {
      onPaySuccess({
        ...order,
        step: 4,
        status: 'Order placed'
      });
    }
  };

  const handleSimulateShipping = () => {
    setTrackingNumber(awbInput);
    setCurrentStep(5);
    if (onPaySuccess) {
      onPaySuccess({
        ...order,
        step: 5,
        status: 'Delivered',
        trackingNumber: awbInput,
        escrowReleased: true
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
      </button>

      {/* Header (matches Screenshot 6) */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Request & Payment
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Order #{orderId} · {product} on {platform}
        </p>
      </div>

      {/* Stepper Progress Bar (exact replica of Screenshot 6) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between relative">
          {/* Subtle line behind */}
          <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-slate-100 z-0 hidden sm:block"></div>

          {steps.map((st) => {
            const isCompleted = st.id < currentStep;
            const isCurrent = st.id === currentStep;

            return (
              <div key={st.id} className="flex flex-col items-center z-10 text-center flex-1">
                {/* Dot */}
                <div
                  className={`w-4 h-4 rounded-full mb-2.5 transition ${
                    isCompleted
                      ? 'bg-[#10B981]' // Green
                      : isCurrent
                      ? 'bg-[#4F46E5] ring-4 ring-indigo-100' // Active Blue
                      : 'bg-slate-300' // Upcoming Gray
                  }`}
                ></div>

                {/* Label */}
                <span
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? 'text-slate-900 font-bold'
                      : isCompleted
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Payment Summary Card (exact replica of Screenshot 6) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900">
          Payment Summary
        </h2>

        {/* Pricing Rows */}
        <div className="space-y-3.5 text-sm">
          <div className="flex items-center justify-between text-slate-700">
            <span>Product price (after card offer)</span>
            <span className="font-semibold text-slate-900">
              ₹ {priceAfterOffer.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span>Processing fee (1%)</span>
            <span className="font-semibold text-slate-900">
              ₹ {processingFee.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span>Payment gateway charges</span>
            <span className="font-semibold text-slate-900">
              ₹ {gatewayCharges.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Divider */}
          <div className="pt-2 border-t border-slate-200"></div>

          {/* Total Payable */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-base font-bold text-slate-900">Total payable</span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              ₹ {totalPayable.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Escrow Disclaimer Note (matches Screenshot 6) */}
        <div className="p-4 bg-[#EFF6FF] rounded-xl flex items-start gap-2.5 text-xs text-[#1E40AF] leading-relaxed">
          <Lock className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
          <span>
            Amount is held in escrow and released to the card owner only after the order is placed and tracking is confirmed.
          </span>
        </div>

        {/* Workflow actions depending on step */}
        {currentStep === 3 && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Pay Securely (Green button) */}
            <button
              type="button"
              onClick={() => setShowRazorpay(true)}
              className="px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl text-sm transition shadow-md shadow-emerald-500/20"
            >
              Pay Securely
            </button>

            {/* Cancel Request (Outline button) */}
            <button
              type="button"
              onClick={onCancelRequest}
              className="px-6 py-3.5 bg-white border border-indigo-200 text-[#4F46E5] hover:bg-indigo-50 font-bold rounded-xl text-sm transition"
            >
              Cancel Request
            </button>
          </div>
        )}

        {/* Step 4: Order Placed -> Card Owner Enters Tracking Info */}
        {currentStep === 4 && (
          <div className="p-5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <Package className="w-4 h-4 text-indigo-600" />
              <span>Card Owner Action: Purchase on {platform} & Provide Tracking</span>
            </div>
            <p className="text-xs text-slate-600">
              Escrow of ₹{totalPayable.toLocaleString('en-IN')} has been safely deposited. The card owner uses their own card to checkout to your delivery address.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={awbInput}
                onChange={(e) => setAwbInput(e.target.value)}
                placeholder="Enter Flipkart / Delhivery Tracking AWB"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleSimulateShipping}
                className="px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl text-xs transition"
              >
                Confirm Order & Dispatch
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Delivered & Escrow Released */}
        {currentStep >= 5 && (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Order Delivered & Escrow Released</h4>
            <p className="text-xs text-slate-600">
              Tracking: <span className="font-mono font-semibold">{trackingNumber || 'AWB-FLIPKART-882194'}</span>. Escrow payout of ₹{priceAfterOffer.toLocaleString('en-IN')} + ₹{processingFee} fee has been credited to the card owner.
            </p>
          </div>
        )}
      </div>

      {/* Razorpay Escrow Modal */}
      <RazorpayModal
        isOpen={showRazorpay}
        onClose={() => setShowRazorpay(false)}
        request={order}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
