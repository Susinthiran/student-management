import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
    },
    info: {
      bg: 'bg-sky-50 border-sky-200 text-sky-800',
      icon: <Info className="w-5 h-5 text-sky-600 shrink-0" />
    }
  };

  const current = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed top-5 right-5 z-50 animate-bounce-in max-w-md shadow-lg rounded-xl border p-4 flex items-center gap-3 backdrop-blur-sm bg-opacity-95 transition-all duration-300">
      <div className={`flex items-center gap-3 w-full p-1 rounded-lg ${current.bg}`}>
        {current.icon}
        <p className="text-sm font-medium flex-1 pr-2">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-md transition-colors text-slate-500 hover:text-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
