import React from 'react';
import { AlertCircle, X, KeyRound, RefreshCw } from 'lucide-react';

interface ErrorNotificationProps {
  message: string;
  isApiKeyError?: boolean;
  onDismiss: () => void;
  onRetry?: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  isApiKeyError,
  onDismiss,
  onRetry,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full rounded-2xl border border-rose-500/40 bg-[#170a14]/95 p-5 shadow-2xl backdrop-blur-md text-slate-200 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Generation Error</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-rose-200/90 leading-relaxed">
        {message}
      </p>

      {isApiKeyError && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/40 text-[11px] text-rose-300 flex items-start gap-2">
          <KeyRound className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
          <div>
            <p className="font-semibold text-amber-200">Gemini API Key Required</p>
            <p className="mt-0.5 text-slate-300">
              Please make sure your Gemini API key is configured in the AI Studio <strong>Settings &gt; Secrets</strong> panel.
            </p>
          </div>
        </div>
      )}

      {onRetry && (
        <div className="flex justify-end pt-1">
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/50 hover:bg-rose-800 text-rose-100 text-xs font-medium transition-colors border border-rose-700/40"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
