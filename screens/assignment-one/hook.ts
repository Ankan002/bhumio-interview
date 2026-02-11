import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const CreateEmailFormSchema = z.object({
    email: z.email({
        error: "Please enter a valid email address",
    }),
    amount: z
        .number({
            error: "Please enter a valid amount",
        })
        .min(1, {
            error: "Amount must be at least 1",
        }),
});

const useAssignmentOne = () => {
    const form = useForm<z.infer<typeof CreateEmailFormSchema>>({
        resolver: zodResolver(CreateEmailFormSchema),
        defaultValues: {
            email: "",
            amount: 0,
        },
    });
};
