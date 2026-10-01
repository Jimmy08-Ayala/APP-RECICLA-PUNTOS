import React, { useState } from 'react';
import {
  X,
  Sparkles,
  TreePine,
  Droplets,
  CloudSun,
  Zap,
  Award,
  BookOpen,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';
import { useRecycling } from '../context/RecyclingContext';
import { sounds } from '../utils/audio';

export const AiAuditModal: React.FC = () => {
  const { isAiAuditOpen, setIsAiAuditOpen, aiAuditData, isAiLoading, monthlyGoal } = useRecycling();
  const [copied, setCopied] = useState(false);

  if (!isAiAuditOpen) return null;

  const handleClose = () => {
    sounds.playTick();
    setIsAiAuditOpen(false);
  };

  const handleCopy = () => {
    if (!aiAuditData) return;
    const text = `🌱 DICTAMEN ECOLÓGICO CON SELLO IA - ${monthlyGoal.schoolName}
${aiAuditData.tituloDictamen}
Mes: ${monthlyGoal.monthName}

🌳 Árboles Salvados: ${aiAuditData.arboles.descripcion}
Fuente: ${aiAuditData.arboles.fuenteOficial}

💧 Agua Preservada: ${aiAuditData.agua.descripcion}
Fuente: ${aiAuditData.agua.fuenteOficial}

🌍 CO2e Evitado: ${aiAuditData.co2.descripcion}
Fuente: ${aiAuditData.co2.fuenteOficial}

⚡ Energía Ahorrada: ${aiAuditData.energia.equivalenciaEscolar}
Fuente: ${aiAuditData.energia.fuenteOficial}

💡 Analogía Escolar:
${aiAuditData.analogiaEscolar}

🎯 Consejo de Competencia:
${aiAuditData.consejoCompetencia}

📚 Fuentes Oficiales Consultadas:
${aiAuditData.fuentesCitadas.join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-teal-500/40 shadow-2xl shadow-teal-950/60 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 flex items-center justify-center text-slate-950 font-black">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                  Dictamen Certificado IA (M5)
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Auditoría de Impacto Ambiental Escolar
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {isAiLoading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center animate-spin">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-white">
                Procesando equivalencias científicas con Gemini 3.8 Flash...
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Consultando factores de conversión de la EPA (WARM v16), PNUMA y Water Footprint Network.
              </p>
            </div>
          ) : aiAuditData ? (
            <>
              {/* Badge & School Header Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-teal-950/60 via-slate-850 to-emerald-950/60 border border-teal-500/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block">
                    {monthlyGoal.schoolName} • {monthlyGoal.monthName}
                  </span>
                  <h4 className="text-xl font-black text-white mt-0.5">
                    {aiAuditData.tituloDictamen}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Certificación de equivalencias ecológicas generadas por Inteligencia Artificial.
                  </p>
                </div>

                <div className="flex-shrink-0 bg-teal-500/20 border border-teal-500/40 rounded-2xl px-4 py-2 text-center">
                  <Award className="w-5 h-5 text-teal-300 mx-auto mb-1" />
                  <span className="text-[10px] text-teal-200 uppercase font-bold block">Insignia</span>
                  <span className="text-xs font-black text-white">{aiAuditData.insigniaOtorgada}</span>
                </div>
              </div>

              {/* 4 Pillars with Verified Factors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* 1. Árboles */}
                <div className="p-4 rounded-2xl bg-slate-850 bg-slate-800/60 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <TreePine className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Árboles Salvados</span>
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {aiAuditData.arboles.cantidad} <span className="text-sm font-normal text-emerald-400">árboles</span>
                  </div>
                  <p className="text-xs text-slate-300">{aiAuditData.arboles.descripcion}</p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-700/60">
                    <strong className="text-emerald-400">Fuente citada:</strong> {aiAuditData.arboles.fuenteOficial}
                  </div>
                </div>

                {/* 2. Agua */}
                <div className="p-4 rounded-2xl bg-slate-850 bg-slate-800/60 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400">
                    <Droplets className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Agua Potable</span>
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {aiAuditData.agua.cantidadLitros.toLocaleString('es-ES')} <span className="text-sm font-normal text-sky-400">litros</span>
                  </div>
                  <p className="text-xs text-slate-300">{aiAuditData.agua.descripcion}</p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-700/60">
                    <strong className="text-sky-400">Fuente citada:</strong> {aiAuditData.agua.fuenteOficial}
                  </div>
                </div>

                {/* 3. CO2 */}
                <div className="p-4 rounded-2xl bg-slate-850 bg-slate-800/60 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2 text-teal-400">
                    <CloudSun className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Emisiones CO2e</span>
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {aiAuditData.co2.kgCO2e.toLocaleString('es-ES')} <span className="text-sm font-normal text-teal-400">kg CO2e</span>
                  </div>
                  <p className="text-xs text-slate-300">{aiAuditData.co2.descripcion}</p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-700/60">
                    <strong className="text-teal-400">Fuente citada:</strong> {aiAuditData.co2.fuenteOficial}
                  </div>
                </div>

                {/* 4. Energía */}
                <div className="p-4 rounded-2xl bg-slate-850 bg-slate-800/60 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Zap className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Energía Eléctrica</span>
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {aiAuditData.energia.kwhAhorrados.toLocaleString('es-ES')} <span className="text-sm font-normal text-amber-400">kWh</span>
                  </div>
                  <p className="text-xs text-slate-300">{aiAuditData.energia.equivalenciaEscolar}</p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-700/60">
                    <strong className="text-amber-400">Fuente citada:</strong> {aiAuditData.energia.fuenteOficial}
                  </div>
                </div>

              </div>

              {/* Pedagogical Analogy */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-1">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Analogía Pedagógica para Estudiantes:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aiAuditData.analogiaEscolar}
                </p>
              </div>

              {/* Tactical Advice for Competition */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Estrategia Táctica para la Competencia:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aiAuditData.consejoCompetencia}
                </p>
              </div>

              {/* List of Official Cited Sources */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                  Citas Bibliográficas y Fuentes de Factores (Requisito M5):
                </span>
                <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                  {aiAuditData.fuentesCitadas.map((src, idx) => (
                    <li key={idx} className="font-mono text-slate-300">
                      {src}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

        </div>

        {/* Footer Actions */}
        {aiAuditData && !isAiLoading && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80 gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Certificado</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado al Portapapeles!' : 'Copiar para Mural Escolar'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
