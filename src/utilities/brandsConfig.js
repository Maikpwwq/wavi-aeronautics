/**
 * @typedef {Object} Brand
 * @property {string} id - Unique brand identifier
 * @property {string} name - Official brand display name
 * @property {string} logoUrl - Remote image asset URL
 * @property {string} slug - Slug used for filter redirect
 * @property {string[]} [aliases] - Alternative identifiers/names used in DB or search terms
 * @property {string} [tagline] - Optional short tagline or category specialism
 */

export const FEATURED_BRANDS = [
  {
    id: 'betafpv',
    name: 'BetaFPV',
    slug: 'betafpv',
    aliases: ['betafpv', 'beta-fpv', 'beta fpv'],
    logoUrl:
      'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2Fbetafpv_180x.webp?alt=media&token=d7998922-10cd-4fd9-9e92-017ee75383b9',
    tagline: 'Micro whoops, ELRS & drones para interiores',
  },
  {
    id: 'emax',
    name: 'EMAX',
    slug: 'emax',
    aliases: ['emax', 'emaxusa', 'emax-usa', 'emax usa'],
    logoUrl:
      'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2Femax_180x.webp?alt=media&token=39acf0cd-f868-484e-8fd5-89f6b0ce4682',
    tagline: 'Motores brushless de alta eficiencia y hélices',
  },
  {
    id: 'ethix',
    name: 'Ethix',
    slug: 'ethix',
    aliases: ['ethix'],
    logoUrl:
      'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2Fethix_180x.webp?alt=media&token=e0104ba0-f241-4cde-b239-0fc9460113f6',
    tagline: 'Equipamiento y accesorios diseñados por pilotos',
  },
  {
    id: 'flywoo',
    name: 'Flywoo',
    slug: 'flywoo',
    aliases: ['flywoo'],
    logoUrl:
      'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2Fflywoo_180x.webp?alt=media&token=4e99f533-5fa0-4602-a96e-074a2bde01ea',
    tagline: 'Drones ultraligeros para cinemática y long range',
  },
  {
    id: 'geprc',
    name: 'GEPRC',
    slug: 'geprc',
    aliases: ['geprc'],
    logoUrl:
      'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2Fgeprc_logo_180x.webp?alt=media&token=23cdfa1c-0027-4fea-9117-e946f8a4cce8',
    tagline: 'Chasis de fibra de carbono y drones Cinewhoop HD',
  },
  {
    id: 'iflight',
    name: 'iFlight',
    slug: 'iflight',
    aliases: ['iflight', 'iflight-rc', 'iflight rc'],
    logoUrl:
      'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2FiFlight_180x.webp?alt=media&token=100c394c-2b55-4d20-8701-42f7bc7241bf',
    tagline: 'Drones freestyle Nazgul y stacks SucceX',
  },
  {
    id: 'radiomaster',
    name: 'RadioMaster',
    slug: 'radiomaster',
    aliases: ['radiomaster', 'radio-master', 'radio master'],
    logoUrl:
      'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2FRadioMaster.webp?alt=media&token=d3b4ad81-7180-4bed-b74c-9d2279276c3c',
    tagline: 'Radios y transmisores multiprotocolo EdgeTX / ELRS',
  },
  {
    id: 'tbs',
    name: 'TBS',
    slug: 'tbs',
    aliases: [
      'tbs',
      'team-blacksheep',
      'team blacksheep',
      'team-black-sheep',
      'teamblacksheep',
    ],
    logoUrl:
      'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2FTBS.webp?alt=media&token=529dc8dd-b142-458c-bb44-e365a75fb4f3',
    tagline: 'Team BlackSheep: Crossfire & Tracer de ultra largo alcance',
  },
]

/**
 * Normalizes a string for loose brand matching (lowercase, no dashes/underscores/spaces).
 * @param {string} str
 * @returns {string}
 */
export const cleanBrandString = (str) => {
  if (!str || typeof str !== 'string') return ''
  return str
    .toLowerCase()
    .trim()
    .replace(/[-_\s]+/g, '')
}

/**
 * Returns all alias variations (including normalized forms) for a given brand name or slug.
 * @param {string} brandOrTerm
 * @returns {string[]}
 */
export const getBrandAliases = (brandOrTerm) => {
  if (!brandOrTerm || typeof brandOrTerm !== 'string') return []
  const cleanInput = cleanBrandString(brandOrTerm)

  const matchedBrand = FEATURED_BRANDS.find(
    (b) =>
      cleanBrandString(b.id) === cleanInput ||
      cleanBrandString(b.name) === cleanInput ||
      cleanBrandString(b.slug) === cleanInput ||
      (b.aliases && b.aliases.some((a) => cleanBrandString(a) === cleanInput))
  )

  if (!matchedBrand) {
    return [brandOrTerm.toLowerCase().trim(), cleanInput]
  }

  const all = [
    matchedBrand.id,
    matchedBrand.name,
    matchedBrand.slug,
    ...(matchedBrand.aliases || []),
  ]

  return Array.from(new Set(all.map((item) => item.toLowerCase().trim())))
}

/**
 * Checks if a product's brand matches a target brand or search term, taking aliases into account.
 * E.g. matchesBrand('team-blacksheep', 'tbs') => true
 * @param {string} productBrand
 * @param {string} targetBrand
 * @returns {boolean}
 */
export const matchesBrand = (productBrand, targetBrand) => {
  if (!productBrand || !targetBrand) return false
  const cleanP = cleanBrandString(productBrand)
  const cleanT = cleanBrandString(targetBrand)

  if (cleanP === cleanT || cleanP.includes(cleanT) || cleanT.includes(cleanP)) {
    return true
  }

  const targetAliases = getBrandAliases(targetBrand)
  return targetAliases.some((alias) => {
    const cleanAlias = cleanBrandString(alias)
    return (
      cleanP === cleanAlias ||
      cleanP.includes(cleanAlias) ||
      cleanAlias.includes(cleanP)
    )
  })
}
