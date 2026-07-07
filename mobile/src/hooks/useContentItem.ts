import { useQuery } from "@tanstack/react-query";

import { getContent } from "../api/content";

export function useContentItem(id: string) {
  return useQuery({
    queryKey: ["content", "item", id],
    queryFn: () => getContent(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
