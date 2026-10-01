import React from 'react';
import {
  Recycle,
  PlusCircle,
  Trophy,
  History,
  Target,
  Swords,
  Sparkles,
} from 'lucide-react';
import { useRecycling } from '../context/RecyclingContext';
import { sounds } from '../utils/audio';

export const Navbar: React.FC = () => {
  const {
    monthlyGoal,
    totalInstituteKilos,
    totalInstitutePoints,
    sections,
    setIsRegisterOpen,
    setIsHistoryOpen,
    setIsGoalModalOpen,
    setIsVersusOpen,
    generateAiAudit,
  } = useRecycling();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-emerald-500/20 text-white shadow-xl shadow-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & School Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-lime-400 p-0.5 shadow-lg shadow-emerald-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Recycle className="w-6 h-6 text-emerald-400 animate-spin-slow" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400 bg-clip-text text-transparent">
                  ReciclaPuntos
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3" />
                  M5 Sello IA
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {monthlyGoal.schoolName}
              </p>
            </div>
          </div>

          {/* Quick Metrics (Hidden on tiny screens) */}
          <div className="hidden md:flex items-center gap-6 bg-slate-800/60 rounded-xl px-4 py-2 border border-slate-700/60">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Total Recolectado
              </span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                {totalInstituteKilos.toLocaleString('es-ES')} <span className="text-xs text-slate-300 font-normal">kg</span>
              </span>
            </div>

            <div className="h-8 w-px bg-slate-700" />

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Puntos Escuela
              </span>
              <span className="text-base font-extrabold text-amber-400 font-mono">
                {totalInstitutePoints.toLocaleString('es-ES')} <span className="text-xs text-slate-300 font-normal">pts</span>
              </span>
            </div>

            <div className="h-8 w-px bg-slate-700" />

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Secciones
              </span>
              <span className="text-base font-extrabold text-sky-400 font-mono">
                {sections.length} <span className="text-xs text-slate-300 font-normal">grupos</span>
              </span>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Versus Battle Button */}
            <button
              onClick={() => {
                sounds.playTick();
                setIsVersusOpen(true);
              }}
              title="Duelo entre Secciones"
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Swords className="w-4 h-4 text-rose-400" />
              <span className="hidden lg:inline">Versus</span>
            </button>

            {/* Config Goal Button */}
            <button
              onClick={() => {
                sounds.playTick();
                setIsGoalModalOpen(true);
              }}
              title="Configurar Meta Mensual"
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">Meta</span>
            </button>

            {/* History & Logs */}
            <button
              onClick={() => {
                sounds.playTick();
                setIsHistoryOpen(true);
              }}
              title="Historial de Entregas y Exportación"
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <History className="w-4 h-4 text-sky-400" />
              <span className="hidden lg:inline">Historial</span>
            </button>

            {/* PRIMARY CTA: REGISTRAR KILOS */}
            <button
              onClick={() => {
                sounds.playTick();
                setIsRegisterOpen(true);
              }}
              className="relative group overflow-hidden px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 fill-emerald-200" />
              <span>Registrar Kilos</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
