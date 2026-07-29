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
```

> **Note for Agents**: Always run `pnpm run build` or `dlx next build` to verify code correctness and route compilation before declaring a task complete.

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
├── modules/                    # Shared UI modules (Atomic design components, AppFooter, withRoot)
├── services/                   # Data fetching & Firestore API service layer
│   ├── productInteractionService.js # Customer reviews, technical questions, purchaser check & admin CRUD
│   ├── FirebaseSearchProducts.js    # Header & page search service
│   ├── shoppingCartService.js       # Shopping cart operations
│   ├── ordersService.js             # Order creation & retrieval
│   └── adminService.js              # Admin aggregated stats & KPIs
├── store/                      # Redux store, slices, and root reducer
│   └── states/                 # Product, user, cart slices
└── utilities/                  # Helper utilities (priceUtils.js, price calculation, validation)
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
