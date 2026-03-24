'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Subscription } from '@/types';
import { CategoryIcon, getSubscriptionUrl } from '@/components/CategoryIcon';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

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
      if (editingSub) {
        await api.put(`/api/subscriptions/${editingSub._id}`, {
          name: formData.name,
          amount: parseFloat(formData.amount),
          billingCycle: formData.billingCycle,
          nextBillingDate: formData.nextBillingDate,
          category: formData.category,
          reminderDays: formData.reminderDays,
        });
      } else {
        await api.post('/api/subscriptions', {
          name: formData.name,
          amount: parseFloat(formData.amount),
          billingCycle: formData.billingCycle,
          nextBillingDate: formData.nextBillingDate,
          category: formData.category,
          reminderDays: formData.reminderDays,
        });
      }
      setShowForm(false);
      setEditingSub(null);
      resetForm();
      fetchSubscriptions();
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setFormData({
      name: sub.name,
      amount: sub.amount.toString(),
      billingCycle: sub.billingCycle,
      nextBillingDate: new Date(sub.nextBillingDate).toISOString().split('T')[0],
      category: sub.category,
      reminderDays: sub.reminderDays,
    });
    setShowForm(true);
  };

  const handleMarkPaid = async (id: string) => {
    try {
      setMarkingPaid(id);
      await api.post(`/api/subscriptions/${id}/pay`);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error marking as paid:', error);
    } finally {
      setMarkingPaid(null);
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

  const handleOpenUrl = (name: string) => {
    const url = getSubscriptionUrl(name);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert(`No URL configured for "${name}". You can manually visit the service.`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      billingCycle: 'monthly',
      nextBillingDate: '',
      category: 'Other',
      reminderDays: 2,
    });
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingSub(null);
    resetForm();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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

  const totalPaid = subscriptions.reduce((sum, s) => {
    const historyTotal = (s.paymentHistory || []).reduce((h, p) => h + p.amount, 0);
    return sum + historyTotal;
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
      {/* Header */}
      <header className="mb-6 lg:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.85] tracking-tighter uppercase mb-4 text-white">
            RECURRING <span className="text-[#333]">SUBS</span>
          </h2>
          <div className="font-mono text-xs tracking-widest text-[#A1A1AA] flex items-center gap-3">
            <span className="w-2 h-2 bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)] rounded-[1px]"></span> 
            {subscriptions.filter(s => s.isActive).length} Active | {totalPaid > 0 && `${formatCurrency(totalPaid)} paid`}
          </div>
        </div>
        <button
          data-tour="add-subscription-btn"
          onClick={() => { if (showForm) cancelEdit(); else setShowForm(true); }}
          className="font-mono text-xs uppercase tracking-widest text-black bg-white px-6 py-3 border-2 border-transparent hover:bg-[#A1A1AA] hover:text-white transition-colors rounded-[2px]"
        >
          {showForm ? '[ ABORT ]' : '[ + NEW_SUB ]'}
        </button>
      </header>

      <div className="">
        {/* Stats Row */}
        <div data-tour="subscription-summary" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 lg:p-8 bg-[#0A0A0A] border-2 border-[#333] rounded-[4px]">
            <span className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Monthly Burn</span>
            <h3 className="text-2xl lg:text-4xl font-black tracking-tighter text-[#EF4444]">
              {formatCurrency(monthlyTotal)}
            </h3>
          </div>
          <div className="p-6 lg:p-8 bg-[#0A0A0A] border-2 border-[#333] rounded-[4px]">
            <span className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Yearly Burn</span>
            <h3 className="text-2xl lg:text-4xl font-black tracking-tighter text-white">
              {formatCurrency(monthlyTotal * 12)}
            </h3>
          </div>
          <div className="p-6 lg:p-8 bg-[#0A0A0A] border-2 border-[#333] rounded-[4px]">
            <span className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Total Paid</span>
            <h3 className="text-2xl lg:text-4xl font-black tracking-tighter text-[#22C55E]">
              {formatCurrency(totalPaid)}
            </h3>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-12 p-8 lg:p-12 border-2 border-[#555] bg-[#0A0A0A] rounded-[2px] transition-colors duration-300">
            <h3 className="font-mono text-sm font-bold tracking-widest uppercase text-white mb-6 border-b-2 border-[#555] pb-4">
              {editingSub ? 'EDIT SUBSCRIPTION' : 'NEW SUBSCRIPTION'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  data-tour="billing-cycle"
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
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono outline-none focus:border-white transition-colors rounded-[2px] appearance-none"
                >
                  <option value="Streaming">Streaming</option>
                  <option value="Software">Software</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Reminder (days before)</label>
                <input
                  type="number"
                  value={formData.reminderDays}
                  onChange={(e) => setFormData({ ...formData, reminderDays: parseInt(e.target.value) || 0 })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono outline-none focus:border-white transition-colors rounded-[2px]"
                  min="0"
                  max="30"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-4 bg-[#111] text-[#E4E4E7] font-mono font-bold text-xs uppercase tracking-widest border-2 border-[#555] rounded-[2px] hover:border-white hover:text-white transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-[2px] hover:bg-[#A1A1AA] hover:text-white transition-colors"
                >
                  {editingSub ? 'UPDATE' : 'CREATE'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Grid View */}
        <div data-tour="subscription-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
          {subscriptions.map((sub) => {
            const daysUntil = getDaysUntil(sub.nextBillingDate);
            const segments = getCountdownSegments(daysUntil);
            const isUrgent = daysUntil <= 7 && daysUntil >= 0;
            const isPast = daysUntil < 0;
            const paymentCount = (sub.paymentHistory || []).length;
            const hasUrl = getSubscriptionUrl(sub.name);
            
            return (
              <div key={sub._id} className={`relative p-6 lg:p-8 rounded-[4px] bg-[#0A0A0A] hover:bg-[#111] border transition-all duration-500 group overflow-hidden ${isPast ? 'border-[#EF4444]/50' : isUrgent ? 'border-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-[#333] hover:border-[#555]'}`}>
                {isPast && <div className="absolute top-0 left-0 right-0 h-1 bg-[#EF4444]"></div>}
                {!isPast && isUrgent && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EF4444] to-[#B91C1C]"></div>}
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenUrl(sub.name)}
                      disabled={!hasUrl}
                      title={hasUrl ? `Open ${sub.name}` : 'No link available'}
                      className={`w-10 h-10 flex items-center justify-center text-lg border-2 transition-all duration-500 group-hover:border-white disabled:cursor-default disabled:opacity-60 ${isPast ? 'border-[#EF4444]/30 text-[#EF4444]/50' : 'border-[#333] bg-[#111] text-[#E4E4E7]'}`}
                    >
                      <CategoryIcon categoryName={sub.name} className="w-5 h-5" />
                    </button>
                    <div>
                      <h3 className="font-mono text-lg font-black text-white uppercase tracking-wider truncate">{sub.name}</h3>
                      <p className={`font-mono text-[10px] uppercase tracking-widest mt-1 ${isPast ? 'text-[#EF4444]' : isUrgent ? 'text-[#FAFAFA]' : 'text-[#71717A]'}`}>
                        {isPast ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days left`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-black tracking-tighter ${isPast ? 'text-[#EF4444]/70 line-through' : isUrgent ? 'text-[#EF4444]' : 'text-white'}`}>
                      {formatCurrency(sub.amount)}
                    </p>
                    <p className="text-[10px] font-mono text-[#A1A1AA]">
                      /{sub.billingCycle === 'weekly' ? 'WK' : sub.billingCycle === 'yearly' ? 'YR' : 'MO'}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div data-tour="upcoming-payments" className="flex gap-1 mb-4 h-2">
                  {segments.map((filled, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-[1px] transition-colors ${filled ? (isUrgent ? 'bg-[#EF4444]' : 'bg-white') : 'bg-[#222]'}`}
                    />
                  ))}
                </div>

                {/* Next billing */}
                <div className="font-mono text-[10px] text-[#71717A] mb-4">
                  Next: {formatDate(sub.nextBillingDate)}
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t-2 border-[#222] pt-4 mt-2">
                  <button
                    onClick={() => handleMarkPaid(sub._id)}
                    disabled={markingPaid === sub._id}
                    className={`flex-1 font-mono text-[10px] px-3 py-2 font-bold uppercase tracking-widest rounded-[2px] transition-colors ${
                      isPast 
                        ? 'bg-[#22C55E] text-black hover:bg-[#16A34A]' 
                        : 'bg-[#111] text-[#22C55E] border border-[#22C55E]/30 hover:border-[#22C55E] hover:bg-[#22C55E]/10'
                    } disabled:opacity-50`}
                  >
                    {markingPaid === sub._id ? 'PROCESSING...' : isPast ? '[ PAY NOW ]' : '[ MARK PAID ]'}
                  </button>
                  <button
                    onClick={() => handleEdit(sub)}
                    className="font-mono text-[10px] px-3 py-2 font-bold text-[#A1A1AA] border border-[#555] hover:border-white hover:text-white transition-colors rounded-[2px]"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="font-mono text-[10px] px-3 py-2 font-bold text-[#71717A] border border-[#333] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors rounded-[2px]"
                  >
                    DEL
                  </button>
                </div>

                {/* Payment History Toggle */}
                {paymentCount > 0 && (
                  <button
                    onClick={() => setShowHistory(showHistory === sub._id ? null : sub._id)}
                    className="w-full mt-3 font-mono text-[10px] text-[#71717A] hover:text-white transition-colors text-center"
                  >
                    {showHistory === sub._id ? '[ HIDE HISTORY ]' : `[ ${paymentCount} PAYMENT${paymentCount > 1 ? 'S' : ''} - CLICK TO VIEW ]`}
                  </button>
                )}

                {/* Payment History */}
                {showHistory === sub._id && sub.paymentHistory && sub.paymentHistory.length > 0 && (
                  <div className="mt-4 p-4 bg-[#050505] border border-[#333] rounded-[2px] max-h-48 overflow-y-auto">
                    <div className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest mb-3">Payment History</div>
                    <div className="space-y-2">
                      {sub.paymentHistory.slice().reverse().map((payment, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-[#71717A]">{formatDate(payment.date)}</span>
                          <span className="text-[#22C55E] font-bold">{formatCurrency(payment.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {subscriptions.length === 0 && (
          <div className="text-center py-20 border-2 border-[#555] bg-[#050505] rounded-[2px] mt-6">
            <p className="font-mono text-xs text-[#71717A] uppercase tracking-widest">Zero active subscriptions.</p>
            <p className="font-mono text-[10px] text-[#333] uppercase mt-2">Click [+ NEW_SUB] to add</p>
          </div>
        )}
      </div>
    </>
  );
}
