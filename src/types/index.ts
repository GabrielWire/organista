export type Dificuldade = 'Fácil' | 'Médio' | 'Difícil';
export type FaseDificuldade = 1 | 2 | 3 | 4 | 5;

export interface Hino {
  numero: number;
  numeroExibicao?: string;
  titulo: string;
  faseDificuldade: FaseDificuldade;
  dificuldadeIntro?: Dificuldade;
  dificuldadeInteiro?: Dificuldade;
  acidentes: number;
  quantidadeAcidentes: number;
  tipoAcidente: string;
  tonalidadeEfeito: string;
  tonalidadeRelativa: string;
  armadura: string;
  compasso: string;
  categoria: string;
  meiaHora: boolean;
  jovens?: boolean;
  isCoro?: boolean;
  tonalidade?: string;
  observacoes: string[];
  maoDireita?: boolean;
  maoEsquerda?: boolean;
  pedaleira?: boolean;
}

export type StatusHino = 'nao_iniciado' | 'em_estudo' | 'aprendido';

export interface RegistroProgresso {
  intro: StatusHino;
  inteiro: StatusHino;
  anotacoes?: string;
  atualizadoEm?: string;
}

export interface ProgressoStore {
  instrumentoId: string;
  registros: Record<number, RegistroProgresso>;
}
