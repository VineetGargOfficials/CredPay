import React from 'react';
import { ShieldCheck, User, LogOut, ArrowRightLeft, Bell } from 'lucide-react';

export default function Navbar({
  activeTab = 'dashboard',
  setActiveTab,
  user,
  onLogout,
  onOpenKyc
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my-cards', label: 'My Cards' },
    { id: 'find-offers', label: 'Find Offers' },
    { id: 'requests', label: 'Requests' },
    { id: 'earnings', label: 'Earnings' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          {/* Exact purple 4-block grid icon from screenshot */}
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center p-1.5 shadow-sm group-hover:bg-[#4338CA] transition">
            <div className="grid grid-cols-2 gap-1 w-full h-full">
              <div className="bg-white rounded-[1.5px]"></div>
              <div className="bg-white rounded-[1.5px]"></div>
              <div className="bg-white rounded-[1.5px]"></div>
              <div className="bg-white rounded-[1.5px]"></div>
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Cred<span className="text-[#4F46E5]">Pay</span>
          </span>
        </div>

        {/* Navigation Tabs (matching exact screenshot font & colors) */}
        <nav className="hidden md:flex items-center space-x-7">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-semibold transition py-1 relative ${
                  isActive
                    ? 'text-[#4F46E5]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5] rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* KYC Badge */}
          {user?.isKycVerified ? (
            <button 
              onClick={onOpenKyc}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
              title="Identity & Bank account verified"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              KYC Verified
            </button>
          ) : (
            <button
              onClick={onOpenKyc}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
            >
              Verify KYC
            </button>
          )}

          {/* User Profile dropdown */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {user?.name || 'Vineet Sharma'}
              </div>
              <div className="text-[11px] text-indigo-600 font-semibold capitalize">
                {user?.classification ? `${user.classification} (${user.role === 'owner' ? 'Owner' : 'Shopper'})` : 'Card Owner & Shopper'}
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-[#4F46E5] font-bold text-xs">
              {user?.name ? user.name[0] : 'V'}
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2 bg-slate-50 overflow-x-auto text-xs px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1 font-medium rounded-md whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-50 text-[#4F46E5] font-bold'
                  : 'text-slate-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
