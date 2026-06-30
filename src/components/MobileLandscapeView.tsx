/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutViewProps } from './ViewProps';
import Header from './Header';
import StatusBanners from './StatusBanners';
import KineticDiceMatrixCard from './KineticDiceMatrixCard';
import LogsCard from './LogsCard';
import KeypadTerminal from './KeypadTerminal';
import DatabaseLogsTable from './DatabaseLogsTable';
import DocumentationView from './DocumentationView';
import AnalyticsDashboard from './AnalyticsDashboard';
import TableQualifier from './TableQualifier';
import ShieldControlPanel from './ShieldControlPanel';

export default function MobileLandscapeView({
  session,
  activeTab,
  setActiveTab,
  handleAddSpin,
  handleUndo,
  handleRedo,
  canRedo,
  handleReset,
  formatNumbersList,
  diagnosticExplanation,
  handleAdjustScore,
  handleToggleStatus,
  handleToggleDynamicYield,
  handleToggleManualPause,
  handleToggleAutoBreaker,
  handleDealerChange,
  handleEngageLivePlay,
  handleAbortCalibration,
}: LayoutViewProps) {
  return (
    <div className="w-full flex flex-col space-y-3 px-2 min-h-screen pb-6">
      {/* Sleek inline Header for landscape heights */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAutoBreakerEnabled={session.isAutoBreakerEnabled}
        handleToggleAutoBreaker={handleToggleAutoBreaker}
        handleDealerChange={handleDealerChange}
        spins={session.spins}
      />

      {activeTab === 'documentation' ? (
        <DocumentationView />
      ) : activeTab === 'analytics' ? (
        <AnalyticsDashboard session={session} />
      ) : (
        <div className="flex flex-col space-y-3 w-full">
          {/* Main Status Banners */}
          <StatusBanners
            status={session.status}
            exitReason={session.exitReason}
            handleReset={handleReset}
            session={session}
          />

          <TableQualifier
            session={session}
            onEngage={handleEngageLivePlay}
            onAbort={handleAbortCalibration}
          />

          {/* Double-Pane Split console */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
            
            {/* Left Console Pane - Keypad & Matrix Prediction Hub */}
            <div className="md:col-span-7 space-y-3">
              <KineticDiceMatrixCard
                nextDSA={session.nextDSA}
                nextDSB={session.nextDSB}
                numSpinsEntered={session.spins.length}
                formatNumbersList={formatNumbersList}
              />

              <KeypadTerminal
                spins={session.spins}
                status={session.status}
                handleAddSpin={handleAddSpin}
                handleUndo={handleUndo}
                handleRedo={handleRedo}
                canRedo={canRedo}
                handleReset={handleReset}
                isManualPause={session.isManualPause}
                handleToggleManualPause={handleToggleManualPause}
              />
            </div>

            {/* Right Diagnostic Console Pane - Systems State & Engine Metrics */}
            <div className="md:col-span-5 space-y-3">
              {/* Dynamic status strip */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">ENGINE STATUS:</span>
                  <span className={`font-bold ${
                    session.status === 'ACTIVE' ? 'text-emerald-400' :
                    session.status === 'EXIT_SIGNAL' ? 'text-amber-400' :
                    'text-rose-400'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">{session.isCalibrating ? 'THEORETICAL NET:' : 'CURRENT VALUE:'}</span>
                  <span className="text-white font-bold">{session.isCalibrating ? session.theoreticalNet : session.currentScore} U</span>
                </div>
              </div>

              <LogsCard
                diagnosticExplanation={diagnosticExplanation}
                numSpinsEntered={session.spins.length}
              />
              <ShieldControlPanel 
                dynamicYieldOracleEnabled={session.dynamicYieldOracleEnabled} 
                onToggleOracle={handleToggleDynamicYield!} 
              />
            </div>
          </div>

          {/* Full-width history log list at bottom */}
          <div className="w-full">
            <DatabaseLogsTable
              spins={session.spins}
              formatNumbersList={formatNumbersList}
            />
          </div>
        </div>
      )}
    </div>
  );
}
