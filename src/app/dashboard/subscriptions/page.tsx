'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Subscription } from '@/types';
import { CategoryIcon } from '@/components/CategoryIcon';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    billingCycle: 'monthly',
    nextBillingDate: '',
    category: 'Other',
    reminderDays: 2,
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get<{ subscriptions: Subscription[] }>('/api/subscriptions');
      setSubscriptions(res.subscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/subscriptions', {
        name: formData.name,
        amount: parseFloat(formData.amount),
        billingCycle: formData.billingCycle,
        nextBillingDate: formData.nextBillingDate,
        category: formData.category,
        reminderDays: formData.reminderDays,
      });
      setShowForm(false);
      setFormData({
        name: '',
        amount: '',
        billingCycle: 'monthly',
        nextBillingDate: '',
        category: 'Other',
        reminderDays: 2,
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;
    try {
      await api.delete(`/api/subscriptions/${id}`);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntil = (date: string) => {
    const now = new Date();
    const target = new Date(date);
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getCountdownSegments = (days: number) => {
    const segments = 10;
    const filled = Math.max(0, Math.min(segments, segments - Math.floor(days / 3)));
    return Array(segments).fill(0).map((_, i) => i < filled);
  };

  const monthlyTotal = subscriptions
    .filter((s) => s.isActive)
    .reduce((sum, s) => {
      if (s.billingCycle === 'yearly') return sum + s.amount / 12;
      if (s.billingCycle === 'weekly') return sum + s.amount * 4.33;
      return sum + s.amount;
    }, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="w-24 h-1 bg-[#222] overflow-hidden rounded-[2px] relative">
          <div className="absolute top-0 left-0 h-full w-full bg-[#333]"></div>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[#A1A1AA]">Fetching Watchlist...</div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
      
      {/* Header Statement */}
      <header className="mb-6 lg:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.85] tracking-tighter uppercase mb-4 text-white">
            RECURRING <span className="text-[#333]">SUBS</span>
          </h2>
          <div className="font-mono text-xs tracking-widest text-[#A1A1AA] flex items-center gap-3">
            <span className="w-2 h-2 bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)] rounded-[1px]"></span> Monitoring Active
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-mono text-xs uppercase tracking-widest text-black bg-white px-6 py-3 border-2 border-transparent hover:bg-[#A1A1AA] hover:text-white transition-colors rounded-[2px]"
        >
          {showForm ? '[ ABORT ]' : '[ + NEW_SUB ]'}
        </button>
      </header>

      <div className="">
        {/* Total Monthly */}
        <div className="lg:col-span-12 p-8 lg:p-12 bg-[#0A0A0A] border-2 border-[#333] rounded-[4px] relative overflow-hidden group transition-all duration-500 hover:border-[#666] hover:bg-[#111] hover:shadow-[0_0_40px_rgba(255,255,255,0.03)] shadow-lg">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
          <span className="font-mono text-xs text-[#E4E4E7] uppercase tracking-widest">Total Monthly Burn</span>
          <h3 className="text-4xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] to-[#B91C1C] drop-shadow-[0_0_12px_rgba(239,68,68,0.2)]">
            {formatCurrency(monthlyTotal)}
          </h3>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-12 p-10 lg:p-12 border-2 border-[#555] bg-[#0A0A0A] rounded-[2px] transition-colors duration-300 hover:border-white">
            <h3 className="font-mono text-sm font-bold tracking-widest uppercase text-white mb-8 border-b-2 border-[#555] pb-4">New Subscription Record</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono outline-none focus:border-white transition-colors rounded-[2px]"
                  placeholder="e.g. Netflix"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Amount (VND)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono outline-none focus:border-white transition-colors rounded-[2px]"
                  placeholder="0"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Billing Cycle</label>
                <select
                  value={formData.billingCycle}
                  onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono outline-none focus:border-white transition-colors rounded-[2px] appearance-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Next Billing Date</label>
                <input
                  type="date"
                  value={formData.nextBillingDate}
                  onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-[#E4E4E7] focus:text-white font-mono outline-none focus:border-white transition-colors rounded-[2px]"
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-[2px] hover:bg-[#A1A1AA] hover:text-white transition-colors w-full md:w-auto"
                >
                  COMMIT_RECORD
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Grid View */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 w-full">
          {subscriptions.map((sub) => {
            const daysUntil = getDaysUntil(sub.nextBillingDate);
            const segments = getCountdownSegments(daysUntil);
            const isUrgent = daysUntil <= 7;
            
            return (
              <div key={sub._id} className={`relative p-8 lg:p-10 rounded-[4px] bg-[#0A0A0A] hover:bg-[#111] border transition-all duration-500 group overflow-hidden ${isUrgent ? 'border-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-[#333] hover:border-[#555] hover:shadow-xl hover:-translate-y-1'}`}>
                {isUrgent && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EF4444] to-[#B91C1C]"></div>}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 flex items-center justify-center text-xl border-2 ${isUrgent ? 'border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]' : 'border-[#333] bg-[#111] text-[#E4E4E7]'} rounded-[2px] transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-black`}>
                      <CategoryIcon categoryName={sub.category} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-mono text-xl font-black text-white uppercase tracking-widest truncate">{sub.name}</h3>
                      <p className={`font-mono text-[10px] uppercase tracking-widest mt-1.5 ${isUrgent ? 'text-[#FAFAFA]' : 'text-[#71717A]'}`}>
                        {daysUntil} days left
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black tracking-tighter ${isUrgent ? 'text-[#EF4444]' : 'text-white'}`}>
                      {formatCurrency(sub.amount)}
                      <span className="text-[10px] font-mono font-normal text-[#A1A1AA] ml-1 block mt-1 tracking-widest">
                        /{sub.billingCycle === 'weekly' ? 'WK' : sub.billingCycle === 'yearly' ? 'YR' : 'MO'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-1.5 mb-6 h-3">
                  {segments.map((filled, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-[1px] transition-colors ${filled ? (isUrgent ? 'bg-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.8)]' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]') : 'bg-[#222]'}`}
                    />
                  ))}
                </div>

                <div className="flex justify-end relative z-10 border-t-2 border-[#222] pt-4 mt-2">
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="font-mono text-[10px] px-3 py-1.5 font-bold text-[#71717A] bg-[#111] border-2 border-[#333] hover:border-[#EF4444] hover:text-white hover:bg-[#EF4444] transition-colors rounded-[2px] uppercase opacity-0 group-hover:opacity-100"
                  >
                    [ DELETE_NODE ]
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {subscriptions.length === 0 && (
          <div className="text-center py-20 border-2 border-[#555] bg-[#050505] rounded-[2px] mt-6">
            <p className="font-mono text-xs text-[#71717A] uppercase tracking-widest">Zero active subscriptions.</p>
            <p className="font-mono text-[10px] text-[#333] uppercase mt-2">Database is empty</p>
          </div>
        )}
      </div>
    </>
  );
}
