import React, { useMemo } from 'react';
import { EngineState } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Activity, TrendingDown, TrendingUp, Target, ShieldAlert } from 'lucide-react';
import StrikeZoneHeatmapD3 from './StrikeZoneHeatmapD3';

interface AnalyticsDashboardProps {
  session: EngineState;
}

export default function AnalyticsDashboard({ session }: AnalyticsDashboardProps) {
  const { spins, currentScore, sessionHigh, sessionLow } = session;

  const displaySpins = useMemo(() => {
    if (session.isCalibrating) return spins;
    return spins.filter(s => s.isRealMoney);
  }, [spins, session.isCalibrating]);

  const kpis = useMemo(() => {
    let activeSpins = 0;
    let wins = 0;
    let misses = 0;
    let zeroSkips = 0;

    displaySpins.forEach(spin => {
      if (spin.strikeType === 'Win') wins++;
      if (spin.strikeType === 'Miss') misses++;
      if (spin.strikeType === 'Zero Pause') zeroSkips++;
      if (spin.strikeType === 'Win' || spin.strikeType === 'Miss') {
        activeSpins++;
      }
    });

    const winRate = activeSpins > 0 ? (wins / activeSpins) * 100 : 0;
    const exposure = activeSpins * 2;

    return {
      wins,
      misses,
      zeroSkips,
      winRate: winRate.toFixed(1),
      exposure,
    };
  }, [displaySpins]);

  const equityData = useMemo(() => {
    let score = 0;
    return displaySpins.map((spin, index) => {
      score += spin.scoreDelta;
      return {
        spinNum: index + 1,
        hit: spin.hit,
        score: score,
        strikeType: spin.strikeType,
      };
    });
  }, [displaySpins]);

  const varianceData = [
    { name: 'Target Wins', value: kpis.wins, color: '#10b981' },
    { name: 'Target Misses', value: kpis.misses, color: '#f43f5e' },
    { name: 'Zero Skips', value: kpis.zeroSkips, color: '#0ea5e9' },
  ].filter(item => item.value > 0);

  const CustomTooltipLine = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl">
          <p className="text-slate-300 text-xs font-mono mb-1">Spin #{data.spinNum}</p>
          <p className="text-white font-bold text-sm">Hit: {data.hit}</p>
          <p className="text-[11px] text-slate-400">Result: {data.strikeType}</p>
          <p className={`font-mono text-sm mt-1 ${data.score >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            Profit: {data.score > 0 ? '+' : ''}{data.score}U
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col space-y-6 w-full animate-in fade-in zoom-in-95 duration-500">
      
      {/* 🟢 KPI RIBBON */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Net Profit */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Net Profit/Loss
          </span>
          <span className={`text-3xl font-display font-bold ${currentScore >= 0 ? 'text-emerald-400' : 'text-crimson-400 text-rose-500'}`}>
            {currentScore > 0 ? '+' : ''}{currentScore}U
          </span>
        </div>

        {/* Peak Watermark */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Peak Watermark
          </span>
          <span className="text-2xl font-mono font-bold text-cyan-400">
            +{sessionHigh}U
          </span>
        </div>

        {/* Max Drawdown */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" /> Max Drawdown
          </span>
          <span className="text-2xl font-mono font-bold text-rose-400">
            {sessionLow}U
          </span>
        </div>

        {/* Win Rate */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-purple-400" /> Win Rate %
          </span>
          <span className="text-2xl font-mono font-bold text-purple-400">
            {kpis.winRate}%
          </span>
        </div>

        {/* Total Exposure */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center sm:col-span-2 md:col-span-1 xl:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Total Exposure
          </span>
          <span className="text-2xl font-mono font-bold text-amber-400">
            {kpis.exposure}U
          </span>
        </div>
      </div>

      {/* 📊 MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* EQUITY CURVE (Spans 2 columns) */}
        <div className="xl:col-span-2 bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] flex flex-col min-h-[400px]">
          <h3 className="text-slate-300 font-display font-bold tracking-wide uppercase text-sm mb-6 flex items-center gap-2">
            Equity Curve <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">P/L Trajectory</span>
          </h3>
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={equityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="spinNum" stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltipLine />} />
                <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} 
                  activeDot={{ r: 6, fill: '#34d399', stroke: '#064e3b', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SIDE CHARTS (1 column) */}
        <div className="flex flex-col gap-6">
          
          {/* STRIKE ZONE HEATMAP */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] flex-1 flex flex-col">
            <h3 className="text-slate-300 font-display font-bold tracking-wide uppercase text-sm mb-4">
              Strike Zone Heatmap
            </h3>
            <div className="flex-1 w-full min-h-[180px]">
              <StrikeZoneHeatmapD3 spins={displaySpins} />
            </div>
          </div>

          {/* VARIANCE DISTRIBUTION */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] flex-1 flex flex-col">
            <h3 className="text-slate-300 font-display font-bold tracking-wide uppercase text-sm mb-2">
              Variance Distribution
            </h3>
            <div className="flex-1 w-full min-h-[150px] flex items-center justify-center relative">
              {varianceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={varianceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {varianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-600 text-xs font-mono absolute">No Active Strikes</div>
              )}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 mt-2">
              {varianceData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
