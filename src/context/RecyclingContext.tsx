import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Section,
  RecyclingEntry,
  MonthlyGoal,
  SectionStats,
  MaterialId,
  EcologicalImpact,
  AiAuditReport,
} from '../types';
import {
  INITIAL_SECTIONS,
  INITIAL_ENTRIES,
  INITIAL_MONTHLY_GOAL,
} from '../constants/initialData';
import { RECYCLING_MATERIALS } from '../constants/materials';
import { calculateEcologicalImpact } from '../utils/equivalences';
import { sounds } from '../utils/audio';
import { requestAiEquivalencies } from '../services/geminiService';

interface AddEntryParams {
  sectionId: string;
  materialId: MaterialId;
  kilos: number;
  registeredBy?: string;
  notes?: string;
}

interface RecyclingContextType {
  sections: Section[];
  entries: RecyclingEntry[];
  monthlyGoal: MonthlyGoal;
  sectionStats: SectionStats[];
  totalInstituteKilos: number;
  totalInstitutePoints: number;
  goalPercentage: number;
  ecologicalImpact: EcologicalImpact;
  
  // Modals & UI Controls
  isRegisterOpen: boolean;
  setIsRegisterOpen: (open: boolean) => void;
  preselectedSectionId?: string;
  setPreselectedSectionId: (id?: string) => void;
  
  isAiAuditOpen: boolean;
  setIsAiAuditOpen: (open: boolean) => void;
  aiAuditData: AiAuditReport | null;
  isAiLoading: boolean;
  generateAiAudit: (section?: Section) => Promise<void>;

  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;

  selectedSectionForDetail: Section | null;
  setSelectedSectionForDetail: (sec: Section | null) => void;

  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;

  isVersusOpen: boolean;
  setIsVersusOpen: (open: boolean) => void;

  notification: { type: 'success' | 'error' | 'info'; text: string } | null;
  setNotification: (notif: { type: 'success' | 'error' | 'info'; text: string } | null) => void;
  showNotification: (text: string, type?: 'success' | 'error' | 'info') => void;

  // Actions
  addEntry: (params: AddEntryParams) => void;
  deleteEntry: (id: string) => void;
  updateMonthlyGoal: (newGoal: Partial<MonthlyGoal>) => void;
  addSection: (newSection: Omit<Section, 'id'>) => void;
  resetToDefaultData: () => void;
  clearAllData: () => void;
  exportDataJson: () => void;
  importDataJson: (jsonString: string) => { success: boolean; error?: string; count?: number };
}

const RecyclingContext = createContext<RecyclingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SECTIONS: 'reciclapuntos_sections_v2',
  ENTRIES: 'reciclapuntos_entries_v2',
  GOAL: 'reciclapuntos_goal_v2',
};

export const RecyclingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from LocalStorage or initialize with seed data
  const [sections, setSections] = useState<Section[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECTIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_SECTIONS;
  });

  const [entries, setEntries] = useState<RecyclingEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_ENTRIES;
  });

  const [monthlyGoal, setMonthlyGoal] = useState<MonthlyGoal>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOAL);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_MONTHLY_GOAL;
  });

  // UI state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [preselectedSectionId, setPreselectedSectionId] = useState<string | undefined>(undefined);
  const [isAiAuditOpen, setIsAiAuditOpen] = useState(false);
  const [aiAuditData, setAiAuditData] = useState<AiAuditReport | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedSectionForDetail, setSelectedSectionForDetail] = useState<Section | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isVersusOpen, setIsVersusOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showNotification = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ type, text });
  }, []);

  // Auto-dismiss notification after 4.5 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification]);

  // Sync with LocalStorage without blocking rendering
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
    } catch (e) {
      console.error('Storage error for sections:', e);
    }
  }, [sections]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    } catch (e) {
      console.error('Storage error for entries:', e);
    }
  }, [entries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOAL, JSON.stringify(monthlyGoal));
    } catch (e) {
      console.error('Storage error for goal:', e);
    }
  }, [monthlyGoal]);

  // High performance memoized statistics & leaderboard computation
  const { sectionStats, totalInstituteKilos, totalInstitutePoints, goalPercentage } = useMemo(() => {
    let grandKilos = 0;
    let grandPoints = 0;

    // Initialize map for all sections
    const statsMap: Record<string, {
      kilos: number;
      points: number;
      materialKilos: Record<MaterialId, number>;
      materialPoints: Record<MaterialId, number>;
      entriesCount: number;
    }> = {};

    sections.forEach((s) => {
      statsMap[s.id] = {
        kilos: 0,
        points: 0,
        materialKilos: {
          plastico: 0,
          papel: 0,
          aluminio: 0,
          vidrio: 0,
          tetrapak: 0,
          raee: 0,
        },
        materialPoints: {
          plastico: 0,
          papel: 0,
          aluminio: 0,
          vidrio: 0,
          tetrapak: 0,
          raee: 0,
        },
        entriesCount: 0,
      };
    });

    entries.forEach((e) => {
      grandKilos += e.kilos;
      grandPoints += e.points;

      if (!statsMap[e.sectionId]) {
        statsMap[e.sectionId] = {
          kilos: 0,
          points: 0,
          materialKilos: { plastico: 0, papel: 0, aluminio: 0, vidrio: 0, tetrapak: 0, raee: 0 },
          materialPoints: { plastico: 0, papel: 0, aluminio: 0, vidrio: 0, tetrapak: 0, raee: 0 },
          entriesCount: 0,
        };
      }

      const item = statsMap[e.sectionId];
      item.kilos += e.kilos;
      item.points += e.points;
      item.entriesCount += 1;
      if (item.materialKilos[e.materialId] !== undefined) {
        item.materialKilos[e.materialId] += e.kilos;
        item.materialPoints[e.materialId] += e.points;
      }
    });

    // Convert to array and sort by total points (primary) and kilos (secondary)
    const list: SectionStats[] = sections.map((sec) => {
      const data = statsMap[sec.id] || {
        kilos: 0,
        points: 0,
        materialKilos: { plastico: 0, papel: 0, aluminio: 0, vidrio: 0, tetrapak: 0, raee: 0 },
        materialPoints: { plastico: 0, papel: 0, aluminio: 0, vidrio: 0, tetrapak: 0, raee: 0 },
        entriesCount: 0,
      };

      const percentageOfTotal = grandPoints > 0 ? (data.points / grandPoints) * 100 : 0;

      return {
        section: sec,
        totalKilos: Number(data.kilos.toFixed(1)),
        totalPoints: data.points,
        materialKilos: data.materialKilos,
        materialPoints: data.materialPoints,
        entriesCount: data.entriesCount,
        rank: 1, // Will be set after sorting
        trend: 'same',
        percentageOfTotal: Number(percentageOfTotal.toFixed(1)),
      };
    });

    list.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return b.totalKilos - a.totalKilos;
    });

    // Assign final ranks and dynamic trend
    list.forEach((item, index) => {
      item.rank = index + 1;
      // Simulated trend: top 3 have momentum
      if (item.rank === 1) item.trend = 'up';
      else if (item.rank === 2) item.trend = 'up';
      else if (item.rank >= list.length - 1) item.trend = 'down';
      else item.trend = 'same';
    });

    const progress = monthlyGoal.targetKilos > 0 ? (grandKilos / monthlyGoal.targetKilos) * 100 : 0;

    return {
      sectionStats: list,
      totalInstituteKilos: Number(grandKilos.toFixed(1)),
      totalInstitutePoints: grandPoints,
      goalPercentage: Number(progress.toFixed(1)),
    };
  }, [sections, entries, monthlyGoal.targetKilos]);

  // Ecological impact instantaneous calculation
  const ecologicalImpact = useMemo(() => {
    return calculateEcologicalImpact(entries);
  }, [entries]);

  // Action: Add new recycling delivery entry
  const addEntry = useCallback((params: AddEntryParams) => {
    const { sectionId, materialId, kilos, registeredBy, notes } = params;
    const material = RECYCLING_MATERIALS[materialId];
    if (!material || kilos <= 0) return;

    const points = Math.round(kilos * material.pointsPerKg);
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

    const newEntry: RecyclingEntry = {
      id: `ent-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sectionId,
      materialId,
      kilos: Number(kilos.toFixed(1)),
      points,
      timestamp: Date.now(),
      formattedDate,
      registeredBy: registeredBy?.trim() || 'Delegado Ecológico',
      notes: notes?.trim() || undefined,
    };

    setEntries((prev) => [newEntry, ...prev]);

    // User-friendly feedback message in plain Spanish
    showNotification(`¡Registro exitoso! Sumaste ${kilos} kg (${points} puntos) para ${sections.find((s) => s.id === sectionId)?.code || 'tu sección'}.`, 'success');

    // Audio & sensory feedback (zero lag)
    sounds.playSuccessChime();

    // Trigger celebratory confetti blast
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#84cc16'],
      });
    } catch {
      // Confetti fail-safe
    }
  }, []);

  // Action: Delete entry
  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    showNotification('Registro de entrega eliminado correctamente.', 'info');
  }, [showNotification]);

  // Action: Update monthly goal
  const updateMonthlyGoal = useCallback((newGoal: Partial<MonthlyGoal>) => {
    setMonthlyGoal((prev) => ({ ...prev, ...newGoal }));
    showNotification('Meta mensual actualizada correctamente.', 'success');
  }, [showNotification]);

  // Action: Add new section
  const addSection = useCallback((newSecData: Omit<Section, 'id'>) => {
    const id = `sec-${Date.now().toString(36)}`;
    const newSection: Section = {
      ...newSecData,
      id,
    };
    setSections((prev) => [...prev, newSection]);
    showNotification(`Nueva sección ${newSection.code} agregada a la competencia.`, 'success');
  }, [showNotification]);

  // Action: Reset to defaults
  const resetToDefaultData = useCallback(() => {
    if (window.confirm('¿Restablecer datos originales de prueba de la competencia?')) {
      setSections(INITIAL_SECTIONS);
      setEntries(INITIAL_ENTRIES);
      setMonthlyGoal(INITIAL_MONTHLY_GOAL);
      localStorage.removeItem(STORAGE_KEYS.SECTIONS);
      localStorage.removeItem(STORAGE_KEYS.ENTRIES);
      localStorage.removeItem(STORAGE_KEYS.GOAL);
      showNotification('Datos de prueba originales restaurados.', 'info');
    }
  }, [showNotification]);

  // Action: Export data as JSON file
  const exportDataJson = useCallback(() => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      schoolName: monthlyGoal.schoolName,
      monthlyGoal,
      sections,
      entries,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ReciclaPuntos-${monthlyGoal.monthName.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Archivo de respaldo descargado correctamente.', 'success');
  }, [monthlyGoal, sections, entries, showNotification]);

  // Action: Import data from JSON file
  const importDataJson = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data.entries) || !Array.isArray(data.sections)) {
        throw new Error('El archivo no contiene la lista de secciones o entregas requerida.');
      }
      setSections(data.sections);
      setEntries(data.entries);
      if (data.monthlyGoal) {
        setMonthlyGoal(data.monthlyGoal);
      }
      sounds.playSuccessChime();
      showNotification(`¡Copia de seguridad restaurada con éxito! Se cargaron ${data.entries.length} entregas.`, 'success');
      return { success: true, count: data.entries.length };
    } catch (err: any) {
      console.error('Error importando datos:', err);
      const friendlyErr = 'No se pudo leer el archivo. Asegúrate de que sea un respaldo válido generado por la app.';
      showNotification(friendlyErr, 'error');
      return { success: false, error: friendlyErr };
    }
  }, [showNotification]);

  // Action: Clear all entries to 0 (borrar todos los datos)
  const clearAllData = useCallback(() => {
    if (window.confirm('¿Estás seguro de que deseas BORRAR TODOS los registros de reciclaje? El contador volverá a 0 kg.')) {
      setEntries([]);
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify([]));
      sounds.playTick();
      showNotification('Todos los registros fueron borrados. El marcador está en cero.', 'info');
    }
  }, [showNotification]);

  // AI Audit trigger with Gemini 3.8 Flash
  const generateAiAudit = useCallback(async (section?: Section) => {
    setIsAiLoading(true);
    setIsAiAuditOpen(true);
    try {
      const relevantEntries = section ? entries.filter((e) => e.sectionId === section.id) : entries;
      const report = await requestAiEquivalencies({
        section,
        entries: relevantEntries,
        monthName: monthlyGoal.monthName,
        goalProgress: goalPercentage,
      });
      setAiAuditData(report);
      sounds.playTrophyFanfare();
    } catch (err) {
      console.error('Error generating AI audit:', err);
    } finally {
      setIsAiLoading(false);
    }
  }, [entries, monthlyGoal.monthName, goalPercentage]);

  return (
    <RecyclingContext.Provider
      value={{
        sections,
        entries,
        monthlyGoal,
        sectionStats,
        totalInstituteKilos,
        totalInstitutePoints,
        goalPercentage,
        ecologicalImpact,
        isRegisterOpen,
        setIsRegisterOpen,
        preselectedSectionId,
        setPreselectedSectionId,
        isAiAuditOpen,
        setIsAiAuditOpen,
        aiAuditData,
        isAiLoading,
        generateAiAudit,
        isHistoryOpen,
        setIsHistoryOpen,
        selectedSectionForDetail,
        setSelectedSectionForDetail,
        isGoalModalOpen,
        setIsGoalModalOpen,
        isVersusOpen,
        setIsVersusOpen,
        notification,
        setNotification,
        showNotification,
        addEntry,
        deleteEntry,
        updateMonthlyGoal,
        addSection,
        resetToDefaultData,
        clearAllData,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </RecyclingContext.Provider>
  );
};

export const useRecycling = (): RecyclingContextType => {
  const context = useContext(RecyclingContext);
  if (!context) {
    throw new Error('useRecycling debe usarse dentro de un RecyclingProvider');
  }
  return context;
};
