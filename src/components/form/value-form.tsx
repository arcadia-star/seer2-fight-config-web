import { SelectForm } from "@/components/form/select-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Expr, RefValueType, Value } from "@/config/base";
import { ArgNameIds, ArgVars } from "@/config/compiler";
import { DataConfig, queryNameById, queryNamedIdList, ValueEnumType } from "@/config/config";
import { field, fieldSet } from "@/lib/utils.ts";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

function buildValueExprArgs(fmt: string) {
    if (!fmt) {
        return [];
    }
    return (fmt.match(/\{}/g) ?? []).map((_e, idx) => ({
        name: "" + idx,
    }));
}

function buildValueRefArgs(type: RefValueType, id: number, config: DataConfig) {
    if (!id) {
        return [];
    }
    const vars = ArgVars;
    const name = queryNameById(config, type, id);
    const idx = vars.findIndex((e) => !name.includes(e));
    return vars.slice(0, idx >= 0 ? idx : vars.length);
}

function adjustArgsLength<
    T,
    F extends {
        args: T[];
    },
>(value: F, onValueChange: (t: F) => void, args: T[], length: number) {
    if (args.length > length) {
        onValueChange({ ...value, args: args.slice(0, length) });
    } else if (args.length < length) {
        const array = [];
        const len = length - args.length;
        for (let i = 0; i < len; i++) {
            array.push({} as T);
        }
        onValueChange({ ...value, args: args.concat(array) });
    }
}

type ValueProps<T> = {
    value: T;
    onValueChange: (value: T) => void;
    config: DataConfig;
};

type ValueGecBase<T> = {
    raw?: string | null | undefined;
    expr?: ExprValueGec<T> | null | undefined;
    ref?: RefValueGec<T> | null | undefined;
};

interface ValueGecFormProps<T> extends ValueProps<T> {
    ArgComponent: React.ComponentType<ValueProps<T>>;
    type: RefValueType;
}

function ValueGecForm<T extends ValueGecBase<T>>({
    value,
    onValueChange,
    config,
    ArgComponent,
    type,
}: ValueGecFormProps<T>) {
    const ValueType = {
        raw: "raw",
        expr: "expr",
        ref: "ref",
    };
    const ValueTypeExt = {
        arg: "arg",
    };
    if (type === RefValueType.RawExpr) {
        fieldSet(ValueType, ValueTypeExt.arg, ValueTypeExt.arg);
    }
    const ValueEnum = "enum";

    const [valueType, setValueType] = useState(ValueType.raw);
    const [valueEnumType, setValueEnumType] = useState("buff");

    const valueType0 = ((value) => {
        if (!value) {
            return null;
        }
        if (value.raw) {
            return ValueType.raw;
        }
        if (value.expr?.fmt) {
            return ValueType.expr;
        }
        if (value.ref?.id) {
            return ValueType.ref;
        }
        if (field(value, ValueTypeExt.arg)) {
            return field(ValueType, ValueTypeExt.arg);
        }
        for (const { key } of ValueEnumType) {
            if (field(value, key)) {
                return key;
            }
        }
        return null;
    })(value);
    const valueEnumType0 = ValueEnumType.find((e) => field(value, e.key))?.key;
    const valueEnumRadioDisplay = valueEnumType0 || valueEnumType;
    const valueRadioDisplay = valueEnumType0 ? ValueEnum : valueType0 || valueType;
    const valueTab = valueType0 || (valueType === ValueEnum ? valueEnumRadioDisplay : valueType);

    return (
        <div className="border-l border-gray-500">
            <div className="flex">
                <RadioGroup
                    disabled={!!valueType0}
                    className="flex border-t border-gray-500"
                    value={valueRadioDisplay}
                    onValueChange={(e) => setValueType(e)}
                >
                    {Object.values(ValueType).map((e) => (
                        <div key={e} className="flex items-center space-x-2">
                            <RadioGroupItem value={e} id={e} />
                            <Label htmlFor={e}>{e}</Label>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={ValueEnum} />
                        <Label>{ValueEnum}</Label>
                        {valueRadioDisplay === ValueEnum && (
                            <Select
                                value={valueEnumRadioDisplay}
                                onValueChange={(e) => setValueEnumType(e)}
                                disabled={!!valueType0}
                            >
                                <SelectTrigger className="w-[150px] h-8 border-0 shadow-none focus:ring-0">
                                    <SelectValue placeholder="Select one enum" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {ValueEnumType.map((e) => (
                                            <SelectItem key={e.key} value={e.key}>
                                                {e.key}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </RadioGroup>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                className="rounded-full"
                                size="icon"
                                onClick={() => {
                                    onValueChange({} as T);
                                    setValueType(ValueType.raw);
                                }}
                            >
                                {!!valueType0 && <X />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div>
                                <pre>
                                    <code>{JSON.stringify([value, valueType], null, 2)}</code>
                                </pre>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div>
                {valueTab === ValueType.raw && (
                    <Input
                        className="w-[380px]"
                        placeholder="raw value expr"
                        value={value.raw ?? ""}
                        onChange={(e) => onValueChange({ raw: e.target.value.trim() } as T)}
                    />
                )}
                {valueTab === ValueType.expr && (
                    <ExprValueGecFrom
                        value={value.expr ?? { fmt: "", args: [] }}
                        onValueChange={(expr) => onValueChange({ expr } as T)}
                        config={config}
                        ArgComponent={ArgComponent}
                    />
                )}
                {valueTab === ValueType.ref && (
                    <RefValueGecForm
                        value={value.ref ?? { id: 0, args: [] }}
                        onValueChange={(ref) => onValueChange({ ref } as T)}
                        config={config}
                        type={type}
                        ArgComponent={ArgComponent}
                    ></RefValueGecForm>
                )}
                {valueTab === ValueTypeExt.arg && (
                    <SelectForm
                        options={ArgNameIds}
                        value={field(value, ValueTypeExt.arg) ?? 0}
                        onValueChange={(arg) => onValueChange({ arg } as unknown as T)}
                    ></SelectForm>
                )}
                {ValueEnumType.map(
                    ({ key, type }) =>
                        valueTab == key && (
                            <SelectForm
                                key={key}
                                options={queryNamedIdList(config, type)}
                                value={field(value, key)}
                                onValueChange={(e) => onValueChange({ [key]: e } as unknown as T)}
                                placeholder={key}
                            />
                        ),
                )}
            </div>
        </div>
    );
}

type ExprValueGec<T> = {
    fmt: string;
    args: T[];
};

interface ExprValueGecProps<T> extends ValueProps<ExprValueGec<T>> {
    ArgComponent: React.ComponentType<ValueProps<T>>;
}

function ExprValueGecFrom<T>({ value, onValueChange, config, ArgComponent }: ExprValueGecProps<T>) {
    const fmt = value.fmt;
    const args = value.args;
    const params = buildValueExprArgs(fmt);
    useEffect(() => {
        adjustArgsLength(value, onValueChange, args, params.length);
    }, [value, onValueChange, args, params.length]);
    return (
        <div>
            <Input
                className="w-[380px]"
                placeholder="expr"
                value={fmt}
                onChange={(e) => onValueChange({ ...value, fmt: e.target.value })}
            />
            {args.map((e, idx) => (
                <div key={idx} className="ml-[60px]">
                    <Label></Label>
                    <ArgComponent
                        value={e}
                        onValueChange={(v) =>
                            onValueChange({
                                ...value,
                                args: args.map((e, i) => (i === idx ? v : e)),
                            })
                        }
                        config={config}
                    />
                </div>
            ))}
        </div>
    );
}

type RefValueGec<T> = {
    id: number;
    args: T[];
};

interface RefValueGecProps<T> extends ValueProps<RefValueGec<T>> {
    type: RefValueType;
    ArgComponent: React.ComponentType<ValueProps<T>>;
}

function RefValueGecForm<T>({ value, onValueChange, config, type, ArgComponent }: RefValueGecProps<T>) {
    const id = value.id;
    const args = value.args;
    const params = buildValueRefArgs(type, id, config);
    useEffect(() => {
        adjustArgsLength(value, onValueChange, args, params.length);
    }, [value, onValueChange, args, params.length]);
    return (
        <div>
            <SelectForm
                options={queryNamedIdList(config, type)}
                value={id}
                onValueChange={(id) => onValueChange({ ...value, id })}
            />
            {args.map((e, idx) => (
                <div key={idx} className="ml-[60px]">
                    <Label>{params[idx]}</Label>
                    <ArgComponent
                        value={e}
                        onValueChange={(v) =>
                            onValueChange({
                                ...value,
                                args: args.map((e, i) => (i === idx ? v : e)),
                            })
                        }
                        config={config}
                    />
                </div>
            ))}
        </div>
    );
}

export function ValueForm({ value, onValueChange, config }: ValueProps<Value>) {
    return (
        <ValueGecForm
            value={value}
            onValueChange={onValueChange}
            config={config}
            ArgComponent={ValueForm}
            type={RefValueType.Value}
        />
    );
}

export function ExprForm({ value, onValueChange, config }: ValueProps<Expr>) {
    return (
        <ValueGecForm
            value={value}
            onValueChange={onValueChange}
            config={config}
            ArgComponent={ExprForm}
            type={RefValueType.RawExpr}
        />
    );
}

interface RefValueProps extends ValueProps<RefValueGec<Value>> {
    type: RefValueType;
}

export function RefValueForm(props: RefValueProps) {
    return RefValueGecForm({ ArgComponent: ValueForm, ...props });
}
