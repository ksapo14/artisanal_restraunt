import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

function readApiKey(): string | undefined {
    const raw = import.meta.env.VITE_FIREBASE_API_KEY;
    if (typeof raw !== "string") return undefined;
    return raw.replace(/^["']|["']$/g, "").trim() || undefined;
}

export const firebaseApiKey = readApiKey();
export const isFirebaseConfigured = Boolean(firebaseApiKey);

let authInstance: Auth | null = null;

if (firebaseApiKey) {
    const app = initializeApp({
        apiKey: firebaseApiKey,
        authDomain: "artisanal-restraunt.firebaseapp.com",
        projectId: "artisanal-restraunt",
        appId: "1:130378194728:web:aa13a40d89847c79077a1d",
    });
    authInstance = getAuth(app);
} else if (import.meta.env.DEV) {
    console.error(
        "[Firebase] API key missing. Add VITE_FIREBASE_API_KEY to .env and restart the development server.",
    );
}

export const auth = authInstance;
