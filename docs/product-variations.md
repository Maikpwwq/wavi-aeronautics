# Product Variation System — Wavi Aeronautics Store

Este documento describe la arquitectura del sistema de variaciones multi-grupo para productos configurables en la tienda. Cubre el esquema de datos en Firestore, los componentes del frontend, la lógica de precios dinámicos, y la integración con el carrito de compras.

---

## 1. Visión General

El sistema permite que un producto tenga **múltiples grupos de configuración** (receptor, motor, color, etc.), donde cada grupo contiene opciones seleccionables con deltas de precio independientes. Esto reemplaza el sistema anterior basado en un selector plano `options: [{ label, priceModifier }]`.

### Ejemplo: Drone con Opciones de Receptor + Color

```
┌─────────────────────────────────────────────────────┐
│  RECEPTOR *                              [Dropdown] │
│  ┌──────────────────────────────────────────────┐   │
│  │ ELRS 2.4G                         (+$17 USD) │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  COLOR *                                   [Color]  │
│  ● Negro Mate   ◉ Rojo (+$5)   ● Azul              │
│                                                     │
│  MOTORES                                   [Pills]  │
│  [ 2450KV ]  [▣ 2750KV (+$12) ]  [ 1800KV ]        │
│                                                     │
│  Precio:  $ 1,350,000 COP                           │
│  (base $280 + $17 + $5 + $12 = $314 USD → COP)     │
└─────────────────────────────────────────────────────┘
```

---

## 2. Esquema de Datos (Firestore)

### Estructura en Documento de Producto

```typescript
// products/{category}/brands/{brand}/items/{productID}
{
  productID: "AQUILA16-HD",
  name: "Aquila16 FPV HD",
  price: 280,                    // Base price USD
  
  variationGroups: [
    {
      id: "receiver_type",       // Unique group ID
      name: "RECEPTOR",          // Display label
      type: "dropdown",          // Selector type: 'dropdown' | 'pills' | 'color'
      required: true,            // Must select before checkout
      options: [
        { id: "pnp", label: "PNP (Sin Receptor)", priceDelta: 0 },
        { id: "elrs-2.4g", label: "ELRS 2.4G", priceDelta: 17 },
        { id: "tbs-nano-rx", label: "TBS Nano RX", priceDelta: 35 }
      ]
    },
    {
      id: "color",
      name: "COLOR",
      type: "color",             // Renders circular color swatches
      required: true,
      options: [
        { id: "negro", label: "Negro Mate", priceDelta: 0, colorHex: "#1e1e1e" },
        { id: "rojo", label: "Rojo", priceDelta: 5, colorHex: "#ef4444" },
        { id: "azul", label: "Azul", priceDelta: 0, colorHex: "#3b82f6" }
      ]
    },
    {
      id: "motors",
      name: "MOTORES",
      type: "pills",             // Renders tactile pill buttons
      required: false,
      options: [
        { id: "2450kv", label: "2450KV", priceDelta: 0 },
        { id: "2750kv", label: "2750KV", priceDelta: 12 },
        { id: "1800kv", label: "1800KV", priceDelta: 0 }
      ]
    }
  ]
}
```

### Interfaces TypeScript (`src/types/product.ts`)

| Interface | Descripción |
|---|---|
| `VariationSelectorType` | Tipo literal: `'dropdown' \| 'pills' \| 'color'` |
| `ProductVariationOption` | Opción individual: `id`, `label`, `priceDelta`, `colorHex?`, `skuSuffix?`, `imageUrl?`, `images?`, `stock?` |
| `ProductVariationGroup` | Grupo de opciones: `id`, `name`, `type?`, `required`, `options: ProductVariationOption[]` |
| `SelectedVariation` | Selección en runtime: `groupId`, `groupName`, `optionId`, `optionLabel`, `priceDelta` |
| `CartItem` | Entrada del carrito: `cartItemId`, `productId`, `selectedVariations`, `unitPrice`, `quantity` |

---

## 3. Componentes Frontend

### Mapa de Archivos

```text
src/app/tienda/
├── components/
│   ├── ProductDetail.jsx           # PDP principal (integra todos los sub-componentes)
│   ├── AddProduct.jsx              # Botón "Agregar al Carrito"
│   └── product-detail/
│       ├── ProductVariations.jsx   # Selector multi-grupo con detección dinámica de tipo
│       ├── BuyNowButton.jsx        # Botón "Comprar Ahora" express
│       ├── cartUtils.js            # generateCartItemId(), formatVariationTag(), addProductToCart()
│       └── index.js                # Barrel exports
├── hooks/
│   └── useProductPrice.js          # Hook reactivo de precios dinámicos
└── providers/
    └── ShoppingCartProvider.jsx    # Contexto del carrito (variation-aware)

src/app/admin/products/
├── components/
│   ├── VariationGroupsEditor.jsx   # Editor unificado: presets drone + grupos arbitrarios
│   ├── NewProductForm.jsx          # Formulario de creación (integra VariationGroupsEditor)
│   └── ProductEditDialog.jsx       # Dialog de edición (integra VariationGroupsEditor)
├── config.js                       # Constantes, presets, buildProductPayload
└── page.js                         # Página principal del admin de productos
```

### `<ProductVariations>` — Selector de Variaciones con Detección Dinámica

**Ubicación:** [`src/app/tienda/components/product-detail/ProductVariations.jsx`](../src/app/tienda/components/product-detail/ProductVariations.jsx)

Renderiza un selector **por cada grupo de variación**, detectando automáticamente el tipo más apropiado:

#### `detectVariationType(group)` — Detección Automática del Selector

| Prioridad | Condición | Tipo de Selector |
|-----------|-----------|------------------|
| 1 | `group.type` explícitamente definido | Usa el valor directamente |
| 2 | Nombre contiene "color" o alguna opción tiene `colorHex` | **Color swatches** |
| 3 | Nombre contiene "receptor"/"receiver" o > 4 opciones | **Dropdown** |
| 4 | Nombre contiene "motor"/"kv"/"combo"/"bater"/"tamaño"/"size" | **Pills** |
| 5 | ≤ 4 opciones (default) | **Pills** |
| 6 | > 4 opciones (default) | **Dropdown** |

#### Tipos de Selector Renderizados

| Tipo | Componente | Descripción |
|------|------------|-------------|
| `dropdown` | MUI `<Select>` | Placeholder "Selecciona una opción", deltas de precio visibles (`+$17 USD`) |
| `pills` | Botones táctiles `<Box>` | Estado activo con borde primario y fondo tintado, badge de precio |
| `color` | Swatches circulares `<Box>` | Fondo con `colorHex`, checkmark SVG en selección, label y badge de precio |

#### Características comunes a todos los selectores:
- Validación visual (borde rojo) para grupos requeridos sin selección
- Label con asterisco `*` para grupos `required: true`
- Opción seleccionada mostrada en el header del grupo
- Navegación por teclado (Enter/Space) con `role="radiogroup"` / `role="radio"`
- ARIA labels descriptivos

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `product` | `Object` | Producto con `variationGroups` o `options` |
| `selectedVariations` | `Object` | Mapa `{ [groupId]: optionId }` |
| `onVariationChange` | `Function` | Callback `(updatedMap, selectedList, allRequiredSelected)` |
| `showValidation` | `boolean` | Muestra errores en campos requeridos vacíos |

### `extractVariationGroups(product)` — Normalizador

Convierte el formato legacy `options` al formato unificado `variationGroups`:
- Si el producto tiene `variationGroups`, los retorna directamente
- Si tiene `options: [{ label, priceModifier }]`, los envuelve en un grupo genérico
- Si no tiene ninguno, retorna `[]` (modo single-item)

### `useProductPrice(product, selectedVariations, quantity)` — Hook de Precios

**Ubicación:** [`src/app/tienda/hooks/useProductPrice.js`](../src/app/tienda/hooks/useProductPrice.js)

Calcula reactivamente:
```
unitPriceUsd = basePrice + Σ(selectedVariation.priceDelta)
displayPrice = calculateCopPrice(unitPriceUsd)
totalPriceCop = unitPriceCop × quantity
```

**Retorna:**
| Campo | Tipo | Descripción |
|---|---|---|
| `displayPrice` | `string` | Precio unitario formateado en COP |
| `unitPriceUsd` | `number` | Precio unitario en USD |
| `unitPriceCop` | `number` | Precio unitario en COP (número) |
| `totalPriceCop` | `number` | Precio total (unitario × cantidad) |
| `totalPriceDisplay` | `string` | Precio total formateado |
| `priceDeltaUsd` | `number` | Suma de deltas aplicados |
| `hasPriceDelta` | `boolean` | `true` si alguna variación modifica el precio |

---

## 4. Integración con el Carrito

### `generateCartItemId(productId, selectedVariations)` — ID Determinístico

Genera un ID único para cada combinación producto + variaciones:

```
AQUILA16-HD                           → "AQUILA16-HD" (sin variaciones)
AQUILA16-HD + ELRS 2.4G               → "AQUILA16-HD_receiver_type:elrs-2.4g"
AQUILA16-HD + ELRS 2.4G + Motor X     → "AQUILA16-HD_motor:motor-x__receiver_type:elrs-2.4g"
```

Esto permite que el **mismo producto con diferentes configuraciones** exista como filas separadas en el carrito.

### `formatVariationTag(selectedVariations)` — Etiqueta Legible

Genera un string legible para mostrar en el carrito:
```
"RECEPTOR: ELRS 2.4G | MOTOR: GEPRC 2207"
```

---

## 5. Panel de Administración

### `VariationGroupsEditor` — Editor Unificado de Variaciones

**Ubicación:** [`src/app/admin/products/components/VariationGroupsEditor.jsx`](../src/app/admin/products/components/VariationGroupsEditor.jsx)

Componente reutilizable que reemplaza la lógica inline de checkboxes de drones y el editor legacy de opciones planas. Se integra en `NewProductForm.jsx` y `ProductEditDialog.jsx`.

#### Funcionalidades:

1. **Presets de Receptor (Drone categories):** Grid de checkboxes con 7 tipos de receptor predefinidos que aparece para categorías `dronesRC`, `dronesHD`, y `dronesKit`.
2. **Grupos Arbitrarios:** Botones de preset rápido para agregar grupos:
   - **+ Color** → Tipo `color`, con picker de hex
   - **+ Motores** → Tipo `pills`, IDs auto-generados desde KV
   - **+ Combo** → Tipo `pills`, para combos/kits
   - **+ Grupo Personalizado** → Tipo `dropdown`, totalmente editable
3. **Controles por Grupo:** Nombre editable, tipo de selector (`pills`/`color`/`dropdown`), toggle requerido, botón eliminar
4. **Controles por Opción:** Label, precio delta (USD), color hex picker (solo para tipo `color`)

#### Presets de Receptor:

| ID | Label | Delta (USD) |
|---|---|---|
| `pnp` | PNP (Sin Receptor) | $0 |
| `elrs-2.4g` | ELRS 2.4G | +$17 |
| `tbs-nano-rx` | TBS Nano RX | +$35 |
| `pnp-gps` | PNP With GPS | +$13 |
| `elrs-2.4g-gps` | ELRS 2.4G With GPS | +$30 |
| `tbs-nano-rx-gps` | TBS Nano RX With GPS | +$55 |
| `elrs-915-gemx` | ELRS 915MHz/2.4G GemX | +$27 |

#### Flujo del Admin:
1. Admin selecciona categoría
2. Si es drone, aparece la sección de receptores con checkboxes + botones "Seleccionar todos" / "Limpiar"
3. En cualquier categoría, aparecen los botones de preset rápido para agregar grupos adicionales
4. Cada grupo se configura independientemente (tipo de selector, opciones, precios)
5. Al guardar, `buildProductPayload()` serializa tanto `variationGroups` como `options` (backward-compatible) al documento Firestore

### Archivos de Configuración

| Archivo | Exportación Clave |
|---|---|
| [`config.js`](../src/app/admin/products/config.js) | `RECEIVER_VARIATION_OPTIONS`, `buildReceiverVariationGroup()`, `DRONE_CATEGORIES_WITH_RECEIVERS` |
| [`config.js`](../src/app/admin/products/config.js) | `buildProductPayload()` — serializa `variationGroups` con `type` y `colorHex` a Firestore |
| [`config.js`](../src/app/admin/products/config.js) | `normalizeProduct()` — lee `variationGroups` desde Firestore |

---

## 6. Compatibilidad con Datos Legacy

El sistema es **100% retrocompatible**:

| Caso | Comportamiento |
|---|---|
| Producto con `variationGroups` | Usa directamente el nuevo formato |
| Producto con `options` (legacy) | `extractVariationGroups()` normaliza a un grupo genérico |
| Producto sin opciones | No muestra selector, modo single-item |
| Carrito con items legacy (sin `cartItemId`) | Fallback a `productID` como key |

---

## 7. Tests

| Suite | Tipo | Archivo | Tests |
|---|---|---|---|
| ProductVariations (selectors) | Component/RTL | `src/app/tienda/components/product-detail/__tests__/ProductVariations.test.jsx` | 15 |
| detectVariationType | Unit | `src/app/tienda/components/product-detail/__tests__/ProductVariations.test.jsx` | Included |
| cartUtils | Unit | `src/app/tienda/components/product-detail/__tests__/cartUtils.test.js` | 8 |
| useProductPrice | Unit/Hook | `src/app/tienda/hooks/__tests__/useProductPrice.test.js` | 7 |
