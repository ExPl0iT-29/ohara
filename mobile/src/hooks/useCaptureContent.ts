import { useMutation, useQueryClient } from "@tanstack/react-query";

import { captureContent, type ContentType } from "../api/content";

export function useCaptureContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ url, contentType }: { url: string; contentType?: ContentType }) =>
      captureContent(url, contentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "list"] });
    },
  });
}
