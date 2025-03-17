import { RefValueType } from "@/config/base";
import { create } from "zustand/index";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
    refValueTab: RefValueType;
    sidebarOpen: boolean;
    configSource: string;
};
type Actions = {
    updateRefValueTab: (value: RefValueType) => void;
    updateSidebarOpen: (value: boolean) => void;
    updateConfigSource: (value: string) => void;
};
export const useCacheStore = create<State & Actions>()(
    persist(
        immer((set) => ({
            refValueTab: RefValueType.Monster,
            sidebarOpen: true,
            configSource: "",
            updateRefValueTab: (value) =>
                set((state) => {
                    state.refValueTab = value;
                }),
            updateSidebarOpen: (value) =>
                set((state) => {
                    state.sidebarOpen = value;
                }),
            updateConfigSource: (value) =>
                set((state) => {
                    state.configSource = value;
                }),
        })),
        {
            name: "cache-config",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => state,
            version: 1,
        },
    ),
);
