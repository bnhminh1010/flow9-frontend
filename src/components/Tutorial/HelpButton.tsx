'use client';

import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const guides = [
  { id: 'dashboard', name: 'OVERVIEW', path: '/dashboard', icon: '01' },
  { id: 'ledger', name: 'LEDGER', path: '/dashboard/ledger', icon: '02' },
  { id: 'budgets', name: 'BUDGETS', path: '/dashboard/budgets', icon: '03' },
  { id: 'subscriptions', name: 'SUBSCRIPTIONS', path: '/dashboard/subscriptions', icon: '04' },
  { id: 'payroll', name: 'PAYROLL', path: '/dashboard/payroll', icon: '05' },
  { id: 'investments', name: 'INVESTMENTS', path: '/dashboard/investments', icon: '06' },
  { id: 'debts', name: 'DEBTS', path: '/dashboard/debts', icon: '07' },
  { id: 'settings', name: 'SETTINGS', path: '/dashboard/settings', icon: '08' },
];

interface HelpButtonProps {
  onStartTour: (tourId: string) => void;
}

export default function HelpButton({ onStartTour }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleGuideClick = (guide: typeof guides[0]) => {
    if (guide.path !== window.location.pathname) {
      router.push(guide.path);
      setTimeout(() => {
        onStartTour(guide.id);
      }, 500);
    } else {
      onStartTour(guide.id);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-mono text-xs uppercase tracking-widest text-[#E4E4E7] hover:text-[#FAFAFA] border-2 border-[#A1A1AA] hover:border-[#E4E4E7] px-4 py-2 bg-[#0A0A0A] hover:bg-[#111] transition-colors rounded-[4px] flex items-center gap-2"
        title="Help"
      >
        <HelpCircle className="w-4 h-4" />
        <span className="hidden lg:inline">GUIDE</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative bg-[#0A0A0A] border-2 border-[#555] rounded-[4px] p-8 w-full max-w-md mx-4 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between mb-8 border-b-2 border-[#333] pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white flex items-center justify-center rounded-[2px]">
                  <HelpCircle className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest">USER GUIDE</h3>
                  <p className="font-mono text-[10px] text-[#71717A] tracking-widest mt-1">SELECT_MODULE_TO_START_</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="font-mono text-xl text-[#71717A] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {guides.map((guide, idx) => (
                <button
                  key={guide.id}
                  onClick={() => handleGuideClick(guide)}
                  className="group relative p-4 bg-[#050505] border-2 border-[#333] hover:border-white transition-all rounded-[2px] text-left"
                >
                  <div className="absolute top-1 right-1 font-mono text-[10px] text-[#333] group-hover:text-[#555] transition-colors">
                    {guide.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-[#A1A1AA] group-hover:text-white uppercase tracking-widest transition-colors">
                    {guide.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
