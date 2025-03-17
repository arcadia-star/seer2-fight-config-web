import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Effect, RefValue, RefValueType, TemplateData, Value } from "@/config/base";
import { DataConfig, queryNamedId, ValueEnumType } from "@/config/config";
import { Fragment, ReactNode } from "react";

export const argVars = ["X", "Y", "Z", "A", "B", "C", "D", "E", "F"];

const unknown = (arg: ReactNode) => {
    return <span className="text-red-500">??-{arg}</span>;
};
const fmt = (fmt: string, args: ReactNode[]) => {
    let idx = 0;
    return fmt.split(/({})/g).map((e, i) => {
        return <Fragment key={i}>{e === "{}" ? args[idx++] : e}</Fragment>;
    });
};
const namedId = (config: DataConfig, id: number, type: RefValueType) => {
    return queryNamedId(config, id, type);
};
const join = (array: ReactNode[], separator: ReactNode, start?: ReactNode, end?: ReactNode) => {
    return (
        !!array.length && (
            <>
                {start}
                {array?.map((el, idx) => (
                    <Fragment key={idx}>
                        {el}
                        {idx !== array.length - 1 && separator}
                    </Fragment>
                ))}
                {end}
            </>
        )
    );
};
const desc = (config: DataConfig, hca: RefValue, type: RefValueType) => {
    return (
        <>
            {namedId(config, hca.id, type)?.name ?? unknown(hca.id)}
            {join(
                hca.args.map((e) => valueDesc(config, e)),
                "、",
                "(",
                ")",
            )}
        </>
    );
};
const valueDesc = (config: DataConfig, value: Value): ReactNode => {
    if (value.raw) {
        return <span className="text-green-500">{value.raw}</span>;
    }
    if (value.expr) {
        const args = value.expr.args.map((v) => valueDesc(config, v));
        return <>{fmt(value.expr.fmt, args)}</>;
    }
    if (value.ref?.id) {
        return desc(config, value.ref, RefValueType.Value);
    }
    if (value.arg) {
        return <span className="text-red-500">{argVars[value.arg - 1] ?? unknown(value.arg)}</span>;
    }
    for (const { key, type } of ValueEnumType) {
        const id = (value as Record<string, number>)[key];
        if (id) {
            const data = namedId(config, id, type);
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-blue-500">{data?.name ?? unknown(id)}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>
                                {data?.id}-{data?.tips}
                            </span>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }
    }
    return unknown("??");
};
export const refValueHumanDesc = (config: DataConfig, type: RefValueType, value: RefValue) => {
    return desc(config, value, type);
};
export const templateHumanDesc = (config: DataConfig, template: TemplateData[]) => {
    return template.map((e, idx) => (
        <div key={idx}>
            {refValueHumanDesc(config, RefValueType.Hook, e.hook)}、
            {refValueHumanDesc(config, RefValueType.Action, e.action)}
        </div>
    ));
};
export const effectsHumanDesc = (config: DataConfig, effects: Effect[]) => {
    return effects.map((effect, idx) => (
        <div key={idx}>
            {join(
                effect.conditions.map((e) => desc(config, e, RefValueType.Condition)),
                "、",
            )}
            {effect.conditions.length > 0 && "、"}
            {desc(config, effect.template, RefValueType.Template)}
        </div>
    ));
};
export const valuesHumanDesc = (config: DataConfig, values: Value[]) => {
    return values.map((value, idx) => <div key={idx}>{valueDesc(config, value)}</div>);
};
