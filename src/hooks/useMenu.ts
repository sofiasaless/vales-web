import { MenuService } from "@/services/menu.service";
import { useQuery } from "@tanstack/react-query";

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