# Taxonomía de Tags por Tipo de Uso — Wavi Aeronautics Store

Este documento define la estructura estandarizada de **Tags de Producto** para la catalogación y filtrado de productos en la tienda. Los tags permiten clasificar drones, kits, accesorios, componentes VTX y sistemas de radiocontrol según su campo de aplicación y características técnicas, y facilitar sugerencias automáticas durante el registro o edición de artículos desde el panel de administración (`/admin/products`).

---

## 🏷️ Tags por Tipo de Uso (Application & Industry Tags)

| Tag Slug | Nombre Visible | Categoría de Industria | Equipamiento & Tecnologías Clave | Ejemplos de Artículos |
| :--- | :--- | :--- | :--- | :--- |
| `fpv-racing` | **Deportivo & FPV Racing** | Carreras y Acrobacia | Kits FPV HD/Analógicos, Frames de carbono 5", Motores 2207+, Baterías LiPo 6S, Gafas FPV, Emisoras ELRS / Crossfire | Drones de carreras BNF, Hélices de paso agresivo, Receptores ELRS |
| `cine-audiovisual` | **Publicidad & Cine** | Producción Audiovisual | Cinemasters, Cinelifters (7" a 10"), Transmisores Digitales VTX (DJI O3, Walksnail), Cámaras de alta resolución, Hélices silenciosas | Drones VTOL estabilizados, monturas GoPro/RED, VTX HD digital |
| `agro-precision` | **Agricultura de Precisión** | Agroindustria & Ambiente | Plataformas de alta autonomía (>30 min), Sensores multiespectrales (NDVI/NDRE), Controladores de vuelo con GPS/RTK, Tanques de aspersión | Drones hexacópteros, sensores de reflectancia, baterías de alta capacidad |
| `topografia-mapeo` | **Mapeo & Fotogrametría** | Topografía & Ingeniería | Receptores GNSS RTK/PPK, Cámaras con obturador mecánico (Global Shutter), Software de fotogrametría, Telemetría de largo alcance | Drones de ala fija/VTOL para mapeo, software de procesamiento 3D |
| `inspeccion-industrial` | **Inspección & Seguridad** | Monitoreo Industrial & Vigilancia | Sensores térmicos (FLIR), Cámaras con zoom óptico 30x+, Frames protegidos (Ducted), Transmisión encriptada | Drones con sensores térmicos, linternas de alta potencia, monitores de tierra |
| `turismo-aventura` | **Excursión & Turismo** | Exploración y Naturaleza | Drones ultralivianos (<249g Sub-250g), Carga USB-C, Baterías de repuesto, Mochilas de transporte compactas | Drones compactos plegables, kits portátiles RTF |

---

## 🔖 Tags de Producto por Categoría (Product & Technical Tags)

Estas son las etiquetas técnicas y de línea de producto que se sugieren automáticamente según la categoría seleccionada en el formulario de administración.

### Tags Comunes (disponibles en todas las categorías)

`nuevo` · `oferta` · `destacado` · `profesional` · `principiante`

### Tags Base para Drones (compartidos por dronesKit, dronesRC, dronesHD)

| Tag | Descripción |
| :--- | :--- |
| `O4` | Línea de producto O4 |
| `WASP` | Línea de producto WASP |
| `WTFPV` | Línea de producto WTFPV |
| `FPV` | First Person View genérico |
| `KIT` | Producto tipo kit (con componentes) |
| `4K` | Resolución de video 4K |
| `HD` | Transmisión/grabación de alta definición |
| `analógico` / `digital` | Tipo de señal de video |
| `freestyle` / `long-range` | Estilo de vuelo |
| `cinewhoop` / `toothpick` / `micro` | Formato/tamaño del drone |
| `sub-250g` | Peso inferior a 250 g (no requiere RUAS) |
| `BNF` / `PNP` / `RTF` | Estado de ensamble (Bind-N-Fly / Plug-N-Play / Ready-To-Fly) |
| `5-pulgadas` / `3.5-pulgadas` / `7-pulgadas` | Tamaño de hélice/frame |
| `GPS` / `RTK` | Posicionamiento satelital |
| `ELRS` / `crossfire` / `TBS` | Protocolo de radiocontrol |

### Tags Específicos por Subcategoría

| Categoría | Tags Propios |
| :--- | :--- |
| **Kit Drones** (`dronesKit`) | `kit-completo`, `kit-armado`, `DIY`, `frame`, `carbono`, `motor`, `ESC`, `stack` |
| **Drones RC** (`dronesRC`) | `racing`, `acrobático`, `competición`, `velocidad` |
| **FPV HD** (`dronesHD`) | `DJI`, `walksnail`, `HDZero`, `O3`, `vista`, `cinematic`, `estabilizado` |
| **Goggles FPV** (`googles`) | `OLED`, `LCD`, `diversity`, `receptor-integrado`, `DVR`, `HDZero`, `DJI`, `walksnail`, `analógico`, `digital`, `ajuste-dioptrías`, `head-tracker` |
| **Radio Control** (`radioControl`) | `ELRS`, `crossfire`, `TBS`, `ExpressLRS`, `OpenTX`, `EdgeTX`, `2.4GHz`, `915MHz`, `868MHz`, `hall-sensor`, `gimbal`, `plegable`, `compacto`, `full-size` |
| **Baterías/Accesorios** (`baterias`) | `LiPo`, `Li-Ion`, `1S`…`6S`, `HV`, `cargador`, `paralelo`, `XT60`, `XT30`, `correa`, `antena`, `hélice`, `protector`, `bolsa-seguridad` |
| **Transmisores** (`transmisors`) | `VTX`, `5.8GHz`, `1.3GHz`, `digital`, `analógico`, `O4`, `O3`, `DJI`, `walksnail`, `HDZero`, `25mW`…`1W`, `smart-audio`, `IRC-tramp` |
| **Receptores** (`receptors`) | `ELRS`, `crossfire`, `TBS`, `R-XSR`, `XM+`, `2.4GHz`, `915MHz`, `868MHz`, `nano`, `diversidad`, `telemetría`, `SBUS`, `CRSF`, `PWM` |
| **Digital VTX** (`digitalVTX`) | `DJI`, `walksnail`, `HDZero`, `O4`, `O3`, `vista`, `avatar`, `VRX`, `módulo-receptor`, `4K`, `1080p`, `720p`, `baja-latencia`, `antena-patch`, `antena-omni` |

---

## 🚀 Integración en el Panel de Administración (`/admin/products`)

El campo `tags: string[]` utiliza un componente **MUI Autocomplete** con `freeSolo` que:

1. **Sugiere tags predefinidos** según la categoría seleccionada (vía `getTagSuggestionsForCategory()` en [`config.js`](../src/app/admin/products/config.js)).
2. **Permite tags personalizados** escritos libremente por el usuario.
3. **Se adapta dinámicamente** — al cambiar de categoría, las sugerencias se actualizan automáticamente.
4. **Es extensible** — para agregar tags a una nueva categoría, solo se debe añadir una entrada en el objeto `CATEGORY_TAGS` en `config.js`.

### Estructura de Datos en Firestore (`products/{category}/brands/{brand}/items/{id}`):

```typescript
{
  productID: string;
  name: string;
  category: string; // 'dronesHD', 'googles', 'radioControl', etc.
  price: number;
  tags: Array<
    // Tags de uso
    | 'fpv-racing' | 'cine-audiovisual' | 'agro-precision'
    | 'topografia-mapeo' | 'inspeccion-industrial' | 'turismo-aventura'
    // Tags de producto (ejemplos)
    | 'O4' | 'WASP' | 'WTFPV' | 'FPV' | 'KIT' | '4K' | 'HD'
    | string // Cualquier tag personalizado adicional
  >;
  // ... resto de campos del producto
}
```

---

## 💡 Recomendaciones para la Búsqueda y Filtrado

1. **Buscador de Tienda (`SearchBar.jsx`)**: El algoritmo de búsqueda por tokens puede indexar estos tags para que búsquedas como `"agricultura"`, `"topografía"`, `"carreras"`, o `"cine"` devuelvan los equipos compatibles aunque la palabra no esté en el título principal.
2. **Badge en ProductCard**: Los productos que tengan tags coincidentes pueden exhibir un chip de uso recomendado (ej. *Apto para Topografía*, *Uso FPV Deportivo*).
3. **Cumplimiento RAC 100**: Permite asociar automáticamente si el equipo clasifica para **Categoría Abierta (<250g o recreativo)** o si su uso comercial requiere habilitación como **Explotador UAS**.

---

## 🔧 Cómo Agregar Tags para Nuevas Categorías

Para agregar sugerencias a una nueva categoría (por ejemplo, si se crea `camaras` o `software`):

1. Abre [`src/app/admin/products/config.js`](../src/app/admin/products/config.js).
2. Agrega una nueva entrada en el objeto `CATEGORY_TAGS`:
   ```javascript
   camaras: ['GoPro', 'Insta360', 'action-cam', 'global-shutter', '4K', '8K'],
   ```
3. Si la nueva categoría necesita heredar los tags base de drones, agrégala al array en `getTagSuggestionsForCategory()`:
   ```javascript
   const isDroneCategory = ['dronesKit', 'dronesRC', 'dronesHD', 'nuevaCategoria'].includes(categoryKey)
   ```
4. Los tags `_common` siempre se incluyen automáticamente.
