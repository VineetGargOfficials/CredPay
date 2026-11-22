import React, { useState } from 'react';
import { ShieldCheck, CreditCard, ShoppingBag, UserCheck, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('vineet@example.com');
  const [password, setPassword] = useState('Vineet@123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 4 classified demo accounts
  const demoAccounts = [
    {
      name: 'Vineet Sharma',
      email: 'vineet@example.com',
      password: 'Vineet@123',
      role: 'owner',
      classification: 'Multiple Cards',
      cardCount: '3 Cards Listed',
      badgeColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      icon: CreditCard,
      description: 'HDFC Regalia, ICICI Amazon Pay, SBI Cashback'
    },
    {
      name: 'Priya Patel',
      email: 'priya@example.com',
      password: 'Priya@123',
      role: 'owner',
      classification: 'One Card',
      cardCount: '1 Card Listed',
      badgeColor: 'bg-purple-50 border-purple-200 text-purple-700',
      icon: CreditCard,
      description: 'Axis Bank Flipkart Axis card only'
    },
    {
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      password: 'Rahul@123',
      role: 'seeker',
      classification: 'None / Shopper',
      cardCount: '0 Cards (Shopper)',
      badgeColor: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      icon: ShoppingBag,
      description: 'Finds offers & deposits in Escrow'
    },
    {
      name: 'Ananya Singh',
      email: 'ananya@example.com',
      password: 'Ananya@123',
      role: 'seeker',
      classification: 'None / New User',
      cardCount: '0 Cards (New)',
      badgeColor: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: UserCheck,
      description: 'Fresh user, pending KYC'
    }
  ];

  const handleSelectDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.user) {
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.error || 'Authentication failed');
      }
    } catch (err) {
      // Fallback in case of network issue
      setLoading(false);
      const matched = demoAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());
      onLoginSuccess(matched || {
        id: 'usr_001',
        name: email.split('@')[0],
        email: email,
        role: 'owner',
        classification: 'Multiple Cards',
        isKycVerified: true,
        stats: { listedCards: 3, activeRequests: 5, ordersCompleted: 18, feeEarned: 4250 }
      });
    }
  };

  const handleGoogleLogin = () => {
    onLoginSuccess({
      id: 'usr_001',
      name: 'Vineet Sharma (Google)',
      email: 'vineet@example.com',
      role: 'owner',
      classification: 'Multiple Cards',
      isKycVerified: true,
      stats: { listedCards: 3, activeRequests: 5, ordersCompleted: 18, feeEarned: 4250 }
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F3F8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Card: Exact Login Page from Screenshot 1 */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 sm:p-10 border border-slate-100">
          {/* App Grid Icon */}
          <div className="w-12 h-12 rounded-xl bg-[#4F46E5] flex items-center justify-center mx-auto mb-5 shadow-sm">
            <div className="grid grid-cols-2 gap-1 w-5 h-5">
              <div className="bg-white rounded-[1px]"></div>
              <div className="bg-white rounded-[1px]"></div>
              <div className="bg-white rounded-[1px]"></div>
              <div className="bg-white rounded-[1px]"></div>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <h1 className="text-2xl font-extrabold text-slate-900 text-center tracking-tight">
            Welcome to CredPay
          </h1>
          <p className="text-sm text-slate-500 text-center mt-1 mb-6">
            Login to list your card or find offers
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vineet@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl text-base transition shadow-lg shadow-indigo-500/20 flex items-center justify-center"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 text-center">
            <span className="text-xs text-slate-400 font-medium">or continue with</span>
          </div>

          {/* Google Continue */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 border border-indigo-200 rounded-xl text-sm font-semibold text-[#4F46E5] hover:bg-indigo-50/50 transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={() => {
                setEmail('ananya@example.com');
                setPassword('Ananya@123');
              }}
              className="font-bold text-[#4F46E5] hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Right Card: 4 Classified Account Presets (One-Click Testing) */}
        <div className="lg:col-span-5 bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-7 border border-slate-100 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">Classified Accounts</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                4 Logins
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Click any account below to auto-fill credentials & test their specific dashboard:
            </p>
          </div>

          <div className="space-y-3">
            {demoAccounts.map((acc, idx) => {
              const isSelected = email.toLowerCase() === acc.email.toLowerCase();
              const Icon = acc.icon;

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectDemo(acc)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'border-[#4F46E5] bg-indigo-50/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 mt-0.5">
                      {acc.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{acc.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${acc.badgeColor}`}>
                          {acc.classification}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5">{acc.email}</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">
                        Password: <strong className="text-slate-600">{acc.password}</strong>
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                        • {acc.description}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectDemo(acc);
                    }}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition shrink-0 ${
                      isSelected
                        ? 'bg-[#4F46E5] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Use'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 leading-relaxed border border-slate-100">
            💾 <strong>MongoDB Ready:</strong> These 4 users and their card configurations are also stored in <code className="text-indigo-600 font-mono font-bold">server/mongo-data/*.json</code> and can be uploaded/imported directly to MongoDB Compass or Atlas.
          </div>
        </div>

      </div>
    </div>
  );
}
