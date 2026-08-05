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
│   ├── auth/                   # Authentication routes (/auth/*)
│   ├── tienda/                 # Store routes (/tienda/*)
│   │   ├── buscar/             # Search results page (/tienda/buscar)
│   │   ├── components/         # Storefront components (ProductCard, ProductFeedbackSection, etc.)
│   │   │   └── header/         # Header components (HeaderLogo, SearchBar, StoreBanner)
│   │   ├── hooks/              # Custom hooks (useProductFilter, useProducts)
│   │   └── producto/           # Product detail page route (/tienda/producto)
│   ├── (legal routes)/         # /politica-de-privacidad, /politica-de-envios, etc.
│   ├── robots.js               # Dynamic /robots.txt
│   └── sitemap.js              # Dynamic /sitemap.xml
├── firebase/                   # Firebase initialization (firebaseClient.js, firebaseAdmin.js)
│   └── __tests__/              # Firestore & Storage security rules tests (emulator-based)
├── modules/                    # Shared UI modules (Atomic design components, AppFooter, withRoot)
├── services/                   # Data fetching & Firestore API service layer
│   ├── __tests__/              # Service unit tests (usedProductsService, concurrency)
│   ├── productInteractionService.js # Customer reviews, technical questions, purchaser check & admin CRUD
│   ├── FirebaseSearchProducts.js    # Header & page search service
│   ├── shoppingCartService.js       # Shopping cart operations
│   ├── ordersService.js             # Order creation & retrieval
│   └── adminService.js              # Admin aggregated stats & KPIs
├── store/                      # Redux store, slices, and root reducer
│   ├── __tests__/              # Redux slice unit tests (product, shopping_cart)
│   └── states/                 # Product, user, cart slices
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
- Top-level collections:
  - `users/{uid}`
  - `orders/{orderId}`
  - `product_reviews/{reviewId}` (fields: `productId`, `userId`, `userName`, `rating`, `title`, `comment`, `createdAt`)
  - `product_questions/{questionId}` (fields: `productId`, `userId`, `userName`, `question`, `answer`, `answeredAt`, `createdAt`)

### 2. Standardized Field Schema

Always prefer **English field names**. Handle legacy Spanish keys as fallback getters:

| Standard Field   | Legacy Field       | Type          | Description                                                         |
| ---------------- | ------------------ | ------------- | ------------------------------------------------------------------- |
| `productID`      | `id`               | string        | Unique SKU / Document ID                                            |
| `name`           | `titulo`           | string        | Display product title                                               |
| `brand`          | `marca`            | string        | Brand name                                                          |
| `category`       | `categoria`        | string        | Category identifier                                                 |
| `price`          | `precio`           | number        | Price in USD (converted to COP dynamically via `calculateCopPrice`) |
| `availability`   | N/A                | boolean       | `true` = In stock, `false` = Agotado                                |
| `images`         | `imagenes`         | string[]      | Array of image URLs                                                 |
| `description`    | `descripcion`      | string        | Full text description                                               |
| `specifications` | `especificaciones` | string/object | Technical specifications                                            |

### 3. Price & Availability Rules

- Never use `price === 0` to denote out-of-stock items.
- Price calculation uses `calculateCopPrice(priceInUsd)` in `@/utilities/priceUtils`.
- Availability is governed strictly by `product.availability !== false`.
- Out-of-stock products display real price alongside an explicit `AGOTADO` badge.

---

## 🎨 Design System & Theme Guidelines

- **Theme Base**: Material-UI (MUI) v7.
- **Brand Colors**:
  - Primary Accent: `#00aCe4` (Wavi Blue)
  - Secondary Accent: `#ff6f00` / `#e65100` (Orange CTA)
  - Footer / Dark Containers: `#1e1e1f`
  - Success Badge: `#4caf50`
  - Error / Agotado Badge: `rgba(211, 47, 47, 0.9)`
- **Typography**: Modern clean fonts with explicit `fontWeight` settings (500, 600, 700).
- **Responsive Layout**: Always test breakages across `xs` (mobile), `sm` (tablet), `md` (desktop), `lg` (large desktop).

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
   - Run `pnpm test` before committing to verify the full suite passes (84+ tests, 12 suites).
   - Coverage thresholds are enforced at 70% for statements, branches, functions, and lines on core modules.
   - Firebase Firestore/Storage rules tests require the Local Emulator Suite (ports 8080/9199). They auto-skip gracefully when emulators are not running.

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
| E2E + A11y                   | E2E/Axe        | `e2e/usedProducts.spec.js`                                |

### CI/CD Pipelines

- **`pr.yml`** (on push/PR to `main`): ESLint → Unit Tests + Coverage → Firebase Emulator Rules → Production Build.
- **`nightly.yml`** (daily 03:00 UTC): Playwright E2E + A11y → Stryker Mutation → Artifact upload.
