import React, { useState } from 'react';
import {
  X,
  Target,
  Save,
  Users,
} from 'lucide-react';
import { useRecycling } from '../context/RecyclingContext';
import { sounds } from '../utils/audio';

export const GoalConfigModal: React.FC = () => {
  const { isGoalModalOpen, setIsGoalModalOpen, monthlyGoal, updateMonthlyGoal, addSection } = useRecycling();

  const [schoolName, setSchoolName] = useState(monthlyGoal.schoolName);
  const [monthName, setMonthName] = useState(monthlyGoal.monthName);
  const [targetKilos, setTargetKilos] = useState(monthlyGoal.targetKilos.toString());

  // Add section mini-form
  const [showAddSection, setShowAddSection] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('1º Año');
  const [newMascot, setNewMascot] = useState('🦁 Leones Verdes');
  const [newAvatar, setNewAvatar] = useState('🦁');
  const [newSlogan, setNewSlogan] = useState('¡Cuidando nuestro entorno!');

  if (!isGoalModalOpen) return null;

  const handleClose = () => {
    sounds.playTick();
    setIsGoalModalOpen(false);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const rawKg = parseFloat(targetKilos);
    const kg = isNaN(rawKg) ? 1200 : Math.max(50, Math.min(100000, Number(rawKg.toFixed(1))));
    updateMonthlyGoal({
      schoolName: schoolName.trim().slice(0, 80) || 'Instituto Escolar',
      monthName: monthName.trim().slice(0, 40) || 'Mes en Curso',
      targetKilos: kg,
    });
    sounds.playSuccessChime();
    handleClose();
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    addSection({
      code: newCode.trim(),
      name: newName.trim(),
      grade: newGrade,
      group: newCode.slice(-1) || 'A',
      mascot: newMascot.trim(),
      color: '#059669',
      avatar: newAvatar.trim() || '🌱',
      slogan: newSlogan.trim(),
    });

    sounds.playSuccessChime();
    setShowAddSection(false);
    setNewCode('');
    setNewName('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl shadow-slate-950/90 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b-2 border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 id="goal-modal-title" className="text-xl sm:text-2xl font-black text-white">Configuración del Desafío</h3>
              <p className="text-base text-slate-300">Metas del instituto y administración</p>
            </div>
          </div>

          {/* Secondary Outlined button */}
          <button
            onClick={handleClose}
            aria-label="Cerrar configuración"
            className="p-3 rounded-2xl text-slate-300 hover:text-white bg-slate-800 border border-slate-600 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body (Requisitos 2 y 3: Labels permanentes y texto >= 16px) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-base text-slate-100">
          <form onSubmit={handleSaveGoal} className="space-y-5">
            <div>
              <label htmlFor="school-name-input" className="block text-base font-bold text-white mb-2">
                Nombre del Instituto / Escuela:
              </label>
              <input
                id="school-name-input"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border-2 border-slate-700 text-white text-base focus:outline-none focus:border-amber-400 min-h-[50px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="month-name-input" className="block text-base font-bold text-white mb-2">
                  Mes de Competencia:
                </label>
                <input
                  id="month-name-input"
                  type="text"
                  value={monthName}
                  onChange={(e) => setMonthName(e.target.value)}
                  required
                  placeholder="Ej: Octubre 2026"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border-2 border-slate-700 text-white text-base focus:outline-none focus:border-amber-400 min-h-[50px]"
                />
              </div>

              <div>
                <label htmlFor="target-kilos-input" className="block text-base font-bold text-white mb-2">
                  Meta Mensual en Kilos:
                </label>
                <input
                  id="target-kilos-input"
                  type="number"
                  min="50"
                  step="50"
                  value={targetKilos}
                  onChange={(e) => setTargetKilos(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border-2 border-slate-700 text-white text-base font-mono font-bold focus:outline-none focus:border-amber-400 min-h-[50px]"
                />
              </div>
            </div>

            {/* UN SOLO BOTÓN PRINCIPAL FILLED POR FORMULARIO */}
            <button
              type="submit"
              className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-lg shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5 text-slate-950" />
              <span>Guardar Configuración</span>
            </button>
          </form>

          {/* Add Section Expandable */}
          <div className="pt-4 border-t-2 border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                ¿Agregar una nueva sección?
              </span>
              
              {/* Secondary Outlined button */}
              <button
                type="button"
                onClick={() => setShowAddSection(!showAddSection)}
                className="min-h-[44px] px-3.5 py-1.5 rounded-xl border border-emerald-500/50 text-emerald-300 hover:bg-slate-800 text-base font-bold transition-colors"
              >
                {showAddSection ? 'Cancelar' : '+ Nueva Sección'}
              </button>
            </div>

            {showAddSection && (
              <form onSubmit={handleCreateSection} className="p-4 sm:p-5 rounded-3xl bg-slate-950 border-2 border-slate-800 space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="new-code-input" className="text-base font-bold text-white block mb-1">
                      Código (Ej: 5º A):
                    </label>
                    <input
                      id="new-code-input"
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      required
                      placeholder="5º A"
                      className="w-full p-3 rounded-xl bg-slate-900 border-2 border-slate-700 text-base text-white min-h-[48px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-name-input" className="text-base font-bold text-white block mb-1">
                      Nombre Completo:
                    </label>
                    <input
                      id="new-name-input"
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      placeholder="5º Año Sección A"
                      className="w-full p-3 rounded-xl bg-slate-900 border-2 border-slate-700 text-base text-white min-h-[48px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="new-grade-input" className="text-base font-bold text-white block mb-1">
                      Nivel / Año:
                    </label>
                    <input
                      id="new-grade-input"
                      type="text"
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      placeholder="5º Año"
                      className="w-full p-3 rounded-xl bg-slate-900 border-2 border-slate-700 text-base text-white min-h-[48px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-mascot-input" className="text-base font-bold text-white block mb-1">
                      Mascota:
                    </label>
                    <input
                      id="new-mascot-input"
                      type="text"
                      value={newMascot}
                      onChange={(e) => setNewMascot(e.target.value)}
                      placeholder="🦁 Leones Eco"
                      className="w-full p-3 rounded-xl bg-slate-900 border-2 border-slate-700 text-base text-white min-h-[48px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-avatar-input" className="text-base font-bold text-white block mb-1">
                      Emoji / Ícono:
                    </label>
                    <input
                      id="new-avatar-input"
                      type="text"
                      value={newAvatar}
                      onChange={(e) => setNewAvatar(e.target.value)}
                      placeholder="🦁"
                      className="w-full p-3 rounded-xl bg-slate-900 border-2 border-slate-700 text-base text-white text-center min-h-[48px]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="new-slogan-input" className="text-base font-bold text-white block mb-1">
                    Lema o Slogan:
                  </label>
                  <input
                    id="new-slogan-input"
                    type="text"
                    value={newSlogan}
                    onChange={(e) => setNewSlogan(e.target.value)}
                    placeholder="¡El planeta es nuestra casa!"
                    className="w-full p-3 rounded-xl bg-slate-900 border-2 border-slate-700 text-base text-white min-h-[48px]"
                  />
                </div>

                {/* Secondary Outlined button */}
                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3 rounded-xl bg-transparent hover:bg-slate-900 text-emerald-400 border-2 border-emerald-500 text-base font-bold transition-all"
                >
                  Confirmar y Añadir a la Competencia
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
