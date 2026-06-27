export const MENU_CATEGORIES = {
    dinner: {
        id: "dinner",
        title: "Dinner Menu",
        eyebrow: "Prix Fixe Dining",
        tag: "artisanal-menu-dinner",
    },
    dessert: {
        id: "dessert",
        title: "Dessert Menu",
        eyebrow: "The Final Course",
        tag: "artisanal-menu-dessert",
    },
} as const;

export type MenuCategoryId = keyof typeof MENU_CATEGORIES;

export type MenuPage = {
    pageNumber: number;
    url: string;
};
