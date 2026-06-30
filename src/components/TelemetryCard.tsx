/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StatusType, SpinItem } from '../types';
import { calculateDynamicYield } from '../logic/dynamicYield';
import { Edit2, Check, X } from 'lucide-react';

interface TelemetryCardProps {
  status: StatusType;
  currentScore: number;
  sessionHigh: number;
  sessionLow: number;
  onToggleStatus?: () => void;
  onAdjustScore?: (score: number) => void;
  dynamicYieldOracleEnabled?: boolean;
  spins?: SpinItem[];
  isCalibrating?: boolean;
  theoreticalNet?: number;
}

export default function TelemetryCard({
  status,
  currentScore,
  sessionHigh,
  sessionLow,
  onToggleStatus,
  onAdjustScore,
  dynamicYieldOracleEnabled = false,
  spins = [],
  isCalibrating = false,
  theoreticalNet = 0,
}: TelemetryCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempScore, setTempScore] = React.useState(currentScore.toString());

  // Keep state in sync with prop updates
  React.useEffect(() => {
    setTempScore(currentScore.toString());
  }, [currentScore]);

  const handleSave = () => {
    const val = parseInt(tempScore, 10);
    if (!isNaN(val) && onAdjustScore) {
      onAdjustScore(val);
    }
    setIsEditing(false);
  };

  const statusColor =
    status === 'ACTIVE'
      ? 'text-green-400 bg-green-500/10 border-green-500/20'
      : status === 'EXIT_SIGNAL'
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

  const { trailActivation, trailGap, hardStop: activeHardStop } = calculateDynamicYield({
    spins,
    sessionLow,
    currentScore,
    sessionHigh
  }, dynamicYieldOracleEnabled);

  const prevTargetRef = React.useRef(trailActivation);
  const prevHardStopRef = React.useRef(activeHardStop);
  const prevGapRef = React.useRef(trailGap);

  const [flashTarget, setFlashTarget] = React.useState(false);
  const [flashStop, setFlashStop] = React.useState(false);

  React.useEffect(() => {
    if (dynamicYieldOracleEnabled && (prevTargetRef.current !== trailActivation || prevGapRef.current !== trailGap)) {
      setFlashTarget(true);
      const timer = setTimeout(() => setFlashTarget(false), 600);
      prevTargetRef.current = trailActivation;
      prevGapRef.current = trailGap;
      return () => clearTimeout(timer);
    }
    prevTargetRef.current = trailActivation;
    prevGapRef.current = trailGap;
  }, [trailActivation, trailGap, dynamicYieldOracleEnabled]);

  React.useEffect(() => {
    if (dynamicYieldOracleEnabled && prevHardStopRef.current !== activeHardStop) {
      setFlashStop(true);
      const timer = setTimeout(() => setFlashStop(false), 600);
      prevHardStopRef.current = activeHardStop;
      return () => clearTimeout(timer);
    }
    prevHardStopRef.current = activeHardStop;
  }, [activeHardStop, dynamicYieldOracleEnabled]);

  const effectiveScore = isCalibrating ? theoreticalNet : currentScore;
  
  const isPreEjection = dynamicYieldOracleEnabled && !isCalibrating && status === 'ACTIVE' && (currentScore - activeHardStop) <= 2 && currentScore > activeHardStop;

  return (
    <div className={`bg-slate-900/60 border p-6 rounded-[22px] flex flex-col justify-between space-y-4 relative overflow-hidden transition-colors duration-500 ${isPreEjection ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'border-slate-800'}`}>
      {isPreEjection && (
        <div className="absolute inset-0 pointer-events-none bg-rose-500/10 animate-[pulse_1s_ease-in-out_infinite] z-0" />
      )}
      <div className="relative z-10 flex items-center justify-between uppercase tracking-wide">
        <span className="text-sm font-display font-bold text-slate-300 flex items-center gap-2">
          Telemetry Hub
          {isPreEjection && <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.5 rounded ml-2 animate-[pulse_1s_ease-in-out_infinite] font-mono tracking-tight shadow-[0_0_8px_rgba(225,29,72,0.8)] border border-rose-400/50">WARNING: {currentScore - activeHardStop}U TO STOP</span>}
        </span>
        <div 
          onClick={onToggleStatus}
          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${statusColor} font-bold flex items-center gap-1 cursor-pointer transition duration-150 hover:scale-105 active:scale-95`}
          title="Click to manually toggle between ACTIVE & EXIT_SIGNAL"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping" />
          {status}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-4">
        {/* Score status */}
        <div className={`bg-slate-900/40 p-4 rounded-2xl border border-slate-800 relative ${isCalibrating ? 'opacity-50 grayscale' : ''}`}>
          <span className="text-[10px] text-slate-500 font-mono uppercase">Bankroll Units</span>
          {isCalibrating && <span className="absolute top-4 right-4 text-[9px] bg-slate-800 text-slate-500 px-1 py-0.5 rounded uppercase font-bold">LOCKED</span>}
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-mono font-bold text-white">
              {isCalibrating ? 100 : 100 + currentScore}
            </span>
            <span className="text-[10px] text-slate-500 font-mono font-medium">U</span>
          </div>
        </div>

        {/* Net Score change with inline editor */}
        <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 relative group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono uppercase">{isCalibrating ? 'Theoretical Net' : 'Session Net'}</span>
            {!isEditing && onAdjustScore && !isCalibrating && (
              <button 
                onClick={() => {
                  setTempScore(currentScore.toString());
                  setIsEditing(true);
                }}
                className="text-slate-600 hover:text-indigo-400 hover:bg-slate-900 p-1 rounded transition cursor-pointer"
                title="Sync/Adjust Score with live table"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            )}
          </div>
          
          <div className="mt-1 flex items-center">
            {isEditing ? (
              <div className="flex items-center gap-1.5 w-full">
                <input
                  type="number"
                  value={tempScore}
                  onChange={(e) => setTempScore(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') setIsEditing(false);
                  }}
                  className="bg-slate-900 border border-indigo-500 text-white font-mono text-sm px-1.5 py-0.5 rounded w-16 focus:outline-none"
                  autoFocus
                />
                <button 
                  onClick={handleSave}
                  className="bg-indigo-500 text-white p-1 rounded cursor-pointer hover:bg-indigo-600"
                >
                  <Check className="h-3 w-3" />
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-800 text-slate-400 p-1 rounded cursor-pointer hover:bg-slate-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-mono font-bold ${effectiveScore >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {effectiveScore >= 0 ? `+${effectiveScore}` : effectiveScore}
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-medium">U</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bars to safeties */}
      <div className="relative z-10 space-y-2 pt-1 font-mono text-[10px]">
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span className={`transition-colors duration-300 ${flashTarget ? 'text-indigo-300' : ''}`}>
              {dynamicYieldOracleEnabled ? 'Target Profit High (Dynamic)' : 'Peak High Watermark'}
            </span>
            <span className={`font-bold transition-all duration-300 inline-block ${flashTarget ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)] scale-110' : 'text-cyan-400 scale-100'}`}>
              {sessionHigh}U / +{trailActivation}U {dynamicYieldOracleEnabled && <span className={`${flashTarget ? 'text-indigo-400' : 'text-emerald-400'} text-[8px] ml-1 uppercase transition-colors duration-300`}>Gap: {trailGap}U</span>}
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900 relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${flashTarget ? 'bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]' : 'bg-cyan-500'}`}
              style={{ width: `${Math.min(100, Math.max(0, (sessionHigh / trailActivation) * 100))}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span className={`transition-colors duration-300 ${flashStop ? 'text-rose-200' : ''}`}>
              {dynamicYieldOracleEnabled ? 'Hard Stop Risk Level (Dynamic)' : 'Lowest Session Drawdown'}
            </span>
            <span className={`font-bold transition-all duration-300 inline-block ${flashStop ? 'text-rose-300 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)] scale-110' : 'text-rose-400 scale-100'}`}>
              {sessionLow}U / {activeHardStop === 0 ? 'BREAKEVEN' : `${activeHardStop}U`}
            </span>
          </div>
          {/* Dynamic Yield specific UI update for hardstop reaching 0 */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900 relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${flashStop ? 'bg-rose-300 shadow-[0_0_12px_rgba(251,113,133,0.8)]' : (activeHardStop >= 0 ? 'bg-emerald-500' : 'bg-rose-500')}`}
              style={{ width: `${activeHardStop >= 0 ? 100 : Math.min(100, Math.max(0, (Math.abs(sessionLow) / Math.abs(activeHardStop)) * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
