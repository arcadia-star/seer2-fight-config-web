import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { RefValueType } from "@/config/base";
import { ColumnFilter, ColumnSort, PaginationState } from "@tanstack/react-table";

function defaultTableState() {
    return {
        sorting: [],
        columnVisibility: {},
        rowSelection: {},
        columnFilters: [],
        globalFilter: "",
        pagination: {
            pageIndex: 0,
            pageSize: 10,
        },
    };
}

const config = {
    [RefValueType.Monster]: defaultTableState(),
    [RefValueType.Skill]: defaultTableState(),
    [RefValueType.Feature]: defaultTableState(),
    [RefValueType.Emblem]: defaultTableState(),
    [RefValueType.Weather]: defaultTableState(),
    [RefValueType.Buff]: defaultTableState(),
    [RefValueType.Item]: defaultTableState(),
    [RefValueType.Character]: defaultTableState(),
    [RefValueType.MonsterType]: defaultTableState(),
    [RefValueType.SkillCategory]: defaultTableState(),
    [RefValueType.RawHook]: defaultTableState(),
    [RefValueType.RawOrder]: defaultTableState(),
    [RefValueType.RawExpr]: defaultTableState(),
    [RefValueType.Value]: defaultTableState(),
    [RefValueType.Condition]: defaultTableState(),
    [RefValueType.Action]: defaultTableState(),
    [RefValueType.Hook]: defaultTableState(),
    [RefValueType.Array]: defaultTableState(),
    [RefValueType.Template]: defaultTableState(),
};

type State = {
    config: Record<
        RefValueType,
        {
            sorting: ColumnSort[];
            columnVisibility: Record<string, boolean>;
            rowSelection: Record<string, boolean>;
            columnFilters: ColumnFilter[];
            globalFilter: string;
            pagination: PaginationState;
        }
    >;
};

type Actions = {
    reset: ({ type }: { type: RefValueType }) => void;
    updateSorting: ({ type, value }: { type: RefValueType; value: ColumnSort[] }) => void;
    updateColumnVisibility: ({ type, value }: { type: RefValueType; value: Record<string, boolean> }) => void;
    updateRowSelection: ({ type, value }: { type: RefValueType; value: Record<string, boolean> }) => void;
    updateColumnFilters: ({ type, value }: { type: RefValueType; value: ColumnFilter[] }) => void;
    updateGlobalFilter: ({ type, value }: { type: RefValueType; value: string }) => void;
    updatePagination: ({ type, value }: { type: RefValueType; value: PaginationState }) => void;
    _nop: () => void;
};

export const useTableStore = create<State & Actions>()(
    persist(
        immer((set) => ({
            config,
            reset: ({ type }) =>
                set((state) => {
                    state.config[type] = defaultTableState();
                }),
            updateSorting: ({ type, value }) =>
                set((state) => {
                    state.config[type].sorting = value;
                }),
            updateColumnVisibility: ({ type, value }) =>
                set((state) => {
                    state.config[type].columnVisibility = value;
                }),
            updateRowSelection: ({ type, value }) =>
                set((state) => {
                    state.config[type].rowSelection = value;
                }),
            updateColumnFilters: ({ type, value }) =>
                set((state) => {
                    state.config[type].columnFilters = value;
                }),
            updateGlobalFilter: ({ type, value }) =>
                set((state) => {
                    state.config[type].globalFilter = value;
                }),
            updatePagination: ({ type, value }) =>
                set((state) => {
                    state.config[type].pagination = value;
                }),
            _nop: () => {
                return;
            },
        })),
        {
            name: "table-config",
            storage: createJSONStorage(() => localStorage),
            version: 1,
        },
    ),
);
