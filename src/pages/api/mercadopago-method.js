/**
 * MercadoPago Checkout Preferences API Route
 * 
 * Creates a MercadoPago Checkout Pro preference for redirecting users to payment.
 * This route handles the server-side API call to avoid CORS issues.
 * 
 * @see https://www.mercadopago.com.co/developers/es/reference/preferences/_checkout_preferences/post
 */

// Request Schema
const PreferenceRequestSchema = {
  // Cart items
  items: [
    {
      id: "string",           // Product ID
      title: "string",        // Product title (required)
      description: "string",  // Product description
      picture_url: "string",  // Product image URL
      quantity: 1,            // Quantity (required, integer > 0)
      currency_id: "COP",     // Currency (COP for Colombia)
      unit_price: 0           // Unit price (required, number)
    }
  ],
  // Payer information
  payer: {
    name: "string",
    surname: "string",
    email: "string",          // Required
    phone: {
      area_code: "string",
      number: "string"
    },
    identification: {
      type: "CC",             // CC, CE, NIT, etc
      number: "string"
    },
    address: {
      zip_code: "string",
      street_name: "string",
      street_number: "string"
    }
  },
  // Shipping information
  shipments: {
    mode: "not_specified",    // "custom", "me2", "not_specified"
    free_shipping: false,
    receiver_address: {
      zip_code: "string",
      street_name: "string",
      street_number: "string",
      city_name: "string",
      state_name: "string"
    }
  },
  // URLs for redirect after payment
  back_urls: {
    success: "string",
    failure: "string", 
    pending: "string"
  },
  auto_return: "approved",    // "approved", "all"
  external_reference: "string", // Your order ID
  notification_url: "string"    // Webhook URL for payment notifications
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.error("MERCADOPAGO_ACCESS_TOKEN not configured");
    return res.status(500).json({ error: 'Payment system not configured' });
  }

  try {
    const { items, payer, shipments, externalReference } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Build preference object
    const preference = {
      items: items.map(item => ({
        id: item.productID || item.id,
        title: item.titulo || item.title,
        description: item.descripcion || item.description || '',
        picture_url: item.imagenes?.[0] || item.picture_url || '',
        quantity: item.cantidad || item.quantity || 1,
        currency_id: 'COP',
        unit_price: parseFloat(item.unit_price || item.precio_numerico || 0)
      })),
      payer: payer ? {
        name: payer.name || payer.userName || '',
        email: payer.email || payer.userMail || '',
        phone: payer.phone ? {
          number: payer.phone.number || payer.phone || ''
        } : undefined,
        address: payer.address ? {
          zip_code: payer.address.zip_code || payer.address.shippingPostalCode || '',
          street_name: payer.address.street_name || payer.address.shippingDirection || ''
        } : undefined
      } : undefined,
      shipments: shipments ? {
        mode: 'not_specified',
        free_shipping: true,
        receiver_address: {
          zip_code: shipments.zip_code || shipments.shippingPostalCode || '',
          street_name: shipments.street_name || shipments.shippingDirection || '',
          city_name: shipments.city_name || shipments.shippingCiudad || ''
        }
      } : undefined,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wavi-aeronautics.vercel.app'}/tienda/pago-exitoso`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wavi-aeronautics.vercel.app'}/tienda/pago-fallido`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wavi-aeronautics.vercel.app'}/tienda/pago-pendiente`
      },
      auto_return: 'approved',
      external_reference: externalReference || `order_${Date.now()}`,
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wavi-aeronautics.vercel.app'}/api/mercadopago-webhook`
    };

    console.log('Creating MercadoPago preference:', JSON.stringify(preference, null, 2));

    // Call MercadoPago API
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(preference)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MercadoPago API Error:', data);
      return res.status(response.status).json({ 
        error: 'Failed to create payment preference',
        details: data 
      });
    }

    console.log('MercadoPago preference created:', data.id);

    // Return preference data to frontend
    return res.status(200).json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point
    });

  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
