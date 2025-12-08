'use client'
import { firestore, auth } from '@/firebase/firebaseClient'
import { calculateCopPrice } from '@/utilities/priceUtils'
import { collection, getDocs, query, where, documentId } from 'firebase/firestore'
import PropTypes from 'prop-types'

// Helper to define all collections once
const getProductCollections = (db) => {
  const rootParams = [
    ['productos', 'dron', 'kit_fpv_dron'],
    ['productos', 'dron', 'RC'],
    ['productos', 'dron', 'geprc'],
    ['productos', 'Googles', 'Betafpv'],
    ['productos', 'Googles', 'DJI'],
    ['productos', 'Googles', 'Emaxusa'],
    ['productos', 'Googles', 'FatShark'],
    ['productos', 'Googles', 'Iflight-rc'],
    ['productos', 'Googles', 'Walksnail'],
    // Radio Control - Betafpv
    ['productos', 'radio_control', 'betafpv/baterias/2PCS-2s-300mAh'],
    ['productos', 'radio_control', 'betafpv/control-remoto/lite-radio2'],
    ['productos', 'radio_control', 'betafpv/control-remoto/lite-radio3'],
    ['productos', 'radio_control', 'betafpv/control-remoto/lite-radio3-pro'],
    ['productos', 'radio_control', 'betafpv/receptor/BETAFPV-ELRS'],
    // Radio Control - Eachine
    ['productos', 'radio_control', 'eachine/baterias/E520S-1200mAh'],
    ['productos', 'radio_control', 'eachine/baterias/E58-500mAh'],
    ['productos', 'radio_control', 'eachine/control-remoto/liteRadio-2.4G'],
    ['productos', 'radio_control', 'eachine/control-remoto/FPV-EX5/'],
    // Radio Control - EmaxUsa
    ['productos', 'radio_control', 'emax-usa/baterias/1S-300mAh'],
    ['productos', 'radio_control', 'emax-usa/baterias/1S-450mAh'],
    ['productos', 'radio_control', 'emax-usa/baterias/2PCS-2S-300mAh'],
    ['productos', 'radio_control', 'emax-usa/control-remoto/E8'],
    // Radio Control - Flysky
    ['productos', 'radio_control', 'flysky/receptor/Flysky-FS-X14S-V2'],
    ['productos', 'radio_control', 'flysky/receptor/Flysky-FS-iA8X'],
    // Radio Control - Flywoo
    ['productos', 'radio_control', 'flywoo/baterias/4PCS-1S-450mAh'],
    ['productos', 'radio_control', 'flywoo/baterias/4PCS-1S-750mAh'],
    ['productos', 'radio_control', 'flywoo/control-remoto/LiteRadio-V3-ELRS'],
    ['productos', 'radio_control', 'flywoo/control-remoto/LiteRadio-V3-TBS'],
    ['productos', 'radio_control', 'flywoo/receptor/Flywoo-ELRS'],
    // Radio Control - Frsky
    ['productos', 'radio_control', 'frsky/receptor/Frsky_R-XSR'],
    ['productos', 'radio_control', 'frsky/receptor/Frsky_XM+'],
    // Radio Control - Geprc
    ['productos', 'radio_control', 'geprc/baterias/4S-650a850mAh'],
    ['productos', 'radio_control', 'geprc/control-remoto/tinyRadio-GR8'],
    // Radio Control - Iflightrc
    ['productos', 'radio_control', 'iflight-rc/baterias/3S-450mAh'],
    ['productos', 'radio_control', 'iflight-rc/cargadores/M4-AC30-1-4S'],
    ['productos', 'radio_control', 'iflight-rc/control-remoto/C8-ELRS'],
    ['productos', 'radio_control', 'iflight-rc/control-remoto/iF8-E'],
    ['productos', 'radio_control', 'iflight-rc/receptor/iFlight-R81-SPI'],
    // Radio Control - Radiomaster
    ['productos', 'radio_control', 'radio-master/control-remoto/T8-Lite'],
    ['productos', 'radio_control', 'radio-master/control-remoto/T8-Pro'],
    ['productos', 'radio_control', 'radio-master/control-remoto/zorro'],
    ['productos', 'radio_control', 'radio-master/control-remoto/tx12'],
    ['productos', 'radio_control', 'radio-master/control-remoto/tx16s'],
    ['productos', 'radio_control', 'radio-master/control-remoto/tx16-Max'],
    ['productos', 'radio_control', 'radio-master/receptor/NANO-ELRS-EP2'],
    ['productos', 'radio_control', 'radio-master/receptor/RadioMaster-R81'],
    // Radio Control - Team Blacksheep
    ['productos', 'radio_control', 'team-blacksheep/control-remoto/ethix-mambo'],
    ['productos', 'radio_control', 'team-blacksheep/control-remoto/tango2pro'],
    ['productos', 'radio_control', 'team-blacksheep/control-remoto/tango2'],
    ['productos', 'radio_control', 'team-blacksheep/control-remoto/tbs-mambo'],
    ['productos', 'radio_control', 'team-blacksheep/receptor/Crossfire-Nano-Rx-SE'],
    ['productos', 'radio_control', 'team-blacksheep/receptor/Tracer-Nano-Rx'],
    ['productos', 'radio_control', 'team-blacksheep/receptor/Crossfire-Nano-RX'],
    ['productos', 'radio_control', 'team-blacksheep/receptor/Crossfire-Nano-Rx-Pro'],
    // Radio Control - Uruav
    ['productos', 'radio_control', 'uruav/baterias/1S-250mAh']
  ];

  return rootParams.map(pathParts => {
    if (pathParts.length === 3) {
      // e.g. products/dron/kit_fpv_dron
      // For deeper paths passed as single string in last arg
      return collection(db, pathParts[0], pathParts[1], pathParts[2]);
    }
    return collection(db, ...pathParts); 
  });
};

export const FirebaseCompareShoppingCartIds = async ({ products, updateCart }) => {
  try {
    const user = auth.currentUser;
    const userID = user ? user.uid : null;
    const shoppingCartID = typeof window !== 'undefined' ? sessionStorage.getItem('cartID') : null;
    
    // Safety check: if no user ID and no cart ID, nothing to do
    if (!userID && !shoppingCartID) {
      console.warn("FirebaseCompareShoppingCartIds: No UserID or CartID found.");
      return;
    }

    if (!products || products.length === 0) {
      return;
    }

    const productsInputMap = new Map();
    products.forEach(p => {
        productsInputMap.set(p.productID, p.cantidad);
    });

    const targetIds = Array.from(productsInputMap.keys());
    console.log("Looking for products with IDs:", targetIds);

    // Fetch all products (Optimized with Promise.all)
    // NOTE: Ideally we should query by ID, but since data structure is scattered, 
    // we fetch efficiently and filter in memory as per original logic.
    // We check sessionStorage for cache first to avoid Firestore reads on every cart update.
    
    let allProducts = [];
    const cachedProducts = typeof window !== 'undefined' ? sessionStorage.getItem('Todos los productos') : null;

    if (cachedProducts) {
      allProducts = JSON.parse(cachedProducts);
    } else {
       const collectionRefs = getProductCollections(firestore);
       const snapshots = await Promise.all(collectionRefs.map(ref => getDocs(ref)));
       
       snapshots.forEach(snap => {
         snap.forEach(doc => {
            allProducts.push(doc.data());
         });
       });
       
       if (typeof window !== 'undefined') {
         sessionStorage.setItem('Todos los productos', JSON.stringify(allProducts));
       }
    }

    // Filter and Hydrate
    const cartProducts = allProducts.filter(p => productsInputMap.has(p.productID))
      .map(p => {
        // Clone to avoid mutation of cached array
        const product = { ...p }; 
        const qty = productsInputMap.get(p.productID);
        
        // Calculate price
        // Note: product.precio from Firestore is likely a raw number or string. 
        // calculateCopPrice handles formatting.
        const formattedPrice = calculateCopPrice(product.precio);
        
        return {
           ...product,
           precio: formattedPrice,
           cantidad: qty
        };
      });
      
    if (cartProducts.length > 0) {
        // Calculate Totals
        let totalItems = 0;
        let totalSum = 0;
        
        cartProducts.forEach(p => {
           totalItems += p.cantidad;
           
           // Reverse calculate price for sum total (since we just formatted it)
           // ideally we should use the raw price for calculation, but keeping consistent with established logic
           // The original logic re-calculated sum from raw price.
           // Let's use the RAW price from the original 'p' object (from allProducts) for calculation if possible?
           // Actually, let's just use the logic from before:
           
           const rawPrice = parseInt(p.precio_base || p.precio); // fallback 
           // Wait, p.precio in Firestore IS the USD price usually.
           // Cop logic: (price + 30) * 1.5 * Exchange
           
           if (!isNaN(rawPrice) && p.precio !== 'Agotado') {
               const exchangeRate = parseInt(process.env.NEXT_PUBLIC_DOLARTOCOP || 4000);
               const transport = 30; 
               const factor = 1.5;
               const unitPriceCOP = (rawPrice + transport) * factor * exchangeRate;
               totalSum += unitPriceCOP * p.cantidad;
           }
        });

        // Update State
        const shoppingCartState = {
            productos: cartProducts,
            updated: true,
            items: totalItems,
            suma: totalSum,
            cartID: userID || shoppingCartID
        };

        console.log("Updating Cart State:", shoppingCartState);
        updateCart(shoppingCartState); // Update Context/Redux
        
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('cartProducts', totalItems);
            sessionStorage.setItem('cartSum', totalSum);
            sessionStorage.setItem('cartUpdated', 'actualizados-productos-context');
        }
    }

  } catch (error) {
    console.error("Error in FirebaseCompareShoppingCartIds:", error);
  }
};


FirebaseCompareShoppingCartIds.propTypes = {
  products: PropTypes.array.isRequired,
  updateCart: PropTypes.func.isRequired
}

export default FirebaseCompareShoppingCartIds
