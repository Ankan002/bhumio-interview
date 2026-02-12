import { useAPIErrorHandler } from "@/hooks/use-error-handler";
import { useValidationThatLies } from "@/services/api/false-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ValidationLiesSchema = z.object({
    email: z.email({
        error: "Please enter a valid email address",
    }),
    amount: z
        .string({
            error: "Please enter a valid amount",
        })
        .refine(value => Number(value) > 10, {
            error: "Amount must be greater than 10",
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

    const { APIErrorHandler } = useAPIErrorHandler();
    const { mutateAsync: validationThatLies, isPending: isValidatingThatLies } =
        useValidationThatLies();

    const validationThatLiesErrorHandler = APIErrorHandler(error => {
        toast.error("Server Error", {
            description: error.message,
        });
    });

    const handleValidateThatLies = form.handleSubmit(async values => {
        if (isValidatingThatLies) {
            toast.error("Please wait for the validation to complete");
            return;
        }

        const { email, amount } = form.getValues();

        try {
            const response = await validationThatLies({
                email,
                amount: Number(amount),
            });

            if (!response) {
                toast.error("Failed to validate that lies");
                return;
            }

            toast.success("Validation that lies completed successfully");
            form.reset();
        } catch (error) {
            validationThatLiesErrorHandler(error);
        }
    });

    return {
        form,
        isValidatingThatLies,
        handleValidateThatLies,
    };
};
