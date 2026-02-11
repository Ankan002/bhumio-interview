import { DashboardProvider } from "@/components/providers";

const AssignmentFourScreen = () => {
    return (
        <DashboardProvider heading="Validation That Lies">
            <p className="text-sm text-muted-foreground">
                A validation that lies on the client side but not on the server
                side. [Assignment 4 for Bhumio]
            </p>
        </DashboardProvider>
    );
};

export default AssignmentFourScreen;
