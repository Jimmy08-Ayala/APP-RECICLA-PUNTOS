import { EcologicalImpact, MaterialId, RecyclingEntry } from '../types';
import { RECYCLING_MATERIALS } from '../constants/materials';

export function calculateEcologicalImpact(entries: RecyclingEntry[]): EcologicalImpact {
  let totalKilos = 0;
  let totalPoints = 0;
  let treesSaved = 0;
  let waterSavedLitres = 0;
  let co2PreventedKg = 0;
  let energySavedKwh = 0;

  for (const entry of entries) {
    const material = RECYCLING_MATERIALS[entry.materialId];
    if (!material) continue;

    totalKilos += entry.kilos;
    totalPoints += entry.points;

    treesSaved += entry.kilos * material.factors.treesPerKg;
    waterSavedLitres += entry.kilos * material.factors.waterLitresPerKg;
    co2PreventedKg += entry.kilos * material.factors.co2KgPerKg;
    energySavedKwh += entry.kilos * material.factors.energyKwhPerKg;
  }

  // 1 smartphone charge is approx 0.015 kWh (15 Wh)
  const smartphoneCharges = Math.round(energySavedKwh / 0.015);

  // 1 classroom LED bulb is approx 10W (0.01 kWh/hour)
  const ledBulbHours = Math.round(energySavedKwh / 0.01);

  return {
    totalKilos: Number(totalKilos.toFixed(1)),
    totalPoints,
    treesSaved: Number(treesSaved.toFixed(2)),
    waterSavedLitres: Math.round(waterSavedLitres),
    co2PreventedKg: Number(co2PreventedKg.toFixed(1)),
    energySavedKwh: Number(energySavedKwh.toFixed(1)),
    smartphoneCharges,
    ledBulbHours,
  };
}

export function calculateSingleEntryImpact(materialId: MaterialId, kilos: number): {
  trees: number;
  waterLitres: number;
  co2Kg: number;
  energyKwh: number;
  smartphoneCharges: number;
  sources: {
    trees: string;
    water: string;
    co2: string;
    energy: string;
  };
} {
  const mat = RECYCLING_MATERIALS[materialId];
  if (!mat) {
    return {
      trees: 0,
      waterLitres: 0,
      co2Kg: 0,
      energyKwh: 0,
      smartphoneCharges: 0,
      sources: { trees: '', water: '', co2: '', energy: '' },
    };
  }

  const trees = Number((kilos * mat.factors.treesPerKg).toFixed(3));
  const waterLitres = Number((kilos * mat.factors.waterLitresPerKg).toFixed(1));
  const co2Kg = Number((kilos * mat.factors.co2KgPerKg).toFixed(2));
  const energyKwh = Number((kilos * mat.factors.energyKwhPerKg).toFixed(2));
  const smartphoneCharges = Math.round(energyKwh / 0.015);

  return {
    trees,
    waterLitres,
    co2Kg,
    energyKwh,
    smartphoneCharges,
    sources: mat.sources,
  };
}
