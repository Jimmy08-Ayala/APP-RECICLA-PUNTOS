import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Scale,
  Plus,
  Sparkles,
  TreePine,
  Droplets,
  CloudSun,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useRecycling } from '../context/RecyclingContext';
import { MaterialId } from '../types';
import { MATERIALS_LIST, RECYCLING_MATERIALS } from '../constants/materials';
import { calculateSingleEntryImpact } from '../utils/equivalences';
import { sounds } from '../utils/audio';

export const RegisterModal: React.FC = () => {
  const {
    isRegisterOpen,
    setIsRegisterOpen,
    sections,
    addEntry,
    preselectedSectionId,
    setPreselectedSectionId,
  } = useRecycling();

  const [sectionId, setSectionId] = useState<string>('');
  const [materialId, setMaterialId] = useState<MaterialId>('plastico');
  const [kilosStr, setKilosStr] = useState<string>('5');
  const [registeredBy, setRegisteredBy] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Sync preselected section when modal opens
  useEffect(() => {
    if (isRegisterOpen) {
      if (preselectedSectionId) {
        setSectionId(preselectedSectionId);
      } else if (sections.length > 0 && !sectionId) {
        setSectionId(sections[0].id);
      }
    }
  }, [isRegisterOpen, preselectedSectionId, sections]);

  const kilos = parseFloat(kilosStr) || 0;
  const selectedMaterial = RECYCLING_MATERIALS[materialId];
  const pointsCalculated = Math.round(kilos * (selectedMaterial?.pointsPerKg || 0));

  // Instant zero-lag ecological impact preview
  const singleImpact = useMemo(() => {
    return calculateSingleEntryImpact(materialId, kilos);
  }, [materialId, kilos]);

  if (!isRegisterOpen) return null;

  const handleClose = () => {
    sounds.playTick();
    setIsRegisterOpen(false);
    setPreselectedSectionId(undefined);
  };

  const handleAddKilos = (amount: number) => {
    sounds.playTick();
    const current = parseFloat(kilosStr) || 0;
    const next = Math.max(0.1, Number((current + amount).toFixed(1)));
    setKilosStr(next.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kilos <= 0 || !sectionId) return;

    addEntry({
      sectionId,
      materialId,
      kilos,
      registeredBy,
      notes,
    });

    handleClose();
  };

  const selectedSection = sections.find((s) => s.id === sectionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Registrar Kilos de Reciclaje</h3>
              <p className="text-xs text-slate-400">Entrega de materiales por sección escolar</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Section Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              1. Sección que entrega
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sections.map((sec) => {
                const isSelected = sec.id === sectionId;
                return (
                  <button
                    type="button"
                    key={sec.id}
                    onClick={() => {
                      sounds.playTick();
                      setSectionId(sec.id);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold ring-1 ring-emerald-500/50'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-lg">{sec.avatar}</span>
                    <div className="truncate">
                      <span className="text-xs block font-extrabold truncate text-white">{sec.code}</span>
                      <span className="text-[10px] block text-slate-400 truncate">{sec.mascot}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Material Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              2. Material Reciclable
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MATERIALS_LIST.map((mat) => {
                const isSelected = mat.id === materialId;
                return (
                  <button
                    type="button"
                    key={mat.id}
                    onClick={() => {
                      sounds.playTick();
                      setMaterialId(mat.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-2 border-emerald-400 ring-2 ring-emerald-400/20 text-white'
                        : 'bg-slate-850 bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: mat.color }}
                      />
                      <span className="text-[11px] font-black text-amber-400 font-mono">
                        +{mat.pointsPerKg} pts/kg
                      </span>
                    </div>
                    <span className="text-xs font-bold block text-white">{mat.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{mat.examples}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weight in Kilos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Peso en Kilos (kg)
              </label>
              <div className="text-xs font-semibold text-emerald-400 font-mono">
                Multiplicador: {selectedMaterial?.pointsPerKg} pts/kg
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="999"
                value={kilosStr}
                onChange={(e) => setKilosStr(e.target.value)}
                required
                className="w-full text-center text-3xl font-black font-mono py-3 rounded-2xl bg-slate-950 border-2 border-slate-700 focus:border-emerald-500 text-white focus:outline-none transition-all"
                placeholder="0.0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                KILOS
              </span>
            </div>

            {/* Quick add buttons */}
            <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
              {[0.5, 1, 2, 5, 10, 20].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => handleAddKilos(amt)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all"
                >
                  +{amt} kg
                </button>
              ))}
            </div>
          </div>

          {/* Instant Impact & Points Preview */}
          <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Puntos Ganados para {selectedSection?.code || 'la sección'}:
              </span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                +{pointsCalculated.toLocaleString('es-ES')} <span className="text-xs text-amber-400 font-normal">pts</span>
              </span>
            </div>

            {/* Equivalents in Real-World */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-500/20 text-center">
              <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Árboles</span>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  {singleImpact.trees}
                </span>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Agua Ahorrada</span>
                <span className="text-sm font-black text-sky-400 font-mono">
                  {singleImpact.waterLitres} L
                </span>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">CO2 Evitado</span>
                <span className="text-sm font-black text-teal-400 font-mono">
                  {singleImpact.co2Kg} kg
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center italic">
              Factor científico certificado: {selectedMaterial?.sources.primarySource}
            </p>
          </div>

          {/* Optional Details (Deliverer & Notes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Entregado por / Responsable:
              </label>
              <input
                type="text"
                value={registeredBy}
                onChange={(e) => setRegisteredBy(e.target.value)}
                placeholder="ej: Valentina R., Prof. Ruiz"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Nota o Lugar de Acopio:
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ej: Latas de la cafetería"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={kilos <= 0 || !sectionId}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Confirmar y Sumar {pointsCalculated} Puntos</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
