import { SidebarData } from "@/types/common/nav";
import { Form } from "lucide-react";

export const SIDEBAR_DATA: SidebarData = {
    navGroups: [
        {
            title: "Assignments",
            items: [
                {
                    title: "Eventual Consistency Form",
                    url: "/",
                    icon: Form,
                },
            ],
        },
    ],
};
