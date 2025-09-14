import { ArrayForm } from "@/components/form/array-form";
import { SelectForm } from "@/components/form/select-form.tsx";
import { ExprForm } from "@/components/form/value-form";
import { RefValueType, TemplateData } from "@/config/base";
import { DataConfig, queryNamedIdList } from "@/config/config";

interface TemplateFormProps {
    value: TemplateData[];
    onValueChange: (value: TemplateData[]) => void;
    config: DataConfig;
}

export function TemplateForm({ value, onValueChange, config }: TemplateFormProps) {
    return (
        <ArrayForm
            value={value}
            onValueChange={onValueChange}
            defaultElement={() => ({
                hook: 0,
                action: {},
            })}
        >
            {({ value, onValueChange }) => (
                <div>
                    <SelectForm
                        options={queryNamedIdList(config, RefValueType.Hook)}
                        value={value.hook}
                        onValueChange={(hook) => onValueChange({ ...value, hook })}
                    />
                    <ExprForm
                        value={value.action}
                        onValueChange={(action) => onValueChange({ ...value, action })}
                        config={config}
                    />
                </div>
            )}
        </ArrayForm>
    );
}
