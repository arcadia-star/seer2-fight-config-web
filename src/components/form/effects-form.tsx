import { ArrayForm } from "@/components/form/array-form";
import { RefValueForm } from "@/components/form/value-form";
import { Effect, Effects, RefValueType } from "@/config/base";
import { DataConfig } from "@/config/config";

interface EffectFormProps {
    value: Effect;
    onValueChange: (value: Effect) => void;
    config: DataConfig;
}

function EffectForm({ value, onValueChange, config }: EffectFormProps) {
    const template = value.template;
    const conditions = value.conditions;
    return (
        <div>
            <RefValueForm
                value={template}
                onValueChange={(template) => onValueChange({ ...value, template })}
                type={RefValueType.Template}
                config={config}
            />
            <ArrayForm
                value={conditions}
                onValueChange={(conditions) => onValueChange({ ...value, conditions })}
                defaultElement={() => ({ id: 0, args: [] })}
            >
                {({ value, onValueChange }) => (
                    <RefValueForm
                        value={value}
                        onValueChange={onValueChange}
                        type={RefValueType.Condition}
                        config={config}
                    />
                )}
            </ArrayForm>
        </div>
    );
}

interface EffectsFormProps {
    value: Effects;
    onValueChange: (value: Effects) => void;
    config: DataConfig;
}

export function EffectsForm({ value, onValueChange, config }: EffectsFormProps) {
    return (
        <ArrayForm
            value={value}
            onValueChange={onValueChange}
            defaultElement={() => ({
                template: { id: 0, args: [] },
                conditions: [],
            })}
        >
            {({ value, onValueChange }) => <EffectForm value={value} onValueChange={onValueChange} config={config} />}
        </ArrayForm>
    );
}
