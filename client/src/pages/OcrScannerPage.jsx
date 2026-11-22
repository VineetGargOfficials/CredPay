import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, Upload, Check } from 'lucide-react';
import CreditCardGraphic from '../components/CreditCardGraphic';

export default function OcrScannerPage({ onConfirmScan, onBack }) {
  // Available card presets for instant testing
  const presets = [
    {
      bankName: "HDFC Bank",
      cardNetwork: "VISA",
      cardVariant: "Regalia",
      last4Digits: "4821",
      fullDigits: "4532 •••• •••• 4821",
      suggestedOffers: [
        "10% instant discount on Flipkart",
        "5% instant discount on Amazon",
        "No-cost EMI"
      ],
      limitAvailable: "₹ 1,50,000"
    },
    {
      bankName: "ICICI Bank",
      cardNetwork: "VISA",
      cardVariant: "Amazon Pay",
      last4Digits: "7302",
      fullDigits: "4315 •••• •••• 7302",
      suggestedOffers: [
        "5% unlimited cashback on Amazon",
        "15% off on Zomato",
        "No-cost EMI on electronics"
      ],
      limitAvailable: "₹ 2,00,000"
    },
    {
      bankName: "SBI Card",
      cardNetwork: "MasterCard",
      cardVariant: "Cashback",
      last4Digits: "1190",
      fullDigits: "5241 •••• •••• 1190",
      suggestedOffers: [
        "5% cashback on Flipkart & Amazon",
        "Complimentary domestic lounge access"
      ],
      limitAvailable: "₹ 80,000"
    },
    {
      bankName: "Axis Bank",
      cardNetwork: "VISA",
      cardVariant: "Flipkart Axis",
      last4Digits: "6034",
      fullDigits: "4111 •••• •••• 6034",
      suggestedOffers: [
        "7.5% instant discount on Flipkart",
        "4% cashback on Swiggy and Uber"
      ],
      limitAvailable: "₹ 1,20,000"
    }
  ];

  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);
  const [extractedData, setExtractedData] = useState(presets[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  // Trigger scanning animation
  const triggerScan = (index) => {
    setIsScanning(true);
    setScanComplete(false);
    setSelectedPresetIndex(index);

    setTimeout(() => {
      setExtractedData(presets[index]);
      setIsScanning(false);
      setScanComplete(true);
    }, 900);
  };

  // Toggle live camera
  const toggleCamera = async () => {
    if (!isCameraActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (err) {
        alert("Camera permission denied or camera not found. Using high-resolution simulated OCR scan.");
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      setIsCameraActive(false);
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleConfirm = () => {
    onConfirmScan(extractedData);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header matching Screenshot 4 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            OCR Card Scanner
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Place the card inside the frame and capture
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          Back to Add Card
        </button>
      </div>

      {/* Preset switcher for instant realistic scanning */}
      <div className="mb-6 flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 mr-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Test Sample Cards:
        </span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => triggerScan(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedPresetIndex === idx
                ? 'bg-[#4F46E5] text-white font-bold shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {preset.bankName} {preset.cardVariant}
          </button>
        ))}

        <button
          type="button"
          onClick={toggleCamera}
          className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5"
        >
          <Camera className="w-3.5 h-3.5 text-slate-600" />
          {isCameraActive ? 'Stop Live Camera' : 'Live Camera'}
        </button>
      </div>

      {/* Main 2-Column Section (exact layout matching Screenshot 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dark camera container (55%) */}
        <div className="lg:col-span-7 bg-[#111827] rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden shadow-2xl">
          {/* Subtle camera crosshairs */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-slate-700"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-slate-700"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-slate-700"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-slate-700"></div>

          {/* If live camera active */}
          {isCameraActive && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
            />
          )}

          {/* Glowing Green Dotted Detection Frame */}
          <div className="relative p-3 rounded-3xl border-2 border-dashed border-[#10B981] scanner-frame-detected">
            {/* Realtime Laser Scan Sweep */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#10B981] to-transparent laser-bar z-30 shadow-[0_0_12px_#10B981]"></div>
            )}

            {/* Visual Card inside Scanner */}
            <CreditCardGraphic
              bankName={extractedData.bankName}
              cardVariant={extractedData.cardVariant}
              cardNetwork={extractedData.cardNetwork}
              last4Digits={extractedData.last4Digits}
              variant="scanner"
            />
          </div>

          {/* Bottom Detection Status (matches Screenshot 4: "● Card detected — hold steady") */}
          <div className="mt-8 flex items-center gap-2 text-sm font-medium text-[#10B981]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-[#10B981] -ml-4.5"></span>
            <span>Card detected — hold steady</span>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            Optical Character Recognition Confidence: 99.4%
          </div>
        </div>

        {/* Right Column: Details Extracted Card (45%) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Details Extracted
          </h2>

          {/* Key-Value Details (matches Screenshot 4) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500">Bank</span>
              <span className="text-sm font-bold text-slate-900">{extractedData.bankName}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500">Network</span>
              <span className="text-sm font-bold text-slate-900">{extractedData.cardNetwork}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500">Variant</span>
              <span className="text-sm font-bold text-slate-900">{extractedData.cardVariant}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500">Last 4 digits</span>
              <span className="text-sm font-bold font-mono text-slate-900">{extractedData.last4Digits}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500">Full number / CVV</span>
              {/* Screenshot 4 Golden Pill: Discarded */}
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-[#FEF3C7] text-[#D97706]">
                Discarded
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Please verify the details before saving.
          </p>

          {/* Action Buttons (matches Screenshot 4: Confirm & Save (green), Rescan (outlined)) */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl text-sm transition shadow-md shadow-emerald-500/20"
            >
              Confirm & Save
            </button>

            <button
              type="button"
              onClick={() => triggerScan((selectedPresetIndex + 1) % presets.length)}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm border border-slate-300 transition"
            >
              Rescan
            </button>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 leading-relaxed flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>PCI-DSS Safe:</strong> All CVV numbers and 16-digit PANs are wiped from device memory immediately after verifying card authenticity.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
