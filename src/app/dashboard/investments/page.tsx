'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface Investment {
  _id: string;
  name: string;
  type: 'stock' | 'crypto' | 'bond' | 'mutual_fund' | 'real_estate' | 'other';
  symbol?: string;
  coinId?: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  profitLoss: number;
  profitLossPercent: number;
}

interface CoinOption {
  id: string;
  symbol: string;
  name: string;
  image?: string;
}

export default function InvestmentsPage() {
  const { t } = useLanguage();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState({ totalValue: 0, totalCost: 0, totalProfitLoss: 0 });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [updatingPrices, setUpdatingPrices] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [coinSearch, setCoinSearch] = useState('');
  const [coinResults, setCoinResults] = useState<CoinOption[]>([]);
  const [topCoins, setTopCoins] = useState<CoinOption[]>([]);
  const [searchingCoins, setSearchingCoins] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    type: 'stock' as 'stock' | 'crypto' | 'bond' | 'mutual_fund' | 'real_estate' | 'other', 
    symbol: '', 
    coinId: '',
    quantity: '', 
    purchasePrice: '', 
    purchaseDate: '' 
  });

  const fetchData = async () => {
    try {
      const res = await api.get<{ investments: Investment[]; summary: typeof summary }>('/api/investments');
      setInvestments(res.investments || []);
      setSummary(res.summary);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopCoins = async () => {
    try {
      const res = await api.get<{ coins: CoinOption[] }>('/api/coingecko/coins/top');
      setTopCoins(res.coins || []);
    } catch (error) {
      console.error('Error fetching top coins:', error);
    }
  };

  const searchCoins = useCallback(async (query: string) => {
    if (!query.trim()) {
      setCoinResults([]);
      return;
    }
    setSearchingCoins(true);
    try {
      const res = await api.get<{ coins: CoinOption[] }>(`/api/coingecko/coins/search?q=${encodeURIComponent(query)}`);
      setCoinResults(res.coins || []);
    } catch (error) {
      console.error('Error searching coins:', error);
    } finally {
      setSearchingCoins(false);
    }
  }, []);

  useEffect(() => { 
    fetchData();
    fetchTopCoins();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.type === 'crypto' && coinSearch) {
        searchCoins(coinSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [coinSearch, form.type, searchCoins]);

  const handleSelectCoin = (coin: CoinOption) => {
    setForm({...form, name: coin.name, symbol: coin.symbol, coinId: coin.id});
    setCoinSearch(coin.name);
    setCoinResults([]);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/investments', {
        name: form.name,
        type: form.type,
        symbol: form.symbol,
        coinId: form.type === 'crypto' ? form.coinId : undefined,
        quantity: parseFloat(form.quantity),
        purchasePrice: parseFloat(form.purchasePrice),
        currentPrice: parseFloat(form.purchasePrice),
        purchaseDate: form.purchaseDate
      });
      setShowAdd(false);
      setForm({ name: '', type: 'stock', symbol: '', coinId: '', quantity: '', purchasePrice: '', purchaseDate: '' });
      setCoinSearch('');
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdatePrice = async (id: string) => {
    setUpdatingId(id);
    try {
      await api.post(`/api/investments/${id}/update-price`);
      fetchData();
    } catch (error) {
      console.error('Error updating price:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateAllPrices = async () => {
    setUpdatingPrices(true);
    try {
      await api.post('/api/investments/update-all-prices');
      fetchData();
    } catch (error) {
      console.error('Error updating all prices:', error);
    } finally {
      setUpdatingPrices(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('common.confirm') + '?')) return;
    await api.delete(`/api/investments/${id}`);
    fetchData();
  };

  const handleTypeChange = (type: string) => {
    setForm({...form, type: type as typeof form.type, coinId: '', symbol: ''});
    setCoinSearch('');
    setCoinResults([]);
  };

  const formatCurrency = (n: number) => new Intl.NumberFormat('vi-VN', { currency: 'VND', maximumFractionDigits: 0 }).format(n);

  const icons: Record<string, string> = { stock: '📈', crypto: '₿', bond: '🏦', mutual_fund: '📊', real_estate: '🏠', other: '💰' };

  const hasCryptoWithCoinId = investments.some(inv => inv.type === 'crypto' && inv.coinId);

  if (loading) return <div className="flex items-center justify-center h-[50vh]"><div className="font-mono text-xs text-[#A1A1AA]">{t('common.loading')}</div></div>;

  return (
    <>
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.85] tracking-tighter uppercase text-white">{t('invest.title')}</h2>
          <p className="font-mono text-xs text-[#A1A1AA] mt-2">{investments.length} {t('common.holdings')}</p>
        </div>
        <div className="flex gap-2">
          {hasCryptoWithCoinId && (
            <button 
              onClick={handleUpdateAllPrices} 
              disabled={updatingPrices}
              className="font-mono text-xs uppercase bg-[#0D9488] text-white px-4 py-2 rounded-[2px] hover:bg-[#0f766e] disabled:opacity-50"
            >
              {updatingPrices ? t('common.loading') + '...' : '🔄 UPDATE PRICES'}
            </button>
          )}
          <button onClick={() => setShowAdd(!showAdd)} className="font-mono text-xs uppercase bg-white text-black px-4 py-2 rounded-[2px] hover:bg-[#A1A1AA]">
            {showAdd ? t('common.cancel').toUpperCase() : '+ ' + t('common.add').toUpperCase()}
          </button>
        </div>
      </header>

      {showAdd && (
        <form onSubmit={handleAdd} className="mb-8 p-6 bg-[#0A0A0A] border border-[#333] rounded-[2px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] text-[#A1A1AA] uppercase">{t('invest.type')}</label>
              <select 
                value={form.type} 
                onChange={e => handleTypeChange(e.target.value)} 
                className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]"
              >
                <option value="stock">{t('invest.stock')}</option>
                <option value="crypto">{t('invest.crypto')}</option>
                <option value="bond">{t('invest.bond')}</option>
                <option value="mutual_fund">{t('invest.mutualFund')}</option>
                <option value="real_estate">{t('invest.realEstate')}</option>
              </select>
            </div>
            
            {form.type === 'crypto' ? (
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="font-mono text-[10px] text-[#A1A1AA] uppercase">Search Cryptocurrency</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search BTC, ETH, SOL..." 
                    value={coinSearch} 
                    onChange={e => setCoinSearch(e.target.value)}
                    className="w-full p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]"
                  />
                  {coinResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#555] rounded-[2px] max-h-48 overflow-y-auto z-10">
                      {coinResults.map(coin => (
                        <button
                          key={coin.id}
                          type="button"
                          onClick={() => handleSelectCoin(coin)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-[#333] text-left"
                        >
                          {coin.image && <img src={coin.image} alt="" className="w-6 h-6 rounded-full" />}
                          <div>
                            <p className="font-mono text-sm text-white">{coin.name}</p>
                            <p className="font-mono text-[10px] text-[#71717A]">{coin.symbol}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchingCoins && <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-[#1a1a1a] border border-[#555] rounded-[2px]"><span className="font-mono text-xs text-[#71717A]">{t('common.loading')}...</span></div>}
                </div>
                {coinResults.length === 0 && !coinSearch && topCoins.length > 0 && (
                  <div className="mt-2">
                    <p className="font-mono text-[10px] text-[#71717A] mb-2">Popular:</p>
                    <div className="flex flex-wrap gap-2">
                      {topCoins.slice(0, 10).map(coin => (
                        <button
                          key={coin.id}
                          type="button"
                          onClick={() => handleSelectCoin(coin)}
                          className="flex items-center gap-2 px-2 py-1 bg-[#222] border border-[#444] rounded-[2px] hover:border-white"
                        >
                          {coin.image && <img src={coin.image} alt="" className="w-4 h-4 rounded-full" />}
                          <span className="font-mono text-[10px] text-white">{coin.symbol}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <input 
                type="text" 
                placeholder={t('budget.name') + ' (Apple Inc)'} 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" 
                required 
              />
            )}
            
            {form.type !== 'crypto' && (
              <input type="text" placeholder={t('invest.symbol') + ' (AAPL)'} value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" />
            )}
            
            <input type="number" placeholder={t('invest.quantity')} value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" required />
            <input type="number" placeholder={t('invest.purchasePrice')} value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" required />
            <input type="date" value={form.purchaseDate} onChange={e => setForm({...form, purchaseDate: e.target.value})} className="p-3 bg-[#050505] border border-[#555] text-white font-mono rounded-[2px]" required />
          </div>
          <button type="submit" className="mt-4 w-full py-3 bg-white text-black font-mono font-bold text-xs uppercase rounded-[2px]">{t('invest.addInvestment').toUpperCase()}</button>
        </form>
      )}

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-[#0A0A0A] border border-[#333] rounded-[2px]"><span className="font-mono text-[10px] text-[#A1A1AA] uppercase">{t('invest.totalValue')}</span><p className="font-mono text-2xl font-black text-white mt-1">{formatCurrency(summary.totalValue)}</p></div>
        <div className="p-4 bg-[#0A0A0A] border border-[#333] rounded-[2px]"><span className="font-mono text-[10px] text-[#A1A1AA] uppercase">{t('invest.cost')}</span><p className="font-mono text-2xl font-black text-[#A1A1AA] mt-1">{formatCurrency(summary.totalCost)}</p></div>
        <div className="p-4 bg-[#0A0A0A] border border-[#333] rounded-[2px]"><span className="font-mono text-[10px] text-[#A1A1AA] uppercase">{t('invest.profitLoss')}</span><p className={`font-mono text-2xl font-black mt-1 ${summary.totalProfitLoss >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{summary.totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(summary.totalProfitLoss)}</p></div>
      </div>

      <div className="space-y-4">
        {investments.map(inv => (
          <div key={inv._id} className="p-6 bg-[#0A0A0A] border border-[#333] hover:border-[#555] rounded-[2px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{icons[inv.type]}</span>
                <div>
                  <p className="font-mono font-bold text-white uppercase">{inv.name}</p>
                  <p className="font-mono text-[10px] text-[#71717A]">{inv.symbol || inv.type} • {inv.quantity} {t('invest.quantity').toLowerCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right"><p className="font-mono text-[10px] text-[#71717A]">{t('invest.currentPrice')}</p><p className="font-mono font-bold text-white">{formatCurrency(inv.currentPrice)}</p></div>
                <div className="text-right"><p className="font-mono text-[10px] text-[#71717A]">{t('invest.cost')}</p><p className="font-mono font-bold text-[#A1A1AA]">{formatCurrency(inv.purchasePrice)}</p></div>
                <div className="text-right"><p className="font-mono text-[10px] text-[#71717A]">{t('invest.profitLoss')}</p><p className={`font-mono font-black ${inv.profitLoss >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{inv.profitLoss >= 0 ? '+' : ''}{formatCurrency(inv.profitLoss)}</p></div>
                <div className="flex gap-2">
                  {inv.type === 'crypto' && inv.coinId && (
                    <button 
                      onClick={() => handleUpdatePrice(inv._id)} 
                      disabled={updatingId === inv._id}
                      className="px-2 py-1 bg-[#0D9488] text-white font-mono text-[10px] rounded-[2px] hover:bg-[#0f766e] disabled:opacity-50"
                    >
                      {updatingId === inv._id ? '...' : '↻'}
                    </button>
                  )}
                  <button onClick={() => handleDelete(inv._id)} className="text-[#71717A] hover:text-[#EF4444]">✕</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {investments.length === 0 && <div className="text-center py-16 border border-[#333] bg-[#050505] rounded-[2px]"><p className="font-mono text-sm text-[#71717A]">{t('invest.noInvestments')}</p></div>}
      </div>
    </>
  );
}
