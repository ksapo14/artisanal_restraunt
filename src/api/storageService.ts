/**
 * Cloudinary Storage Service
 * Uses the unsigned upload API for free image hosting.
 */

// These should be set in your .env file or Vercel dashboard
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "YOUR_UPLOAD_PRESET";

export async function uploadMenuImage(
    file: File, 
    itemId: string, 
    onProgress?: (progress: number) => void
): Promise<string> {
    if (CLOUD_NAME === "YOUR_CLOUD_NAME") {
        throw new Error("Cloudinary Cloud Name is not configured. Add VITE_CLOUDINARY_CLOUD_NAME to .env");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", `menu-items/${itemId}`);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const progress = (event.loaded / event.total) * 100;
                onProgress(progress);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                // Return the secure URL from Cloudinary
                resolve(response.secure_url);
            } else {
                const error = JSON.parse(xhr.responseText);
                reject(new Error(error.error?.message || "Cloudinary upload failed"));
            }
        };

        xhr.onerror = () => reject(new Error("Network error during Cloudinary upload"));
        xhr.send(formData);
    });
}
