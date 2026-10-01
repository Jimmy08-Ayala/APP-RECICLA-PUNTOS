/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RecyclingProvider, useRecycling } from './context/RecyclingContext';
import { Navbar } from './components/Navbar';
import { MonthlyGoalCard } from './components/MonthlyGoalCard';
import { AiImpactSeal } from './components/AiImpactSeal';
import { Leaderboard } from './components/Leaderboard';
import { MaterialGuideCard } from './components/MaterialGuideCard';
import { RegisterModal } from './components/RegisterModal';
import { AiAuditModal } from './components/AiAuditModal';
import { HistoryModal } from './components/HistoryModal';
import { SectionDetailModal } from './components/SectionDetailModal';
import { VersusModal } from './components/VersusModal';
import { GoalConfigModal } from './components/GoalConfigModal';
import {
  Recycle,
  PlusCircle,
  Sparkles,
  Trophy,
  History,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import { sounds } from './utils/audio';

function DashboardContent() {
  const { setIsRegisterOpen, totalInstituteKilos, totalInstitutePoints, monthlyGoal } = useRecycling();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        
        {/* 1. Monthly Goal with Progress Bar (P0 + M1 Requirement) */}
        <section aria-label="Meta Mensual">
          <MonthlyGoalCard />
        </section>

        {/* 2. Sello de IA con Equivalencias Tangibles y Fuentes Científicas (M5 Requirement) */}
        <section aria-label="Sello de IA e Impacto Ambiental">
          <AiImpactSeal />
        </section>

        {/* 3. Tabla de Posiciones y Podio entre Secciones (P0 + M1 Requirement) */}
        <section aria-label="Tabla de Posiciones y Ranking">
          <Leaderboard />
        </section>

        {/* 4. Guía de Materiales y Factores Científicos */}
        <section aria-label="Guía de Clasificación de Materiales">
          <MaterialGuideCard />
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Recycle className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-300">ReciclaPuntos</span>
            <span>• Categoría: Ambiente • {monthlyGoal.schoolName}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Sello IA: Modelos EPA WARM v16 & UNEP</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">100% Fluido y Optimizado</span>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for Mobile screens */}
      <div className="sm:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => {
            sounds.playTick();
            setIsRegisterOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-black shadow-2xl shadow-emerald-500/50 active:scale-95 transition-all text-sm"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ Kilos</span>
        </button>
      </div>

      {/* Modals */}
      <RegisterModal />
      <AiAuditModal />
      <HistoryModal />
      <SectionDetailModal />
      <VersusModal />
      <GoalConfigModal />
    </div>
  );
}

export default function App() {
  return (
    <RecyclingProvider>
      <DashboardContent />
    </RecyclingProvider>
  );
}
