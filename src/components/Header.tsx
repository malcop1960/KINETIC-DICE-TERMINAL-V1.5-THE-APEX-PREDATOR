/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Crosshair, Activity, HelpCircle, BarChart3, Settings } from 'lucide-react';

import { APP_CONFIG } from '../config';

interface HeaderProps {
  activeTab: 'engine' | 'documentation' | 'analytics';
  setActiveTab: (tab: 'engine' | 'documentation' | 'analytics') => void;
  isAutoBreakerEnabled?: boolean;
  handleToggleAutoBreaker?: () => void;
  useSymmetricalMatrix?: boolean;
  handleToggleMatrixMode?: () => void;
  useVelocityOffset?: boolean;
  dealerVelocity?: number;
  handleToggleVelocityOffset?: () => void;
  dynamicYieldOracleEnabled?: boolean;
  handleToggleDynamicYield?: () => void;
  handleDealerChange?: () => void;
  spins?: any[];
}

export default function Header({
  activeTab,
  setActiveTab,
  isAutoBreakerEnabled = true,
  handleToggleAutoBreaker,
  useSymmetricalMatrix = false,
  handleToggleMatrixMode,
  useVelocityOffset = false,
  dealerVelocity = 0,
  handleToggleVelocityOffset,
  dynamicYieldOracleEnabled = false,
  handleToggleDynamicYield,
  handleDealerChange,
  spins,
}: HeaderProps) {
  const [isTacticsMenuOpen, setIsTacticsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsTacticsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasOverrideActive = !isAutoBreakerEnabled || useSymmetricalMatrix || useVelocityOffset || dynamicYieldOracleEnabled;

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
              V1.5 APEX
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
        
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsTacticsMenuOpen(!isTacticsMenuOpen)}
            className={`px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider rounded-md border flex items-center gap-2 transition-all ${
              hasOverrideActive 
              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Settings className={`h-3 w-3 ${isTacticsMenuOpen ? 'rotate-90' : ''} transition-transform duration-300`} />
            TACTICAL OVERRIDES
            {hasOverrideActive && (
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse ml-1" />
            )}
          </button>

          {isTacticsMenuOpen && (
            <div className="absolute right-0 md:left-0 md:right-auto top-full mt-2 w-48 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-lg p-2 flex flex-col gap-2 z-50 shadow-2xl">
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest px-2 pt-1 pb-2 border-b border-slate-800/50">
                System Overrides
              </div>
              
              {handleToggleAutoBreaker && (
                <button
                  onClick={handleToggleAutoBreaker}
                  className={`w-full px-3 py-2 text-[10px] font-mono font-bold tracking-wider rounded-md border flex items-center gap-2 transition-all ${
                    isAutoBreakerEnabled 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' 
                    : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${isAutoBreakerEnabled ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
                  BREAKER: {isAutoBreakerEnabled ? 'ON' : 'OFF'}
                </button>
              )}
              {handleToggleMatrixMode && (
                <button
                  onClick={handleToggleMatrixMode}
                  className={`w-full px-3 py-2 text-[10px] font-mono font-bold tracking-wider rounded-md border flex items-center gap-2 transition-all ${
                    useSymmetricalMatrix 
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20' 
                    : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${useSymmetricalMatrix ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'}`} />
                  MATRIX: {useSymmetricalMatrix ? 'SYM' : 'LEGACY'}
                </button>
              )}
              {handleToggleVelocityOffset && (
                <button
                  onClick={handleToggleVelocityOffset}
                  className={`w-full px-3 py-2 text-[10px] font-mono font-bold tracking-wider rounded-md border flex items-center gap-2 transition-all ${
                    useVelocityOffset 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20' 
                    : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${useVelocityOffset ? 'bg-rose-400 animate-pulse' : 'bg-slate-600'}`} />
                  OFFSET: {useVelocityOffset ? `${dealerVelocity > 0 ? '+' : ''}${dealerVelocity}` : 'OFF'}
                </button>
              )}
              {handleToggleDynamicYield && (
                <button
                  onClick={handleToggleDynamicYield}
                  className={`w-full px-3 py-2 text-[10px] font-mono font-bold tracking-wider rounded-md border flex items-center gap-2 transition-all ${
                    dynamicYieldOracleEnabled 
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20' 
                    : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${dynamicYieldOracleEnabled ? 'bg-indigo-400 animate-pulse' : 'bg-slate-600'}`} />
                  ORACLE: {dynamicYieldOracleEnabled ? 'ON' : 'OFF'}
                </button>
              )}
            </div>
          )}
        </div>
        
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
