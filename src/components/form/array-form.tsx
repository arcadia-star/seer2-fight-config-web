import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface ArrayFormProps<T> {
    value: T[];
    onValueChange: (value: T[]) => void;
    defaultElement: () => T;
    children: ({ value, onValueChange }: { value: T; onValueChange: (value: T) => void }) => React.ReactNode;
}

export function ArrayForm<T>({ value, onValueChange, defaultElement, children }: ArrayFormProps<T>) {
    function add() {
        onValueChange(value.concat([defaultElement()]));
    }

    function remove(idx: number) {
        onValueChange(value.filter((_e, i) => idx !== i));
    }

    function update(idx: number, element: T) {
        onValueChange(value.map((e, i) => (i === idx ? element : e)));
    }

    return (
        <div>
            {value.map((element, idx) => (
                <div key={idx} className="flex border-l border-indigo-500/100">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-full"
                                    size="icon"
                                    onClick={() => remove(idx)}
                                >
                                    <Minus />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div>
                                    <pre>
                                        <code>{JSON.stringify(element, null, 2)}</code>
                                    </pre>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {children({
                        value: element,
                        onValueChange: (value) => update(idx, value),
                    })}
                </div>
            ))}
            <Button type="button" variant="outline" className="rounded-full" size="icon" onClick={() => add()}>
                <Plus />
            </Button>
        </div>
    );
}
