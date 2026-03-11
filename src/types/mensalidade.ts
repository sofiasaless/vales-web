export type MensalidadeResponseBody = {
  id?: string
  status: StatusMensalidade,
  data_vencimento: string,
  data_pagamento: string | null,
  valor: number,
  link: string,
  restaurante_ref: string,
  data_criacao: string
}

export type StatusMensalidade = 'PENDENTE' | 'PAGO' | 'VENCIDO'