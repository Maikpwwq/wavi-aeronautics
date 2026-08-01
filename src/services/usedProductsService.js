import { firestore, storage } from '@/firebase/firebaseClient'
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import {
  USED_STATUS,
  LISTING_DURATION_MS,
  USED_PHOTO_CONSTRAINTS
} from '@/utilities/usedProductsConfig'

const COLLECTION_NAME = 'usedProducts'

/**
 * Upload multiple files to Firebase Storage under used-product-images/{userId}/{listingId}/
 * @param {string} userId 
 * @param {string} listingId 
 * @param {File[]} imageFiles 
 * @returns {Promise<string[]>} Array of download URLs
 */
export const uploadUsedProductImages = async (userId, listingId, imageFiles) => {
  if (!imageFiles || imageFiles.length === 0) return []

  const uploadPromises = imageFiles.map(async (file, index) => {
    // Unique filename
    const fileExt = file.name.split('.').pop() || 'jpg'
    const filePath = `used-product-images/${userId}/${listingId}/photo_${index + 1}_${Date.now()}.${fileExt}`
    const storageRef = ref(storage, filePath)

    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  })

  return Promise.all(uploadPromises)
}

/**
 * Create a new second-hand equipment listing
 * @param {Object} listingData 
 * @param {File[]} imageFiles 
 * @returns {Promise<Object>} Created document
 */
export const createUsedListing = async (listingData, imageFiles = []) => {
  try {
    const { sellerId, title, category, brand, condition, description, priceCop, contactPhone, sellerName, sellerEmail } = listingData

    if (!sellerId) throw new Error('Usuario no autenticado.')
    if (!title || !category || !condition || !description || priceCop === undefined) {
      throw new Error('Todos los campos requeridos deben completarse.')
    }

    if (imageFiles.length < USED_PHOTO_CONSTRAINTS.MIN_PHOTOS) {
      throw new Error(`Debes adjuntar al menos ${USED_PHOTO_CONSTRAINTS.MIN_PHOTOS} fotos del producto.`)
    }

    if (imageFiles.length > USED_PHOTO_CONSTRAINTS.MAX_PHOTOS) {
      throw new Error(`No puedes subir más de ${USED_PHOTO_CONSTRAINTS.MAX_PHOTOS} fotos.`)
    }

    const listingId = uuidv4()

    // 1. Upload photos to Firebase Storage
    const imageUrls = await uploadUsedProductImages(sellerId, listingId, imageFiles)

    // 2. Expiration date = Now + 60 days
    const nowMs = Date.now()
    const expiresAtMs = nowMs + LISTING_DURATION_MS
    const expiresAtTimestamp = Timestamp.fromMillis(expiresAtMs)

    const newListingPayload = {
      listingId,
      sellerId,
      sellerName: sellerName || 'Vendedor',
      sellerEmail: sellerEmail || '',
      contactPhone: contactPhone || '',
      title: title.trim(),
      category,
      brand: brand ? brand.trim() : 'Genérica',
      condition,
      description: description.trim(),
      priceCop: Number(priceCop),
      images: imageUrls,
      status: USED_STATUS.PENDING, // Visible publicly immediately, pending admin verification
      viewsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: expiresAtTimestamp
    }

    const docRef = doc(firestore, COLLECTION_NAME, listingId)
    await setDoc(docRef, newListingPayload)

    return { id: listingId, ...newListingPayload }
  } catch (error) {
    console.error('[usedProductsService] Error creating listing:', error)
    throw error
  }
}

/**
 * Fetch active (pending or verified) listings by category that have not expired
 * @param {string} categoryKey 
 * @returns {Promise<Array>} List of active used products
 */
export const fetchListingsByCategory = async (categoryKey) => {
  try {
    const collRef = collection(firestore, COLLECTION_NAME)
    const q = query(
      collRef,
      where('category', '==', categoryKey),
      where('status', 'in', [USED_STATUS.PENDING, USED_STATUS.VERIFIED]),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const now = Date.now()

    const results = snapshot.docs
      .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
      .filter(item => {
        // Filter out expired items in client JS if query didn't catch
        const expTime = item.expiresAt?.toMillis ? item.expiresAt.toMillis() : item.expiresAt
        return !expTime || expTime > now
      })

    return results
  } catch (error) {
    console.error('[usedProductsService] Error fetching by category:', error)
    return []
  }
}

/**
 * Fetch a single used product listing by ID
 * @param {string} listingId 
 */
export const fetchUsedListingById = async (listingId) => {
  try {
    const docRef = doc(firestore, COLLECTION_NAME, listingId)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() }
    }
    return null
  } catch (error) {
    console.error('[usedProductsService] Error fetching by ID:', error)
    throw error
  }
}

/**
 * Fetch all listings belonging to a specific seller
 * @param {string} sellerId 
 */
export const fetchUserListings = async (sellerId) => {
  try {
    if (!sellerId) return []
    const collRef = collection(firestore, COLLECTION_NAME)
    const q = query(
      collRef,
      where('sellerId', '==', sellerId),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
  } catch (error) {
    console.error('[usedProductsService] Error fetching user listings:', error)
    return []
  }
}

/**
 * Fetch all used listings for Admin dashboard (all statuses)
 */
export const fetchAdminAllUsedListings = async () => {
  try {
    const collRef = collection(firestore, COLLECTION_NAME)
    const q = query(collRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
  } catch (error) {
    console.error('[usedProductsService] Error fetching admin used listings:', error)
    return []
  }
}

/**
 * Mark listing as SOLD by seller
 * @param {string} listingId 
 */
export const markListingAsSold = async (listingId) => {
  try {
    const docRef = doc(firestore, COLLECTION_NAME, listingId)
    await updateDoc(docRef, {
      status: USED_STATUS.SOLD,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('[usedProductsService] Error marking as sold:', error)
    throw error
  }
}

/**
 * Renew listing for another 60 days
 * @param {string} listingId 
 */
export const renewListingDuration = async (listingId) => {
  try {
    const newExpiresAtMs = Date.now() + LISTING_DURATION_MS
    const newExpiresTimestamp = Timestamp.fromMillis(newExpiresAtMs)

    const docRef = doc(firestore, COLLECTION_NAME, listingId)
    await updateDoc(docRef, {
      expiresAt: newExpiresTimestamp,
      status: USED_STATUS.PENDING, // Restore to active pending if was expired
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('[usedProductsService] Error renewing listing:', error)
    throw error
  }
}

/**
 * Admin action: verify or disable listing
 * @param {string} listingId 
 * @param {string} newStatus ('verified' | 'disabled')
 * @param {string} rejectionReason (optional)
 */
export const updateListingStatusByAdmin = async (listingId, newStatus, rejectionReason = '') => {
  try {
    const docRef = doc(firestore, COLLECTION_NAME, listingId)
    const updateData = {
      status: newStatus,
      updatedAt: serverTimestamp()
    }
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }

    await updateDoc(docRef, updateData)
    return { success: true }
  } catch (error) {
    console.error('[usedProductsService] Error updating status by admin:', error)
    throw error
  }
}

/**
 * Delete listing and its storage images
 * @param {string} listingId 
 * @param {string[]} imageUrls 
 */
export const deleteUsedListing = async (listingId, imageUrls = []) => {
  try {
    // 1. Delete document from Firestore
    await deleteDoc(doc(firestore, COLLECTION_NAME, listingId))

    // 2. Best-effort delete images from Storage
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      const deletePromises = imageUrls.map(async (url) => {
        try {
          const imgRef = ref(storage, url)
          await deleteObject(imgRef)
        } catch (e) {
          console.warn('[usedProductsService] Storage delete notice:', e)
        }
      })
      await Promise.all(deletePromises)
    }

    return { success: true }
  } catch (error) {
    console.error('[usedProductsService] Error deleting listing:', error)
    throw error
  }
}
