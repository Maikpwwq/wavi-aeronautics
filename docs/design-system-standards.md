# Wavi Aeronautics — Design System Standards

This document describes the typography hierarchy, color palette, reusable components, and styling conventions used across the Wavi Aeronautics storefront. It serves as the single source of truth for visual consistency.

---

## 1. Theme Architecture

The project uses **two MUI themes** that coexist:

| Theme File | Scope | Purpose |
|---|---|---|
| [`src/modules/theme.js`](../src/modules/theme.js) | Global (marketing, landing, footer) | Root theme with `Roboto Condensed` headings, `Work Sans` body. Applies `text-transform: uppercase` to h1–h4 & h6. |
| [`src/app/tienda/innerTheme.js`](../src/app/tienda/innerTheme.js) | Store section (`/tienda/*`) | Store-specific theme with `BRAND_COLORS` constants and no forced uppercase. |

### Global Theme — Key Overrides (`theme.js`)

```javascript
// Heading font stack — Roboto Condensed, uppercase, bold (700)
const fontHeader = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 700,           // theme.typography.fontWeightMedium
  textTransform: 'uppercase' // ⚠️ Forces uppercase on h1–h4, h6
}

// Body font stack — Work Sans, regular (400)
typography: {
  fontFamily: "'Work Sans', sans-serif",
  fontSize: 14
}
```

> [!WARNING]
> The global theme applies `textTransform: 'uppercase'` to heading variants `h1`–`h4` and `h6`.
> When using `body1` or custom inline styles in the store section, always set `textTransform: 'none'` to prevent unintended uppercase rendering.

### Inner Theme — `BRAND_COLORS` Constants (`innerTheme.js`)

```javascript
export const BRAND_COLORS = {
  primary: '#1976d2',       // Brand blue
  primaryDark: '#1565c0',   // Hover state
  primaryLight: '#42a5f5',  // Active state
  accent: '#00bcd4',        // Cyan accent
  success: '#4caf50',       // Success green
  text: {
    primary: '#1a2744',
    secondary: '#546e7a',
    link: '#455a64',        // High contrast for links
    disabled: '#9e9e9e',
  },
  background: {
    page: '#fcfcfc',
    paper: '#ffffff',
    subtle: '#f5f5f5',
  },
  border: {
    light: '#f0f0f0',
    default: '#e0e0e0',
  }
}
```

---

## 2. Color Palette

### Brand Identity Colors

| Token | Hex | Usage |
|---|---|---|
| **Wavi Blue** | `#00aCe4` | Primary accent, divider bars, CTA highlights |
| **Navy / Title** | `#0f172a` | Page headings (Slate-900) |
| **Slate-600** | `#475569` | Body text, descriptions |
| **Orange CTA** | `#ff6f00` | Call-to-action buttons, Escuela/Blog nav buttons |
| **Orange Dark** | `#e65100` | Hover state for orange CTAs |
| **Dark Surface** | `#1e1e1f` | Footer background, dark containers |

### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| **Success** | `#4caf50` | In-stock badge, confirmation states |
| **Error / Agotado** | `rgba(211, 47, 47, 0.9)` | Out-of-stock badge, error states |
| **Warning** | `#ffc071` | Pending/attention indicators |

### Category Page Colors (from `CategoryHeader`)

| Element | Value | Notes |
|---|---|---|
| Title color | `#0f172a` | Slate-900, consistent across all categories |
| Accent bar | `#00aCe4` | 44px wide × 3.5px tall, borderRadius: 2 |
| Description text | `#475569` | Slate-600, maxWidth: 820px |

---

## 3. Typography Standards

### Store Category Pages (Standardized)

All store category pages use the `<CategoryHeader>` component with the following specs:

#### Primary Heading (`h1`)

| Property | Value |
|---|---|
| `variant` | `"h4"` (MUI) |
| `component` | `"h1"` (semantic HTML) |
| `fontWeight` | `800` |
| `fontSize` | `{ xs: '1.5rem', sm: '1.85rem', md: '2.15rem' }` |
| `letterSpacing` | `-0.025em` |
| `color` | `#0f172a` |
| `lineHeight` | `1.2` |

#### Secondary Heading (`h2`)

| Property | Value |
|---|---|
| `variant` | `"h5"` (MUI) |
| `component` | `"h2"` (semantic HTML) |
| `fontWeight` | `800` |
| `fontSize` | `{ xs: '1.35rem', sm: '1.6rem', md: '1.85rem' }` |
| `letterSpacing` | `-0.02em` |
| `color` | `#0f172a` |
| `lineHeight` | `1.25` |

#### Description / Body Text

| Property | Value |
|---|---|
| `variant` | `"body1"` (MUI) |
| `component` | `"p"` |
| `fontWeight` | `400` |
| `fontSize` | `{ xs: '0.92rem', sm: '0.98rem', md: '1.02rem' }` |
| `lineHeight` | `1.65` |
| `color` | `#475569` |
| `maxWidth` | `820px` |
| `textTransform` | `'none'` |

### Font Families

| Context | Font | Weight Range | CDN |
|---|---|---|---|
| Headings (global theme) | Roboto Condensed | 700 | Google Fonts |
| Body text (global theme) | Work Sans | 300, 400, 700 | Google Fonts |
| Store section headings | System / MUI default | 800 (inline) | N/A |

---

## 4. Reusable Components

### `<CategoryHeader>` — Store Category Headings

**Location:** [`src/app/tienda/components/CategoryHeader.jsx`](../src/app/tienda/components/CategoryHeader.jsx)

Standardizes the header block across all category pages with a title, accent divider bar, and description paragraph.

```jsx
import CategoryHeader from '@/app/tienda/components/CategoryHeader'

// Primary heading (h1)
<CategoryHeader
  title="Drones FPV HD"
  description="Explora nuestra selección de drones FPV de alta definición..."
/>

// Secondary heading (h2)
<CategoryHeader
  title="Marcas Destacadas"
  variant="h5"
  titleComponent="h2"
/>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `node` | — | Heading text |
| `description` | `node` | — | Body paragraph below the accent bar |
| `variant` | `string` | `'h4'` | MUI Typography variant |
| `titleComponent` | `string` | `'h1'` | Semantic HTML element |
| `sx` | `object` | `{}` | Additional MUI sx overrides |
| `children` | `node` | — | Extra content after description |

**Visual Output:**

```
┌──────────────────────────────────────────┐
│  Drones FPV HD              ← h1, 800wt │
│  ████                      ← #00aCe4 bar │
│  Explora nuestra selección...  ← body1   │
└──────────────────────────────────────────┘
```

### `<PageNavigation>` — Breadcrumbs & Back Button

**Location:** [`src/app/tienda/components/PageNavigation.jsx`](../src/app/tienda/components/PageNavigation.jsx)

Provides breadcrumb trail with back button for all store pages.

**Category Slugs Supported:**

```javascript
const CATEGORY_LABELS = {
  'kit-drones': "Kit's Drones",
  'drones-fpv-hd': 'Drones HD',
  'drones': 'Drones RC',
  'googles': 'Goggles FPV',
  'radio-control': 'Radio Control',
  'trasmisor-receptor': 'Transmisión/Recepción',
  'digital-vtx': 'Digital VTX',
  'accesorios': 'Accesorios',
  'software': 'Software'
}
```

---

## 5. Store Header Navigation Buttons

The store header (`HeaderLogo.jsx`) includes CTA buttons for cross-section navigation:

### Escuela Button

```jsx
<Button
  component={Link}
  href="/escuela"
  variant="outlined"
  startIcon={<SchoolIcon />}
  sx={{
    color: '#ff6f00',
    borderColor: 'rgba(255, 111, 0, 0.6)',
    borderRadius: 2.5,
    textTransform: 'none',
    fontWeight: 'bold',
    '&:hover': {
      borderColor: '#ff6f00',
      bgcolor: 'rgba(255, 111, 0, 0.15)',
      color: '#ffffff',
      boxShadow: '0 0 12px rgba(255, 111, 0, 0.3)',
    }
  }}
/>
```

### Blog Button

Same visual pattern as Escuela, links to `/blog`.

---

## 6. Category Navigation Tabs

The store uses a tab navigation bar defined in [`headerRoutes.js`](../src/app/tienda/components/header/headerRoutes.js) with 9 product categories:

| # | Label | Slug | Route |
|---|---|---|---|
| 0 | Kit's Drones | `kit-drones` | `/tienda/kit-drones/` |
| 1 | Drones HD | `drones-fpv-hd` | `/tienda/drones-fpv-hd/` |
| 2 | Drones RC | `drones` | `/tienda/drones/` |
| 3 | Goggles FPV | `googles` | `/tienda/googles/` |
| 4 | Radio Control | `radio-control` | `/tienda/radio-control/` |
| 5 | Transmisión/Recepción | `trasmisor-receptor` | `/tienda/trasmisor-receptor/` |
| 6 | Digital VTX | `digital-vtx` | `/tienda/digital-vtx/` |
| 7 | Accesorios | `accesorios` | `/tienda/accesorios/` |
| 8 | Software | `software` | `/tienda/software/` |

---

## 7. Responsive Breakpoint Strategy

All components must be tested across MUI breakpoints:

| Breakpoint | Min Width | Target |
|---|---|---|
| `xs` | 0px | Mobile phones |
| `sm` | 600px | Tablets |
| `md` | 900px | Desktop |
| `lg` | 1200px | Large desktop |

Font sizes in `CategoryHeader` use responsive objects:
```javascript
fontSize: { xs: '1.5rem', sm: '1.85rem', md: '2.15rem' }
```

---

## 8. Conventions & Best Practices

### Do ✅

- Use `<CategoryHeader>` for all store category page titles.
- Use `variant="body1"` with `textTransform: 'none'` for sentence-case body text.
- Use `BRAND_COLORS` constants from `innerTheme.js` for PageNavigation and store UI.
- Keep heading hierarchy semantic: one `h1` per page, sub-sections as `h2`.
- Use `#0f172a` for title colors and `#475569` for descriptive text.
- Set `fontWeight: 800` for headings, `400` for body.

### Don't ❌

- Don't use raw `h6` variant for body text (inherits `uppercase` from global theme).
- Don't hardcode color strings inline — prefer `BRAND_COLORS` or the documented tokens.
- Don't skip the accent divider bar in category headers.
- Don't use font weights other than the standard scale (400, 500, 600, 700, 800).

---

## 9. Pages Using Standardized Typography

| Page | Route | Status |
|---|---|---|
| Drones FPV HD | `/tienda/drones-fpv-hd` | ✅ Standardized |
| Drones RC | `/tienda/drones` | ✅ Standardized |
| Kit Drones | `/tienda/kit-drones` | ✅ Standardized |
| Goggles FPV | `/tienda/googles` | ✅ Standardized |
| Radio Control | `/tienda/radio-control` | ✅ Standardized |
| Transmisión/Recepción | `/tienda/trasmisor-receptor` | ✅ Standardized |
| Digital VTX | `/tienda/digital-vtx` | ✅ Standardized |
| Accesorios | `/tienda/accesorios` | ✅ Standardized |
| Buscar | `/tienda/buscar` | ✅ Standardized |
| Software | `/tienda/software` | ✅ Custom layout (pre-existing) |
| Escuela | `/escuela` | ✅ Custom layout (pre-existing) |
