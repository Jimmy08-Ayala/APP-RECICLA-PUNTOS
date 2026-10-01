import React, { useState } from 'react';
import {
  Sparkles,
  TreePine,
  Droplets,
  CloudSun,
  Zap,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Lightbulb,
} from 'lucide-react';
import { useRecycling } from '../context/RecyclingContext';
import { sounds } from '../utils/audio';

export const AiImpactSeal: React.FC = () => {
  const { ecologicalImpact, generateAiAudit, isAiLoading, totalInstituteKilos } = useRecycling();
  const [showSources, setShowSources] = useState(false);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/30 border border-teal-500/30 p-6 sm:p-8 shadow-xl shadow-teal-950/20 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with M5 Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-teal-400 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sello de IA Verificado (M5)
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Cálculo científico de equivalencias tangibles
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Impacto Ecológico Real en el Planeta
            </h3>
            <p className="text-sm text-slate-400">
              La IA transforma los <strong className="text-emerald-400 font-mono">{totalInstituteKilos} kg</strong> recolectados en indicadores comprensibles citando los factores de modelos internacionales.
            </p>
          </div>
        </div>

        {/* Generate AI Deep Audit Button (Gemini 3.8 Flash) */}
        <div className="flex-shrink-0">
          <button
            onClick={() => {
              sounds.playTick();
              generateAiAudit();
            }}
            disabled={isAiLoading}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isAiLoading ? 'Auditando con Gemini 3.8...' : 'Dictamen Oficial con IA'}</span>
          </button>
        </div>
      </div>

      {/* Main 4 Ecological Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        
        {/* Card 1: Árboles Salvados */}
        <div className="relative group rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 p-5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TreePine className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Preservación Forestal
            </span>
          </div>

          <div className="text-3xl font-black text-white font-mono mb-1">
            {ecologicalImpact.treesSaved} <span className="text-lg font-normal text-emerald-400">árboles</span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Árboles adultos protegidos de la tala industrial de celulosa y madera.
          </p>

          <div className="mt-3 pt-3 border-t border-slate-700/60 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-emerald-400/90">Fuente: EPA WARM v16</span>
            <span className="text-slate-400 font-mono">0.017 arb/kg papel</span>
          </div>
        </div>

        {/* Card 2: Litros de Agua Preservados */}
        <div className="relative group rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 p-5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Ahorro Hídrico
            </span>
          </div>

          <div className="text-3xl font-black text-white font-mono mb-1">
            {ecologicalImpact.waterSavedLitres.toLocaleString('es-ES')} <span className="text-lg font-normal text-sky-400">L</span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Agua potable ahorrada en procesos industriales de lavado y pulpa.
          </p>

          <div className="mt-3 pt-3 border-t border-slate-700/60 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-sky-400/90">Fuente: Water Footprint Net.</span>
            <span className="text-slate-400 font-mono">26 L/kg papel, 24.5 L/PET</span>
          </div>
        </div>

        {/* Card 3: Kg de CO2e Evitados */}
        <div className="relative group rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 p-5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <CloudSun className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Huella de Carbono
            </span>
          </div>

          <div className="text-3xl font-black text-white font-mono mb-1">
            {ecologicalImpact.co2PreventedKg.toLocaleString('es-ES')} <span className="text-lg font-normal text-teal-400">kg CO2e</span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Emisiones de gases de efecto invernadero prevenidas en vertederos.
          </p>

          <div className="mt-3 pt-3 border-t border-slate-700/60 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-teal-400/90">Fuente: IPCC & EPA WARM</span>
            <span className="text-slate-400 font-mono">9.13 kg CO2/kg Al</span>
          </div>
        </div>

        {/* Card 4: Energía y Equivalencias Tangibles */}
        <div className="relative group rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 p-5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Energía Eléctrica
            </span>
          </div>

          <div className="text-3xl font-black text-white font-mono mb-1">
            {ecologicalImpact.energySavedKwh.toLocaleString('es-ES')} <span className="text-lg font-normal text-amber-400">kWh</span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Electricidad limpia preservada en la red energética.
          </p>

          <div className="mt-3 pt-3 border-t border-slate-700/60 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-amber-400/90">Fuente: US EIA & IAI</span>
            <span className="text-slate-400 font-mono">95% ahorro en latas</span>
          </div>
        </div>

      </div>

      {/* Tangible School Comparisons Banner */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-300">
              Equivale a <strong className="text-amber-300 font-mono">{ecologicalImpact.ledBulbHours.toLocaleString('es-ES')} hrs</strong> de bombillas LED en aulas
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-sky-400" />
            <span className="text-xs text-slate-300">
              o a <strong className="text-sky-300 font-mono">{ecologicalImpact.smartphoneCharges.toLocaleString('es-ES')}</strong> recargas completas de celulares
            </span>
          </div>

        </div>

        {/* Toggle Detailed Scientific Sources */}
        <button
          onClick={() => {
            sounds.playTick();
            setShowSources(!showSources);
          }}
          className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 ml-auto"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{showSources ? 'Ocultar fuentes oficiales' : 'Ver fuentes citadas del factor'}</span>
          {showSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Scientific Sources Panel */}
      {showSources && (
        <div className="mt-4 p-5 rounded-2xl bg-slate-950/80 border border-teal-500/20 text-xs text-slate-300 space-y-2 animate-fadeIn">
          <div className="font-bold text-teal-300 flex items-center gap-2 text-sm mb-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Metodología Científica y Citas de Factores (Requisito M5):
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400">
            <li>
              <strong className="text-slate-200">Árboles (0.017 árboles/kg papel y cartón):</strong> Fuente oficial: <em>US Environmental Protection Agency (EPA) - Waste Reduction Model (WARM v16, 2023)</em> y <em>US Forest Service</em>. Certifica que 1 tonelada corta de papel reciclado previene la tala de 17 árboles maduros de pulpa de 12 metros de altura.
            </li>
            <li>
              <strong className="text-slate-200">Agua (26 L/kg papel, 24.5 L/kg PET, 14 L/kg aluminio):</strong> Fuente oficial: <em>Water Footprint Network (Assessment Standard por Prof. Arjen Hoekstra)</em> y <em>The Association of Plastic Recyclers (APR)</em>.
            </li>
            <li>
              <strong className="text-slate-200">Gases de Efecto Invernadero (9.13 kg CO2e/kg aluminio, 1.53 kg/kg PET, 0.94 kg/kg cartón):</strong> Fuente oficial: <em>IPCC 2006/2019 Guidelines for National Greenhouse Gas Inventories</em> y <em>The Aluminum Association Life Cycle Study</em>.
            </li>
            <li>
              <strong className="text-slate-200">Energía Eléctrica (14 kWh/kg aluminio, 5.6 kWh/kg plástico):</strong> Fuente oficial: <em>US Energy Information Administration (EIA)</em> y <em>International Aluminium Institute (IAI)</em>. Reciclar aluminio utiliza sólo el 5% de la energía necesaria para extraerlo del mineral de bauxita.
            </li>
          </ul>
        </div>
      )}

    </div>
  );
};
