import React, { useState, useMemo } from 'react';
import {
  X,
  History,
  Trash2,
  Download,
  RotateCcw,
  Search,
  Filter,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';
import { useRecycling } from '../context/RecyclingContext';
import { MaterialId } from '../types';
import { RECYCLING_MATERIALS, MATERIALS_LIST } from '../constants/materials';
import { sounds } from '../utils/audio';

export const HistoryModal: React.FC = () => {
  const {
    isHistoryOpen,
    setIsHistoryOpen,
    entries,
    sections,
    deleteEntry,
    resetToDefaultData,
    exportDataJson,
    monthlyGoal,
  } = useRecycling();

  const [search, setSearch] = useState('');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');

  if (!isHistoryOpen) return null;

  const handleClose = () => {
    sounds.playTick();
    setIsHistoryOpen(false);
  };

  // Section lookup map for fast O(1) resolution
  const sectionMap = useMemo(() => {
    const map = new Map<string, (typeof sections)[0]>();
    sections.forEach((s) => map.set(s.id, s));
    return map;
  }, [sections]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (filterMaterial !== 'all' && e.materialId !== filterMaterial) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const sec = sectionMap.get(e.sectionId);
        const secName = sec ? `${sec.code} ${sec.name} ${sec.mascot}`.toLowerCase() : '';
        const notes = (e.notes || '').toLowerCase();
        const reg = (e.registeredBy || '').toLowerCase();
        return secName.includes(q) || notes.includes(q) || reg.includes(q);
      }
      return true;
    });
  }, [entries, filterMaterial, search, sectionMap]);

  // Export to CSV
  const handleExportCsv = () => {
    sounds.playTick();
    const headers = ['ID', 'Fecha', 'Sección', 'Material', 'Kilos', 'Puntos', 'EntregadoPor', 'Notas'];
    const rows = entries.map((e) => {
      const sec = sectionMap.get(e.sectionId);
      const mat = RECYCLING_MATERIALS[e.materialId];
      return [
        `"${e.id}"`,
        `"${e.formattedDate}"`,
        `"${sec?.code || e.sectionId}"`,
        `"${mat?.name || e.materialId}"`,
        e.kilos,
        e.points,
        `"${(e.registeredBy || '').replace(/"/g, '""')}"`,
        `"${(e.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ReciclaPuntos_${monthlyGoal.monthName.replace(/\s+/g, '_')}_Entregas.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar este registro de entrega? Los puntos y kilos se recalcularán automáticamente.')) {
      sounds.playTick();
      deleteEntry(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-slate-950/80 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Historial de Entregas (M2)</h3>
              <p className="text-xs text-slate-400">Auditoría completa de kilos por material y sección</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Descargar Excel / CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={exportDataJson}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Copia de seguridad JSON"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar por sección, nota o alumno..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterMaterial('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterMaterial === 'all'
                  ? 'bg-sky-500 text-slate-950 font-black'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos ({entries.length})
            </button>
            {MATERIALS_LIST.map((m) => (
              <button
                key={m.id}
                onClick={() => setFilterMaterial(m.id)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  filterMaterial === m.id
                    ? 'bg-slate-700 text-white border border-slate-500'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                <span>{m.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Entries Table / List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {filteredEntries.map((e) => {
            const sec = sectionMap.get(e.sectionId);
            const mat = RECYCLING_MATERIALS[e.materialId];

            return (
              <div
                key={e.id}
                className="p-3.5 rounded-2xl bg-slate-850 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sec?.avatar || '📦'}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{sec?.code || 'Sección'}</span>
                      <span className="text-xs text-slate-400">{sec?.mascot}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                        style={{
                          backgroundColor: `${mat?.color}20`,
                          borderColor: `${mat?.color}40`,
                          color: mat?.color,
                        }}
                      >
                        {mat?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{e.formattedDate}</span>
                      {e.registeredBy && <span>• Por: {e.registeredBy}</span>}
                      {e.notes && <span className="italic">• "{e.notes}"</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-400 font-mono block">
                      +{e.kilos} kg
                    </span>
                    <span className="text-xs font-bold text-amber-400 font-mono block">
                      +{e.points} pts
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(e.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Eliminar registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredEntries.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold">No hay entregas registradas con este filtro.</p>
            </div>
          )}
        </div>

        {/* Footer with Reset Default */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <span>Total de entregas registradas: <strong className="text-white font-mono">{entries.length}</strong></span>

          <button
            onClick={resetToDefaultData}
            className="text-slate-500 hover:text-rose-400 flex items-center gap-1 font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer datos de prueba</span>
          </button>
        </div>

      </div>
    </div>
  );
};
