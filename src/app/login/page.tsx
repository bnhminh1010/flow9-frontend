'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handlePinClick = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      setError('');

      if (newPin.length === 6) {
        handleLogin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleLogin = async (pinToUse: string) => {
    setIsLoading(true);
    try {
      await login(pinToUse);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid PIN');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      handlePinClick(e.key);
    } else if (e.key === 'Backspace') {
      handleDelete();
    }
  };

  return (
    <div
      className="flex min-h-screen bg-black text-[#FAFAFA] flex-col lg:flex-row focus:outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
      {/* Massive Typography Hero - Left Side (65%) */}
      <div className="w-full lg:w-[60%] flex flex-col justify-between p-8 xl:p-20 border-b lg:border-b-0 lg:border-r-2 border-[#555] relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="w-full h-full bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="z-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-[2px]">
            <svg className="text-black" fill="none" height="20" stroke="currentColor" strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" viewBox="0 0 24 24" width="20">
              <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
              <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
              <path d="M7 21h10"></path>
              <path d="M12 3v18"></path>
            </svg>
          </div>
          <span className="text-xs font-mono tracking-widest text-[#E4E4E7]">SYSTEM_LOGIN</span>
        </div>

        <div className="z-10 mt-16 lg:mt-0">
          <h1 className="text-[clamp(4rem,12vw,14rem)] leading-[0.85] font-black tracking-[-0.05em] uppercase mb-2">
            FLOW
            <br />
            <span className="text-[#E4E4E7]">NINE</span>
          </h1>
          <p className="font-mono text-sm tracking-widest text-[#A1A1AA] mt-6 flex items-center gap-4">
            <span className="w-8 border-b-2 border-white"></span>
            FINANCIAL OS v9.0
          </p>
        </div>

        <div className="z-10 mt-16 font-mono text-[10px] text-[#71717A] tracking-widest uppercase">
          Authorized personnel only. <br /> Access logging active.
        </div>
      </div>

      {/* PIN Pad - Right Side (40%) */}
      <div className="w-full lg:w-[40%] bg-[#0A0A0A] flex flex-col items-center justify-center p-8 md:p-16 relative">
        <div className="w-full max-w-[420px]">
          <div className="mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-black mb-4 tracking-tighter uppercase">AUTHENTICATE</h2>
            <p className="text-[#A1A1AA] text-xs lg:text-sm font-mono tracking-widest">ENTER 6-DIGIT SECURITY PIN TO UNLOCK</p>
          </div>

          {/* PIN Display */}
          <div className="flex gap-4 lg:gap-6 mb-12 lg:mb-16">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex-1 h-3 lg:h-4 transition-all duration-300 rounded-[2px] ${i < pin.length ? 'bg-[#22C55E] shadow-[0_0_16px_rgba(34,197,94,0.6)]' : 'bg-[#222]'
                  }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-8 p-4 bg-[#EF4444]/10 border-2 border-[#EF4444]/30 rounded-[2px] text-[#EF4444] text-xs lg:text-sm font-mono flex items-center gap-3">
              <span className="bg-[#EF4444] text-black px-2 py-1 font-bold">ERR</span> {error}
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handlePinClick(num.toString())}
                disabled={isLoading}
                className="h-16 lg:h-20 bg-[#111] border-2 border-[#555] text-[#FAFAFA] text-xl lg:text-3xl font-mono hover:bg-[#fff] hover:text-black hover:border-white active:scale-95 transition-all duration-300 rounded-[2px] disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="h-16 lg:h-20 bg-[#000] border-2 border-[#555] text-[#E4E4E7] text-sm lg:text-base tracking-widest font-mono hover:bg-[#222] active:scale-95 transition-all duration-300 rounded-[2px]"
            >
              DEL
            </button>
            <button
              onClick={() => handlePinClick('0')}
              disabled={isLoading}
              className="h-16 lg:h-20 bg-[#111] border-2 border-[#555] text-[#FAFAFA] text-xl lg:text-3xl font-mono hover:bg-[#fff] hover:text-black hover:border-white active:scale-95 transition-all duration-300 rounded-[2px] disabled:opacity-50"
            >
              0
            </button>
            <div className="h-16 lg:h-20 bg-transparent border-2 border-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
