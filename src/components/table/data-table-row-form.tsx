import { ArrayForm } from "@/components/form/array-form";
import { EffectsForm } from "@/components/form/effects-form";
import { SelectForm } from "@/components/form/select-form";
import { TemplateForm } from "@/components/form/template-form";
import { ExprForm } from "@/components/form/value-form";
import {
    FightBuffIcon,
    FightWeatherIcon,
    PetAvatarIcon,
    PetEmblemIcon,
    PetFeatureIcon,
    PetTypeIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DataHeader, DataType, RefValueSchema, RefValueType } from "@/config/base";
import { queryNameById, queryNamedId, queryNamedIdList } from "@/config/config";
import { field } from "@/lib/utils";
import { useConfigStore } from "@/store/configStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z, ZodError } from "zod";

if (!field(ZodError.prototype, "errors")) {
    Object.defineProperty(ZodError.prototype, "errors", {
        get() {
            return this.issues;
        },
        enumerable: true,
        configurable: true,
    });
}

interface TableRowFormProps<TData> {
    type: RefValueType;
    headers: DataHeader[];
    update: boolean;
    data: TData;
    onSubmit: (update: boolean, data: TData) => void;
}

export function DataTableRowForm<TData>({ type, headers, update, data, onSubmit }: TableRowFormProps<TData>) {
    const config = useConfigStore((state) => state.config);
    let schema = RefValueSchema[type];
    if (!update) {
        schema = field(schema.def, "out").extend({
            id: z
                .number()
                .refine((id) => !queryNamedId(config, type, id), {
                    error: ({ input }) =>
                        "ID conflict. Choose a non-duplicate value. Current value:" +
                        queryNameById(config, type, input as number),
                })
                .refine((id) => id !== 0, "ID cannot be zero!"),
        });
    }
    const form = useForm<{ [x: string]: never }>({
        resolver: zodResolver(schema),
        defaultValues: data as { [x: string]: never },
    });

    function handleSubmit(values: { [x: string]: never }) {
        console.log(values);
        toast("Submit:" + JSON.stringify(values));
        onSubmit(update, values as TData);
    }

    function getValues<T>(key: string): T {
        return form.getValues(key as never) as T;
    }

    const fromHasError = !!Object.keys(form.formState.errors).length;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" autoComplete="off">
                {headers.map((e) => (
                    <FormField
                        key={e.key}
                        control={form.control}
                        name={e.key as never}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{e.name ?? e.key}</FormLabel>
                                <FormControl>
                                    <div className="pl-1">
                                        {(DataType.ID === e.type && (
                                            <Input
                                                placeholder={e.key}
                                                value={field.value}
                                                disabled={update}
                                                type="number"
                                                className="w-100"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        )) ||
                                            (DataType.Number === e.type && (
                                                <Input
                                                    placeholder={e.key}
                                                    value={field.value}
                                                    type="number"
                                                    className="w-100"
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            )) ||
                                            ((DataType.Name === e.type ||
                                                DataType.Tips === e.type ||
                                                DataType.String === e.type) && (
                                                <Input placeholder={e.key} {...field} className="w-100" />
                                            )) ||
                                            (DataType.PetType === e.type &&
                                                (e.displayOnly ? (
                                                    <PetTypeIcon id={getValues(e.accessorKey ?? e.key)} />
                                                ) : (
                                                    <SelectForm
                                                        options={queryNamedIdList(config, RefValueType.MonsterType)}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        icon={PetTypeIcon}
                                                    />
                                                ))) ||
                                            (DataType.PetAvatar === e.type &&
                                                (e.displayOnly ? (
                                                    <PetAvatarIcon id={getValues(e.accessorKey ?? e.key)} />
                                                ) : (
                                                    <SelectForm
                                                        options={queryNamedIdList(config, RefValueType.Monster)}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        icon={PetAvatarIcon}
                                                    />
                                                ))) ||
                                            (DataType.PetFeature === e.type &&
                                                (e.displayOnly ? (
                                                    <PetFeatureIcon id={getValues(e.accessorKey ?? e.key)} />
                                                ) : (
                                                    <SelectForm
                                                        options={queryNamedIdList(config, RefValueType.Feature)}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        icon={PetFeatureIcon}
                                                    />
                                                ))) ||
                                            (DataType.PetEmblem === e.type &&
                                                (e.displayOnly ? (
                                                    <PetEmblemIcon id={getValues(e.accessorKey ?? e.key)} />
                                                ) : (
                                                    <SelectForm
                                                        options={queryNamedIdList(config, RefValueType.Emblem)}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        icon={PetEmblemIcon}
                                                    />
                                                ))) ||
                                            (DataType.FightWeather === e.type &&
                                                (e.displayOnly ? (
                                                    <FightWeatherIcon id={getValues(e.accessorKey ?? e.key)} />
                                                ) : (
                                                    <SelectForm
                                                        options={queryNamedIdList(config, RefValueType.Weather)}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        icon={FightWeatherIcon}
                                                    />
                                                ))) ||
                                            (DataType.FightBuff === e.type &&
                                                (e.displayOnly ? (
                                                    <FightBuffIcon id={getValues(e.accessorKey ?? e.key)} />
                                                ) : (
                                                    <SelectForm
                                                        options={queryNamedIdList(config, RefValueType.Buff)}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        icon={FightBuffIcon}
                                                    />
                                                ))) ||
                                            (DataType.SkillCategory === e.type && (
                                                <SelectForm
                                                    options={queryNamedIdList(config, RefValueType.SkillCategory)}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                />
                                            )) ||
                                            (DataType.PetSkills === e.type && (
                                                <ArrayForm
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    defaultElement={() => 0}
                                                >
                                                    {({ value, onValueChange }) => (
                                                        <SelectForm
                                                            options={queryNamedIdList(config, RefValueType.Skill)}
                                                            value={value}
                                                            onValueChange={onValueChange}
                                                        />
                                                    )}
                                                </ArrayForm>
                                            )) ||
                                            (DataType.RefRawHook === e.type && (
                                                <SelectForm
                                                    options={queryNamedIdList(config, RefValueType.RawHook)}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                />
                                            )) ||
                                            (DataType.RefRawOrder === e.type && (
                                                <SelectForm
                                                    options={queryNamedIdList(config, RefValueType.RawOrder)}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                />
                                            )) ||
                                            (DataType.RefArray === e.type && (
                                                <ArrayForm
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    defaultElement={() => ({})}
                                                >
                                                    {({ value, onValueChange }) => (
                                                        <ExprForm
                                                            value={value}
                                                            onValueChange={onValueChange}
                                                            config={config}
                                                        />
                                                    )}
                                                </ArrayForm>
                                            )) ||
                                            (DataType.Template === e.type && (
                                                <TemplateForm
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    config={config}
                                                />
                                            )) ||
                                            (DataType.Effects === e.type && (
                                                <EffectsForm
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    config={config}
                                                />
                                            )) ||
                                            (DataType.RawExpr === e.type && (
                                                <ExprForm
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    config={config}
                                                />
                                            )) || <div></div>}
                                    </div>
                                </FormControl>
                                <FormDescription>{e.tips}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                {fromHasError && <p className="text-red-500">form is invalid</p>}
                <Button type="submit" disabled={fromHasError}>
                    Submit
                </Button>
            </form>
        </Form>
    );
}
