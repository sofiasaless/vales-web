import { api } from "@/config/axios";
import { MensalidadeResponseBody } from "@/types/mensalidade";

export const MonthlyFeeService = {
  async list() {
    return await api.get<MensalidadeResponseBody[]>(`/mensalidade/listar`);
  },

  async sendPayment(payload: { invoiceId: string; proofPicture: string }) {
    const body = {
      comprovante: payload.proofPicture,
    };
    return await api.put(
      `/mensalidade/enviar-pagamento/${payload.invoiceId}`,
      body,
    );
  },
};
