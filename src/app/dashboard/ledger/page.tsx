'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { Transaction, Category } from '@/types';
import { CategoryIcon } from '@/components/CategoryIcon';

export default function LedgerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Filters
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit modal
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: '',
  });

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

  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || submitting) return;

    setSubmitError('');
    setSubmitting(true);
    try {
      await api.post('/api/transactions', { input });
      setInput('');
      fetchData();
    } catch (error: unknown) {
      console.error('Error creating transaction:', error);
      const err = error as { message?: string };
      setSubmitError(err.message || 'Failed to create transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa giao dịch này?')) return;
    try {
      await api.delete(`/api/transactions/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setEditForm({
      type: t.type,
      amount: t.amount.toString(),
      category: t.category,
      description: t.description,
      date: new Date(t.date).toISOString().split('T')[0],
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;
    
    try {
      await api.put(`/api/transactions/${editingTransaction._id}`, {
        type: editForm.type,
        amount: parseFloat(editForm.amount),
        category: editForm.category,
        description: editForm.description,
        date: editForm.date,
      });
      setEditingTransaction(null);
      fetchData();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Type filter
      if (filterType !== 'all' && t.type !== filterType) return false;
      // Category filter
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      // Search filter
      if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !t.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [transactions, filterType, filterCategory, searchQuery]);

  const groupTransactionsByDate = (trans: Transaction[]) => {
    const grouped: Record<string, Transaction[]> = {};
    trans.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString('vi-VN');
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(t);
    });
    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  const stats = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const netFlow = totalIncome - totalExpense;
    return { totalIncome, totalExpense, netFlow, count: filteredTransactions.length };
  }, [filteredTransactions]);

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
      {/* Edit Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0A0A] border-2 border-[#555] rounded-[4px] p-6 w-full max-w-md">
            <h3 className="font-mono text-lg font-bold text-white uppercase tracking-widest mb-6">
              EDIT TRANSACTION
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, type: 'income' })}
                  className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest border-2 rounded-[2px] transition-colors ${
                    editForm.type === 'income' 
                      ? 'bg-[#22C55E] text-black border-[#22C55E]' 
                      : 'border-[#333] text-[#71717A] hover:border-white'
                  }`}
                >
                  + INCOME
                </button>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, type: 'expense' })}
                  className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest border-2 rounded-[2px] transition-colors ${
                    editForm.type === 'expense' 
                      ? 'bg-[#EF4444] text-white border-[#EF4444]' 
                      : 'border-[#333] text-[#71717A] hover:border-white'
                  }`}
                >
                  - EXPENSE
                </button>
              </div>
              <div>
                <label className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">Amount (VND)</label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono rounded-[2px] mt-1"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono rounded-[2px] mt-1"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">Description</label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono rounded-[2px] mt-1"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">Date</label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono rounded-[2px] mt-1"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingTransaction(null)}
                  className="flex-1 py-4 bg-[#111] text-[#A1A1AA] font-mono text-xs uppercase tracking-widest border-2 border-[#555] rounded-[2px] hover:border-white hover:text-white transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold rounded-[2px] hover:bg-[#A1A1AA] transition-colors"
                >
                  UPDATE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.85] tracking-tighter uppercase mb-4 text-white">
            MASTER <span className="text-[#333]">LEDGER</span>
          </h2>
          <div className="font-mono text-xs tracking-widest text-[#A1A1AA] flex items-center gap-3">
            <span className="w-2 h-2 bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)] rounded-[1px]"></span> 
            {stats.count} entries
          </div>
        </div>
      </header>

      {/* Stats Row */}
      <div data-tour="category-stats" className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
        <div className="p-6 md:p-8 bg-[#0A0A0A] border-2 border-[#333] hover:border-white transition-all rounded-[2px] group relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="font-mono text-xs text-[#22C55E] uppercase tracking-widest relative z-10">Total Income</span>
          <p className="font-mono text-3xl md:text-5xl font-black text-[#22C55E] mt-4 relative z-10 tracking-tighter">{formatCurrency(stats.totalIncome)}</p>
        </div>
        <div className="p-6 md:p-8 bg-[#0A0A0A] border-2 border-[#333] hover:border-white transition-all rounded-[2px] group relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="font-mono text-xs text-[#EF4444] uppercase tracking-widest relative z-10">Total Expense</span>
          <p className="font-mono text-3xl md:text-5xl font-black text-[#EF4444] mt-4 relative z-10 tracking-tighter">{formatCurrency(stats.totalExpense)}</p>
        </div>
        <div className="p-6 md:p-8 bg-[#0A0A0A] border-2 border-[#333] hover:border-white transition-all rounded-[2px] group relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="font-mono text-xs text-[#A1A1AA] uppercase tracking-widest relative z-10">Period Net Flow</span>
          <p className={`font-mono text-3xl md:text-5xl font-black mt-4 relative z-10 tracking-tighter ${stats.netFlow >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {stats.netFlow >= 0 ? '+' : ''}{formatCurrency(stats.netFlow)}
          </p>
        </div>
      </div>

      {/* Quick Input */}
      <div data-tour="add-transaction-btn" className="mb-8 lg:mb-12 border-2 border-[#333] bg-[#0A0A0A] rounded-[2px] p-6 lg:p-10 focus-within:border-white focus-within:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 relative group">
          <span className="font-mono text-white text-3xl hidden md:flex items-center">{">"}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='EXEC: "Ăn trưa 50k" hoặc "+ Lương 15tr" hoặc "- Mua sắm 200k"'
            className="flex-1 p-0 bg-transparent text-white font-mono placeholder-[#555] outline-none text-xl md:text-3xl lg:text-4xl tracking-tight leading-none"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={!input.trim() || submitting}
            className="w-full md:w-auto px-10 py-5 bg-white text-black font-mono font-bold text-base uppercase tracking-widest rounded-[2px] hover:bg-[#A1A1AA] hover:text-white transition-colors disabled:opacity-50 shrink-0"
          >
            {submitting ? 'EXECUTING' : 'COMMIT_'}
          </button>
        </form>
        {submitError && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded text-red-400 font-mono text-sm">
            ERROR: {submitError}
          </div>
        )}
      </div>

      {/* Filters */}
      <div data-tour="ledger-filters" className="mb-6 flex flex-col xl:flex-row gap-4 justify-between">
        <div className="flex bg-[#0A0A0A] border-2 border-[#333] p-1 rounded-[2px] w-full xl:w-auto overflow-x-auto">
          {(['all', 'income', 'expense'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 xl:flex-none px-6 py-3 font-mono text-[10px] md:text-xs uppercase tracking-widest rounded transition-colors whitespace-nowrap ${
                filterType === type 
                  ? type === 'income' ? 'bg-[#22C55E] text-black font-bold' 
                    : type === 'expense' ? 'bg-[#EF4444] text-white font-bold'
                    : 'bg-white text-black font-bold'
                  : 'text-[#71717A] hover:text-white'
              }`}
            >
              {type === 'all' ? 'ALL_FLOWS' : type === 'income' ? '+ INFLOW' : '- OUTFLOW'}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-6 py-4 xl:py-3 bg-[#0A0A0A] border-2 border-[#333] text-white font-mono text-xs rounded-[2px] outline-none focus:border-white uppercase tracking-widest appearance-none flex-1 xl:w-48"
          >
            <option value="all">ALL CATEGORIES</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name.toUpperCase()}</option>
            ))}
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH / QUERY_"
            data-tour="ledger-search"
            className="px-6 py-4 xl:py-3 bg-[#0A0A0A] border-2 border-[#333] text-white font-mono text-xs rounded-[2px] outline-none focus:border-white w-full sm:flex-1 xl:w-64 uppercase tracking-widest placeholder-[#555]"
          />
        </div>
      </div>

      {/* Transactions List */}
      <div data-tour="ledger-table" className="space-y-6">
        {Object.entries(groupedTransactions).map(([date, trans]) => {
          const dayIncome = trans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
          const dayExpense = trans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
          const dayNet = dayIncome - dayExpense;
          
          return (
            <div key={date} className="bg-[#0A0A0A] border-2 border-[#333] hover:border-[#555] transition-colors rounded-[2px] overflow-hidden">
              <div className="px-6 py-4 bg-[#050505] border-b-2 border-[#333] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <span className="font-mono text-sm font-bold text-[#FAFAFA] tracking-widest uppercase">{date}</span>
                  <div className="flex gap-4">
                    {dayIncome > 0 && <span className="font-mono text-[10px] text-[#22C55E] tracking-widest bg-[#22C55E]/10 px-2 py-1 rounded-[2px] border border-[#22C55E]/30">+{formatCurrency(dayIncome)}</span>}
                    {dayExpense > 0 && <span className="font-mono text-[10px] text-[#EF4444] tracking-widest bg-[#EF4444]/10 px-2 py-1 rounded-[2px] border border-[#EF4444]/30">-{formatCurrency(dayExpense)}</span>}
                  </div>
                </div>
                <span className={`font-mono text-sm font-bold tracking-widest ${dayNet >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {dayNet >= 0 ? '+' : ''}{formatCurrency(dayNet)}
                </span>
              </div>
              <div className="divide-y divide-[#222]">
                {trans.map((t) => (
                  <div key={t._id} className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between hover:bg-[#111] transition-colors group gap-4">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 border-2 border-[#333] bg-black group-hover:bg-[#222] group-hover:border-white transition-all flex items-center justify-center rounded-[2px] text-white shrink-0">
                        <CategoryIcon categoryName={t.category} className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-mono text-base font-bold text-[#FAFAFA] tracking-wide uppercase leading-tight line-clamp-2 md:line-clamp-1">{t.description || t.category}</p>
                        <p className="font-mono text-[10px] text-[#71717A] tracking-widest mt-1.5 uppercase">
                          {new Date(t.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          <span className="mx-2 text-[#333]">/</span>
                          {t.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                      <span className={`font-mono text-2xl font-black tracking-tighter shrink-0 ${t.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                      <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(t)}
                          className="px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-[#A1A1AA] border-2 border-[#333] hover:border-[#FAFAFA] hover:text-[#FAFAFA] rounded-[2px] transition-colors"
                        >
                          [ EDIT ]
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-[#71717A] border-2 border-[#333] hover:border-[#EF4444] hover:bg-[#EF4444] hover:text-black rounded-[2px] transition-colors"
                        >
                          [ DEL ]
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-24 border-2 border-[#333] bg-[#050505] rounded-[2px]">
            <p className="font-mono text-sm text-[#71717A] uppercase tracking-widest">ZERO MATCHING RECORDS_</p>
            <p className="font-mono text-[10px] text-[#333] mt-2 uppercase tracking-widest">AWAITING_INPUT_COMMAND</p>
          </div>
        )}
      </div>
    </>
  );
}
