import { z, ZodArray, ZodNumber, ZodObject, ZodString, ZodType } from "zod";

export const wrapper = <T>(ctx: ZodType<T>, defaultValue: T) => z.preprocess((value) => value ?? defaultValue, ctx);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const number: ZodNumber = wrapper(z.number(), 0);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const string: ZodString = wrapper(z.string(), "");

export function array<T extends ZodType>(schema: T): ZodArray<T> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return wrapper(z.array(schema), []);
}

export function object<T extends Readonly<{ [k: string]: ZodType }>>(
    shape: T,
    // eslint-disable-next-line
): ZodObject<T, {}> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return wrapper(z.object(shape), {});
}

const Value = wrapper(
    z.interface({
        "raw?": string.nullish(),
        "monster?": number.nullish(),
        "skill?": number.nullish(),
        "feature?": number.nullish(),
        "emblem?": number.nullish(),
        "weather?": number.nullish(),
        "buff?": number.nullish(),
        "item?": number.nullish(),
        "character?": number.nullish(),
        "monster_type?": number.nullish(),
        "skill_category?": number.nullish(),
        get "expr?"() {
            return ExprValue.nullish();
        },
        get "ref?"() {
            return RefValue.nullish();
        },
    }),
    {},
);
const ExprValue = object({
    fmt: string,
    args: array(Value),
});
const RefValue = object({
    id: number,
    args: array(Value),
});
const Effect = object({
    template: RefValue,
    conditions: array(RefValue),
});
const Effects = array(Effect);

const Expr = wrapper(
    z.interface({
        "raw?": string.nullish(),
        "monster?": number.nullish(),
        "skill?": number.nullish(),
        "feature?": number.nullish(),
        "emblem?": number.nullish(),
        "weather?": number.nullish(),
        "buff?": number.nullish(),
        "item?": number.nullish(),
        "character?": number.nullish(),
        "monster_type?": number.nullish(),
        "skill_category?": number.nullish(),
        get "expr?"() {
            return object({
                fmt: string,
                args: array(Expr),
            }).nullish();
        },
        get "ref?"() {
            return object({
                id: number,
                args: array(Expr),
            }).nullish();
        },
        "arg?": number.nullish(),
    }),
    {},
);

const namedIdSchema = {
    id: number,
    name: string,
    tips: string,
};
const effectsSchema = {
    ...namedIdSchema,
    effects: array(Effect),
};
const TemplateData = object({
    hook: number,
    action: Expr,
});

export const ConfigSchema = {
    Monster: object({
        ...namedIdSchema,
        feature: number,
        type: number,
        atk: number,
        def: number,
        spk: number,
        spf: number,
        spd: number,
        hpm: number,
        from: number,
        skills: array(number),
    }),
    Skill: object({
        ...effectsSchema,
        type: number,
        power: number,
        anger: number,
        category: number,
        accuracy: number,
    }),
    Feature: object({
        ...effectsSchema,
    }),
    Emblem: object({
        ...effectsSchema,
    }),
    Weather: object({
        ...effectsSchema,
    }),
    Buff: object({
        ...effectsSchema,
    }),
    Item: object({
        ...effectsSchema,
    }),
    Character: object({
        ...namedIdSchema,
        atk: number,
        def: number,
        spk: number,
        spf: number,
        spd: number,
        hpm: number,
    }),
    MonsterType: object({
        ...namedIdSchema,
    }),
    SkillCategory: object({
        ...namedIdSchema,
    }),
    RawHook: object({
        ...namedIdSchema,
        value: string,
    }),
    RawOrder: object({
        ...namedIdSchema,
        value: number,
    }),
    RawExpr: object({
        ...namedIdSchema,
        value: Expr,
    }),
    HcaValue: object({
        ...namedIdSchema,
        expr: Expr,
    }),
    HcaCondition: object({
        ...namedIdSchema,
        expr: Expr,
    }),
    HcaAction: object({
        ...namedIdSchema,
        expr: Expr,
    }),
    HcaHook: object({
        ...namedIdSchema,
        expr: Expr,
        hook: number,
        order: number,
    }),
    HcaArray: object({
        ...namedIdSchema,
        data: array(Expr),
    }),
    Template: object({
        ...namedIdSchema,
        data: array(TemplateData),
    }),
};
export const MainConfig = object({
    _idea: wrapper(z.string(), "@formatter:off"),
    monster: array(ConfigSchema.Monster),
    skill: array(ConfigSchema.Skill),
    feature: array(ConfigSchema.Feature),
    emblem: array(ConfigSchema.Emblem),
    weather: array(ConfigSchema.Weather),
    buff: array(ConfigSchema.Buff),
    item: array(ConfigSchema.Item),
    character: array(ConfigSchema.Character),
    monster_type: array(ConfigSchema.MonsterType),
    skill_category: array(ConfigSchema.SkillCategory),
    raw_hook: array(ConfigSchema.RawHook),
    raw_order: array(ConfigSchema.RawOrder),
    raw_expr: array(ConfigSchema.RawExpr),
    value: array(ConfigSchema.HcaValue),
    condition: array(ConfigSchema.HcaCondition),
    action: array(ConfigSchema.HcaAction),
    hook: array(ConfigSchema.HcaHook),
    array: array(ConfigSchema.HcaArray),
    template: array(ConfigSchema.Template),
});

export type NamedId = {
    id: number;
    name: string;
    tips: string;
};
export type Value = z.infer<typeof Value>;
export type ExprValue = z.infer<typeof ExprValue>;
export type RefValue = z.infer<typeof RefValue>;
export type Effect = z.infer<typeof Effect>;
export type Effects = z.infer<typeof Effects>;
export type Expr = z.infer<typeof Expr>;
export type TemplateData = z.infer<typeof TemplateData>;
export type Monster = z.infer<typeof ConfigSchema.Monster>;
export type Skill = z.infer<typeof ConfigSchema.Skill>;
export type Feature = z.infer<typeof ConfigSchema.Feature>;
export type Emblem = z.infer<typeof ConfigSchema.Emblem>;
export type Weather = z.infer<typeof ConfigSchema.Weather>;
export type Buff = z.infer<typeof ConfigSchema.Buff>;
export type Item = z.infer<typeof ConfigSchema.Item>;
export type Character = z.infer<typeof ConfigSchema.Character>;
export type MonsterType = z.infer<typeof ConfigSchema.MonsterType>;
export type SkillCategory = z.infer<typeof ConfigSchema.SkillCategory>;
export type RawHook = z.infer<typeof ConfigSchema.RawHook>;
export type RawOrder = z.infer<typeof ConfigSchema.RawOrder>;
export type RawExpr = z.infer<typeof ConfigSchema.RawExpr>;
export type HcaValue = z.infer<typeof ConfigSchema.HcaValue>;
export type HcaCondition = z.infer<typeof ConfigSchema.HcaCondition>;
export type HcaAction = z.infer<typeof ConfigSchema.HcaAction>;
export type HcaHook = z.infer<typeof ConfigSchema.HcaHook>;
export type HcaArray = z.infer<typeof ConfigSchema.HcaArray>;
export type Template = z.infer<typeof ConfigSchema.Template>;
export type MainConfig = z.infer<typeof MainConfig>;
