import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    type User,
} from "firebase/auth";
import { motion } from "framer-motion";
import { auth, isFirebaseConfigured } from "../api/firebase-config";
import {
    fetchMenuPages,
    isCloudinaryConfigured,
    uploadMenuPage,
} from "../api/menuAssetService";
import {
    MENU_CATEGORIES,
    type MenuCategoryId,
    type MenuPage,
} from "../lib/menuAssets";
import bgImg from "../assets/artisanal_full_restraunt_pic.jpg";

type SelectionState = Record<MenuCategoryId, File[]>;
type StatusState = Record<MenuCategoryId, string | null>;
type ProgressState = Record<MenuCategoryId, number>;
type PublishedState = Record<MenuCategoryId, MenuPage[]>;

const emptySelections: SelectionState = { dinner: [], dessert: [] };
const emptyStatuses: StatusState = { dinner: null, dessert: null };
const emptyProgress: ProgressState = { dinner: 0, dessert: 0 };
const emptyPublishedPages: PublishedState = { dinner: [], dessert: [] };

export default function Admin() {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState<string | null>(null);
    const [selections, setSelections] = useState<SelectionState>(emptySelections);
    const [statuses, setStatuses] = useState<StatusState>(emptyStatuses);
    const [progress, setProgress] = useState<ProgressState>(emptyProgress);
    const [publishing, setPublishing] = useState<MenuCategoryId | null>(null);
    const [publishedPages, setPublishedPages] = useState<PublishedState>(emptyPublishedPages);

    useEffect(() => {
        if (!auth) {
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
        let cancelled = false;
        const categoryIds = Object.keys(MENU_CATEGORIES) as MenuCategoryId[];

        Promise.allSettled(categoryIds.map((categoryId) => fetchMenuPages(categoryId)))
            .then((results) => {
                if (cancelled) return;

                results.forEach((result, index) => {
                    const categoryId = categoryIds[index];
                    if (result.status === "fulfilled") {
                        setPublishedPages((current) => ({
                            ...current,
                            [categoryId]: result.value,
                        }));
                    } else {
                        setStatuses((current) => ({
                            ...current,
                            [categoryId]: result.reason instanceof Error
                                ? result.reason.message
                                : "Unable to load current menu images.",
                        }));
                    }
                });
            });

        return () => {
            cancelled = true;
        };
    }, [user]);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setAuthError(null);

        if (!auth) {
            setAuthError("Firebase Authentication is not configured.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch {
            setAuthError("Unable to sign in with those credentials.");
        }
    };

    const handleLogout = async () => {
        if (auth) await signOut(auth);
    };

    const handleSelection = (categoryId: MenuCategoryId, files: File[]) => {
        if (files.length < 1 || files.length > 2) {
            setSelections((current) => ({ ...current, [categoryId]: [] }));
            setStatuses((current) => ({
                ...current,
                [categoryId]: "Choose one or two images.",
            }));
            return;
        }

        if (files.some((file) => !file.type.startsWith("image/"))) {
            setSelections((current) => ({ ...current, [categoryId]: [] }));
            setStatuses((current) => ({
                ...current,
                [categoryId]: "Only image files can be uploaded.",
            }));
            return;
        }

        setSelections((current) => ({ ...current, [categoryId]: files }));
        setStatuses((current) => ({ ...current, [categoryId]: null }));
        setProgress((current) => ({ ...current, [categoryId]: 0 }));
    };

    const handleRemoveSelection = (categoryId: MenuCategoryId, index: number) => {
        setSelections((current) => ({
            ...current,
            [categoryId]: current[categoryId].filter((_, fileIndex) => fileIndex !== index),
        }));
        setStatuses((current) => ({ ...current, [categoryId]: null }));
        setProgress((current) => ({ ...current, [categoryId]: 0 }));
    };

    const handlePublish = async (categoryId: MenuCategoryId) => {
        if (!user) return;

        const files = selections[categoryId];
        if (files.length < 1 || files.length > 2) {
            setStatuses((current) => ({
                ...current,
                [categoryId]: "Choose one or two images before publishing.",
            }));
            return;
        }

        const category = MENU_CATEGORIES[categoryId];
        const batchId = Date.now().toString();
        const uploadedPages: MenuPage[] = [];
        setPublishing(categoryId);
        setStatuses((current) => ({ ...current, [categoryId]: null }));
        setProgress((current) => ({ ...current, [categoryId]: 0 }));

        try {
            for (let index = 0; index < files.length; index += 1) {
                const file = files[index];
                const page = await uploadMenuPage(categoryId, batchId, index + 1, file, (fileProgress) => {
                    const totalProgress = ((index + fileProgress / 100) / files.length) * 100;
                    setProgress((current) => ({
                        ...current,
                        [categoryId]: Math.round(totalProgress),
                    }));
                });
                uploadedPages.push(page);
            }

            setSelections((current) => ({ ...current, [categoryId]: [] }));
            setPublishedPages((current) => ({ ...current, [categoryId]: uploadedPages }));
            setProgress((current) => ({ ...current, [categoryId]: 100 }));
            setStatuses((current) => ({
                ...current,
                [categoryId]: `${category.title} published successfully.`,
            }));
        } catch (error) {
            setStatuses((current) => ({
                ...current,
                [categoryId]: error instanceof Error ? error.message : "Menu upload failed.",
            }));
        } finally {
            setPublishing(null);
        }
    };

    if (authLoading) {
        return <AdminMessage message="Loading admin..." />;
    }

    if (!user) {
        return (
            <AdminShell>
                <main className="flex min-h-[100svh] items-center justify-center px-5 py-16">
                    <form
                        onSubmit={handleLogin}
                        className="w-full max-w-sm border border-white/15 bg-black/45 p-6 backdrop-blur-md sm:p-8"
                    >
                        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#dac464]">
                            Artisanal
                        </p>
                        <h1 className="mt-2 font-display text-4xl text-white">Menu Admin</h1>
                        <p className="mt-3 font-body text-xs leading-relaxed text-white/50">
                            Sign in with your Firebase administrator account.
                        </p>

                        {!isFirebaseConfigured && (
                            <p className="mt-5 border border-red-300/30 bg-red-950/40 px-3 py-3 font-body text-xs text-red-100">
                                Add VITE_FIREBASE_API_KEY to the deployment environment.
                            </p>
                        )}
                        {authError && (
                            <p className="mt-5 font-body text-xs text-red-200" role="alert">
                                {authError}
                            </p>
                        )}

                        <div className="mt-7 space-y-5">
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={setEmail}
                                autoComplete="email"
                            />
                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={setPassword}
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!isFirebaseConfigured}
                            className="mt-7 w-full cursor-pointer border border-[#dac464] px-5 py-3 font-body text-xs uppercase tracking-[0.18em] text-[#ffe6ac] transition-colors hover:bg-[#dac464] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Sign in
                        </button>
                        <Link
                            to="/menu"
                            className="mt-5 block text-center font-body text-[10px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white"
                        >
                            Return to menu
                        </Link>
                    </form>
                </main>
            </AdminShell>
        );
    }

    return (
        <AdminShell>
            <header className="sticky top-0 z-20 border-b border-white/10 bg-[#151108]/95 px-5 py-4 backdrop-blur-md sm:px-8">
                <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="font-body text-[9px] uppercase tracking-[0.28em] text-[#dac464]">
                            Artisanal
                        </p>
                        <h1 className="font-display text-3xl text-white">Menu Admin</h1>
                    </div>
                    <div className="flex items-center gap-5">
                        <Link
                            to="/menu"
                            className="font-body text-[10px] uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-[#dac464]"
                        >
                            View menu
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="cursor-pointer font-body text-[10px] uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-[#dac464]"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
                <div className="mb-10">
                    <p className="font-body text-[10px] uppercase tracking-[0.25em] text-white/40">
                        Signed in as {user.email}
                    </p>
                    <h2 className="mt-2 max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl">
                        Publish current menu pages
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {(Object.keys(MENU_CATEGORIES) as MenuCategoryId[]).map((categoryId) => (
                        <MenuUploadField
                            key={categoryId}
                            categoryId={categoryId}
                            files={selections[categoryId]}
                            status={statuses[categoryId]}
                            progress={progress[categoryId]}
                            publishing={publishing === categoryId}
                            disabled={publishing !== null}
                            publishedPages={publishedPages[categoryId]}
                            onSelect={(files) => handleSelection(categoryId, files)}
                            onRemove={(index) => handleRemoveSelection(categoryId, index)}
                            onPublish={() => handlePublish(categoryId)}
                        />
                    ))}
                </div>
            </main>
        </AdminShell>
    );
}

function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative isolate min-h-[100svh] overflow-x-hidden bg-[#1c170a] text-white">
            <img
                src={bgImg}
                alt=""
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover brightness-[0.22]"
            />
            <div className="pointer-events-none fixed inset-0 z-0 bg-[#1c170a]/75" />
            <div className="relative z-10 min-h-[100svh]">{children}</div>
        </div>
    );
}

function AdminMessage({ message }: { message: string }) {
    return (
        <AdminShell>
            <div className="flex min-h-[100svh] items-center justify-center">
                <p className="font-body text-xs uppercase tracking-[0.22em] text-white/55">{message}</p>
            </div>
        </AdminShell>
    );
}

function TextField({
    label,
    type,
    value,
    autoComplete,
    onChange,
}: {
    label: string;
    type: "email" | "password";
    value: string;
    autoComplete: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block">
            <span className="font-body text-[10px] uppercase tracking-[0.18em] text-white/55">
                {label}
            </span>
            <input
                type={type}
                required
                value={value}
                autoComplete={autoComplete}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full border-b border-white/25 bg-transparent px-0 py-2 font-body text-sm text-white outline-none transition-colors focus:border-[#dac464]"
            />
        </label>
    );
}

function MenuUploadField({
    categoryId,
    files,
    status,
    progress,
    publishing,
    disabled,
    publishedPages,
    onSelect,
    onRemove,
    onPublish,
}: {
    categoryId: MenuCategoryId;
    files: File[];
    status: string | null;
    progress: number;
    publishing: boolean;
    disabled: boolean;
    publishedPages: MenuPage[];
    onSelect: (files: File[]) => void;
    onRemove: (index: number) => void;
    onPublish: () => void;
}) {
    const category = MENU_CATEGORIES[categoryId];

    return (
        <section className="border border-white/12 bg-black/25 p-5 sm:p-7">
            <p className="font-body text-[9px] uppercase tracking-[0.28em] text-[#dac464]">
                One or two images
            </p>
            <h3 className="mt-2 font-display text-3xl text-white">{category.title}</h3>

            <div className="mt-5 grid grid-cols-2 gap-3">
                {[0, 1].map((index) => (
                    <CurrentAsset
                        key={publishedPages[index]?.url ?? `${categoryId}-${index}`}
                        page={publishedPages[index]}
                        pageNumber={index + 1}
                    />
                ))}
            </div>

            <label className="mt-6 block">
                <span className="font-body text-[10px] uppercase tracking-[0.18em] text-white/55">
                    Menu images
                </span>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={disabled || !isCloudinaryConfigured}
                    onChange={(event) => {
                        onSelect(Array.from(event.target.files ?? []));
                        event.target.value = "";
                    }}
                    className="mt-2 block w-full cursor-pointer border border-dashed border-white/25 bg-white/5 px-3 py-5 font-body text-xs text-white/60 file:mr-4 file:cursor-pointer file:border-0 file:bg-[#dac464] file:px-3 file:py-2 file:font-body file:text-[10px] file:uppercase file:tracking-[0.12em] file:text-black disabled:cursor-not-allowed disabled:opacity-50"
                />
            </label>

            {files.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                    {files.map((file, index) => (
                        <SelectedAsset
                            key={`${file.name}-${file.lastModified}-${index}`}
                            file={file}
                            pageNumber={index + 1}
                            onRemove={() => onRemove(index)}
                        />
                    ))}
                </div>
            )}

            {status && (
                <p className="mt-5 font-body text-xs leading-relaxed text-[#ffe6ac]" role="status">
                    {status}
                </p>
            )}

            {publishing && (
                <div className="mt-5" aria-label={`Upload progress ${progress}%`}>
                    <div className="h-px w-full bg-white/15">
                        <motion.div
                            className="h-px bg-[#dac464]"
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="mt-2 font-body text-[9px] uppercase tracking-[0.18em] text-white/45">
                        Publishing {progress}%
                    </p>
                </div>
            )}

            <button
                type="button"
                onClick={onPublish}
                disabled={disabled || files.length === 0}
                className="mt-6 w-full cursor-pointer border border-[#dac464] px-4 py-3 font-body text-[10px] uppercase tracking-[0.18em] text-[#ffe6ac] transition-colors hover:bg-[#dac464] hover:text-black disabled:cursor-not-allowed disabled:opacity-35"
            >
                {publishing ? "Publishing..." : `Publish ${category.title}`}
            </button>
        </section>
    );
}

function CurrentAsset({
    page,
    pageNumber,
}: {
    page?: MenuPage;
    pageNumber: number;
}) {
    const [unavailable, setUnavailable] = useState(false);

    return (
        <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-white/5">
            {!page || unavailable ? (
                <div className="flex h-full items-center justify-center px-3 text-center font-body text-[9px] uppercase tracking-[0.15em] text-white/30">
                    Page {pageNumber} not published
                </div>
            ) : (
                <img
                    src={page.url}
                    alt={`Current page ${pageNumber}`}
                    onError={() => setUnavailable(true)}
                    className="h-full w-full bg-white object-contain"
                />
            )}
            <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 font-body text-[8px] uppercase tracking-[0.14em] text-white/70">
                Page {pageNumber}
            </span>
        </div>
    );
}

function SelectedAsset({
    file,
    pageNumber,
    onRemove,
}: {
    file: File;
    pageNumber: number;
    onRemove: () => void;
}) {
    const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

    useEffect(() => {
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    return (
        <figure className="relative aspect-[4/5] overflow-hidden border border-[#dac464]/35 bg-white/5">
            <img src={previewUrl} alt={`Selected page ${pageNumber}`} className="h-full w-full bg-white object-contain" />
            <button
                type="button"
                title={`Remove selected page ${pageNumber}`}
                aria-label={`Remove selected page ${pageNumber}`}
                onClick={onRemove}
                className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center border border-white/25 bg-black/80 font-body text-xs text-white transition-colors hover:border-[#dac464] hover:text-[#dac464]"
            >
                X
            </button>
            <figcaption className="absolute inset-x-0 bottom-0 bg-black/75 px-2 py-2 font-body text-[8px] uppercase tracking-[0.12em] text-white/75">
                New page {pageNumber}
            </figcaption>
        </figure>
    );
}
