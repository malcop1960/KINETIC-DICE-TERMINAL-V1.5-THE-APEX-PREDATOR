/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EngineState } from '../types';

export interface LayoutViewProps {
  session: EngineState;
  activeTab: 'engine' | 'documentation' | 'analytics';
  setActiveTab: (tab: 'engine' | 'documentation' | 'analytics') => void;
  handleAddSpin: (num: number) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  canRedo: boolean;
  handleReset: () => void;
  formatNumbersList: (arr: number[]) => string;
  diagnosticExplanation: {
    rule: string;
    text: string;
    nextPrediction?: any;
  };
  handleAdjustScore?: (score: number) => void;
  handleToggleStatus?: () => void;
  handleToggleDynamicYield?: () => void;
  handleToggleManualPause: () => void;
  handleToggleAutoBreaker: () => void;
  handleToggleMatrixMode?: () => void;
  handleToggleVelocityOffset?: () => void;
  handleDealerChange?: () => void;
  handleEngageLivePlay: () => void;
  handleAbortCalibration: () => void;
}
