import React, { useState, useMemo } from 'react';
import {
  X,
  Swords,
  Trophy,
  Flame,
  Scale,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useRecycling } from '../context/RecyclingContext';
import { RECYCLING_MATERIALS } from '../constants/materials';
import { MaterialId } from '../types';
import { sounds } from '../utils/audio';

export const VersusModal: React.FC = () => {
  const { isVersusOpen, setIsVersusOpen, sections, sectionStats } = useRecycling();

  const [secIdA, setSecIdA] = useState<string>(() => sections[0]?.id || '');
  const [secIdB, setSecIdB] = useState<string>(() => sections[1]?.id || '');

  const statA = useMemo(() => sectionStats.find((s) => s.section.id === secIdA), [sectionStats, secIdA]);
  const statB = useMemo(() => sectionStats.find((s) => s.section.id === secIdB), [sectionStats, secIdB]);

  if (!isVersusOpen || !statA || !statB) return null;

  const handleClose = () => {
    sounds.playTick();
    setIsVersusOpen(false);
  };

  const totalPoints = statA.totalPoints + statB.totalPoints || 1;
  const percentA = Math.round((statA.totalPoints / totalPoints) * 100);
  const percentB = 100 - percentA;

  const leader = statA.totalPoints > statB.totalPoints ? statA : statB.totalPoints > statA.totalPoints ? statB : null;
  const pointDiff = Math.abs(statA.totalPoints - statB.totalPoints);
  const kiloDiff = Number(Math.abs(statA.totalKilos - statB.totalKilos).toFixed(1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl shadow-rose-950/50 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Duelo Intersecciones (Versus)</h3>
              <p className="text-xs text-slate-400">Comparativa directa de rendimiento ecológico</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Pickers */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            
            {/* Fighter A */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-center">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                Rival Azul
              </label>
              <select
                value={secIdA}
                onChange={(e) => {
                  sounds.playTick();
                  setSecIdA(e.target.value);
                }}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-sky-500 mb-3"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id} disabled={s.id === secIdB}>
                    {s.code} - {s.mascot}
                  </option>
                ))}
              </select>

              <span className="text-4xl block mb-1">{statA.section.avatar}</span>
              <h4 className="text-lg font-black text-white">{statA.section.code}</h4>
              <p className="text-xs font-semibold text-sky-400">{statA.section.mascot}</p>
              <span className="text-xs text-slate-400 font-mono mt-1 block">
                Puesto #{statA.rank}
              </span>
            </div>

            {/* Fighter B */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-center">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                Rival Rojo
              </label>
              <select
                value={secIdB}
                onChange={(e) => {
                  sounds.playTick();
                  setSecIdB(e.target.value);
                }}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-rose-500 mb-3"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id} disabled={s.id === secIdA}>
                    {s.code} - {s.mascot}
                  </option>
                ))}
              </select>

              <span className="text-4xl block mb-1">{statB.section.avatar}</span>
              <h4 className="text-lg font-black text-white">{statB.section.code}</h4>
              <p className="text-xs font-semibold text-rose-400">{statB.section.mascot}</p>
              <span className="text-xs text-slate-400 font-mono mt-1 block">
                Puesto #{statB.rank}
              </span>
            </div>

          </div>

          {/* Tug-of-War Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold font-mono">
              <span className="text-sky-400">{statA.totalPoints.toLocaleString('es-ES')} pts ({percentA}%)</span>
              <span className="text-slate-400">Puntos Totales</span>
              <span className="text-rose-400">({percentB}%) {statB.totalPoints.toLocaleString('es-ES')} pts</span>
            </div>

            <div className="h-5 w-full bg-slate-950 rounded-full p-1 flex overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-l-full transition-all duration-500"
                style={{ width: `${percentA}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-r-full transition-all duration-500"
                style={{ width: `${percentB}%` }}
              />
            </div>
          </div>

          {/* Verdict Banner */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            {leader ? (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5 mb-1">
                  <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                  Ventaja Actual: {leader.section.code}
                </span>
                <p className="text-xs text-slate-300">
                  {leader.section.code} lidera por <strong className="text-amber-300 font-mono">{pointDiff.toLocaleString('es-ES')} puntos</strong> y <strong className="text-emerald-300 font-mono">{kiloDiff} kg</strong> de diferencia.
                </p>
              </div>
            ) : (
              <p className="text-xs font-bold text-amber-400">
                ⚖️ ¡Empate exacto en puntos!
              </p>
            )}
          </div>

          {/* Comparison by Material */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
              Comparativa de Kilos por Material
            </h4>

            <div className="space-y-2">
              {Object.keys(RECYCLING_MATERIALS).map((matKey) => {
                const matId = matKey as MaterialId;
                const mat = RECYCLING_MATERIALS[matId];
                const kgA = statA.materialKilos[matId] || 0;
                const kgB = statB.materialKilos[matId] || 0;

                return (
                  <div key={matId} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-sky-400 w-16 text-left">{kgA} kg</span>
                    <div className="flex items-center gap-1.5 text-center flex-1 justify-center">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mat.color }} />
                      <span className="text-slate-300 font-medium">{mat.name}</span>
                    </div>
                    <span className="font-mono font-bold text-rose-400 w-16 text-right">{kgB} kg</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
