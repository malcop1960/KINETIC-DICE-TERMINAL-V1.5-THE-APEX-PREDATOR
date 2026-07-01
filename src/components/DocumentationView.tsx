/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Layers, Sliders, Trophy, ShieldAlert } from 'lucide-react';

export default function DocumentationView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <div className="space-y-6">
        {/* 1. Dual Matrix Architecture */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] space-y-4">
          <h2 className="text-sm font-display font-semibold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
            <Layers className="h-4 w-4" />
            1. Dual Matrix Architecture
          </h2>
          <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
            The core engine calculates target values using one of two mathematical matrices based on the kinetic relationship between Spin A and Spin B.
          </div>
          <div className="space-y-3 font-mono text-[10px] text-slate-400">
            <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <div className="text-cyan-300 font-semibold mb-1 text-xs">Legacy Matrix Hierarchy</div>
              <div className="mt-2 text-slate-400 leading-relaxed">
                1. <strong>Anchor:</strong> If 0, 10, 20, 30 involved: Base = A + B<br />
                2. <strong>Repeat:</strong> If A = B: Base = (B * 2) - 36<br />
                3. <strong>Trend:</strong> If same Dozen: Base = |A - B|<br />
                4. <strong>Core:</strong> If shared digits: Base = Remaining A + Remaining B<br />
                5. <strong>Mirror:</strong> If A &gt; 18 and B &gt; 18: Base = (A + B) - 36<br />
                6. <strong>Default:</strong> Otherwise: Base = A + B
              </div>
            </div>
            <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <div className="text-cyan-300 font-semibold mb-1 text-xs">Symmetrical Matrix Hierarchy</div>
              <div className="mt-2 text-slate-400 leading-relaxed">
                1. <strong>Anchor-Sym:</strong> If 0, 10, 20, 30: Base = (A + B) % 37<br />
                2. <strong>Harmonic:</strong> If A = B: Base = ((A * 2) + B) % 37<br />
                3. <strong>Cross-Product:</strong> If same Dozen: Base = (A * B) % 37<br />
                4. <strong>Cipher:</strong> If shared digits: Base = (Rem A + Rem B + (Shared * 10)) % 37<br />
                5. <strong>Mirror-Sym:</strong> If A &gt; 18 and B &gt; 18: Base = (A + B + 18) % 37<br />
                6. <strong>Default-Sym:</strong> Otherwise: Base = (A + B) % 37
              </div>
            </div>
          </div>
        </div>

        {/* 3. Tactical Circuit Breaker */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] space-y-4">
          <h3 className="text-sm font-display font-semibold tracking-wider text-red-400 uppercase flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            3. Tactical Circuit Breaker
          </h3>
          <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
            The system employs a triple-layer automated lock to freeze active exposure and protect the bankroll from adverse variance.
          </div>
          <div className="space-y-3 font-mono text-[11px] text-slate-400">
             <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <span className="text-red-300 font-semibold text-xs">Volatility Lock (Win Rate)</span>
              <p className="text-slate-500 font-sans mt-1 leading-relaxed text-[11px]">
                  Suspends betting if the rolling win-rate (last 9 active spins) falls below the minimum threshold. Threshold expands dynamically: &lt;25% (Base), &lt;30% (Score &ge; +4U), &lt;33% (Score &ge; +10U).
              </p>
            </div>
            <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <span className="text-red-300 font-semibold text-xs">Velocity Lock (Sequential)</span>
              <p className="text-slate-500 font-sans mt-1 leading-relaxed text-[11px]">
                  Triggers an immediate pause if 3 consecutive total misses occur.
              </p>
            </div>
            <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <span className="text-red-300 font-semibold text-xs">Entropy Lock (Spatial)</span>
              <p className="text-slate-500 font-sans mt-1 leading-relaxed text-[11px]">
                  Triggers an immediate pause upon 2 "extreme spatial misses" (where the hit is a distance of 2+ double streets away from both Target A and Target B).
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 2. Target Execution Management */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] space-y-4">
          <h3 className="text-sm font-display font-semibold tracking-wider text-indigo-400 uppercase flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            2. Target Execution Management
          </h3>
          <div className="space-y-3 font-mono text-[11px] text-slate-400">
             <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <span className="text-indigo-300 font-semibold text-xs">Hemisphere Alignment</span>
              <p className="text-slate-500 font-sans mt-1 leading-relaxed text-[11px]">
                  Evaluates if the calculated Base and Spin B share the same high/low hemisphere. If mismatched, the target shifts by +18 or -18 to align with the active hemisphere.
              </p>
            </div>
            <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <span className="text-indigo-300 font-semibold text-xs">Dealer Velocity Offset</span>
              <p className="text-slate-500 font-sans mt-1 leading-relaxed text-[11px]">
                  Tracks real-time kinetic pocket distance between hits (80% historical, 20% recent velocity). If active, the final target is shifted along the European wheel by the current velocity value to counter dealer signatures.
              </p>
            </div>
            <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <span className="text-indigo-300 font-semibold text-xs">Double Street Complement</span>
              <p className="text-slate-500 font-sans mt-1 leading-relaxed text-[11px]">
                  The final aligned physical target dictates Double Street A natively. Double Street B is mapped by the opposite dice face (7 - DS A), yielding a 33.3% win rate matrix. Zeros act as a skipped spin.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Dynamic Yield Oracle */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] space-y-4">
          <h3 className="text-sm font-display font-semibold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            4. Dynamic Yield Oracle
          </h3>
          <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
            When enabled, the Oracle applies Hyper-Scalar exit rules tailored to standard deviation volatility logic.
          </div>
          <div className="space-y-3 font-mono text-[11px] text-slate-400">
             <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <span className="text-emerald-300 font-semibold text-xs">Fatigue Ejector (Hard Stop)</span>
              <p className="text-slate-500 font-sans mt-1 leading-relaxed text-[11px]">
                  Base stop is -20U. To combat edge decay, the floor shrinks by 1U every 15 spins (max -10U).
              </p>
            </div>
             <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <span className="text-emerald-300 font-semibold text-xs">Parabolic Trailing Stop</span>
              <p className="text-slate-500 font-sans mt-1 leading-relaxed text-[11px]">
                  Pre-activation trail gap is 4U (7U if running hot). At +12U peak, true trailing activates. The system computes the Standard Deviation (Volatility) of the session and adjusts a tightening 8U base gap via a Volatility Multiplier. Minimum gap lock is 3U.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
