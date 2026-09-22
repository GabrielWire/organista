export type MetodoEstagio = 'rjm' | 'culto' | 'oficializacao';

export type MetodoEstagioStatus = 'Iniciante' | 'Apta RJM / Ensaio' | 'Apta Culto Oficial' | 'Apta Oficialização';

export type MetodoLicaoStatus = 'Não iniciado' | 'Em andamento' | 'Concluído';

export interface MetodoExigenciaEstagio {
  descricao: string; // Ex: 'Conclusão do Vol. 1 e 2 + Hinos de Jovens com pedaleira'
  observacao?: string;
}

export interface MetodoVolumeDef {
  volume: 1 | 2 | 3 | 4;
  id: string; // 'volume_1', 'volume_2', 'volume_3', 'volume_4'
  nome: string; // 'Volume 1 - Iniciação', etc.
  subtitulo: string;
  descricao: string;
  objetivos: string[];
  totalPaginasSugeridas?: number;
  estagioVinculado?: MetodoEstagio;
  estagioRotulo?: string;
}

export interface MetodoOpcaoDef {
  id: string;
  nome: string;
  subtitulo?: string;
  volumes?: MetodoVolumeDef[];
  exigencias: {
    rjm: MetodoExigenciaEstagio;
    culto: MetodoExigenciaEstagio;
    oficializacao: MetodoExigenciaEstagio;
  };
}

export interface InstrumentoMetodosConfig {
  instrumentoId: string;
  instrumentoNome: string;
  familia: 'Cordas' | 'Madeiras' | 'Metais';
  metodos: MetodoOpcaoDef[];
  observacoesGerais?: {
    rjm?: string;
    culto?: string;
    oficializacao?: string;
  };
}

export interface MetodoLicaoDoc {
  id: string; // ex: "v1_p15_l3"
  studentId: string;
  metodoId: string;
  metodoNome: string;
  volume: number; // 1, 2, 3 ou 4
  numeroPagina: number; // Página, ex: 15
  numeroLicao: number;  // Lição, ex: 3
  titulo?: string;       // Opcional: ex: "Exercício de Tercinas"
  status: MetodoLicaoStatus;
  progress: number;      // 0 - 100%
  teacherNotes?: string; // Parecer / orientação pedagógica da instrutora
  evaluatedAt?: string; // Data da avaliação (YYYY-MM-DD)
  startedAt?: any;
  completedAt?: any;
  createdAt?: any;
  updatedAt?: any;
}

export interface AlunoMetodoProgressoDoc {
  studentId: string;
  instrumentoNome: string;
  metodoId: string;
  metodoNome: string;
  volumeAtual?: number; // 1, 2, 3 ou 4
  paginaAtual?: number;
  licaoAtual?: number;
  posicaoAtual: string; // Ex: 'Vol. 2 - Página 15, Lição 3'
  progressoPercent: number; // 0 - 100%
  totalLicoesCadastradas?: number;
  totalLicoesConcluidas?: number;
  estagiosAptos: {
    rjm: boolean; // Apta para RJM / Ensaio
    culto: boolean; // Apta para Culto Oficial
    oficializacao: boolean; // Apta para Oficialização
  };
  observacoesInstrutor: string;
  updatedAt: any;
}
