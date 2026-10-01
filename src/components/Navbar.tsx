import React from 'react';
import {
  Recycle,
  PlusCircle,
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
  } = useRecycling();

  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b-2 border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px] sm:min-h-[80px] py-2 gap-2">
          
          {/* Logo & School Identity (Requisito 2: Texto >= 16px legible al sol) */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-0.5 shadow-lg flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Recycle className="w-6 h-6 text-emerald-400 animate-spin-slow" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  ReciclaPuntos
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <Sparkles className="w-3.5 h-3.5" />
                  Sello IA
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-300 truncate max-w-[140px] sm:max-w-xs flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="truncate">{monthlyGoal.schoolName}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics for medium+ screens */}
          <div className="hidden lg:flex items-center gap-6 bg-slate-900 rounded-2xl px-5 py-2.5 border-2 border-slate-800 text-base">
            <div className="text-right">
              <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold block">
                Total Recolectado
              </span>
              <span className="text-lg font-black text-emerald-300 font-mono">
                {totalInstituteKilos.toLocaleString('es-ES')} <span className="text-sm text-slate-300 font-normal">kg</span>
              </span>
            </div>

            <div className="h-8 w-px bg-slate-800" />

            <div className="text-right">
              <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold block">
                Puntos Escuela
              </span>
              <span className="text-lg font-black text-amber-300 font-mono">
                {totalInstitutePoints.toLocaleString('es-ES')} <span className="text-sm text-slate-300 font-normal">pts</span>
              </span>
            </div>
          </div>

          {/* Nav Actions (Requisitos 1 y 4: 1 solo botón Filled, secundarios Outlined, targets >= 48px) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Quick Versus Button (Secondary Outlined) */}
            <button
              onClick={() => {
                sounds.playTick();
                setIsVersusOpen(true);
              }}
              title="Duelo entre Secciones"
              aria-label="Abrir duelo entre secciones"
              className="min-h-[48px] px-3 py-2 text-base font-bold rounded-2xl bg-transparent hover:bg-slate-800 text-slate-200 hover:text-white border-2 border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Swords className="w-5 h-5 text-rose-400" />
              <span className="hidden md:inline">Duelo</span>
            </button>

            {/* Config Goal Button (Secondary Outlined) */}
            <button
              onClick={() => {
                sounds.playTick();
                setIsGoalModalOpen(true);
              }}
              title="Configurar Meta Mensual"
              aria-label="Configurar meta mensual"
              className="min-h-[48px] px-3 py-2 text-base font-bold rounded-2xl bg-transparent hover:bg-slate-800 text-slate-200 hover:text-white border-2 border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Target className="w-5 h-5 text-amber-400" />
              <span className="hidden md:inline">Meta</span>
            </button>

            {/* History & Logs (Secondary Outlined) */}
            <button
              onClick={() => {
                sounds.playTick();
                setIsHistoryOpen(true);
              }}
              title="Historial de Entregas y Exportación"
              aria-label="Ver historial de entregas"
              className="min-h-[48px] px-3 py-2 text-base font-bold rounded-2xl bg-transparent hover:bg-slate-800 text-slate-200 hover:text-white border-2 border-slate-700 transition-all flex items-center gap-1.5"
            >
              <History className="w-5 h-5 text-sky-400" />
              <span className="hidden md:inline">Historial</span>
            </button>

            {/* EL ÚNICO BOTÓN PRINCIPAL FILLED DE LA PANTALLA */}
            <button
              onClick={() => {
                sounds.playTick();
                setIsRegisterOpen(true);
              }}
              className="min-h-[48px] px-3.5 sm:px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
            >
              <PlusCircle className="w-5 h-5 text-slate-950" />
              <span className="whitespace-nowrap">Registrar Kilos</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
