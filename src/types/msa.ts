export type MsaLessonStatus = 'Não iniciado' | 'Em andamento' | 'Concluído';

export interface MsaPhaseDoc {
  id: string;
  name: string;
  description: string;
  order: number;
  active: boolean;
  createdAt?: any;
  updatedAt?: any;
  lessonCount?: number;
}

export interface MsaLessonDoc {
  id: string;
  phaseId: string;
  name: string;
  description: string;
  order: number;
  type?: string; // 'Teoria' | 'Solfejo' | 'Ritmo' | 'Execução' | 'Geral'
  active: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface MsaStudentLessonProgress {
  lessonId: string;
  phaseId: string;
  status: MsaLessonStatus;
  progress: number; // 0 - 100
  startedAt?: any;
  completedAt?: any;
  updatedAt?: any;
  teacherNotes?: string;
  evaluatedAt?: string;
}

export interface MsaPhaseSummary {
  phaseId: string;
  phaseName: string;
  phaseOrder: number;
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  progressPercent: number; // 0 - 100
  isCompleted: boolean;
}

export interface MsaStudentOverallProgress {
  currentPhaseId: string;
  currentPhaseName: string;
  currentPhaseOrder: number;
  generalProgress: number; // 0 - 100
  totalCompletedLessons: number;
  totalLessons: number;
  phaseSummaries: Record<string, MsaPhaseSummary>;
}
