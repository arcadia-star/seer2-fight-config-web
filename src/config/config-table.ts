export enum RefValueType {
    Monster,
    Skill,
    Feature,
    Emblem,
    Weather,
    Buff,
    Item,
    Character,
    MonsterType,
    SkillCategory,
    RawHook,
    RawOrder,
    RawExpr,
    Value,
    Condition,
    Action,
    Hook,
    Array,
    Template,
}

export enum DataType {
    ID,
    Name,
    Tips,
    Number,
    String,
    PetType,
    PetAvatar,
    PetFeature,
    PetEmblem,
    PetSkills,
    SkillCategory,
    FightWeather,
    FightBuff,
    Effects,
    RefRawHook,
    RefRawOrder,
    RefArray,
    Template,
    Json,
    RefCounter,
    RawExpr,
}

export type DataHeader = {
    key: string;
    type: DataType;
    accessorKey?: string;
    name?: string;
    tips?: string;
    displayOnly?: boolean;
};

export const MonsterSkillDataHeaders: DataHeader[] = [
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
];
