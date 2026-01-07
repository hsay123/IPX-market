// Firestore CRUD helpers for user records, images, stories, and metadata
// All operations are server-side only and gracefully fail if Firestore is unavailable

import { doc, setDoc, getDoc, updateDoc, query, collection, where, getDocs, Timestamp } from "firebase/firestore"
import { getFirestoreInstance } from "./firebase"

export interface UserRecord {
  id: string
  displayName?: string
  wallet?: string
  bio?: string
  avatar?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface ImageRecord {
  id: string
  url: string
  uploadTimestamp: Timestamp
  itemId: number
  itemType: "dataset" | "model"
  ownerWallet: string
}

export interface StoryRecord {
  id: string
  userStory?: string
  aiStory?: string
  itemId: number
  itemType: "dataset" | "model"
  createdAt: Timestamp
}

export interface MetadataRecord {
  itemId: number
  itemType: "dataset" | "model"
  tags: string[]
  caption: string
  safetyStatus: boolean | "approved" | "pending" | "flagged"
  vertexAiStory?: string
  vertexAiCaption?: string
  vertexAiTags?: string[]
  vertexAiConfidence?: number
  updatedAt: Timestamp
}

// User operations
export async function createOrUpdateUser(userId: string, data: Partial<UserRecord>): Promise<void> {
  try {
    const db = getFirestoreInstance()
    if (!db) {
      console.log("[v0] Firestore unavailable, skipping user creation")
      return
    }

    const userRef = doc(db, "users", userId)
    await setDoc(
      userRef,
      {
        ...data,
        updatedAt: Timestamp.now(),
      },
      { merge: true },
    )
    console.log("[v0] User record saved to Firestore:", userId)
  } catch (error) {
    console.warn("[v0] Failed to save user to Firestore:", error)
    // Graceful fallback - don't block operations
  }
}

export async function getUserRecord(userId: string): Promise<UserRecord | null> {
  try {
    const db = getFirestoreInstance()
    if (!db) return null

    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)
    return userSnap.exists() ? (userSnap.data() as UserRecord) : null
  } catch (error) {
    console.warn("[v0] Failed to fetch user from Firestore:", error)
    return null
  }
}

// Image operations
export async function saveImageRecord(imageData: ImageRecord): Promise<void> {
  try {
    const db = getFirestoreInstance()
    if (!db) {
      console.log("[v0] Firestore unavailable, skipping image record")
      return
    }

    const imageRef = doc(db, "images", imageData.id)
    await setDoc(imageRef, imageData)
    console.log("[v0] Image record saved to Firestore:", imageData.id)
  } catch (error) {
    console.warn("[v0] Failed to save image to Firestore:", error)
  }
}

export async function getImagesByItemId(itemId: number, itemType: "dataset" | "model"): Promise<ImageRecord[]> {
  try {
    const db = getFirestoreInstance()
    if (!db) return []

    const q = query(collection(db, "images"), where("itemId", "==", itemId), where("itemType", "==", itemType))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as ImageRecord)
  } catch (error) {
    console.warn("[v0] Failed to fetch images from Firestore:", error)
    return []
  }
}

// Story operations
export async function saveStoryRecord(storyData: StoryRecord): Promise<void> {
  try {
    const db = getFirestoreInstance()
    if (!db) {
      console.log("[v0] Firestore unavailable, skipping story record")
      return
    }

    const storyRef = doc(db, "stories", storyData.id)
    await setDoc(storyRef, storyData)
    console.log("[v0] Story record saved to Firestore:", storyData.id)
  } catch (error) {
    console.warn("[v0] Failed to save story to Firestore:", error)
  }
}

export async function getStoriesByItemId(itemId: number, itemType: "dataset" | "model"): Promise<StoryRecord[]> {
  try {
    const db = getFirestoreInstance()
    if (!db) return []

    const q = query(collection(db, "stories"), where("itemId", "==", itemId), where("itemType", "==", itemType))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as StoryRecord)
  } catch (error) {
    console.warn("[v0] Failed to fetch stories from Firestore:", error)
    return []
  }
}

// Metadata operations
export async function saveMetadata(metadataData: MetadataRecord): Promise<void> {
  try {
    const db = getFirestoreInstance()
    if (!db) {
      console.log("[v0] Firestore unavailable, skipping metadata")
      return
    }

    const metaRef = doc(db, "metadata", `${metadataData.itemType}_${metadataData.itemId}`)
    await setDoc(
      metaRef,
      {
        ...metadataData,
        updatedAt: Timestamp.now(),
      },
      { merge: true },
    )
    console.log("[v0] Metadata saved to Firestore:", metadataData.itemId)
  } catch (error) {
    console.warn("[v0] Failed to save metadata to Firestore:", error)
  }
}

export async function getMetadata(itemId: number, itemType: "dataset" | "model"): Promise<MetadataRecord | null> {
  try {
    const db = getFirestoreInstance()
    if (!db) return null

    const metaRef = doc(db, "metadata", `${itemType}_${itemId}`)
    const metaSnap = await getDoc(metaRef)
    return metaSnap.exists() ? (metaSnap.data() as MetadataRecord) : null
  } catch (error) {
    console.warn("[v0] Failed to fetch metadata from Firestore:", error)
    return null
  }
}

// Update Vertex AI analysis in Firestore
export async function updateVertexAiAnalysis(
  itemId: number,
  itemType: "dataset" | "model",
  analysis: {
    story?: string
    caption?: string
    tags?: string[]
    confidence?: number
  },
): Promise<void> {
  try {
    const db = getFirestoreInstance()
    if (!db) {
      console.log("[v0] Firestore unavailable, skipping Vertex AI metadata update")
      return
    }

    const metaRef = doc(db, "metadata", `${itemType}_${itemId}`)
    await updateDoc(metaRef, {
      vertexAiStory: analysis.story,
      vertexAiCaption: analysis.caption,
      vertexAiTags: analysis.tags || [],
      vertexAiConfidence: analysis.confidence || 0,
      updatedAt: Timestamp.now(),
    })
    console.log("[v0] Vertex AI analysis saved to Firestore:", itemId)
  } catch (error) {
    console.warn("[v0] Failed to update Vertex AI analysis in Firestore:", error)
  }
}
