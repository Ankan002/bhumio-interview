import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";

const ValidationLieSchema = z.object({
    email: z.email({
        error: "Please enter a valid email address",
    }),
    amount: z
        .number({
            error: "Please enter a valid amount",
        })
        .min(20, {
            error: "Amount must be at least 20",
        })
        .max(100, {
            error: "Amount must be at most 100",
        }),
});

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();

        ValidationLieSchema.parse(body);

        return NextResponse.json(
            {
                success: true,
                code: 200,
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.issues[0]?.message,
                    code: 400,
                },
                {
                    status: 400,
                },
            );
        }

        if (error instanceof Error) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                    code: 400,
                },
                {
                    status: 400,
                },
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
                code: 500,
            },
            {
                status: 500,
            },
        );
    }
};
