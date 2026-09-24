# AGENTS.md — AI Coding Agent Guidelines & Context

This document provides essential context, architectural standards, build instructions, and guidelines for AI coding agents working on the **Wavi Aeronautics Store** codebase.

---

## 🛠 Project Overview & Tech Stack

- **Application**: E-commerce platform for VToL technology, drones, and FPV equipment (Wavi Aeronautics).
- **Framework**: Next.js 16 (App Router & Pages Router hybrid; App Router primary for `/tienda/*`, `/admin/*`, `/auth/*`).
- **UI Library**: Material-UI (MUI) v7 + Emotion.
- **State Management**: Redux Toolkit (`@/store`) & React Context (`ShoppingCartProvider`).
- **Backend & Database**: Firebase (Authentication, Cloud Firestore, Storage, Hosting).
- **Payments**: Mercado Pago SDK & PSE integration.
- **Package Manager**: `pnpm`.

---

## 💻 Build, Test & Development Commands

```bash
# Start local development server
pnpm dev

# Run production build verification
pnpm build

# Start production server
pnpm start

# Run all unit & component tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage enforcement (thresholds: 70% stmts/branches/funcs/lines)
pnpm test:coverage

# Run Playwright E2E & accessibility tests (requires dev server)
pnpm test:e2e

# Run Stryker mutation testing (threshold: 80%, current score: 89%)
pnpm test:mutate

# Run ESLint (flat config, ESLint 9)
pnpm lint
```

> **Note for Agents**: Always run `pnpm run build` after editing code to verify clean compilation. Run `pnpm test` to verify test suite integrity after modifying business logic or Redux slices.

---

## 📁 Key Directory Map

```text
src/
├── app/                        # Next.js App Router pages, layouts, and components
│   ├── admin/                  # Admin dashboard routes (/admin/*)
│   │   ├── orders/             # Orders management (/admin/orders)
│   │   ├── questions/          # Technical questions moderation (/admin/questions)
│   │   ├── reviews/            # Reviews approval & moderation (/admin/reviews)
│   │   └── products/           # Product catalog management (/admin/products)
│   │       └── components/     # Admin components (NewProductForm, ProductEditDialog, VariationGroupsEditor)
│   ├── auth/                   # Authentication routes (/auth/*)
│   ├── favoritos/              # Wishlist / Favorites page (/favoritos)
│   ├── mis-opiniones/          # Customer reviews management (/mis-opiniones)
│   ├── mis-compras/            # Consolidated purchase history & printable invoices (/mis-compras)
│   ├── facturacion/            # Fiscal billing profile & saved payment methods (/facturacion)
│   ├── providers/              # App providers (FavoritesProvider)
│   ├── tienda/                 # Store routes (/tienda/*)
│   │   ├── buscar/             # Search results page (/tienda/buscar)
│   │   ├── components/         # Storefront components (ProductCard, CategoryHeader, ProductFeedbackSection, etc.)
│   │   │   ├── header/         # Header components (HeaderLogo, SearchBar, StoreBanner)
│   │   │   ├── product-detail/ # PDP sub-components (ProductGallery, ProductVariations, BuyNowButton, cartUtils, etc.)
│   │   │   │   └── __tests__/  # PDP component & utility tests
│   │   │   └── checkout/       # Checkout components (CheckoutOrderSummary)
│   │   ├── hooks/              # Custom hooks (useProductFilter, useProducts, useProductPrice)
│   │   │   └── __tests__/      # Hook unit tests
│   │   └── producto/           # Product detail page route (/tienda/producto)
│   ├── escuela/                # FPV School page (/escuela) — top-level route
│   ├── blog/                   # Blog listing & article pages (/blog, /blog/[id])
│   │   ├── [id]/               # Individual blog post (dynamic route)
│   │   └── components/         # Blog components (BlogPostCard, BlogPagination, GradientTitle)
│   ├── (legal routes)/         # /politica-de-privacidad, /politica-de-envios, etc.
│   ├── robots.js               # Dynamic /robots.txt
│   └── sitemap.js              # Dynamic /sitemap.xml
├── firebase/                   # Firebase initialization (firebaseClient.js, firebaseAdmin.js)
│   └── __tests__/              # Firestore & Storage security rules tests (emulator-based)
├── modules/                    # Shared UI modules (Atomic design components, AppFooter, withRoot)
├── services/                   # Data fetching & Firestore API service layer
│   ├── __tests__/              # Service unit tests (favorites, billing, usedProducts, concurrency)
│   ├── favoritesService.js     # User wishlist & favorites real-time subscriptions
│   ├── billingService.js       # Fiscal profile & PCI-compliant payment methods
│   ├── productInteractionService.js # Customer reviews, technical questions, purchaser check & admin CRUD
│   ├── FirebaseSearchProducts.js    # Header & page search service
│   ├── shoppingCartService.js       # Shopping cart operations
│   ├── ordersService.js             # Order creation & retrieval
│   └── adminService.js              # Admin aggregated stats & KPIs
├── store/                      # Redux store, slices, and root reducer
│   ├── __tests__/              # Redux slice unit tests (product, shopping_cart)
│   └── states/                 # Product, user, cart slices
├── types/                      # TypeScript data models and interfaces (userModules.ts, product.ts)
└── utilities/                  # Helper utilities (priceUtils.js, price calculation, validation)
    └── __tests__/              # Utility unit & property-based tests (fast-check)
```

### Additional Project Root Files

```text
├── vitest.config.mjs           # Vitest configuration (jsdom, coverage thresholds, @/ alias)
├── vitest.setup.js             # Test environment setup (DOM cleanup)
├── playwright.config.js        # Playwright E2E configuration
├── stryker.config.mjs          # Stryker mutation testing configuration
├── eslint.config.mjs           # ESLint 9 flat config (Next.js + JSX)
├── load-test.js                # k6 load testing script
├── e2e/                        # Playwright E2E specs
│   └── usedProducts.spec.js    # E2E + A11y (Axe) tests for Used Products flow
└── .github/workflows/          # CI/CD pipelines
    ├── pr.yml                  # PR gate: lint, test:coverage, emulators, build
    └── nightly.yml             # Nightly: E2E, mutation testing, report artifacts
```

---

## 🏗 Data Architecture & Firestore Conventions

### 1. Hierarchical Product Storage Structure

Products in Firestore follow a brand-organized hierarchical structure:

```text
products/{category}/brands/{brand}/items/{productID}
```

- Global queries cross-category use `collectionGroup('items')`.
- Top-level collections & User Subcollections:
  - `users/{uid}`
    - `users/{uid}/favorites/{productId}` (Wishlist items)
    - `users/{uid}/billingInfo/{infoId}` (Fiscal billing details)
    - `users/{uid}/paymentMethods/{methodId}` (PCI-compliant masked cards / tokens)
  - `orders/{orderId}`
  - `product_reviews/{reviewId}` (fields: `productId`, `userId`, `userName`, `rating`, `title`, `comment`, `approved`, `createdAt`)
  - `product_questions/{questionId}` (fields: `productId`, `userId`, `userName`, `question`, `answer`, `answeredAt`, `createdAt`)

### 2. Standardized Field Schema

Always prefer **English field names**. Handle legacy Spanish keys as fallback getters:

| Standard Field       | Legacy Field       | Type          | Description                                                         |
| -------------------- | ------------------ | ------------- | ------------------------------------------------------------------- |
| `productID`          | `id`               | string        | Unique SKU / Document ID                                            |
| `name`               | `titulo`           | string        | Display product title                                               |
| `brand`              | `marca`            | string        | Brand name                                                          |
| `category`           | `categoria`        | string        | Category identifier                                                 |
| `price`              | `precio`           | number        | Price in USD (converted to COP dynamically via `calculateCopPrice`) |
| `availability`       | N/A                | boolean       | `true` = In stock, `false` = Agotado                                |
| `images`             | `imagenes`         | string[]      | Array of image URLs                                                 |
| `description`        | `descripcion`      | string        | Full text description                                               |
| `specifications`     | `especificaciones` | string/object | Technical specifications                                            |
| `variationGroups`    | N/A                | array         | Multi-group product variations (see §3 below)                       |
| `options`            | N/A                | array         | Legacy flat options `[{ label, priceModifier }]`                    |

### 3. Product Variation System (`variationGroups`)

Products supporting configurable options (e.g., receiver type, motor model, frame color) use the **multi-group variation architecture**:

```typescript
// TypeScript interfaces in src/types/product.ts
export type VariationSelectorType = 'dropdown' | 'pills' | 'color'

export interface ProductVariationOption {
  id: string             // 'pnp', 'elrs-24g', 'negro', '2450kv'
  label: string          // 'ELRS 2.4G', 'Negro Mate', '2450KV'
  priceDelta: number     // In USD (+17, +35, 0)
  colorHex?: string      // Optional for color selector ('#1e1e1e', '#ef4444')
  skuSuffix?: string
  imageUrl?: string
}

export interface ProductVariationGroup {
  id: string             // 'receiver_type', 'color', 'motors', 'combo'
  name: string           // 'RECEPTOR', 'COLOR', 'MOTORES'
  type?: VariationSelectorType // 'dropdown' | 'pills' | 'color'
  required: boolean
  options: ProductVariationOption[]
}

// Firestore example: products/{category}/brands/{brand}/items/{productID}
{
  variationGroups: [
    {
      id: "receiver_type",
      name: "RECEPTOR",
      type: "dropdown",
      required: true,
      options: [
        { id: "pnp", label: "PNP (Sin Receptor)", priceDelta: 0 },
        { id: "elrs-2.4g", label: "ELRS 2.4G", priceDelta: 17 },
        { id: "tbs-nano-rx", label: "TBS Nano RX", priceDelta: 35 }
      ]
    },
    {
      id: "color",
      name: "COLOR",
      type: "color",
      required: true,
      options: [
        { id: "negro", label: "Negro Mate", priceDelta: 0, colorHex: "#1e1e1e" },
        { id: "rojo", label: "Rojo", priceDelta: 0, colorHex: "#ef4444" }
      ]
    }
  ]
}
```

**Key interfaces** (defined in `src/types/product.ts`):
- `VariationSelectorType` — `'dropdown' | 'pills' | 'color'`
- `ProductVariationOption` — Single selectable option with `priceDelta`, optional `colorHex`, `skuSuffix`, `imageUrl`
- `ProductVariationGroup` — Named group of options (id, name, type, required, options)
- `SelectedVariation` — Runtime selection state (groupId, optionId, optionLabel, priceDelta)
- `CartItem` — Cart entry keyed by `cartItemId` = `${productId}_${variationsHash}`

**Backward compatibility**: Products using legacy `options: [{ label, priceModifier }]` are normalized to `variationGroups` by `extractVariationGroups()` in `ProductVariations.jsx`.

**Admin presets**: Drone categories (`dronesRC`, `dronesHD`, `dronesKit`) have predefined receiver options via `RECEIVER_VARIATION_OPTIONS` in `config.js`, selectable with checkboxes. Additional variation groups (Color, Motors, Combo, Custom) can be added alongside receiver presets via `VariationGroupsEditor`.

### 3b. PDP Dynamic Selector Detection (`detectVariationType`)

The PDP component `ProductVariations.jsx` uses `detectVariationType(group)` to render the appropriate UI selector:

| Priority | Condition | Selector Type |
|----------|-----------|---------------|
| 1 | Explicit `group.type` is set (`'color'`, `'pills'`, `'dropdown'`) | Returns as-is |
| 2 | Name contains "color" or any option has `colorHex` | **Color swatches** — circular color dots with checkmark, label, price badge |
| 3 | Name contains "receptor"/"receiver" or > 4 options | **Dropdown** — MUI `<Select>` with placeholder and price deltas |
| 4 | Name contains "motor"/"kv"/"combo"/"bater"/"tamaño"/"size" | **Pills** — tactile pill buttons with active state |
| 5 | ≤ 4 options (default) | **Pills** |
| 6 | > 4 options (default) | **Dropdown** |

### 4. Price & Availability Rules

- Never use `price === 0` to denote out-of-stock items.
- Price calculation uses `calculateCopPrice(priceInUsd)` in `@/utilities/priceUtils`.
- Dynamic pricing: `useProductPrice` hook computes `basePrice + sum(selectedVariation.priceDelta)` reactively.
- Availability is governed strictly by `product.availability !== false`.
- Out-of-stock products display real price alongside an explicit `AGOTADO` badge.

---

## 🎨 Design System & Theme Guidelines

- **Theme Base**: Material-UI (MUI) v7.
- **Theme Files**: Two coexisting themes:
  - `src/modules/theme.js` — Global (marketing, landing). Applies `textTransform: 'uppercase'` to h1–h4, h6.
  - `src/app/tienda/innerTheme.js` — Store section. Exports `BRAND_COLORS` constants.
- **Brand Colors**:
  - Primary Accent: `#00aCe4` (Wavi Blue)
  - Title Text: `#0f172a` (Slate-900)
  - Body Text: `#475569` (Slate-600)
  - Secondary Accent: `#ff6f00` / `#e65100` (Orange CTA)
  - Footer / Dark Containers: `#1e1e1f`
  - Success Badge: `#4caf50`
  - Error / Agotado Badge: `rgba(211, 47, 47, 0.9)`
- **Typography Standardization**:
  - All store category pages use `<CategoryHeader>` component (`src/app/tienda/components/CategoryHeader.jsx`).
  - Headings: `fontWeight: 800`, responsive `fontSize`, `color: '#0f172a'`.
  - Body text: `variant="body1"`, `fontWeight: 400`, `color: '#475569'`, `textTransform: 'none'`.
  - Accent divider: `#00aCe4` bar (44×3.5px) between title and description.
- **Responsive Layout**: Always test breakages across `xs` (mobile), `sm` (tablet), `md` (desktop), `lg` (large desktop).
- **Design System Docs**: See `docs/design-system-standards.md` for comprehensive reference.

---

## 🚨 Guidelines for AI Agents

1. **Client Components**: Next.js App Router interactive components in `src/app/` must start with `'use client'`.
2. **Never swallow errors**: Do not handle exceptions by returning dummy fallback data or empty objects silently.
3. **Preserve API Contracts**: If function signatures or Redux action signatures change, update all caller sites.
4. **Verification**: Always run `pnpm run build` after editing code to verify clean compilation.
5. **Clean Commits**: Make concise git commits following conventional commit prefixing (`feat:`, `fix:`, `style:`, `refactor:`).
6. **Import Aliases**: Always use `@/` absolute path aliases (e.g., `@/utilities/priceUtils`, `@/store/states/product`). Never use deep relative paths like `../../../`. The alias is defined in `jsconfig.json` as `@/* → ./src/*` and mirrored in `vitest.config.mjs`.
7. **Testing Requirements**:
   - Add or update tests when modifying business logic in `src/utilities/`, `src/store/states/`, or `src/services/`.
   - Run `pnpm test` before committing to verify the full suite passes (254+ tests, 38 suites).
   - Coverage thresholds are enforced at 70% for statements, branches, functions, and lines on core modules.
   - Firebase Firestore/Storage rules tests require the Local Emulator Suite (ports 8080/9199). They auto-skip gracefully when emulators are not running.
8. **Typography**: Always use `<CategoryHeader>` for store category page headings. Never use raw `h6` variant for body text (inherits `uppercase` from global theme). Use `textTransform: 'none'` when needed.
9. **Product Variations**:
   - Use `variationGroups` (new schema) for multi-group product configurations instead of flat `options`.
   - Each group can specify `type: 'pills' | 'color' | 'dropdown'` to control PDP rendering.
   - Color options must include `colorHex` (e.g., `'#ef4444'`) for swatch rendering.
   - Use `useProductPrice` hook for dynamic pricing based on selected variations.
   - Use `extractVariationGroups()` to normalize legacy `options` to the unified format.
   - Use `detectVariationType(group)` for automatic selector type inference in the PDP.
   - Cart items are keyed by deterministic `cartItemId` (`${productId}_${variationsHash}`) via `generateCartItemId()`.
   - Admin: Use `VariationGroupsEditor` component for all variation management (drone presets + arbitrary groups).
   - Admin drone categories use `RECEIVER_VARIATION_OPTIONS` presets with checkbox selection.

---

## 🧪 Testing Infrastructure

### Testing Stack

| Tool                     | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| **Vitest**               | Unit & component test runner (jsdom)            |
| **React Testing Library**| Component rendering & interaction assertions    |
| **fast-check**           | Property-based testing & fuzzing                |
| **Playwright**           | E2E browser tests & visual regression           |
| **@axe-core/playwright** | WCAG 2.1 AA accessibility audits                |
| **Stryker Mutator**      | Mutation testing (vitest-runner)                 |
| **@vitest/coverage-v8**  | Code coverage with enforced thresholds           |
| **Firebase Emulators**   | Firestore & Storage security rules testing       |
| **k6**                   | Load & performance testing script                |

### Test Suites Summary

| Suite                        | Type           | File                                                      |
| ---------------------------- | -------------- | --------------------------------------------------------- |
| favoritesService             | Unit/Service   | `src/services/__tests__/favoritesService.test.js`         |
| billingService               | Unit/Service   | `src/services/__tests__/billingService.test.js`           |
| priceUtils                   | Unit + PBT     | `src/utilities/__tests__/priceUtils.test.js`              |
| usedProductsConfig           | Unit + PBT     | `src/utilities/__tests__/usedProductsConfig.test.js`      |
| Redux slices                 | Unit           | `src/store/__tests__/slices.test.js`                      |
| UsedProductCard              | Component/RTL  | `src/app/tienda/components/__tests__/UsedProductCard.test.jsx` |
| UsedProductsShowcase         | Component/RTL  | `src/app/tienda/components/__tests__/UsedProductsShowcase.test.jsx` |
| UsedProductForm              | Component/RTL  | `src/app/tienda/vender/components/__tests__/UsedProductForm.test.jsx` |
| UsedProductForm (Fuzz)       | Fuzzing/XSS    | `src/app/tienda/vender/components/__tests__/UsedProductForm.fuzz.test.jsx` |
| usedProductsService          | Service/Mock   | `src/services/__tests__/usedProductsService.test.js`      |
| Concurrency (Race)           | Stress         | `src/services/__tests__/concurrency.test.js`              |
| Firestore Rules              | Integration    | `src/firebase/__tests__/firestoreRules.test.js`           |
| Storage Rules                | Integration    | `src/firebase/__tests__/storageRules.test.js`             |
| CategoryHeader               | Component/RTL  | `src/app/tienda/components/__tests__/CategoryHeader.test.jsx` |
| SoftwarePage                 | Component/RTL  | `src/app/tienda/software/__tests__/SoftwarePage.test.jsx` |
| BlogPostCard                 | Component/RTL  | `src/app/blog/components/__tests__/BlogPostCard.test.jsx` |
| BlogPagination               | Component/RTL  | `src/app/blog/components/__tests__/BlogPagination.test.jsx` |
| BlogPostPage                 | Component/RTL  | `src/app/blog/[id]/__tests__/BlogPostPage.test.jsx`       |
| GradientTitle                | Component/RTL  | `src/app/blog/components/__tests__/GradientTitle.test.jsx` |
| ProductVariations            | Component/RTL  | `src/app/tienda/components/product-detail/__tests__/ProductVariations.test.jsx` |
| detectVariationType          | Unit           | `src/app/tienda/components/product-detail/__tests__/ProductVariations.test.jsx` |
| cartUtils                    | Unit           | `src/app/tienda/components/product-detail/__tests__/cartUtils.test.js` |
| useProductPrice              | Unit/Hook      | `src/app/tienda/hooks/__tests__/useProductPrice.test.js`  |
| E2E + A11y                   | E2E/Axe        | `e2e/usedProducts.spec.js`                                |

### CI/CD Pipelines

- **`pr.yml`** (on push/PR to `main`): ESLint → Unit Tests + Coverage → Firebase Emulator Rules → Production Build.
- **`nightly.yml`** (daily 03:00 UTC): Playwright E2E + A11y → Stryker Mutation → Artifact upload.
