# Product Variation System — Wavi Aeronautics Store

Este documento describe la arquitectura del sistema de variaciones multi-grupo para productos configurables en la tienda. Cubre el esquema de datos en Firestore, los componentes del frontend, la lógica de precios dinámicos, y la integración con el carrito de compras.

---

## 1. Visión General

El sistema permite que un producto tenga **múltiples grupos de configuración** (receptor, motor, color, etc.), donde cada grupo contiene opciones seleccionables con deltas de precio independientes. Esto reemplaza el sistema anterior basado en un selector plano `options: [{ label, priceModifier }]`.

### Ejemplo: Drone con Opciones de Receptor

```
┌─────────────────────────────────────────────────────┐
│  RECEPTOR *                                         │
│  ┌──────────────────────────────────────────────┐   │
│  │ ELRS 2.4G                         (+$17 USD) │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Precio:  $ 1,250,000 COP                           │
│  (base $280 USD + $17 receptor = $297 USD → COP)    │
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
      required: true,            // Must select before checkout
      options: [
        { id: "pnp", label: "PNP (Sin Receptor)", priceDelta: 0 },
        { id: "elrs-2.4g", label: "ELRS 2.4G", priceDelta: 17 },
        { id: "tbs-nano-rx", label: "TBS Nano RX", priceDelta: 35 },
        { id: "pnp-gps", label: "PNP With GPS", priceDelta: 13 },
        { id: "elrs-2.4g-gps", label: "ELRS 2.4G With GPS", priceDelta: 30 },
        { id: "tbs-nano-rx-gps", label: "TBS Nano RX With GPS", priceDelta: 55 },
        { id: "elrs-915-gemx", label: "ELRS 915MHz/2.4G GemX", priceDelta: 27 }
      ]
    }
  ]
}
```

### Interfaces TypeScript (`src/types/product.ts`)

| Interface | Descripción |
|---|---|
| `ProductVariationOption` | Opción individual: `id`, `label`, `priceDelta`, `skuSuffix?`, `imageUrl?`, `images?`, `stock?` |
| `ProductVariationGroup` | Grupo de opciones: `id`, `name`, `required`, `options: ProductVariationOption[]` |
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
│       ├── ProductVariations.jsx   # Selector multi-grupo (dropdowns por grupo)
│       ├── BuyNowButton.jsx        # Botón "Comprar Ahora" express
│       ├── cartUtils.js            # generateCartItemId(), formatVariationTag(), addProductToCart()
│       └── index.js                # Barrel exports
├── hooks/
│   └── useProductPrice.js          # Hook reactivo de precios dinámicos
└── providers/
    └── ShoppingCartProvider.jsx    # Contexto del carrito (variation-aware)
```

### `<ProductVariations>` — Selector de Variaciones

**Ubicación:** [`src/app/tienda/components/product-detail/ProductVariations.jsx`](../src/app/tienda/components/product-detail/ProductVariations.jsx)

Renderiza un dropdown `<Select>` por cada grupo de variación. Incluye:
- Placeholder "Selecciona una opción"
- Deltas de precio visibles en cada opción (`+$17 USD`)
- Validación visual (borde rojo) para grupos requeridos sin selección
- Label con asterisco `*` para grupos `required: true`

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

### Categorías con Selector de Receptores

Las categorías `dronesRC`, `dronesHD`, y `dronesKit` muestran un **grid de checkboxes** con 7 tipos de receptor predefinidos:

| ID | Label | Delta (USD) |
|---|---|---|
| `pnp` | PNP (Sin Receptor) | $0 |
| `elrs-2.4g` | ELRS 2.4G | +$17 |
| `tbs-nano-rx` | TBS Nano RX | +$35 |
| `pnp-gps` | PNP With GPS | +$13 |
| `elrs-2.4g-gps` | ELRS 2.4G With GPS | +$30 |
| `tbs-nano-rx-gps` | TBS Nano RX With GPS | +$55 |
| `elrs-915-gemx` | ELRS 915MHz/2.4G GemX | +$27 |

**Flujo:**
1. Admin selecciona categoría de drone
2. Aparece el grid de checkboxes con cada receptor y su `+$X USD` chip
3. Al marcar/desmarcar, se reconstruye el `variationGroup` automáticamente
4. Botones "Seleccionar todos" y "Limpiar" para acciones rápidas
5. Al guardar, `buildProductPayload()` serializa los `variationGroups` al documento Firestore

### Categorías No-Drone

Conservan el editor manual de opciones legacy (`label` + `priceModifier`).

### Archivos de Configuración

| Archivo | Exportación Clave |
|---|---|
| [`config.js`](../src/app/admin/products/config.js) | `RECEIVER_VARIATION_OPTIONS`, `buildReceiverVariationGroup()`, `DRONE_CATEGORIES_WITH_RECEIVERS` |
| [`config.js`](../src/app/admin/products/config.js) | `buildProductPayload()` — serializa `variationGroups` a Firestore |
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

| Suite | Tipo | Archivo |
|---|---|---|
| ProductVariations | Component/RTL | `src/app/tienda/components/product-detail/__tests__/ProductVariations.test.jsx` |
| cartUtils | Unit | `src/app/tienda/components/product-detail/__tests__/cartUtils.test.js` |
| useProductPrice | Unit/Hook | `src/app/tienda/hooks/__tests__/useProductPrice.test.js` |
