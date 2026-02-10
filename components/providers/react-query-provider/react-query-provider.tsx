"use client";

import { clientUtils } from "@/utils/client-utils";
import { QueryClientProvider } from "@tanstack/react-query";

interface Props {
    children: React.ReactNode;
}

const ReactQueryProvider = (props: Props) => {
    const { children } = props;

    const client = clientUtils.queryClient.client;

    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
};

export default ReactQueryProvider;
