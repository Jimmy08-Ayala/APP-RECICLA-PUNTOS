export type MaterialId = 'plastico' | 'papel' | 'aluminio' | 'vidrio' | 'tetrapak' | 'raee';

export interface Material {
  id: MaterialId;
  name: string;
  category: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  pointsPerKg: number;
  factors: {
    treesPerKg: number;      // Árboles salvados por kg
    waterLitresPerKg: number; // Litros de agua ahorrados por kg
    co2KgPerKg: number;       // Kg de CO2e evitados por kg
    energyKwhPerKg: number;   // kWh de energía eléctrica ahorrada por kg
  };
  sources: {
    trees: string;
    water: string;
    co2: string;
    energy: string;
    primarySource: string;
  };
  description: string;
  examples: string;
}

export interface Section {
  id: string;
  code: string;           // ej: "1A", "3B"
  name: string;           // ej: "1º Sección A"
  grade: string;          // ej: "1º Año"
  group: string;          // ej: "A"
  mascot: string;         // ej: "🦅 Águilas Verdes"
  color: string;          // hex or tailwind class
  avatar: string;         // emoji or symbol
  slogan: string;
  advisor?: string;       // Profesor tutor
}

export interface RecyclingEntry {
  id: string;
  sectionId: string;
  materialId: MaterialId;
  kilos: number;
  points: number;
  timestamp: number;     // Epoch ms
  formattedDate: string;  // ej: "01 Oct 2026, 10:30"
  registeredBy?: string; // ej: "Prof. Ramírez" o "Alumno Eco"
  notes?: string;
}

export interface MonthlyGoal {
  monthName: string;      // ej: "Octubre 2026"
  targetKilos: number;    // ej: 1500
  year: number;
  monthIndex: number;     // 0 - 11
  schoolName: string;
}

export interface SectionStats {
  section: Section;
  totalKilos: number;
  totalPoints: number;
  materialKilos: Record<MaterialId, number>;
  materialPoints: Record<MaterialId, number>;
  entriesCount: number;
  rank: number;
  previousRank?: number;
  trend: 'up' | 'down' | 'same';
  percentageOfTotal: number;
}

export interface EcologicalImpact {
  totalKilos: number;
  totalPoints: number;
  treesSaved: number;
  waterSavedLitres: number;
  co2PreventedKg: number;
  energySavedKwh: number;
  smartphoneCharges: number;
  ledBulbHours: number;
}

export interface AiAuditReport {
  tituloDictamen: string;
  arboles: {
    cantidad: number;
    descripcion: string;
    factorUsado: string;
    fuenteOficial: string;
  };
  agua: {
    cantidadLitros: number;
    descripcion: string;
    factorUsado: string;
    fuenteOficial: string;
  };
  co2: {
    kgCO2e: number;
    descripcion: string;
    factorUsado: string;
    fuenteOficial: string;
  };
  energia: {
    kwhAhorrados: number;
    equivalenciaEscolar: string;
    fuenteOficial: string;
  };
  analogiaEscolar: string;
  consejoCompetencia: string;
  insigniaOtorgada: string;
  fuentesCitadas: string[];
  generatedAt: string;
  sectionName?: string;
}
