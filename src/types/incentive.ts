// Tipos do sistema de incentivos

export interface Incentivo {
  id: string;
  valor_incentivo: number;
  descricao: string;
  meta: number;
  status: boolean;
  data_expiracao: Date;
  ganhador_nome?: string;
  ganhador_id?: string;
  data_adicao: Date;
}

export interface IncentivoPostRequestBody {
  valor_incentivo: number;
  descricao: string;
  meta: number;
  data_expiracao: Date;
}

// Atributos que ficará salvo no funcionário
export interface IncentivoFuncionario {
  contador: number;
  incentivo_id: string;
  ganhador: boolean;
}

// Estado do contexto de incentivos
export interface IncentiveState {
  incentivos: Incentivo[];
  // Map de employee ID -> contador para o incentivo ativo
  employeeCounters: Record<string, number>;
}
