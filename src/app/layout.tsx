import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useCacheStore } from "@/store/cacheStore";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const sidebarOpen = useCacheStore((state) => state.sidebarOpen);
    const updateSidebarOpen = useCacheStore((state) => state.updateSidebarOpen);
    return (
        <SidebarProvider open={sidebarOpen} onOpenChange={updateSidebarOpen}>
            <AppSidebar />
            <main className="w-full">{children}</main>
            <Toaster />
        </SidebarProvider>
    );
}
