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
export default function DesktopView({
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
  handleToggleMatrixMode,
  handleToggleVelocityOffset,
  handleDealerChange,
  handleEngageLivePlay,
  handleAbortCalibration,
}: LayoutViewProps) {
  return (
    <div className="w-full flex flex-col space-y-6 px-6 min-h-screen pb-12">
      {/* Expanded Wide Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAutoBreakerEnabled={session.isAutoBreakerEnabled}
        handleToggleAutoBreaker={handleToggleAutoBreaker}
        useSymmetricalMatrix={session.useSymmetricalMatrix}
        handleToggleMatrixMode={handleToggleMatrixMode}
        useVelocityOffset={session.useVelocityOffset}
        dealerVelocity={session.dealerVelocity}
        handleToggleVelocityOffset={handleToggleVelocityOffset}
        dynamicYieldOracleEnabled={session.dynamicYieldOracleEnabled}
        handleToggleDynamicYield={handleToggleDynamicYield}
        handleDealerChange={handleDealerChange}
        spins={session.spins}
      />

      {activeTab === 'documentation' ? (
        <DocumentationView />
      ) : activeTab === 'analytics' ? (
        <AnalyticsDashboard session={session} />
      ) : (
        <div className="flex flex-col space-y-6 w-full">
          {/* Panoramic Alerts */}
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

          {/* Expanded 3-Card Header Dashboard */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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

          <div className="w-full bg-slate-900/10 border border-slate-900/40 p-1.5 rounded-[22px]">
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

          {/* Full Width Database Logs Table with dense rows */}
          <div className="border border-slate-900/40 rounded-[22px] bg-slate-900/5 p-1">
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
