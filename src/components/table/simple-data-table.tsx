import { DataTableBase } from "@/components/table/data-table-base";
import { buildColumns, buildGlobalFilterFn } from "@/components/table/data-table-columns";
import { DataHeader, NamedId } from "@/config/base";
import { useConfigStore } from "@/store/configStore";
import {
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

interface DataTable0Props<TData> {
    headers: DataHeader[];
    data: TData[];
}

export function SimpleDataTable<TData extends NamedId>({ headers, data }: DataTable0Props<TData>) {
    const config = useConfigStore((state) => state.config);

    const table = useReactTable({
        data,
        columns: buildColumns<TData>(headers, config).filter((e) => !e.id?.startsWith("_")),
        state: {},
        meta: {
            headers,
        },
        enableRowSelection: true,
        autoResetPageIndex: false,
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
        </div>
    );
}
