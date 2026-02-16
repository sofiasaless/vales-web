import { GanhosIncentivo } from "./incentivo.type"
import { Vale } from "./vale.type"

export type PagamentoResponseBody = {
  id: string,
  funcionario_ref: string,
  restaurante_ref: string,
  valor_pago: number,
  salario_atual: number,
  vales: Vale[],
  incentivo: GanhosIncentivo[],
  assinatura?: string,
  data_pagamento: string
}

export type PagamentoPostRequestBody = Omit<PagamentoResponseBody, "id" | "data_pagamento" | "funcionario_ref" | "data_pagamento" | "restaurante_ref">