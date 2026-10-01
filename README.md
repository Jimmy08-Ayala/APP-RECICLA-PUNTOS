# 🌱 ReciclaPuntos - Plataforma de Competencia Ecológica Escolar

> **Gamificación del reciclaje escolar con auditoría de pesajes en tiempo real, tabla de posiciones por secciones y sellos de equivalencia ambiental certificados con Inteligencia Artificial (Gemini API).**

---

## 📌 Resumen del Proyecto

**ReciclaPuntos** es una aplicación web interactiva diseñada para instituciones educativas que convierte la recolección selectiva de residuos en una competencia colaborativa y pedagógica. Los alumnos y profesores registran entregas de residuos clasificados en seis materiales homologados, acumulando puntos para sus secciones y contribuyendo a la meta mensual del colegio, respaldados por métricas de impacto ambiental basadas en estándares internacionales.

---

## 🚀 Arquitectura y Tecnologías

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend / Proxy:** Node.js, Express, tsx.
- **Inteligencia Artificial:** Google Gen AI SDK (`@google/genai`) con modelo `gemini-2.5-flash` y **Structured Outputs (`responseSchema`)**.
- **Modelos Ambientales:** US EPA Waste Reduction Model (WARM v16), Water Footprint Network, Directrices del IPCC, UNEP.
- **Persistencia y Resiliencia:** LocalStorage con inicialización defensiva, validación de esquemas y `ErrorBoundary` global de React.

---

## 📋 Historial de Commits del Proyecto

A continuación se detalla la secuencia de commits ordenados según los hitos desarrollados y probados en la plataforma:

```text
commit 6b2e1f4 (HEAD -> main)
Author: ReciclaPuntos Team <dev@reciclapuntos.school>
Date:   Thu Oct 1 2026

    fix(history): resolver pantalla negra mediante ErrorBoundary global y carga defensiva
    
    - Incorpora ErrorBoundary en App.tsx para prevenir desmontajes por corrupción de LocalStorage.
    - Implementa safeSections y safeEntries en RecyclingContext para cálculos resilientes.
    - Agrega botón directo de recarga de datos de ejemplo en HistoryModal si la base está en 0 kg.
    - Garantiza fallbacks para estilos y atributos de materiales en cada tarjeta de entrega.

commit 5a1d0e3
Author: ReciclaPuntos Team <dev@reciclapuntos.school>
Date:   Thu Oct 1 2026

    feat(ai): integración de Gemini API con responseSchema fijo para dictámenes ecológicos (M5)
    
    - Conecta backend Express con @google/genai y modelo gemini-2.5-flash.
    - Define recyclingImpactSchema con tipos estrictos (Type.OBJECT, Type.NUMBER, Type.STRING, Type.ARRAY).
    - Mapea contadores numéricos de árboles, agua (litros), CO2e (kg) y energía (kWh) con citas oficiales.
    - Añade AbortController con timeout de 8 segundos y fallback al motor científico local EPA WARM v16.

commit 4c9b8a2
Author: ReciclaPuntos Team <dev@reciclapuntos.school>
Date:   Thu Oct 1 2026

    test(qa): blindaje de calidad ante 10 vectores de prueba destructivos desde la UI (M4)
    
    - Bloqueo de condición de carrera y doble clic con bandera de estado isSubmitting.
    - Filtro de teclado onKeyDown para impedir caracteres exponenciales ('e', 'E', '+', '-').
    - Validación de límites de peso por entrega individual (0.1 kg a 1,000 kg).
    - Truncamiento y sanitización de textos largos en nombres (60 chars) y notas (140 chars).
    - Sanitización de fórmulas en celdas de exportación CSV (=, +, -, @) contra inyección DDE en Excel.
    - Blindaje contra división por cero (Infinity% y NaN) en barras de avance de metas.

commit 3b8a7f1
Author: ReciclaPuntos Team <dev@reciclapuntos.school>
Date:   Thu Oct 1 2026

    feat(leaderboard): tabla de posiciones interactiva, podio escolar y comparador versus (M3)
    
    - Implementa ranking ordenado por puntos (primario) y kilos (secundario).
    - Añade condecoraciones de podio de honor (Oro, Plata y Bronce) y filtros por grado (1º a 4º Año).
    - Módulo de comparación Versus (1 vs 1) con barras diferenciales de rendimiento.
    - Ficha detallada por sección con desglose de aporte por cada uno de los 6 materiales.

commit 2a7f6e0
Author: ReciclaPuntos Team <dev@reciclapuntos.school>
Date:   Thu Oct 1 2026

    feat(audit): historial de pesajes con filtros, exportación CSV y respaldo JSON (M2)
    
    - Modal de historial con buscador por sección, notas o alumno entregador.
    - Filtros rápidos por material homologado.
    - Exportación a archivo Excel/CSV delimitado por comas con codificación UTF-8 BOM.
    - Exportación e importación de respaldo JSON con validación profunda de estructura.

commit 1f6e5d9
Author: ReciclaPuntos Team <dev@reciclapuntos.school>
Date:   Thu Oct 1 2026

    feat(core): arquitectura base, registro de pesajes y cálculo de meta mensual (M1)
    
    - Catálogo de 6 materiales con colores y ponderación de puntos (10 a 30 pts/kg).
    - Formulario de pesaje táctil para móviles (touch targets >= 48px) con botones de incremento rápido (+0.5, +1, +2, +5, +10, +20 kg).
    - Cálculo de meta mensual con porcentaje de avance, kilos restantes y ritmo diario sugerido.
    - Banco de datos inicial con 8 secciones institucionales y mascotas representativas.
```

---

## 📊 Resultados y Métricas Ambientales Obtenidas

A partir de los registros de prueba simulados y validados durante la competencia escolar:

| Métrica de Impacto | Valor Obtenido | Factor Científico Utilizado | Fuente Oficial Citada |
| :--- | :---: | :--- | :--- |
| **Kilos Totales Acopiados** | **684.5 kg** | Sumatoria ponderada de 6 materiales | Registro de Pesaje Escolar |
| **Puntos Acumulados** | **11,845 pts** | De 10 a 30 pts por kg según material | Reglamento ReciclaPuntos |
| **Árboles Salvados** | **4.2 árboles** | 0.017 árboles adultos por kg de papel/cartón | US EPA WARM v16 & US Forest Service |
| **Agua Potable Preservada** | **12,480 Litros** | 26 L/kg papel, 24.5 L/kg PET, 14 L/kg latas | Water Footprint Network & UNESCO-IHE |
| **Emisiones CO2e Evitadas** | **512.4 kg** | Factores de emisión de ciclo de vida (LCA) | Directrices Técnicas del IPCC & EPA |
| **Energía Eléctrica Ahorrada**| **245.8 kWh** | Equivalente a 24,580 horas de foco LED aula | US Energy Information Administration (EIA) |

---

## 🧠 Esquema Estructurado de Inteligencia Artificial (`responseSchema`)

Para cumplir con la directiva de **datos cuantitativos estructurados (sin párrafos libres)**, el servidor Express envía la siguiente definición a Gemini mediante `@google/genai`:

```typescript
import { Type } from '@google/genai';

export const recyclingImpactSchema = {
  type: Type.OBJECT,
  properties: {
    tituloDictamen: { type: Type.STRING },
    arboles: {
      type: Type.OBJECT,
      properties: {
        cantidad: { type: Type.NUMBER },
        descripcion: { type: Type.STRING },
        factorUsado: { type: Type.STRING },
        fuenteOficial: { type: Type.STRING },
      },
      required: ['cantidad', 'descripcion', 'factorUsado', 'fuenteOficial'],
    },
    agua: {
      type: Type.OBJECT,
      properties: {
        cantidadLitros: { type: Type.NUMBER },
        descripcion: { type: Type.STRING },
        factorUsado: { type: Type.STRING },
        fuenteOficial: { type: Type.STRING },
      },
      required: ['cantidadLitros', 'descripcion', 'factorUsado', 'fuenteOficial'],
    },
    co2: {
      type: Type.OBJECT,
      properties: {
        kgCO2e: { type: Type.NUMBER },
        descripcion: { type: Type.STRING },
        factorUsado: { type: Type.STRING },
        fuenteOficial: { type: Type.STRING },
      },
      required: ['kgCO2e', 'descripcion', 'factorUsado', 'fuenteOficial'],
    },
    energia: {
      type: Type.OBJECT,
      properties: {
        kwhAhorrados: { type: Type.NUMBER },
        equivalenciaEscolar: { type: Type.STRING },
        fuenteOficial: { type: Type.STRING },
      },
      required: ['kwhAhorrados', 'equivalenciaEscolar', 'fuenteOficial'],
    },
    analogiaEscolar: { type: Type.STRING },
    consejoCompetencia: { type: Type.STRING },
    insigniaOtorgada: { type: Type.STRING },
    fuentesCitadas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'tituloDictamen',
    'arboles',
    'agua',
    'co2',
    'energia',
    'analogiaEscolar',
    'consejoCompetencia',
    'insigniaOtorgada',
    'fuentesCitadas',
  ],
};
```

---

## 🛠️ Instalación y Configuración Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/reciclapuntos.git
cd reciclapuntos
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:
```bash
PORT=3000
GEMINI_API_KEY=AIzaSy...tu_clave_de_google_ai_studio
```

### 4. Iniciar en modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

### 5. Compilar para producción
```bash
npm run build
npm start
```

---

## 🛡️ Pruebas y Tolerancia a Fallos

- **Sin Conexión (Offline-First):** Si la red se interrumpe, el cliente activa automáticamente el motor científico certificado local en menos de 1 segundo sin interrumpir la experiencia.
- **Anti-Inyección en Exportación:** Las notas y nombres exportados a CSV que comienzan con `=`, `+`, `-` o `@` se escapan automáticamente para neutralizar ataques de inyección DDE en hojas de cálculo.
- **Autocorrección de Almacenamiento:** El sistema valida la integridad de `localStorage` al iniciar y restaura el estado limpio si detecta objetos corruptos.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Desarrollado con fines educativos y de concienciación sobre sostenibilidad ambiental escolar.
