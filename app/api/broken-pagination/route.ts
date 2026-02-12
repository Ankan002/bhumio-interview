import { NextRequest, NextResponse } from "next/server";
import { SERVER_DATA } from "@/constants/server-data";

const PAGE_SIZE = 10;

function randomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const page = Number(searchParams.get("page") || "1");

        if (!page || page < 1) {
            return NextResponse.json(
                {
                    success: false,
                    code: 400,
                    error: "Invalid page number",
                },
                { status: 400 },
            );
        }

        let start = (page - 1) * PAGE_SIZE;

        // Overlap behavior
        if (Math.random() < 0.5 && page > 1) {
            start -= randomInt(5);
        }

        start = Math.max(0, start);

        let items = SERVER_DATA.slice(start, start + PAGE_SIZE);

        // Sometimes fewer items
        if (Math.random() < 0.4) {
            const reduceBy = randomInt(5);
            items = items.slice(0, PAGE_SIZE - reduceBy);
        }

        // Sometimes shuffle order
        if (Math.random() < 0.3) {
            items = shuffle(items);
        }

        return NextResponse.json({
            success: true,
            code: 200,
            data: {
                items,
            },
        });
    } catch (error) {
        console.error("Pagination API error:", error);

        return NextResponse.json(
            {
                success: false,
                code: 500,
                error: "Internal server error",
            },
            { status: 500 },
        );
    }
}

export const revalidate = 0;
