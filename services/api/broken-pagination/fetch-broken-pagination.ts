import { type PaginatedDataItem } from "@/types/models";
import { JsonApiResponse } from "@/types/api";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

interface BrokenPaginationData {
    items: PaginatedDataItem[];
}

const fetchBrokenPagination = async ({
    queryKey,
}: QueryFunctionContext): Promise<BrokenPaginationData> => {
    const [_, page] = queryKey;
    const searchParams = new URLSearchParams({ page: String(page) });
    const response = await fetch(
        `/api/broken-pagination?${searchParams.toString()}`,
    );

    const data =
        (await response.json()) as JsonApiResponse<BrokenPaginationData>;

    if (!data.success) {
        throw new Error(data.error);
    }

    if (!data.data) {
        return {
            items: [],
        };
    }

    return data.data;
};

interface FetchBrokenPaginationArgs {
    page: number;
}

export const useBrokenPagination = ({ page }: FetchBrokenPaginationArgs) => {
    return useQuery({
        queryKey: ["broken-pagination", page],
        queryFn: fetchBrokenPagination,
    });
};
