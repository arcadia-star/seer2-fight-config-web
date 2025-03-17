import { ArrayForm } from "@/components/form/array-form";
import { RefValueForm } from "@/components/form/value-form";
import { RefValue, RefValueType } from "@/config/base";
import { DataConfig } from "@/config/config";

interface TemplateFormProps {
    value: {
        hook: RefValue;
        action: RefValue;
    }[];
    onValueChange: (value: { hook: RefValue; action: RefValue }[]) => void;
    config: DataConfig;
}

export function TemplateForm({ value, onValueChange, config }: TemplateFormProps) {
    return (
        <ArrayForm
            value={value}
            onValueChange={onValueChange}
            defaultElement={() => ({
                hook: {
                    id: 0,
                    args: [],
                },
                action: {
                    id: 0,
                    args: [],
                },
            })}
        >
            {({ value, onValueChange }) => (
                <div>
                    <RefValueForm
                        value={value.hook}
                        onValueChange={(hook) => onValueChange({ ...value, hook })}
                        config={config}
                        type={RefValueType.Hook}
                    />
                    <RefValueForm
                        value={value.action}
                        onValueChange={(action) => onValueChange({ ...value, action })}
                        config={config}
                        type={RefValueType.Action}
                    />
                </div>
            )}
        </ArrayForm>
    );
}
