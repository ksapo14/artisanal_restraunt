export function formatFirebaseError(err: unknown): string {
    if (!err || typeof err !== "object") return "Unknown Firebase error";

    const code = "code" in err ? String((err as { code: string }).code) : "";
    const message = "message" in err ? String((err as { message: string }).message) : "";

    switch (code) {
        case "permission-denied":
            return "Firestore permission denied. Deploy firestore.rules with allow read: if true for menu.";
        case "unavailable":
            return "Firestore unavailable. Check internet connection and Firebase project status.";
        case "failed-precondition":
            return "Firestore database not ready. Create a Firestore database in Firebase Console (production mode).";
        case "not-found":
            return "Firestore database not found. Enable Firestore for project artisanal-restraunt.";
        default:
            return message || code || "Firebase request failed";
    }
}
