import React, { useMemo } from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useRecycling } from '../context/RecyclingContext';
import { sounds } from '../utils/audio';

export const MonthlyGoalCard: React.FC = () => {
  const { monthlyGoal, totalInstituteKilos, goalPercentage, setIsGoalModalOpen } = useRecycling();

  // Calculate days remaining in the month and daily pace
  const paceInfo = useMemo(() => {
    const now = new Date();
    const year = monthlyGoal.year || now.getFullYear();
    const month = monthlyGoal.monthIndex ?? now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const currentDay = now.getDate();
    const daysLeft = Math.max(1, daysInMonth - currentDay);

    const remainingKilos = Math.max(0, monthlyGoal.targetKilos - totalInstituteKilos);
    const dailyKilosNeeded = remainingKilos / daysLeft;

    return {
      daysInMonth,
      currentDay,
      daysLeft,
      remainingKilos: Number(remainingKilos.toFixed(1)),
      dailyKilosNeeded: Number(dailyKilosNeeded.toFixed(1)),
      isGoalReached: totalInstituteKilos >= monthlyGoal.targetKilos,
    };
  }, [monthlyGoal, totalInstituteKilos]);

  const milestones = [
    { percent: 25, label: 'Semilla', icon: '🌱', description: 'Primer impulso' },
    { percent: 50, label: 'Brote', icon: '🌿', description: 'Mitad del camino' },
    { percent: 75, label: 'Roble', icon: '🌳', description: 'Impacto fuerte' },
    { percent: 100, label: 'Bosque', icon: '🏆', description: 'Meta cumplida' },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-950/30">
      
      {/* Decorative ambient glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        
        {/* Title & Month Badge */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Calendar className="w-3.5 h-3.5" />
              Meta de {monthlyGoal.monthName}
            </span>
            {paceInfo.isGoalReached && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-bounce">
                🎉 ¡META MENSUAL ALCANZADA!
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Desafío Ecológico Intersecciones
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Cada kilo registrado por las secciones suma al compromiso verde de todo el instituto.
          </p>
        </div>

        {/* Right side stats pill & Edit button */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/80 text-right">
            <span className="text-[11px] text-slate-400 font-medium block">Objetivo Escolar</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              <span className="text-emerald-400">{totalInstituteKilos.toLocaleString('es-ES')}</span>
              <span className="text-slate-500 font-normal"> / {monthlyGoal.targetKilos.toLocaleString('es-ES')} kg</span>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTick();
              setIsGoalModalOpen(true);
            }}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex flex-col items-center justify-center gap-1 text-xs"
            title="Ajustar Meta Mensual"
          >
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-semibold">Editar</span>
          </button>
        </div>

      </div>

      {/* Main Progress Bar & Percentage */}
      <div className="relative z-10 pt-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Porcentaje de Avance</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400 bg-clip-text text-transparent font-mono">
                {goalPercentage}%
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {paceInfo.isGoalReached ? '¡Superando la meta!' : `Faltan ${paceInfo.remainingKilos} kg`}
              </span>
            </div>
          </div>

          {/* Daily pace badge */}
          <div className="text-right hidden sm:block">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-300">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                Ritmo necesario: <strong className="text-amber-300 font-mono">{paceInfo.dailyKilosNeeded} kg/día</strong>
              </span>
              <span className="text-slate-500">({paceInfo.daysLeft} días restantes)</span>
            </div>
          </div>
        </div>

        {/* The Track and Fill */}
        <div className="relative h-6 sm:h-7 w-full bg-slate-950 rounded-full p-1 border border-slate-800 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 transition-all duration-700 ease-out shadow-lg shadow-emerald-500/50 flex items-center justify-end pr-2"
            style={{ width: `${Math.min(100, Math.max(4, goalPercentage))}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping opacity-75" />
          </div>
        </div>

        {/* Milestone Steps Markers */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-2">
          {milestones.map((m) => {
            const isCompleted = goalPercentage >= m.percent;
            return (
              <div
                key={m.percent}
                className={`relative flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-800/40 border border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1">{m.icon}</span>
                <span className="text-xs font-bold leading-tight flex items-center gap-1">
                  {m.label} ({m.percent}%)
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:block">{m.description}</span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
