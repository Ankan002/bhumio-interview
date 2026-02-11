"use client";

import { SIDEBAR_DATA } from "@/constants/sidebar-data";
import { Sidebar, SidebarContent, SidebarHeader } from "../../ui/sidebar";
import { NavGroup } from "@/components/elements";
import { Command } from "lucide-react";

const AppSidebar = () => {
    return (
        <Sidebar className="font-tertiary">
            <SidebarHeader className="pl-3 pt-3">
                <Command />
            </SidebarHeader>
            <SidebarContent>
                {SIDEBAR_DATA.navGroups.map(props => (
                    <NavGroup key={props.title} {...props} />
                ))}
            </SidebarContent>
        </Sidebar>
    );
};

export default AppSidebar;
