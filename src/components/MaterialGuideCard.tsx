import React from 'react';
import {
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  TreePine,
  Droplets,
  CloudSun,
  Zap,
} from 'lucide-react';
import { MATERIALS_LIST } from '../constants/materials';

export const MaterialGuideCard: React.FC = () => {
  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Guía de Puntos y Clasificación
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Materiales Aceptados y Factores Certificados
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Conoce cuántos puntos gana tu sección por cada kilo entregado en el centro de acopio escolar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MATERIALS_LIST.map((mat) => {
          return (
            <div
              key={mat.id}
              className="p-5 rounded-2xl bg-slate-850 bg-slate-800/50 border border-slate-700/70 hover:border-slate-600 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-sm"
                      style={{ backgroundColor: mat.color }}
                    />
                    <h4 className="font-extrabold text-white text-sm">{mat.name}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-black font-mono bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    +{mat.pointsPerKg} pts/kg
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3">{mat.description}</p>
                
                <div className="text-[11px] text-slate-400 bg-slate-900/80 rounded-xl p-2.5 border border-slate-800 mb-3">
                  <strong className="text-slate-200">Aceptamos:</strong> {mat.examples}
                </div>
              </div>

              {/* Conversion Factor & Citation */}
              <div className="pt-3 border-t border-slate-700/60 text-[10px] space-y-1">
                <div className="text-emerald-400 font-semibold flex items-center justify-between">
                  <span>Factor de Impacto:</span>
                  <span className="text-slate-300 font-mono">
                    {mat.factors.co2KgPerKg} kg CO2e / kg
                  </span>
                </div>
                <div className="text-slate-400 truncate" title={mat.sources.primarySource}>
                  <strong className="text-slate-300">Fuente:</strong> {mat.sources.primarySource}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
