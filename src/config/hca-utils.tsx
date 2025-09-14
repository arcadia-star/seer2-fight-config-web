import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Effect, Expr, RefValue, RefValueType, TemplateData, Value } from "@/config/base";
import { queryArgNameById } from "@/config/compiler.ts";
import { DataConfig, queryNamedId, ValueEnumType } from "@/config/config";
import { Fragment, ReactNode } from "react";

const unknown = (arg: ReactNode) => {
    return <span className="text-red-500">??-{arg}</span>;
};
const fmt = (fmt: string, args: ReactNode[]) => {
    let idx = 0;
    return fmt.split(/({})/g).map((e, i) => {
        return <Fragment key={i}>{e === "{}" ? args[idx++] : e}</Fragment>;
    });
};
const namedId = (config: DataConfig, type: RefValueType, id: number) => {
    return queryNamedId(config, type, id);
};
const namedIdDesc = (config: DataConfig, type: RefValueType, id: number) => {
    return namedId(config, type, id)?.name ?? unknown(id);
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
            {namedIdDesc(config, type, hca.id)}
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
    for (const { key, type } of ValueEnumType) {
        const id = (value as Record<string, number>)[key];
        if (id) {
            const data = namedId(config, type, id);
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
export const namedIdHumanDesc = (config: DataConfig, type: RefValueType, id: number) => {
    return namedIdDesc(config, type, id);
};
export const templateHumanDesc = (config: DataConfig, template: TemplateData[]) => {
    return template.map((e, idx) => (
        <div key={idx}>
            {namedIdDesc(config, RefValueType.Hook, e.hook)}、{exprHumanDesc(config, e.action)}
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
export const exprHumanDesc = (config: DataConfig, expr: Expr): ReactNode => {
    if (expr.raw) {
        return <span className="text-green-500">{expr.raw}</span>;
    }
    if (expr.expr) {
        const args = expr.expr.args.map((v) => exprHumanDesc(config, v));
        return <>{fmt(expr.expr.fmt, args)}</>;
    }
    if (expr.ref?.id) {
        return (
            <>
                {namedIdDesc(config, RefValueType.RawExpr, expr.ref.id)}
                {join(
                    expr.ref.args.map((e) => exprHumanDesc(config, e)),
                    "、",
                    "(",
                    ")",
                )}
            </>
        );
    }
    if (expr.arg) {
        return <span className="text-violet-500">{queryArgNameById(expr.arg) ?? unknown(expr.arg)}</span>;
    }
    for (const { key, type } of ValueEnumType) {
        const id = (expr as Record<string, number>)[key];
        if (id) {
            const data = namedId(config, type, id);
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
