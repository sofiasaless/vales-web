export type RestauranteResponseBody = {
  id: string,
  nome_fantasia: string,
  email: string,
  ativo: boolean,
  pushTokens?: string[],
  data_criacao: string,
}