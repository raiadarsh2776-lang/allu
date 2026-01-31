
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "../types";

// Safely access process.env
const getEnv = (key: string): string | undefined => {
  try {
    return (typeof process !== 'undefined' && process.env) ? (process.env[key] as string) : undefined;
  } catch {
    return undefined;
  }
};

const apiKey = getEnv('API_KEY');
const projectId = getEnv('PROJECT_ID');

// Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: getEnv('AUTH_DOMAIN') || (projectId ? `${projectId}.firebaseapp.com` : undefined),
  projectId: projectId,
  storageBucket: getEnv('STORAGE_BUCKET'),
  messagingSenderId: getEnv('MESSAGING_SENDER_ID'),
  appId: getEnv('APP_ID')
};

let dbInstance: any = null;

// Only initialize if we have the minimum requirements (Project ID)
// Note: We check PROJECT_ID specifically as API_KEY might be provided by the global environment polyfill
if (projectId) {
  try {
    const app = initializeApp(firebaseConfig);
    dbInstance = getFirestore(app);
  } catch (err) {
    console.error("Firebase Initialization Failed:", err);
  }
}

export const db = dbInstance;

/**
 * Syncs user data to Firestore for global admin tracking.
 */
export const syncUserToFirestore = async (user: User) => {
  if (!db) {
    console.warn("Firestore not initialized. Skipping sync.");
    return;
  }

  try {
    const userRef = doc(db, "users", user.id);
    await setDoc(userRef, {
      uid: user.id,
      name: user.name,
      email: user.email || null,
      phone: user.phone || null,
      authMethod: user.authMethod,
      isSubscribed: user.isSubscribed,
      loginTime: serverTimestamp(),
      lastActive: serverTimestamp(),
      platform: "web-mastery-portal"
    }, { merge: true });
  } catch (error) {
    console.error("Firestore Sync Error:", error);
  }
};
