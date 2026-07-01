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
  const [session, setSession] = useState<EngineState>(() => {
    try {
      const saved = localStorage.getItem('kinetic_dice_session_v1_5');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse session from localStorage', e);
    }
    return {
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
      useSymmetricalMatrix: false,
      useVelocityOffset: false,
      dealerVelocity: 0,
    };
  });

  // Track full historical snapshots for perfect Undo/Redo protocol operations
  const [pastStates, setPastStates] = useState<EngineState[]>([]);
  const [futureStates, setFutureStates] = useState<EngineState[]>([]);

  // Manual score adjustments tracker
  const [manualScoreOffset, setManualScoreOffset] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kinetic_dice_offset_v1_5');
      if (saved) return Number(saved);
    } catch (e) {
      console.error('Failed to parse offset', e);
    }
    return 0;
  });

  React.useEffect(() => {
    localStorage.setItem('kinetic_dice_session_v1_5', JSON.stringify(session));
  }, [session]);

  React.useEffect(() => {
    localStorage.setItem('kinetic_dice_offset_v1_5', String(manualScoreOffset));
  }, [manualScoreOffset]);

  const [activeTab, setActiveTab] = useState<'engine' | 'documentation' | 'analytics'>('engine');

  // Detect live viewport constraints
  const deviceMode = useDeviceMode();

  // Handle adding a new spin number
  const handleAddSpin = (num: number) => {
    if (session.status === 'EXIT_SIGNAL' || session.status === 'SESSION_COMPLETE' || session.status === 'STOP_LOSS_REACHED') return;
    setPastStates(prev => [...prev, session]);
    setSession(prev => addSpinToState(prev, num));
    setFutureStates([]); // direct selections clear forward redo state
  };

  // Undo the last action/spin (Restores exact historical EngineState snapshot)
  const handleUndo = () => {
    if (pastStates.length === 0) return;
    
    const previousState = pastStates[pastStates.length - 1];
    setPastStates(prev => prev.slice(0, -1));
    setFutureStates(prev => [...prev, session]);
    
    setSession(previousState);
  };

  // Redo the last undone action/spin
  const handleRedo = () => {
    if (futureStates.length === 0) return;
    
    const nextState = futureStates[futureStates.length - 1];
    setFutureStates(prev => prev.slice(0, -1));
    setPastStates(prev => [...prev, session]);
    
    setSession(nextState);
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
      useSymmetricalMatrix: false,
      useVelocityOffset: false,
      dealerVelocity: 0,
    });
    setManualScoreOffset(0);
    setPastStates([]);
    setFutureStates([]);
  };

  const handleEngageLivePlay = () => {
    setPastStates(prev => [...prev, session]);
    setFutureStates([]);
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
    setPastStates(prev => [...prev, session]);
    setFutureStates([]);
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

  const handleToggleMatrixMode = () => {
    setSession(prev => ({ ...prev, useSymmetricalMatrix: !prev.useSymmetricalMatrix }));
  };

  const handleToggleVelocityOffset = () => {
    setSession(prev => ({ ...prev, useVelocityOffset: !prev.useVelocityOffset }));
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
    canRedo: futureStates.length > 0,
    handleReset,
    formatNumbersList,
    diagnosticExplanation,
    handleAdjustScore,
    handleToggleStatus,
    handleToggleDynamicYield,
    handleToggleManualPause,
    handleToggleAutoBreaker,
    handleToggleMatrixMode,
    handleToggleVelocityOffset,
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
        {deviceMode === 'mobile-portrait' && <MobilePortraitView {...layoutProps} />}
        {deviceMode === 'mobile-landscape' && <MobileLandscapeView {...layoutProps} />}
        {deviceMode === 'laptop' && <LaptopView {...layoutProps} />}
        {deviceMode === 'desktop' && <DesktopView {...layoutProps} />}
        
        {/* PWA Install Prompt at Footer */}
        <div className="mt-8 mb-4">
          <PWAInstallController />
        </div>
      </div>
    </div>
  );
}
