export const ArgVars = ["X", "Y", "Z", "A", "B", "C", "D", "E", "F"];

export const ArgNameIds = [
    ...ArgVars.map((e, idx) => ({ id: idx + 1, name: e, tips: "" })),
    { id: 11, name: "slot1", tips: "" },
    { id: 12, name: "slot2", tips: "" },
    { id: 13, name: "slot3", tips: "" },
];

export const queryArgNameById = (id: number) => {
    return ArgNameIds.find((e) => e.id == id)?.name;
};
