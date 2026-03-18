'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';
import { MonthlySummary, AggregateResponse, UpcomingSubscription } from '@/types';

export default function DashboardPage() {
  const [salarySummary, setSalarySummary] = useState<MonthlySummary | null>(null);
  const [aggregate, setAggregate] = useState<AggregateResponse | null>(null);
  const [upcomingSubs, setUpcomingSubs] = useState<UpcomingSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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

      console.log('Dashboard data:', { salaryRes, aggregateRes, subsRes });
      
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
    const handleRouteChange = () => {
      fetchDashboardData();
    };
    
    const handleFocus = () => {
      fetchDashboardData();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchDashboardData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="w-24 h-1 bg-[#222] overflow-hidden rounded-[2px] relative">
          <div className="absolute top-0 left-0 h-full w-full bg-[#333]"></div>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[#A1A1AA]">Fetching Signals...</div>
      </div>
    );
  }

  const monthlyExpense = aggregate?.byMonth?.find(
    (m) => m._id.year === currentYear && m._id.month === currentMonth
  )?.expense || 0;

  const monthlyIncome = aggregate?.byMonth?.find(
    (m) => m._id.year === currentYear && m._id.month === currentMonth
  )?.income || 0;

  const totalMonthlySubs = upcomingSubs?.reduce((sum, sub) => sum + sub.amount, 0) || 0;

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
            {monthNames[currentDate.getMonth()]} <span className="text-[#333]">{currentYear}</span>
          </h2>
          <div className="font-mono text-xs tracking-widest text-[#A1A1AA] flex items-center gap-3">
            <span className="w-2 h-2 bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)] rounded-[1px]"></span> System Active
          </div>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="font-mono text-xs uppercase tracking-widest text-black bg-white px-4 py-2 border-2 border-transparent hover:bg-[#A1A1AA] hover:text-white transition-colors rounded-[2px]"
        >
          {loading ? 'LOADING...' : '[ REFRESH ]'}
        </button>
      </header>

      {/* Main Grid: Brutalist Asymmetric 8 / 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* HUGE Primary KPI - Net Flow & Income -> Col span 8 */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="p-6 md:p-10 lg:p-16 border-2 border-[#333] bg-[#0A0A0A] rounded-[4px] relative overflow-hidden group transition-all duration-500 hover:border-[#666] hover:bg-[#111] hover:shadow-[0_0_40px_rgba(255,255,255,0.03)] h-full flex flex-col justify-center">
            {/* Minimal Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
            
            <div className="relative z-10 flex flex-col gap-12">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs lg:text-sm text-[#A1A1AA] uppercase tracking-widest block">Gross Income</span>
                    <span className="font-mono text-[10px] lg:text-xs bg-[#222] px-3 py-1.5 lg:px-4 lg:py-2 text-[#E4E4E7] border-2 border-[#444] rounded-[2px] tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.05)]">{salarySummary?.totalShifts || 0} SHIFTS</span>
                  </div>
                  <h3 className="text-4xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-[#666]">
                    {formatCurrency(salarySummary?.totalSalary || 0)}
                  </h3>
               </div>
               
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 pt-8 border-t-2 border-[#333]">
                   <div>
                     <span className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest block mb-2">Total Income</span>
                     <div className="text-3xl lg:text-4xl font-bold tracking-tight text-[#22C55E] drop-shadow-[0_0_12px_rgba(34,197,94,0.3)]">
                       {formatCurrency(monthlyIncome)}
                     </div>
                   </div>
                   <div>
                     <span className="font-mono text-[10px] text-[#E4E4E7] uppercase tracking-widest block mb-2">Total Expense</span>
                     <div className="text-3xl lg:text-4xl font-bold tracking-tight text-[#EF4444] drop-shadow-[0_0_12px_rgba(239,68,68,0.3)]">
                       {formatCurrency(monthlyExpense)}
                    </div>
                </div>
             </div>
           </div>
         </div>
        </div>

        {/* Subscriptions Alert -> Col span 4 */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 md:p-10 border-2 border-[#333] bg-[#0A0A0A] rounded-[4px] relative overflow-hidden h-full flex flex-col justify-center transition-all hover:border-[#555] hover:bg-[#111] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] duration-500 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
             <div className="flex justify-between items-start mb-6 relative z-10 border-b-2 border-[#222] pb-6">
               <span className="font-mono text-sm uppercase tracking-widest font-bold text-[#FAFAFA]">Upcoming Subs</span>
               <div className={`font-mono text-[10px] px-3 py-1 font-bold rounded-[2px] ${upcomingSubs.length > 0 ? 'bg-[#EF4444] text-black shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-[#222] border-2 border-[#444] text-[#E4E4E7]'}`}>
                 {upcomingSubs.length} ALERT(S)
               </div>
            </div>
            <div className="relative z-10 flex flex-col items-start gap-3">
               <h3 className={`text-4xl lg:text-5xl font-black tracking-tighter text-white`}>
                {formatCurrency(totalMonthlySubs)}
               </h3>
               {upcomingSubs.length > 0 ? (
                 <p className="font-mono text-[9px] font-bold text-[#EF4444] uppercase tracking-[0.2em] flex items-center gap-3 bg-[#111] border-2 border-[#555] px-4 py-2 rounded-[2px] shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                   <span className="w-2 h-2 bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>
                   {Math.min(...upcomingSubs.map(s => s.daysUntil)) === 0 
                     ? 'DUE_TODAY_!_ACTION_REQUIRED' 
                     : `CLOSING_IN_${Math.min(...upcomingSubs.map(s => s.daysUntil))}_DAYS`}
                 </p>
               ) : (
                 <p className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">
                   System Clear
                 </p>
               )}
            </div>
          </div>
        </div>

        {/* Burn Rate -> Col span 6 */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="p-6 md:p-10 border-2 border-[#333] bg-[#0A0A0A] rounded-[4px] flex flex-col justify-center transition-all duration-500 hover:border-[#666] hover:bg-[#111] h-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex justify-between items-end mb-8 font-mono uppercase text-xs tracking-widest relative z-10">
              <span className="text-[#E4E4E7]">Inflow / Outflow Burn Rate</span>
              <span className="text-black bg-[#E4E4E7] font-bold border-2 border-[#E4E4E7] px-3 py-1 rounded-[2px] shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                {Math.round((monthlyExpense / (monthlyIncome || 1)) * 100)}% BURN
              </span>
            </div>
            
            <div className="h-6 w-full bg-[#111] border-2 border-[#333] rounded-[4px] flex overflow-hidden shadow-inner relative z-10 p-[1px] items-center justify-center">
              {(monthlyIncome === 0 && monthlyExpense === 0) ? (
                <span className="font-mono text-[9px] text-[#555] tracking-[0.2em] uppercase">
                  AWAITING_FLOW_DATA_
                </span>
              ) : (
                 <>
                   <div className="h-full bg-gradient-to-r from-white to-[#A1A1AA] rounded-l-[2px] transition-all duration-1000 relative" style={{ width: `${Math.min(100, (monthlyIncome / (monthlyIncome + monthlyExpense)) * 100)}%` }}>
                      <div className="absolute right-0 top-0 bottom-0 w-4 bg-white opacity-50 blur-[2px]"></div>
                   </div>
                   <div className="h-full bg-gradient-to-r from-[#EF4444] to-[#B91C1C] rounded-r-[2px] transition-all duration-1000" style={{ width: `${Math.min(100, (monthlyExpense / (monthlyIncome + monthlyExpense)) * 100)}%` }}></div>
                 </>
              )}
            </div>
          </div>
        </div>

        {/* Top Categories -> Col span 6 */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="p-6 md:p-10 border-2 border-[#333] bg-[#0A0A0A] rounded-[4px] flex-1 hover:border-[#666] hover:bg-[#111] transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.015)_0%,transparent_100%)] group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-center mb-10 border-b-2 border-[#222] pb-8 relative z-10">
               <span className="font-mono text-sm text-[#FAFAFA] font-bold uppercase tracking-widest">Top Outflows</span>
            </div>
            <div className="space-y-10 relative z-10">
              {aggregate?.byCategory?.slice(0, 5).map((cat, idx) => {
                const colors = ['#FAFAFA', '#D4D4D8', '#A1A1AA', '#71717A', '#52525B'];
                return (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <span className="font-mono text-xs font-bold uppercase truncate pr-4" style={{color: colors[idx % 5]}}>
                        {(idx + 1).toString().padStart(2, '0')}. {cat._id}
                      </span>
                      <span className="font-mono text-xs text-[#FAFAFA]">{formatCurrency(cat.total)}</span>
                    </div>
                    {/* Visual Bar inside the category */}
                    <div className="w-full h-[1px] bg-[#222]">
                      <div className="h-[2px] -mt-[0.5px] transition-all duration-1000" style={{ width: `${Math.max(2, (cat.total / (monthlyExpense || 1)) * 100)}%`, backgroundColor: colors[idx % 5] }}></div>
                    </div>
                  </div>
                );
              })}
              {(!aggregate?.byCategory || aggregate.byCategory.length === 0) && (
                <div className="font-mono text-xs text-[#71717A]">NO DATA_</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Recent Activity Row */}
      <div className="mt-8 border-2 border-[#333] bg-[#0A0A0A] rounded-[4px] mb-8">
        <div className="p-6 md:p-8 border-b-2 border-[#333] flex justify-between items-center bg-[#050505]">
          <span className="font-mono text-xs lg:text-sm text-[#A1A1AA] uppercase tracking-widest">Activity Log</span>
          <a href="/dashboard/ledger" className="font-mono text-[10px] lg:text-xs uppercase tracking-widest text-[#FAFAFA] border-2 border-[#E4E4E7] hover:border-[#E4E4E7] px-3 py-1.5 lg:px-4 lg:py-2 bg-[#111] hover:bg-[#E4E4E7] hover:text-black transition-colors rounded-[2px]">
            [ VIEW_ALL ]
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#555] font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest bg-[#09090B]">
                <th className="p-6 font-normal">Date ID</th>
                <th className="p-6 font-normal text-right">Inflow</th>
                <th className="p-6 font-normal text-right">Outflow</th>
                <th className="p-6 font-normal w-1/3 text-right">Net Flow</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm leading-none divide-y divide-[#222]">
              {aggregate?.last7Days?.slice(-5).reverse().map((day, idx) => (
                <tr key={idx} className="hover:bg-[#111] transition-colors group">
                  <td className="p-6 text-[#E4E4E7] group-hover:text-white transition-colors">
                    {day._id}
                  </td>
                  <td className="p-6 text-right text-[#E4E4E7]">
                    {day.income > 0 ? formatCurrency(day.income) : '-'}
                  </td>
                  <td className="p-6 text-right text-[#E4E4E7]">
                    {day.expense > 0 ? formatCurrency(day.expense) : '-'}
                  </td>
                  <td className="p-6 text-right font-bold w-1/3 relative">
                    <div className="flex items-center justify-end gap-4">
                      {/* Visual Sparkline */}
                      <div className="hidden lg:flex w-24 h-[4px] bg-[#222] rounded-[1px] overflow-hidden">
                        <div 
                          className={`h-full ${day.income - day.expense >= 0 ? 'bg-gradient-to-r from-transparent to-[#22C55E]' : 'bg-gradient-to-r from-transparent to-[#EF4444]'}`}
                          style={{
                            width: `${Math.max(5, Math.min(100, (Math.abs(day.income - day.expense) / (Math.max(day.income, day.expense) || 1)) * 100))}%`,
                            marginLeft: day.income - day.expense >= 0 ? 'auto' : '0'
                          }}
                        />
                      </div>
                      <span className={day.income - day.expense >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
                        {day.income - day.expense > 0 ? '+' : ''}{formatCurrency(day.income - day.expense)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {(!aggregate?.last7Days || aggregate.last7Days.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#71717A] font-mono text-xs tracking-widest">NO ENTRIES FOUND_</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
