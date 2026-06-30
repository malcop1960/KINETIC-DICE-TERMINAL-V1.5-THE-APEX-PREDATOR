import React from 'react';
import { EngineState } from '../types';

interface Props {
  session: EngineState;
  onEngage: () => void;
  onAbort: () => void;
}

export default function TableQualifier({ session, onEngage, onAbort }: Props) {
  if (!session.isCalibrating) return null;

  const totalSpins = session.spins.length;
  const isQualifying = totalSpins >= 10;
  
  let validWins = 0;
  let validMisses = 0;
  
  session.spins.forEach(s => {
    if (s.strikeType === 'Win') {
        validWins++;
    } else if (s.strikeType === 'Miss') {
        validMisses++;
    }
  });

  const validDenominator = validWins + validMisses;
  const winRate = validDenominator > 0 ? (validWins / validDenominator) * 100 : 0;
  const sessionNet = session.theoreticalNet;

  let gradeLetter = '-';
  let gradeText = 'GATHERING DATA...';
  let gradeColor = 'text-indigo-400 bg-indigo-950/20 border-indigo-500/30';

  if (isQualifying) {
      if (sessionNet > 0 && winRate >= 33) {
          gradeLetter = 'A';
          gradeText = 'TABLE QUALIFIED. Optimum Dealer Signature Detected.';
          gradeColor = 'text-green-400 bg-green-950/50 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.2)]';
      } else if (sessionNet <= 0 && winRate >= 30) {
          gradeLetter = 'C';
          gradeText = 'TABLE CHOPPY. Caution Advised.';
          gradeColor = 'text-amber-400 bg-amber-950/50 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]';
      } else {
          gradeLetter = 'F';
          gradeText = 'TABLE REJECTED. High Variance. Find a new dealer.';
          gradeColor = 'text-rose-400 bg-rose-950/50 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]';
      }
  }

  return (
    <div className="w-full bg-slate-900 border border-indigo-500/30 rounded-[22px] p-6 shadow-[0_0_20px_rgba(99,102,241,0.05)] pt-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10 w-full hover:bg-transparent">
        
        {/* Left Side: Stats */}
        <div className="flex-1 space-y-5 w-full">
            <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 font-mono text-[10px] md:text-sm rounded border border-indigo-500/30 uppercase tracking-[0.2em] font-bold">
                    Pre-Flight Backtesting
                </span>
                <span className="text-slate-400 font-mono text-sm uppercase tracking-wider">
                    Spins: <strong className={isQualifying ? "text-indigo-400" : "text-slate-200"}>{totalSpins}</strong> / 10 Min
                </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md w-full">
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-mono">Theoretical Net</div>
                    <div className={`text-3xl font-bold font-mono ${sessionNet > 0 ? 'text-green-400' : sessionNet < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                        {sessionNet > 0 ? '+' : ''}{sessionNet}U
                    </div>
                </div>
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-mono">True Win Rate</div>
                    <div className={`text-3xl font-bold font-mono ${winRate >= 33 ? 'text-green-400' : winRate >= 30 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {validDenominator > 0 ? winRate.toFixed(1) : '0.0'}%
                    </div>
                </div>
            </div>
        </div>

        {/* Right Side: Grade & Actions */}
        <div className="flex-1 w-full flex flex-col pt-2 xl:pt-0 gap-4">
            {/* Grade Display */}
            <div className={`w-full rounded-xl border p-4 md:p-5 flex gap-4 md:gap-5 items-center transition-all duration-500 ${gradeColor}`}>
                <div className="text-5xl md:text-6xl font-black font-sans leading-none tracking-tighter mix-blend-plus-lighter">
                   {gradeLetter}
                </div>
                <div className="flex-1 font-mono text-sm md:text-base font-bold uppercase tracking-tight leading-snug">
                    {gradeText}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button 
                  onClick={onEngage}
                  disabled={!isQualifying}
                  className={`flex-1 py-3 md:py-4 px-4 rounded-xl font-bold uppercase tracking-[0.15em] text-xs md:text-sm transition-all duration-300 border ${
                      isQualifying 
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                      : 'bg-slate-800/50 text-slate-600 border-slate-800 cursor-not-allowed'
                  }`}
                >
                    Engage Table
                </button>
                <button 
                  onClick={onAbort}
                  className="px-5 md:px-8 py-3 md:py-4 bg-slate-800/80 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 rounded-xl font-bold uppercase tracking-widest text-xs md:text-sm border border-slate-700 hover:border-rose-500/50 transition-colors"
                >
                    Abort
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
