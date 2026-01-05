/**
 * PSE (Pagos Seguros en Línea) Payment API Route
 * 
 * PSE is a Colombian bank transfer payment method.
 * This route creates a PSE payment through MercadoPago's payment API.
 * 
 * PSE requires:
 * - payment_method_id: "pse"
 * - transaction_details with financial_institution (bank code)
 * - payer with identification (CC number)
 * 
 * @see https://www.mercadopago.com.co/developers/es/docs/checkout-api/payment-methods/other-payment-methods
 */

// Request Schema for PSE Payment
const PSEPaymentRequestSchema = {
  transaction_amount: 0,        // Total amount (required)
  description: "string",        // Payment description
  payment_method_id: "pse",     // Always "pse" for PSE payments
  payer: {
    email: "string",            // Required
    entity_type: "individual",  // "individual" or "association"
    identification: {
      type: "CC",               // CC, CE, NIT
      number: "string"          // ID number (required for PSE)
    },
    first_name: "string",
    last_name: "string"
  },
  transaction_details: {
    financial_institution: "string" // Bank code (required for PSE)
  },
  callback_url: "string",       // URL to redirect after bank flow
  additional_info: {
    items: [
      {
        id: "string",
        title: "string",
        quantity: 1,
        unit_price: 0
      }
    ],
    payer: {
      first_name: "string",
      last_name: "string",
      phone: {
        number: "string"
      },
      address: {
        zip_code: "string",
        street_name: "string"
      }
    },
    shipments: {
      receiver_address: {
        zip_code: "string",
        street_name: "string",
        city_name: "string"
      }
    }
  }
};

// Fallback list of Colombian banks (used if MercadoPago API fails)
// Note: These codes should be updated if MercadoPago changes them
const PSE_BANKS_FALLBACK = [
  { id: "1007", name: "Bancolombia" },
  { id: "1009", name: "Banco Davivienda" },
  { id: "1013", name: "Banco BBVA" },
  { id: "1019", name: "Banco de Bogotá" },
  { id: "1040", name: "Banco de Occidente" },
  { id: "1052", name: "Banco AV Villas" },
  { id: "1051", name: "Banco Popular" },
  { id: "1006", name: "Banco Itaú" },
  { id: "1022", name: "Banco Caja Social" },
  { id: "1062", name: "Banco Falabella" },
  { id: "1063", name: "Banco Finandina" },
  { id: "1060", name: "Banco Pichincha" },
  { id: "1058", name: "Banco Procredit" },
  { id: "1066", name: "Banco Cooperativo Coopcentral" },
  { id: "1291", name: "Nequi" },
  { id: "1289", name: "Daviplata" },
  { id: "1059", name: "Bancamía" },
  { id: "1012", name: "Banco GNB Sudameris" },
  { id: "1061", name: "Banco Agrario" },
  { id: "1064", name: "Banco Mundo Mujer" },
  { id: "1065", name: "Banco W" },
  { id: "1069", name: "Lulo Bank" },
  { id: "1070", name: "Ualá" }
];

export default async function handler(req, res) {
  const accessToken = process.env.NEXT_PUBLIC_MERCADOPAGOS_ACCESS_TOKEN;

  // GET: Return list of available banks from MercadoPago API
  if (req.method === 'GET') {
    if (!accessToken) {
      console.warn("PSE: No access token, returning fallback banks");
      return res.status(200).json({ banks: PSE_BANKS_FALLBACK });
    }

    try {
      // Fetch PSE payment method details from MercadoPago
      const response = await fetch(
        'https://api.mercadopago.com/v1/payment_methods/search?site_id=MCO&payment_type_id=bank_transfer',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch banks from MercadoPago');
        return res.status(200).json({ banks: PSE_BANKS_FALLBACK });
      }

      const data = await response.json();
      
      // Find PSE method and extract financial institutions
      const pseMethod = data.results?.find(m => m.id === 'pse');
      
      if (pseMethod && pseMethod.financial_institutions) {
        const banks = pseMethod.financial_institutions.map(fi => ({
          id: fi.id,
          name: fi.description
        }));
        console.log('Fetched PSE banks from MercadoPago:', banks.length);
        return res.status(200).json({ banks });
      }

      // Fallback if PSE not found in results
      return res.status(200).json({ banks: PSE_BANKS_FALLBACK });
    } catch (err) {
      console.error('Error fetching PSE banks:', err);
      return res.status(200).json({ banks: PSE_BANKS_FALLBACK });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  if (!accessToken) {
    console.error("PSE: MERCADOPAGO_ACCESS_TOKEN not configured (PSE uses MercadoPago as processor)");
    return res.status(500).json({ error: 'Payment system not configured' });
  }

  try {
    const { 
      amount, 
      description, 
      payer, 
      financialInstitution, 
      items,
      shipments 
    } = req.body;

    // Get client IP address from request headers (required for PSE)
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
      || req.headers['x-real-ip'] 
      || req.socket?.remoteAddress 
      || '127.0.0.1';

    // Validate required fields for PSE
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }
    // Accept both 'email' and 'userMail' field names from frontend
    const payerEmail = payer?.email || payer?.userMail;
    if (!payerEmail) {
      return res.status(400).json({ error: 'Payer email is required' });
    }
    if (!payer?.identification?.number) {
      return res.status(400).json({ error: 'Payer identification number is required' });
    }
    if (!financialInstitution) {
      return res.status(400).json({ error: 'Financial institution (bank) is required' });
    }

    // Build PSE payment object
    const payment = {
      transaction_amount: parseFloat(amount),
      description: description || 'Compra en Wavi Aeronautics',
      payment_method_id: 'pse',
      payer: {
        email: payer.email || payer.userMail,
        entity_type: payer.entity_type || 'individual',
        identification: {
          type: payer.identification.type || 'CC',
          number: payer.identification.number
        },
        first_name: payer.first_name || payer.userName?.split(' ')[0] || '',
        last_name: payer.last_name || payer.userName?.split(' ').slice(1).join(' ') || ''
      },
      transaction_details: {
        financial_institution: financialInstitution
      },
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wavi-aeronautics.vercel.app'}/tienda/pse-resultado`,
      additional_info: {
        ip_address: clientIP,
        items: items?.map(item => ({
          id: item.productID || item.id,
          title: item.titulo || item.title,
          quantity: item.cantidad || item.quantity || 1,
          unit_price: parseFloat(item.unit_price || item.precio_numerico || 0)
        })) || [],
        payer: {
          first_name: payer.first_name || payer.userName?.split(' ')[0] || '',
          last_name: payer.last_name || payer.userName?.split(' ').slice(1).join(' ') || '',
          phone: {
            number: payer.phone?.number || payer.userPhone || ''
          },
          address: {
            zip_code: shipments?.shippingPostalCode || '',
            street_name: shipments?.shippingDirection || ''
          }
        },
        shipments: shipments ? {
          receiver_address: {
            zip_code: shipments.shippingPostalCode || '',
            street_name: shipments.shippingDirection || '',
            city_name: shipments.shippingCiudad || ''
          }
        } : undefined
      }
    };

    console.log('Creating PSE payment:', JSON.stringify(payment, null, 2));

    // Call MercadoPago Payments API (PSE is processed through MercadoPago)
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Idempotency-Key': `pse_${Date.now()}_${Math.random().toString(36).substring(7)}`
      },
      body: JSON.stringify(payment)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MercadoPago PSE API Error:', data);
      return res.status(response.status).json({ 
        error: 'Failed to create PSE payment',
        details: data 
      });
    }

    console.log('PSE payment created:', data.id, 'Status:', data.status);

    // Return payment data to frontend
    // PSE returns a redirect URL to the bank's page
    return res.status(200).json({
      id: data.id,
      status: data.status,
      status_detail: data.status_detail,
      external_resource_url: data.transaction_details?.external_resource_url,
      date_created: data.date_created
    });

  } catch (error) {
    console.error('Error creating PSE payment:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
