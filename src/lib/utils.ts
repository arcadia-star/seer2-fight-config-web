import { type ClassValue, clsx } from "clsx";
import { saveAs } from "file-saver";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function compress(obj: unknown): unknown {
    if (!obj) {
        return undefined;
    }
    if (typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        const array = obj.map((e) => (typeof e === "object" ? compress(e) : e));
        const index = array.map((e) => !!e).lastIndexOf(true);
        return index >= 0 ? array.slice(0, index + 1) : undefined;
    }
    const entries = Object.entries(obj)
        .map(([k, v]) => [k, compress(v)])
        .filter((e) => {
            return e[1];
        });
    return entries.length ? Object.fromEntries(entries) : undefined;
}

export function field(obj: unknown, key: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return obj?.[key];
}

export function fieldSet(obj: unknown, key: string, value: unknown) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    obj[key] = value;
}

export function orUndefined<T>(value: T): T | undefined {
    return value;
}

export async function uploadFile(): Promise<{ content: string; file: File }> {
    if (showOpenFilePicker) {
        const [fileHandle] = await showOpenFilePicker();
        const file = await fileHandle.getFile();
        const content = await file.text();
        return { content, file };
    }

    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.id = "rand_input_id_" + Date.now() + "_" + ("" + Math.random()).slice(2);
        input.type = "file";
        input.style.display = "none";

        input.onchange = async (e) => {
            try {
                const file = field(e.target, "files")?.[0];
                if (!file) {
                    reject(new Error("No file selected"));
                    return;
                }

                const content = await new Promise((innerResolve, innerReject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => innerResolve(e.target?.result);
                    reader.onerror = (e) => innerReject(e.target?.error);
                    reader.readAsText(file);
                });
                resolve({ content: content as string, file });
            } catch (error) {
                reject(error);
            } finally {
                input.remove();
            }
        };
        input.oncancel = () => {
            input.remove();
            reject(new Error("No file selected"));
        };

        document.body.appendChild(input);
        setTimeout(() => input.click(), 0);
    });
}

export async function downloadFile(data: Blob | string, filename?: string) {
    if (showSaveFilePicker) {
        const handle = await showSaveFilePicker({
            suggestedName: filename,
        });
        const writable = await handle.createWritable();
        await writable.write(data);
        await writable.close();
    } else {
        saveAs(data, filename);
    }
}

export const showOpenFilePicker = orUndefined(window.showOpenFilePicker);
export const showSaveFilePicker = orUndefined(window.showSaveFilePicker);
