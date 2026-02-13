import { EnterpriseService } from "@/services/enterprise.service"
import { useQuery } from "@tanstack/react-query"

export function useCurrentEnterprise() {
  return useQuery({
    queryKey: ["current_entreprise"],
    queryFn: async () => {
      const resultado = await EnterpriseService.find()
      return resultado;
    }
  })
}