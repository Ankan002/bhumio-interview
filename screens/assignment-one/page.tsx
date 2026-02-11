"use client";

import { DashboardProvider } from "@/components/providers";

const AssignmentOneScreen = () => {
    return (
        <DashboardProvider heading="Eventual Consistency Form">
            <p className="text-sm text-muted-foreground">
                This is a form that allows you to submit your email and amount.
                [Eventual Consistency Form for Bhumio assignment]
            </p>
            <div className="w-full mt-4 flex flex-col items-center"></div>
        </DashboardProvider>
    );
};

export default AssignmentOneScreen;
