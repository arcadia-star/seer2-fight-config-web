import { Effects, Expr, MainConfig, Monster, NamedId, RefValue, RefValueType, Value } from "@/config/base";
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

export const queryNameById = (config: DataConfig, type: RefValueType, id: number) => {
    return queryNamedId(config, type, id)?.name ?? `<??-${id}>`;
};
export const queryNamedId = (config: DataConfig, type: RefValueType, id: number) => {
    return queryNamedIdList(config, type).find((e) => e.id === id);
};
export const queryNamedIdList = (config: DataConfig, type: RefValueType): NamedId[] => {
    return configByType(config.main, type).get();
};
export const queryMonsterChains = (config: DataConfig, monsterId: number): Monster[] => {
    const monsterChains = [];
    let now = queryNamedId(config, RefValueType.Monster, monsterId) as Monster;
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
    const namedIds = configByType(config, type).get();

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

    handleRelation(config, type, from, ({ name }, updateId) => {
        console.debug("update:" + name);
        updateId(to);
    });

    return true;
};

export const refCounter = (config: MainConfig, type: RefValueType, id: number) => {
    const collect: { name: string }[] = [];
    handleRelation(config, type, id, ({ name }) => {
        collect.push({ name });
    });
    return collect;
};

const handleRelation = (
    config: MainConfig,
    type: RefValueType,
    id: number,
    callback: (namedId: NamedId, updateId: (id: number) => void) => void,
) => {
    function handleEffects(namedId: NamedId, effects: Effects) {
        effects.forEach((e) => {
            handleRefValue(namedId, e.template, RefValueType.Template);
            e.conditions.forEach((e) => handleRefValue(namedId, e, RefValueType.Condition));
        });
    }

    function handleExpr(namedId: NamedId, expr: Expr) {
        for (const { type: thisType, key } of ValueEnumType) {
            if (thisType === type) {
                if (field(expr, key) === id) {
                    callback(namedId, (id) => fieldSet(expr, key, id));
                }
            }
        }
        const ref = expr.ref;
        if (ref) {
            if (RefValueType.RawExpr === type) {
                if (ref.id === id) {
                    callback(namedId, (id) => (ref.id = id));
                }
            }
            ref.args?.forEach((e) => handleExpr(namedId, e));
        }
        const expr1 = expr.expr;
        if (expr1) {
            expr1.args.forEach((e) => handleExpr(namedId, e));
        }
    }

    function handleValue(namedId: NamedId, value: Value) {
        for (const { type: thisType, key } of ValueEnumType) {
            if (thisType === type) {
                if (field(value, key) === id) {
                    callback(namedId, (id) => fieldSet(value, key, id));
                }
            }
        }
        const ref = value.ref;
        if (ref) {
            handleRefValue(namedId, ref, RefValueType.Value);
        }
        const expr = value.expr;
        if (expr) {
            expr.args.forEach((e) => handleValue(namedId, e));
        }
    }

    function handleRefValue(namedId: NamedId, refValue: RefValue, thisType: RefValueType) {
        if (thisType === type) {
            if (refValue.id === id) {
                callback(namedId, (id) => (refValue.id = id));
            }
        }
        refValue.args?.forEach((e) => handleValue(namedId, e));
    }

    config.monster.forEach((e) => {
        if (RefValueType.Feature === type) {
            if (e.feature === id) {
                callback(e, (id) => (e.feature = id));
            }
        } else if (RefValueType.MonsterType === type) {
            if (e.type === id) {
                callback(e, (id) => (e.type = id));
            }
        } else if (RefValueType.Monster === type) {
            if (e.from === id) {
                callback(e, (id) => (e.from = id));
            }
        } else if (RefValueType.Skill === type) {
            if (e.skills.includes(id)) {
                callback(e, (target) => (e.skills = e.skills.map((e) => (e === id ? target : e))));
            }
        }
    });
    config.skill.forEach((e) => {
        if (RefValueType.MonsterType === type) {
            if (e.type === id) {
                callback(e, (id) => (e.type = id));
            }
        } else if (RefValueType.SkillCategory === type) {
            if (e.category === id) {
                callback(e, (id) => (e.category = id));
            }
        }
        handleEffects(e, e.effects);
    });
    config.feature.forEach((e) => {
        handleEffects(e, e.effects);
    });
    config.emblem.forEach((e) => {
        handleEffects(e, e.effects);
    });
    config.weather.forEach((e) => {
        handleEffects(e, e.effects);
    });
    config.buff.forEach((e) => {
        handleEffects(e, e.effects);
    });
    config.item.forEach((e) => {
        handleEffects(e, e.effects);
    });
    config.raw_expr.forEach((e) => {
        handleExpr(e, e.value);
    });
    config.value.forEach((e) => {
        handleExpr(e, e.expr);
    });
    config.condition.forEach((e) => {
        handleExpr(e, e.expr);
    });
    config.action.forEach((e) => {
        handleExpr(e, e.expr);
    });
    config.hook.forEach((e) => {
        if (RefValueType.RawHook === type) {
            if (e.hook === id) {
                callback(e, (id) => (e.hook = id));
            }
        } else if (RefValueType.RawOrder === type) {
            if (e.order === id) {
                callback(e, (id) => (e.order = id));
            }
        }
        handleExpr(e, e.expr);
    });
    config.array.forEach((array) => {
        array.data.forEach((e) => handleExpr(array, e));
    });
    config.template.forEach((template) => {
        template.data.forEach((e) => {
            if (RefValueType.Hook === type) {
                if (e.hook === id) {
                    callback(template, (id) => (e.hook = id));
                }
            }
            handleExpr(template, e.action);
        });
    });
};
