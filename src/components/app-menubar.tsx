import { Button } from "@/components/ui/button.tsx";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { MainConfig } from "@/config/config-schema.ts";
import { export4Human } from "@/config/export-utils.ts";
import { downloadFile, showOpenFilePicker, showSaveFilePicker, uploadFile } from "@/lib/utils.ts";
import { useCacheStore } from "@/store/cacheStore.ts";
import { useConfigStore } from "@/store/configStore.ts";
import { kvsIndexedDB, KVSIndexedDB } from "@kvs/indexeddb";
import { PanelRightClose, PanelRightOpen, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

let storageInstance: KVSIndexedDB<{ cache: MainConfig; fileHandle: FileSystemFileHandle }>;
let fileHandleInstance: FileSystemFileHandle;

const ConfigSource = {
    demo: "demo",
    cache: "cache",
    file: "file",
    server: "server",
};

async function buildStorage() {
    if (!storageInstance) {
        storageInstance = await kvsIndexedDB({
            name: "main-storage",
            version: 1,
        });
    }
    return storageInstance;
}

async function buildStorageFileHandle() {
    if (!showOpenFilePicker) {
        throw "no function showOpenFilePicker";
    }
    if (fileHandleInstance) {
        return fileHandleInstance;
    }
    const storage = await buildStorage();
    let fileHandle = await storage.get("fileHandle");
    if (!fileHandle) {
        [fileHandle] = await showOpenFilePicker();
    }
    fileHandleInstance = fileHandle;
    const perm = await fileHandle.queryPermission({ mode: "readwrite" });
    if (perm === "granted") {
        return fileHandle;
    }
    const perm2 = await fileHandle.requestPermission({ mode: "readwrite" });
    if (perm2 === "granted") {
        return fileHandle;
    }
    throw "fileHandle not granted";
}

async function changeFileHandle() {
    if (!showOpenFilePicker) {
        throw "no function showOpenFilePicker";
    }
    const [fileHandle] = await showOpenFilePicker();
    const perm2 = await fileHandle.requestPermission({ mode: "readwrite" });
    if (perm2 === "granted") {
        fileHandleInstance = fileHandle;
        const storage = await buildStorage();
        await storage.set("fileHandle", fileHandle);
        return fileHandle;
    }
    throw "fileHandle not granted";
}

async function load(source: string) {
    if (!source || source === ConfigSource.demo) {
        return fetch("config/main-config.json").then((r) => r.json());
    }
    if (source === ConfigSource.cache) {
        const storage = await buildStorage();
        return await storage.get("cache");
    }
    if (source === ConfigSource.file) {
        const fileHandle = await buildStorageFileHandle();
        const file = await fileHandle.getFile();
        const content = await file.text();
        return JSON.parse(content);
    }
    toast.warning("Specified storage type is unavailable." + ": " + source);
    throw "load failed from:" + source;
}

async function save(source: string, config: MainConfig) {
    if (source === "cache") {
        const storage = await buildStorage();
        return await storage.set("cache", config);
    }
    if (source === "file") {
        const fileHandle = await buildStorageFileHandle();
        const writable = await fileHandle.createWritable();
        await writable.write(export4Human(config));
        await writable.close();
    }
    toast.warning("Specified storage type is unavailable." + ": " + source);
    throw "save failed to:" + source;
}

export function AppMenubar() {
    const sidebarOpen = useCacheStore((state) => state.sidebarOpen);
    const configSource = useCacheStore((state) => state.configSource);
    const updateConfigSource = useCacheStore((state) => state.updateConfigSource);
    const config = useConfigStore((state) => state.config);
    const updateConfig = useConfigStore((state) => state.update);
    const { toggleSidebar } = useSidebar();
    const [configSourceFile, setConfigSourceFile] = useState<File>();

    function exportConfig() {
        console.log(config.main);
        const data = export4Human(config.main);
        const blob = new Blob([data], { type: "application/json;charset=utf-8" });
        downloadFile(blob, "main-config.json")
            .then(() => toast.success("export success"))
            .catch(console.warn);
    }

    function importConfig() {
        uploadFile()
            .then((data) => {
                const parse = MainConfig.parse(JSON.parse(data.content));
                updateConfig(parse);
            })
            .then(() => toast.success("import success"))
            .catch(console.warn);
    }

    function loadConfig() {
        load(configSource)
            .then((data) => {
                console.log("loadConfig source:" + configSource, data);
                updateConfig(MainConfig.parse(data));
            })
            .then(() => toast.success("load success from:" + configSource))
            .catch(console.warn);
    }

    function saveConfig() {
        console.log("saveConfig source:" + configSource, config.main);
        save(configSource, config.main)
            .then(() => toast.success("save success to:" + configSource))
            .catch(console.warn);
    }

    function resetFileHandle() {
        changeFileHandle()
            .then((e) => e.getFile())
            .then((e) => setConfigSourceFile(e))
            .catch(console.warn);
    }

    useEffect(() => {
        if (configSource !== ConfigSource.file) {
            return;
        }
        buildStorageFileHandle()
            .then((e) => e.getFile())
            .then((e) => setConfigSourceFile(e))
            .catch((e) => {
                console.error(e);
                toast.error("Initialization failed. File reselection is required.");
            });
    }, [configSource]);

    useEffect(() => {
        loadConfig();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex justify-between px-5 pt-5">
            <div className="flex">
                <Button className="mr-2" variant="outline" size="sm" onClick={() => toggleSidebar()}>
                    {sidebarOpen ? <PanelRightOpen /> : <PanelRightClose />}
                    Sidebar
                </Button>
                <Tabs value={configSource} onValueChange={updateConfigSource}>
                    <TabsList className="h-8 mr-2">
                        <TabsTrigger value="demo">demo</TabsTrigger>
                        <TabsTrigger value="cache">cache</TabsTrigger>
                        <TabsTrigger value="file">file</TabsTrigger>
                        <TabsTrigger value="server">server</TabsTrigger>
                    </TabsList>
                </Tabs>
                {configSource === "file" && (
                    <Button className="mr-2" variant="outline" size="sm" onClick={() => resetFileHandle()}>
                        Current File: {configSourceFile?.name}
                    </Button>
                )}
            </div>
            <div className="flex justify-end">
                <Button className="mr-2" variant="outline" size="sm" onClick={() => loadConfig()}>
                    Reload
                </Button>
                <Button className="mr-2" variant="outline" size="sm" onClick={() => saveConfig()}>
                    Save
                </Button>
                <Button className="mr-2" variant="outline" size="sm" onClick={() => importConfig()}>
                    Import
                </Button>
                <Button className="" variant="outline" size="sm" onClick={() => exportConfig()}>
                    Export
                </Button>
                {showSaveFilePicker && showOpenFilePicker ? null : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button type="button" variant="ghost" size="sm">
                                    <TriangleAlert />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>api:</p>
                                <p>showSaveFilePicker:{showSaveFilePicker ? "Yes" : "No"}</p>
                                <p>showOpenFilePicker:{showOpenFilePicker ? "Yes" : "No"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </div>
    );
}
