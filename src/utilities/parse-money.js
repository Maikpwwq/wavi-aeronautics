const parsePrices = (productos) => {
  if (productos) {
    productos.map((product, index, array) => {
      if (
        typeof parseInt(product.precio) === 'number' &&
        product.precio !== 'Agotado'
      ) {
        const dolarPrice = parseInt(process.env.NEXT_PUBLIC_DOLARTOCOP)
        const trasportBase = 30 // USD
        const factorImportation = 1.5
        const dolarToCop = (parseInt(product.precio) + trasportBase) * factorImportation * dolarPrice
        array[index].precio = dolarToCop.toLocaleString(
          'es-CO', { style: 'currency', currency: 'COP' })
      }
    })
    return productos
  }
}

export default parsePrices
