import type { MenuItem, MenuSection } from "../types/menu";
import { validateMenu } from "./menuValidation";

export function normalizeMenu(sections: unknown): MenuSection[] | null {
    if (!Array.isArray(sections)) return null;

    const normalized: MenuSection[] = sections.map((raw, sIdx) => {
        const section = (raw ?? {}) as Record<string, unknown>;
        const itemsRaw = Array.isArray(section.items) ? section.items : [];

        const items: MenuItem[] = itemsRaw.map((rawItem, iIdx) => {
            const item = (rawItem ?? {}) as Record<string, unknown>;
            return {
                id: typeof item.id === "string" ? item.id : `item-${sIdx}-${iIdx}`,
                name: String(item.name ?? ""),
                description: String(item.description ?? ""),
                price: String(item.price ?? ""),
                image: String(item.image ?? ""),
            };
        });

        return {
            id: typeof section.id === "string" ? section.id : `section-${sIdx}`,
            title: String(section.title ?? "Section"),
            color: String(section.color ?? "#dac464"),
            bg: String(section.bg ?? "#1c170a"),
            items,
        };
    });

    return validateMenu(normalized) ? normalized : null;
}
