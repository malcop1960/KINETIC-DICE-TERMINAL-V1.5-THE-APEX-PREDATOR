/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutViewProps } from './ViewProps';
import Header from './Header';
import StatusBanners from './StatusBanners';
import TelemetryCard from './TelemetryCard';
import KineticDiceMatrixCard from './KineticDiceMatrixCard';
import LogsCard from './LogsCard';
import KeypadTerminal from './KeypadTerminal';
import DatabaseLogsTable from './DatabaseLogsTable';
import DocumentationView from './DocumentationView';
import AnalyticsDashboard from './AnalyticsDashboard';
import TableQualifier from './TableQualifier';
import ShieldControlPanel from './ShieldControlPanel';

export default function MobilePortraitView({
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
    <div className="w-full flex flex-col space-y-4 px-2 min-h-screen pb-12">
      {/* Centered Stacked Header */}
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
        <div className="flex flex-col space-y-4 w-full">
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

          {/* Quick Metrics Header Overlay */}
          <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-900/60 flex items-center justify-between font-mono text-[11px]">
            <div className="flex flex-col">
              <span className="text-slate-500 uppercase tracking-tight font-sans">Active status</span>
              <button 
                onClick={handleToggleStatus}
                className={`text-xs text-left font-bold uppercase mt-0.5 cursor-pointer hover:underline flex items-center gap-1 ${
                  session.status === 'ACTIVE' ? 'text-green-400' : session.status === 'EXIT_SIGNAL' ? 'text-amber-400' : 'text-rose-400'
                }`}
                title="Click to manually toggle STATUS"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                {session.status}
              </button>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-slate-500 uppercase tracking-tight font-sans">Bankroll Units</span>
              <span className="text-slate-200 mt-0.5 font-bold text-xs">{session.isCalibrating ? 100 : 100 + session.currentScore} U</span>
            </div>
          </div>

          <KineticDiceMatrixCard
            nextDSA={session.nextDSA}
            nextDSB={session.nextDSB}
            numSpinsEntered={session.spins.length}
            formatNumbersList={formatNumbersList}
          />

          <ShieldControlPanel 
            dynamicYieldOracleEnabled={session.dynamicYieldOracleEnabled} 
            onToggleOracle={handleToggleDynamicYield!} 
          />

          {/* Keypad Terminal is high priority for portrait thumb usage */}
          <KeypadTerminal
            spins={session.spins}
            status={session.status}
            handleAddSpin={handleAddSpin}
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            canRedo={canRedo}
            handleReset={handleReset}
            layout="vertical"
            isManualPause={session.isManualPause}
            handleToggleManualPause={handleToggleManualPause}
          />

          {/* Collapsible/Stackable diagnostic logs */}
          <LogsCard
            diagnosticExplanation={diagnosticExplanation}
            numSpinsEntered={session.spins.length}
          />

          {/* Telemetry tracker with safety sliders */}
          <TelemetryCard
            status={session.status}
            currentScore={session.currentScore}
            sessionHigh={session.sessionHigh}
            sessionLow={session.sessionLow}
            onToggleStatus={handleToggleStatus}
            onAdjustScore={handleAdjustScore}
            dynamicYieldOracleEnabled={session.dynamicYieldOracleEnabled}
            spins={session.spins}
            isCalibrating={session.isCalibrating}
            theoreticalNet={session.theoreticalNet}
          />

          {/* Simplified Data Table for vertical profile optimization */}
          <DatabaseLogsTable
            spins={session.spins}
            formatNumbersList={formatNumbersList}
          />
        </div>
      )}
    </div>
  );
}
