// Firebase Firestore is used as a scalable, real-time database
// to store user content and AI-generated metadata.
// This integration is server-side only and does not affect UI behavior.

import { initializeApp, getApps } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"

let firestore: Firestore | null = null

export function initializeFirebase(): Firestore {
  if (firestore) return firestore

  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  }

  // Check if Firebase is properly configured
  if (!config.projectId) {
    console.warn("[v0] Firebase not configured - Firestore operations will be skipped")
    return null as any
  }

  const app = getApps().length === 0 ? initializeApp(config) : getApps()[0]
  firestore = getFirestore(app)

  console.log("[v0] Firebase Firestore initialized")
  return firestore
}

export function getFirestoreInstance(): Firestore | null {
  try {
    return firestore || initializeFirebase()
  } catch (error) {
    console.warn("[v0] Firestore not available:", error)
    return null
  }
}
