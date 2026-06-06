import { useEffect, useState } from "react";
import { Link } from "react-router";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../api/firebase-config";
import { createId, fetchMenuDetailed, publishDefaultMenu, saveMenu } from "../api/menuService";
import { resolveMenuImage } from "../utils/imageResolver";
import { formatFirebaseError } from "../lib/firebaseErrors";
import { uploadMenuImage } from "../api/storageService";
import { defaultMenuData } from "../data/defaultMenu";
import { MENU_CACHE_UPDATED, writeMenuCache } from "../lib/menuCache";
import type { MenuItem, MenuSection } from "../types/menu";

function notifyMenuUpdated(sections: MenuSection[]) {
    writeMenuCache(sections);
    window.dispatchEvent(new CustomEvent(MENU_CACHE_UPDATED));
}

function emptyItem(): MenuItem {
    return { id: createId("item"), name: "", description: "", price: "", image: "" };
}

export default function Admin() {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState<string | null>(null);

    const [menu, setMenu] = useState<MenuSection[]>([]);
    const [menuLoading, setMenuLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [menuPublished, setMenuPublished] = useState(true);

    useEffect(() => {
        if (!isFirebaseConfigured || !auth) {
            setAuthLoading(false);
            return;
        }
        return onAuthStateChanged(auth, (nextUser) => {
            setUser(nextUser);
            setAuthLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!user) return;

        const load = async () => {
            setMenuLoading(true);
            const result = await fetchMenuDetailed();
            if (result.status === "ok") {
                setMenu(result.sections);
                setMenuPublished(true);
                setLoadError(null);
            } else {
                setMenu(structuredClone(defaultMenuData));
                setMenuPublished(result.status !== "empty");
                setLoadError(result.status === "empty" ? null : result.message);
            }
            setMenuLoading(false);
        };

        load();
    }, [user]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        if (!isFirebaseConfigured || !auth) {
            setAuthError("Firebase Authentication is not configured.");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : "Sign in failed");
        }
    };

    const handleLogout = () => {
        if (!isFirebaseConfigured || !auth) return;
        signOut(auth);
    };

    const updateSection = (sectionId: string, patch: Partial<MenuSection>) => {
        setMenu((prev) => prev.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)));
        setStatus(null);
    };

    const updateItem = (sectionId: string, itemId: string, patch: Partial<MenuItem>) => {
        setMenu((prev) =>
            prev.map((s) =>
                s.id === sectionId
                    ? { ...s, items: s.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)) }
                    : s
            )
        );
        setStatus(null);
    };

    const addItem = (sectionId: string) => {
        setMenu((prev) =>
            prev.map((s) => (s.id === sectionId ? { ...s, items: [...s.items, emptyItem()] } : s))
        );
        setStatus(null);
    };

    const removeItem = (sectionId: string, itemId: string) => {
        setMenu((prev) =>
            prev.map((s) =>
                s.id === sectionId ? { ...s, items: s.items.filter((item) => item.id !== itemId) } : s
            )
        );
        setStatus(null);
    };

    const addSection = () => {
        setMenu((prev) => [
            ...prev,
            { id: createId("section"), title: "New Section", color: "#dac464", bg: "#1c170a", items: [] },
        ]);
        setStatus(null);
    };

    const removeSection = (sectionId: string) => {
        if (menu.length <= 1) return;
        setMenu((prev) => prev.filter((s) => s.id !== sectionId));
        setStatus(null);
    };

    const handleImageUpload = async (sectionId: string, itemId: string, file: File) => {
        setUploadingId(itemId);
        setUploadProgress(0);
        setStatus(null);
        try {
            const url = await uploadMenuImage(file, itemId, (progress) => {
                setUploadProgress(Math.round(progress));
            });
            updateItem(sectionId, itemId, { image: url });
            setStatus("Image uploaded successfully.");
        } catch (err) {
            setStatus(err instanceof Error ? err.message : "Image upload failed");
        } finally {
            setUploadingId(null);
            setUploadProgress(0);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus(null);
        try {
            await saveMenu(menu);
            setMenuPublished(true);
            notifyMenuUpdated(menu);
            setLoadError(null);
            setStatus("Menu saved. Changes are live on the menu page.");
        } catch (err) {
            setStatus(formatFirebaseError(err));
        } finally {
            setSaving(false);
        }
    };

    const handlePublishDefaults = async (skipConfirm = false) => {
        if (
            !skipConfirm &&
            menuPublished &&
            !window.confirm("Overwrite Firebase menu with built-in defaults?")
        ) {
            return;
        }
        setSaving(true);
        setStatus(null);
        try {
            const sections = await publishDefaultMenu();
            setMenu(sections);
            setMenuPublished(true);
            notifyMenuUpdated(sections);
            setLoadError(null);
            setStatus("Default menu published to Firebase.");
        } catch (err) {
            setStatus(formatFirebaseError(err));
        } finally {
            setSaving(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-neutral-100 flex items-center justify-center font-body text-neutral-600">
                Loading…
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6 font-body">
                <form onSubmit={handleLogin} className="w-full max-w-sm bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
                    <h1 className="text-lg font-semibold text-neutral-900">Menu Admin</h1>
                    {!isFirebaseConfigured && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm space-y-1">
                            <p className="font-semibold">Firebase Not Configured</p>
                            <p>Please add <strong>FIREBASE_API_KEY</strong> to your Vercel project environment variables and redeploy.</p>
                        </div>
                    )}
                    <p className="text-sm text-neutral-600">Sign in with your Firebase admin account.</p>
                    {authError && <p className="text-sm text-red-600">{authError}</p>}
                    <label className="block text-sm">
                        <span className="text-neutral-600">Email</span>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full border border-neutral-300 rounded px-3 py-2 text-sm"
                        />
                    </label>
                    <label className="block text-sm">
                        <span className="text-neutral-600">Password</span>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full border border-neutral-300 rounded px-3 py-2 text-sm"
                        />
                    </label>
                    <button type="submit" className="w-full py-2 bg-neutral-900 text-white rounded text-sm hover:bg-neutral-800">
                        Sign in
                    </button>
                    <Link to="/menu" className="block text-center text-sm text-neutral-500 hover:text-neutral-800">
                        Back to menu
                    </Link>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-100 text-neutral-900 font-body overflow-y-auto">
            <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 py-4 md:px-8">
                <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold">Menu Admin</h1>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Link to="/menu" className="px-3 py-1.5 border border-neutral-300 rounded hover:bg-neutral-50">
                            View menu
                        </Link>
                        <button type="button" onClick={handleLogout} className="px-3 py-1.5 border border-neutral-300 rounded hover:bg-neutral-50">
                            Sign out
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePublishDefaults()}
                            disabled={saving}
                            className="px-3 py-1.5 border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-50"
                        >
                            Reset to defaults
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="px-3 py-1.5 bg-neutral-900 text-white rounded hover:bg-neutral-800 disabled:opacity-50"
                        >
                            {saving ? "Saving…" : "Save to Firebase"}
                        </button>
                    </div>
                </div>
                {status && <p className="max-w-3xl mx-auto mt-2 text-sm text-neutral-700">{status}</p>}
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8 md:px-8 space-y-8">
                {loadError && (
                    <p className="text-sm text-red-600 rounded border border-red-200 bg-red-50 px-4 py-3">{loadError}</p>
                )}

                {!menuLoading && !menuPublished && (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-5 space-y-3">
                        <p className="text-sm text-amber-950 font-medium">First-time setup</p>
                        <p className="text-sm text-amber-900">
                            Firestore is connected, but there is no menu saved yet. Publish the starter menu to create{" "}
                            <code className="text-xs bg-amber-100 px-1 rounded">menu/current</code> in Firebase.
                        </p>
                        <button
                            type="button"
                            onClick={() => handlePublishDefaults(true)}
                            disabled={saving}
                            className="px-4 py-2 bg-neutral-900 text-white text-sm rounded hover:bg-neutral-800 disabled:opacity-50"
                        >
                            {saving ? "Publishing…" : "Publish starter menu to Firebase"}
                        </button>
                    </div>
                )}

                {menuLoading ? (
                    <p className="text-sm text-neutral-600">Loading menu…</p>
                ) : (
                    <>
                        {menu.map((section) => (
                            <section key={section.id} className="bg-white border border-neutral-200 rounded-lg p-5 space-y-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <h2 className="text-base font-semibold">Section</h2>
                                    {menu.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSection(section.id)}
                                            className="text-sm text-red-600 hover:underline"
                                        >
                                            Remove section
                                        </button>
                                    )}
                                </div>

                                <label className="block text-sm">
                                    <span className="text-neutral-600">Title</span>
                                    <input
                                        type="text"
                                        value={section.title}
                                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                        className="mt-1 w-full border border-neutral-300 rounded px-3 py-2 text-sm"
                                    />
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                    <label className="block text-sm">
                                        <span className="text-neutral-600">Accent color</span>
                                        <input
                                            type="color"
                                            value={section.color}
                                            onChange={(e) => updateSection(section.id, { color: e.target.value })}
                                            className="mt-1 w-full h-10 border border-neutral-300 rounded cursor-pointer"
                                        />
                                    </label>
                                    <label className="block text-sm">
                                        <span className="text-neutral-600">Background</span>
                                        <input
                                            type="color"
                                            value={section.bg}
                                            onChange={(e) => updateSection(section.id, { bg: e.target.value })}
                                            className="mt-1 w-full h-10 border border-neutral-300 rounded cursor-pointer"
                                        />
                                    </label>
                                </div>

                                <div className="space-y-6 pt-2 border-t border-neutral-100">
                                    {section.items.map((item, index) => (
                                        <div key={item.id} className="space-y-3 pb-6 border-b border-neutral-100 last:border-0 last:pb-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-neutral-700">Item {index + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(section.id, item.id)}
                                                    className="text-sm text-red-600 hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            {item.image && (
                                                <img src={resolveMenuImage(item.image)} alt="" className="w-20 h-20 object-cover rounded border border-neutral-200" />
                                            )}

                                            <label className="block text-sm">
                                                <span className="text-neutral-600">Name</span>
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => updateItem(section.id, item.id, { name: e.target.value })}
                                                    className="mt-1 w-full border border-neutral-300 rounded px-3 py-2 text-sm"
                                                />
                                            </label>

                                            <label className="block text-sm">
                                                <span className="text-neutral-600">Description</span>
                                                <textarea
                                                    value={item.description}
                                                    onChange={(e) => updateItem(section.id, item.id, { description: e.target.value })}
                                                    rows={2}
                                                    className="mt-1 w-full border border-neutral-300 rounded px-3 py-2 text-sm resize-y"
                                                />
                                            </label>

                                            <label className="block text-sm">
                                                <span className="text-neutral-600">Price</span>
                                                <input
                                                    type="text"
                                                    value={item.price}
                                                    onChange={(e) => updateItem(section.id, item.id, { price: e.target.value })}
                                                    placeholder="$18"
                                                    className="mt-1 w-full border border-neutral-300 rounded px-3 py-2 text-sm"
                                                />
                                            </label>

                                            <div className="block text-sm">
                                                <span className="text-neutral-600">Upload image</span>
                                                <input
                                                    id={`upload-${item.id}`}
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={uploadingId === item.id}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleImageUpload(section.id, item.id, file);
                                                        e.target.value = "";
                                                    }}
                                                    className="sr-only"
                                                />
                                                <label
                                                    htmlFor={`upload-${item.id}`}
                                                    className={`mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-neutral-300 rounded bg-white hover:bg-neutral-50 transition-colors select-none ${
                                                        uploadingId === item.id
                                                            ? "opacity-50 cursor-not-allowed pointer-events-none"
                                                            : "cursor-pointer"
                                                    }`}
                                                >
                                                    {uploadingId === item.id ? `Uploading ${uploadProgress}%…` : "Choose a file"}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => addItem(section.id)}
                                    className="text-sm text-neutral-700 border border-dashed border-neutral-400 rounded w-full py-2 hover:bg-neutral-50"
                                >
                                    + Add item
                                </button>
                            </section>
                        ))}

                        <button
                            type="button"
                            onClick={addSection}
                            className="text-sm border border-neutral-300 rounded w-full py-3 hover:bg-white bg-neutral-50"
                        >
                            + Add section
                        </button>
                    </>
                )}
            </main>
        </div>
    );
}
