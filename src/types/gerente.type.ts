export type TiposGerente = 'GERENTE' | 'AUXILIAR'

export type GerenteResponseBody = {
  id: string,
  nome: string,
  tipo: TiposGerente,
  senha: string,
  restaurante_ref: string,
  ativo: boolean,
  img_perfil?: string,
  data_ultimo_acesso?: Date,
  data_criacao: string
}

export type GerenteAutenticateRequestBody = Pick<GerenteResponseBody, "id"> & {
  password: string;
}

export type GerenteAutenticatedResponseBody = {
  resultado: boolean,
  mensagem: string,
  usuario?: GerenteResponseBody
}

export type GerentePostRequestBody = Pick<GerenteResponseBody, "nome" | "tipo" | "senha">

export type GerenteUpdateRequestBody = Partial<GerentePostRequestBody> & {
  ativo?: boolean
  img_perfil?: string
}