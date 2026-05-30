import type { MenuItem, MenuSection } from "../types/menu";

function isMenuItem(value: unknown): value is MenuItem {
    if (!value || typeof value !== "object") return false;
    const item = value as MenuItem;
    return (
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.description === "string" &&
        typeof item.price === "string" &&
        typeof item.image === "string"
    );
}

function isMenuSection(value: unknown): value is MenuSection {
    if (!value || typeof value !== "object") return false;
    const section = value as MenuSection;
    return (
        typeof section.id === "string" &&
        typeof section.title === "string" &&
        typeof section.color === "string" &&
        typeof section.bg === "string" &&
        Array.isArray(section.items) &&
        section.items.every(isMenuItem)
    );
}

export function validateMenu(sections: unknown): sections is MenuSection[] {
    return Array.isArray(sections) && sections.length > 0 && sections.every(isMenuSection);
}
