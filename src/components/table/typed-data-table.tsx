import { PetAvatarIcon } from "@/components/icons";
import { DataTableBase } from "@/components/table/data-table-base";
import { buildColumns, buildGlobalFilterFn } from "@/components/table/data-table-columns";
import { EDIT_ROW_TYPE } from "@/components/table/data-table-row-actions";
import { DataTableRowForm } from "@/components/table/data-table-row-form";
import { SimpleDataTable } from "@/components/table/simple-data-table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DataHeader, Monster, MonsterSkillDataHeaders, NamedId, RefValueSchema, RefValueType } from "@/config/base";
import { queryMonsterChains, queryNameById, queryNamedId, queryNamedIdList } from "@/config/config";
import { useConfigStore } from "@/store/configStore";
import { useTableStore } from "@/store/tableStore";
import { TabsTrigger } from "@radix-ui/react-tabs";
import {
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    OnChangeFn,
    RowData,
    Updater,
    useReactTable,
} from "@tanstack/react-table";
import { Star, TriangleAlert } from "lucide-react";
import React, { useState } from "react";

declare module "@tanstack/table-core" {
    interface TableMeta<TData extends RowData> {
        headers: DataHeader[];
        type?: RefValueType;
        onClickNew?: () => void;
        onClickDelete?: () => void;
        onClickReset?: () => void;
        onClickResort?: () => void;
        onRowActions?: { type?: string; node: () => React.ReactNode; onClick: (data: TData) => void }[];
    }
}

interface DataTableProps<TData> {
    type: RefValueType;
    headers: DataHeader[];
    data: TData[];
}

function TypedDataTable<TData extends NamedId>({ type, headers, data }: DataTableProps<TData>) {
    const config = useConfigStore((state) => state.config);
    const { insertConfigItem, updateConfigItem, deleteConfigItem, modifyId, moveId, resort } = useConfigStore(
        (state) => state,
    );
    const { pagination, rowSelection, columnVisibility, columnFilters, sorting, globalFilter } = useTableStore(
        (state) => state.config[type],
    );
    const {
        reset,
        updatePagination,
        updateRowSelection,
        updateColumnVisibility,
        updateColumnFilters,
        updateSorting,
        updateGlobalFilter,
    } = useTableStore((state) => state);

    function onValueChange<T>(
        value: T,
        onValueChange: ({ type, value }: { type: RefValueType; value: T }) => void,
    ): OnChangeFn<T> {
        return (updater: Updater<T>) =>
            onValueChange({
                type,
                value: updater instanceof Function ? updater(value) : updater,
            });
    }

    const [rowData4Edit, setRowData4Edit] = useState<{ data: TData; update: boolean }>();
    const [rowData4EditId, setRowData4EditId] = useState<{ data?: TData; id: number }>({ data: undefined, id: 0 });
    const [rowData4Monster, setRowData4Monster] = useState<Monster>();
    const [rowData4Json, setRowData4Json] = useState<TData>();

    const monsterChains = rowData4Monster ? queryMonsterChains(config, rowData4Monster.id) : [];

    const table = useReactTable({
        data,
        columns: buildColumns<TData>(headers, config),
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            globalFilter,
            pagination,
        },
        meta: {
            headers,
            type,
            onClickNew: () =>
                setRowData4Edit({
                    data: (function () {
                        const id = Math.max(0, ...data.map((e) => e.id)) + 1;
                        const schema = RefValueSchema[type];
                        return schema.parse({ id });
                    })() as TData,
                    update: false,
                }),
            onClickDelete: () => {
                deleteConfigItem({
                    type,
                    data: table.getSelectedRowModel().flatRows.map((row) => row.original),
                });
                table.resetRowSelection();
            },
            onClickReset: () => reset({ type }),
            onClickResort: () => resort({ type }),
            onRowActions: [
                {
                    type: EDIT_ROW_TYPE,
                    node: () => (
                        <>
                            <Star />
                            Edit Row
                        </>
                    ),
                    onClick: (e: TData) => setRowData4Edit({ data: e, update: true }),
                },
                {
                    node: () => (
                        <>
                            <TriangleAlert />
                            Edit This Id
                        </>
                    ),
                    onClick: (e: TData) => setRowData4EditId({ data: e, id: e.id }),
                },
                {
                    hidden: RefValueType.Monster !== type,
                    node: () => (
                        <>
                            <Star />
                            View Skills
                        </>
                    ),
                    onClick: (e: TData) => setRowData4Monster(e as unknown as Monster),
                },
                {
                    node: () => (
                        <>
                            <Star />
                            View Json
                        </>
                    ),
                    onClick: setRowData4Json,
                },
            ].filter((e) => !e.hidden),
        },
        enableRowSelection: true,
        autoResetPageIndex: false,
        onRowSelectionChange: onValueChange(rowSelection, updateRowSelection),
        onSortingChange: onValueChange(sorting, updateSorting),
        onColumnFiltersChange: onValueChange(columnFilters, updateColumnFilters),
        onColumnVisibilityChange: onValueChange(columnVisibility, updateColumnVisibility),
        onGlobalFilterChange: onValueChange(globalFilter, updateGlobalFilter),
        onPaginationChange: onValueChange(pagination, updatePagination),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        globalFilterFn: buildGlobalFilterFn(headers),
    });

    return (
        <div>
            <DataTableBase table={table} />
            <Dialog open={!!rowData4Edit} onOpenChange={(e) => !e && setRowData4Edit(undefined)}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="min-w-[80vw]">
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="pr-5 overflow-scroll h-[80vh]">
                        <DataTableRowForm
                            type={type}
                            headers={headers}
                            update={rowData4Edit?.update ?? false}
                            data={rowData4Edit?.data ?? ({} as TData)}
                            onSubmit={(e, data) => {
                                (e ? updateConfigItem : insertConfigItem)({
                                    type,
                                    data,
                                });
                                setRowData4Edit(undefined);
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={!!rowData4Monster} onOpenChange={(e) => !e && setRowData4Monster(undefined)}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="min-w-[80vw]">
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="overflow-scroll h-[80vh]">
                        <Tabs defaultValue={"" + rowData4Monster?.id}>
                            <TabsList className="w-full">
                                {monsterChains.map((m) => (
                                    <TabsTrigger key={m.id} value={"" + m.id} className="shadow-2xs">
                                        <PetAvatarIcon id={m.id} size={30} />
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            {monsterChains.map((m) => (
                                <TabsContent key={m.id} value={"" + m.id}>
                                    <Card>
                                        <CardContent className="space-y-2">
                                            <SimpleDataTable
                                                headers={MonsterSkillDataHeaders}
                                                data={queryNamedIdList(config, RefValueType.Skill).filter((s) =>
                                                    m.skills?.includes(s.id),
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
            <AlertDialog open={!!rowData4EditId.data} onOpenChange={(e) => !e && setRowData4EditId({ id: 0 })}>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Changing the ID will propagate updates to all associated references on this page. The target
                            ID must be non-zero and unique within the system. Proceed with caution.
                            <Input
                                type="number"
                                placeholder="id"
                                value={rowData4EditId?.id}
                                onChange={(e) =>
                                    setRowData4EditId({
                                        data: rowData4EditId.data,
                                        id: Number(e.target.value),
                                    })
                                }
                            />
                            old:
                            <Input value={queryNameById(config, rowData4EditId.data?.id ?? 0, type)} readOnly={true} />
                            new:
                            <Input value={queryNameById(config, rowData4EditId?.id, type)} readOnly={true} />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={
                                !(
                                    rowData4EditId.data?.id &&
                                    rowData4EditId.id &&
                                    rowData4EditId.data?.id !== rowData4EditId.id &&
                                    !queryNamedId(config, rowData4EditId.id, type)
                                )
                            }
                            onClick={() => {
                                const from = rowData4EditId.data?.id ?? 0;
                                const to = rowData4EditId.id ?? 0;
                                modifyId({ type, from, to });
                            }}
                        >
                            Continue Modify
                        </AlertDialogAction>
                        <AlertDialogAction
                            disabled={
                                !(
                                    rowData4EditId.data?.id &&
                                    rowData4EditId.id &&
                                    rowData4EditId.data?.id !== rowData4EditId.id
                                )
                            }
                            onClick={() => {
                                const from = rowData4EditId.data?.id ?? 0;
                                const to = rowData4EditId.id ?? 0;
                                moveId({ type, from, to });
                            }}
                        >
                            Continue Move
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog open={!!rowData4Json} onOpenChange={(e) => !e && setRowData4Json(undefined)}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <Textarea defaultValue={JSON.stringify(rowData4Json, null, 2)} readOnly />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export { TypedDataTable };
