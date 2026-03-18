'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import api from '@/lib/api';
import { MonthlySummary, AggregateResponse, UpcomingSubscription } from '@/types';

export default function DashboardPage() {
  const [salarySummary, setSalarySummary] = useState<MonthlySummary | null>(null);
  const [aggregate, setAggregate] = useState<AggregateResponse | null>(null);
  const [upcomingSubs, setUpcomingSubs] = useState<UpcomingSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const cacheBuster = Date.now();
      const [salaryRes, aggregateRes, subsRes] = await Promise.all([
        api.get<{ summary: MonthlySummary }>(`/api/salary/summary?year=${currentYear}&month=${currentMonth}&_cb=${cacheBuster}`),
        api.get<AggregateResponse>(`/api/transactions/aggregate?year=${currentYear}&month=${currentMonth}&_cb=${cacheBuster}`),
        api.get<{ subscriptions: UpcomingSubscription[] }>(`/api/subscriptions/upcoming?days=7&_cb=${cacheBuster}`),
      ]);

      setSalarySummary(salaryRes.summary);
      setAggregate(aggregateRes);
      setUpcomingSubs(subsRes.subscriptions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentMonth]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const handleFocus = () => {
      fetchDashboardData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchDashboardData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompact = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}Tr`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toString();
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const stats = useMemo(() => {
    const thisMonthData = aggregate?.byMonth?.find(m => m._id.year === currentYear && m._id.month === currentMonth);
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const lastMonthData = aggregate?.byMonth?.find(m => m._id.year === lastYear && m._id.month === lastMonth);

    const thisIncome = thisMonthData?.income || 0;
    const thisExpense = thisMonthData?.expense || 0;
    const lastIncome = lastMonthData?.income || 0;
    const lastExpense = lastMonthData?.expense || 0;

    const savingsRate = thisIncome > 0 ? Math.round(((thisIncome - thisExpense) / thisIncome) * 100) : 0;
    const savingsChange = lastIncome > 0 
      ? Math.round(((thisIncome - thisExpense) / lastIncome - (lastIncome - lastExpense) / lastIncome) * 100)
      : 0;

    const expenseChange = lastExpense > 0 
      ? Math.round(((thisExpense - lastExpense) / lastExpense) * 100)
      : 0;

    return {
      thisIncome,
      thisExpense,
      thisNet: thisIncome - thisExpense,
      lastIncome,
      lastExpense,
      lastNet: lastIncome - lastExpense,
      savingsRate,
      savingsChange,
      expenseChange,
      totalSalary: salarySummary?.totalSalary || 0,
      totalShifts: salarySummary?.totalShifts || 0,
      totalSubs: upcomingSubs?.reduce((sum, s) => sum + s.amount, 0) || 0,
    };
  }, [aggregate, currentYear, currentMonth, salarySummary, upcomingSubs]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="w-24 h-1 bg-[#222] overflow-hidden rounded-[2px] relative">
          <div className="absolute top-0 left-0 h-full w-full bg-[#333]"></div>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[#A1A1AA]">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.85] tracking-tighter uppercase mb-2 text-white">
            {monthNames[currentDate.getMonth()]} <span className="text-[#333]">{currentYear}</span>
          </h2>
          <p className="font-mono text-xs text-[#71717A]">
            Last updated: {new Date().toLocaleTimeString('vi-VN')}
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="font-mono text-xs uppercase tracking-widest text-black bg-white px-4 py-2 border-2 border-transparent hover:bg-[#A1A1AA] transition-colors rounded-[2px]"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Payroll */}
        <div className="p-6 bg-[#0A0A0A] border-2 border-[#333] rounded-[2px] hover:border-[#666] hover:bg-[#111] transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between xl:mb-4 relative z-10">
            <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">Payroll</span>
            <span className="font-mono text-[10px] bg-[#222] border-2 border-[#444] px-2 py-0.5 rounded-[2px] text-[#E4E4E7]">{stats.totalShifts} shifts</span>
          </div>
          <p className="font-mono text-3xl xl:text-4xl font-black text-white tracking-tighter mt-4 relative z-10">{formatCompact(stats.totalSalary)}</p>
        </div>

        {/* Income */}
        <div className="p-6 bg-[#0A0A0A] border-2 border-[#333] rounded-[2px] hover:border-[#666] hover:bg-[#111] transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.02)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between xl:mb-4 relative z-10">
            <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">Income</span>
            {stats.thisIncome > stats.lastIncome && (
              <span className="font-mono text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-[2px] border border-[#22C55E]/30">↑{Math.round((stats.thisIncome / (stats.lastIncome || 1) - 1) * 100)}%</span>
            )}
          </div>
          <p className="font-mono text-3xl xl:text-4xl font-black text-[#22C55E] tracking-tighter mt-4 drop-shadow-[0_0_10px_rgba(34,197,94,0.1)] relative z-10">{formatCompact(stats.thisIncome)}</p>
        </div>

        {/* Expense */}
        <div className="p-6 bg-[#0A0A0A] border-2 border-[#333] rounded-[2px] hover:border-[#666] hover:bg-[#111] transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.02)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between xl:mb-4 relative z-10">
            <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">Expense</span>
            {stats.expenseChange > 0 && (
              <span className="font-mono text-[10px] text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded-[2px] border border-[#EF4444]/30">↑{stats.expenseChange}%</span>
            )}
            {stats.expenseChange < 0 && (
              <span className="font-mono text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-[2px] border border-[#22C55E]/30">↓{Math.abs(stats.expenseChange)}%</span>
            )}
          </div>
          <p className="font-mono text-3xl xl:text-4xl font-black text-[#EF4444] tracking-tighter mt-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.1)] relative z-10">{formatCompact(stats.thisExpense)}</p>
        </div>

        {/* Net Flow */}
        <div className="p-6 bg-[#0A0A0A] border-2 border-[#333] rounded-[2px] hover:border-[#666] hover:bg-[#111] transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between xl:mb-4 relative z-10">
            <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">Net Flow</span>
          </div>
          <p className={`font-mono text-3xl xl:text-4xl font-black tracking-tighter mt-4 relative z-10 ${stats.thisNet >= 0 ? 'text-[#22C55E] drop-shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'text-[#EF4444] drop-shadow-[0_0_10px_rgba(239,68,68,0.1)]'}`}>
            {stats.thisNet >= 0 ? '+' : ''}{formatCompact(stats.thisNet)}
          </p>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Savings Rate */}
        <div className="p-6 bg-[#0A0A0A] border-2 border-[#333] rounded-[2px] hover:border-[#666] transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">Savings Rate</span>
            {stats.savingsChange !== 0 && (
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-[2px] border ${stats.savingsChange > 0 ? 'text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/10' : 'text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/10'}`}>
                {stats.savingsChange > 0 ? '+' : ''}{stats.savingsChange}%
              </span>
            )}
          </div>
          <div>
            <p className={`font-mono text-4xl lg:text-5xl font-black tracking-tighter ${stats.savingsRate >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {stats.savingsRate}%
            </p>
            <div className="h-3 bg-[#111] border-2 border-[#222] rounded-[2px] mt-4 overflow-hidden shadow-inner p-[1px]">
              <div 
                className={`h-full rounded-[1px] transition-all duration-1000 ${stats.savingsRate >= 0 ? 'bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}
                style={{ width: `${Math.min(100, Math.max(0, stats.savingsRate))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Subscriptions */}
        <div className="p-6 bg-[#0A0A0A] border-2 border-[#333] rounded-[2px] hover:border-[#666] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">Subscriptions</span>
            {upcomingSubs.length > 0 && (
              <span className="font-mono text-[10px] bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.5)] text-white font-bold px-3 py-1 rounded-[2px] flex items-center gap-2 tracking-widest">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                {upcomingSubs.length} DUE
              </span>
            )}
          </div>
          <p className="font-mono text-4xl lg:text-5xl font-black tracking-tighter text-white">{formatCompact(stats.totalSubs)}</p>
        </div>

        {/* Comparison with last month */}
        <div className="p-6 bg-[#0A0A0A] border-2 border-[#333] rounded-[2px] hover:border-[#666] transition-all flex flex-col justify-between">
          <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest mb-4 inline-block">vs Last Month</span>
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <div className="p-4 bg-[#111] rounded-[2px] border-2 border-[#222]">
              <p className="font-mono text-[10px] text-[#71717A] mb-2 uppercase tracking-widest">Income</p>
              <p className={`font-mono text-xl xl:text-3xl font-black tracking-tighter ${stats.thisIncome >= stats.lastIncome ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {stats.thisIncome >= stats.lastIncome ? '+' : ''}{formatCompact(stats.thisIncome - stats.lastIncome)}
              </p>
            </div>
            <div className="p-4 bg-[#111] rounded-[2px] border-2 border-[#222]">
              <p className="font-mono text-[10px] text-[#71717A] mb-2 uppercase tracking-widest">Expense</p>
              <p className={`font-mono text-xl xl:text-3xl font-black tracking-tighter ${stats.thisExpense <= stats.lastExpense ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {stats.thisExpense <= stats.lastExpense ? '-' : '+'}{formatCompact(Math.abs(stats.thisExpense - stats.lastExpense))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Breakdown & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Expense by Category */}
        <div className="p-6 lg:p-8 bg-[#0A0A0A] border-2 border-[#333] rounded-[2px] hover:border-[#555] transition-colors relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.015)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest mb-8 border-b-2 border-[#222] pb-6 relative z-10">Expense Breakdown</h3>
          <div className="space-y-6 relative z-10">
            {aggregate?.byCategory?.slice(0, 6).map((cat, idx) => {
              const percentage = stats.thisExpense > 0 ? Math.round((cat.total / stats.thisExpense) * 100) : 0;
              const colors = ['#FAFAFA', '#D4D4D8', '#A1A1AA', '#71717A', '#52525B', '#3f3f46'];
              return (
                <div key={idx} className="group/item">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider transition-colors group-hover/item:text-white" style={{color: colors[idx % 6]}}>
                      {String(idx + 1).padStart(2, '0')}. {cat._id}
                    </span>
                    <span className="font-mono text-xs text-[#FAFAFA] font-bold">
                      {formatCompact(cat.total)} <span className="text-[#71717A] font-normal ml-1">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-[2px] w-full bg-[#222]">
                    <div 
                      className="h-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                      style={{ width: `${Math.max(2, percentage)}%`, backgroundColor: colors[idx % 6] }}
                    />
                  </div>
                </div>
              );
            })}
            {(!aggregate?.byCategory || aggregate.byCategory.length === 0) && (
              <p className="font-mono text-xs tracking-widest text-[#71717A] text-center py-10">NO EXPENSE DATA_</p>
            )}
          </div>
        </div>

        {/* 7-Day Activity */}
        <div className="p-6 lg:p-8 bg-[#0A0A0A] border-2 border-[#333] rounded-[2px] hover:border-[#555] transition-colors relative overflow-hidden">
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest mb-8 border-b-2 border-[#222] pb-6 relative z-10">Last 7 Days Run</h3>
          <div className="flex items-end gap-2 lg:gap-4 h-48 relative z-10 mt-4">
            {aggregate?.last7Days?.slice(-7).map((day, idx) => {
              const maxValue = Math.max(...(aggregate?.last7Days?.slice(-7).map(d => Math.max(d.income, d.expense)) || [1]));
              const incomeHeight = maxValue > 0 ? (day.income / maxValue) * 100 : 0;
              const expenseHeight = maxValue > 0 ? (day.expense / maxValue) * 100 : 0;
              const net = day.income - day.expense;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3 group/bar">
                  <div className="w-full flex gap-1 items-end h-[120px] bg-[#111] p-1 rounded-[2px] border border-[#222] transition-colors group-hover/bar:border-[#444] group-hover/bar:bg-[#18181A]">
                    <div 
                      className="flex-1 rounded-[1px] transition-all duration-700 bg-gradient-to-t from-[#22C55E]/40 to-[#22C55E] group-hover/bar:brightness-125"
                      style={{ height: `${Math.max(4, incomeHeight)}%` }}
                      title={`Income: ${formatCurrency(day.income)}`}
                    />
                    <div 
                      className="flex-1 rounded-[1px] transition-all duration-700 bg-gradient-to-t from-[#EF4444]/40 to-[#EF4444] group-hover/bar:brightness-125"
                      style={{ height: `${Math.max(4, expenseHeight)}%` }}
                      title={`Expense: ${formatCurrency(day.expense)}`}
                    />
                  </div>
                  <div className="w-full text-center">
                    <p className={`font-mono text-[9px] font-bold tracking-wider ${net >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {net >= 0 ? '+' : ''}{formatCompact(net)}
                    </p>
                    <p className="font-mono text-[8px] text-[#71717A] uppercase mt-1 tracking-widest">{day._id.slice(5)}</p>
                  </div>
                </div>
              );
            })}
            {(!aggregate?.last7Days || aggregate.last7Days.length === 0) && (
              <div className="w-full flex items-center justify-center">
                <p className="font-mono text-xs tracking-widest text-[#71717A]">NO ACTIVITY LOGS_</p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-8 mt-8 border-t-2 border-[#222] pt-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-t from-[#22C55E]/40 to-[#22C55E] rounded-[1px]"></div>
              <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">Inflow</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-t from-[#EF4444]/40 to-[#EF4444] rounded-[1px]"></div>
              <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">Outflow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#0A0A0A] border-2 border-[#333] rounded-[2px] overflow-hidden mb-6">
        <div className="p-6 bg-[#050505] border-b-2 border-[#333] flex justify-between items-center group">
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest">Activity Log</h3>
          <a href="/dashboard/ledger" className="font-mono text-[10px] uppercase tracking-widest text-[#FAFAFA] border-2 border-[#E4E4E7] px-4 py-2 bg-[#111] hover:bg-[#E4E4E7] hover:text-black transition-colors rounded-[2px]">
            [ VIEW_ALL ]
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-[#222] font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest bg-[#0A0A0A]">
                <th className="px-6 py-4 font-normal">Date ID</th>
                <th className="px-6 py-4 font-normal text-right">Inflow</th>
                <th className="px-6 py-4 font-normal text-right">Outflow</th>
                <th className="px-6 py-4 font-normal text-right w-1/4">Net Flow</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm divide-y divide-[#222]">
              {aggregate?.last7Days?.slice(-7).reverse().map((day, idx) => (
                <tr key={idx} className="hover:bg-[#111] transition-colors group">
                  <td className="px-6 py-5 text-[#FAFAFA] font-bold">{day._id}</td>
                  <td className="px-6 py-5 text-right text-[#A1A1AA]">
                    {day.income > 0 ? <span className="text-[#22C55E]">{formatCurrency(day.income)}</span> : '-'}
                  </td>
                  <td className="px-6 py-5 text-right text-[#A1A1AA]">
                    {day.expense > 0 ? <span className="text-[#EF4444]">{formatCurrency(day.expense)}</span> : '-'}
                  </td>
                  <td className={`px-6 py-5 text-right font-black tracking-wider ${day.income - day.expense >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {day.income - day.expense > 0 ? '+' : ''}{formatCurrency(day.income - day.expense)}
                  </td>
                </tr>
              ))}
              {(!aggregate?.last7Days || aggregate.last7Days.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#71717A] tracking-widest text-xs uppercase">NO RECENT ACTIVITY_</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
