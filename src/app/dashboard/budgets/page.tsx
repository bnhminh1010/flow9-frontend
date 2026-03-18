'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Category } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface BudgetItem {
  _id: string;
  name: string;
  type: 'budget' | 'goal';
  category?: string;
  amount: number;
  spent: number;
  currentAmount: number;
  period?: string;
  deadline?: string;
  alertThreshold: number;
  status: string;
  percentage: number;
  remaining: number;
  isOverBudget?: boolean;
}

export default function BudgetsPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState({ totalBudget: 0, totalSpent: 0, totalGoals: 0, totalSaved: 0, budgetCount: 0, goalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<'budget' | 'goal'>('budget');
  const [form, setForm] = useState({ name: '', category: '', amount: '', period: 'monthly', deadline: '' });

  const fetchData = async () => {
    try {
      const [budgetRes, catRes] = await Promise.all([
        api.get<{ items: BudgetItem[]; summary: typeof summary }>('/api/budgets'),
        api.get<{ categories: Category[] }>('/api/categories')
      ]);
      setItems(budgetRes.items || []);
      setSummary(budgetRes.summary);
      setCategories(catRes.categories || []);
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
      await api.post('/api/budgets', {
        name: form.name,
        type: addType,
        category: form.category || undefined,
        amount: parseFloat(form.amount),
        period: addType === 'budget' ? form.period : undefined,
        deadline: form.deadline || undefined
      });
      setShowAdd(false);
      setForm({ name: '', category: '', amount: '', period: 'monthly', deadline: '' });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleContribute = async (id: string, amount: number) => {
    try {
      await api.post(`/api/budgets/${id}/contribute`, { amount });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('common.confirm') + '?')) return;
    try {
      await api.delete(`/api/budgets/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatCurrency = (n: number) => new Intl.NumberFormat('vi-VN', { currency: 'VND', maximumFractionDigits: 0 }).format(n);

  const budgets = items.filter(i => i.type === 'budget');
  const goals = items.filter(i => i.type === 'goal');

  if (loading) return <div className="flex items-center justify-center h-[50vh]"><div className="font-mono text-xs text-[#A1A1AA]">{t('common.loading')}</div></div>;

  return (
    <>
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.85] tracking-tighter uppercase text-white">{t('budget.title')}</h2>
          <p className="font-mono text-xs text-[#A1A1AA] mt-2">{budgets.length} {t('common.budgets')} / {goals.length} {t('common.goals')}</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="font-mono text-xs uppercase bg-white text-black px-4 py-2 rounded-[2px] hover:bg-[#A1A1AA]">
          {showAdd ? t('common.cancel').toUpperCase() : '+ ' + t('common.add').toUpperCase()}
        </button>
      </header>

      {showAdd && (
        <form onSubmit={handleAdd} className="mb-8 p-6 bg-[#0A0A0A] border border-[#333] rounded-[2px]">
          <div className="flex gap-2 mb-4">
            <button type="button" onClick={() => setAddType('budget')} className={`px-4 py-2 font-mono text-xs font-bold rounded-[2px] ${addType === 'budget' ? 'bg-white text-black' : 'bg-[#222] text-[#71717A]'}`}>{t('budget.budgets').toUpperCase()}</button>
            <button type="button" onClick={() => setAddType('goal')} className={`px-4 py-2 font-mono text-xs font-bold rounded-[2px] ${addType === 'goal' ? 'bg-white text-black' : 'bg-[#222] text-[#71717A]'}`}>{t('budget.goals').toUpperCase()}</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder={t('budget.name')} value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" required />
            {addType === 'budget' && (
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]">
                <option value="">{t('budget.category')}</option>
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            )}
            {addType === 'budget' && (
              <select value={form.period} onChange={e => setForm({...form, period: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]">
                <option value="monthly">{t('budget.monthly')}</option><option value="weekly">{t('budget.weekly')}</option><option value="yearly">{t('budget.yearly')}</option>
              </select>
            )}
            <input type="number" placeholder={addType === 'budget' ? t('budget.limit') + ' (VND)' : t('budget.target') + ' (VND)'} value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" required />
            {addType === 'goal' && (
              <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" />
            )}
          </div>
          <button type="submit" className="mt-4 w-full py-3 bg-white text-black font-mono font-bold text-xs uppercase rounded-[2px]">{t('budget.create').toUpperCase()}</button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-[#0A0A0A] border border-[#333] rounded-[2px]"><span className="font-mono text-[10px] text-[#A1A1AA] uppercase">{t('budget.totalBudget')}</span><p className="font-mono text-2xl font-black text-white mt-1">{formatCurrency(summary.totalBudget)}</p></div>
        <div className="p-4 bg-[#0A0A0A] border border-[#333] rounded-[2px]"><span className="font-mono text-[10px] text-[#A1A1AA] uppercase">{t('budget.spent')}</span><p className={`font-mono text-2xl font-black mt-1 ${summary.totalSpent > summary.totalBudget ? 'text-[#EF4444]' : 'text-white'}`}>{formatCurrency(summary.totalSpent)}</p></div>
        <div className="p-4 bg-[#0A0A0A] border border-[#333] rounded-[2px]"><span className="font-mono text-[10px] text-[#A1A1AA] uppercase">{t('budget.goalsTarget')}</span><p className="font-mono text-2xl font-black text-white mt-1">{formatCurrency(summary.totalGoals)}</p></div>
        <div className="p-4 bg-[#0A0A0A] border border-[#333] rounded-[2px]"><span className="font-mono text-[10px] text-[#A1A1AA] uppercase">{t('budget.saved')}</span><p className="font-mono text-2xl font-black text-[#22C55E] mt-1">{formatCurrency(summary.totalSaved)}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-[#0A0A0A] border border-[#333] rounded-[2px]">
          <h3 className="font-mono text-sm font-bold text-white uppercase mb-4 border-b border-[#222] pb-4">{t('budget.budgets').toUpperCase()}</h3>
          <div className="space-y-4">
            {budgets.map(b => (
              <div key={b._id} className="p-4 bg-[#050505] border border-[#333] rounded-[2px]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-mono text-sm font-bold text-white uppercase">{b.name}</p>
                    <p className="font-mono text-[10px] text-[#71717A]">{b.period} • {b.category || t('common.noData')}</p>
                  </div>
                  <button onClick={() => handleDelete(b._id)} className="text-[#71717A] hover:text-[#EF4444]">✕</button>
                </div>
                <div className="h-2 bg-[#111] rounded-[2px] overflow-hidden mb-2">
                  <div className={`h-full ${b.isOverBudget ? 'bg-[#EF4444]' : b.percentage >= b.alertThreshold ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'}`} style={{ width: `${Math.min(100, b.percentage)}%` }} />
                </div>
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-[#71717A]">{formatCurrency(b.spent)} / {formatCurrency(b.amount)}</span>
                  <span className={b.isOverBudget ? 'text-[#EF4444]' : 'text-[#22C55E]'}>{b.percentage}%</span>
                </div>
              </div>
            ))}
            {budgets.length === 0 && <p className="font-mono text-xs text-[#71717A] text-center py-8">{t('budget.noBudgets')}</p>}
          </div>
        </div>

        <div className="p-6 bg-[#0A0A0A] border border-[#333] rounded-[2px]">
          <h3 className="font-mono text-sm font-bold text-white uppercase mb-4 border-b border-[#222] pb-4">{t('budget.goals').toUpperCase()}</h3>
          <div className="space-y-4">
            {goals.map(g => (
              <div key={g._id} className={`p-4 bg-[#050505] border rounded-[2px] ${g.status === 'completed' ? 'border-[#22C55E]' : 'border-[#333]'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-mono text-sm font-bold text-white uppercase">{g.name}</p>
                    {g.deadline && <p className="font-mono text-[10px] text-[#71717A]">{t('budget.deadline')}: {new Date(g.deadline).toLocaleDateString('vi-VN')}</p>}
                  </div>
                  <button onClick={() => handleDelete(g._id)} className="text-[#71717A] hover:text-[#EF4444]">✕</button>
                </div>
                <div className="h-3 bg-[#111] rounded-[2px] overflow-hidden mb-2">
                  <div className={`h-full ${g.status === 'completed' ? 'bg-[#22C55E]' : 'bg-[#0D9488]'}`} style={{ width: `${g.percentage}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-[#71717A]">{formatCurrency(g.currentAmount)} / {formatCurrency(g.amount)}</span>
                  {g.status !== 'completed' && (
                    <button onClick={() => { const amt = prompt(t('budget.contribute') + ':'); if (amt) handleContribute(g._id, parseFloat(amt)); }} className="px-3 py-1 bg-[#0D9488] text-white font-mono text-[10px] font-bold rounded-[2px]">+ {t('common.add').toUpperCase()}</button>
                  )}
                </div>
              </div>
            ))}
            {goals.length === 0 && <p className="font-mono text-xs text-[#71717A] text-center py-8">{t('budget.noGoals')}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
