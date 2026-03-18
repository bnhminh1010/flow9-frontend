'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { LayoutDashboard, BookText, Target, Repeat, Banknote, TrendingUp, CreditCard, Settings, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/dashboard', labelKey: 'nav.overview', icon: LayoutDashboard },
  { href: '/dashboard/ledger', labelKey: 'nav.ledger', icon: BookText },
  { href: '/dashboard/budgets', labelKey: 'nav.budget', icon: Target },
  { href: '/dashboard/subscriptions', labelKey: 'nav.subscriptions', icon: Repeat, shortLabel: 'SUBS' },
  { href: '/dashboard/payroll', labelKey: 'nav.payroll', icon: Banknote },
  { href: '/dashboard/investments', labelKey: 'nav.invest', icon: TrendingUp },
  { href: '/dashboard/debts', labelKey: 'nav.debts', icon: CreditCard },
  { href: '/dashboard/settings', labelKey: 'nav.config', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#000000] overflow-x-hidden" style={{ padding: 'clamp(12px, 2vw, 32px) clamp(24px, 4vw, 64px)', boxSizing: 'border-box' }}>
      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col min-w-0 pb-16">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6 lg:mb-10 px-2 lg:px-4">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white flex items-center justify-center rounded-[2px] hover:bg-[#A1A1AA] transition-colors cursor-pointer" title="Flow9 Identity">
              <svg className="text-black w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                <path d="M7 21h10"></path>
                <path d="M12 3v18"></path>
              </svg>
            </div>
            <span className="font-mono text-sm lg:text-base font-bold tracking-widest uppercase text-white">Flow9._</span>
          </div>
          
          {/* Desktop logout */}
          <button 
            onClick={logout}
            className="hidden lg:block font-mono text-xs uppercase tracking-widest text-[#E4E4E7] hover:text-[#FAFAFA] border-2 border-[#A1A1AA] hover:border-[#E4E4E7] px-4 py-2 bg-[#0A0A0A] hover:bg-[#111] transition-colors rounded-[4px]"
          >
            {t('logout')}
          </button>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-white hover:bg-[#222] rounded-[2px]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Content inject */}
        <div className="flex-1 relative z-10">
          {children}
        </div>

        {/* Anti-Gravity Dock Clearance Void */}
        <div className="h-24 lg:h-48 w-full shrink-0" aria-hidden="true"></div>
      </main>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A] border-t-2 border-[#555] rounded-t-[8px] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#333]">
              <span className="font-mono text-sm font-bold tracking-widest uppercase text-white">Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white hover:bg-[#333] rounded-[2px]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Nav Items */}
            <nav className="p-4 pb-8 grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-4 rounded-[4px] transition-all ${
                      isActive 
                        ? 'bg-white text-black' 
                        : 'bg-[#1a1a1a] text-[#A1A1AA] hover:bg-[#333] hover:text-white'
                    }`}
                  >
                    <item.icon className="w-6 h-6" strokeWidth={2} />
                    <span className="font-mono text-sm font-bold tracking-wider uppercase">
                      {item.shortLabel || t(item.labelKey)}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout button */}
            <div className="p-4 border-t border-[#333]">
              <button 
                onClick={logout}
                className="w-full py-4 bg-[#EF4444] text-white font-mono text-sm font-bold uppercase tracking-widest rounded-[4px] hover:bg-[#DC2626] transition-colors"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Floating Dock */}
      <div className="hidden lg:block fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <nav className="flex items-center gap-1 p-1.5 bg-[#050505] backdrop-blur-3xl border-2 border-[#555] hover:border-[#FAFAFA] rounded-[4px] shadow-[0_0_40px_rgba(0,0,0,1)] transition-colors duration-500">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center w-20 h-16 gap-1 rounded-[2px] transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#222]'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-8 h-[4px] bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,1)]" />
                )}
                <item.icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:-translate-y-1'}`} strokeWidth={2} />
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold mt-0.5">{item.shortLabel || t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
