import { Gerente } from "./manager";

export type Vale = {
  id: string;
  quantidade: number;
  descricao: string;
  data_adicao?: string;
  preco_unit: number;
  produto_ref?: string;
  criadoPor?: Gerente;
};

export type ValeDinheiroPostRequestBody = Omit<
  Vale,
  "id" | "quantidade" | "data_adicao" | "produto_ref"
>;
