import React from 'react';
import { Wifi } from 'lucide-react';

export default function CreditCardGraphic({
  bankName = 'HDFC Bank',
  cardVariant = 'Regalia',
  cardNetwork = 'VISA',
  last4Digits = '4821',
  variant = 'default', // 'default' | 'mini' | 'scanner'
  className = ''
}) {
  // Gradient mapping based on bank name
  const bank = (bankName || '').toLowerCase();
  let gradientClass = 'bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white'; // default HDFC purple
  if (bank.includes('icici')) {
    gradientClass = 'bg-gradient-to-br from-[#0D9488] to-[#047857] text-white'; // ICICI teal
  } else if (bank.includes('sbi')) {
    gradientClass = 'bg-gradient-to-br from-[#D97706] to-[#B45309] text-white'; // SBI amber
  } else if (bank.includes('axis') || bank.includes('kotak')) {
    gradientClass = 'bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white'; // Axis crimson
  }

  if (variant === 'mini') {
    return (
      <div className={`w-32 h-20 rounded-xl p-3 flex flex-col justify-between shadow-md select-none shrink-0 ${gradientClass} ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-tight">{bankName}</span>
          <Wifi className="w-2.5 h-2.5 opacity-80 rotate-90" />
        </div>
        <div className="text-[9px] font-mono tracking-widest text-slate-100">
          •••• {last4Digits}
        </div>
        <div className="flex items-center justify-between text-[8px] font-medium opacity-90">
          <span className="truncate max-w-[65px]">{cardVariant}</span>
          <span className="font-bold">{cardNetwork}</span>
        </div>
      </div>
    );
  }

  if (variant === 'scanner') {
    return (
      <div className={`w-72 sm:w-80 h-44 rounded-2xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden select-none ${gradientClass} ${className}`}>
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-36 h-36 bg-white/10 rounded-full blur-lg pointer-events-none"></div>

        <div className="flex items-center justify-between z-10">
          <span className="text-base font-bold tracking-wide uppercase">{bankName}</span>
          <Wifi className="w-5 h-5 opacity-80 rotate-90" />
        </div>

        {/* EMV Chip & Number */}
        <div className="z-10 my-auto">
          <div className="w-10 h-7 bg-amber-300/80 rounded-md border border-amber-400/70 mb-3 flex items-center justify-center shadow-inner">
            <div className="w-6 h-4 border border-amber-500/50 rounded-sm"></div>
          </div>
          <div className="text-xl font-mono tracking-[0.25em] text-white font-medium flex items-center gap-3">
            <span>••••</span>
            <span>••••</span>
            <span>••••</span>
            <span className="text-white font-bold">{last4Digits}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs z-10 font-medium">
          <span className="tracking-wide uppercase text-slate-200">{cardVariant} · {cardNetwork}</span>
          <span className="text-sm font-black tracking-wider uppercase">{cardNetwork}</span>
        </div>
      </div>
    );
  }

  // Default dashboard card layout (exactly matches Screenshot 2)
  return (
    <div className={`credit-card-surface w-full max-w-[320px] h-[175px] rounded-2xl p-5 flex flex-col justify-between shadow-lg select-none relative ${gradientClass} ${className}`}>
      {/* Top row: Bank name */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold tracking-tight text-white">{bankName}</h3>
        <Wifi className="w-4 h-4 opacity-75 rotate-90" />
      </div>

      {/* Middle row: Dots + last 4 digits */}
      <div className="text-lg font-mono tracking-[0.22em] text-slate-100 font-semibold my-auto">
        •••• &nbsp;•••• &nbsp;{last4Digits}
      </div>

      {/* Bottom row: Variant · Network */}
      <div className="flex items-center justify-between text-xs text-slate-100/90 font-medium">
        <span>{cardVariant} · {cardNetwork}</span>
        <span className="text-xs font-bold tracking-wider">{cardNetwork}</span>
      </div>
    </div>
  );
}
