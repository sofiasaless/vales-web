export type TiposGerente = 'GERENTE' | 'AUXILIAR';

export type Gerente = {
  id: string;
  nome: string;
  tipo: TiposGerente;
  senha: string;
  expoPushToken?: string;
  restaurante_ref: string;
  ativo: boolean;
  data_ultimo_acesso?: Date;
  data_criacao: Date;
};

export type GerentePostRequestBody = Omit<Gerente, 'id' | 'data_criacao' | 'restaurante_ref' | 'expoPushToken' | 'data_ultimo_acesso'>;
