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
      {/* 1. Kinetic-Dice Engine */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] space-y-4">
        <h2 className="text-sm font-display font-semibold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
          <Layers className="h-4 w-4" />
          1. Kinetic-Dice Engine
        </h2>
        <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
          The engine calculates target double streets using a 6-rule mathematical hierarchy and hemisphere alignment of the kinetic momentum (Spin A & Spin B).
        </div>
        <div className="space-y-3 font-mono text-xs text-slate-400">
          <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <div className="text-cyan-300 font-semibold mb-1">6-Rule Kinetic Math Hierarchy</div>
            <div className="mt-2 text-slate-400 leading-normal">
              1. <strong>Anchor:</strong> If Zero/10/20/30 involved, Base = A + B.<br />
              2. <strong>Repeat:</strong> If A = B, Base = (B * 2) - 36.<br />
              3. <strong>Trend:</strong> If same Dozen, Base = |A - B|.<br />
              4. <strong>Core:</strong> If shared digits, Base = Remaining A + Remaining B.<br />
              5. <strong>Mirror:</strong> If A &gt; 18 and B &gt; 18, Base = (A + B) - 36.<br />
              6. <strong>Default:</strong> Otherwise, Base = A + B.
            </div>
          </div>

          <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <div className="text-cyan-300 font-semibold mb-1">Hemisphere Alignment &amp; Betting</div>
            <div className="mt-2 text-slate-400 leading-normal">
              <strong>Alignment (+18/-18 shift):</strong> Evaluates if the raw Base and Spin B share the same high/low hemisphere. If mismatched, it shifts by 18 to align with the active hemisphere.<br /><br />
              <strong>Dice Complement:</strong> The final Target dictates Double Street A natively. Double Street B is mapped by the opposite dice face (7 - DS A).
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
              <span className="text-indigo-300 font-semibold text-xs">Kinetic Hit Target Pattern</span>
              <p className="text-slate-500 font-sans mt-1 leading-relaxed text-[11px]">
                  Each spin evaluates against the target values stored from the previous spin calculations. Max fixed 2 unit flat bet.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Tactical Circuit Breaker */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] space-y-4">
          <h3 className="text-sm font-display font-semibold tracking-wider text-red-400 uppercase flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            3. Tactical Circuit Breaker
          </h3>
          <div className="space-y-3 font-mono text-[11px] text-slate-400">
             <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <span className="text-red-300 font-semibold text-xs">Volatility Protection</span>
              <p className="text-slate-500 font-sans mt-1 leading-relaxed text-[11px]">
                  Automatically suspends active betting (switching to simulated paper-bets) if the rolling win-rate of the last 6+ evaluated spins falls below 25%, freezing bankroll exposure.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Dynamic Payout */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] space-y-4">
          <h3 className="text-sm font-display font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2">
            <Trophy className="h-4 w-4 text-emerald-400" />
            4. Protocol Payout Architecture
          </h3>
          <p className="text-slate-500 text-[11px] font-sans leading-relaxed">
             Active exposures deduct 2 units per spin. Strikes are graded dynamically.
          </p>
          <table className="w-full font-mono text-[11px] text-slate-400 mt-2">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="py-2 text-left">NARRATIVE</th>
                <th className="py-2 text-center">PAYOUT</th>
                <th className="py-2 text-right">NET RETURN</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800/80">
                <td className="py-2 font-semibold text-emerald-400">Win (Target Hit)</td>
                <td className="py-2 text-center">5 to 1 (+6 U)</td>
                <td className="py-2 text-right font-bold text-emerald-400">+4 U</td>
              </tr>
              <tr>
                <td className="py-2 text-rose-500 font-semibold">Miss</td>
                <td className="py-2 text-center">-</td>
                <td className="py-2 text-right font-bold text-rose-450">- 2 U</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
