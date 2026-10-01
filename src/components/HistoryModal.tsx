import React, { useState, useMemo, useRef } from 'react';
import {
  X,
  History,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Search,
  FileSpreadsheet,
  AlertCircle,
  Plus,
  Sparkles,
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
    clearAllData,
    exportDataJson,
    importDataJson,
    monthlyGoal,
    setIsRegisterOpen,
  } = useRecycling();

  const [search, setSearch] = useState('');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Export to CSV with anti-formula injection sanitization
  const handleExportCsv = () => {
    sounds.playTick();
    const sanitizeCsv = (val: string) => {
      const str = (val || '').replace(/"/g, '""');
      return /^[=\+\-@]/.test(str) ? `"'${str}"` : `"${str}"`;
    };

    const headers = ['ID', 'Fecha', 'Sección', 'Material', 'Kilos', 'Puntos', 'EntregadoPor', 'Notas'];
    const rows = entries.map((e) => {
      const sec = sectionMap.get(e.sectionId);
      const mat = RECYCLING_MATERIALS[e.materialId];
      return [
        sanitizeCsv(e.id),
        sanitizeCsv(e.formattedDate),
        sanitizeCsv(sec?.code || e.sectionId),
        sanitizeCsv(mat?.name || e.materialId),
        e.kilos,
        e.points,
        sanitizeCsv(e.registeredBy || ''),
        sanitizeCsv(e.notes || ''),
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

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importDataJson(content);
        if (res.success) {
          alert(`¡Respaldo importado con éxito! Se cargaron ${res.count} registros de reciclaje.`);
        } else {
          alert(`Error al importar respaldo: ${res.error}`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
    >
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json,application/json"
        className="hidden"
      />

      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl shadow-slate-950/90 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b-2 border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center flex-shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 id="history-modal-title" className="text-xl sm:text-2xl font-black text-white">
                Historial de Entregas
              </h3>
              <p className="text-sm sm:text-base text-slate-300">
                Auditoría completa de kilos, materiales y secciones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 text-sm font-bold flex items-center gap-1.5 transition-all"
              title="Restaurar copia de seguridad JSON"
            >
              <Upload className="w-4 h-4 text-teal-400" />
              <span className="hidden sm:inline">Importar</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 text-sm font-bold flex items-center gap-1.5 transition-all"
              title="Descargar Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={exportDataJson}
              className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 text-sm font-bold flex items-center gap-1.5 transition-all"
              title="Copia de seguridad JSON"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <button
              onClick={handleClose}
              aria-label="Cerrar historial"
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ml-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b-2 border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por sección, notas o alumno..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-sky-400 min-h-[46px]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterMaterial('all')}
              className={`min-h-[40px] px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                filterMaterial === 'all'
                  ? 'bg-sky-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-850 bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Todos ({entries.length})
            </button>
            {MATERIALS_LIST.map((m) => (
              <button
                key={m.id}
                onClick={() => setFilterMaterial(m.id)}
                className={`min-h-[40px] px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filterMaterial === m.id
                    ? 'bg-slate-800 text-white border-2 border-sky-400'
                    : 'bg-slate-850 bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                <span>{m.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Entries Table / List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          
          {/* CASO 1: Si no hay ninguna entrega en la base de datos */}
          {entries.length === 0 ? (
            <div className="py-10 px-4 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-3xl shadow-lg">
                📦
              </div>
              <div className="space-y-1">
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  El historial está vacío
                </h4>
                <p className="text-base text-slate-300 leading-relaxed">
                  Aún no se ha registrado ninguna entrega o se vació el marcador a 0 kg.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => resetToDefaultData()}
                  className="w-full sm:w-auto min-h-[50px] px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Cargar entregas de ejemplo</span>
                </button>

                <button
                  onClick={() => {
                    handleClose();
                    setIsRegisterOpen(true);
                  }}
                  className="w-full sm:w-auto min-h-[50px] px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-600 font-bold text-base transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <span>+ Registrar Kilos</span>
                </button>
              </div>
            </div>
          ) : filteredEntries.length === 0 ? (
            /* CASO 2: Si hay entregas pero el filtro o búsqueda no arrojó resultados */
            <div className="py-10 text-center text-slate-300 space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="text-base font-semibold">
                No hay entregas que coincidan con la búsqueda o filtro seleccionado.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setFilterMaterial('all');
                }}
                className="min-h-[46px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-base font-bold border border-slate-600 transition-all inline-flex items-center gap-2"
              >
                <span>Mostrar todas las entregas ({entries.length})</span>
              </button>
            </div>
          ) : (
            /* CASO 3: Lista de entregas con datos visibles y legibles */
            filteredEntries.map((e) => {
              const sec = sectionMap.get(e.sectionId);
              const mat = (e.materialId && RECYCLING_MATERIALS[e.materialId])
                ? RECYCLING_MATERIALS[e.materialId]
                : { name: 'Reciclaje', color: '#10b981', pointsPerKg: 10 };

              const kilos = typeof e.kilos === 'number' ? e.kilos : Number(e.kilos) || 0;
              const points = typeof e.points === 'number' ? e.points : Number(e.points) || 0;

              return (
                <div
                  key={e.id}
                  className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border-2 border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl flex-shrink-0">{sec?.avatar || '📦'}</span>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-black text-white text-lg">{sec?.code || 'Sección'}</span>
                        <span className="text-sm font-semibold text-slate-300">{sec?.mascot || 'Participante'}</span>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-black border"
                          style={{
                            backgroundColor: `${mat.color}25`,
                            borderColor: `${mat.color}60`,
                            color: mat.color,
                          }}
                        >
                          {mat.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-300 mt-1 flex-wrap">
                        <span className="font-medium text-slate-400">{e.formattedDate || 'Reciente'}</span>
                        {e.registeredBy && <span>• Entregó: <strong className="text-white">{e.registeredBy}</strong></span>}
                        {e.notes && <span className="italic text-slate-400">• "{e.notes}"</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xl font-black text-emerald-300 font-mono block">
                        +{kilos} kg
                      </span>
                      <span className="text-sm font-bold text-amber-300 font-mono block">
                        +{points} pts
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(e.id)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Eliminar este registro"
                      aria-label="Eliminar entrega"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}

        </div>

        {/* Footer with Reset Default and Clear Data */}
        <div className="p-4 border-t-2 border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-300 gap-3">
          <span>
            Total de pesajes registrados: <strong className="text-white font-mono text-base">{entries.length}</strong>
          </span>

          <div className="flex items-center gap-4">
            <button
              onClick={resetToDefaultData}
              className="text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 font-bold transition-colors py-1"
              title="Restaurar las 12 entregas de prueba iniciales"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Cargar datos de prueba</span>
            </button>

            <button
              onClick={clearAllData}
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1.5 font-semibold transition-colors py-1"
              title="Vaciar todos los registros para iniciar de cero"
            >
              <Trash2 className="w-4 h-4" />
              <span>Borrar datos (0 kg)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
