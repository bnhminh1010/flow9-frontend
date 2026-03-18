'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { WorkShift, MonthlySummary, SalaryConfig } from '@/types';

export default function PayrollPage() {
  const [shifts, setShifts] = useState<WorkShift[]>([]);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [wageConfig, setWageConfig] = useState<SalaryConfig | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  const [wageForm, setWageForm] = useState({
    baseHourlyRate: 25000,
    dayShiftMultiplier: 1.0,
    nightShiftMultiplier: 1.5,
    holidayMultiplier: 2.0,
  });

  const [formData, setFormData] = useState({
    date: currentDate.toISOString().split('T')[0],
    hours: 8,
    shiftType: 'day' as 'day' | 'night' | 'holiday',
    isHoliday: false,
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const fetchData = async () => {
    try {
      const [shiftsRes, summaryRes, configRes] = await Promise.all([
        api.get<{ shifts: WorkShift[] }>(`/api/shifts?year=${selectedYear}&month=${selectedMonth}`),
        api.get<{ summary: MonthlySummary }>(`/api/salary/summary?year=${selectedYear}&month=${selectedMonth}`),
        api.get<{ config: SalaryConfig }>('/api/salary/config'),
      ]);
      setShifts(shiftsRes.shifts);
      setSummary(summaryRes.summary);
      setWageConfig(configRes.config);
      setWageForm({
        baseHourlyRate: configRes.config.baseHourlyRate,
        dayShiftMultiplier: configRes.config.dayShiftMultiplier,
        nightShiftMultiplier: configRes.config.nightShiftMultiplier,
        holidayMultiplier: configRes.config.holidayMultiplier,
      });
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/shifts', formData);
      setShowForm(false);
      setFormData({
        date: currentDate.toISOString().split('T')[0],
        hours: 8,
        shiftType: 'day',
        isHoliday: false,
        notes: '',
      });
      fetchData();
    } catch (error) {
      console.error('Error creating shift:', error);
    }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/api/salary/config', wageForm);
      setShowConfig(false);
      fetchData();
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shift?')) return;
    try {
      await api.delete(`/api/shifts/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  const handleReceivePaycheck = async () => {
    if (!summary || summary.totalSalary <= 0) {
      alert('Không có lương để nhận trong tháng này!');
      return;
    }
    if (!confirm(`Bạn muốn ghi nhận lương ${formatCurrency(summary.totalSalary)} của tháng ${selectedMonth}/${selectedYear} vào sổ cái (Ledger)?`)) return;

    setIsPosting(true);
    try {
      await api.post('/api/transactions', {
        type: 'income',
        amount: summary.totalSalary,
        category: 'Lương',
        description: `Lương tháng ${selectedMonth}/${selectedYear}`,
        date: new Date().toISOString()
      });
      alert('Đã ghi nhận lương vào sổ cái thành công!');
    } catch (error) {
      console.error('Error posting paycheck:', error);
      alert('Có lỗi xảy ra khi ghi nhận lương.');
    } finally {
      setIsPosting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getShiftForDate = (day: number) => {
    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return shifts.find((s) => s.date.startsWith(dateStr));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="w-24 h-1 bg-[#222] overflow-hidden rounded-[2px] relative">
          <div className="absolute top-0 left-0 h-full w-full bg-[#333]"></div>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[#A1A1AA]">Fetching Payroll...</div>
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
            PAYROLL <span className="text-[#333]">LOGS</span>
          </h2>
          <div className="font-mono text-xs tracking-widest text-[#A1A1AA] flex items-center gap-3">
            <span className="w-2 h-2 bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)] rounded-[1px]"></span> Syncing Active
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => { setShowConfig(!showConfig); setShowForm(false); }}
            className={`font-mono text-xs uppercase tracking-widest px-6 py-3 border-2 transition-colors rounded-[2px] ${showConfig ? 'bg-[#FAFAFA] text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-[#111] text-[#E4E4E7] border-[#333] hover:border-[#FAFAFA] hover:text-[#FAFAFA]'}`}
          >
             [ BASE_WAGE ]
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setShowConfig(false); }}
            className={`font-mono text-xs uppercase tracking-widest px-6 py-3 border-2 transition-colors rounded-[2px] ${showForm ? 'bg-[#EF4444] text-white border-transparent shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-white text-black border-transparent hover:bg-[#A1A1AA] hover:text-white'}`}
          >
            {showForm ? '[ ABORT ]' : '[ + ADD_SHIFT ]'}
          </button>
        </div>
      </header>

      <div className="">
        {/* Month Selector & Total */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 p-10 lg:p-12 bg-[#0A0A0A] border-2 border-[#333] rounded-[4px] transition-all duration-500 hover:border-[#666] hover:bg-[#111] shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (selectedMonth === 1) {
                  setSelectedMonth(12);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              className="p-4 bg-[#050505] border-2 border-[#555] text-white hover:border-white transition-colors rounded-[2px] font-mono leading-none"
            >
              {"<"}
            </button>
            <span className="text-3xl lg:text-5xl font-black tracking-tight text-white min-w-[200px] text-center uppercase">
              {monthNames[selectedMonth - 1]} <span className="text-[#A1A1AA]">{selectedYear}</span>
            </span>
            <button
              onClick={() => {
                if (selectedMonth === 12) {
                  setSelectedMonth(1);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              className="p-4 bg-[#050505] border-2 border-[#555] text-white hover:border-white transition-colors rounded-[2px] font-mono leading-none"
            >
              {">"}
            </button>
          </div>
          <div className="text-left md:text-right border-t md:border-t-0 border-[#555] pt-6 md:pt-0">
            <span className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest block mb-2">Total Projected Yield</span>
            <div className="flex flex-col md:items-end gap-3">
              <span className="text-4xl lg:text-5xl font-black text-white">{formatCurrency(summary?.totalSalary || 0)}</span>
              <button 
                onClick={handleReceivePaycheck}
                disabled={!summary || summary.totalSalary <= 0 || isPosting}
                className="font-mono text-[10px] uppercase tracking-widest text-[#22C55E] border-2 border-[#22C55E]/50 px-4 py-2 hover:bg-[#22C55E] hover:text-black transition-colors rounded-[2px] disabled:opacity-50 mt-2"
              >
                {isPosting ? 'POSTING...' : '[ POST_TO_LEDGER ]'}
              </button>
            </div>
          </div>
        </div>

        {/* Config Form */}
        {showConfig && (
          <div className="mb-12 p-10 lg:p-14 bg-[#0A0A0A] border-2 border-[#333] rounded-[4px] transition-all duration-500 hover:border-[#666] hover:bg-[#111] shadow-lg">
            <h3 className="font-mono text-sm font-bold tracking-widest uppercase text-white mb-8 border-b-2 border-[#222] pb-4">Base Wage Configuration</h3>
            <form onSubmit={handleConfigSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Base Hourly Rate (VND)</label>
                <input
                  type="number"
                  value={wageForm.baseHourlyRate}
                  onChange={(e) => setWageForm({ ...wageForm, baseHourlyRate: parseFloat(e.target.value) })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-[#22C55E] font-black tracking-widest font-mono outline-none focus:border-[#22C55E] transition-colors rounded-[2px]"
                  min="0"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Day xRate</label>
                <input
                  type="number"
                  value={wageForm.dayShiftMultiplier}
                  onChange={(e) => setWageForm({ ...wageForm, dayShiftMultiplier: parseFloat(e.target.value) })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono outline-none focus:border-white transition-colors rounded-[2px]"
                  step="0.1"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Night xRate</label>
                <input
                  type="number"
                  value={wageForm.nightShiftMultiplier}
                  onChange={(e) => setWageForm({ ...wageForm, nightShiftMultiplier: parseFloat(e.target.value) })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono outline-none focus:border-white transition-colors rounded-[2px]"
                  step="0.1"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Holiday xRate</label>
                <input
                  type="number"
                  value={wageForm.holidayMultiplier}
                  onChange={(e) => setWageForm({ ...wageForm, holidayMultiplier: parseFloat(e.target.value) })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono outline-none focus:border-white transition-colors rounded-[2px]"
                  step="0.1"
                  required
                />
              </div>
              
              <div className="md:col-span-2 lg:col-span-4 flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-[2px] hover:bg-[#A1A1AA] hover:text-white transition-colors w-full md:w-auto"
                >
                  SAVE_WAGE_PARAMETERS
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-12 p-10 lg:p-14 bg-[#0A0A0A] border-2 border-[#333] rounded-[4px] transition-all duration-500 hover:border-[#666] hover:bg-[#111] shadow-lg">
            <h3 className="font-mono text-sm font-bold tracking-widest uppercase text-white mb-8 border-b-2 border-[#222] pb-4">New Shift Entry</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-[#E4E4E7] focus:text-white font-mono outline-none focus:border-white transition-colors rounded-[2px]"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Hours Logged</label>
                <input
                  type="number"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono outline-none focus:border-white transition-colors rounded-[2px]"
                  min="0"
                  max="24"
                  step="0.5"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest">Shift Type</label>
                <select
                  value={formData.shiftType}
                  onChange={(e) => setFormData({ ...formData, shiftType: e.target.value as 'day' | 'night' | 'holiday' })}
                  className="w-full p-4 bg-[#050505] border-2 border-[#555] text-white font-mono outline-none focus:border-white transition-colors rounded-[2px] appearance-none"
                >
                  <option value="day">Day Shift</option>
                  <option value="night">Night Shift</option>
                  <option value="holiday">Holiday Shift</option>
                </select>
              </div>
              <div className="flex items-center gap-4 p-4 border-2 border-[#555] bg-[#050505] rounded-[2px] mt-2 lg:mt-0">
                <input
                  type="checkbox"
                  id="isHoliday"
                  checked={formData.isHoliday}
                  onChange={(e) => setFormData({ ...formData, isHoliday: e.target.checked })}
                  className="w-5 h-5 bg-[#111] border-2 border-white rounded-[1px] accent-white"
                />
                <label htmlFor="isHoliday" className="font-mono text-xs text-white uppercase tracking-widest cursor-pointer">Mark as Holiday Rate</label>
              </div>
              <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-[2px] hover:bg-[#A1A1AA] hover:text-white transition-colors w-full md:w-auto"
                >
                  COMMIT_ENTRY
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Summary Mini-Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-8 lg:p-10 bg-[#0A0A0A] hover:bg-[#111] border-2 border-[#333] rounded-[4px] flex flex-col gap-2 transition-all duration-500 hover:border-[#666] shadow-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest relative z-10">Day Yield</span>
            <span className="text-2xl font-bold tracking-tight text-white relative z-10">{formatCurrency(summary?.byShiftType?.day || 0)}</span>
          </div>
          <div className="p-8 lg:p-10 bg-[#0A0A0A] hover:bg-[#111] border-2 border-[#333] rounded-[4px] flex flex-col gap-2 transition-all duration-500 hover:border-[#666] shadow-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest relative z-10">Night Yield</span>
            <span className="text-2xl font-bold tracking-tight text-white relative z-10">{formatCurrency(summary?.byShiftType?.night || 0)}</span>
          </div>
          <div className="p-8 lg:p-10 bg-[#0A0A0A] hover:bg-[#111] border-2 border-[#333] rounded-[4px] flex flex-col gap-2 transition-all duration-500 hover:border-[#666] shadow-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest relative z-10">Holiday Yield</span>
            <span className="text-2xl font-bold tracking-tight text-[#22C55E] drop-shadow-[0_0_8px_rgba(34,197,94,0.3)] relative z-10">{formatCurrency(summary?.byShiftType?.holiday || 0)}</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border-2 border-[#555] bg-[#0A0A0A] rounded-[2px] p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6 border-b-2 border-[#555] pb-4">
             <span className="font-mono text-xs text-[#E4E4E7] uppercase tracking-widest">Matrix / {monthNames[selectedMonth - 1]}</span>
          </div>
          <div className="grid grid-cols-7 gap-2 lg:gap-4">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
              <div key={day} className="text-center font-mono text-[10px] text-[#A1A1AA] tracking-widest py-2 border-b-2 border-[#555]">
                {day}
              </div>
            ))}
            {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => {
              const day = i + 1;
              const shift = getShiftForDate(day);
              const isToday = day === currentDate.getDate() && selectedYear === currentDate.getFullYear() && selectedMonth === currentDate.getMonth() + 1;
              
              return (
                <div
                  key={day}
                  className={`p-3 lg:p-4 rounded-[2px] min-h-[100px] lg:min-h-[120px] border flex flex-col justify-between transition-colors group relative ${
                    isToday 
                      ? 'bg-[#111] border-white' 
                      : shift 
                        ? 'bg-[#050505] border-white hover:border-white' 
                        : 'bg-transparent border-[#111] hover:border-white'
                  }`}
                >
                  <div className={`font-mono text-2xl font-bold leading-none ${isToday ? 'text-white' : shift ? 'text-[#FAFAFA]' : 'text-[#333]'}`}>
                    {day.toString().padStart(2, '0')}
                  </div>
                  {shift && (
                    <div className="mt-2 text-right">
                      <div className="font-mono text-xl font-bold text-white mb-1"><span className="text-xs text-[#A1A1AA] mr-1">hrs</span>{shift.hours}</div>
                      <div className="font-mono text-[9px] text-[#E4E4E7] tracking-widest">{formatCurrency(shift.dailySalary)}</div>
                    </div>
                  )}
                  {shift && (
                    <button
                       onClick={() => handleDelete(shift._id)}
                       className="absolute top-2 right-2 text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px]"
                    >
                      [x]
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
