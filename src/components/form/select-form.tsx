import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NamedId } from "@/config/base";
import { cn } from "@/lib/utils.ts";
import { Check, ChevronsUpDown, SearchIcon, X } from "lucide-react";
import React, { useRef, useState, WheelEventHandler } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

interface SelectFormProps {
    options: NamedId[];
    value: number;
    onValueChange: (value: number) => void;
    placeholder?: string;
    icon?: (props: { id: number; size: number; className: string }) => React.ReactNode;
}

function SelectForm({ options, value, onValueChange, placeholder, icon }: SelectFormProps) {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const searchAsNumber = Number(searchTerm);
    const filterOptions = options.filter(
        (option) => option.name?.includes(searchTerm) || (searchAsNumber && option.id === searchAsNumber),
    );
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const handleWheel: WheelEventHandler<HTMLDivElement> = (e) => {
        virtuosoRef.current?.scrollBy({
            top: e.deltaY.valueOf(),
        });
    };
    return (
        <div className="flex">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-100 justify-between">
                        <div className="flex items-center">
                            {!!value && (
                                <>
                                    {icon &&
                                        icon({
                                            id: value,
                                            size: 16,
                                            className: "mr-2",
                                        })}
                                    {options.find((opt) => opt.id === value)?.name || value}
                                </>
                            )}
                        </div>
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-100 p-0">
                    <div className="flex h-9 items-center gap-2 border-b px-3">
                        <SearchIcon className="size-4 shrink-0 opacity-50" />
                        <input
                            placeholder={placeholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                                "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
                                "h-9",
                            )}
                        />
                    </div>
                    <div onWheel={handleWheel}>
                        <Virtuoso
                            ref={virtuosoRef}
                            style={{ height: "300px" }}
                            totalCount={filterOptions.length}
                            itemContent={(index) => {
                                const { id, name } = filterOptions[index];
                                return (
                                    <div
                                        key={id}
                                        onClick={() => {
                                            onValueChange(id);
                                            setOpen(false);
                                            setSearchTerm("");
                                        }}
                                    >
                                        <div className="hover:bg-gray-300 relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                            {icon &&
                                                icon({
                                                    id,
                                                    size: 16,
                                                    className: "mr-2",
                                                })}
                                            <span>{id + "-" + name}</span>
                                            {id === value && (
                                                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                                    <Check className="h-4 w-4" />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
                            initialTopMostItemIndex={Math.max(
                                filterOptions.findIndex((opt) => opt.id === Number(value)),
                                0,
                            )}
                        />
                    </div>
                </PopoverContent>
            </Popover>
            <Button type="button" variant="ghost" className="rounded-full" size="icon" onClick={() => onValueChange(0)}>
                {!!value && <X />}
            </Button>
        </div>
    );
}

export { SelectForm };
