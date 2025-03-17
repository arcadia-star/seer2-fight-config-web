import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row, Table } from "@tanstack/react-table";
import { Edit, MoreHorizontal } from "lucide-react";

export const EDIT_ROW_TYPE = "edit-row";

export function DataTableRowActions<TData>({ row, table }: { row: Row<TData>; table: Table<TData> }) {
    const original = row.original;
    const onRowActions = table.options.meta?.onRowActions ?? [];
    const onEditRow = onRowActions.find((e) => e.type === EDIT_ROW_TYPE);

    return (
        <div className="flex">
            <div>
                {onEditRow && (
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        onClick={() => onEditRow?.onClick(original)}
                    >
                        <Edit />
                    </Button>
                )}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                        <MoreHorizontal />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    {onRowActions.map((e, idx) => (
                        <DropdownMenuItem key={idx} onClick={() => e.onClick(original)}>
                            {e.node()}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
