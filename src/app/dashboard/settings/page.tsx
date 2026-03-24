'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Transaction, Subscription } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage();
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [exportLoading, setExportLoading] = useState(false);
  const [exportType, setExportType] = useState<'transactions' | 'subscriptions' | 'all'>('all');

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPin !== confirmPin) {
      setMessage('ERR: ' + t('settings.pinMismatch'));
      return;
    }

    if (newPin.length !== 6) {
      setMessage('ERR: ' + t('settings.pinLength'));
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/change-pin', { oldPin, newPin });
      setMessage('SUCCESS: ' + t('settings.updatePin'));
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    } catch (error: any) {
      setMessage(`ERR: ${error.message || 'Authorization failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const value = row[h.toLowerCase().replace(/ /g, '')] ?? row[h] ?? '';
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      if (exportType === 'transactions' || exportType === 'all') {
        const transRes = await api.get<{ transactions: Transaction[] }>('/api/transactions');
        const transactions = transRes.transactions;
        exportToCSV(
          transactions,
          'flow9_transactions',
          ['Date', 'Type', 'Amount', 'Category', 'Description']
        );
      }

      if (exportType === 'subscriptions' || exportType === 'all') {
        const subsRes = await api.get<{ subscriptions: Subscription[] }>('/api/subscriptions');
        const subscriptions = subsRes.subscriptions;
        exportToCSV(
          subscriptions,
          'flow9_subscriptions',
          ['Name', 'Amount', 'BillingCycle', 'NextBillingDate', 'Category', 'IsActive']
        );
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const data: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const row: any = {};
          headers.forEach((h, idx) => {
            row[h] = values[idx] || '';
          });
          data.push(row);
        }

        if (headers.includes('Date') && headers.includes('Amount') && headers.includes('Type')) {
          for (const row of data) {
            try {
              await api.post('/api/transactions', {
                input: `${row.Description || row.category || 'Import'} ${row.Amount}k`,
                date: row.Date
              });
            } catch (err) {
              console.error('Import transaction error:', err);
            }
          }
          alert(`Imported ${data.length} transactions`);
        } else if (headers.includes('Name') && headers.includes('BillingCycle')) {
          for (const row of data) {
            try {
              await api.post('/api/subscriptions', {
                name: row.Name,
                amount: parseFloat(row.Amount) || 0,
                billingCycle: row.BillingCycle?.toLowerCase() || 'monthly',
                nextBillingDate: row.NextBillingDate || new Date().toISOString(),
                category: row.Category || 'Other'
              });
            } catch (err) {
              console.error('Import subscription error:', err);
            }
          }
          alert(`Imported ${data.length} subscriptions`);
        } else {
          alert('Unknown CSV format');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Import failed');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <>
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.85] tracking-tighter uppercase mb-4 text-white">
            {t('settings.title')}
          </h2>
          <div className="font-mono text-xs tracking-widest text-[#A1A1AA] flex items-center gap-3">
            <span className="w-2 h-2 bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)] rounded-[1px]"></span> {t('settings.parametersLoaded')}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Language */}
        <div data-tour="currency-settings" className="p-8 bg-[#0A0A0A] border border-[#333] rounded-[4px]">
          <h3 className="font-mono text-sm font-bold tracking-widest uppercase text-white mb-6 border-b border-[#222] pb-4">
            Language
          </h3>
          
          <div className="flex gap-4">
            <button
              onClick={() => setLang('vi')}
              className={`flex-1 py-4 px-6 font-mono text-sm font-bold uppercase tracking-widest border-2 rounded-[2px] transition-colors ${
                lang === 'vi' 
                  ? 'bg-white text-black border-white' 
                  : 'bg-[#050505] text-[#A1A1AA] border-[#333] hover:border-white'
              }`}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              onClick={() => setLang('en')}
              className={`flex-1 py-4 px-6 font-mono text-sm font-bold uppercase tracking-widest border-2 rounded-[2px] transition-colors ${
                lang === 'en' 
                  ? 'bg-white text-black border-white' 
                  : 'bg-[#050505] text-[#A1A1AA] border-[#333] hover:border-white'
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* Change PIN */}
        <div data-tour="account-settings" className="p-8 bg-[#0A0A0A] border border-[#333] rounded-[4px]">
          <h3 className="font-mono text-sm font-bold tracking-widest uppercase text-white mb-6 border-b border-[#222] pb-4">
            {t('settings.changePin')}
          </h3>
          
          <form onSubmit={handleChangePin} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">{t('settings.currentPin')}</label>
              <input
                type="password"
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                className="w-full p-4 bg-[#050505] border border-[#555] text-white font-mono tracking-widest outline-none focus:border-white rounded-[2px] mt-1"
                maxLength={6}
                required
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">{t('settings.newPin')}</label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full p-4 bg-[#050505] border border-[#555] text-white font-mono tracking-widest outline-none focus:border-white rounded-[2px] mt-1"
                maxLength={6}
                required
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">{t('settings.confirmPin')}</label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full p-4 bg-[#050505] border border-[#555] text-white font-mono tracking-widest outline-none focus:border-white rounded-[2px] mt-1"
                maxLength={6}
                required
              />
            </div>
            
            {message && (
              <div className={`p-3 border font-mono text-xs uppercase tracking-widest rounded-[2px] ${
                message.includes('SUCCESS') 
                  ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30' 
                  : 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30'
              }`}>
                {message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-[2px] hover:bg-[#A1A1AA] disabled:opacity-50"
            >
              {loading ? t('settings.processing') : t('settings.updatePin')}
            </button>
          </form>
        </div>

        {/* Export / Import */}
        <div data-tour="data-management" className="p-8 bg-[#0A0A0A] border border-[#333] rounded-[4px]">
          <h3 className="font-mono text-sm font-bold tracking-widest uppercase text-white mb-6 border-b border-[#222] pb-4">
            {t('settings.exportData')} / {t('settings.importData')}
          </h3>
          
          <div className="space-y-6">
            {/* Export */}
            <div>
              <label className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest mb-3 block">{t('settings.exportData')}</label>
              <div className="flex gap-2">
                <select
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value as any)}
                  className="flex-1 p-3 bg-[#050505] border border-[#555] text-white font-mono text-xs rounded-[2px]"
                >
                  <option value="all">{t('settings.allData')}</option>
                  <option value="transactions">{t('settings.transactionsOnly')}</option>
                  <option value="subscriptions">{t('settings.subscriptionsOnly')}</option>
                </select>
                <button
                  onClick={handleExport}
                  disabled={exportLoading}
                  className="px-6 py-3 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-[2px] hover:bg-[#A1A1AA] disabled:opacity-50"
                >
                  {exportLoading ? '...' : t('settings.export')}
                </button>
              </div>
            </div>

            {/* Import */}
            <div>
              <label className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest mb-3 block">{t('settings.importData')}</label>
              <label className="block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                />
                <div className="p-4 bg-[#050505] border-2 border-dashed border-[#555] text-center cursor-pointer hover:border-white transition-colors rounded-[2px]">
                  <span className="font-mono text-xs text-[#A1A1AA] uppercase tracking-widest">
                    + {t('settings.chooseFile')}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="lg:col-span-2 p-8 bg-[#0A0A0A] border border-[#333] rounded-[4px]">
          <h3 className="font-mono text-sm font-bold tracking-widest uppercase text-white mb-6 border-b border-[#222] pb-4">
            {t('settings.systemInfo')}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#050505] border border-[#333] rounded-[2px]">
              <p className="font-mono text-[10px] text-[#71717A] uppercase">{t('settings.version')}</p>
              <p className="font-mono text-lg font-bold text-white">9.0.0</p>
            </div>
            <div className="p-4 bg-[#050505] border border-[#333] rounded-[2px]">
              <p className="font-mono text-[10px] text-[#71717A] uppercase">{t('settings.status')}</p>
              <p className="font-mono text-lg font-bold text-[#22C55E]">{t('settings.active')}</p>
            </div>
            <div className="p-4 bg-[#050505] border border-[#333] rounded-[2px]">
              <p className="font-mono text-[10px] text-[#71717A] uppercase">{t('settings.database')}</p>
              <p className="font-mono text-lg font-bold text-white">MongoDB</p>
            </div>
            <div className="p-4 bg-[#050505] border border-[#333] rounded-[2px]">
              <p className="font-mono text-[10px] text-[#71717A] uppercase">Built with</p>
              <p className="font-mono text-lg font-bold text-white">Next.js</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
