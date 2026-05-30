import { useCallback, useEffect, useState } from "react";
import { defaultMenuData } from "../data/defaultMenu";
import { MENU_CACHE_UPDATED, readMenuCache, writeMenuCache } from "../lib/menuCache";
import type { MenuSection } from "../types/menu";

export function useMenuData() {
    const [menuData, setMenuData] = useState<MenuSection[]>(() => readMenuCache() ?? defaultMenuData);
    const [loading, setLoading] = useState(false);
    const [firebaseMessage, setFirebaseMessage] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setFirebaseMessage(null);
        try {
            const { fetchMenuDetailed } = await import("../api/menuService");
            const result = await fetchMenuDetailed();
            if (result.status === "ok") {
                setMenuData(result.sections);
                writeMenuCache(result.sections);
            } else {
                setFirebaseMessage(result.message);
            }
        } catch (err) {
            setFirebaseMessage(err instanceof Error ? err.message : "Failed to load menu");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const { fetchMenuDetailed } = await import("../api/menuService");
                const result = await fetchMenuDetailed();
                if (cancelled) return;

                if (result.status === "ok") {
                    setMenuData(result.sections);
                    writeMenuCache(result.sections);
                    setFirebaseMessage(null);
                } else {
                    setFirebaseMessage(result.message);
                }
            } catch (err) {
                if (!cancelled) {
                    setFirebaseMessage(err instanceof Error ? err.message : "Failed to load menu");
                }
            }
        })();

        const onCacheUpdate = () => {
            const cached = readMenuCache();
            if (cached) {
                setMenuData(cached);
                setFirebaseMessage(null);
            }
        };
        window.addEventListener(MENU_CACHE_UPDATED, onCacheUpdate);

        return () => {
            cancelled = true;
            window.removeEventListener(MENU_CACHE_UPDATED, onCacheUpdate);
        };
    }, []);

    return { menuData, loading, firebaseMessage, refresh };
}
