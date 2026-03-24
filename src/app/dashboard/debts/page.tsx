'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface Debt {
  _id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  paidAmount: number;
  monthlyPayment: number;
  lender: string;
  status: 'active' | 'paid' | 'overdue';
}

export default function DebtsPage() {
  const { t } = useLanguage();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [summary, setSummary] = useState({ totalDebt: 0, totalPaid: 0, activeCount: 0, overdueCount: 0 });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showPay, setShowPay] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [form, setForm] = useState({ name: '', totalAmount: '', monthlyPayment: '', startDate: '', lender: '' });

  const fetchData = async () => {
    try {
      const res = await api.get<{ debts: Debt[]; summary: typeof summary }>('/api/debts');
      setDebts(res.debts || []);
      setSummary(res.summary);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/debts', {
        name: form.name,
        totalAmount: parseFloat(form.totalAmount),
        monthlyPayment: parseFloat(form.monthlyPayment) || 0,
        startDate: form.startDate,
        lender: form.lender
      });
      setShowAdd(false);
      setForm({ name: '', totalAmount: '', monthlyPayment: '', startDate: '', lender: '' });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePay = async (id: string) => {
    if (!payAmount) return;
    try {
      await api.post(`/api/debts/${id}/payment`, { amount: parseFloat(payAmount) });
      setShowPay(null);
      setPayAmount('');
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('common.confirm') + '?')) return;
    await api.delete(`/api/debts/${id}`);
    fetchData();
  };

  const formatCurrency = (n: number) => new Intl.NumberFormat('vi-VN', { currency: 'VND', maximumFractionDigits: 0 }).format(n);

  if (loading) return <div className="flex items-center justify-center h-[50vh]"><div className="font-mono text-xs text-[#A1A1AA]">{t('common.loading')}</div></div>;

  return (
    <>
      {showPay && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0A0A] border border-[#555] rounded-[4px] p-6 w-full max-w-sm">
            <h3 className="font-mono text-lg font-bold text-white uppercase mb-4">{t('debts.makePayment').toUpperCase()}</h3>
            <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder={t('budget.amount')} className="w-full p-4 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px] mb-4" />
            <div className="flex gap-4">
              <button onClick={() => setShowPay(null)} className="flex-1 py-3 bg-[#222] text-[#A1A1AA] font-mono text-xs uppercase rounded-[2px]">{t('common.cancel').toUpperCase()}</button>
              <button onClick={() => handlePay(showPay)} className="flex-1 py-3 bg-white text-black font-mono font-bold text-xs uppercase rounded-[2px]">{t('debts.makePayment').toUpperCase()}</button>
            </div>
          </div>
        </div>
      )}

      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.85] tracking-tighter uppercase text-white">{t('debts.title')}</h2>
          <p className="font-mono text-xs text-[#A1A1AA] mt-2">{summary.activeCount} {t('common.active')} / {summary.overdueCount} {t('common.overdue')}</p>
        </div>
        <button data-tour="add-debt-btn" onClick={() => setShowAdd(!showAdd)} className="font-mono text-xs uppercase bg-white text-black px-4 py-2 rounded-[2px] hover:bg-[#A1A1AA]">
          {showAdd ? t('common.cancel').toUpperCase() : '+ ' + t('debts.addDebt').toUpperCase()}
        </button>
      </header>

      {showAdd && (
        <form onSubmit={handleAdd} className="mb-8 p-6 bg-[#0A0A0A] border border-[#333] rounded-[2px] grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder={t('budget.name') + ' (Vay mua xe)'} value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" required />
          <input type="text" placeholder={t('debts.lender') + ' (Ngân hàng ABC)'} value={form.lender} onChange={e => setForm({...form, lender: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" />
          <input type="number" placeholder={t('common.total') + ' ' + t('budget.amount')} value={form.totalAmount} onChange={e => setForm({...form, totalAmount: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" required />
          <input type="number" placeholder={t('debts.monthlyPayment')} value={form.monthlyPayment} onChange={e => setForm({...form, monthlyPayment: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" />
          <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" required />
          <button type="submit" className="py-3 bg-white text-black font-mono font-bold text-xs uppercase rounded-[2px]">{t('debts.addDebt').toUpperCase()}</button>
        </form>
      )}

      <div data-tour="debt-overview" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-[#0A0A0A] border border-[#333] rounded-[2px]"><span className="font-mono text-[10px] text-[#A1A1AA] uppercase">{t('debts.totalDebt')}</span><p className="font-mono text-2xl font-black text-[#EF4444] mt-1">{formatCurrency(summary.totalDebt)}</p></div>
        <div className="p-4 bg-[#0A0A0A] border border-[#333] rounded-[2px]"><span className="font-mono text-[10px] text-[#A1A1AA] uppercase">{t('debts.paid')}</span><p className="font-mono text-2xl font-black text-[#22C55E] mt-1">{formatCurrency(summary.totalPaid)}</p></div>
        <div className="p-4 bg-[#0A0A0A] border border-[#333] rounded-[2px]"><span className="font-mono text-[10px] text-[#A1A1AA] uppercase">{t('debts.remaining')}</span><p className="font-mono text-2xl font-black text-white mt-1">{formatCurrency(summary.totalDebt - summary.totalPaid)}</p></div>
        <div className="p-4 bg-[#0A0A0A] border border-[#333] rounded-[2px]"><span className="font-mono text-[10px] text-[#A1A1AA] uppercase">{t('debts.overdue')}</span><p className="font-mono text-2xl font-black text-[#EF4444] mt-1">{summary.overdueCount}</p></div>
      </div>

      <div data-tour="debt-list" className="space-y-4">
        {debts.map(debt => (
          <div key={debt._id} data-tour="payment-schedule" className={`p-6 bg-[#0A0A0A] border rounded-[2px] ${debt.status === 'paid' ? 'border-[#22C55E]' : debt.status === 'overdue' ? 'border-[#EF4444]' : 'border-[#333]'}`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <p className="font-mono font-bold text-white uppercase">{debt.name}</p>
                  <span className={`font-mono text-[10px] px-2 py-1 rounded-[2px] ${debt.status === 'paid' ? 'bg-[#22C55E]/20 text-[#22C55E]' : debt.status === 'overdue' ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#222] text-[#A1A1AA]'}`}>{debt.status.toUpperCase()}</span>
                </div>
                <div data-tour="debt-payoff-plan" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="font-mono text-[10px] text-[#71717A]">{t('common.total')}</p><p className="font-mono font-bold text-white">{formatCurrency(debt.totalAmount)}</p></div>
                  <div><p className="font-mono text-[10px] text-[#71717A]">{t('debts.paid')}</p><p className="font-mono font-bold text-[#22C55E]">{formatCurrency(debt.paidAmount)}</p></div>
                  <div><p className="font-mono text-[10px] text-[#71717A]">{t('debts.remaining')}</p><p className="font-mono font-bold text-[#EF4444]">{formatCurrency(debt.remainingAmount)}</p></div>
                  {debt.monthlyPayment > 0 && <div><p className="font-mono text-[10px] text-[#71717A]">{t('debts.monthlyPayment')}</p><p className="font-mono font-bold text-white">{formatCurrency(debt.monthlyPayment)}</p></div>}
                </div>
              </div>
              <div className="flex gap-2">
                {debt.status !== 'paid' && <button onClick={() => setShowPay(debt._id)} className="px-4 py-2 bg-[#22C55E] text-black font-mono text-[10px] font-bold uppercase rounded-[2px]">+ {t('debts.makePayment').toUpperCase()}</button>}
                <button onClick={() => handleDelete(debt._id)} className="px-3 py-2 border border-[#333] text-[#71717A] hover:text-[#EF4444] hover:border-[#EF4444] rounded-[2px]">{t('common.delete').toUpperCase()}</button>
              </div>
            </div>
          </div>
        ))}
        {debts.length === 0 && <div className="text-center py-16 border border-[#333] bg-[#050505] rounded-[2px]"><p className="font-mono text-sm text-[#71717A]">{t('debts.noDebts')}</p></div>}
      </div>
    </>
  );
}
