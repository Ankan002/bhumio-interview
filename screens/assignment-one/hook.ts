import { useAPIErrorHandler } from "@/hooks/use-error-handler";
import { useCreateEmailForm } from "@/services/api/email-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreateEmailFormSchema = z.object({
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

export const useAssignmentOne = () => {
    const form = useForm<z.infer<typeof CreateEmailFormSchema>>({
        resolver: zodResolver(CreateEmailFormSchema),
        defaultValues: {
            email: "",
            amount: "",
        },
        mode: "onChange",
    });

    const { APIErrorHandler } = useAPIErrorHandler();
    const { mutateAsync: createEmailForm, isPending: isCreatingEmailForm } =
        useCreateEmailForm();

    const createEmailFormErrorHandler = APIErrorHandler();

    const handleCreateEmail = form.handleSubmit(async values => {
        const { email, amount } = form.getValues();

        try {
            const creationResponse = await createEmailForm({
                email,
                amount: Number(amount),
            });

            if (!creationResponse) {
                toast.error("Failed to create email form");
                return;
            }

            toast.success("Email form created successfully");
            form.reset();
        } catch (error) {
            createEmailFormErrorHandler(error);
        }
    });

    return {
        form,
        handleCreateEmail,
        isCreatingEmailForm,
    };
};
