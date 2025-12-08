
const TRANSPORT_BASE_USD = 30;
const IMPORTATION_FACTOR = 1.5;

/**
 * Calculates the price in COP from a USD price.
 * @param {string|number} priceInUsd - Price in USD (can be string or number)
 * @returns {string} Formatted price in COP or original string if not a number/Agotado
 */
export const calculateCopPrice = (priceInUsd) => {
  if (!priceInUsd || priceInUsd === 'Agotado') {
    return 'Agotado';
  }

  // Handle "$ 100" or just "100"
  const numericPrice = typeof priceInUsd === 'string'
    ? parseInt(priceInUsd.replace(/[^0-9.-]+/g,""))
    : priceInUsd;

  if (isNaN(numericPrice)) {
    return priceInUsd;
  }

  const exchangeRateStr = process.env.NEXT_PUBLIC_DOLARTOCOP;
  const rate = parseInt(exchangeRateStr);
  
  if (isNaN(rate)) {
    console.warn("Invalid exchange rate (NEXT_PUBLIC_DOLARTOCOP) provided to calculateCopPrice", exchangeRateStr);
    return priceInUsd;
  }

  const finalPrice = (numericPrice + TRANSPORT_BASE_USD) * IMPORTATION_FACTOR * rate;

  return finalPrice.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

/**
 * Parses a COP currency string (e.g. "$ 2.212.650") back to a number.
 * @param {string|number} priceStr - The price string or number
 * @returns {number} The numeric value
 */
export const parseCopCurrency = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  
  // Remove non-numeric characters (except possible minus sign if needed, but price is usually positive)
  const numericString = priceStr.replace(/[^0-9]/g, '');
  const parsed = parseInt(numericString, 10);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Mutates an array of products to update their price to COP.
 * @param {Array} products - Array of product objects
 */
export const parseProductPrices = (products) => {
  if (!products || !Array.isArray(products)) return;
  
  products.forEach(product => {
    if (product.precio && product.precio !== 'Agotado') {
      product.precio = calculateCopPrice(product.precio);
    }
  });
};
