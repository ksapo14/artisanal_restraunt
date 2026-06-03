import bgImg1 from "../assets/artisanal_full_restraunt_pic.jpg";
import bgImg2 from "../assets/restraunt_2.png";
import bgImg3 from "../assets/restraunt_3.png";

/**
 * Resolves menu item images.
 * Since the default menu data references local imported assets (which get compiled to hashed urls in production),
 * saving the menu to Firestore can store dev-specific paths like "/src/assets/restraunt_2.png" or relative paths.
 * This resolver maps dev paths or file names back to the statically imported production-ready assets, while
 * leaving custom uploaded URLs (like https://firebasestorage.googleapis.com) untouched.
 */
export function resolveMenuImage(imagePath: string | undefined | null): string {
    if (!imagePath) return "";

    // If it's a Firebase Storage URL or a base64 string, return it as-is
    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
        return imagePath;
    }

    const pathLower = imagePath.toLowerCase();

    if (pathLower.includes("artisanal_full_restraunt_pic") || pathLower.includes("bgimg1")) {
        return bgImg1;
    }
    if (pathLower.includes("restraunt_2") || pathLower.includes("bgimg2")) {
        return bgImg2;
    }
    if (pathLower.includes("restraunt_3") || pathLower.includes("bgimg3")) {
        return bgImg3;
    }

    return imagePath;
}
