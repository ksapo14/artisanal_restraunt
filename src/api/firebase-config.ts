import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

function readApiKey(): string | undefined {
    const raw = import.meta.env.VITE_FIREBASE_API_KEY ?? import.meta.env.FIREBASE_API_KEY;
    if (typeof raw !== "string") return undefined;
    return raw.replace(/^["']|["']$/g, "").trim() || undefined;
}

export const firebaseApiKey = readApiKey();

const firebaseConfig = {
    apiKey: import.meta.env.FIREBASE_API_KEY,
    authDomain: "artisanal-restraunt.firebaseapp.com",
    projectId: "artisanal-restraunt",
    storageBucket: "artisanal-restraunt.firebasestorage.app",
    messagingSenderId: "130378194728",
    appId: "1:130378194728:web:aa13a40d89847c79077a1d",
    measurementId: "G-CGNSRCM4PG",
};

export const isFirebaseConfigured = Boolean(firebaseApiKey);

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Long polling helps when WebChannel is blocked (school/corp networks, some ISPs)
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

export const storage = getStorage(app);

if (import.meta.env.DEV && !isFirebaseConfigured) {
    console.error(
        "[Firebase] API key missing. Add FIREBASE_API_KEY=... to .env and restart the dev server (npm run dev)."
    );
}

isSupported().then((supported) => {
    if (supported) getAnalytics(app);
});
