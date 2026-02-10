import { ReactQueryClient } from "./react-query-client";

export const clientUtils = {
    queryClient: new ReactQueryClient(),
};

Object.freeze(clientUtils);
