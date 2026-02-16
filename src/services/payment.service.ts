import { api } from "@/config/axios";
import { PagamentoPostRequestBody } from "@/types/pagamento.type";

export const PaymentService = {
  async pay(employeeId: string, body: PagamentoPostRequestBody) {
    return (await api.post(`/pagamento/pagar/${employeeId}`, body)).data
  },

}