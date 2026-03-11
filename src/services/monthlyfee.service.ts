import { api } from "@/config/axios";
import { MensalidadeResponseBody } from "@/types/mensalidade";

export const MonthlyFeeService = {
  async list() {
    return await api.get<MensalidadeResponseBody[]>(`/mensalidade/listar`)
  },

}