import { JsonApiResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

interface ValidationThatLiesArgs {
    email: string;
    amount: number;
}

const validationThatLies = async (args: ValidationThatLiesArgs) => {
    const response = await fetch("/api/validation-lie", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
    });

    const data = (await response.json()) as JsonApiResponse;

    if (!data.success) {
        throw new Error(data.error);
    }

    return true;
};

export const useValidationThatLies = () => {
    return useMutation({
        mutationFn: validationThatLies,
        mutationKey: ["validation-that-lies"],
    });
};
