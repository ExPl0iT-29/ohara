import { useQuery } from "@tanstack/react-query";

import { listContent, type ContentItem, type ListContentParams } from "../api/content";

const hasInFlightItem = (items?: ContentItem[]) =>
  items?.some((item) => item.status === "pending" || item.status === "processing") ?? false;

export function useContentList(params: ListContentParams = {}) {
  return useQuery({
    queryKey: ["content", "list", params],
    queryFn: () => listContent(params),
    staleTime: 30_000,
    refetchInterval: (query) => (hasInFlightItem(query.state.data) ? 1000 : false),
  });
}
