import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";

// Surface backend errors via a single toast handler. 401 is excluded because
// api.ts already redirects to /sign-in after a failed refresh, and 400/422
// is excluded so form validation can render inline messages without a
// duplicate toast. Individual mutations can opt out by setting
// `meta: { silent: true }`.
function reportError(error: unknown, meta?: Record<string, unknown>) {
  if (meta?.silent) return;
  if (!(error instanceof ApiError)) return;
  if (error.status === 401 || error.status === 400 || error.status === 422) return;
  toast.error(error.message);
}

export function getContext() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => reportError(error, query.meta),
    }),
    mutationCache: new MutationCache({
      onError: (error, _vars, _ctx, mutation) => reportError(error, mutation.meta),
    }),
  });

  return {
    queryClient,
  };
}
export default function TanstackQueryProvider() {}
