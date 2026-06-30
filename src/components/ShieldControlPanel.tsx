import React from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface ShieldControlPanelProps {
  dynamicYieldOracleEnabled: boolean;
  onToggleOracle: () => void;
}

export default function ShieldControlPanel({ dynamicYieldOracleEnabled, onToggleOracle }: ShieldControlPanelProps) {
  return (
    <div className={`border p-4 sm:p-6 rounded-[22px] flex flex-col justify-between transition-all duration-500 ${dynamicYieldOracleEnabled ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-slate-900/60 border-slate-800'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className={`text-sm font-display font-semibold uppercase flex items-center gap-2 mb-2 ${dynamicYieldOracleEnabled ? 'text-indigo-400' : 'text-slate-300'}`}>
            {dynamicYieldOracleEnabled ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            Dynamic Yield Oracle
          </h2>
          <p className="text-[10px] text-slate-500 font-mono leading-relaxed max-w-sm">
            Dynamically ratchets profit floors, calculates Matrix Efficiency to expand/contract trailing stops, and applies time-decay to hard stops.
          </p>
        </div>
        
        <button
          onClick={onToggleOracle}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
            dynamicYieldOracleEnabled ? 'bg-indigo-500' : 'bg-slate-700'
          }`}
          role="switch"
          aria-checked={dynamicYieldOracleEnabled}
        >
          <span className="sr-only">Toggle Dynamic Yield Oracle</span>
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              dynamicYieldOracleEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between font-mono text-[9px] uppercase font-bold">
        <span className="text-slate-500">Oracle Status</span>
        <span className={dynamicYieldOracleEnabled ? 'text-indigo-400' : 'text-slate-600'}>
          {dynamicYieldOracleEnabled ? 'ENGAGED & OVERRIDING DEFAULTS' : 'STANDBY (USING STATIC DEFAULTS)'}
        </span>
      </div>
    </div>
  );
}
