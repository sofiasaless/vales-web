export type Incentivo = {
  id: string,
  valor_incentivo: number,
  descricao: string,
  meta: number,
  restaurante_ref: string,
  status: boolean,
  data_expiracao: string,
  ganhador_nome?: string,
  ganhador_ref?: string,
  data_adicao: string
}

export type IncentivoPostRequestBody = Omit<Incentivo, "id" | "data_adicao" | "restaurante_ref" | "status" | "ganhador_nome" | "ganhador_ref">

export type IncentivoUpdateRequestBody = Pick<Incentivo, "data_expiracao" | "descricao" | "valor_incentivo" | "meta" | "ganhador_nome" | "status" | "ganhador_ref">

// atributos que ficará salvo no funcionário
export type IncentivoFuncionario = {
  contador: number,
  incentivo_ref: string,
  ganhador: boolean
}

export type IncentivoFuncionarioFirestorePostRequestBody = Omit<IncentivoFuncionario, "incentivo_ref"> & {
  incentivo_ref: string
}

// atributos que ficará salvo no funcionário
export type GanhosIncentivo = {
  valor: number;
  incentivo_ref: string;
}