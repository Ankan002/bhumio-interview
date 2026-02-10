"use client";

import { AppSidebar } from "@/components/common";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    children: React.ReactNode;
    heading: string;
    isHeadingLoading?: boolean;
    ActionButton?: React.ReactNode;
};

export const DashboardProvider = (props: Props) => {
    const { children, isHeadingLoading, heading, ActionButton } = props;

    return (
        <>
            <AppSidebar />
            <SidebarInset>
                <div className="w-full min-h-screen flex flex-col font-primary">
                    <div className="w-full flex justify-between items-center 2xl:py-3 py-2 2xl:px-3 px-2">
                        <div className="flex items-center">
                            <SidebarTrigger className="text-primary" />
                            {isHeadingLoading ? (
                                <Skeleton className="h-5 w-24 bg-primary" />
                            ) : (
                                <p className="text-primary text-lg ml-1">
                                    {heading}
                                </p>
                            )}
                        </div>

                        {ActionButton && ActionButton}
                    </div>
                    <div className="w-full flex flex-col gap-2 px-4 flex-1">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </>
    );
};

export default DashboardProvider;
