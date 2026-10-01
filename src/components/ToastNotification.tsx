import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useRecycling } from '../context/RecyclingContext';

export const ToastNotification: React.FC = () => {
  const { notification, setNotification } = useRecycling();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <aside
      aria-label="Notificaciones del sistema"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg animate-bounce-short"
    >
      <div
        role="alert"
        aria-live="assertive"
        className={`p-4 rounded-2xl shadow-2xl border-2 flex items-center justify-between gap-3 text-base font-semibold backdrop-blur-md ${
          isSuccess
            ? 'bg-slate-900/95 border-emerald-400 text-emerald-100 shadow-emerald-950/60'
            : isError
            ? 'bg-slate-900/95 border-rose-400 text-rose-100 shadow-rose-950/60'
            : 'bg-slate-900/95 border-sky-400 text-sky-100 shadow-sky-950/60'
        }`}
      >
        <div className="flex items-center gap-3">
          {isSuccess && <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />}
          {isError && <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />}
          {!isSuccess && !isError && <Info className="w-6 h-6 text-sky-400 flex-shrink-0" />}
          <span className="leading-snug text-white font-medium">{notification.text}</span>
        </div>

        <button
          onClick={() => setNotification(null)}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Cerrar notificación"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
