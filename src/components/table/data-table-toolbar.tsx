import { PetTypeIcon } from "@/components/icons";
import { DataTableFilter } from "@/components/table/data-table-filter";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataHeader, DataType, RefValueType } from "@/config/base";
import { queryNamedIdList } from "@/config/config";
import { useConfigStore } from "@/store/configStore";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    headers: DataHeader[];
}

export function DataTableToolbar<TData>({ table, headers }: DataTableToolbarProps<TData>) {
    const config = useConfigStore((state) => state.config);
    const onClickNew = table.options.meta?.onClickNew;
    const onClickDelete = table.options.meta?.onClickDelete;
    const onClickReset = table.options.meta?.onClickReset;
    const onClickResort = table.options.meta?.onClickResort;
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="global filter..."
                    value={table.getState().globalFilter}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {headers.map(
                    (e) =>
                        (e.type === DataType.PetType && (
                            <DataTableFilter
                                key={e.key}
                                column={table.getColumn(e.key)}
                                title={e.key}
                                options={queryNamedIdList(config, RefValueType.MonsterType)}
                                icon={PetTypeIcon}
                            />
                        )) ||
                        (e.type === DataType.SkillCategory && (
                            <DataTableFilter
                                key={e.key}
                                column={table.getColumn(e.key)}
                                title={e.key}
                                options={queryNamedIdList(config, RefValueType.SkillCategory)}
                            />
                        )),
                )}
                {(table.getState().columnFilters.length > 0 || table.getState().globalFilter) && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters();
                            table.setGlobalFilter("");
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X />
                    </Button>
                )}
            </div>
            <div className="flex flex-row-reverse items-center space-x-2">
                <DataTableViewOptions table={table} />
                {onClickReset && (
                    <Button className="mr-2" variant="outline" size="sm" onClick={() => onClickReset()}>
                        Reset
                    </Button>
                )}
                {onClickResort && (
                    <Button className="mr-2" variant="outline" size="sm" onClick={() => onClickResort()}>
                        Resort
                    </Button>
                )}
                {onClickNew && (
                    <Button className="mr-2" variant="outline" size="sm" onClick={() => onClickNew()}>
                        New
                    </Button>
                )}
                {onClickDelete && (
                    <Button
                        className="mr-2"
                        variant="outline"
                        size="sm"
                        disabled={!table.getSelectedRowModel().flatRows.length}
                        onClick={onClickDelete}
                    >
                        Delete
                    </Button>
                )}
            </div>
        </div>
    );
}
