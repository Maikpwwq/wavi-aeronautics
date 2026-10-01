/**
 * Firebase Admin SDK — Server-Side Singleton
 *
 * Production-safe initialization for Next.js API routes.
 * Uses GCP Application Default Credentials (ADC) which works in:
 *   - Firebase App Hosting / Cloud Run (automatic)
 *   - Local dev with `gcloud auth application-default login`
 *   - Explicit GOOGLE_APPLICATION_CREDENTIALS env var
 *
 * @module lib/firebaseAdminServer
 */

import {
  initializeApp,
  getApps,
  cert,
  applicationDefault,
  type App,
} from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECTID || 'wavi-aeronautics'

/**
 * Initialize or retrieve the Firebase Admin app singleton.
 *
 * Priority:
 *  1. FIREBASE_SERVICE_ACCOUNT_KEY env var (JSON string — useful for CI/Docker)
 *  2. GOOGLE_APPLICATION_CREDENTIALS env var (file path — standard GCP ADC)
 *  3. applicationDefault() (automatic in GCP-managed environments)
 */
function getAdminApp(): App {
  const existing = getApps()
  if (existing.length > 0) {
    return existing[0]
  }

  // Option 1: Explicit JSON string in env var (CI, Docker, Vercel)
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson)
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: PROJECT_ID,
      })
    } catch {
      console.error('[firebaseAdminServer] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY')
    }
  }

  // Option 2/3: ADC (GOOGLE_APPLICATION_CREDENTIALS file or GCP metadata)
  return initializeApp({
    credential: applicationDefault(),
    projectId: PROJECT_ID,
  })
}

/** Firebase Admin App singleton */
export const adminApp: App = getAdminApp()

/** Firestore Admin instance for server-side operations */
export const adminDb: Firestore = getFirestore(adminApp)
