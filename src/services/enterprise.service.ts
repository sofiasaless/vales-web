import { api } from "@/config/axios";
import { RestauranteResponseBody } from "@/types/empresa.type";

export const EnterpriseService = {
  async find() {
    return (await api.get<RestauranteResponseBody>(`/empresa/encontrar`)).data
  },

}