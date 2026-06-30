import { EngineState } from '../types';

export function calculateDynamicYield(state: any, isOracleOn: boolean) {
    // 1. STANDARD DEFAULTS (Used if Oracle is OFF)
    let hardStop = -20;
    let trailActivation = 25;
    let trailGap = 5;

    if (isOracleOn) {
        const spinCount = state.spins.length;
        const peak = state.sessionHigh || 0;

        // 2. MATRIX EFFICIENCY (Rolling Momentum over last 10 spins)
        const lookback = Math.min(10, spinCount);
        let rollingNet = 0;
        if (lookback > 0) {
            const recent = state.spins.slice(-lookback);
            recent.forEach((s: any) => rollingNet += s.scoreChange || s.scoreDelta || 0); // Using scoreDelta based on previous observation
        }

        // 3. FATIGUE EJECTOR (Time Decay)
        // Kinetic-Dice is a slow grind. Shrink the hard stop by 1 unit every 15 spins to prevent endless zombie sessions.
        const fatigue = Math.floor(spinCount / 15);
        hardStop = Math.max(-10, -20 + fatigue);

        // 4. THE RATCHET (Profit Floors)
        // Because target units are small, we lock profit tiers earlier.
        if (peak >= 12) hardStop = Math.max(hardStop, 0);   // Breakeven Lock
        if (peak >= 24) hardStop = Math.max(hardStop, 12);  // Tier 1 Lock
        if (peak >= 40) hardStop = Math.max(hardStop, 25);  // Tier 2 Lock

        // 5. ELASTIC TRAIL (Dynamic Ceilings)
        trailActivation = 12; // Turn on protection much earlier

        if (rollingNet >= 8) {
            trailGap = 7; // Momentum is trending: Widen gap to let trend run
        } else if (rollingNet < 0) {
            trailGap = 3; // Momentum is Drying Up: Snap the trap shut immediately
        } else {
            trailGap = 4; // Cruising Speed
        }
    }

    return { hardStop, trailActivation, trailGap };
}
