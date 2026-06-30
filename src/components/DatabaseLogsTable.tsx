/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity } from 'lucide-react';
import { SpinItem } from '../types';

interface DatabaseLogsTableProps {
  spins: SpinItem[];
  formatNumbersList: (arr: number[]) => string;
}

function getRouletteNumberColor(num: number): 'red' | 'black' | 'green' {
  if (num === 0) return 'green';
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  return redNumbers.includes(num) ? 'red' : 'black';
}

export default function DatabaseLogsTable({
  spins,
}: DatabaseLogsTableProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] space-y-4">
      {/* Dynamic Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-sm font-display font-semibold tracking-wide text-slate-300 uppercase flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-cyan-400" />
            KINETIC-DICE DATABASE LOG
          </h2>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
            Real-time analytical output conforming strictly to specification layouts
          </p>
        </div>
      </div>

      {/* Table Containers */}
      <div className="overflow-x-auto border border-slate-900 rounded-xl">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-900 text-slate-500 uppercase tracking-wider text-[10px] truncate">
                <th className="py-3 px-4 font-semibold opacity-80">SPIN_N</th>
                <th className="py-3 px-4 font-semibold text-center opacity-80">HIT</th>
                <th className="py-3 px-4 font-semibold text-center text-cyan-500/80">DOUBLE STREET A</th>
                <th className="py-3 px-4 font-semibold text-center text-cyan-500/80">DOUBLE STREET B</th>
                <th className="py-3 px-4 font-semibold text-center text-cyan-500/80">RULE USED</th>
                <th className="py-3 px-4 font-semibold text-center opacity-80">STRIKE</th>
                <th className="py-3 px-4 font-semibold text-right opacity-80">SCORE</th>
                <th className="py-3 px-4 font-semibold text-center opacity-80">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {spins.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-600 font-sans font-normal">
                    No historical entries found yet. Enter spin results above to activate calculations.
                  </td>
                </tr>
              ) : (
                [...spins].reverse().map((spin, idx, arr) => {
                  let strikeBadge = null;
                  let rowTintGroup1 = 'bg-slate-900/10';
                  if (spin.strikeType === 'Win') {
                    strikeBadge = <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold text-center inline-block min-w-[70px]">WIN</span>;
                    rowTintGroup1 = 'bg-emerald-950/20';
                  } else if (spin.strikeType === 'Miss') {
                    strikeBadge = <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded uppercase font-bold text-center inline-block min-w-[70px]">MISS</span>;
                    rowTintGroup1 = 'bg-rose-950/20';
                  } else if (spin.strikeType === 'Zero Pause') {
                    strikeBadge = <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded uppercase font-bold text-center inline-block min-w-[70px]">ZERO PAUSE</span>;
                  } else {
                    strikeBadge = <span className="text-[10px] text-slate-600 uppercase font-bold text-center inline-block min-w-[70px]">-</span>;
                  }

                  const scoreColor = spin.scoreDelta > 0
                    ? 'text-emerald-400 font-semibold'
                    : spin.scoreDelta < 0
                    ? 'text-rose-400 font-semibold'
                    : 'text-slate-500';

                  const statusBadgeColor = !spin.isRealMoney
                    ? 'text-indigo-400 font-semibold text-[9px] mt-0.5'
                    : spin.statusBeforeSpin === 'ACTIVE'
                    ? 'text-emerald-400 font-semibold text-[9px] mt-0.5'
                    : spin.statusBeforeSpin === 'EXIT_SIGNAL'
                    ? 'text-amber-400 font-semibold text-[9px] mt-0.5'
                    : 'text-rose-400 font-semibold text-[9px] mt-0.5';

                  const statusText = !spin.isRealMoney ? 'PRE-FLIGHT' : spin.statusBeforeSpin === 'ACTIVE' && spin.ruleUsed === 'Zero Pause' ? 'PAUSED' : spin.statusBeforeSpin;

                  const rowUi = (
                    <tr
                      key={idx}
                      className={`border-b border-slate-900/60 hover:bg-slate-900/40 transition-colors duration-100 ${!spin.isRealMoney ? 'opacity-70' : ''}`}
                    >
                      <td className={`py-3 px-4 font-bold text-slate-500 ${rowTintGroup1}`}>
                        #{spin.spinIndex}
                      </td>

                      <td className={`py-3 px-4 text-center ${rowTintGroup1}`}>
                        <span className={`px-2.5 py-1 text-sm rounded-lg font-bold border ${
                          getRouletteNumberColor(spin.hit) === 'red'
                            ? 'border-rose-500/30 text-rose-400 bg-rose-500/5'
                            : spin.hit === 0
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                            : 'border-slate-800 text-slate-300 bg-slate-900/50'
                        }`}>
                          {spin.hit}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center text-cyan-300 font-semibold text-sm bg-cyan-950/10">
                        {spin.targetA > 0 ? `DS ${spin.targetA}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-center text-cyan-300 font-semibold text-sm bg-cyan-950/10">
                        {spin.targetB > 0 ? `DS ${spin.targetB}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-center text-cyan-400/70 font-semibold text-[10px] tracking-wide bg-cyan-950/10">
                         {spin.ruleUsed}
                      </td>

                      <td className={`py-3 px-4 text-center ${rowTintGroup1}`}>
                        {strikeBadge}
                      </td>

                      <td className={`py-3 px-4 text-right ${rowTintGroup1} ${!spin.isRealMoney ? 'opacity-50' : ''}`}>
                        {spin.ruleUsed === 'Dealer Swap' ? (
                          <div className="flex flex-col items-end text-cyan-400 font-bold tracking-wide">
                              0 U (Swap)
                          </div>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span className="text-white font-bold tracking-wide">
                               {!spin.isRealMoney && spin.ruleUsed === 'Calibration' ? 'N/A' : !spin.isRealMoney ? 'N/A (SIM)' : `${100 + spin.accumulatedScore} U`}
                            </span>
                            <span className={`text-[10px] flex gap-1 items-center font-mono`}>
                               {!spin.isRealMoney && <span className="text-yellow-500/80">(SIM)</span>}
                               <span className={scoreColor}>{`${spin.scoreDelta > 0 ? '+' : ''}${spin.scoreDelta !== 0 ? spin.scoreDelta : '0'} U`}</span>
                            </span>
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-4 text-center ${rowTintGroup1}`}>
                        <span className={statusBadgeColor}>{statusText}</span>
                      </td>
                    </tr>
                  );

                  const previousSpinInArr = arr[idx + 1]; // Older spin
                  const needsDivider = spin.isRealMoney && previousSpinInArr && !previousSpinInArr.isRealMoney;

                  return (
                    <React.Fragment key={idx}>
                      {rowUi}
                      {needsDivider && (
                        <tr>
                          <td colSpan={8} className="py-3 bg-indigo-500/10 border-y border-indigo-500/30 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse" />
                            <span className="relative z-10 text-cyan-400 font-bold tracking-widest uppercase text-[10px] mx-auto flex justify-center items-center gap-2">
                              {/* Left line */}
                              <span className="w-12 h-px bg-cyan-400/50" />
                              LIVE PLAY ENGAGED
                              {/* Right line */}
                              <span className="w-12 h-px bg-cyan-400/50" />
                            </span>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
      </div>
    </div>
  );
}
