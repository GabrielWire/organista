export type UserRole = 'admin' | 'instrutora' | 'aluna' | 'instrutor' | 'aluno' | 'professor';

export type InstrumentoOficial = string;

export const INSTRUMENTO_PADRAO = 'Órgão Eletrônico (Dó)';
export const INSTRUMENTOS_OFICIAIS: string[] = [INSTRUMENTO_PADRAO];

export type StatusProgresso = 'Não iniciado' | 'Em aprendizado' | 'Em progresso' | 'Concluído';

export interface UsuarioDoc {
  uid: string;
  name: string;
  email: string;
  phone: string;
  instrument: InstrumentoOficial;
  role: UserRole;
  totalHinos: number;
  hinosConcluidos: number;
  hinosEmProgresso: number;
  progressoGeral: number; // 0 - 100

  // Distribuição de hinos por fase (Fase 1 a 5)
  faseHinosAtual?: number; // 1 a 5
  hinosConcluidosFase1?: number;
  hinosConcluidosFase2?: number;
  hinosConcluidosFase3?: number;
  hinosConcluidosFase4?: number;
  hinosConcluidosFase5?: number;

  // Instrutoras: Lista de congregações / turmas ou instrumentos aptos
  instruments?: string[];

  // Alunas: Instrutora designada
  instrutorId?: string;
  instrutorNome?: string;
  instrutorEmail?: string;
  instrutorTelefone?: string;

  // MSA Aggregate fields (cached for 1-read performance)
  msaCurrentPhaseId?: string;
  msaCurrentPhaseName?: string;
  msaCurrentPhaseOrder?: number;
  msaGeneralProgress?: number; // 0 - 100
  msaLessonsCompleted?: number;
  msaTotalLessons?: number;

  // Instrument Method (Volumes 1 ao 4 de Órgão)
  metodoNome?: string;
  metodoVolume?: number; // 1, 2, 3 ou 4
  volumeMetodoAtual?: number; // 1, 2, 3 ou 4
  metodoPosicao?: string; // Ex: 'Vol. 2 - Página 15, Lição 3'
  metodoProgresso?: number; // 0 - 100
  metodoEstagioApto?: string; // 'Iniciante' | 'Apta RJM / Ensaio' | 'Apta Culto Oficial' | 'Apta Oficialização'

  createdAt?: any;
  updatedAt?: any;
}

export interface HinoProgressoDoc {
  hinoId: number;
  name: string;
  faseDificuldade?: number; // 1 a 5
  status: StatusProgresso;
  progress: number; // 0 - 100
  maoDireita?: boolean;
  maoEsquerda?: boolean;
  pedaleira?: boolean;
  updatedAt?: any;
  observacoes?: string;
}
