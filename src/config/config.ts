import { MainConfig, Monster, NamedId, RefValueType, Value } from "@/config/base";
import { field, fieldSet } from "@/lib/utils";

export type DataConfig = {
    main: MainConfig;
};

export const ValueEnumType = [
    { key: "monster", type: RefValueType.Monster },
    { key: "skill", type: RefValueType.Skill },
    { key: "feature", type: RefValueType.Feature },
    { key: "emblem", type: RefValueType.Emblem },
    { key: "weather", type: RefValueType.Weather },
    { key: "buff", type: RefValueType.Buff },
    { key: "item", type: RefValueType.Item },
    { key: "character", type: RefValueType.Character },
    { key: "monster_type", type: RefValueType.MonsterType },
    { key: "skill_category", type: RefValueType.SkillCategory },
    { key: "array", type: RefValueType.Array },
];

const RefValueType2Key: Record<RefValueType, string> = {
    [RefValueType.Monster]: "monster",
    [RefValueType.Skill]: "skill",
    [RefValueType.Feature]: "feature",
    [RefValueType.Emblem]: "emblem",
    [RefValueType.Weather]: "weather",
    [RefValueType.Buff]: "buff",
    [RefValueType.Item]: "item",
    [RefValueType.Character]: "character",
    [RefValueType.MonsterType]: "monster_type",
    [RefValueType.SkillCategory]: "skill_category",
    [RefValueType.RawHook]: "raw_hook",
    [RefValueType.RawOrder]: "raw_order",
    [RefValueType.RawExpr]: "raw_expr",
    [RefValueType.Value]: "value",
    [RefValueType.Condition]: "condition",
    [RefValueType.Action]: "action",
    [RefValueType.Hook]: "hook",
    [RefValueType.Array]: "array",
    [RefValueType.Template]: "template",
};

export const configByType = (config: MainConfig, type: RefValueType) => {
    const key = RefValueType2Key[type];
    return {
        key,
        get: () => config[key as never] as NamedId[],
        set: (data: unknown) => (config[key as never] = data as never),
    };
};

export const queryNameById = (config: DataConfig, id: number, type: RefValueType) => {
    return queryNamedId(config, id, type)?.name ?? `<??-${id}>`;
};
export const queryNamedId = (config: DataConfig, id: number, type: RefValueType) => {
    return queryNamedIdList(config, type).find((e) => e.id === id);
};
export const queryNamedIdList = (config: DataConfig, type: RefValueType): NamedId[] => {
    return configByType(config.main, type).get();
};
export const queryMonsterChains = (config: DataConfig, monsterId: number): Monster[] => {
    const monsterChains = [];
    let now = queryNamedId(config, monsterId, RefValueType.Monster) as Monster;
    monsterChains.unshift(now);
    while (now && now.from && now.from > 0 && now.from < now.id) {
        const parent = queryNamedIdList(config, RefValueType.Monster).find((m) => m.id === now.from) as Monster;
        if (parent) {
            monsterChains.unshift(parent);
            now = parent;
        } else {
            break;
        }
    }
    return monsterChains;
};
export const modifyId = (config: MainConfig, type: RefValueType, from: number, to: number, move: boolean): boolean => {
    const namedIds: NamedId[] = config[RefValueType2Key[type] as never];

    if (!move) {
        if (namedIds.find((e) => e.id === to)) {
            return false;
        }
        namedIds.forEach((e) => {
            if (e.id === from) {
                e.id = to;
            }
        });
    }

    function updateRefValueId(e: { id: number; args: Value[] }, t: RefValueType) {
        if (t === type) {
            if (e.id === from) {
                e.id = to;
            }
        }
        e.args?.forEach(updateValue);
    }

    function updateValue(e: Value) {
        for (const { type: t, key } of ValueEnumType) {
            if (t === type) {
                if (field(e, key) === from) {
                    fieldSet(e, key, to);
                }
            }
        }
        const ref = e.ref;
        if (ref) {
            updateRefValueId(ref, RefValueType.Value);
        }
        const expr = e.expr;
        if (expr) {
            expr.args.forEach(updateValue);
        }
    }

    [config.skill, config.feature, config.emblem, config.weather, config.buff, config.item]
        .flatMap((e) => e.flatMap((e) => e.effects))
        .forEach(({ template, conditions }) => {
            updateRefValueId(template, RefValueType.Template);
            conditions.forEach((condition) => {
                updateRefValueId(condition, RefValueType.Condition);
            });
        });
    config.hook.forEach(({ hook, order }) => {
        updateRefValueId(hook, RefValueType.RawHook);
        updateRefValueId(order, RefValueType.RawOrder);
    });
    config.array.forEach((e) => {
        e.data.forEach(updateValue);
    });
    config.template
        .flatMap((e) => e.data)
        .forEach(({ hook, action }) => {
            updateRefValueId(hook, RefValueType.Hook);
            updateRefValueId(action, RefValueType.Action);
        });
    if (RefValueType.MonsterType === type) {
        config.monster.forEach((e) => {
            if (e.type === from) {
                e.type = to;
            }
        });
        config.skill.forEach((e) => {
            if (e.type === from) {
                e.type = to;
            }
        });
    } else if (RefValueType.SkillCategory === type) {
        config.skill.forEach((e) => {
            if (e.category === from) {
                e.category = to;
            }
        });
    } else if (RefValueType.Skill === type) {
        config.monster.forEach((e) => {
            if (e.skills.includes(from)) {
                e.skills = e.skills.map((e) => (e === from ? to : e));
            }
        });
    } else if (RefValueType.Monster === type) {
        config.monster.forEach((e) => {
            if (e.from === from) {
                e.from = to;
            }
        });
    }
    return true;
};

export const refCounter = (config: MainConfig, type: RefValueType, from: number) => {
    const collect: { name: string }[] = [];

    function checkRefValueId(e: { id: number; args: Value[] }, t: RefValueType) {
        if (t === type) {
            if (e.id === from) {
                return true;
            }
        }
        return !!e.args?.find(checkValue);
    }

    function checkValue(e: Value) {
        for (const { type: t, key } of ValueEnumType) {
            if (t === type) {
                if (field(e, key) === from) {
                    return true;
                }
            }
        }
        const ref = e.ref;
        if (ref) {
            return checkRefValueId(ref, RefValueType.Value);
        }
        const expr = e.expr;
        if (expr) {
            return !!expr.args.find(checkValue);
        }
        return false;
    }

    [config.skill, config.feature, config.emblem, config.weather, config.buff, config.item]
        .flatMap((e) => e)
        .forEach(({ name, effects }) => {
            if (
                effects.find(
                    ({ template, conditions }) =>
                        checkRefValueId(template, RefValueType.Template) ||
                        conditions.find((condition) => checkRefValueId(condition, RefValueType.Condition)),
                )
            ) {
                collect.push({ name });
            }
        });
    config.hook.forEach(({ name, hook, order }) => {
        if (checkRefValueId(hook, RefValueType.RawHook) || checkRefValueId(order, RefValueType.RawOrder)) {
            collect.push({ name });
        }
    });
    config.array.forEach(({ name, data }) => {
        if (data.find(checkValue)) {
            collect.push({ name: name });
        }
    });
    config.template.forEach(({ name, data }) => {
        if (
            data.find(
                ({ hook, action }) =>
                    checkRefValueId(hook, RefValueType.Hook) || checkRefValueId(action, RefValueType.Action),
            )
        ) {
            collect.push({ name });
        }
    });
    if (RefValueType.MonsterType === type) {
        config.monster.forEach(({ name, type }) => {
            if (type === from) {
                collect.push({ name });
            }
        });
        config.skill.forEach(({ name, type }) => {
            if (type === from) {
                collect.push({ name });
            }
        });
    } else if (RefValueType.SkillCategory === type) {
        config.skill.forEach(({ name, category }) => {
            if (category === from) {
                collect.push({ name });
            }
        });
    } else if (RefValueType.Skill === type) {
        config.monster.forEach(({ name, skills }) => {
            if (skills.includes(from)) {
                collect.push({ name });
            }
        });
    } else if (RefValueType.Monster === type) {
        config.monster.forEach(({ name, from: evolveFrom }) => {
            if (evolveFrom === from) {
                collect.push({ name });
            }
        });
    }

    return collect;
};
