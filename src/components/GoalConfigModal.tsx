import React, { useState } from 'react';
import {
  X,
  Target,
  School,
  Save,
  Plus,
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
    const kg = parseFloat(targetKilos) || 1000;
    updateMonthlyGoal({
      schoolName,
      monthName,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl shadow-slate-950/80 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Configuración del Desafío</h3>
              <p className="text-xs text-slate-400">Metas del instituto y administración de secciones</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <form onSubmit={handleSaveGoal} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Nombre del Instituto / Escuela:
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Mes de Competencia:
                </label>
                <input
                  type="text"
                  value={monthName}
                  onChange={(e) => setMonthName(e.target.value)}
                  required
                  placeholder="ej: Octubre 2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Meta Mensual (kg):
                </label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={targetKilos}
                  onChange={(e) => setTargetKilos(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Meta Mensual</span>
            </button>
          </form>

          {/* Add Section Expandable */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                ¿Nueva Sección Participante?
              </span>
              <button
                type="button"
                onClick={() => setShowAddSection(!showAddSection)}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                {showAddSection ? 'Cancelar' : '+ Agregar Sección'}
              </button>
            </div>

            {showAddSection && (
              <form onSubmit={handleCreateSection} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-3 animate-fadeIn">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Código (ej: 5º A):</label>
                    <input
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      required
                      placeholder="5º A"
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Nombre Completo:</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      placeholder="5º Año Sección A"
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Año/Nivel:</label>
                    <input
                      type="text"
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      placeholder="5º Año"
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Mascota:</label>
                    <input
                      type="text"
                      value={newMascot}
                      onChange={(e) => setNewMascot(e.target.value)}
                      placeholder="🦁 Leones Eco"
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Emoji / Avatar:</label>
                    <input
                      type="text"
                      value={newAvatar}
                      onChange={(e) => setNewAvatar(e.target.value)}
                      placeholder="🦁"
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Lema o Slogan:</label>
                  <input
                    type="text"
                    value={newSlogan}
                    onChange={(e) => setNewSlogan(e.target.value)}
                    placeholder="¡El planeta es nuestra casa!"
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all"
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
