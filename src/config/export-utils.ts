import { MainConfig, RefValueSchema, RefValueType } from "@/config/base";
import { configByType } from "@/config/config";
import { compress, field } from "@/lib/utils";

export const export4Human = (config: MainConfig) => {
    const commonKeys = ["id", "name"];

    function build0(type: RefValueType) {
        const keys = field(RefValueSchema[type], "out").keyof().options as string[];
        const sortedKeys = [...commonKeys].concat(keys.filter((e) => !commonKeys.includes(e)));
        const conf = configByType(config, type);
        const res = [...conf.get()]
            .sort((a, b) => a.id - b.id)
            .map((e) => {
                const obj: Record<string, unknown> = {};
                sortedKeys.forEach((field) => {
                    obj[field] = e[field as never];
                });
                return obj;
            })
            .map((e) => JSON.stringify(compress(e)))
            .join(",\n");
        return `"${conf.key}":[\n${res}\n],`;
    }

    function build1() {
        const types = Object.values(RefValueType).filter((k) => typeof k === "number");
        return types.map((key) => build0(key)).join("\n");
    }

    return `{".idea":"@formatter:off",
${build1()}
".ignore":""
}`;
};
