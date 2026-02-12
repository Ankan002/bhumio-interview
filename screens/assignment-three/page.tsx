"use client";

import { DashboardProvider } from "@/components/providers/dashboard-provider";

const AssignmentThreeScreen = () => {
    return (
        <DashboardProvider heading="Broken Pagination">
            <p className="text-sm text-muted-foreground">
                This is a broken pagination that will return a different number
                of items on each page. [This is the third assignment for Bhumio]
            </p>
        </DashboardProvider>
    );
};

export default AssignmentThreeScreen;
