import { api } from "@/config/axios";
import { GerenteAutenticatedResponseBody, GerenteAutenticateRequestBody, GerentePostRequestBody, GerenteResponseBody, GerenteUpdateRequestBody } from "@/types/gerente.type";

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
  },

  async create(body: GerentePostRequestBody) {
    return await api.post(`/gerente/criar`, body);
  },

  async delete(managerId: string) {
    return await api.delete(`/gerente/excluir/${managerId}`)
  },

  async update(managerId: string, payload: GerenteUpdateRequestBody) {
    return await api.put(`/gerente/atualizar/${managerId}`, payload)
  }

}