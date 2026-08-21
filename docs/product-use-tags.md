# Taxonomía de Tags por Tipo de Uso — Wavi Aeronautics Store

Este documento define la estructura estandarizada de **Tags de Tipo de Uso (Application & Industry Tags)** para la catalogación y filtrado de productos en la tienda. Estos tags permiten clasificar drones, kits, accesorios, componentes VTX y sistemas de radiocontrol según su campo de aplicación en Colombia y facilitar sugerencias automáticas durante el registro o edición de artículos desde el panel de administración (`/admin/products`).

---

## 🏷️ Matriz de Tags Estandarizados

| Tag Slug | Nombre Visible | Categoría de Industria | Equipamiento & Tecnologías Clave | Ejemplos de Artículos |
| :--- | :--- | :--- | :--- | :--- |
| `fpv-racing` | **Deportivo & FPV Racing** | Carreras y Acrobacia | Kits FPV HD/Analógicos, Frames de carbono 5", Motores 2207+, Baterías LiPo 6S, Gafas FPV, Emisoras ELRS / Crossfire | Drones de carreras BNF, Hélices de paso agresivo, Receptores ELRS |
| `cine-audiovisual` | **Publicidad & Cine** | Producción Audiovisual | Cinemasters, Cinelifters (7" a 10"), Transmisores Digitales VTX (DJI O3, Walksnail), Cámaras de alta resolución, Hélices silenciosas | Drones VTOL estabilizados, monturas GoPro/RED, VTX HD digital |
| `agro-precision` | **Agricultura de Precisión** | Agroindustria & Ambiente | Plataformas de alta autonomía (>30 min), Sensores multiespectrales (NDVI/NDRE), Controladores de vuelo con GPS/RTK, Tanques de aspersión | Drones hexacópteros, sensores de reflectancia, baterías de alta capacidad |
| `topografia-mapeo` | **Mapeo & Fotogrametría** | Topografía & Ingeniería | Receptores GNSS RTK/PPK, Cámaras con obturador mecánico (Global Shutter), Software de fotogrametría, Telemetría de largo alcance | Drones de ala fija/VTOL para mapeo, software de procesamiento 3D |
| `inspeccion-industrial` | **Inspección & Seguridad** | Monitoreo Industrial & Vigilancia | Sensores térmicos (FLIR), Cámaras con zoom óptico 30x+, Frames protegidos (Ducted), Transmisión encriptada | Drones con sensores térmicos, linternas de alta potencia, monitores de tierra |
| `turismo-aventura` | **Excursión & Turismo** | Exploración y Naturaleza | Drones ultralivianos (<249g Sub-250g), Carga USB-C, Baterías de repuesto, Mochilas de transporte compactas | Drones compactos plegables, kits portátiles RTF |

---

## 🚀 Integración en el Panel de Administración (`/admin/products`)

Al registrar o editar un producto en el formulario de administración, el campo `tags: string[]` en el esquema de Firestore (`normalizeProduct`) podrá sugerir estos valores predeterminados mediante un componente `Autocomplete` con chips de selección múltiple.

### Estructura de Datos en Firestore (`products/{category}/brands/{brand}/items/{id}`):

```typescript
{
  productID: string;
  name: string;
  category: string; // 'drones', 'drones-fpv-hd', 'digital-vtx', etc.
  price: number;
  tags: Array<
    | 'fpv-racing'
    | 'cine-audiovisual'
    | 'agro-precision'
    | 'topografia-mapeo'
    | 'inspeccion-industrial'
    | 'turismo-aventura'
    | string
  >;
  // ... resto de campos del producto
}
```

---

## 💡 Recomendaciones para la Búsqueda y Filtrado

1. **Buscador de Tienda (`SearchBar.jsx`)**: El algoritmo de búsqueda por tokens puede indexar estos tags para que búsquedas como `"agricultura"`, `"topografía"`, `"carreras"`, o `"cine"` devuelvan los equipos compatibles aunque la palabra no esté en el título principal.
2. **Badge en ProductCard**: Los productos que tengan tags coincidentes pueden exhibir un chip de uso recomendado (ej. *Apto para Topografía*, *Uso FPV Deportivo*).
3. **Cumplimiento RAC 100**: Permite asociar automáticamente si el equipo clasifica para **Categoría Abierta (<250g o recreativo)** o si su uso comercial requiere habilitación como **Explotador UAS**.
