export const iconConfig: {
    emblem2Monster: Record<number, number>;
    feature2Name: Record<number, string>;
} = {
    emblem2Monster: {},
    feature2Name: {},
};

fetch("config/icon-config.json")
    .then((e) => e.json())
    .then((e) => {
        iconConfig.emblem2Monster = e?.emblem2Monster || {};
        iconConfig.feature2Name = e?.feature2Name || {};
    });
