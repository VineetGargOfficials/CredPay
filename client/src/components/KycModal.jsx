import React, { useState } from 'react';
import { X, ShieldCheck, Check, Fingerprint, FileText } from 'lucide-react';

export default function KycModal({ isOpen, onClose, onVerifySuccess }) {
  const [aadhaar, setAadhaar] = useState('5642 9812 7701');
  const [pan, setPan] = useState('ABCDE1234F');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
      setTimeout(() => {
        onVerifySuccess();
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">KYC Verification</h3>
              <p className="text-xs text-slate-500">Fast identity check via DigiLocker / UIDAI</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {verified ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Identity Verified</h4>
            <p className="text-xs text-slate-600">Your account is now approved for safe card listing & offer sharing.</p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-indigo-500" /> Aadhaar Card Number
              </label>
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="XXXX XXXX XXXX"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" /> PAN Card Number
              </label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-600 leading-relaxed">
              🔒 <strong>Bank-Grade Compliance:</strong> CredPay complies with RBI guidelines and ensures secure zero-trust verification. No card PIN or OTP is ever requested.
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl text-sm transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying with UIDAI...
                </>
              ) : (
                'Confirm & Verify KYC'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
