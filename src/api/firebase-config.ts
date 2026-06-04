import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";

function readApiKey(): string | undefined {
    const raw = import.meta.env.VITE_FIREBASE_API_KEY ?? import.meta.env.VITE_FIREBASE_API_KEY;
    if (typeof raw !== "string") return undefined;
    return raw.replace(/^["']|["']$/g, "").trim() || undefined;
}

export const firebaseApiKey = readApiKey();
export const isFirebaseConfigured = Boolean(firebaseApiKey);

// Initialize conditionally to prevent startup crashes when API key is missing (e.g. on Vercel deployments without env vars)
let appInstance: any = null;
let authInstance: any = null;
let dbInstance: any = null;
let storageInstance: any = null;

if (isFirebaseConfigured) {
    const firebaseConfig = {
        apiKey: firebaseApiKey,
        authDomain: "artisanal-restraunt.firebaseapp.com",
        projectId: "artisanal-restraunt",
        storageBucket: "artisanal-restraunt.firebasestorage.app",
        messagingSenderId: "130378194728",
        appId: "1:130378194728:web:aa13a40d89847c79077a1d",
        measurementId: "G-CGNSRCM4PG",
    };
    appInstance = initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
    // Long polling helps when WebChannel is blocked (school/corp networks, some ISPs)
    dbInstance = initializeFirestore(appInstance, {
        experimentalForceLongPolling: true,
    });
    storageInstance = getStorage(appInstance);

    isSupported().then((supported) => {
        if (supported && appInstance) getAnalytics(appInstance);
    });
} else if (import.meta.env.DEV) {
    console.error(
        "[Firebase] API key missing. Add FIREBASE_API_KEY=... to .env and restart the dev server (npm run dev)."
    );
}

export const app = appInstance;
export const auth = authInstance as unknown as Auth;
export const db = dbInstance as unknown as Firestore;
export const storage = storageInstance as unknown as FirebaseStorage;

