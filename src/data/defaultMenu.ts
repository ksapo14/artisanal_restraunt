import type { MenuSection } from "../types/menu";
import bgImg1 from "../assets/artisanal_full_restraunt_pic.jpg";
import bgImg2 from "../assets/restraunt_2.png";
import bgImg3 from "../assets/restraunt_3.png";

export const defaultMenuData: MenuSection[] = [
    {
        id: "starters",
        title: "Starters",
        color: "#dac464",
        bg: "#1c170a",
        items: [
            { id: "s1", name: "Heirloom Tomato & Burrata", description: "Balsamic pearls, basil oil, artisanal sourdough toast.", price: "$18", image: bgImg1 },
            { id: "s2", name: "Crispy Octopus", description: "Smoked paprika, lemon herb aioli, Spanish chorizo.", price: "$22", image: bgImg2 },
            { id: "s3", name: "Truffle Mushroom Risotto", description: "Wild forest mushrooms, parmesan crisps, white truffle oil.", price: "$20", image: bgImg3 },
            { id: "s4", name: "Wagyu Beef Carpaccio", description: "Caper berries, baby arugula, freshly shaved horseradish.", price: "$24", image: bgImg1 },
        ],
    },
    {
        id: "mains",
        title: "Main Courses",
        color: "#a68a7b",
        bg: "#1b1412",
        items: [
            { id: "m1", name: "Pan-Seared Scallops", description: "Cauliflower silk, crispy pancetta, sage brown butter.", price: "$38", image: bgImg2 },
            { id: "m2", name: "Roasted Rack of Lamb", description: "Mint gremolata, glazed baby carrots, red wine reduction.", price: "$46", image: bgImg3 },
            { id: "m3", name: "Herb-Crusted Halibut", description: "Seasonal asparagus, lemon-caper beurre blanc.", price: "$42", image: bgImg1 },
            { id: "m4", name: "Dry-Aged Ribeye", description: "Roasted garlic confit, bone marrow butter, smoked sea salt.", price: "$58", image: bgImg2 },
        ],
    },
    {
        id: "desserts",
        title: "Desserts",
        color: "#d48888",
        bg: "#1a0f0f",
        items: [
            { id: "d1", name: "Dark Chocolate Fondant", description: "Warm center, raspberry coulis, vanilla bean gelato.", price: "$14", image: bgImg3 },
            { id: "d2", name: "Lemon Yuzu Tart", description: "Toasted Italian meringue, citrus zest, buttery shortbread.", price: "$12", image: bgImg1 },
            { id: "d3", name: "Pistachio Panna Cotta", description: "Local honeycomb, candied pistachios, hint of rose water.", price: "$13", image: bgImg2 },
            { id: "d4", name: "Artisanal Cheese Board", description: "Selection of local cheeses, fig jam, artisanal crackers.", price: "$19", image: bgImg3 },
        ],
    },
];
