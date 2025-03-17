import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { MainConfig, NamedId, RefValueType } from "@/config/base";
import { configByType, DataConfig, modifyId } from "@/config/config";

type State = {
    config: DataConfig;
};

type Actions = {
    insertConfigItem: ({ type, data }: { type: RefValueType; data: NamedId }) => void;
    updateConfigItem: ({ type, data }: { type: RefValueType; data: NamedId }) => void;
    deleteConfigItem: ({ type, data }: { type: RefValueType; data: NamedId[] }) => void;
    modifyId: ({ type, from, to }: { type: RefValueType; from: number; to: number }) => void;
    moveId: ({ type, from, to }: { type: RefValueType; from: number; to: number }) => void;
    resort: ({ type }: { type: RefValueType }) => void;
    update: (config: MainConfig) => void;
};

export const useConfigStore = create<State & Actions>()(
    immer((set) => ({
        config: {
            main: MainConfig.parse(null),
        },
        insertConfigItem: ({ type, data }) =>
            set((state) => {
                const conf = configByType(state.config.main, type);
                const list = conf.get();
                const exit = list.find((e) => e.id === data.id);
                if (!exit) {
                    conf.set(list.concat([data]));
                }
            }),
        updateConfigItem: ({ type, data }) =>
            set((state) => {
                const conf = configByType(state.config.main, type);
                const list = conf.get();
                conf.set(list.map((e) => (e.id === data.id ? data : e)));
            }),
        deleteConfigItem: ({ type, data }) =>
            set((state) => {
                const conf = configByType(state.config.main, type);
                const list = conf.get();
                const deleteIds = data.map((e) => e.id);
                conf.set(list.filter((e) => !deleteIds.includes(e.id)));
            }),
        modifyId: ({ type, from, to }) =>
            set((state) => {
                modifyId(state.config.main, type, from, to, false);
            }),
        moveId: ({ type, from, to }) =>
            set((state) => {
                modifyId(state.config.main, type, from, to, true);
            }),
        resort: ({ type }) =>
            set((state) => {
                const conf = configByType(state.config.main, type);
                const list = conf.get();
                conf.set(list.sort((a, b) => a.id - b.id));
            }),
        update: (config) =>
            set((state) => {
                state.config.main = config;
            }),
    })),
);
