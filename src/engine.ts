/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SpinItem, StatusType, StrikeType, EngineState } from './types';
import { calculateDynamicYield } from './logic/dynamicYield';

export class KineticDiceEngine {
    static getDozen(num: number): number {
        if (num === 0) return 0;
        return Math.floor((num - 1) / 12) + 1;
    }

    static calculateBase(a: number, b: number) {
        const anchors = [0, 10, 20, 30];
        if (anchors.includes(a) || anchors.includes(b)) return { base: a + b, rule: "Rule 1 (Anchor)" };
        
        if (a === b && a !== 0) {
            let rep = (b * 2) - 36;
            return { base: rep <= 0 ? 36 : rep, rule: "Rule 2 (Repeat)" };
        }
        
        const dozA = this.getDozen(a); const dozB = this.getDozen(b);
        if (dozA === dozB && a > 0 && b > 0) return { base: Math.abs(a - b), rule: "Rule 3 (Trend)" };
        
        const strA = a.toString(); const strB = b.toString();
        const shared = [...new Set(strA)].filter(c => strB.includes(c));
        if (shared.length > 0) {
            let remA = strA; let remB = strB;
            shared.forEach(c => { remA = remA.split(c).join(''); remB = remB.split(c).join(''); });
            const valA = remA === '' ? 0 : parseInt(remA, 10);
            const valB = remB === '' ? 0 : parseInt(remB, 10);
            return { base: valA + valB, rule: "Rule 4 (Core)" };
        }
        
        if (a > 18 && b > 18) return { base: (a + b) - 36, rule: "Rule 5 (Mirror)" };
        return { base: a + b, rule: "Rule 6 (Default)" };
    }

    static applyAlignment(base: number, lastHit: number): number {
        let t = base;
        while (t > 36) t -= 36; while (t < 0) t = Math.abs(t);
        if (t === 0 || lastHit === 0) return t; // Zeros break alignment

        const hitHigh = lastHit >= 19; const baseHigh = t >= 19;
        if (hitHigh && !baseHigh && t > 0) t += 18;
        else if (!hitHigh && baseHigh) t -= 18;

        while (t > 36) t -= 36;
        return Math.abs(t);
    }

    static getTarget(spinA: number, spinB: number): any {
        if (spinA === 0 || spinB === 0) return { dsA: 0, dsB: 0, rule: "Zero Pause (Skip)" };

        const { base, rule } = this.calculateBase(spinA, spinB);
        const finalTarget = this.applyAlignment(base, spinB);
        if (finalTarget === 0) return { dsA: 0, dsB: 0, rule: "Zero Pause (Skip)" };

        const dsA = Math.floor((finalTarget - 1) / 6) + 1;
        const dsB = 7 - dsA; // Dice Complement

        return { dsA, dsB, rule: `${rule} -> Target: ${finalTarget}` };
    }

    static getDoubleStreetNumbers(dsIndex: number): number[] {
        if (dsIndex < 1 || dsIndex > 6) return [];
        const start = ((dsIndex - 1) * 6) + 1;
        return [start, start+1, start+2, start+3, start+4, start+5];
    }
}

export function addSpinToState(state: EngineState, hit: number): EngineState {
  if (state.status === 'EXIT_SIGNAL' || state.status === 'SESSION_COMPLETE' || state.status === 'STOP_LOSS_REACHED') {
    return state;
  }

  const spinIndex = state.spins.length + 1;
  const statusBeforeSpin = state.status;
  const isCalibrating = state.isCalibrating;

  const hitDS = hit === 0 ? 0 : Math.floor((hit - 1) / 6) + 1;

  let strikeType: StrikeType = 'Calibration';
  let scoreDelta = 0;

  // Evaluate the previous targets against the current hit
  if (state.nextDSA > 0 && state.nextDSB > 0) {
      if (hitDS === state.nextDSA || hitDS === state.nextDSB) {
          scoreDelta = 4; // +6 Payout - 2 Unit Cost
          strikeType = 'Win';
      } else {
          scoreDelta = -2; // Total Miss
          strikeType = 'Miss';
      }
  } else if (state.nextDSA === 0 && state.spins.length > 0) {
      scoreDelta = 0; // Zero Pause
      strikeType = 'Zero Pause';
  }

  const lookbackWindow = state.spins.slice(-12);
  let activeRounds = 0;
  let winRounds = 0;

  lookbackWindow.forEach(s => {
      // Only count spins where a bet was evaluated
      if (s.targetA > 0 || s.targetB > 0 || s.scoreDelta !== 0) {
          activeRounds++;
          if (s.strikeType === 'Win' || s.scoreDelta > 0) winRounds++;
      }
  });

  let newRollingWR = activeRounds >= 6 ? (winRounds / activeRounds) : 0.33;
  let newTableRequiresPause = state.tableRequiresPause;

  if (activeRounds >= 6) {
      if (newRollingWR < 0.25) newTableRequiresPause = true;  
      if (newRollingWR >= 0.33) newTableRequiresPause = false; 
  }

  const isEffectivelyPaused = state.isManualPause || (state.isAutoBreakerEnabled && newTableRequiresPause);

  let isDealerCalibrating = false;
  let nextDealerCalibrationSpins = state.dealerCalibrationSpins || 0;
  
  if (nextDealerCalibrationSpins > 0) {
      isDealerCalibrating = true;
      nextDealerCalibrationSpins -= 1;
  }

  const spinIsRealMoney = !isCalibrating && !isEffectivelyPaused && !isDealerCalibrating;

  let nextScore = state.currentScore;
  let nextTheoreticalNet = state.theoreticalNet;
  let nextSessionHigh = state.sessionHigh;
  let nextSessionLow = state.sessionLow !== undefined ? state.sessionLow : 0;

  if (isDealerCalibrating) {
      scoreDelta = 0;
      strikeType = 'Calibration';
  } else {
      if (!isEffectivelyPaused) {
          if (isCalibrating) {
              if (state.nextDSA > 0 && state.nextDSB > 0 && strikeType !== 'Zero Pause') {
                 nextTheoreticalNet += scoreDelta;
              }
          } else {
              nextScore += scoreDelta;
              nextSessionHigh = Math.max(state.sessionHigh, nextScore);
              nextSessionLow = Math.min(nextSessionLow, nextScore);
          }
      }
  }

  // Calculate targets for the *next* spin
  let newDSA = 0;
  let newDSB = 0;
  let newRule = "Calibration";

  if (isDealerCalibrating) {
      newRule = 'Dealer Swap';
  } else {
      newRule = 'Awaiting Hit';
      if (state.spins.length >= 1) { // we need at least 1 previous spin to be Spin A
          const spinB = hit;
          const spinA = state.spins[state.spins.length - 1].hit;
          const target = KineticDiceEngine.getTarget(spinA, spinB);
          newDSA = target.dsA;
          newDSB = target.dsB;
          newRule = target.rule;
      }
  }

  let nextStatus: StatusType = statusBeforeSpin;
  let exitReason: string | null = null;
  const { hardStop, trailActivation, trailGap } = calculateDynamicYield(state, state.dynamicYieldOracleEnabled);

  if (!state.isCalibrating) {
      if (nextScore <= hardStop) {
          nextStatus = 'STOP_LOSS_REACHED';
          exitReason = state.dynamicYieldOracleEnabled ? `ORACLE HARD STOP (Floor: ${hardStop}U)` : `HARD STOP (-20U)`;
      } else if (state.sessionHigh >= trailActivation && nextScore <= (state.sessionHigh - trailGap)) {
          nextStatus = 'SESSION_COMPLETE';
          exitReason = state.dynamicYieldOracleEnabled ? `ORACLE TRAIL STOP (Locked at +${state.sessionHigh}U, Gap: ${trailGap}U)` : `TRAILING STOP`;
      }
  }

  const newSpinItem: SpinItem = {
    spinIndex,
    timestamp: Date.now(),
    isRealMoney: spinIsRealMoney,
    hit,
    targetA: state.nextDSA || 0,
    targetB: state.nextDSB || 0,
    ruleUsed: state.nextRule || 'Calibration',
    strikeType,
    scoreDelta,
    accumulatedScore: spinIsRealMoney ? nextScore : nextTheoreticalNet,
    statusBeforeSpin,
    statusAfterSpin: nextStatus,
  };

  return {
    isCalibrating: state.isCalibrating,
    isManualPause: state.isManualPause,
    isAutoBreakerEnabled: state.isAutoBreakerEnabled,
    tableRequiresPause: newTableRequiresPause,
    rollingWinRate: newRollingWR,
    theoreticalNet: nextTheoreticalNet,
    spins: [...state.spins, newSpinItem],
    currentScore: nextScore,
    sessionHigh: nextSessionHigh,
    sessionLow: nextSessionLow,
    status: nextStatus,
    dealerCalibrationSpins: nextDealerCalibrationSpins,
    nextDSA: newDSA,
    nextDSB: newDSB,
    nextRule: newRule,
    dynamicYieldOracleEnabled: state.dynamicYieldOracleEnabled,
    exitReason,
  };
}

