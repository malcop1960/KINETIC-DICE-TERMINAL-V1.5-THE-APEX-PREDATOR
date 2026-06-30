import { EngineState } from '../types';

export function calculateDynamicYield(state: any, isOracleOn: boolean) {
    // 1. STANDARD DEFAULTS (Used if Oracle is OFF)
    let hardStop = -20;
    let trailActivation = 25;
    let trailGap = 5;

    if (isOracleOn) {
        const spinCount = state.spins.length;
        const peak = state.sessionHigh || 0;

        // 2. FATIGUE EJECTOR (Time Decay)
        // Kinetic-Dice is a slow grind. Shrink the hard stop by 1 unit every 15 spins.
        const fatigue = Math.floor(spinCount / 15);
        hardStop = Math.max(-10, -20 + fatigue);

        // 3. PARABOLIC TRAILING STOP (Variance-Adjusted)
        trailActivation = 12; // Activate trailing protection when +12U is reached

        if (peak >= trailActivation) {
            // Lock Breakeven
            hardStop = Math.max(hardStop, 0);

            // Calculate Session Standard Deviation (Volatility)
            const liveSpins = state.spins.filter((s: any) => s.isRealMoney);
            let stdDev = 2.4; // Base variance assumption
            
            if (liveSpins.length > 5) {
                const scoreDeltas = liveSpins.map((s: any) => s.scoreDelta);
                const mean = scoreDeltas.reduce((a: number, b: number) => a + b, 0) / scoreDeltas.length;
                const variance = scoreDeltas.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / scoreDeltas.length;
                stdDev = Math.sqrt(variance) || 2.4;
            }

            // The Parabolic Curve: Gap naturally tightens as peak increases
            // Base gap is wide (8U) at the start of a run. For every 10U of profit, shrink by 1.5U.
            const peakProgress = Math.max(0, peak - trailActivation);
            const parabolicBaseGap = 8 - (peakProgress * 0.15); 
            
            // Variance Multiplier: Expand gap if table is highly volatile, shrink if stable.
            const volatilityMultiplier = stdDev / 2.4; 
            
            let fluidGap = parabolicBaseGap * volatilityMultiplier;
            
            // Constrain the gap between 3 and 10
            trailGap = Math.max(3, Math.min(10, Math.round(fluidGap)));
        } else {
            // If not activated yet, use standard matrix efficiency to set pre-trail gap
            const lookback = Math.min(10, spinCount);
            let rollingNet = 0;
            if (lookback > 0) {
                const recent = state.spins.slice(-lookback);
                recent.forEach((s: any) => rollingNet += s.scoreChange || s.scoreDelta || 0);
            }
            trailGap = rollingNet >= 8 ? 7 : 4;
        }
    }

    return { hardStop, trailActivation, trailGap };
}
