/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogsCardProps {
  diagnosticExplanation: {
    rule: string;
    text: string;
  };
  numSpinsEntered: number;
}

export default function LogsCard({
  diagnosticExplanation,
  numSpinsEntered,
}: LogsCardProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between uppercase tracking-wide">
        <span className="text-sm font-display font-bold text-slate-300 flex items-center gap-2">Kinetic-Dice Engine Logs</span>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
          Real-time
        </span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[140px] pr-1 space-y-2 font-sans font-normal text-xs text-slate-400">
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
          <div className="font-mono font-medium text-cyan-400 text-[10px] mb-1">
            {diagnosticExplanation.rule}
          </div>
          {diagnosticExplanation.text}
        </div>
      </div>
    </div>
  );
}
