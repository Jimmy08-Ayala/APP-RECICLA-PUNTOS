import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '5mb' }));

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'ReciclaPuntos API', timestamp: new Date().toISOString() });
  });

  // AI Equivalence & Sostenibilidad endpoint using Gemini 3.8 Flash
  app.post('/api/ai-equivalencias', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY no configurada en las variables de entorno.',
        });
      }

      const { section, materialsBreakdown, totalKg, goalProgress, month } = req.body;

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Eres un auditor científico ambiental y especialista en pedagogía de sostenibilidad para el programa escolar "ReciclaPuntos".
Analiza los datos de reciclaje recolectados por las secciones del instituto:
- Mes de competencia: ${month || 'Mes en curso'}
- Sección evaluada: ${section || 'General de todo el Instituto'}
- Total kilos recolectados: ${totalKg || 0} kg
- Avance de la meta mensual: ${goalProgress || 0}%
- Desglose por materiales (en kg):
${JSON.stringify(materialsBreakdown || {}, null, 2)}

Requisitos obligatorios (Sello de IA con Fuentes Científicas Certificadas):
1. Convierte los kilos recolectados a equivalentes tangibles y de fácil comprensión para estudiantes y docentes:
   - Árboles salvados (madera/celulosa evitada mediante papel y cartón reciclado).
   - Litros de agua potable ahorrados (ahorro en procesos de manufactura virgen vs reciclada).
   - Kilogramos de CO2e evitados (gases de efecto invernadero).
   - Kilovatios-hora (kWh) de energía eléctrica ahorrada y su equivalencia escolar (ej: días de iluminación de aulas o horas de computadoras).
2. CITA OBLIGATORIA DE FUENTES: Para cada factor de conversión debes citar rigurosamente el organismo oficial, reporte o modelo científico específico (ej: US EPA Waste Reduction Model - WARM v16 (2023), PNUMA / UNEP Global Waste Management Outlook, Water Footprint Network, FAO Forestry Paper, European Environment Agency).
3. Redacta una analogía o dato de impacto visual adaptado a la vida estudiantil (ej: "equivale a llenar X botellas escolares", "evita la tala de un árbol que da sombra a una cancha").
4. Genera un consejo táctico motivacional para que la sección aumente su puntaje en la tabla de posiciones.

Responde ÚNICAMENTE en JSON válido con este esquema:
{
  "tituloDictamen": "string con título oficial",
  "arboles": {
    "cantidad": number,
    "descripcion": "string (ej: 4.8 árboles adultos salvados de la tala)",
    "factorUsado": "string (ej: 0.017 árboles por kg de papel/cartón)",
    "fuenteOficial": "string (ej: EPA WARM v16 y US Forest Service)"
  },
  "agua": {
    "cantidadLitros": number,
    "descripcion": "string (ej: 14,200 litros de agua preservados)",
    "factorUsado": "string con detalle por material",
    "fuenteOficial": "string (ej: Water Footprint Network & UNESCO-IHE)"
  },
  "co2": {
    "kgCO2e": number,
    "descripcion": "string (ej: 320 kg de CO2e no emitidos a la atmósfera)",
    "factorUsado": "string con factor específico",
    "fuenteOficial": "string (ej: IPCC Guidelines for National Greenhouse Gas Inventories & EPA WARM)"
  },
  "energia": {
    "kwhAhorrados": number,
    "equivalenciaEscolar": "string (ej: Energía suficiente para alimentar 18 computadoras escolares por 2 meses)",
    "fuenteOficial": "string (ej: US Energy Information Administration - EIA)"
  },
  "analogiaEscolar": "string con analogía hipervisual para estudiantes",
  "consejoCompetencia": "string con consejo estratégico para la sección en el ranking",
  "insigniaOtorgada": "string (nombre de logro ambiental)",
  "fuentesCitadas": [
    "EPA WARM Version 16 (Environmental Protection Agency, 2023)",
    "UNEP Global Waste Management Outlook",
    "Water Footprint Network Assessment Guidelines"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.25,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Respuesta vacía del modelo Gemini');
      }

      const jsonResult = JSON.parse(responseText);
      res.json({
        success: true,
        data: jsonResult,
        generatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error generando equivalencias IA:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al comunicarse con la IA',
      });
    }
  });

  // Serve client build or use Vite middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ReciclaPuntos] Servidor listo en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ReciclaPuntos] Error al iniciar servidor:', err);
  process.exit(1);
});
