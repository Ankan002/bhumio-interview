import { SidebarData } from "@/types/common/nav";
import { Form, ListOrdered, Clipboard, ListCheck } from "lucide-react";

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
                {
                    title: "Out of Order Events",
                    url: "/out-of-order-events",
                    icon: ListOrdered,
                },
                {
                    title: "Broken Pagination",
                    url: "/broken-pagination",
                    icon: Clipboard,
                },
                {
                    title: "Validation List Lies",
                    url: "/validation-list-lies",
                    icon: ListCheck,
                },
            ],
        },
    ],
};
