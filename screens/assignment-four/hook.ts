import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ValidationLiesSchema = z.object({
    email: z.email({
        error: "Please enter a valid email address",
    }),
    amount: z
        .string({
            error: "Please enter a valid amount",
        })
        .refine(value => Number(value) > 0, {
            error: "Amount must be greater than 0",
        }),
});

export const useAssignmentFour = () => {
    const form = useForm<z.infer<typeof ValidationLiesSchema>>({
        resolver: zodResolver(ValidationLiesSchema),
        defaultValues: {
            email: "",
            amount: "",
        },
        mode: "onChange",
    });

    return {
        form,
    };
};
