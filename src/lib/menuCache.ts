import { validateMenu } from "./menuValidation";
import type { MenuSection } from "../types/menu";

const CACHE_KEY = "artisanal-menu-cache";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

type CacheEntry = {
    data: MenuSection[];
    savedAt: number;
};

export function readMenuCache(): MenuSection[] | null {
    try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (!raw) return null;

        const entry = JSON.parse(raw) as CacheEntry;
        if (Date.now() - entry.savedAt > CACHE_TTL_MS) return null;
        return validateMenu(entry.data) ? entry.data : null;
    } catch {
        return null;
    }
}

export function writeMenuCache(sections: MenuSection[]): void {
    try {
        const entry: CacheEntry = { data: sections, savedAt: Date.now() };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch {
        // sessionStorage full or unavailable
    }
}

export function clearMenuCache(): void {
    try {
        sessionStorage.removeItem(CACHE_KEY);
    } catch {
        // ignore
    }
}

export const MENU_CACHE_UPDATED = "menu-cache-updated";
