import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase-config";
import { defaultMenuData } from "../data/defaultMenu";
import { formatFirebaseError } from "../lib/firebaseErrors";
import { normalizeMenu } from "../lib/menuNormalization";
import { validateMenu } from "../lib/menuValidation";
import type { MenuSection } from "../types/menu";

const MENU_REF = doc(db, "menu", "current");

export { validateMenu };

const FETCH_TIMEOUT_MS = 15_000;

export type MenuFetchResult =
    | { status: "ok"; sections: MenuSection[] }
    | { status: "empty"; message: string }
    | { status: "invalid"; message: string }
    | { status: "error"; message: string };

export async function fetchMenuDetailed(): Promise<MenuFetchResult> {
    if (!isFirebaseConfigured) {
        return {
            status: "error",
            message: "Firebase API key missing. Set FIREBASE_API_KEY in .env and restart npm run dev.",
        };
    }

    try {
        const snapshot = await Promise.race([
            getDoc(MENU_REF),
            new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error("Menu fetch timed out after 15s")), FETCH_TIMEOUT_MS);
            }),
        ]);

        if (!snapshot.exists()) {
            return {
                status: "empty",
                message: 'No menu document yet. In /admin sign in and click "Save to Firebase" or "Reset to defaults".',
            };
        }

        const data = snapshot.data();
        const sections = data.sections;

        if (validateMenu(sections)) {
            return { status: "ok", sections };
        }

        const normalized = normalizeMenu(sections);
        if (normalized) {
            return { status: "ok", sections: normalized };
        }

        return {
            status: "invalid",
            message: "Menu document exists but data shape is invalid. Re-save from /admin.",
        };
    } catch (err) {
        return {
            status: "error",
            message: formatFirebaseError(err),
        };
    }
}

export async function fetchMenu(): Promise<MenuSection[] | null> {
    const result = await fetchMenuDetailed();
    if (result.status === "ok") return result.sections;

    if (import.meta.env.DEV) {
        console.warn("[Menu] Firebase:", result.message);
    }
    return null;
}

export async function saveMenu(sections: MenuSection[]): Promise<void> {
    await setDoc(MENU_REF, {
        sections,
        updatedAt: new Date().toISOString(),
    });
}

export async function publishDefaultMenu(): Promise<MenuSection[]> {
    const sections = structuredClone(defaultMenuData);
    await saveMenu(sections);
    return sections;
}

export function createId(prefix: string): string {
    return `${prefix}-${crypto.randomUUID()}`;
}
