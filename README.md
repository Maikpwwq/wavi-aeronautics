# Wavi Aeronautics Store

**Wavi Aeronautics** is a specialized e-commerce platform dedicated to VToL (Vertical Take-off and Landing) technology, drones, and FPV (First Person View) equipment.

We offer representative brands and the best products in the market including:
**TeamBlackSheep, Geprc, RadioMaster, Betafpv, Emax, Ethix, Flywoo, iFlight.**

🔗 **Live Site:** [https://wavi-aeronautics.web.app/](https://wavi-aeronautics.web.app/)

---

## 🚀 Key Features

- **Comprehensive Catalog:** Browsable categories for Drone Kits, FPV Goggles, RC Transmitters, Batteries, and Accessories.
- **Smart Filtering:** Filter products by price range and brand with real-time updates and currency formatting.
- **Dynamic Search:** Quick product search functionality.
- **User Authentication:** Secure login and registration using Firebase Auth (Email/Password, Google, Facebook).
- **Shopping Cart:** Persistent shopping cart with real-time order summary and checkout flow via MercadoPago.
- **Responsive Design:** Fully optimized UI for desktop and mobile devices using Material UI.
- **Admin Dashboard:** Full-featured admin panel for product (Brand-organized), order, user, and promotion management.

---

## 🛠 Tech Stack

| Category          | Technology                                     |
| ----------------- | ---------------------------------------------- |
| **Framework**     | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library**    | [Material UI (MUI) v7](https://mui.com/)       |
| **State**         | [Redux Toolkit](https://redux-toolkit.js.org/) |
| **Backend**       | [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage, Hosting) |
| **Payments**      | [MercadoPago](https://www.mercadopago.com/)    |
| **Storage**       | [Firebase Storage](https://firebase.google.com/products/storage) (Hierarchical: `category/brand/product`) |
| **File Uploads**  | [react-dropzone](https://react-dropzone.js.org/) |
| **Package Mgr**   | pnpm                                           |

---

## 🏗 Data Architecture

### Firestore Schema
We use a **hierarchical data structure** to optimize for brand-based browsing while maintaining global query capabilities.

#### Collections
- **Users:** `users/{uid}`
- **Orders:** `orders/{orderId}` (Flat collection for easy admin reporting)
- **Products:** Nested structure for organization:
  ```text
  products/{category}/brands/{brand}/items/{productID}
  ```
  - **Querying:** Global product searches use `collectionGroup('items')`.
  - **Organization:** Products are physically stored under their specific Brand folder.

### Storage Bucket
Images are organized in parallel with the database structure:
```text
product-images/{category}/{brand}/{filename}
```

---

## 📁 Pages Structure

### Public Pages (Storefront)

| Route                         | Description                            |
| ----------------------------- | -------------------------------------- |
| `/`                           | Homepage                               |
| `/tienda/kit-drones`          | Drone Kit category                     |
| `/tienda/drones`              | RC Drones category                     |
| `/tienda/drones-fpv-hd`       | FPV HD Drones category                 |
| `/tienda/googles`             | FPV Goggles category                   |
| `/tienda/radio-control`       | Radio Control Transmitters             |
| `/tienda/trasmisor-receptor`  | VTX/Receivers                          |
| `/tienda/digital-vtx`         | Digital Video Transmitters             |
| `/tienda/accesorios`          | Accessories                            |
| `/tienda/software`            | Software & Tools                       |
| `/tienda/escuela`             | FPV School / Training                  |
| `/tienda/producto`            | Product Detail Page (dynamic)          |
| `/tienda/ver-carrito`         | Shopping Cart                          |
| `/tienda/detalles-envio`      | Shipping Details / Checkout            |
| `/tienda/pago-exitoso`        | Payment Success                        |
| `/tienda/pago-fallido`        | Payment Failed                         |
| `/tienda/pago-pendiente`      | Payment Pending                        |
| `/tienda/pse-resultado`       | PSE Payment Result                     |

### Authentication

| Route                        | Description            |
| ---------------------------- | ---------------------- |
| `/auth/sign-in`              | Login                  |
| `/auth/sign-up`              | Registration           |
| `/auth/forgot-password`      | Password Recovery      |
| `/security/change-password`  | Change Password        |

### User Account

| Route       | Description        |
| ----------- | ------------------ |
| `/profile`  | User Profile       |
| `/orders`   | Order History      |

### Blog / Posts

| Route               | Description          |
| ------------------- | -------------------- |
| `/blog`             | Blog Listing         |
| `/posts`            | Posts Listing        |
| `/posts/[id]`       | Single Post          |
| `/posts/[id]/comments` | Post Comments     |

### Legal Pages

| Route                          | Description                  |
| ------------------------------ | ---------------------------- |
| `/politica-de-privacidad`      | Privacy Policy               |
| `/condiciones-del-servicio`    | Terms of Service             |
| `/eliminacion-datos-usuario`   | User Data Deletion Request   |

### Admin Dashboard (`/admin/*`)

| Route                    | Description                      |
| ------------------------ | -------------------------------- |
| `/admin`                 | Dashboard Overview               |
| `/admin/orders`          | Order Management                 |
| `/admin/orders/issues`   | Order Issues / Problems          |
| `/admin/users`           | User Management                  |
| `/admin/products`        | Product Management (CRUD)        |
| `/admin/settings`        | Store Settings                   |
| `/admin/promotions`      | Promotions / Discount Codes      |
| `/admin/publications`    | Blog Post Management             |

---

## 📝 Recent Updates (January 2026)

### Storefront Enhancements
- **ProductItem Cards:** Redesigned with responsive square images (`object-fit: contain`), cleaner typography, hover animations, and proper COP price formatting.
- **NuevosProductos Carousel:** Implemented CSS-based infinite auto-scroll with pause-on-hover. Products sorted by `createdAt`/`updatedAt` (most recent first) with localized date display.
- **ProductDetail Page:** Added Video embed section (YouTube) and Tags display component for enhanced product information.

### Admin Dashboard
- **ProductEditDialog:** Fixed Brand/Category dropdowns (aligned `CATEGORY_OPTIONS` with `CATEGORIES` keys). Added Video URL input and Tags field with chip preview.
- **Firestore Rules:** Added `collectionGroup('items')` permission rule for global product queries.
- **Dashboard Services:** Updated `FirebaseDroneProducts.jsx` to fetch from new hierarchical structure (`products/{cat}/brands/{brand}/items`) and merge with legacy data.

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/maikpwwq/wavi-aeronautics.git
cd wavi-aeronautics

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📂 Source Code Structure

```
src/
├── app/                # Next.js App Router pages & layouts
│   ├── admin/          # Admin dashboard pages
│   ├── auth/           # Authentication pages
│   ├── tienda/         # Store category & product pages
│   └── ...
├── firebase/           # Firebase config & admin services
├── modules/            # Shared UI components (Atomic Design)
├── services/           # Data fetching services
├── store/              # Redux store & slices
└── utilities/          # Helper functions (price, validation, etc.)
```

---

## 🌐 Services & Socials

Beyond the store, Wavi Aeronautics provides professional services:

1. **Precision Flights:** For agriculture, sports, and cargo.
2. **Digital Mapping:** Photogrammetry and digital modeling.
3. **Technical Support:** Preventive and corrective maintenance.

- **Facebook:** [Wavi Aeronautics](https://www.facebook.com/wavi.aeronautics/)
- **LinkedIn:** [Wavi Aeronautics](https://www.linkedin.com/company/wavi-aeronautics/)

---

## 📄 License

All rights reserved © 2026 Wavi Aeronautics.
