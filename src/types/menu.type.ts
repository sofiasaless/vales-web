export type ItemMenuResponseBody = {
  id: string,
  descricao: string,
  preco: number,
  restaurante_ref: string,
  data_criacao: Date
}

export type ItemMenuPostRequestBody = Omit<ItemMenuResponseBody, "id" | "data_criacao" | "restaurante_ref">