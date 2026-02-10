import { QueryClient } from "@tanstack/react-query";

export class ReactQueryClient {
    client: QueryClient;

    constructor() {
        this.client = new QueryClient();
    }
}
