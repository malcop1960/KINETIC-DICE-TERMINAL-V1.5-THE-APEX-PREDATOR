/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Crosshair, Activity, HelpCircle, BarChart3 } from 'lucide-react';

import { APP_CONFIG } from '../config';
import SessionTimer from './SessionTimer';

interface HeaderProps {
  activeTab: 'engine' | 'documentation' | 'analytics';
  setActiveTab: (tab: 'engine' | 'documentation' | 'analytics') => void;
  isAutoBreakerEnabled?: boolean;
  handleToggleAutoBreaker?: () => void;
  handleDealerChange?: () => void;
  spins?: any[];
}

export default function Header({
  activeTab,
  setActiveTab,
  isAutoBreakerEnabled = true,
  handleToggleAutoBreaker,
  handleDealerChange,
  spins,
}: HeaderProps) {
  return (
    <header id="header-section" className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-4 gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 shadow-emerald-500/10">
          <Crosshair className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent uppercase">
              KINETIC-DICE TERMINAL
            </h1>
            <span className="text-[10px] border px-2 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase transition-colors duration-250 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              V1.0 APEX
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">
             Deterministic Kinetic Matrix Engine
          </p>
        </div>
      </div>

      {/* Control Tools Bar */}
      <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
        {handleDealerChange && (
          <button
            onClick={handleDealerChange}
            className={`px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider rounded-md border flex items-center gap-2 transition-all bg-sky-500/10 text-sky-400 border-sky-500/30 hover:bg-sky-500/20 shadow-[0_0_10px_rgba(14,165,233,0.1)]`}
          >
             🔄 DEALER CHANGE
          </button>
        )}
        {handleToggleAutoBreaker && (
          <button
            onClick={handleToggleAutoBreaker}
            className={`px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider rounded-md border flex items-center gap-2 transition-all ${
              isAutoBreakerEnabled 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
             <div className={`w-1.5 h-1.5 rounded-full ${isAutoBreakerEnabled ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
             AUTO BREAKER: {isAutoBreakerEnabled ? 'ON' : 'OFF'}
          </button>
        )}
        <SessionTimer />
        
        {/* Navigation Tab */}
        <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('engine')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'engine'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Engine Room
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Quant Analytics
          </button>
          <button
            onClick={() => setActiveTab('documentation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'documentation'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Formula Specs
          </button>
        </div>
      </div>
    </header>
  );
}
