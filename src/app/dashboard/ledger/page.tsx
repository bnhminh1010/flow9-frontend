'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Transaction, Category } from '@/types';
import { CategoryIcon } from '@/components/CategoryIcon';

export default function LedgerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transRes, catRes] = await Promise.all([
        api.get<{ transactions: Transaction[] }>(`/api/transactions?year=${currentYear}&month=${currentMonth}`),
        api.get<{ categories: Category[] }>('/api/categories'),
      ]);
      setTransactions(transRes.transactions);
      setCategories(catRes.categories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || submitting) return;

    setSubmitting(true);
    try {
      await api.post('/api/transactions', { input });
      setInput('');
      fetchData();
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/transactions/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const groupTransactionsByDate = (trans: Transaction[]) => {
    const grouped: Record<string, Transaction[]> = {};
    trans.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString('vi-VN');
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(t);
    });
    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  const calculateTotal = (trans: Transaction[]) => {
    return trans.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="w-24 h-1 bg-[#222] overflow-hidden rounded-[2px] relative">
          <div className="absolute top-0 left-0 h-full w-full bg-[#333]"></div>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[#A1A1AA]">Fetching Ledger...</div>
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
            MASTER <span className="text-[#333]">LEDGER</span>
          </h2>
          <div className="font-mono text-xs tracking-widest text-[#A1A1AA] flex items-center gap-3">
            <span className="w-2 h-2 bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)] rounded-[1px]"></span> Entry Node Active
          </div>
        </div>
      </header>

      {/* Quick Input & Summary Section */}
      <div className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Command Form */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="relative group flex-1 flex flex-col justify-center h-full">
            <div className="flex-1 flex flex-col md:flex-row items-center gap-6 p-8 lg:p-12 bg-gradient-to-br from-[#111] to-black border-2 border-[#333] group-focus-within:border-[#888] group-focus-within:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-500 rounded-[4px]">
              <span className="font-mono text-white text-3xl hidden md:block">{">"}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='EXEC: "Ăn trưa 50k" hoặc "+ Lương 15tr" hoặc "- Mua sắm 200k"'
                className="flex-1 w-full bg-transparent text-white font-mono placeholder-[#333] outline-none text-2xl lg:text-4xl tracking-tight"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={!input.trim() || submitting}
                className="w-full md:w-auto px-10 py-5 bg-white text-black font-mono font-bold text-base uppercase tracking-widest rounded-[2px] hover:bg-[#A1A1AA] transition-colors shrink-0"
              >
                {submitting ? 'EXECUTING' : 'COMMIT_'}
              </button>
            </div>
          </form>
          <p className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest mt-3">
            Shorthand: "k" = nghìn, "tr" = triệu | Dùng "+" hoặc "thu" cho tiền vào, "-" cho tiền ra
          </p>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-4 p-10 lg:p-12 bg-[#0A0A0A] hover:bg-[#111] border-2 border-[#333] rounded-[4px] flex flex-col justify-between transition-all duration-500 hover:border-[#666] hover:shadow-lg h-full min-h-[160px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="font-mono text-sm text-[#E4E4E7] uppercase tracking-widest relative z-10 mb-6">Period Net Flow</span>
          <span className={`text-4xl lg:text-5xl font-black tracking-tight relative z-10 ${calculateTotal(transactions) >= 0 ? 'text-[#22C55E] drop-shadow-[0_0_12px_rgba(34,197,94,0.2)]' : 'text-[#EF4444] drop-shadow-[0_0_12px_rgba(239,68,68,0.2)]'}`}>
            {calculateTotal(transactions) >= 0 ? '+' : ''}{formatCurrency(calculateTotal(transactions))}
          </span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-6">
        {Object.entries(groupedTransactions).map(([date, trans]) => {
          const total = calculateTotal(trans);
          return (
            <div key={date} className="rounded-[2px] bg-[#0A0A0A] border-2 border-[#555] overflow-hidden hover:border-white transition-colors">
              <div className="px-6 py-4 border-b-2 border-[#555] bg-[#050505] flex justify-between items-center">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FAFAFA]">{date}</span>
                <span className={`font-mono text-sm font-bold ${total >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {total >= 0 ? '+' : ''}{formatCurrency(total)}
                </span>
              </div>
              <div className="divide-y divide-[#111]">
                {trans.map((t) => (
                  <div key={t._id} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-[#111] transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 border-2 border-[#555] bg-black flex items-center justify-center rounded-[2px] shrink-0 text-[#FAFAFA] transition-all duration-300 hover:border-white">
                        <CategoryIcon categoryName={t.category} />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-[#FAFAFA] uppercase">{t.description || t.category}</p>
                        <p className="font-mono text-[10px] uppercase text-[#71717A] tracking-widest mt-1">
                          {new Date(t.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          <span className="mx-2">|</span>
                          {t.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-[#555] pt-4 md:pt-0">
                      <span className={`font-mono text-lg font-bold tracking-tight ${t.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="font-mono text-[10px] px-2 py-1 text-[#71717A] border-2 border-[#555] hover:border-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors rounded-[2px] uppercase"
                      >
                        [ DEL ]
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {transactions.length === 0 && (
          <div className="text-center py-20 border-2 border-[#555] bg-[#050505] rounded-[2px]">
            <p className="font-mono text-xs text-[#71717A] uppercase tracking-widest">No entries found for period.</p>
            <p className="font-mono text-[10px] text-[#333] uppercase mt-2">Awaiting input command...</p>
          </div>
        )}
      </div>
    </>
  );
}
