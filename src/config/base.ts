import {
    ConfigSchema,
    Effect,
    Effects,
    Expr,
    ExprValue,
    MainConfig,
    Monster,
    NamedId,
    RefValue,
    TemplateData,
    Value,
} from "@/config/config-schema";
import { DataHeader, DataType, MonsterSkillDataHeaders, RefValueType } from "@/config/config-table";

export { ConfigSchema, DataType, MainConfig, MonsterSkillDataHeaders, RefValueType };
export type { DataHeader, Effect, Effects, Expr, ExprValue, Monster, NamedId, RefValue, TemplateData, Value };

export const RefValueSchema = {
    [RefValueType.Monster]: ConfigSchema.Monster,
    [RefValueType.Skill]: ConfigSchema.Skill,
    [RefValueType.Feature]: ConfigSchema.Feature,
    [RefValueType.Emblem]: ConfigSchema.Emblem,
    [RefValueType.Weather]: ConfigSchema.Weather,
    [RefValueType.Buff]: ConfigSchema.Buff,
    [RefValueType.Item]: ConfigSchema.Item,
    [RefValueType.Character]: ConfigSchema.Character,
    [RefValueType.MonsterType]: ConfigSchema.MonsterType,
    [RefValueType.SkillCategory]: ConfigSchema.SkillCategory,
    [RefValueType.RawHook]: ConfigSchema.RawHook,
    [RefValueType.RawOrder]: ConfigSchema.RawOrder,
    [RefValueType.RawExpr]: ConfigSchema.RawExpr,
    [RefValueType.Value]: ConfigSchema.HcaValue,
    [RefValueType.Condition]: ConfigSchema.HcaCondition,
    [RefValueType.Action]: ConfigSchema.HcaAction,
    [RefValueType.Hook]: ConfigSchema.HcaHook,
    [RefValueType.Array]: ConfigSchema.HcaArray,
    [RefValueType.Template]: ConfigSchema.Template,
};

export const RefValueHeaders = {
    [RefValueType.Monster]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "petDemo",
            type: DataType.PetAvatar,
            accessorKey: "id",
            name: "icon",
            displayOnly: true,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "feature",
            type: DataType.PetFeature,
        },
        {
            key: "type",
            type: DataType.PetType,
        },
        {
            key: "atk",
            type: DataType.Number,
        },
        {
            key: "def",
            type: DataType.Number,
        },
        {
            key: "spk",
            type: DataType.Number,
        },
        {
            key: "spf",
            type: DataType.Number,
        },
        {
            key: "spd",
            type: DataType.Number,
        },
        {
            key: "hpm",
            type: DataType.Number,
        },
        {
            key: "from",
            type: DataType.PetAvatar,
        },
        {
            key: "skills",
            type: DataType.PetSkills,
        },
    ],
    [RefValueType.Skill]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "power",
            type: DataType.Number,
        },
        {
            key: "anger",
            type: DataType.Number,
        },
        {
            key: "type",
            type: DataType.PetType,
        },
        {
            key: "category",
            type: DataType.SkillCategory,
        },
        {
            key: "accuracy",
            type: DataType.Number,
        },
        {
            key: "effects",
            type: DataType.Effects,
        },
    ],
    [RefValueType.Feature]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "petFeature",
            type: DataType.PetFeature,
            accessorKey: "id",
            name: "icon",
            displayOnly: true,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "effects",
            type: DataType.Effects,
        },
    ],
    [RefValueType.Emblem]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "petEmblem",
            type: DataType.PetEmblem,
            accessorKey: "id",
            name: "icon",
            displayOnly: true,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "effects",
            type: DataType.Effects,
        },
    ],
    [RefValueType.Weather]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "fightWeather",
            type: DataType.FightWeather,
            accessorKey: "id",
            name: "icon",
            displayOnly: true,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "effects",
            type: DataType.Effects,
        },
    ],
    [RefValueType.Buff]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "fightWeather",
            type: DataType.FightBuff,
            accessorKey: "id",
            name: "icon",
            displayOnly: true,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "effects",
            type: DataType.Effects,
        },
    ],
    [RefValueType.Item]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "effects",
            type: DataType.Effects,
        },
    ],
    [RefValueType.Character]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "atk",
            type: DataType.Number,
        },
        {
            key: "def",
            type: DataType.Number,
        },
        {
            key: "spk",
            type: DataType.Number,
        },
        {
            key: "spf",
            type: DataType.Number,
        },
        {
            key: "spd",
            type: DataType.Number,
        },
        {
            key: "hpm",
            type: DataType.Number,
        },
    ],
    [RefValueType.MonsterType]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "monsterType",
            type: DataType.PetType,
            accessorKey: "id",
            name: "icon",
            displayOnly: true,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
    ],
    [RefValueType.SkillCategory]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
    ],
    [RefValueType.RawHook]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "value",
            type: DataType.String,
        },
        {
            key: "counter",
            type: DataType.RefCounter,
            accessorKey: "id",
            displayOnly: true,
        },
    ],
    [RefValueType.RawOrder]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "value",
            type: DataType.Number,
        },
        {
            key: "counter",
            type: DataType.RefCounter,
            accessorKey: "id",
            displayOnly: true,
        },
    ],
    [RefValueType.RawExpr]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "value",
            type: DataType.RawExpr,
        },
        {
            key: "counter",
            type: DataType.RefCounter,
            accessorKey: "id",
            displayOnly: true,
        },
    ],
    [RefValueType.Value]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "expr",
            type: DataType.RawExpr,
        },
        {
            key: "counter",
            type: DataType.RefCounter,
            accessorKey: "id",
            displayOnly: true,
        },
    ],
    [RefValueType.Condition]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "expr",
            type: DataType.RawExpr,
        },
        {
            key: "counter",
            type: DataType.RefCounter,
            accessorKey: "id",
            displayOnly: true,
        },
    ],
    [RefValueType.Action]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "expr",
            type: DataType.RawExpr,
        },
        {
            key: "counter",
            type: DataType.RefCounter,
            accessorKey: "id",
            displayOnly: true,
        },
    ],
    [RefValueType.Hook]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "hook",
            type: DataType.RefRawHook,
        },
        {
            key: "order",
            type: DataType.RefRawOrder,
        },
        {
            key: "expr",
            type: DataType.RawExpr,
        },
        {
            key: "counter",
            type: DataType.RefCounter,
            accessorKey: "id",
            displayOnly: true,
        },
    ],
    [RefValueType.Array]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "data",
            type: DataType.RefArray,
        },
        {
            key: "counter",
            type: DataType.RefCounter,
            accessorKey: "id",
            displayOnly: true,
        },
    ],
    [RefValueType.Template]: [
        {
            key: "id",
            type: DataType.ID,
        },
        {
            key: "name",
            type: DataType.Name,
        },
        {
            key: "tips",
            type: DataType.Tips,
        },
        {
            key: "data",
            type: DataType.Template,
        },
        {
            key: "counter",
            type: DataType.RefCounter,
            accessorKey: "id",
            displayOnly: true,
        },
    ],
};
