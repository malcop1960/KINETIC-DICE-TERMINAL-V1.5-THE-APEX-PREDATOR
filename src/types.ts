/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StatusType = 'ACTIVE' | 'EXIT_SIGNAL' | 'SESSION_COMPLETE' | 'STOP_LOSS_REACHED';
export type StrikeType = 'Win' | 'Miss' | 'Calibration' | 'Zero Pause';

export interface SpinItem {
  spinIndex: number;
  timestamp: number;
  isRealMoney: boolean;
  hit: number;
  targetA: number;
  targetB: number;
  ruleUsed: string;
  strikeType: StrikeType;
  scoreDelta: number;
  accumulatedScore: number;
  statusBeforeSpin: StatusType;
  statusAfterSpin: StatusType;
}

export interface EngineState {
  isCalibrating: boolean;
  isManualPause: boolean;
  isAutoBreakerEnabled: boolean;
  tableRequiresPause: boolean;
  rollingWinRate: number;
  theoreticalNet: number;
  spins: SpinItem[];
  currentScore: number;
  sessionHigh: number;
  sessionLow: number;
  status: StatusType;
  dealerCalibrationSpins: number;
  nextDSA: number;
  nextDSB: number;
  nextRule: string;
  dynamicYieldOracleEnabled: boolean;
  exitReason: string | null;
  consecutiveMisses: number;
  entropyFails: number;
  breakerReason: string | null;
  useSymmetricalMatrix: boolean;
  useVelocityOffset: boolean;
  dealerVelocity: number;
}
