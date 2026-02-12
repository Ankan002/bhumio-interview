import { useAPIErrorHandler } from "@/hooks/use-error-handler";
import { useBrokenPagination } from "@/services/api/broken-pagination";
import { type PaginatedDataItem } from "@/types/models";
import { useCallback, useEffect, useState } from "react";

export const useAssignmentThree = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<PaginatedDataItem[]>([]);
    const [dataIdSet, setDataIdSet] = useState<Set<string>>(new Set());
    const [isMoreData, setIsMoreData] = useState(true);

    const { APIErrorHandler } = useAPIErrorHandler();
    const brokenPaginationErrorHandler = APIErrorHandler();

    const {
        data: brokenPaginationData,
        isLoading: isLoadingBrokenPagination,
        error: brokenPaginationError,
    } = useBrokenPagination({
        page,
    });

    useEffect(() => {
        if (brokenPaginationError) {
            brokenPaginationErrorHandler(brokenPaginationError);
        }
    }, [brokenPaginationError, brokenPaginationErrorHandler]);

    useEffect(() => {
        if (!brokenPaginationData?.items) return;

        const items = brokenPaginationData.items;

        setDataIdSet(prevIds => {
            const next = new Set(prevIds);
            items.forEach(item => next.add(item.id));
            return next;
        });

        setData(current => {
            const existingIds = new Set(current.map(i => i.id));
            const newItems = items.filter(item => !existingIds.has(item.id));
            return newItems.length ? [...current, ...newItems] : current;
        });
        if (items.length === 0) {
            setIsMoreData(false);
        }
    }, [brokenPaginationData]);

    const loadNextPage = useCallback(() => {
        if (isMoreData) setPage(p => p + 1);
    }, [isMoreData]);

    const resetPagination = useCallback(() => {
        setPage(1);
        setData([]);
        setDataIdSet(new Set());
        setIsMoreData(true);
    }, []);

    return {
        data,
        page,
        setPage,
        isMoreData,
        isLoading: isLoadingBrokenPagination,
        error: brokenPaginationError,
        loadNextPage,
        resetPagination,
    };
};
