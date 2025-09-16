import type { ReactNode } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryClientProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

function QueryClient_Provider({ children }: QueryClientProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children} <ReactQueryDevtools initialIsOpen={false} />{" "}
    </QueryClientProvider>
  );
}

export default QueryClient_Provider;
