import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveCadastral } from "@/shared/api/culturalHeritageApi";

/** POST /api/cultural-heritage — muvaffaqiyatli bo'lsa ro'yxatni (GET) qayta so'raydi. */
export function useSaveCadastralMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveCadastral,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cultural-heritage"] });
    },
  });
}
