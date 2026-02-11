import { JsonApiResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

interface CreateEmailFormArgs {
    email: string;
    amount: number;
}

const createEmailForm = async (args: CreateEmailFormArgs) => {
    const response = await fetch("/api/email-form", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(args),
    });

    const data = (await response.json()) as JsonApiResponse;

    if (!data.success) {
        throw new Error(data.error);
    }

    return true;
};

export const useCreateEmailForm = () => {
    return useMutation({
        mutationFn: createEmailForm,
        mutationKey: ["create-email-form"],
        retry: 3,
    });
};
