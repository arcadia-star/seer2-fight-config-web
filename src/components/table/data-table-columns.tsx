import {
    FightBuffIcon,
    FightWeatherIcon,
    PetAvatarIcon,
    PetEmblemIcon,
    PetFeatureIcon,
    PetTypeIcon,
} from "@/components/icons";
import { DataTableHeader } from "@/components/table/data-table-header";
import { Checkbox } from "@/components/ui/checkbox";
import { DataHeader, DataType, RefValueType } from "@/config/base";
import { DataConfig, queryNameById, refCounter } from "@/config/config";
import { CellContext, Column, ColumnDef, FilterFn, RowData } from "@tanstack/react-table";
import { JSX } from "react";

import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import {
    effectsHumanDesc,
    exprHumanDesc,
    namedIdHumanDesc,
    templateHumanDesc,
    valuesHumanDesc,
} from "@/config/hca-utils";
import { compress } from "@/lib/utils";
import JSON5 from "json5";

export function buildGlobalFilterFn<TData>(headers: DataHeader[]): FilterFn<TData> {
    const numEqColumnIds = headers.filter((h) => h.type == DataType.ID).map((h) => h.key);
    const strMatchColumnIds = headers
        .filter((h) => h.type == DataType.Name || h.type == DataType.Tips)
        .map((h) => h.key);
    return (row, id, value) => {
        if (numEqColumnIds.includes(id)) {
            const v = Number(value);
            return !isNaN(v) && row.getValue(id) === v;
        }
        if (strMatchColumnIds.includes(id)) {
            return (row.getValue(id) as string)?.includes(value);
        }
        return false;
    };
}

export function buildColumns<TData extends RowData>(headers: DataHeader[], config: DataConfig): ColumnDef<TData>[] {
    return [
        {
            id: "_select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        ...headers.map((h) => ({
            id: h.key,
            accessorKey: h.accessorKey ?? h.key,
            header: ({ column }: { column: Column<TData> }) => (
                <DataTableHeader column={column} title={h.name ?? h.key} />
            ),
            cell: buildCell<TData>(h.type, h.key, config),
            filterFn: buildFilterFn<TData>(h.type),
            enableSorting: buildEnableSorting(h.type),
            enableHiding: buildEnableHiding(h.type),
        })),
        {
            id: "_actions",
            cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
        },
    ];
}

function buildCell<TData extends RowData, TValue = unknown>(
    type: DataType,
    key: string,
    config: DataConfig,
): (cell: CellContext<TData, TValue>) => JSX.Element {
    if (DataType.PetType === type) {
        return ({ row }) => (
            <>
                {(row.getValue(key) as number) > 0 && (
                    <div>
                        <PetTypeIcon id={row.getValue(key)} size={20} />
                    </div>
                )}
            </>
        );
    }
    if (DataType.PetFeature === type) {
        return ({ row }) => (
            <>
                {(row.getValue(key) as number) > 0 && (
                    <div>
                        <PetFeatureIcon id={row.getValue(key)} />
                    </div>
                )}
            </>
        );
    }
    if (DataType.PetEmblem === type) {
        return ({ row }) => (
            <>
                {(row.getValue(key) as number) > 0 && (
                    <div>
                        <PetEmblemIcon id={row.getValue(key)} size={40} />
                    </div>
                )}
            </>
        );
    }
    if (DataType.FightWeather === type) {
        return ({ row }) => (
            <>
                {(row.getValue(key) as number) > 0 && (
                    <div>
                        <FightWeatherIcon id={row.getValue(key)} size={40} />
                    </div>
                )}
            </>
        );
    }
    if (DataType.FightBuff === type) {
        return ({ row }) => (
            <>
                {(row.getValue(key) as number) > 0 && (
                    <div>
                        <FightBuffIcon id={row.getValue(key)} size={40} />
                    </div>
                )}
            </>
        );
    }
    if (DataType.PetAvatar === type) {
        return ({ row }) => (
            <>
                {(row.getValue(key) as number) > 0 && (
                    <div>
                        <PetAvatarIcon id={row.getValue(key)} size={40} className="max-h-[40px]" />
                    </div>
                )}
            </>
        );
    }
    if (DataType.SkillCategory === type) {
        return ({ row }) => (
            <>
                {(row.getValue(key) as number) > 0 && (
                    <div>{queryNameById(config, RefValueType.SkillCategory, row.getValue(key))}</div>
                )}
            </>
        );
    }
    if (DataType.PetSkills === type) {
        return ({ row }) => (
            <>{(row.getValue(key) as number[])?.map((e) => queryNameById(config, RefValueType.Skill, e)).join("、")}</>
        );
    }
    if (
        DataType.Number === type ||
        DataType.Tips === type ||
        DataType.String === type ||
        DataType.ID === type ||
        DataType.Name === type
    ) {
        return ({ row }) => <div>{row.getValue(key)}</div>;
    }
    if (DataType.Effects === type) {
        return ({ row }) => <div>{effectsHumanDesc(config, row.getValue(key))}</div>;
    }
    if (DataType.RefRawHook === type) {
        return ({ row }) => <div>{namedIdHumanDesc(config, RefValueType.RawHook, row.getValue(key))}</div>;
    }
    if (DataType.RefRawOrder === type) {
        return ({ row }) => <div>{namedIdHumanDesc(config, RefValueType.RawOrder, row.getValue(key))}</div>;
    }
    if (DataType.RefArray === type) {
        return ({ row }) => <div>{valuesHumanDesc(config, row.getValue(key))}</div>;
    }
    if (DataType.Template === type) {
        return ({ row }) => <div>{templateHumanDesc(config, row.getValue(key))}</div>;
    }
    if (DataType.Json === type) {
        return ({ row }) => <div>{JSON5.stringify(compress(row.getValue(key)))}</div>;
    }
    if (DataType.RefCounter === type) {
        return ({ row, table }) => (
            <div>
                {table.options.meta?.type &&
                    refCounter(config.main, table.options.meta?.type, row.getValue(key)).length}
            </div>
        );
    }
    if (DataType.RawExpr === type) {
        return ({ row }) => <div>{exprHumanDesc(config, row.getValue(key))}</div>;
    }
    return ({ row }) => <div>JSON:{JSON.stringify(row.getValue(key))}</div>;
}

function buildFilterFn<TData extends RowData>(type: DataType): FilterFn<TData> | undefined {
    if (DataType.PetType === type || DataType.SkillCategory === type) {
        return (row, id, value) => value.includes(row.getValue(id));
    }
}

function buildEnableSorting(type: DataType) {
    return (
        DataType.ID === type || DataType.Number === type || DataType.PetType === type || DataType.SkillCategory === type
    );
}

function buildEnableHiding(type: DataType) {
    return type != DataType.ID && type != DataType.Name;
}
