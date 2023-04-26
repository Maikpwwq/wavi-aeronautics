const parsePrices = (productos) => {
  if (productos) {
    productos.map((product, index, array) => {
      if (
        typeof parseInt(product.precio) === 'number' &&
        product.precio !== 'Agotado'
      ) {
        array[index].precio = parseInt(product.precio).toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP'
        })
      }
    })
    return productos
  }
}

export default parsePrices
