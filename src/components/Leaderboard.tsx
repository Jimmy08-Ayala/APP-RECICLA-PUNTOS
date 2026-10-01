import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  PlusCircle,
  Eye,
  Sparkles,
  Layers,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useRecycling } from '../context/RecyclingContext';
import { SectionStats, MaterialId } from '../types';
import { RECYCLING_MATERIALS } from '../constants/materials';
import { sounds } from '../utils/audio';

export const Leaderboard: React.FC = () => {
  const {
    sectionStats,
    setIsRegisterOpen,
    setPreselectedSectionId,
    setSelectedSectionForDetail,
    generateAiAudit,
  } = useRecycling();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'points' | 'kilos'>('points');

  // Available unique grades
  const grades = useMemo(() => {
    const set = new Set<string>();
    sectionStats.forEach((s) => set.add(s.section.grade));
    return ['all', ...Array.from(set)];
  }, [sectionStats]);

  // Filtered and sorted sections
  const filteredList = useMemo(() => {
    let list = [...sectionStats];

    // Filter by grade
    if (selectedGrade !== 'all') {
      list = list.filter((s) => s.section.grade === selectedGrade);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.section.name.toLowerCase().includes(q) ||
          s.section.code.toLowerCase().includes(q) ||
          s.section.mascot.toLowerCase().includes(q) ||
          (s.section.advisor && s.section.advisor.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'kilos') {
      list.sort((a, b) => b.totalKilos - a.totalKilos);
    } else {
      list.sort((a, b) => b.totalPoints - a.totalPoints);
    }

    return list;
  }, [sectionStats, selectedGrade, searchQuery, sortBy]);

  // Top 3 Podium sections (from overall ranking)
  const top1 = sectionStats[0];
  const top2 = sectionStats[1];
  const top3 = sectionStats[2];

  const handleOpenRegisterForSection = (sectionId: string) => {
    sounds.playTick();
    setPreselectedSectionId(sectionId);
    setIsRegisterOpen(true);
  };

  const handleOpenDetail = (stat: SectionStats) => {
    sounds.playTick();
    setSelectedSectionForDetail(stat.section);
  };

  const handleAiAuditForSection = (stat: SectionStats) => {
    sounds.playTick();
    generateAiAudit(stat.section);
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION HEADER & PODIUM */}
      <div className="text-center max-w-2xl mx-auto pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
          <Trophy className="w-3.5 h-3.5" />
          Competencia Intersecciones en Vivo
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Tabla de Posiciones
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Las secciones acumulan puntos según los kilos y el valor ecológico de cada material reciclado.
        </p>
      </div>

      {/* TOP 3 PODIUM DISPLAY */}
      {top1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-6 max-w-5xl mx-auto items-end">
          
          {/* 2nd Place (Silver) */}
          {top2 && (
            <div className="order-2 md:order-1 relative rounded-3xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 p-6 flex flex-col items-center text-center shadow-xl hover:border-slate-500 transition-all">
              <div className="absolute -top-5 w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-400 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-slate-500/20 border-2 border-slate-900 text-base">
                2º
              </div>
              <span className="text-4xl mt-2 mb-2">{top2.section.avatar}</span>
              <h4 className="text-lg font-black text-white">{top2.section.code}</h4>
              <p className="text-xs font-semibold text-slate-400">{top2.section.mascot}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-700/60 w-full grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-800/80 rounded-xl p-2">
                  <span className="text-[10px] text-slate-400 block font-medium">Puntos</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    {top2.totalPoints.toLocaleString('es-ES')}
                  </span>
                </div>
                <div className="bg-slate-800/80 rounded-xl p-2">
                  <span className="text-[10px] text-slate-400 block font-medium">Kilos</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">
                    {top2.totalKilos} kg
                  </span>
                </div>
              </div>

              <div className="w-full mt-4 flex items-center gap-2">
                <button
                  onClick={() => handleOpenRegisterForSection(top2.section.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  + Kilos
                </button>
                <button
                  onClick={() => handleOpenDetail(top2)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                  title="Ver estadísticas"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 1st Place (Gold Champion) */}
          <div className="order-1 md:order-2 relative rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/50 p-7 flex flex-col items-center text-center shadow-2xl shadow-amber-500/10 md:-translate-y-4 transition-all">
            <div className="absolute -top-7 flex items-center justify-center">
              <div className="relative">
                <Crown className="w-8 h-8 text-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-black flex items-center justify-center shadow-xl shadow-amber-500/40 border-2 border-slate-900 text-xl font-mono">
                  1º
                </div>
              </div>
            </div>

            <span className="text-5xl mt-3 mb-2">{top1.section.avatar}</span>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1">
              🏆 LÍDER ACTUAL
            </div>
            <h3 className="text-2xl font-black text-white">{top1.section.code}</h3>
            <p className="text-sm font-bold text-amber-300">{top1.section.mascot}</p>
            <p className="text-xs text-slate-400 italic mt-0.5">"{top1.section.slogan}"</p>

            <div className="mt-5 pt-4 border-t border-slate-700/60 w-full grid grid-cols-2 gap-3 text-center">
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-2.5">
                <span className="text-[11px] text-amber-200/80 block font-medium">Puntos Totales</span>
                <span className="text-xl font-black text-amber-300 font-mono">
                  {top1.totalPoints.toLocaleString('es-ES')}
                </span>
              </div>
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-2.5">
                <span className="text-[11px] text-emerald-200/80 block font-medium">Kilos Reciclados</span>
                <span className="text-xl font-black text-emerald-300 font-mono">
                  {top1.totalKilos} kg
                </span>
              </div>
            </div>

            <div className="w-full mt-5 flex items-center gap-2">
              <button
                onClick={() => handleOpenRegisterForSection(top1.section.id)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Sumar Kilos
              </button>
              <button
                onClick={() => handleOpenDetail(top1)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                title="Ver estadísticas"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleAiAuditForSection(top1)}
                className="p-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 transition-all"
                title="Dictamen IA"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          {top3 && (
            <div className="order-3 relative rounded-3xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 p-6 flex flex-col items-center text-center shadow-xl hover:border-slate-500 transition-all">
              <div className="absolute -top-5 w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-800 text-white font-black flex items-center justify-center shadow-lg shadow-amber-800/20 border-2 border-slate-900 text-base">
                3º
              </div>
              <span className="text-4xl mt-2 mb-2">{top3.section.avatar}</span>
              <h4 className="text-lg font-black text-white">{top3.section.code}</h4>
              <p className="text-xs font-semibold text-slate-400">{top3.section.mascot}</p>

              <div className="mt-4 pt-4 border-t border-slate-700/60 w-full grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-800/80 rounded-xl p-2">
                  <span className="text-[10px] text-slate-400 block font-medium">Puntos</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    {top3.totalPoints.toLocaleString('es-ES')}
                  </span>
                </div>
                <div className="bg-slate-800/80 rounded-xl p-2">
                  <span className="text-[10px] text-slate-400 block font-medium">Kilos</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">
                    {top3.totalKilos} kg
                  </span>
                </div>
              </div>

              <div className="w-full mt-4 flex items-center gap-2">
                <button
                  onClick={() => handleOpenRegisterForSection(top3.section.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  + Kilos
                </button>
                <button
                  onClick={() => handleOpenDetail(top3)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                  title="Ver estadísticas"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por sección, mascota o tutor..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Grade Filters & Sort */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          
          {/* Grade pills */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => {
                  sounds.playTick();
                  setSelectedGrade(grade);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedGrade === grade
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {grade === 'all' ? 'Todas' : grade}
              </button>
            ))}
          </div>

          {/* Sort By Toggle */}
          <button
            onClick={() => {
              sounds.playTick();
              setSortBy(sortBy === 'points' ? 'kilos' : 'points');
            }}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Cambiar orden"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ordenar por: <strong className="text-white">{sortBy === 'points' ? 'Puntos' : 'Kilos'}</strong></span>
          </button>

        </div>

      </div>

      {/* FULL RANKINGS TABLE */}
      <div className="overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 sm:px-6 w-16 text-center">Pos.</th>
                <th className="py-4 px-4">Sección y Mascota</th>
                <th className="py-4 px-4 text-right">Puntos</th>
                <th className="py-4 px-4 text-right">Total Kilos</th>
                <th className="py-4 px-4 hidden lg:table-cell">Desglose por Material (kg)</th>
                <th className="py-4 px-4 text-center w-28">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredList.map((item) => {
                const isLeader = item.rank === 1;
                const isPodium = item.rank <= 3;

                return (
                  <tr
                    key={item.section.id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isLeader ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    {/* Rank Position */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span
                          className={`w-8 h-8 rounded-xl font-black font-mono flex items-center justify-center text-sm ${
                            item.rank === 1
                              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                              : item.rank === 2
                              ? 'bg-slate-300 text-slate-950'
                              : item.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {item.rank}
                        </span>

                        {/* Trend indicator */}
                        <span className="hidden sm:inline-block">
                          {item.trend === 'up' && (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          {item.trend === 'down' && (
                            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          {item.trend === 'same' && (
                            <Minus className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Section Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.section.avatar}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-base">
                              {item.section.code}
                            </span>
                            <span className="text-xs text-slate-400">
                              {item.section.mascot}
                            </span>
                          </div>
                          {item.section.advisor && (
                            <span className="text-[11px] text-slate-500 block">
                              Tutor: {item.section.advisor}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Points & Mini Bar */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                          {item.totalPoints.toLocaleString('es-ES')} <span className="text-xs font-normal text-slate-400">pts</span>
                        </span>
                        <div className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{
                              width: `${Math.min(100, Math.max(5, (item.totalPoints / (top1?.totalPoints || 1)) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Total Kilos */}
                    <td className="py-4 px-4 text-right font-mono">
                      <span className="text-sm sm:text-base font-bold text-emerald-400">
                        {item.totalKilos} <span className="text-xs text-slate-400 font-normal">kg</span>
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {item.entriesCount} entregas
                      </span>
                    </td>

                    {/* Material breakdown pills (M2 Requirement) */}
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <div className="flex flex-wrap items-center gap-1.5 max-w-sm">
                        {Object.entries(item.materialKilos).map(([matId, kg]) => {
                          if (kg <= 0) return null;
                          const mat = RECYCLING_MATERIALS[matId as MaterialId];
                          if (!mat) return null;

                          return (
                            <span
                              key={matId}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60"
                              title={`${mat.name}: ${kg} kg`}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: mat.color }}
                              />
                              <span className="capitalize">{matId}:</span>
                              <strong className="text-white font-mono">{kg}kg</strong>
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenRegisterForSection(item.section.id)}
                          className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 transition-all"
                          title="Registrar kilos para esta sección"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          title="Ver perfil completo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAiAuditForSection(item)}
                          className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition-all"
                          title="Emitir dictamen ecológico con IA"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No se encontraron secciones con el criterio de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
