/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Smartphone, Sparkles, X, Share2, HelpCircle, Monitor } from 'lucide-react';

export default function PWAInstallController() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if already installed / running standalone
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      // For iOS Safari legacy detection
      const isIOSStandalone = (navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode || isIOSStandalone);
    };

    checkStandalone();
    
    // Listen to changes in display mode
    const matcher = window.matchMedia('(display-mode: standalone)');
    const onChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    try {
      matcher.addEventListener('change', onChange);
    } catch (e) {
      matcher.addListener(onChange);
    }

    // 2. Detect iOS user agents to guide Apple device manual installs if prompt isn't supported
    const checkIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isApple);
    };
    checkIOS();

    // 3. Listen for Chromium/Android/PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true); // Ensure visible if prompt becomes available
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      try {
        matcher.removeEventListener('change', onChange);
      } catch (e) {
        matcher.removeListener(onChange);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA Installer] User choice outcome: ${outcome}`);
    
    // Clear the prompt after triggered
    setDeferredPrompt(null);
  };

  const toggleIOSInstructions = () => {
    setShowIOSInstructions(prev => !prev);
  };

  // If already running in standalone app view, display an elegant static badge or quietly exit
  if (isStandalone) {
    return (
      <div id="pwa-badge-standalone" className="bg-slate-900/60 border border-emerald-500/10 px-4 py-2.5 rounded-xl mb-4 flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-400 inline" /> PWA Native Active
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          Engine synchronized in standalone offline-ready container sandbox.
        </span>
      </div>
    );
  }

  // Determine if we should render any interactive installer widget
  // We can show it if: 
  // - Visibility is true AND 
  // - EITHER deferredPrompt exists (Chromium/desktop/Android PWA possible)
  // - OR it is iOS (manual Apple Safari share sheet PWA instruction is useful)
  const shouldRender = isVisible && (deferredPrompt || isIOS);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        id="pwa-installer-banner"
        className="bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-slate-800 p-4 rounded-xl mb-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
      >
        {/* Aesthetic background mesh glow to make it look highly styled */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="flex items-start gap-3.5 relative z-10">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl text-indigo-400 shrink-0 shadow-inner flex items-center justify-center">
            {isIOS ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-xs tracking-wide text-slate-200">
                INSTALL KINETIC-DICE TERMINAL V1.0 APEX
              </h4>
              <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full">
                PWA Core
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5 max-w-2xl leading-relaxed">
              Unlock a distraction-free fullscreen viewport layout, instant launch speeds, and safe offline execution protocols right from your home screen or desktop.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 shrink-0 self-end sm:self-center">
          {/* Action trigger button */}
          {deferredPrompt ? (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 active:translate-y-0.5 text-white text-xs font-mono font-bold px-4 py-2 rounded-lg transition duration-150 cursor-pointer shadow-md shadow-indigo-500/20"
            >
              <Download className="h-3.5 w-3.5" />
              INSTALL NOW
            </button>
          ) : isIOS ? (
            <button
              onClick={toggleIOSInstructions}
              className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 active:translate-y-0.5 text-white text-xs font-mono font-bold px-4 py-2 rounded-lg transition duration-150 cursor-pointer shadow-md shadow-indigo-500/20"
            >
              <Smartphone className="h-3.5 w-3.5" />
              {showIOSInstructions ? 'HIDE STEPS' : 'HOW TO INSTALL'}
            </button>
          ) : null}

          {/* Dismiss option */}
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-slate-500 hover:text-slate-300 transition-colors border border-slate-800 bg-slate-950/40 rounded-lg cursor-pointer hover:bg-slate-950"
            aria-label="Dismiss Installer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Extended iOS step-by-step guidance block */}
        {isIOS && showIOSInstructions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full border-t border-slate-800/60 pt-3 mt-3 ml-0 flex flex-col gap-2 font-sans text-xs text-slate-400 leading-relaxed"
          >
            <div className="flex items-center gap-1.5 font-bold text-slate-300 font-mono text-[10px] tracking-wide uppercase">
              <Share2 className="h-3.5 w-3.5 text-indigo-400" /> IOS INSTALLATION PROTOCOL:
            </div>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-slate-400">
              <li>Launch this workspace webpage in your native Apple <span className="text-slate-200 font-semibold font-mono">Safari Browser</span>.</li>
              <li>Tap the <span className="text-indigo-400 underline font-semibold font-mono">Share</span> button inside Safari's main interface.</li>
              <li>Scroll down the action sheet and select <span className="text-slate-205 text-slate-250 font-bold bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-mono">Add to Home Screen</span>.</li>
              <li>Tap "Add" in the top corner to initialize and load customized offline-ready shortcuts!</li>
            </ol>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
