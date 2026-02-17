import { MenuService } from "@/services/menu.service";
import { ItemMenuPostRequestBody } from "@/types/menu.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useListMenu() {
  return useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const result = await MenuService.list()
      return result
    },
    refetchOnWindowFocus: false
  })
}

export function useMenu() {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: ({body}: {body: ItemMenuPostRequestBody}) => MenuService.add(body),

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["menu"]})
    }
  })

  const remove = useMutation({
    mutationFn: ({itemId}: {itemId: string}) => MenuService.delete(itemId),

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["menu"]})
    }
  })

  const update = useMutation({
    mutationFn: ({itemId, payload}: {itemId: string, payload: ItemMenuPostRequestBody}) => MenuService.update(itemId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["menu"]})
    }
  })

  return {
    add,
    remove,
    update
  }

}