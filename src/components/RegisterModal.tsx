import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Scale,
  Sparkles,
  CheckCircle,
  AlertCircle,
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
    showNotification,
  } = useRecycling();

  const [sectionId, setSectionId] = useState<string>('');
  const [materialId, setMaterialId] = useState<MaterialId>('plastico');
  const [kilosStr, setKilosStr] = useState<string>('5');
  const [registeredBy, setRegisteredBy] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Sync preselected section when modal opens
  useEffect(() => {
    if (isRegisterOpen) {
      setFormError(null);
      if (preselectedSectionId) {
        setSectionId(preselectedSectionId);
      } else if (sections.length > 0 && !sectionId) {
        setSectionId(sections[0].id);
      }
    }
  }, [isRegisterOpen, preselectedSectionId, sections, sectionId]);

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
    setFormError(null);
    setIsRegisterOpen(false);
    setPreselectedSectionId(undefined);
  };

  const handleAddKilos = (amount: number) => {
    sounds.playTick();
    setFormError(null);
    const current = parseFloat(kilosStr) || 0;
    const next = Math.max(0.1, Number((current + amount).toFixed(1)));
    setKilosStr(next.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionId) {
      setFormError('Por favor selecciona la sección que entrega los materiales.');
      return;
    }

    if (kilos <= 0 || isNaN(kilos)) {
      setFormError('Por favor ingresa una cantidad de kilos mayor a cero.');
      return;
    }

    setFormError(null);
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn overflow-y-auto"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl shadow-slate-950/90 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 id="register-modal-title" className="text-xl sm:text-2xl font-black text-white leading-tight">
                Registrar Kilos de Reciclaje
              </h3>
              <p className="text-base text-slate-300">Entrega de materiales por sección</p>
            </div>
          </div>

          {/* Secondary Outlined Close Button */}
          <button
            onClick={handleClose}
            aria-label="Cerrar ventana de registro"
            className="p-3 rounded-2xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-600 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 text-base text-slate-100">
          
          {/* Friendly Error Message if validation fails */}
          {formError && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-rose-100 flex items-center gap-3 text-base font-semibold"
            >
              <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section Selection */}
          <div>
            <label id="label-seccion" className="block text-base font-bold text-white mb-2">
              1. ¿Qué sección realiza la entrega?
            </label>
            <div
              role="group"
              aria-labelledby="label-seccion"
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
            >
              {sections.map((sec) => {
                const isSelected = sec.id === sectionId;
                return (
                  <button
                    type="button"
                    key={sec.id}
                    onClick={() => {
                      sounds.playTick();
                      setFormError(null);
                      setSectionId(sec.id);
                    }}
                    className={`min-h-[56px] p-3 rounded-2xl text-left border-2 transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-950/90 border-emerald-400 text-white font-bold ring-2 ring-emerald-400/40 shadow-md'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{sec.avatar}</span>
                    <div className="truncate">
                      <span className="text-base block font-black text-white leading-tight truncate">{sec.code}</span>
                      <span className="text-sm block text-slate-300 truncate">{sec.mascot}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Material Selection */}
          <div>
            <label id="label-material" className="block text-base font-bold text-white mb-2">
              2. Tipo de material a reciclar
            </label>
            <div
              role="group"
              aria-labelledby="label-material"
              className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
            >
              {MATERIALS_LIST.map((mat) => {
                const isSelected = mat.id === materialId;
                return (
                  <button
                    type="button"
                    key={mat.id}
                    onClick={() => {
                      sounds.playTick();
                      setFormError(null);
                      setMaterialId(mat.id);
                    }}
                    className={`min-h-[64px] p-3.5 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-slate-850 bg-slate-800 border-emerald-400 text-white ring-2 ring-emerald-400/30'
                        : 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: mat.color }}
                      />
                      <span className="text-base font-black text-amber-300 font-mono">
                        +{mat.pointsPerKg} pts/kg
                      </span>
                    </div>
                    <span className="text-base font-bold block text-white">{mat.name}</span>
                    <span className="text-sm text-slate-300 block truncate">{mat.examples}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weight in Kilos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="kilos-input" className="text-base font-bold text-white">
                3. Peso entregado en kilos:
              </label>
              <span className="text-base font-semibold text-emerald-300 font-mono">
                Valor: {selectedMaterial?.pointsPerKg} pts por kilo
              </span>
            </div>

            <div className="relative">
              <input
                id="kilos-input"
                type="number"
                step="0.1"
                min="0.1"
                max="999"
                value={kilosStr}
                onChange={(e) => {
                  setKilosStr(e.target.value);
                  setFormError(null);
                }}
                required
                className="w-full text-center text-3xl sm:text-4xl font-black font-mono py-3.5 rounded-2xl bg-slate-950 border-2 border-slate-600 focus:border-emerald-400 text-white focus:outline-none min-h-[58px]"
                placeholder="0.0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-extrabold text-slate-300">
                KG
              </span>
            </div>

            {/* Quick add Outlined buttons (Thumb-friendly >= 48px) */}
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              {[0.5, 1, 2, 5, 10, 20].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => handleAddKilos(amt)}
                  className="min-h-[48px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 text-base font-bold transition-all active:scale-95"
                >
                  +{amt} kg
                </button>
              ))}
            </div>
          </div>

          {/* Instant Impact & Points Preview */}
          <div className="rounded-2xl bg-slate-950/90 border-2 border-emerald-500/40 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Puntos para {selectedSection?.code || 'la sección'}:
              </span>
              <span className="text-3xl font-black text-amber-300 font-mono">
                +{pointsCalculated.toLocaleString('es-ES')} <span className="text-base text-amber-400 font-normal">pts</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800 text-center text-base">
              <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-700">
                <span className="text-sm text-slate-300 block">Árboles</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {singleImpact.trees}
                </span>
              </div>
              <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-700">
                <span className="text-sm text-slate-300 block">Agua Ahorrada</span>
                <span className="text-lg font-black text-sky-300 font-mono">
                  {singleImpact.waterLitres} L
                </span>
              </div>
              <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-700">
                <span className="text-sm text-slate-300 block">CO2 Evitado</span>
                <span className="text-lg font-black text-teal-300 font-mono">
                  {singleImpact.co2Kg} kg
                </span>
              </div>
            </div>
          </div>

          {/* Deliverer and Notes with permanent explicit labels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="registered-by" className="block text-base font-bold text-white mb-1">
                Nombre de quien entrega (opcional):
              </label>
              <input
                id="registered-by"
                type="text"
                value={registeredBy}
                onChange={(e) => setRegisteredBy(e.target.value)}
                placeholder="Ejemplo: Valentina Ruiz o Prof. Soto"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white placeholder-slate-400 text-base focus:outline-none focus:border-emerald-400 min-h-[50px]"
              />
            </div>

            <div>
              <label htmlFor="notes-input" className="block text-base font-bold text-white mb-1">
                Lugar o detalle del acopio (opcional):
              </label>
              <input
                id="notes-input"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ejemplo: Recolectado en el recreo"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white placeholder-slate-400 text-base focus:outline-none focus:border-emerald-400 min-h-[50px]"
              />
            </div>
          </div>

          {/* THE SINGLE PRIMARY FILLED BUTTON ON THIS SCREEN */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={kilos <= 0}
              className="w-full min-h-[56px] py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-lg sm:text-xl shadow-xl shadow-emerald-500/30 active:scale-98 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-6 h-6 text-slate-950" />
              <span>Confirmar y Sumar {pointsCalculated} Puntos</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
