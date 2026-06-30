/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { StatusType, EngineState } from '../types';

interface StatusBannersProps {
  status: StatusType;
  exitReason: string | null;
  handleReset: () => void;
  session: EngineState;
}

export default function StatusBanners({
  status,
  exitReason,
  handleReset,
  session
}: StatusBannersProps) {
  const getStatusColors = () => {
    if (status === 'SESSION_COMPLETE') {
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/40',
        iconBg: 'bg-emerald-500',
        title: 'text-emerald-300',
        text: 'text-emerald-400',
        btnBg: 'bg-emerald-500 hover:bg-emerald-600',
        btnShadow: 'shadow-emerald-500/15'
      };
    } else if (status === 'EXIT_SIGNAL') {
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/40',
        iconBg: 'bg-amber-500',
        title: 'text-amber-300',
        text: 'text-amber-400',
        btnBg: 'bg-amber-500 hover:bg-amber-600',
        btnShadow: 'shadow-amber-500/15'
      };
    } else {
      return {
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/40',
        iconBg: 'bg-rose-500',
        title: 'text-rose-300',
        text: 'text-rose-400',
        btnBg: 'bg-rose-500 hover:bg-rose-600',
        btnShadow: 'shadow-rose-500/15'
      };
    }
  };

  const colors = getStatusColors();

  const isEffectivelyPaused = session.isManualPause || (session.isAutoBreakerEnabled && session.tableRequiresPause);

  return (
    <AnimatePresence>
      {/* Dealer Swap Display */}
      {session.dealerCalibrationSpins > 0 && (
        <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: 'auto' }}
           exit={{ opacity: 0, height: 0 }}
           className="bg-cyan-500/10 border-2 border-cyan-500/40 p-4 rounded-2xl flex items-center justify-center mb-4"
        >
           <p className="text-cyan-400 font-mono text-sm font-bold text-center">
             🔄 DEALER SWAP DETECTED: Flushing old momentum. Acquiring new signature... ({session.dealerCalibrationSpins} Spins Remaining)
           </p>
        </motion.div>
      )}

      {/* Circuit Breaker Display */}
      {isEffectivelyPaused && (
        <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: 'auto' }}
           exit={{ opacity: 0, height: 0 }}
           className="bg-red-500/10 border-2 border-red-500/40 p-4 rounded-2xl flex items-center justify-center mb-4"
        >
           <p className="text-red-400 font-mono text-sm font-bold text-center flex flex-col gap-1">
             <span>⚠️ CIRCUIT BREAKER ENGAGED. Bankroll Frozen.</span>
             {session.breakerReason ? (
               <span className="text-red-300 text-xs">{session.breakerReason} (Win Rate: {(session.rollingWinRate * 100).toFixed(1)}%)</span>
             ) : (
               <span className="text-red-300 text-xs">Rolling Win Rate: {(session.rollingWinRate * 100).toFixed(1)}%</span>
             )}
           </p>
        </motion.div>
      )}

      {(!isEffectivelyPaused && session.tableRequiresPause) && (
        <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: 'auto' }}
           exit={{ opacity: 0, height: 0 }}
           className="bg-amber-500/10 border-2 border-amber-500/40 p-4 rounded-2xl flex items-center justify-center mb-4"
        >
           <p className="text-amber-400 font-mono text-sm font-bold text-center flex flex-col gap-1">
             <span>⚠️ ADVISORY: HIGH VOLATILITY. Manual Pause Recommended.</span>
             {session.breakerReason ? (
               <span className="text-amber-300 text-xs">{session.breakerReason} (Win Rate: {(session.rollingWinRate * 100).toFixed(1)}%)</span>
             ) : (
               <span className="text-amber-300 text-xs">Rolling Win Rate: {(session.rollingWinRate * 100).toFixed(1)}%</span>
             )}
           </p>
        </motion.div>
      )}

      {(!session.tableRequiresPause && !session.isCalibrating && !session.dealerCalibrationSpins) && (
        <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: 'auto' }}
           exit={{ opacity: 0, height: 0 }}
           className="bg-emerald-500/10 border-2 border-emerald-500/40 p-4 rounded-2xl flex items-center justify-center mb-4"
        >
           <p className="text-emerald-400 font-mono text-sm font-bold text-center">
             🟢 TABLE NORMALIZED. ACTIVE BETTING. Rolling Win Rate: {(session.rollingWinRate * 100).toFixed(1)}%.
           </p>
        </motion.div>
      )}

      {(status === 'EXIT_SIGNAL' || status === 'SESSION_COMPLETE' || status === 'STOP_LOSS_REACHED') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`${colors.bg} border-2 ${colors.border} p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-4`}
        >
          <div className="flex items-center gap-3">
            <div className={`${colors.iconBg} text-white p-2 rounded-xl`}>
              <AlertOctagon className="h-6 w-6" />
            </div>
            <div>
              <h3 className={`font-display font-semibold ${colors.title}`}>
                {status === 'SESSION_COMPLETE' 
                  ? 'TRAILING STOP TRIGGERED' 
                  : status === 'STOP_LOSS_REACHED'
                    ? 'HARD STOP TRIGGERED'
                    : 'EXIT SIGNAL TRIGGERED'}
              </h3>
              <p className={`text-xs ${colors.text} font-mono mt-0.5 font-bold`}>
                {status === 'SESSION_COMPLETE'
                  ? 'PROFIT SECURED. EXIT TABLE.'
                  : status === 'STOP_LOSS_REACHED'
                    ? 'HARD STOP DETECTED. EXIT TABLE.'
                    : 'STOP BETTING IMMEDIATELY. AWAIT FURTHER COMMANDS.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className={`flex items-center gap-2 ${colors.btnBg} active:translate-y-0.5 text-slate-900 text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition duration-150 shadow-md ${colors.btnShadow} cursor-pointer`}
          >
            <RefreshCw className="h-4 w-4" />
            RESET & CALIBRATE
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
