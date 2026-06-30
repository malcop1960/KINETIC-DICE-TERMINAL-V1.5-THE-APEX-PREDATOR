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

export default function LaptopView({
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
    <div className="w-full flex flex-col space-y-4 px-4 min-h-screen pb-8">
      {/* Laptop Nav Line */}
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

          {/* Three Compact Column Grid cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <KineticDiceMatrixCard
              nextDSA={session.nextDSA}
              nextDSB={session.nextDSB}
              numSpinsEntered={session.spins.length}
              formatNumbersList={formatNumbersList}
            />

            <LogsCard
              diagnosticExplanation={diagnosticExplanation}
              numSpinsEntered={session.spins.length}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 bg-slate-900/10 border border-slate-900/40 p-1.5 rounded-[22px]">
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
            <div className="lg:col-span-4 flex flex-col gap-4">
              <ShieldControlPanel 
                dynamicYieldOracleEnabled={session.dynamicYieldOracleEnabled} 
                onToggleOracle={handleToggleDynamicYield!} 
              />
            </div>
          </div>

          <DatabaseLogsTable
            spins={session.spins}
            formatNumbersList={formatNumbersList}
          />
        </div>
      )}
    </div>
  );
}
