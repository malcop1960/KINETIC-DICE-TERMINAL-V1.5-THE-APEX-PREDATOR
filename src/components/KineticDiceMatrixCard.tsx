/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, Sparkles } from 'lucide-react';
import { KineticDiceEngine } from '../engine';

interface KineticDiceMatrixCardProps {
  nextDSA: number;
  nextDSB: number;
  numSpinsEntered: number;
  formatNumbersList: (arr: number[]) => string;
}

export default function KineticDiceMatrixCard({
  nextDSA,
  nextDSB,
  numSpinsEntered,
  formatNumbersList,
}: KineticDiceMatrixCardProps) {

  const hasTargets = nextDSA > 0 && nextDSB > 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between uppercase tracking-wide">
        <span className="text-sm font-display font-bold text-slate-300 flex items-center gap-2">
          ACTIVE TARGET MATRIX
        </span>
        <Activity className="h-4 w-4 text-cyan-400" />
      </div>

      {hasTargets ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-500 uppercase font-mono mb-1">DOUBLE STREET A</span>
                <span className="text-4xl font-mono font-bold text-white mb-2">DS{nextDSA}</span>
                <span className="text-[11px] text-cyan-400 font-mono truncate max-w-full px-1">
                  {formatNumbersList(KineticDiceEngine.getDoubleStreetNumbers(nextDSA))}
                </span>
              </div>
            
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-500 uppercase font-mono mb-1">DOUBLE STREET B</span>
                <span className="text-4xl font-mono font-bold text-cyan-500 mb-2">DS{nextDSB}</span>
                <span className="text-[11px] text-cyan-400 font-mono truncate max-w-full px-1">
                  {formatNumbersList(KineticDiceEngine.getDoubleStreetNumbers(nextDSB))}
                </span>
              </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-slate-500 space-y-2 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
          <Sparkles className="h-6 w-6 text-slate-700" />
          <span className="text-[11px] font-mono text-center max-w-[180px]">STANDBY</span>
          <span className="text-[10px] text-slate-600 max-w-[200px] text-center font-sans tracking-wide">
             Awaiting incoming kinetic momentum.
          </span>
        </div>
      )}
    </div>
  );
}
