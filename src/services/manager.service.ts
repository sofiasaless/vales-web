import { api } from "@/config/axios";
import { GerenteAutenticatedResponseBody, GerenteAutenticateRequestBody, GerenteResponseBody } from "@/types/gerente.type";

export const ManagerService = {
  async list() {
    return await api.get<GerenteResponseBody[]>(`/gerente/encontrar`)
  },

  async autenticate(body: GerenteAutenticateRequestBody) {
    return (await api.post<GerenteAutenticatedResponseBody>(`/gerente/autenticar`, body)).data;
  }

}