import { connectToDB } from "@/db/connect";
import { EmailFormModel } from "@/db/models";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { sleep } from "@/utils/server-utils";

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

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();

        const { email, amount } = CreateEmailFormSchema.parse(body);

        await connectToDB();

        const existingRecord = await EmailFormModel.findOne({
            email,
        });

        if (existingRecord) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Email already exists",
                    code: 400,
                },
                {
                    status: 400,
                },
            );
        }

        const errorPossiblity = Math.random();

        if (errorPossiblity < 0.3) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Temporary failure",
                    code: 503,
                },
                {
                    status: 503,
                },
            );
        }

        if (errorPossiblity < 0.6) {
            const delay = 1000 + Math.random() * 3000;
            await sleep(delay);
        }

        await EmailFormModel.create({
            email,
            amount,
        });

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
