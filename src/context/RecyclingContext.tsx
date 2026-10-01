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
  // Load state from LocalStorage or initialize with seed data (Defensive against corrupted storage)
  const [sections, setSections] = useState<Section[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_SECTIONS;
  });

  const [entries, setEntries] = useState<RecyclingEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((e) => e && typeof e === 'object' && e.sectionId && e.materialId);
          if (valid.length > 0) return valid;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_ENTRIES;
  });

  const [monthlyGoal, setMonthlyGoal] = useState<MonthlyGoal>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOAL);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && typeof parsed.targetKilos === 'number') {
          return parsed;
        }
      }
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

    const safeSections = Array.isArray(sections) && sections.length > 0 ? sections : INITIAL_SECTIONS;
    const safeEntries = Array.isArray(entries) ? entries : INITIAL_ENTRIES;

    // Initialize map for all sections
    const statsMap: Record<string, {
      kilos: number;
      points: number;
      materialKilos: Record<MaterialId, number>;
      materialPoints: Record<MaterialId, number>;
      entriesCount: number;
    }> = {};

    safeSections.forEach((s) => {
      if (!s || !s.id) return;
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

    safeEntries.forEach((e) => {
      if (!e || !e.sectionId) return;
      const kilos = Number(e.kilos) || 0;
      const points = Number(e.points) || 0;
      grandKilos += kilos;
      grandPoints += points;

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
      item.kilos += kilos;
      item.points += points;
      item.entriesCount += 1;
      if (item.materialKilos[e.materialId] !== undefined) {
        item.materialKilos[e.materialId] += kilos;
        item.materialPoints[e.materialId] += points;
      }
    });

    // Convert to array and sort by total points (primary) and kilos (secondary)
    const list: SectionStats[] = safeSections.map((sec) => {
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
    if (entries.length === 0 || window.confirm('¿Cargar datos de prueba de la competencia?')) {
      setSections(INITIAL_SECTIONS);
      setEntries(INITIAL_ENTRIES);
      setMonthlyGoal(INITIAL_MONTHLY_GOAL);
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(INITIAL_SECTIONS));
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(INITIAL_ENTRIES));
      localStorage.setItem(STORAGE_KEYS.GOAL, JSON.stringify(INITIAL_MONTHLY_GOAL));
      sounds.playSuccessChime();
      showNotification('¡Datos de prueba cargados con éxito! Entregas listas en el historial.', 'success');
    }
  }, [entries.length, showNotification]);

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
      if (!jsonString || typeof jsonString !== 'string') {
        throw new Error('El contenido del archivo está vacío.');
      }
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        throw new Error('El archivo no tiene una estructura JSON válida.');
      }
      if (!Array.isArray(data.sections) || data.sections.length === 0) {
        throw new Error('El archivo debe contener la lista de secciones participantes.');
      }

      // Sanitize sections
      const validSections = data.sections.filter(
        (s: any) => s && typeof s.id === 'string' && typeof s.code === 'string'
      );
      if (validSections.length === 0) {
        throw new Error('No se encontraron secciones válidas en el archivo.');
      }

      // Sanitize entries
      const validEntries: RecyclingEntry[] = (Array.isArray(data.entries) ? data.entries : [])
        .filter((e: any) => {
          return (
            e &&
            typeof e.sectionId === 'string' &&
            typeof e.materialId === 'string' &&
            RECYCLING_MATERIALS[e.materialId as MaterialId] !== undefined &&
            typeof e.kilos === 'number' &&
            isFinite(e.kilos) &&
            e.kilos > 0
          );
        })
        .map((e: any) => ({
          id: String(e.id || `ent-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
          sectionId: String(e.sectionId),
          materialId: e.materialId as MaterialId,
          kilos: Number(Number(e.kilos).toFixed(1)),
          points: Number(e.points) || Math.round(Number(e.kilos) * (RECYCLING_MATERIALS[e.materialId as MaterialId]?.pointsPerKg || 10)),
          timestamp: typeof e.timestamp === 'number' ? e.timestamp : Date.now(),
          formattedDate: typeof e.formattedDate === 'string' ? e.formattedDate : new Date().toLocaleDateString('es-ES'),
          registeredBy: typeof e.registeredBy === 'string' ? e.registeredBy.slice(0, 60) : undefined,
          notes: typeof e.notes === 'string' ? e.notes.slice(0, 140) : undefined,
        }));

      setSections(validSections);
      setEntries(validEntries);
      if (data.monthlyGoal && typeof data.monthlyGoal === 'object') {
        setMonthlyGoal({
          ...monthlyGoal,
          ...data.monthlyGoal,
          targetKilos: Math.max(50, Number(data.monthlyGoal.targetKilos) || 1200),
        });
      }
      sounds.playSuccessChime();
      showNotification(`¡Copia de seguridad restaurada con éxito! Se cargaron ${validEntries.length} entregas válidas.`, 'success');
      return { success: true, count: validEntries.length };
    } catch (err: any) {
      console.error('Error importando datos:', err);
      const friendlyErr = err?.message || 'No se pudo leer el archivo. Asegúrate de que sea un respaldo válido generado por la app.';
      showNotification(friendlyErr, 'error');
      return { success: false, error: friendlyErr };
    }
  }, [monthlyGoal, showNotification]);

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
