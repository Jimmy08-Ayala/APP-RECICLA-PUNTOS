import React, { useMemo } from 'react';
import {
  Target,
  CheckCircle2,
  Calendar,
  Flame,
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
    { percent: 25, label: 'Semilla', icon: '🌱', description: '25% cumplido' },
    { percent: 50, label: 'Brote', icon: '🌿', description: 'Mitad del camino' },
    { percent: 75, label: 'Roble', icon: '🌳', description: 'Gran impacto' },
    { percent: 100, label: 'Bosque', icon: '🏆', description: 'Meta escolar' },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 border-2 border-slate-800 p-5 sm:p-8 shadow-2xl">
      
      {/* Decorative ambient glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b-2 border-slate-800">
        
        {/* Title & Month Badge */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-base font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Calendar className="w-5 h-5" />
              Meta de {monthlyGoal.monthName}
            </span>
            {paceInfo.isGoalReached && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-base font-black bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-bounce">
                🎉 ¡META MENSUAL CUMPLIDA!
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Desafío Ecológico Intersecciones
          </h2>
          <p className="text-base text-slate-300 mt-1 max-w-xl">
            Cada kilo registrado por las secciones suma al compromiso verde de todo el instituto.
          </p>
        </div>

        {/* Right side stats pill & Edit Outlined button */}
        <div className="flex items-center gap-3 self-start lg:self-center">
          <div className="bg-slate-950 rounded-2xl p-4 border-2 border-slate-800 text-right">
            <span className="text-sm text-slate-300 font-semibold block">Objetivo Escolar</span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              <span className="text-emerald-400">{totalInstituteKilos.toLocaleString('es-ES')}</span>
              <span className="text-slate-400 font-normal text-lg"> / {monthlyGoal.targetKilos.toLocaleString('es-ES')} kg</span>
            </div>
          </div>

          {/* Secondary Outlined button */}
          <button
            onClick={() => {
              sounds.playTick();
              setIsGoalModalOpen(true);
            }}
            className="min-h-[56px] px-4 py-3 rounded-2xl bg-transparent hover:bg-slate-800 text-slate-200 hover:text-white border-2 border-slate-700 transition-all flex flex-col items-center justify-center gap-1 text-base font-bold"
            title="Ajustar Meta Mensual"
            aria-label="Ajustar meta mensual"
          >
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="text-sm">Editar</span>
          </button>
        </div>

      </div>

      {/* Main Progress Bar & Percentage */}
      <div className="relative z-10 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3">
          <div>
            <span className="text-sm uppercase tracking-wider font-bold text-slate-400">Porcentaje de Avance</span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono">
                {goalPercentage}%
              </span>
              <span className="text-base font-semibold text-slate-200">
                {paceInfo.isGoalReached ? '¡Superando la meta del mes!' : `Faltan ${paceInfo.remainingKilos} kg para el objetivo`}
              </span>
            </div>
          </div>

          {/* Daily pace badge */}
          <div className="text-left sm:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 border-2 border-slate-800 text-base font-medium text-slate-200">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse flex-shrink-0" />
              <span>
                Ritmo necesario: <strong className="text-amber-300 font-mono font-bold">{paceInfo.dailyKilosNeeded} kg/día</strong>
              </span>
              <span className="text-slate-400 text-sm">({paceInfo.daysLeft} días restantes)</span>
            </div>
          </div>
        </div>

        {/* The Track and Fill */}
        <div className="relative h-7 sm:h-8 w-full bg-slate-950 rounded-full p-1 border-2 border-slate-800 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 transition-all duration-700 ease-out flex items-center justify-end pr-2"
            style={{ width: `${Math.min(100, Math.max(3, goalPercentage))}%` }}
          >
            <div className="w-3 h-3 rounded-full bg-white animate-ping opacity-80" />
          </div>
        </div>

        {/* Milestone Steps Markers (Requisito 2: Texto >= 16px legible) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {milestones.map((m) => {
            const isCompleted = goalPercentage >= m.percent;
            return (
              <div
                key={m.percent}
                className={`relative flex flex-col items-center text-center p-3 rounded-2xl border-2 transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-3xl mb-1">{m.icon}</span>
                <span className="text-base font-extrabold text-white leading-tight flex items-center gap-1.5">
                  {m.label} ({m.percent}%)
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />}
                </span>
                <span className="text-sm text-slate-300 mt-0.5">{m.description}</span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
