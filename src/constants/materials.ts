import { Material, MaterialId } from '../types';

export const RECYCLING_MATERIALS: Record<MaterialId, Material> = {
  plastico: {
    id: 'plastico',
    name: 'Plástico PET / PEAD',
    category: 'Polímeros',
    icon: 'Bottle',
    color: '#0284c7', // Sky 600
    bgColor: 'bg-sky-50 dark:bg-sky-950/40',
    borderColor: 'border-sky-300 dark:border-sky-800',
    textColor: 'text-sky-700 dark:text-sky-300',
    pointsPerKg: 15,
    factors: {
      treesPerKg: 0.0012, // Reducción de tala indirecta por packaging
      waterLitresPerKg: 24.5, // Litros de agua ahorrados vs manufactura virgen
      co2KgPerKg: 1.53, // Kg CO2e evitados
      energyKwhPerKg: 5.6, // kWh ahorrados por kg
    },
    sources: {
      trees: 'US Forest Service & LCA Packaging Index',
      water: 'Water Footprint Network & Association of Plastic Recyclers (APR)',
      co2: 'EPA WARM Version 16 (Plastics Module, 2023)',
      energy: 'US Department of Energy (DOE) - Industrial Efficiency Analysis',
      primarySource: 'EPA WARM v16 & Association of Plastic Recyclers (APR)',
    },
    description: 'Botellas de refresco, agua, envases de detergente y tapas plásticas limpias.',
    examples: 'PET 1, HDPE 2, tapas plásticas',
  },
  papel: {
    id: 'papel',
    name: 'Papel y Cartón',
    category: 'Fibras Celulósicas',
    icon: 'Layers',
    color: '#b45309', // Amber 700
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-300 dark:border-amber-800',
    textColor: 'text-amber-800 dark:text-amber-300',
    pointsPerKg: 10,
    factors: {
      treesPerKg: 0.017, // 1 tonelada de papel = 17 árboles adultos salvados (0.017 árboles/kg)
      waterLitresPerKg: 26.0, // Litros de agua ahorrados en blanqueamiento y pulpa
      co2KgPerKg: 0.94, // Kg CO2e evitados de descomposición en vertedero
      energyKwhPerKg: 4.1, // kWh de energía ahorrada
    },
    sources: {
      trees: 'US EPA & National Recycling Coalition (1 ton = 17 árboles de 12m)',
      water: 'Water Footprint of Paper Products (Hoekstra & Chapagain)',
      co2: 'EPA WARM Version 16 (Paper/Cardboard Submodel)',
      energy: 'Paper Recycling Coalition (60% ahorro energético vs pulpa virgen)',
      primarySource: 'US EPA WARM v16 & Food and Agriculture Organization (FAO)',
    },
    description: 'Cuadernos usados, hojas impresas, cajas de cartón corrugado, periódicos y libros.',
    examples: 'Hojas A4, cartón corrugado, carpetas',
  },
  aluminio: {
    id: 'aluminio',
    name: 'Latas de Aluminio',
    category: 'Metales No Ferrosos',
    icon: 'Package',
    color: '#e11d48', // Rose 600
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-300 dark:border-rose-800',
    textColor: 'text-rose-700 dark:text-rose-300',
    pointsPerKg: 30, // Alto valor ecológico (95% de ahorro de energía bauxita)
    factors: {
      treesPerKg: 0.0035, // Preservación de bosques afectados por minería de bauxita
      waterLitresPerKg: 14.0, // Ahorro de agua en refinamiento Bayer
      co2KgPerKg: 9.13, // 1 kg de aluminio reciclado evita 9.13 kg de CO2e!
      energyKwhPerKg: 14.0, // Ahorro descomunal de electricidad (95%)
    },
    sources: {
      trees: 'International Aluminium Institute (Mining Footprint Assessment)',
      water: 'UNEP Global Metals Flows Report',
      co2: 'The Aluminum Association & EPA WARM v16 (Aluminum Ingot Life-Cycle)',
      energy: 'US Energy Information Administration (EIA - Industrial Sector)',
      primarySource: 'The Aluminum Association & International Aluminium Institute (IAI)',
    },
    description: 'Latas de gaseosa, jugos, té y desodorantes de aluminio aplastadas.',
    examples: 'Latas de bebidas, envases de aluminio',
  },
  vidrio: {
    id: 'vidrio',
    name: 'Vidrio',
    category: 'Silicatos',
    icon: 'Wine',
    color: '#059669', // Emerald 600
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-300 dark:border-emerald-800',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    pointsPerKg: 8,
    factors: {
      treesPerKg: 0.0005,
      waterLitresPerKg: 5.2, // Ahorro en lavado y minería de sílice
      co2KgPerKg: 0.31, // Reducción de emisiones térmicas en hornos
      energyKwhPerKg: 1.2, // Reducción de punto de fusión de calcín
      },
    sources: {
      trees: 'European Container Glass Federation (FEVE Sustainability Report)',
      water: 'EPA WARM Version 16 (Glass Model)',
      co2: 'FEVE Glass Recycling Carbon Footprint Benchmark',
      energy: 'Glass Packaging Institute (GPI) Thermal Efficiency Study',
      primarySource: 'European Container Glass Federation (FEVE) & EPA WARM',
    },
    description: 'Botellas y frascos de vidrio limpios, sin tapas ni corchos.',
    examples: 'Frascos de mermelada, botellas de vidrio',
  },
  tetrapak: {
    id: 'tetrapak',
    name: 'Tetra Pak (Multicapa)',
    category: 'Envases Compuestos',
    icon: 'Box',
    color: '#d97706', // Amber 600
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/40',
    borderColor: 'border-yellow-300 dark:border-yellow-800',
    textColor: 'text-yellow-800 dark:text-yellow-300',
    pointsPerKg: 12,
    factors: {
      treesPerKg: 0.012, // Contiene 75% de cartón reciclable
      waterLitresPerKg: 18.0,
      co2KgPerKg: 0.78,
      energyKwhPerKg: 3.2,
    },
    sources: {
      trees: 'Alliance for Beverage Cartons and the Environment (ACE)',
      water: 'Tetra Pak Sustainability Report & Ecoinvent Database',
      co2: 'EPA WARM v16 & ACE Carbon Benchmark',
      energy: 'Fraunhofer Institute Life Cycle Assessment on Beverage Cartons',
      primarySource: 'Alliance for Beverage Cartons and the Environment (ACE)',
    },
    description: 'Cajas de leche, jugos y caldos aplastadas y enjuagadas.',
    examples: 'Cajas de leche de 1L, jugos individuales',
  },
  raee: {
    id: 'raee',
    name: 'Pilas y RAEE Escolar',
    category: 'Residuos Especiales',
    icon: 'Cpu',
    color: '#7c3aed', // Violet 600
    bgColor: 'bg-violet-50 dark:bg-violet-950/40',
    borderColor: 'border-violet-300 dark:border-violet-800',
    textColor: 'text-violet-700 dark:text-violet-300',
    pointsPerKg: 50, // Muy alta prioridad ambiental por toxicidad
    factors: {
      treesPerKg: 0.005,
      waterLitresPerKg: 120.0, // 1 pila puede contaminar hasta 3,000L si llega a mantos freáticos!
      co2KgPerKg: 4.8, // Recuperación de metales estratégicos (litio, cobalto, cobre)
      energyKwhPerKg: 8.5,
    },
    sources: {
      trees: 'Global E-waste Monitor (UNITAR / ITU / UNEP)',
      water: 'PNUMA / UNEP Water Toxicological Protection Standard',
      co2: 'Basel Convention Technical Guidelines on E-Waste',
      energy: 'WEEE Forum LCA Benchmark for Secondary Raw Materials',
      primarySource: 'UNITAR / ITU Global E-waste Statistics & UNEP',
    },
    description: 'Pilas alcalinas gastadas, cables dañados, cargadores viejos y teclados rotos.',
    examples: 'Pilas AA/AAA, cables USB, mouse descompuesto',
  },
};

export const MATERIALS_LIST = Object.values(RECYCLING_MATERIALS);
