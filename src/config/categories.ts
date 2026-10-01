/**
 * Centralized Category Configuration — Single Source of Truth
 *
 * Consolidates category metadata previously scattered across:
 *   - headerRoutes.js (nav labels, slugs)
 *   - ProductCategories.js (titles, subtitles, cover images)
 *   - Individual page.js files (CategoryHeader title/description props)
 *   - Firebase service files (sessionStorage cache keys)
 *
 * @module config/categories
 */

// ── Category Configuration Interface ──────────────────────────────

export interface CategoryConfig {
  /** Firestore `category` field value (e.g., 'dronesKit', 'dronesHD') */
  id: string;
  /** URL slug: /tienda/{slug} */
  slug: string;
  /** Full route path */
  href: string;
  /** Display title for CategoryHeader, banner, etc. */
  title: string;
  /** Short label for navigation menus */
  navLabel: string;
  /** Long description for CategoryHeader component */
  description: string;
  /** Short subtitle for category cards */
  subtitle: string;
  /** MUI Icon name string — resolved lazily to avoid SSR icon import in config */
  iconName: string;
  /** Static cover image URL for ProductCategories grid */
  coverImage: string;
  /** sessionStorage key(s) where products are cached by Firebase services */
  cacheKeys: string[];
  /** Sort order for navigation (matches legacy headerRoutes.value) */
  sortOrder: number;
  /** Whether this category appears in the dynamic Home banner */
  showInBanner: boolean;
}

// ── Firebase Storage Cover Images ──────────────────────────────────

const COVER_IMAGES = {
  DJI1: "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-1.png?alt=media&token=f4f153a2-45fd-415d-884c-6964d3bb582b",
  DJI2: "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-2.png?alt=media&token=6c6a1248-55dd-46dd-9826-85614adccf4f",
  DJI3: "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-3.png?alt=media&token=51af91e6-309a-41a4-b099-e2cfdbd76063",
  DJI4: "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-4.png?alt=media&token=f36f4370-e7a7-4f27-a294-b5dd2d328dc5",
  DJI5: "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-5.png?alt=media&token=9ee3bd14-817d-48f0-adb6-d7a1aa1a6074",
  DJI6: "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-6.png?alt=media&token=57e15e18-6f0d-4e5f-b822-f24eca3ea1be",
  DJI7: "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-7.png?alt=media&token=b85e87ca-4639-45af-a006-33454fa9bf19",
  DJI8: "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-8.png?alt=media&token=466ba883-f0d1-429d-bd9d-bc7f2ef6b5cb",
} as const;

// ── Categories Array ───────────────────────────────────────────────

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "dronesKit",
    slug: "kit-drones",
    href: "/tienda/kit-drones/",
    title: "Kits de Drones FPV",
    navLabel: "Kit's Drones",
    description:
      "Kits integrales de iniciación y nivel avanzado con todo lo necesario para despegar en el vuelo en primera persona.",
    subtitle: "Listos para ensamblar y volar",
    iconName: "FlightTakeoff",
    coverImage: COVER_IMAGES.DJI1,
    cacheKeys: ["Productos_Drones_Kits"],
    sortOrder: 0,
    showInBanner: true,
  },
  {
    id: "dronesHD",
    slug: "drones-fpv-hd",
    href: "/tienda/drones-fpv-hd/",
    title: "Drones FPV Digital HD",
    navLabel: "Drones HD",
    description:
      "Descubre los mejores Drones FPV con transmisión digital de video en alta definición, diseñados para capturar tomas cinematográficas con máxima estabilidad.",
    subtitle: "Transmisión digital de alta definición",
    iconName: "Videocam",
    coverImage: COVER_IMAGES.DJI2,
    cacheKeys: ["Productos_DronesHD"],
    sortOrder: 1,
    showInBanner: true,
  },
  {
    id: "dronesRC",
    slug: "drones",
    href: "/tienda/drones/",
    title: "Drones RC (BNF / PNP / RTF)",
    navLabel: "Drones RC",
    description:
      "Drones de radiocontrol listos para enlazar, ensamblar o volar. Plataformas para freestyle, acrobacia y competición FPV.",
    subtitle: "Acrobacia, freestyle y competición",
    iconName: "SportsEsports",
    coverImage: COVER_IMAGES.DJI3,
    cacheKeys: ["Productos_DronesRC"],
    sortOrder: 2,
    showInBanner: true,
  },
  {
    id: "googles",
    slug: "googles",
    href: "/tienda/googles/",
    title: "Goggles/Gafas FPV",
    navLabel: "Goggles FPV",
    description:
      "Sistemas de inmersión visual analógica y digital HD de ultra baja latencia, con ópticas nítidas y amplio campo de visión (FOV).",
    subtitle: "Inmersión visual en primera persona",
    iconName: "Visibility",
    coverImage: COVER_IMAGES.DJI4,
    cacheKeys: ["Productos_Googles"],
    sortOrder: 3,
    showInBanner: true,
  },
  {
    id: "radioControl",
    slug: "radio-control",
    href: "/tienda/radio-control/",
    title: "Radios & Controles Remotos",
    navLabel: "Radio Control",
    description:
      "Emisoras de radiocontrol con tecnología ExpressLRS, TBS Crossfire y protocolos de precisión milimétrica para pilotos exigentes.",
    subtitle: "Emisoras y módulos ELRS / TBS",
    iconName: "SettingsRemote",
    coverImage: COVER_IMAGES.DJI5,
    cacheKeys: ["Productos_RC"],
    sortOrder: 4,
    showInBanner: true,
  },
  {
    id: "trasmisorReceptor",
    slug: "trasmisor-receptor",
    href: "/tienda/trasmisor-receptor/",
    title: "Transmisores de Video & Radio (TX)",
    navLabel: "Transmisión/Recepción",
    description:
      "Módulos de enlace y transmisión con potencia escalable, gran penetración de señal y estabilidad en largo alcance.",
    subtitle: "Antenas, módulos y receptores",
    iconName: "Sensors",
    coverImage: COVER_IMAGES.DJI6,
    cacheKeys: ["Productos_Receptor", "Productos_Transmisor"],
    sortOrder: 5,
    showInBanner: true,
  },
  {
    id: "digitalVTX",
    slug: "digital-vtx",
    href: "/tienda/digital-vtx/",
    title: "Sistemas Digitales VTX HD",
    navLabel: "Digital VTX",
    description:
      "Unidades de video transmisión digital de ultra baja latencia, cámaras HD integradas y compatibilidad con sistemas DJI O3/O4, Walksnail Avatar y HDZero.",
    subtitle: "Sistemas Walksnail, Caddx y DJI O3/O4",
    iconName: "Tv",
    coverImage: COVER_IMAGES.DJI7,
    cacheKeys: ["Digital_VTX"],
    sortOrder: 6,
    showInBanner: true,
  },
  {
    id: "baterias",
    slug: "baterias",
    href: "/tienda/baterias/",
    title: "Baterías FPV",
    navLabel: "Baterías",
    description:
      "Baterías LiPo y Li-ion de alto rendimiento, paquetes 1S a 6S con alta tasa de descarga (C-rate) para máxima potencia y autonomía de vuelo.",
    subtitle: "LiPo, LiHV y celdas de alto rendimiento",
    iconName: "BatteryChargingFull",
    coverImage: COVER_IMAGES.DJI8,
    cacheKeys: ["Productos_Baterias"],
    sortOrder: 7,
    showInBanner: true,
  },
  {
    id: "helices",
    slug: "helices",
    href: "/tienda/helices/",
    title: "Hélices FPV",
    navLabel: "Hélices",
    description:
      "Hélices para drones FPV de 3, 5 y 7 pulgadas. Modelos bipala y tripala diseñados para carreras, freestyle y tomas cinematográficas con máxima eficiencia.",
    subtitle: "Hélices 3\", 5\" y 7\" de alta eficiencia",
    iconName: "FlightTakeoff",
    coverImage: COVER_IMAGES.DJI4,
    cacheKeys: ["Productos_Helices"],
    sortOrder: 8,
    showInBanner: true,
  },
  {
    id: "frames",
    slug: "frames",
    href: "/tienda/frames/",
    title: "Frames & Chasis de Carbono",
    navLabel: "Frames / Chasis",
    description:
      "Estructuras y chasis en fibra de carbono japonesa T700 para drones FPV, brazos reforzados de repuesto y hardware estructural resistente a impactos.",
    subtitle: "Chasis T700, brazos y repuestos",
    iconName: "SportsEsports",
    coverImage: COVER_IMAGES.DJI1,
    cacheKeys: ["Productos_Frames"],
    sortOrder: 9,
    showInBanner: true,
  },
  {
    id: "software",
    slug: "software",
    href: "/tienda/software/",
    title: "Software & Simuladores",
    navLabel: "Software",
    description:
      "Simuladores de vuelo FPV de alta fidelidad, software de fotogrametría y herramientas profesionales de diseño y telemetría.",
    subtitle: "Simuladores y fotogrametría",
    iconName: "Computer",
    coverImage: "",
    cacheKeys: [],
    sortOrder: 10,
    showInBanner: false,
  },
];

// ── Derived Data & Helpers ─────────────────────────────────────────

/** Categories enabled for the dynamic Home banner */
export const BANNER_CATEGORIES = CATEGORIES.filter((c) => c.showInBanner);

/** Lookup by URL slug */
export const getCategoryBySlug = (slug: string): CategoryConfig | undefined =>
  CATEGORIES.find((c) => c.slug === slug);

/** Lookup by Firestore category ID */
export const getCategoryById = (id: string): CategoryConfig | undefined =>
  CATEGORIES.find((c) => c.id === id);

/**
 * Generate the headerRoutes-compatible array from CATEGORIES.
 * Drop-in replacement for the legacy routes export.
 */
export const getHeaderRoutes = () =>
  CATEGORIES.map((c) => ({
    label: c.navLabel,
    value: c.sortOrder,
    href: c.href,
    slug: c.slug,
  }));
