import { api } from "@/config/axios";
import { PagamentoPostRequestBody, PagamentoResponseBody } from "@/types/pagamento.type";

export interface FilterData {
  data_inicio: string,
  data_fim: string
}

export const PaymentService = {
  async pay(employeeId: string, body: PagamentoPostRequestBody) {
    return (await api.post(`/pagamento/pagar/${employeeId}`, body)).data
  },

  async list(employeId: string, filterBody: FilterData) {
    return (await api.post<PagamentoResponseBody[]>(`/pagamento/listar/${employeId}`, filterBody)).data
  }

}