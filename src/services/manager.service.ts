import { api } from "@/config/axios";
import { GerenteAutenticatedResponseBody, GerenteAutenticateRequestBody, GerenteResponseBody } from "@/types/gerente.type";

export const ManagerService = {
  async list() {
    return await api.get<GerenteResponseBody[]>(`/gerente/listar`)
  },

  async autenticate(body: GerenteAutenticateRequestBody) {
    return (await api.post<GerenteAutenticatedResponseBody>(`/gerente/autenticar`, body)).data;
  },

  async logout() {
    localStorage.removeItem("usuario");
  },

  async isManagerAuthenticated() {
    const saved = localStorage.getItem("usuario")
    return (saved != null)
  }

}