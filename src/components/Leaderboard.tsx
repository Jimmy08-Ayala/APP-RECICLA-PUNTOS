import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  PlusCircle,
  Eye,
  Sparkles,
  ArrowUpDown,
  Inbox,
} from 'lucide-react';
import { useRecycling } from '../context/RecyclingContext';
import { SectionStats, MaterialId } from '../types';
import { RECYCLING_MATERIALS } from '../constants/materials';
import { sounds } from '../utils/audio';

export const Leaderboard: React.FC = () => {
  const {
    sectionStats,
    entries,
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

  // Requisito 5: ESTADO VACÍO (cuando no hay ningún dato)
  if (entries.length === 0) {
    return (
      <div className="space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-base font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-3">
            <Trophy className="w-5 h-5" />
            Competencia Escolar en Vivo
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tabla de Posiciones
          </h2>
        </div>

        <div className="rounded-3xl bg-slate-900 border-2 border-dashed border-emerald-500/50 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl space-y-5">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center text-4xl shadow-inner">
            🌱
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              ¡La competencia está lista para comenzar!
            </h3>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-lg mx-auto">
              Todavía no hay ninguna entrega de reciclaje registrada este mes. ¡Sé la primera sección en pesar sus materiales y tomar la delantera en el podio escolar!
            </p>
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                sounds.playTick();
                setIsRegisterOpen(true);
              }}
              className="min-h-[56px] px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg sm:text-xl shadow-xl shadow-emerald-500/30 active:scale-95 transition-all inline-flex items-center gap-3"
            >
              <PlusCircle className="w-6 h-6 text-slate-950" />
              <span>Registrar la primera entrega</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* SECTION HEADER & PODIUM */}
      <div className="text-center max-w-2xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-base font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-3">
          <Trophy className="w-5 h-5 text-amber-400" />
          Competencia Intersecciones en Vivo
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Tabla de Posiciones
        </h2>
        <p className="text-base sm:text-lg text-slate-300 mt-1">
          Cada kilo reciclado suma puntos según su impacto ecológico.
        </p>
      </div>

      {/* TOP 3 PODIUM DISPLAY */}
      {top1 && top1.totalPoints > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-6 max-w-5xl mx-auto items-end">
          
          {/* 2nd Place (Silver) */}
          {top2 && (
            <div className="order-2 md:order-1 relative rounded-3xl bg-slate-900 border-2 border-slate-700 p-6 flex flex-col items-center text-center shadow-xl">
              <div className="absolute -top-5 w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 font-black flex items-center justify-center shadow-lg border-2 border-slate-900 text-lg font-mono">
                2º
              </div>
              <span className="text-5xl mt-3 mb-2">{top2.section.avatar}</span>
              <h4 className="text-xl font-black text-white">{top2.section.code}</h4>
              <p className="text-base font-semibold text-slate-300">{top2.section.mascot}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-700/80 w-full grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-800 rounded-xl p-2.5">
                  <span className="text-sm text-slate-300 block font-medium">Puntos</span>
                  <span className="text-xl font-extrabold text-amber-300 font-mono">
                    {top2.totalPoints.toLocaleString('es-ES')}
                  </span>
                </div>
                <div className="bg-slate-800 rounded-xl p-2.5">
                  <span className="text-sm text-slate-300 block font-medium">Kilos</span>
                  <span className="text-xl font-extrabold text-emerald-300 font-mono">
                    {top2.totalKilos} kg
                  </span>
                </div>
              </div>

              {/* Secondary Outlined Buttons */}
              <div className="w-full mt-4 flex items-center gap-2">
                <button
                  onClick={() => handleOpenRegisterForSection(top2.section.id)}
                  className="flex-1 min-h-[48px] py-2 px-3 rounded-xl bg-transparent hover:bg-slate-800 text-emerald-400 text-base font-bold border border-emerald-500/50 flex items-center justify-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-5 h-5" />
                  + Kilos
                </button>
                <button
                  onClick={() => handleOpenDetail(top2)}
                  className="p-2.5 min-h-[48px] min-w-[48px] rounded-xl bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center justify-center"
                  title="Ver estadísticas"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* 1st Place (Gold Champion) */}
          <div className="order-1 md:order-2 relative rounded-3xl bg-slate-900 border-2 border-amber-400 p-7 flex flex-col items-center text-center shadow-2xl md:-translate-y-4">
            <div className="absolute -top-7 flex items-center justify-center">
              <div className="relative">
                <Crown className="w-9 h-9 text-amber-400 absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce" />
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-xl border-2 border-slate-900 text-2xl font-mono">
                  1º
                </div>
              </div>
            </div>

            <span className="text-6xl mt-4 mb-2">{top1.section.avatar}</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-1">
              🏆 LÍDER ACTUAL
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">{top1.section.code}</h3>
            <p className="text-base font-bold text-amber-300">{top1.section.mascot}</p>
            <p className="text-sm text-slate-300 italic mt-0.5">"{top1.section.slogan}"</p>

            <div className="mt-5 pt-4 border-t border-slate-700 w-full grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-800 rounded-2xl p-3 border border-slate-700">
                <span className="text-sm text-slate-300 block font-medium">Puntos Totales</span>
                <span className="text-2xl font-black text-amber-300 font-mono">
                  {top1.totalPoints.toLocaleString('es-ES')}
                </span>
              </div>
              <div className="bg-slate-800 rounded-2xl p-3 border border-slate-700">
                <span className="text-sm text-slate-300 block font-medium">Kilos Reciclados</span>
                <span className="text-2xl font-black text-emerald-300 font-mono">
                  {top1.totalKilos} kg
                </span>
              </div>
            </div>

            {/* Secondary Outlined Buttons */}
            <div className="w-full mt-5 flex items-center gap-2">
              <button
                onClick={() => handleOpenRegisterForSection(top1.section.id)}
                className="flex-1 min-h-[48px] py-2.5 px-4 rounded-xl bg-transparent hover:bg-slate-800 text-amber-300 text-base font-bold border-2 border-amber-400 flex items-center justify-center gap-2 transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                Sumar Kilos
              </button>
              <button
                onClick={() => handleOpenDetail(top1)}
                className="p-2.5 min-h-[48px] min-w-[48px] rounded-xl bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center justify-center"
                title="Ver estadísticas"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleAiAuditForSection(top1)}
                className="p-2.5 min-h-[48px] min-w-[48px] rounded-xl bg-transparent hover:bg-slate-800 text-teal-300 border border-teal-500/50 transition-all flex items-center justify-center"
                title="Dictamen IA"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          {top3 && (
            <div className="order-3 relative rounded-3xl bg-slate-900 border-2 border-slate-700 p-6 flex flex-col items-center text-center shadow-xl">
              <div className="absolute -top-5 w-12 h-12 rounded-2xl bg-amber-800 text-white font-black flex items-center justify-center shadow-lg border-2 border-slate-900 text-lg font-mono">
                3º
              </div>
              <span className="text-5xl mt-3 mb-2">{top3.section.avatar}</span>
              <h4 className="text-xl font-black text-white">{top3.section.code}</h4>
              <p className="text-base font-semibold text-slate-300">{top3.section.mascot}</p>

              <div className="mt-4 pt-4 border-t border-slate-700/80 w-full grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-800 rounded-xl p-2.5">
                  <span className="text-sm text-slate-300 block font-medium">Puntos</span>
                  <span className="text-xl font-extrabold text-amber-300 font-mono">
                    {top3.totalPoints.toLocaleString('es-ES')}
                  </span>
                </div>
                <div className="bg-slate-800 rounded-xl p-2.5">
                  <span className="text-sm text-slate-300 block font-medium">Kilos</span>
                  <span className="text-xl font-extrabold text-emerald-300 font-mono">
                    {top3.totalKilos} kg
                  </span>
                </div>
              </div>

              {/* Secondary Outlined Buttons */}
              <div className="w-full mt-4 flex items-center gap-2">
                <button
                  onClick={() => handleOpenRegisterForSection(top3.section.id)}
                  className="flex-1 min-h-[48px] py-2 px-3 rounded-xl bg-transparent hover:bg-slate-800 text-emerald-400 text-base font-bold border border-emerald-500/50 flex items-center justify-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-5 h-5" />
                  + Kilos
                </button>
                <button
                  onClick={() => handleOpenDetail(top3)}
                  className="p-2.5 min-h-[48px] min-w-[48px] rounded-xl bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center justify-center"
                  title="Ver estadísticas"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR (Requisitos 2 y 3: Labels permanentes y texto >= 16px) */}
      <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 border-2 border-slate-800 flex flex-col md:flex-row items-end justify-between gap-5">
        
        {/* Search Input with Permanent Visible Label */}
        <div className="w-full md:w-80">
          <label htmlFor="search-input-section" className="block text-base font-bold text-white mb-2">
            Buscar sección o tutor:
          </label>
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-input-section"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ej: 1º A, Águilas, Carlos..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border-2 border-slate-700 text-white placeholder-slate-400 text-base focus:outline-none focus:border-emerald-400 min-h-[50px]"
            />
          </div>
        </div>

        {/* Grade Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Grade filter with permanent label */}
          <div>
            <span className="block text-base font-bold text-white mb-2">Filtrar por año:</span>
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border-2 border-slate-800 text-base flex-wrap">
              {grades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => {
                    sounds.playTick();
                    setSelectedGrade(grade);
                  }}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-xl font-bold transition-all text-base ${
                    selectedGrade === grade
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {grade === 'all' ? 'Todas' : grade}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By Toggle (Secondary Outlined Button) */}
          <div className="self-end">
            <button
              onClick={() => {
                sounds.playTick();
                setSortBy(sortBy === 'points' ? 'kilos' : 'points');
              }}
              className="min-h-[50px] px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-2 border-slate-700 text-base font-semibold flex items-center gap-2 transition-all"
              title="Cambiar orden"
            >
              <ArrowUpDown className="w-5 h-5 text-emerald-400" />
              <span>Por: <strong className="text-white">{sortBy === 'points' ? 'Puntos' : 'Kilos'}</strong></span>
            </button>
          </div>

        </div>

      </div>

      {/* FULL RANKINGS TABLE (Requisito 2: Texto >= 16px y alto contraste para leerse al sol) */}
      <div className="overflow-hidden rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base text-slate-200">
            <thead className="bg-slate-950 text-sm uppercase tracking-wider text-slate-300 font-bold border-b-2 border-slate-800">
              <tr>
                <th className="py-4 px-4 sm:px-6 w-16 text-center">Pos.</th>
                <th className="py-4 px-4">Sección</th>
                <th className="py-4 px-4 text-right">Puntos</th>
                <th className="py-4 px-4 text-right">Kilos</th>
                <th className="py-4 px-4 hidden lg:table-cell">Materiales</th>
                <th className="py-4 px-4 text-center w-36">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-800 font-medium">
              {filteredList.map((item) => {
                const isLeader = item.rank === 1 && item.totalPoints > 0;

                return (
                  <tr
                    key={item.section.id}
                    className={`hover:bg-slate-800/60 transition-colors ${
                      isLeader ? 'bg-amber-500/10' : ''
                    }`}
                  >
                    {/* Rank Position */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`w-9 h-9 rounded-xl font-black font-mono flex items-center justify-center text-base ${
                            item.rank === 1 && item.totalPoints > 0
                              ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                              : item.rank === 2 && item.totalPoints > 0
                              ? 'bg-slate-300 text-slate-950 font-bold'
                              : item.rank === 3 && item.totalPoints > 0
                              ? 'bg-amber-700 text-white font-bold'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.rank}
                        </span>

                        {/* Trend indicator */}
                        <span className="hidden sm:inline-block">
                          {item.trend === 'up' && (
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                          )}
                          {item.trend === 'down' && (
                            <TrendingDown className="w-4 h-4 text-rose-400" />
                          )}
                          {item.trend === 'same' && (
                            <Minus className="w-4 h-4 text-slate-500" />
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Section Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl flex-shrink-0">{item.section.avatar}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-white text-lg">
                              {item.section.code}
                            </span>
                            <span className="text-base text-slate-300">
                              {item.section.mascot}
                            </span>
                          </div>
                          {item.section.advisor && (
                            <span className="text-sm text-slate-400 block">
                              Tutor: {item.section.advisor}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Points */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-lg sm:text-xl font-black text-amber-300 font-mono">
                          {item.totalPoints.toLocaleString('es-ES')} <span className="text-sm font-normal text-slate-300">pts</span>
                        </span>
                        <div className="w-24 sm:w-32 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
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
                      <span className="text-lg font-bold text-emerald-300 block">
                        {item.totalKilos} <span className="text-sm text-slate-300 font-normal">kg</span>
                      </span>
                      <span className="text-sm text-slate-400">
                        {item.entriesCount} entregas
                      </span>
                    </td>

                    {/* Material breakdown pills */}
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <div className="flex flex-wrap items-center gap-2 max-w-sm">
                        {Object.entries(item.materialKilos).map(([matId, kg]) => {
                          if (kg <= 0) return null;
                          const mat = RECYCLING_MATERIALS[matId as MaterialId];
                          if (!mat) return null;

                          return (
                            <span
                              key={matId}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-sm font-semibold bg-slate-800 text-slate-200 border border-slate-700"
                              title={`${mat.name}: ${kg} kg`}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: mat.color }}
                              />
                              <span className="capitalize">{matId}:</span>
                              <strong className="text-white font-mono">{kg}kg</strong>
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Actions (Outlined touch-friendly buttons >= 48px) */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenRegisterForSection(item.section.id)}
                          className="min-h-[48px] min-w-[48px] p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 transition-all flex items-center justify-center"
                          title="Registrar kilos para esta sección"
                          aria-label={`Registrar kilos para ${item.section.code}`}
                        >
                          <PlusCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="min-h-[48px] min-w-[48px] p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all flex items-center justify-center"
                          title="Ver perfil completo"
                          aria-label={`Ver detalles de ${item.section.code}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleAiAuditForSection(item)}
                          className="min-h-[48px] min-w-[48px] p-2.5 rounded-xl bg-slate-800 hover:bg-teal-500 text-teal-300 hover:text-slate-950 border border-teal-500/40 transition-all flex items-center justify-center"
                          title="Emitir dictamen ecológico con IA"
                          aria-label={`Dictamen ecológico IA para ${item.section.code}`}
                        >
                          <Sparkles className="w-5 h-5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-300 text-base">
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
