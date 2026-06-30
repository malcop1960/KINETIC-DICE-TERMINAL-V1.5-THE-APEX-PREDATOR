import React, { useState, useEffect } from 'react';
import { Clock, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function SessionTimer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [alertLimitMinutes, setAlertLimitMinutes] = useState<number>(60);
  const [hasAlerted, setHasAlerted] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (alertLimitMinutes > 0 && !hasAlerted) {
      if (elapsedSeconds >= alertLimitMinutes * 60) {
        toast.warning(`Session Time Alert`, {
          description: `You have reached your recommended ${alertLimitMinutes}-minute session limit. Consider taking a break to maintain peak focus.`,
          duration: Infinity,
          action: {
            label: 'Acknowledge',
            onClick: () => toast.dismiss()
          }
        });
        setHasAlerted(true);
      }
    }
  }, [elapsedSeconds, alertLimitMinutes, hasAlerted]);

  const handleConfigChange = (mins: number) => {
    setAlertLimitMinutes(mins);
    if (elapsedSeconds < mins * 60) {
      setHasAlerted(false);
    }
    setShowConfig(false);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isNearingLimit = alertLimitMinutes > 0 && elapsedSeconds >= (alertLimitMinutes * 60 * 0.9) && elapsedSeconds < (alertLimitMinutes * 60);
  const isOverLimit = alertLimitMinutes > 0 && elapsedSeconds >= (alertLimitMinutes * 60);

  return (
    <div className="relative">
      <div 
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
          isOverLimit 
            ? 'bg-red-500/10 border-red-500/30 text-red-400' 
            : isNearingLimit
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}
      >
        <Clock className={`w-3.5 h-3.5 ${isOverLimit ? 'animate-pulse' : ''}`} />
        <span className="font-mono text-xs font-medium tracking-wider min-w-[45px] text-center">
          {formatTime(elapsedSeconds)}
        </span>
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className={`ml-1 p-0.5 rounded transition-colors ${
             isOverLimit ? 'hover:bg-red-500/20' : isNearingLimit ? 'hover:bg-amber-500/20' : 'hover:bg-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title="Configure Session Limit"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {showConfig && (
        <div className="absolute top-full mt-2 right-0 bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl z-50 w-48 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-[10px] text-slate-400 font-mono uppercase mb-2">Session Limit Alert</p>
          <div className="space-y-1.5">
            {[30, 45, 60, 90, 120, 0].map((mins) => (
              <button
                key={mins}
                onClick={() => handleConfigChange(mins)}
                className={`w-full text-left px-2 py-1.5 text-xs font-mono rounded ${
                  alertLimitMinutes === mins
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {mins === 0 ? 'No Limit' : `${mins} Minutes`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
