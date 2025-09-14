import * as React from "react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { RefValueType } from "@/config/base";
import { useCacheStore } from "@/store/cacheStore";
import { ChevronDown, Star } from "lucide-react";

const groups = [
    {
        name: "Basic",
        items: [
            {
                name: "Monster",
                type: RefValueType.Monster,
            },
            {
                name: "Skill",
                type: RefValueType.Skill,
            },
            {
                name: "Feature",
                type: RefValueType.Feature,
            },
            {
                name: "Emblem",
                type: RefValueType.Emblem,
            },
            {
                name: "Weather",
                type: RefValueType.Weather,
            },
            {
                name: "Buff",
                type: RefValueType.Buff,
            },
            {
                name: "Item",
                type: RefValueType.Item,
            },
        ],
    },
    {
        name: "Effects",
        items: [
            {
                name: "Template",
                type: RefValueType.Template,
            },
            {
                name: "Value",
                type: RefValueType.Value,
            },
            {
                name: "Condition",
                type: RefValueType.Condition,
            },
        ],
    },
    {
        name: "Hook",
        items: [
            {
                name: "Hook",
                type: RefValueType.Hook,
            },
        ],
    },
    {
        name: "Raw",
        items: [
            {
                name: "RawHook",
                type: RefValueType.RawHook,
            },
            {
                name: "RawOrder",
                type: RefValueType.RawOrder,
            },
            {
                name: "RawExpr",
                type: RefValueType.RawExpr,
            },
        ],
    },
    {
        name: "Enums",
        items: [
            {
                name: "Character",
                type: RefValueType.Character,
            },
            {
                name: "MonsterType",
                type: RefValueType.MonsterType,
            },
            {
                name: "SkillCategory",
                type: RefValueType.SkillCategory,
            },
        ],
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const refTab = useCacheStore((state) => state.refValueTab);
    const updateRefValueTab = useCacheStore((state) => state.updateRefValueTab);
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className="flex align-center items-center gap-2">
                    <img src="/favicon.ico" alt="avatar" className="size-10" />
                    <div>Arcadia Star Project</div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {groups.map((item) => (
                    <Collapsible key={item.name} defaultOpen className="group/collapsible">
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger>
                                    {item.name}
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {item.items.map((item) => (
                                            <SidebarMenuItem key={item.name}>
                                                <SidebarMenuButton asChild isActive={refTab === item.type}>
                                                    <a
                                                        href="#"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            updateRefValueTab(item.type);
                                                        }}
                                                    >
                                                        <Star color={refTab === item.type ? "black" : ""} />
                                                        {item.name}
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
