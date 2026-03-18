'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function SettingsPage() {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPin !== confirmPin) {
      setMessage('ERR: New PIN mismatch');
      return;
    }

    if (newPin.length !== 6) {
      setMessage('ERR: PIN must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/change-pin', { oldPin, newPin });
      setMessage('SUCCESS: PIN matrix updated');
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    } catch (error: any) {
      setMessage(`ERR: ${error.message || 'Authorization failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
      
      {/* Header Statement */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.85] tracking-tighter uppercase mb-4 text-white">
            SYSTEM <span className="text-[#333]">CONFIG</span>
          </h2>
          <div className="font-mono text-xs tracking-widest text-[#A1A1AA] flex items-center gap-3">
            <span className="w-2 h-2 bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)] rounded-[1px]"></span> Parameters Loaded
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Change PIN -> Col span 7 */}
        <div className="lg:col-span-7">
          <div className="p-10 lg:p-16 bg-[#0A0A0A] border-2 border-[#333] rounded-[4px] relative overflow-hidden group transition-all duration-500 hover:border-[#666] hover:bg-[#111] shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            {/* Minimal Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
            
            <div className="relative z-10">
              <h3 className="font-mono text-sm font-bold tracking-widest uppercase text-white mb-8 border-b-2 border-[#222] pb-4">Security Credentials</h3>
              
              <form onSubmit={handleChangePin} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Current Access PIN</label>
                  <input
                    type="password"
                    value={oldPin}
                    onChange={(e) => setOldPin(e.target.value)}
                    className="w-full p-6 lg:p-8 bg-[#0A0A0A] border-2 border-[#555] text-white text-2xl font-mono tracking-[0.8em] font-bold outline-none focus:border-white transition-colors rounded-[2px]"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">New Access PIN</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full p-6 lg:p-8 bg-[#0A0A0A] border-2 border-[#555] text-white text-2xl font-mono tracking-[0.8em] font-bold outline-none focus:border-white transition-colors rounded-[2px]"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Confirm New PIN</label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full p-6 bg-[#0A0A0A] border-2 border-[#555] text-white text-2xl font-mono tracking-[0.8em] font-bold outline-none focus:border-white transition-colors rounded-[2px]"
                    maxLength={6}
                    required
                  />
                </div>
                
                {message && (
                  <div className={`p-4 border font-mono text-xs uppercase tracking-widest rounded-[2px] ${message.includes('SUCCESS') ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30' : 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30'}`}>
                    {message}
                  </div>
                )}
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-[2px] hover:bg-[#A1A1AA] hover:text-white disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'PROCESSING_REQUEST...' : 'OVERWRITE_CREDENTIALS'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* System Info -> Col span 5 */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-10 lg:p-12 bg-[#0A0A0A] border-2 border-[#333] rounded-[4px] shadow-lg relative overflow-hidden group transition-all duration-500 hover:border-[#666] hover:bg-[#111]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="font-mono text-sm font-bold tracking-widest uppercase text-white mb-8 border-b-2 border-[#222] pb-4 relative z-10">Runtime Identity</h3>
            
            <div className="space-y-4 font-mono text-xs text-[#FAFAFA] uppercase tracking-widest">
              <div className="flex justify-between items-end border-b-2 border-[#111] pb-2">
                <span className="text-[#E4E4E7] text-[10px]">App Name</span>
                <span>FLOW9 FINANCIAL OS</span>
              </div>
              <div className="flex justify-between items-end border-b-2 border-[#111] pb-2">
                <span className="text-[#E4E4E7] text-[10px]">Kernel Version</span>
                <span>9.0.0-STABLE</span>
              </div>
              <div className="flex justify-between items-end border-b-2 border-[#111] pb-2">
                <span className="text-[#E4E4E7] text-[10px]">Architecture</span>
                <span>BRUTALIST_MATRIX</span>
              </div>
              <div className="flex justify-between items-end border-b-2 border-[#111] pb-2">
                <span className="text-[#E4E4E7] text-[10px]">Stack</span>
                <span className="text-right">NEXT.JS / EXPRESS<br/><span className="text-[#A1A1AA]">MONGODB CORE</span></span>
              </div>
            </div>
            
            <div className="mt-12 text-center text-[#71717A] font-mono text-[9px] tracking-widest">
              // DESIGNED FOR PRECISION
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
