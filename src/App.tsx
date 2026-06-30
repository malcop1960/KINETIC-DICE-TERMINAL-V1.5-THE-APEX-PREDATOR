/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { EngineState } from './types';
import {
  addSpinToState,
} from './engine';
import { Toaster, toast } from 'sonner';

import { useDeviceMode } from './hooks/useDeviceMode';

// Import modular independent device layout engines
import MobilePortraitView from './components/MobilePortraitView';
import MobileLandscapeView from './components/MobileLandscapeView';
import LaptopView from './components/LaptopView';
import DesktopView from './components/DesktopView';
import PWAInstallController from './components/PWAInstallController';
import { audioSystem } from './lib/audio';

export default function App() {
  // Session State
  const [session, setSession] = useState<EngineState>({
    isCalibrating: true,
    isManualPause: false,
    isAutoBreakerEnabled: true,
    tableRequiresPause: false,
    rollingWinRate: 0,
    theoreticalNet: 0,
    spins: [],
    currentScore: 0,
    sessionHigh: 0,
    sessionLow: 0,
    status: 'ACTIVE',
    dealerCalibrationSpins: 0,
    nextDSA: 0,
    nextDSB: 0,
    nextRule: 'Calibration',
    dynamicYieldOracleEnabled: false,
    exitReason: null,
    consecutiveMisses: 0,
    entropyFails: 0,
    breakerReason: null,
  });

  // Track undone spins for standard Redo protocol operations
  const [redoStack, setRedoStack] = useState<number[]>([]);

  // Manual score adjustments tracker
  const [manualScoreOffset, setManualScoreOffset] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<'engine' | 'documentation' | 'analytics'>('engine');

  // Detect live viewport constraints
  const deviceMode = useDeviceMode();

  // Handle adding a new spin number
  const handleAddSpin = (num: number) => {
    if (session.status === 'EXIT_SIGNAL' || session.status === 'SESSION_COMPLETE' || session.status === 'STOP_LOSS_REACHED') return;
    setSession(prev => addSpinToState(prev, num));
    setRedoStack([]); // direct selections clear forward redo state
  };

  // Undo the last spin
  const handleUndo = () => {
    if (session.spins.length === 0) return;
    
    const lastSpin = session.spins[session.spins.length - 1];
    setRedoStack(prev => [...prev, lastSpin.hit]);

    const newSpins = session.spins.slice(0, -1);
    
    // Recalculate states from blank state to restore correct historical scoring
    let tempState: EngineState = {
      isCalibrating: true, // We start calibrating (or whatever the first spin was)
      isManualPause: false,
      isAutoBreakerEnabled: true,
      tableRequiresPause: false,
      rollingWinRate: 0,
      theoreticalNet: 0,
      spins: [],
      currentScore: manualScoreOffset,
      sessionHigh: manualScoreOffset,
      sessionLow: manualScoreOffset,
      status: 'ACTIVE',
      dealerCalibrationSpins: 0,
      nextDSA: 0,
      nextDSB: 0,
      nextRule: 'Calibration',
      dynamicYieldOracleEnabled: session.dynamicYieldOracleEnabled,
      exitReason: null,
      consecutiveMisses: 0,
      entropyFails: 0,
      breakerReason: null,
    };

    newSpins.forEach(spin => {
      tempState.isCalibrating = !spin.isRealMoney;
      tempState = addSpinToState(tempState, spin.hit);
    });
    
    // Restore the current calibration state
    tempState.isCalibrating = session.isCalibrating;

    setSession(tempState);
  };

  // Redo the last undone spin
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextSpin = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setSession(prev => addSpinToState(prev, nextSpin));
  };

  // Reset session
  const handleReset = () => {
    setSession({
      isCalibrating: true,
      isManualPause: false,
      isAutoBreakerEnabled: true,
      tableRequiresPause: false,
      rollingWinRate: 0,
      theoreticalNet: 0,
      spins: [],
      currentScore: 0,
      sessionHigh: 0,
      sessionLow: 0,
      status: 'ACTIVE',
      dealerCalibrationSpins: 0,
      nextDSA: 0,
      nextDSB: 0,
      nextRule: 'Calibration',
      dynamicYieldOracleEnabled: false,
      exitReason: null,
      consecutiveMisses: 0,
      entropyFails: 0,
      breakerReason: null,
    });
    setManualScoreOffset(0);
    setRedoStack([]);
  };

  const handleEngageLivePlay = () => {
    setSession(prev => ({ 
      ...prev, 
      isCalibrating: false,
      currentScore: 0,
      sessionHigh: 0,
      sessionLow: 0
    }));
  };

  const handleAbortCalibration = () => {
    handleReset();
  };

  const handleDealerChange = () => {
    setSession(prev => ({
      ...prev,
      dealerCalibrationSpins: 2,
    }));
  };

  // Adjust Score/Balance manually
  const handleAdjustScore = (targetScore: number) => {
    // We compute the difference from current calculated base score (excluding current offset)
    const calculatedBase = session.currentScore - manualScoreOffset;
    const newOffset = targetScore - calculatedBase;
    
    setManualScoreOffset(newOffset);
    setSession(prev => ({
      ...prev,
      currentScore: targetScore,
      sessionHigh: Math.max(prev.sessionHigh, targetScore),
      sessionLow: Math.min(prev.sessionLow, targetScore),
    }));
  };

  // Toggle status manually
  const handleToggleStatus = () => {
    setSession(prev => {
      const nextStatus = prev.status === 'ACTIVE' ? 'EXIT_SIGNAL' : 'ACTIVE';
      return {
        ...prev,
        status: nextStatus,
      };
    });
  };

  const handleToggleDynamicYield = () => {
    setSession(prev => ({ ...prev, dynamicYieldOracleEnabled: !prev.dynamicYieldOracleEnabled }));
  };

  const handleToggleManualPause = () => {
    setSession(prev => ({ ...prev, isManualPause: !prev.isManualPause }));
  };

  const handleToggleAutoBreaker = () => {
    setSession(prev => ({ ...prev, isAutoBreakerEnabled: !prev.isAutoBreakerEnabled }));
  };

  // Volatility Alert Tracker
  const lastAlertSpinIndex = React.useRef(-1);
  React.useEffect(() => {
    const liveSpins = session.spins.filter(s => s.isRealMoney);
    if (liveSpins.length > 8) {
      const scoreDeltas = liveSpins.map(s => s.scoreDelta);
      const mean = scoreDeltas.reduce((a, b) => a + b, 0) / scoreDeltas.length;
      const variance = scoreDeltas.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scoreDeltas.length;
      const stdDev = Math.sqrt(variance);

      const lastSpin = liveSpins[liveSpins.length - 1];
      if (stdDev > 2.6 && lastAlertSpinIndex.current !== lastSpin.spinIndex) {
        toast.error('Volatility Alert: High Variance Detected', {
          description: `Session standard deviation is ${stdDev.toFixed(2)}U. Consider pausing your play.`,
          duration: 6000,
          position: 'top-center'
        });
        audioSystem.playVolatilityAlert();
        lastAlertSpinIndex.current = lastSpin.spinIndex;
      }
    }
  }, [session.spins]);

  // Format arrays as visual strings
  const formatNumbersList = (arr: number[]) => {
    if (!arr || arr.length === 0) return 'None';
    if (arr.length === 36) return 'Whole Board';
    return arr.join(', ');
  };

  // Explanation diagnostic helper
  const diagnosticExplanation = useMemo(() => {
    if (session.spins.length < 1) {
      return {
        rule: 'Calibration Mode',
        text: `Waiting for 1 spin to mathematically anchor Spin A.`
      };
    }
    
    if (session.nextDSA === 0) {
        return {
          rule: 'Zero Exception',
          text: `Previous spin was 0. Target calculation paused.`
        };
    }

    return {
      rule: session.nextRule,
      text: `Tracking Double Streets ${session.nextDSA} and ${session.nextDSB} for the kinetic hit.`
    };
  }, [session.spins, session.nextDSA, session.nextDSB, session.nextRule]);

  const layoutProps = {
    session,
    activeTab,
    setActiveTab,
    handleAddSpin,
    handleUndo,
    handleRedo,
    canRedo: redoStack.length > 0,
    handleReset,
    formatNumbersList,
    diagnosticExplanation,
    handleAdjustScore,
    handleToggleStatus,
    handleToggleDynamicYield,
    handleToggleManualPause,
    handleToggleAutoBreaker,
    handleEngageLivePlay,
    handleAbortCalibration,
    handleDealerChange,
  };

  return (
    <div className={`min-h-screen text-slate-100 font-sans p-2 selection:bg-cyan-500/30 selection:text-white transition-all duration-500 bg-slate-950`}>
      <Toaster theme="dark" richColors />
      
      {/* Floating View State Identifier badge to visually verify active profile */}
      <div className="fixed bottom-4 right-4 z-50 bg-slate-900/90 border border-slate-800 text-slate-400 font-mono text-[9px] px-3 py-1.5 rounded-full shadow-xl pointer-events-none flex items-center gap-2 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="uppercase font-bold tracking-wider">{deviceMode.replace('-', ' ')} Mode</span>
      </div>

      <div id="kinetic-dice-container" className="max-w-7xl mx-auto">
        <PWAInstallController />
        {deviceMode === 'mobile-portrait' && <MobilePortraitView {...layoutProps} />}
        {deviceMode === 'mobile-landscape' && <MobileLandscapeView {...layoutProps} />}
        {deviceMode === 'laptop' && <LaptopView {...layoutProps} />}
        {deviceMode === 'desktop' && <DesktopView {...layoutProps} />}
      </div>
    </div>
  );
}
