import { api } from "@/config/axios";
import { ItemMenuResponseBody } from "@/types/menu.type";

export const MenuService = {
  async list() {
    return (await api.get<ItemMenuResponseBody[]>(`/menu/listar`)).data
  },

}