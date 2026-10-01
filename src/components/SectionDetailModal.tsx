import React, { useMemo } from 'react';
import {
  X,
  Trophy,
  PlusCircle,
  Sparkles,
  Layers,
  History,
  Calendar,
  User,
  Quote,
} from 'lucide-react';
import { useRecycling } from '../context/RecyclingContext';
import { RECYCLING_MATERIALS } from '../constants/materials';
import { MaterialId } from '../types';
import { sounds } from '../utils/audio';

export const SectionDetailModal: React.FC = () => {
  const {
    selectedSectionForDetail,
    setSelectedSectionForDetail,
    sectionStats,
    entries,
    setIsRegisterOpen,
    setPreselectedSectionId,
    generateAiAudit,
  } = useRecycling();

  const section = selectedSectionForDetail;

  const stat = useMemo(() => {
    if (!section) return null;
    return sectionStats.find((s) => s.section.id === section.id) || null;
  }, [section, sectionStats]);

  const sectionEntries = useMemo(() => {
    if (!section) return [];
    return entries.filter((e) => e.sectionId === section.id);
  }, [section, entries]);

  if (!section || !stat) return null;

  const handleClose = () => {
    sounds.playTick();
    setSelectedSectionForDetail(null);
  };

  const handleAddKilos = () => {
    sounds.playTick();
    setPreselectedSectionId(section.id);
    setSelectedSectionForDetail(null);
    setIsRegisterOpen(true);
  };

  const handleAiAudit = () => {
    sounds.playTick();
    generateAiAudit(section);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl shadow-slate-950/80 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Mascot & Rank */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <span className="text-5xl">{section.avatar}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-amber-400 text-slate-950">
                  Puesto #{stat.rank}
                </span>
                <span className="text-xs font-semibold text-slate-400">{section.grade}</span>
              </div>
              <h3 className="text-2xl font-black text-white mt-1">{section.code} - {section.mascot}</h3>
              {section.advisor && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Tutor: {section.advisor}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs italic text-slate-300 flex items-center gap-2">
            <Quote className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>"{section.slogan}"</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-center">
              <span className="text-[11px] font-bold uppercase text-amber-200 block">Puntos Acumulados</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {stat.totalPoints.toLocaleString('es-ES')} <span className="text-xs font-normal">pts</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center">
              <span className="text-[11px] font-bold uppercase text-emerald-200 block">Total Recolectado</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {stat.totalKilos} <span className="text-xs font-normal">kg</span>
              </span>
            </div>
          </div>

          {/* Breakdown by Material */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Desglose de Kilos por Material (M2)
            </h4>

            <div className="space-y-2.5">
              {Object.entries(stat.materialKilos).map(([matId, kg]) => {
                const mat = RECYCLING_MATERIALS[matId as MaterialId];
                if (!mat) return null;
                const percentage = stat.totalKilos > 0 ? (kg / stat.totalKilos) * 100 : 0;

                return (
                  <div key={matId} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mat.color }} />
                        <span className="font-bold text-white">{mat.name}</span>
                      </div>
                      <div className="font-mono">
                        <strong className="text-emerald-400">{kg} kg</strong>
                        <span className="text-slate-400 text-[11px] ml-1.5">({stat.materialPoints[matId as MaterialId]} pts)</span>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.max(2, percentage)}%`,
                          backgroundColor: mat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Deliveries */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <History className="w-4 h-4 text-sky-400" />
              Últimas Entregas de {section.code}
            </h4>

            <div className="space-y-2">
              {sectionEntries.slice(0, 4).map((entry) => {
                const mat = RECYCLING_MATERIALS[entry.materialId];
                return (
                  <div key={entry.id} className="p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{mat?.name}</span>
                      <span className="text-[10px] text-slate-400">{entry.formattedDate}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-emerald-400 block">+{entry.kilos} kg</span>
                      <span className="text-[10px] text-amber-400">+{entry.points} pts</span>
                    </div>
                  </div>
                );
              })}

              {sectionEntries.length === 0 && (
                <p className="text-xs text-slate-500 py-3 text-center">No hay entregas registradas aún para esta sección.</p>
              )}
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-3">
          <button
            onClick={handleAiAudit}
            className="flex-1 py-2.5 px-4 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Dictamen IA de {section.code}</span>
          </button>

          <button
            onClick={handleAddKilos}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Registrar Kilos</span>
          </button>
        </div>

      </div>
    </div>
  );
};
