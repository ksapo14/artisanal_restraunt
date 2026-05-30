import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase-config";

export async function uploadMenuImage(file: File, itemId: string): Promise<string> {
    const path = `menu-images/${itemId}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}
