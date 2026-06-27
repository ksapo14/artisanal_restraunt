import {
    MENU_CATEGORIES,
    type MenuCategoryId,
    type MenuPage,
} from "../lib/menuAssets";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

type CloudinaryContext = {
    custom?: Record<string, string>;
} & Record<string, string | Record<string, string> | undefined>;

type CloudinaryResource = {
    public_id: string;
    version: number;
    format: string;
    created_at?: string;
    context?: CloudinaryContext;
};

type CloudinaryListResponse = {
    resources?: CloudinaryResource[];
    error?: {
        message?: string;
    };
};

type CloudinaryUploadResponse = {
    public_id?: string;
    secure_url?: string;
    version?: number;
    format?: string;
    error?: {
        message?: string;
    };
};

type MenuMetadata = {
    batch: string;
    pageNumber: number;
};

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

function requireCloudinaryConfig() {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error(
            "Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.",
        );
    }
    return { cloudName: CLOUD_NAME, uploadPreset: UPLOAD_PRESET };
}

function getContextValue(resource: CloudinaryResource, key: string): string | undefined {
    const custom = resource.context?.custom;
    if (custom && typeof custom[key] === "string") return custom[key];

    const direct = resource.context?.[key];
    return typeof direct === "string" ? direct : undefined;
}

function readMetadata(resource: CloudinaryResource): MenuMetadata | null {
    const contextBatch = getContextValue(resource, "menu_batch");
    const contextPage = Number(getContextValue(resource, "menu_page"));
    if (contextBatch && Number.isInteger(contextPage) && contextPage > 0) {
        return { batch: contextBatch, pageNumber: contextPage };
    }

    const match = resource.public_id.match(/\/(?:dinner|dessert)-(\d+)-page-(\d+)$/);
    if (!match) return null;

    return {
        batch: match[1],
        pageNumber: Number(match[2]),
    };
}

function getResourceUrl(cloudName: string, resource: CloudinaryResource): string {
    const encodedPublicId = resource.public_id
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
    return `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/image/upload/f_auto,q_auto:best/v${resource.version}/${encodedPublicId}.${resource.format}`;
}

export async function fetchMenuPages(
    categoryId: MenuCategoryId,
    cacheKey = Date.now(),
): Promise<MenuPage[]> {
    const { cloudName } = requireCloudinaryConfig();
    const tag = MENU_CATEGORIES[categoryId].tag;
    const response = await fetch(
        `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/image/list/${encodeURIComponent(tag)}.json?v=${cacheKey}`,
        { cache: "no-store" },
    );

    if (!response.ok) {
        if (response.status === 404) return [];
        if (response.status === 401) {
            throw new Error(
                "Cloudinary resource lists are disabled. Enable Resource list in Cloudinary Security settings.",
            );
        }
        throw new Error(`Unable to load menu images (${response.status}).`);
    }

    const payload = await response.json() as CloudinaryListResponse;
    if (payload.error) {
        throw new Error(payload.error.message || "Unable to load menu images.");
    }

    const resourcesWithMetadata = (payload.resources ?? [])
        .map((resource) => ({ resource, metadata: readMetadata(resource) }))
        .filter((entry): entry is { resource: CloudinaryResource; metadata: MenuMetadata } => (
            entry.metadata !== null
        ));

    const latestBatch = resourcesWithMetadata
        .map((entry) => entry.metadata.batch)
        .sort((left, right) => right.localeCompare(left, undefined, { numeric: true }))[0];

    if (!latestBatch) return [];

    return resourcesWithMetadata
        .filter((entry) => entry.metadata.batch === latestBatch)
        .sort((left, right) => left.metadata.pageNumber - right.metadata.pageNumber)
        .slice(0, 2)
        .map(({ resource, metadata }) => ({
            pageNumber: metadata.pageNumber,
            url: getResourceUrl(cloudName, resource),
        }));
}

export async function uploadMenuPage(
    categoryId: MenuCategoryId,
    batchId: string,
    pageNumber: number,
    file: File,
    onProgress?: (progress: number) => void,
): Promise<MenuPage> {
    const { cloudName, uploadPreset } = requireCloudinaryConfig();
    const category = MENU_CATEGORIES[categoryId];
    const publicId = `${categoryId}-${batchId}-page-${pageNumber}`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "artisanal-menu");
    formData.append("public_id", publicId);
    formData.append("tags", `artisanal-menu,${category.tag}`);
    formData.append(
        "context",
        `menu_batch=${batchId}|menu_page=${pageNumber}|menu_category=${categoryId}`,
    );

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                onProgress?.(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            let payload: CloudinaryUploadResponse = {};
            try {
                payload = JSON.parse(xhr.responseText) as CloudinaryUploadResponse;
            } catch {
                reject(new Error("Cloudinary returned an unreadable response."));
                return;
            }

            if (xhr.status >= 200 && xhr.status < 300 && payload.secure_url) {
                resolve({ pageNumber, url: payload.secure_url });
                return;
            }

            reject(new Error(payload.error?.message || "Cloudinary upload failed."));
        };

        xhr.onerror = () => reject(new Error("Network error during Cloudinary upload."));
        xhr.send(formData);
    });
}
