/**
 * Parses Google Maps Geocoder Address Components into a structured object.
 * 
 * @param {Array} components - The address_components array from Google Maps API result.
 * @returns {Object} Structured address object { street, city, state, country, zipCode }
 */
export const parseAddressComponents = (components) => {
    let address = {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  
    let streetNumber = ''
    let route = ''
  
    components.forEach((component) => {
      const types = component.types
  
      if (types.includes('street_number')) {
        streetNumber = component.long_name
      }
  
      if (types.includes('route')) {
        route = component.long_name
      }
  
      if (types.includes('locality')) {
        address.city = component.long_name
      }
  
      // If locality is missing, try administrative_area_level_2 (common in some countries)
      if (!address.city && types.includes('administrative_area_level_2')) {
        address.city = component.long_name
      }
  
      if (types.includes('administrative_area_level_1')) {
        address.state = component.long_name
      }
  
      if (types.includes('country')) {
        address.country = component.long_name
      }
  
      if (types.includes('postal_code')) {
        address.zipCode = component.long_name
      }
    })
  
    // Combine route and street number for the 'street' field
    address.street = `${route} ${streetNumber}`.trim()
  
    return address
  }
