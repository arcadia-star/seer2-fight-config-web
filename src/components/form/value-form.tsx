import { SelectForm } from "@/components/form/select-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExprValue, RefValue, RefValueType, Value } from "@/config/base";
import { DataConfig, queryNameById, queryNamedIdList, ValueEnumType } from "@/config/config";
import { argVars } from "@/config/hca-utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const ValueType = {
    raw: "raw",
    expr: "expr",
    ref: "ref",
    arg: "arg",
};
const ValueEnum = "enum";

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
    const vars = argVars;
    const name = queryNameById(config, id, type);
    const idx = vars.findIndex((e) => !name.includes(e));
    return vars.slice(0, idx >= 0 ? idx : vars.length);
}

function adjustArgsLength<T>(value: T, onValueChange: (t: T) => void, args: Value[], length: number) {
    if (args.length > length) {
        onValueChange({ ...value, args: args.slice(0, length) });
    } else if (args.length < length) {
        const array = [];
        const len = length - args.length;
        for (let i = 0; i < len; i++) {
            array.push({});
        }
        onValueChange({ ...value, args: args.concat(array) });
    }
}

interface ArgValueProps {
    value: Value;
    onValueChange: (value: Value) => void;
    config: DataConfig;
}

export function ValueForm({ value, onValueChange, config }: ArgValueProps) {
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
        if (value.arg) {
            return ValueType.arg;
        }
        for (const { key } of ValueEnumType) {
            if ((value as Record<string, number>)[key]) {
                return key;
            }
        }
        return null;
    })(value);
    const valueEnumType0 = ValueEnumType.find((e) => (value as Record<string, number>)[e.key])?.key;
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
                                            <SelectItem value={e.key}>{e.key}</SelectItem>
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
                                    onValueChange({});
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
                        onChange={(e) => onValueChange({ raw: e.target.value.trim() })}
                    />
                )}
                {valueTab === ValueType.expr && (
                    <ExprValueFrom
                        value={value.expr ?? { fmt: "", args: [] }}
                        onValueChange={(expr) => onValueChange({ expr })}
                        config={config}
                    />
                )}
                {valueTab === ValueType.ref && (
                    <RefValueForm
                        value={value.ref ?? { id: 0, args: [] }}
                        onValueChange={(ref) => onValueChange({ ref })}
                        config={config}
                        type={RefValueType.Value}
                    ></RefValueForm>
                )}
                {valueTab === ValueType.arg && (
                    <SelectForm
                        options={argVars.map((e, idx) => ({ id: idx + 1, name: e, tips: "" }))}
                        value={value.arg ?? 0}
                        onValueChange={(arg) => onValueChange({ arg })}
                    ></SelectForm>
                )}
                {ValueEnumType.map(
                    ({ key, type }) =>
                        valueTab == key && (
                            <SelectForm
                                key={key}
                                options={queryNamedIdList(config, type)}
                                value={(value as Record<string, number>)[key]}
                                onValueChange={(e) => onValueChange({ [key]: e })}
                                placeholder={key}
                            />
                        ),
                )}
            </div>
        </div>
    );
}

interface ExprValueProps {
    value: ExprValue;
    onValueChange: (value: ExprValue) => void;
    config: DataConfig;
}

function ExprValueFrom({ value, onValueChange, config }: ExprValueProps) {
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
                    <ValueForm
                        value={e}
                        onValueChange={(v) =>
                            onValueChange({
                                ...value,
                                args: args.map((e, i) => (i === idx ? v : e)),
                            })
                        }
                        config={config}
                    ></ValueForm>
                </div>
            ))}
        </div>
    );
}

interface RefValueProps {
    value: RefValue;
    onValueChange: (value: RefValue) => void;
    type: RefValueType;
    config: DataConfig;
}

export function RefValueForm({ value, onValueChange, type, config }: RefValueProps) {
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
                    <ValueForm
                        value={e}
                        onValueChange={(v) =>
                            onValueChange({
                                ...value,
                                args: args.map((e, i) => (i === idx ? v : e)),
                            })
                        }
                        config={config}
                    ></ValueForm>
                </div>
            ))}
        </div>
    );
}
