import { api } from "@/config/axios";
import { ItemMenuPostRequestBody, ItemMenuResponseBody } from "@/types/menu.type";

export const MenuService = {
  async list() {
    return (await api.get<ItemMenuResponseBody[]>(`/menu/listar`)).data
  },

  async add(body: ItemMenuPostRequestBody) {
    return await api.post(`/menu/adicionar`, body);
  },

  async update(itemId: string, body: ItemMenuPostRequestBody) {
    return await api.put(`/menu/atualizar/${itemId}`, body)
  },

  async delete(itemId: string) {
    return await api.delete(`/menu/remover/${itemId}`)
  }

}