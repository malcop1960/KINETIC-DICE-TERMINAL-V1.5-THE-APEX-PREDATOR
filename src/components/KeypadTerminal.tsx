/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Sliders, RotateCcw } from 'lucide-react';
import { SpinItem, StatusType } from '../types';

interface KeypadTerminalProps {
  spins: SpinItem[];
  status: StatusType;
  handleAddSpin: (num: number) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  canRedo: boolean;
  handleReset: () => void;
  layout?: 'vertical' | 'horizontal';
  isManualPause?: boolean;
  handleToggleManualPause?: () => void;
}

function getRouletteNumberColor(num: number): 'red' | 'black' | 'green' {
  if (num === 0) return 'green';
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  return redNumbers.includes(num) ? 'red' : 'black';
}

// True physical roulette table columns (left-to-right columns, containing 3,2,1 etc.)
const HORIZONTAL_ROULETTE_BOARD = [
  3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, // Top row (3rd column on table layout)
  2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, // Middle row (2nd column on table layout)
  1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34  // Bottom row (1st column on table layout)
];

const VERTICAL_ROULETTE_BOARD = Array.from({ length: 36 }, (_, i) => i + 1);

export default function KeypadTerminal({
  spins,
  status,
  handleAddSpin,
  handleUndo,
  handleRedo,
  canRedo,
  handleReset,
  layout = 'horizontal',
  isManualPause,
  handleToggleManualPause,
}: KeypadTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [naturalHeight, setNaturalHeight] = useState(layout === 'vertical' ? 660 : 164);
  const isTerminal = status === 'EXIT_SIGNAL' || status === 'SESSION_COMPLETE' || status === 'STOP_LOSS_REACHED';

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        let currentScale = 1;

        if (layout === 'vertical') {
          // Responsive target for vertical layout is about 340px width
          if (width < 340) {
            currentScale = Math.max(0.5, width / 340);
          }
        } else {
          // Responsive target for horizontal layout is about 725px width
          if (width < 725) {
            currentScale = Math.max(0.4, (width - 2) / 725);
          }
        }

        setScale(currentScale);

        if (innerRef.current) {
          // Dynamically read the unscaled height
          const scrollH = innerRef.current.scrollHeight;
          if (scrollH > 0 && Math.abs(naturalHeight - scrollH) > 2) {
            setNaturalHeight(scrollH);
          }
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [layout, null]);

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 p-6 rounded-[22px] space-y-4">
      {handleToggleManualPause && (
        <button
          onClick={handleToggleManualPause}
          className={`w-full py-3 rounded-xl font-mono font-bold text-sm tracking-wide transition-all shadow-md active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 border-2 ${
            isManualPause 
              ? 'bg-amber-500 text-slate-900 hover:bg-amber-400 border-amber-400 shadow-amber-500/20' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border-slate-700'
          }`}
        >
          {isManualPause ? '▶️ RESUME LIVE PLAY' : '⏸️ TACTICAL PAUSE'}
        </button>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-display font-semibold tracking-wide text-slate-300 uppercase flex items-center gap-1.5">
            <Sliders className="h-4 w-4 text-cyan-400" />
            Result Keypad Terminal
          </h2>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Click number to enter direct wheel outcome</p>
        </div>

        {/* Actions Block */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={spins.length === 0}
            className="text-xs px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 rounded-lg flex items-center gap-1 transition cursor-pointer font-mono font-medium select-none"
          >
            Undo Last
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="text-xs px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 rounded-lg flex items-center gap-1 transition cursor-pointer font-mono font-medium select-none"
          >
            Redo Next
          </button>
          <button
            onClick={handleReset}
            className="text-xs px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg flex items-center gap-1 transition cursor-pointer font-mono font-medium select-none"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Keypad Layout Wrapper with Dynamic Scale Support for both Layouts */}
      <div 
        ref={containerRef} 
        className="select-none w-full overflow-hidden" 
        style={{ 
          height: scale < 1 ? `${naturalHeight * scale}px` : 'auto',
          minHeight: scale < 1 ? `${naturalHeight * scale}px` : undefined
        }}
      >
        <div 
          ref={innerRef}
          className="origin-top-left transition-transform duration-75"
          style={{
            transform: `scale(${scale})`,
            width: scale < 1 ? (layout === 'vertical' ? '340px' : '725px') : '100%',
            minWidth: layout === 'vertical' ? '340px' : '725px',
          }}
        >
          {layout === 'vertical' ? (
            <div className="space-y-2.5">
              {/* Zero Key spanning full width of 3 columns */}
              <button
                onClick={() => handleAddSpin(0)}
                disabled={isTerminal}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white font-mono font-bold text-lg rounded-xl transition duration-150 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-500/20"
              >
                0 <span className="text-xs uppercase font-normal opacity-70">(Green Zero Zone)</span>
              </button>

              {/* Sequential 1-36 Numbers on a 3-column grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {VERTICAL_ROULETTE_BOARD.map((num) => {
                  const color = getRouletteNumberColor(num);
                  const keyColor =
                    color === 'red'
                      ? 'bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border-rose-500/20'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800';

                  return (
                    <button
                      key={num}
                      onClick={() => handleAddSpin(num)}
                      disabled={isTerminal}
                      className={`py-3.5 border font-mono font-bold text-center rounded-xl transition duration-100 active:translate-y-0.5 text-base flex flex-col items-center justify-center gap-0.5 cursor-pointer disabled:opacity-30 disabled:hover:scale-100 ${keyColor}`}
                    >
                      {num}
                      <span
                        className={`text-[8px] uppercase tracking-wider font-medium leading-none opacity-60 ${
                          color === 'red' ? 'text-rose-400' : 'text-slate-500'
                        }`}
                      >
                        {color === 'red' ? 'RED' : 'BLK'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex gap-1.5">
              {/* Left Zero Column (stretches full height of the 3 rows) */}
              <div className="flex shrink-0">
                <button
                  onClick={() => handleAddSpin(0)}
                  disabled={isTerminal}
                  className="w-14 sm:w-16 min-h-[140px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white font-mono font-bold text-lg rounded-xl transition duration-150 active:translate-y-0.5 cursor-pointer flex flex-col items-center justify-center gap-1 border border-emerald-500/20 w-full"
                >
                  <span className="text-xl">0</span>
                  <span className="text-[8px] tracking-widest uppercase font-bold rotate-90 origin-center whitespace-nowrap opacity-75 mt-4">
                    ZERO
                  </span>
                </button>
              </div>

              {/* 12 Columns x 3 Rows standard roulette grids */}
              <div className="flex-1 grid grid-cols-12 gap-1.5 xl:min-w-0">
                {HORIZONTAL_ROULETTE_BOARD.map((num) => {
                  const color = getRouletteNumberColor(num);
                  const keyColor =
                    color === 'red'
                      ? 'bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border-rose-500/20'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800';

                  return (
                    <button
                      key={num}
                      onClick={() => handleAddSpin(num)}
                      disabled={isTerminal}
                      className={`py-3.5 border font-mono font-bold text-center rounded-xl transition duration-100 active:translate-y-0.5 text-base flex flex-col items-center justify-center gap-0.5 cursor-pointer disabled:opacity-30 disabled:hover:scale-100 ${keyColor}`}
                    >
                      {num}
                      <span
                        className={`text-[8px] uppercase tracking-wider font-medium leading-none opacity-60 ${
                          color === 'red' ? 'text-rose-400' : 'text-slate-500'
                        }`}
                      >
                        {color === 'red' ? 'RED' : 'BLK'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent input chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 border-t border-slate-900 pt-3">
        <span className="text-[10px] text-slate-500 uppercase font-mono shrink-0">Recent Results:</span>
        {spins.length === 0 ? (
          <span className="text-xs text-slate-600 font-mono">None entered</span>
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {spins.slice(-10).reverse().map((s, idx) => {
              const cellColor =
                getRouletteNumberColor(s.hit) === 'red'
                  ? 'border-rose-500/30 text-rose-400 bg-rose-500/5'
                  : s.hit === 0
                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                  : 'border-slate-800 text-slate-300 bg-slate-900/50';

              return (
                <div
                  key={idx}
                  className={`px-2.5 py-1 text-xs font-mono font-bold border rounded-lg shrink-0 flex items-center gap-1 ${cellColor}`}
                >
                  <span>#{s.spinIndex}:</span>
                  <span className="text-white text-sm">{s.hit}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
