export type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
};

export type MenuSection = {
    id: string;
    title: string;
    color: string;
    bg: string;
    items: MenuItem[];
};

export type MenuDocument = {
    sections: MenuSection[];
    updatedAt?: string;
};
