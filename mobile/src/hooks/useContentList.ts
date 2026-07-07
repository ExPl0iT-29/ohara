import { useQuery } from "@tanstack/react-query";

import { listContent, type ListContentParams } from "../api/content";

export function useContentList(params: ListContentParams = {}) {
  return useQuery({
    queryKey: ["content", "list", params],
    queryFn: () => listContent(params),
    staleTime: 30_000,
  });
}
