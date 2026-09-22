import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type {
  MsaPhaseDoc,
  MsaLessonDoc,
  MsaStudentLessonProgress,
  MsaPhaseSummary,
  MsaStudentOverallProgress,
  MsaLessonStatus,
} from '../types/msa';

// ============================================================================
// 1. CONTEÚDO DO MSA (FASES & LIÇÕES NO FIRESTORE)
// ============================================================================

/**
 * Lists all MSA phases ordered by order asc.
 */
export async function listMsaPhases(includeInactive = false): Promise<MsaPhaseDoc[]> {
  const colRef = collection(db, 'msa_phases');
  const q = query(colRef, orderBy('order', 'asc'));
  const snap = await getDocs(q);
  const phases: MsaPhaseDoc[] = [];

  snap.forEach((d) => {
    const data = d.data() as MsaPhaseDoc;
    if (includeInactive || data.active !== false) {
      phases.push({ ...data, id: d.id });
    }
  });

  return phases;
}

/**
 * Lists all lessons for a specific phase ordered by order asc.
 */
export async function listMsaLessons(phaseId: string, includeInactive = false): Promise<MsaLessonDoc[]> {
  const colRef = collection(db, 'msa_phases', phaseId, 'lessons');
  const q = query(colRef, orderBy('order', 'asc'));
  const snap = await getDocs(q);
  const lessons: MsaLessonDoc[] = [];

  snap.forEach((d) => {
    const data = d.data() as MsaLessonDoc;
    if (includeInactive || data.active !== false) {
      lessons.push({ ...data, id: d.id, phaseId });
    }
  });

  return lessons;
}

/**
 * Lists all active lessons grouped by phaseId.
 */
export async function listAllMsaLessons(phases: MsaPhaseDoc[]): Promise<Record<string, MsaLessonDoc[]>> {
  const result: Record<string, MsaLessonDoc[]> = {};
  await Promise.all(
    phases.map(async (phase) => {
      const lessons = await listMsaLessons(phase.id);
      result[phase.id] = lessons;
    })
  );
  return result;
}

/**
 * Creates a new MSA phase.
 */
export async function createMsaPhase(data: {
  name: string;
  description: string;
  order: number;
  active?: boolean;
}): Promise<string> {
  const colRef = collection(db, 'msa_phases');
  const newDocRef = doc(colRef);
  const phaseDoc: Omit<MsaPhaseDoc, 'id'> = {
    name: data.name.trim(),
    description: data.description.trim(),
    order: Number(data.order) || 1,
    active: data.active !== false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(newDocRef, phaseDoc);
  return newDocRef.id;
}

/**
 * Updates an existing MSA phase.
 */
export async function updateMsaPhase(
  phaseId: string,
  data: Partial<Omit<MsaPhaseDoc, 'id' | 'createdAt'>>
): Promise<void> {
  const phaseRef = doc(db, 'msa_phases', phaseId);
  await updateDoc(phaseRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes an MSA phase and its lessons.
 */
export async function deleteMsaPhase(phaseId: string): Promise<void> {
  // Delete all child lessons first
  const lessonsRef = collection(db, 'msa_phases', phaseId, 'lessons');
  const snap = await getDocs(lessonsRef);
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  // Delete phase
  await deleteDoc(doc(db, 'msa_phases', phaseId));
}

/**
 * Creates a new lesson in a phase.
 */
export async function createMsaLesson(
  phaseId: string,
  data: {
    name: string;
    description: string;
    order: number;
    type?: string;
    active?: boolean;
  }
): Promise<string> {
  const colRef = collection(db, 'msa_phases', phaseId, 'lessons');
  const newDocRef = doc(colRef);
  const lessonDoc: Omit<MsaLessonDoc, 'id'> = {
    phaseId,
    name: data.name.trim(),
    description: data.description.trim(),
    order: Number(data.order) || 1,
    type: data.type || 'Geral',
    active: data.active !== false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(newDocRef, lessonDoc);
  return newDocRef.id;
}

/**
 * Updates an existing lesson.
 */
export async function updateMsaLesson(
  phaseId: string,
  lessonId: string,
  data: Partial<Omit<MsaLessonDoc, 'id' | 'phaseId' | 'createdAt'>>
): Promise<void> {
  const lessonRef = doc(db, 'msa_phases', phaseId, 'lessons', lessonId);
  await updateDoc(lessonRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes a lesson.
 */
export async function deleteMsaLesson(phaseId: string, lessonId: string): Promise<void> {
  const lessonRef = doc(db, 'msa_phases', phaseId, 'lessons', lessonId);
  await deleteDoc(lessonRef);
}

// ============================================================================
// 2. CÁLCULOS E REGRAS PEDAGÓGICAS ISOLADAS
// ============================================================================

/**
 * Calculates summary metrics for a single phase.
 * Formula: completed / totalLessons * 100
 */
export function calculatePhaseSummary(
  phase: MsaPhaseDoc,
  lessons: MsaLessonDoc[],
  progressMap: Record<string, MsaStudentLessonProgress>
): MsaPhaseSummary {
  const activeLessons = lessons.filter((l) => l.active !== false);
  const total = activeLessons.length;

  if (total === 0) {
    return {
      phaseId: phase.id,
      phaseName: phase.name,
      phaseOrder: phase.order,
      totalLessons: 0,
      completedLessons: 0,
      inProgressLessons: 0,
      progressPercent: 0,
      isCompleted: false,
    };
  }

  let completed = 0;
  let inProgress = 0;

  activeLessons.forEach((lesson) => {
    const p = progressMap[lesson.id];
    if (p?.status === 'Concluído' || p?.progress === 100) {
      completed++;
    } else if (p?.status === 'Em andamento' || (p?.progress || 0) > 0) {
      inProgress++;
    }
  });

  const progressPercent = Math.round((completed / total) * 100);
  const isCompleted = completed === total && total > 0;

  return {
    phaseId: phase.id,
    phaseName: phase.name,
    phaseOrder: phase.order,
    totalLessons: total,
    completedLessons: completed,
    inProgressLessons: inProgress,
    progressPercent,
    isCompleted,
  };
}

/**
 * Identifies the student's current phase.
 * Rule: First active phase that is not 100% completed.
 * Advances automatically to the next phase when current is completed.
 */
export function identifyCurrentPhase(
  phases: MsaPhaseDoc[],
  phaseSummaries: Record<string, MsaPhaseSummary>
): { currentPhaseId: string; currentPhaseName: string; currentPhaseOrder: number } {
  const activePhases = [...phases].filter((p) => p.active !== false).sort((a, b) => a.order - b.order);

  if (activePhases.length === 0) {
    return { currentPhaseId: '', currentPhaseName: 'Sem fases cadastradas', currentPhaseOrder: 0 };
  }

  // Find the first phase not yet completed
  for (const phase of activePhases) {
    const summary = phaseSummaries[phase.id];
    if (!summary || !summary.isCompleted) {
      return {
        currentPhaseId: phase.id,
        currentPhaseName: phase.name,
        currentPhaseOrder: phase.order,
      };
    }
  }

  // If all phases completed, student is at the final phase
  const last = activePhases[activePhases.length - 1];
  return {
    currentPhaseId: last.id,
    currentPhaseName: `${last.name} (Concluído)`,
    currentPhaseOrder: last.order,
  };
}

/**
 * Calculates overall progress across the entire MSA curriculum.
 * Can easily be adapted for different pedagogical weights in the future.
 */
export function calculateMsaGeneralProgress(
  phases: MsaPhaseDoc[],
  lessonsByPhase: Record<string, MsaLessonDoc[]>,
  progressMap: Record<string, MsaStudentLessonProgress>
): {
  generalProgress: number;
  totalCompletedLessons: number;
  totalLessons: number;
  phaseSummaries: Record<string, MsaPhaseSummary>;
} {
  const phaseSummaries: Record<string, MsaPhaseSummary> = {};
  let totalLessons = 0;
  let totalCompletedLessons = 0;

  phases.forEach((phase) => {
    const lessons = lessonsByPhase[phase.id] || [];
    const summary = calculatePhaseSummary(phase, lessons, progressMap);
    phaseSummaries[phase.id] = summary;
    totalLessons += summary.totalLessons;
    totalCompletedLessons += summary.completedLessons;
  });

  const generalProgress = totalLessons > 0 ? Math.round((totalCompletedLessons / totalLessons) * 100) : 0;

  return {
    generalProgress,
    totalCompletedLessons,
    totalLessons,
    phaseSummaries,
  };
}

// ============================================================================
// 3. PROGRESSO DO ALUNO (FIRESTORE)
// ============================================================================

/**
 * Fetches the progress records for a specific student.
 */
export async function getStudentMsaProgress(
  studentId: string
): Promise<Record<string, MsaStudentLessonProgress>> {
  const colRef = collection(db, 'students', studentId, 'msa_progress');
  const snap = await getDocs(colRef);
  const map: Record<string, MsaStudentLessonProgress> = {};

  snap.forEach((d) => {
    const data = d.data() as MsaStudentLessonProgress;
    map[d.id] = { ...data, lessonId: d.id };
  });

  return map;
}

/**
 * Retrieves the full compiled MSA overview for a student.
 */
export async function getStudentMsaOverview(
  studentId: string,
  phases: MsaPhaseDoc[],
  lessonsByPhase: Record<string, MsaLessonDoc[]>
): Promise<{
  progressMap: Record<string, MsaStudentLessonProgress>;
  overall: MsaStudentOverallProgress;
}> {
  const progressMap = await getStudentMsaProgress(studentId);
  const { generalProgress, totalCompletedLessons, totalLessons, phaseSummaries } =
    calculateMsaGeneralProgress(phases, lessonsByPhase, progressMap);
  const current = identifyCurrentPhase(phases, phaseSummaries);

  const overall: MsaStudentOverallProgress = {
    currentPhaseId: current.currentPhaseId,
    currentPhaseName: current.currentPhaseName,
    currentPhaseOrder: current.currentPhaseOrder,
    generalProgress,
    totalCompletedLessons,
    totalLessons,
    phaseSummaries,
  };

  return { progressMap, overall };
}

/**
 * Updates a student's lesson progress and recalculates aggregates on `users/{studentId}`.
 * Only teachers / admins are permitted to call this per security rules.
 */
export async function updateStudentLessonProgress(
  studentId: string,
  lessonId: string,
  phaseId: string,
  updates: {
    status: MsaLessonStatus;
    progress: number;
    teacherNotes?: string;
    evaluatedAt?: string;
  },
  phases: MsaPhaseDoc[],
  lessonsByPhase: Record<string, MsaLessonDoc[]>,
  currentProgressMap: Record<string, MsaStudentLessonProgress>
): Promise<MsaStudentOverallProgress> {
  const lessonProgressRef = doc(db, 'students', studentId, 'msa_progress', lessonId);

  const nowIso = new Date().toISOString();
  const isDone = updates.status === 'Concluído' || updates.progress === 100;
  const existing = currentProgressMap[lessonId];

  const newDoc: MsaStudentLessonProgress = {
    lessonId,
    phaseId,
    status: updates.status,
    progress: Math.min(100, Math.max(0, Math.round(updates.progress))),
    teacherNotes: updates.teacherNotes !== undefined ? updates.teacherNotes : (existing?.teacherNotes || ''),
    evaluatedAt: updates.evaluatedAt !== undefined ? updates.evaluatedAt : (existing?.evaluatedAt || nowIso.split('T')[0]),
    startedAt: existing?.startedAt || (updates.status !== 'Não iniciado' ? nowIso : null),
    completedAt: isDone ? (existing?.completedAt || nowIso) : null,
    updatedAt: serverTimestamp(),
  };

  await setDoc(lessonProgressRef, newDoc, { merge: true });

  // Update in-memory map for instantaneous re-calculation
  const updatedProgressMap: Record<string, MsaStudentLessonProgress> = {
    ...currentProgressMap,
    [lessonId]: newDoc,
  };

  const { generalProgress, totalCompletedLessons, totalLessons, phaseSummaries } =
    calculateMsaGeneralProgress(phases, lessonsByPhase, updatedProgressMap);
  const current = identifyCurrentPhase(phases, phaseSummaries);

  // Update denormalized aggregates on `users/{studentId}` (1 read cost for list/dashboard!)
  const userRef = doc(db, 'users', studentId);
  await updateDoc(userRef, {
    msaCurrentPhaseId: current.currentPhaseId,
    msaCurrentPhaseName: current.currentPhaseName,
    msaCurrentPhaseOrder: current.currentPhaseOrder,
    msaGeneralProgress: generalProgress,
    msaLessonsCompleted: totalCompletedLessons,
    msaTotalLessons: totalLessons,
    updatedAt: serverTimestamp(),
  });

  return {
    currentPhaseId: current.currentPhaseId,
    currentPhaseName: current.currentPhaseName,
    currentPhaseOrder: current.currentPhaseOrder,
    generalProgress,
    totalCompletedLessons,
    totalLessons,
    phaseSummaries,
  };
}

// ============================================================================
// 4. SEEDER: 16 FASES OFICIAIS DO MSA CCB
// ============================================================================

export const CCB_MSA_DEFAULT_PHASES = [
  {
    order: 1,
    name: 'Fase 1 — Fundamentos da Música, Som e Ritmo',
    description: 'Conceitos básicos de música, propriedades do som (altura, duração, intensidade, timbre) e pulsação.',
    lessons: [
      { order: 1, name: 'Música e suas Três Partes (Melodia, Harmonia, Ritmo)', description: 'Conceito e divisões da música sacra.', type: 'Teoria' },
      { order: 2, name: 'O Som e suas 4 Propriedades', description: 'Altura, Duração, Intensidade e Timbre.', type: 'Teoria' },
      { order: 3, name: 'Pulsação e Ritmo', description: 'Sensação do tempo e constância rítmica.', type: 'Ritmo' },
      { order: 4, name: 'Movimento de Pulsação com Metrônomo', description: 'Exercícios práticos de pulsação regular.', type: 'Execução' },
    ],
  },
  {
    order: 2,
    name: 'Fase 2 — Pentagrama, Claves e Notas Musicais',
    description: 'Escrita musical, linhas e espaços da pauta, claves e leitura no instrumento.',
    lessons: [
      { order: 1, name: 'A Pauta Musical e Linhas Suplementares', description: 'Estrutura do pentagrama.', type: 'Teoria' },
      { order: 2, name: 'Clave de Sol e Clave de Fá', description: 'Posicionamento e leitura das notas de referência.', type: 'Teoria' },
      { order: 3, name: 'Clave de Dó na 3ª Linha (Viola)', description: 'Leitura para instrumentos em clave de Dó.', type: 'Teoria' },
      { order: 4, name: 'Notação e Escrita das Notas', description: 'Exercícios de identificação visual rápida.', type: 'Solfejo' },
    ],
  },
  {
    order: 3,
    name: 'Fase 3 — Figuras Musicais e Valores',
    description: 'Figuras de som, pausas correspondentes e divisão proporcional dos tempos.',
    lessons: [
      { order: 1, name: 'Figuras de Som e suas Partes', description: 'Cabeça, haste e colchete.', type: 'Teoria' },
      { order: 2, name: 'Pausas Correspondentes', description: 'Silêncio medido e valores relativos.', type: 'Teoria' },
      { order: 3, name: 'Quadro Comparativo das Figuras', description: 'Semibreve, mínima, semínima, colcheia e semicolcheia.', type: 'Teoria' },
      { order: 4, name: 'Exercícios Rítmicos Proporcionais', description: 'Leitura rítmica com palmas e voz.', type: 'Ritmo' },
    ],
  },
  {
    order: 4,
    name: 'Fase 4 — Compasso Simples e Metrônomo',
    description: 'Fórmulas de compasso binário, ternário e quaternário, barras de compasso e andamento.',
    lessons: [
      { order: 1, name: 'Fórmulas de Compasso (2/4, 3/4, 4/4)', description: 'Unidade de tempo (U.T.) e de compasso (U.C.).', type: 'Teoria' },
      { order: 2, name: 'Barras de Compasso e Barra Final', description: 'Divisão métrica na partitura.', type: 'Teoria' },
      { order: 3, name: 'O Metrônomo M.M. e sua Utilização', description: 'Definição de andamentos seguros.', type: 'Execução' },
      { order: 4, name: 'Movimentos de Marcação e Regência', description: 'Desenho gestual dos compassos simples.', type: 'Execução' },
    ],
  },
  {
    order: 5,
    name: 'Fase 5 — Leitura Métrica e Solfejo Básico',
    description: 'Coordenação motora, respiração diafragmática e solfejo rítmico.',
    lessons: [
      { order: 1, name: 'Postura, Respiração e Coluna de Ar', description: 'Técnica física para sustentação do som.', type: 'Execução' },
      { order: 2, name: 'Leitura Métrica sem Afinação', description: 'Falar as notas no tempo exato do metrônomo.', type: 'Solfejo' },
      { order: 3, name: 'Solfejo Cantado Inicial', description: 'Emissão afinada dos sons nas notas naturais.', type: 'Solfejo' },
      { order: 4, name: 'Exercícios de Fixação no Hinário', description: 'Hinos fáceis aplicados ao solfejo.', type: 'Execução' },
    ],
  },
  {
    order: 6,
    name: 'Fase 6 — Ponto de Aumento e Ligaduras',
    description: 'Prolongamento do som, ponto simples e duplo, ligadura de valor e portamento.',
    lessons: [
      { order: 1, name: 'Ponto de Aumento Simples', description: 'Acréscimo de metade do valor da figura.', type: 'Teoria' },
      { order: 2, name: 'Ponto de Aumento Duplo', description: 'Acréscimo de metade mais a quarta parte.', type: 'Teoria' },
      { order: 3, name: 'Ligadura de Valor vs Ligadura de Portamento', description: 'Diferenciação clara na execução orquestral.', type: 'Teoria' },
      { order: 4, name: 'Exercícios Rítmicos Pontuados', description: 'Leitura de figuras pontuadas nos hinos.', type: 'Ritmo' },
    ],
  },
  {
    order: 7,
    name: 'Fase 7 — Intervalos Musicais e Semitons',
    description: 'Semitom natural e cromático, tom inteiro, intervalos melódicos e harmônicos.',
    lessons: [
      { order: 1, name: 'Semitom Natural e Cromático', description: 'Menor distância entre duas notas na música ocidental.', type: 'Teoria' },
      { order: 2, name: 'Conceito de Tom Inteiro', description: 'Soma de dois semitons.', type: 'Teoria' },
      { order: 3, name: 'Intervalos Melódicos e Harmônicos', description: 'Segundas, terças, quartas e quintas.', type: 'Teoria' },
      { order: 4, name: 'Prática de Identificação Auditiva', description: 'Percepção de intervalos nos hinos.', type: 'Solfejo' },
    ],
  },
  {
    order: 8,
    name: 'Fase 8 — Compasso Composto',
    description: 'Compassos com divisão ternária dos tempos (6/8, 9/8, 12/8) e figuras pontuadas.',
    lessons: [
      { order: 1, name: 'Fórmulas de Compasso Composto', description: 'Numerador 6, 9 e 12; denominador 8.', type: 'Teoria' },
      { order: 2, name: 'Unidade de Movimento e Unidade de Tempo', description: 'A colcheia como movimento e a semínima pontuada.', type: 'Teoria' },
      { order: 3, name: 'Movimento de Regência em Compasso Composto', description: 'Condução gestual suave.', type: 'Execução' },
      { order: 4, name: 'Hinos em Compasso Composto', description: 'Aplicação prática em hinos do Hinário 5.', type: 'Execução' },
    ],
  },
  {
    order: 9,
    name: 'Fase 9 — Síncope e Contratempo',
    description: 'Acentuação métrica, deslocamento rítmico nos tempos e contratempos nos hinos.',
    lessons: [
      { order: 1, name: 'Acentuação Métrica Natural dos Compassos', description: 'Tempos fortes, meio-fortes e fracos.', type: 'Teoria' },
      { order: 2, name: 'Síncope Regular e Irregular', description: 'Início no tempo fraco e prolongamento no tempo forte.', type: 'Ritmo' },
      { order: 3, name: 'Contratempo', description: 'Notas no tempo fraco precedidas de pausa no tempo forte.', type: 'Ritmo' },
      { order: 4, name: 'Exercícios de Fixação', description: 'Síncopes características encontradas nos hinos.', type: 'Execução' },
    ],
  },
  {
    order: 10,
    name: 'Fase 10 — Quiálteras (Tercinas e Duínas)',
    description: 'Grupos de notas alteradas em relação à divisão natural do compasso.',
    lessons: [
      { order: 1, name: 'Conceito de Quiáltera', description: 'Alteração do número normal de figuras no tempo.', type: 'Teoria' },
      { order: 2, name: 'Tercinas em Compasso Simples', description: 'Três figuras no lugar de duas.', type: 'Ritmo' },
      { order: 3, name: 'Duínas em Compasso Composto', description: 'Duas figuras no lugar de três.', type: 'Ritmo' },
      { order: 4, name: 'Prática Instrumental com Tercinas', description: 'Fluência e equilíbrio com metrônomo.', type: 'Execução' },
    ],
  },
  {
    order: 11,
    name: 'Fase 11 — Escalas Maiores e Armaduras de Clave',
    description: 'Estrutura da escala maior, acidentes fixos e círculo das quintas com sustenidos e bemóis.',
    lessons: [
      { order: 1, name: 'Fórmula da Escala Maior (T-T-St-T-T-T-St)', description: 'Construção a partir de qualquer tônica.', type: 'Teoria' },
      { order: 2, name: 'Ordem dos Sustenidos (Fá-Dó-Sol-Ré-Lá-Mi-Si)', description: 'Regra da 7ª nota sensível.', type: 'Teoria' },
      { order: 3, name: 'Ordem dos Bemóis (Si-Mi-Lá-Ré-Sol-Dó-Fá)', description: 'Regra do penúltimo bemol.', type: 'Teoria' },
      { order: 4, name: 'Armaduras Transpostas do Instrumento', description: 'Aplicação prática da afinação do aluno.', type: 'Execução' },
    ],
  },
  {
    order: 12,
    name: 'Fase 12 — Escalas Menores e Tonalidades Relativas',
    description: 'Modo menor natural, harmônico e melódico, armaduras de clave coincidentes.',
    lessons: [
      { order: 1, name: 'Tonalidades Relativas', description: 'Relação de 3ª menor descendente entre Maior e Menor.', type: 'Teoria' },
      { order: 2, name: 'Escala Menor Natural e Harmônica', description: 'Elevação do 7º grau sensível.', type: 'Teoria' },
      { order: 3, name: 'Escala Menor Melódica', description: 'Alterações ascendentes e descendentes.', type: 'Teoria' },
      { order: 4, name: 'Identificação nos Hinos da CCB', description: 'Reconhecer tonalidades menores no Hinário 5.', type: 'Solfejo' },
    ],
  },
  {
    order: 13,
    name: 'Fase 13 — Dinâmica, Andamentos e Articulação',
    description: 'Expressão musical sacra, variações de dinâmica e respeito às indicações do hinário.',
    lessons: [
      { order: 1, name: 'Sinais de Dinâmica (pp, p, mp, mf, f, ff)', description: 'Moderação e equilíbrio sonoro na casa de oração.', type: 'Teoria' },
      { order: 2, name: 'Graduações de Volume (Crescendo e Decrescendo)', description: 'Controle de dinâmica sem alterar afinação.', type: 'Execução' },
      { order: 3, name: 'Andamentos Tradicionais', description: 'Adagio, Andante, Moderato, Allegro.', type: 'Teoria' },
      { order: 4, name: 'Articulações: Legato, Tenuto e Staccato', description: 'Golpes de arco ou golpes de língua específicos.', type: 'Execução' },
    ],
  },
  {
    order: 14,
    name: 'Fase 14 — Solfejo Avançado e Interpretação Hinária',
    description: 'Solfejo em diversas claves, fermatas, cesuras e compreensão do texto sacro.',
    lessons: [
      { order: 1, name: 'Leitura à Primeira Vista', description: 'Fluência visual antecipada na partitura.', type: 'Solfejo' },
      { order: 2, name: 'Fermatas e Cesuras', description: 'Sustentação respeitosa e retomada no tempo.', type: 'Execução' },
      { order: 3, name: 'Solfejo das 4 Vozes Corais', description: 'Compreensão de Soprano, Contralto, Tenor e Baixo.', type: 'Solfejo' },
      { order: 4, name: 'Poesia e Mensagem do Hino', description: 'Tocar com reverência de acordo com o texto sagrado.', type: 'Execução' },
    ],
  },
  {
    order: 15,
    name: 'Fase 15 — Prática Instrumental e Afinação Orquestral',
    description: 'Afinação coletiva, dinâmica de naipe e ensaios preparatórios.',
    lessons: [
      { order: 1, name: 'Afinação pelo Diapasão Lá 440 Hz', description: 'Ajuste do instrumento na orquestra.', type: 'Execução' },
      { order: 2, name: 'Equilíbrio Sonoro do Naipe', description: 'Não sobrepor as vozes principais nem cobrir o canto.', type: 'Execução' },
      { order: 3, name: 'Atenção ao Encarregado de Orquestra', description: 'Ataques juntos, cortes simultâneos e andamento.', type: 'Execução' },
      { order: 4, name: 'Hinos de Meia-Hora', description: 'Execução suave, serena e oracional.', type: 'Execução' },
    ],
  },
  {
    order: 16,
    name: 'Fase 16 — Preparação Final para os Cultos',
    description: 'Revisão geral de todas as fases, simulação de teste e ingresso oficial na orquestra.',
    lessons: [
      { order: 1, name: 'Revisão Geral da Teoria e Solfejo', description: 'Checklist completo das 15 fases.', type: 'Teoria' },
      { order: 2, name: 'Execução com Metrônomo dos Hinos Sorteados', description: 'Segurança absoluta no andamento e armadura.', type: 'Execução' },
      { order: 3, name: 'Simulação do Teste Oficial do GEM', description: 'Avaliação prática com o professor/encarregado.', type: 'Execução' },
      { order: 4, name: 'Orientações para o Primeiro Culto', description: 'Comportamento, pontualidade e reverência na orquestra.', type: 'Geral' },
    ],
  },
];

/**
 * Seeds the official 16 CCB MSA Phases with default lessons into Firestore.
 * Used once by the administrator via UI to initialize the database.
 */
export async function seedInitialMsaPhases(): Promise<{ phasesCount: number; lessonsCount: number }> {
  let phasesCount = 0;
  let lessonsCount = 0;

  for (const p of CCB_MSA_DEFAULT_PHASES) {
    const phaseId = `fase_${p.order}`;
    const phaseRef = doc(db, 'msa_phases', phaseId);

    await setDoc(phaseRef, {
      name: p.name,
      description: p.description,
      order: p.order,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    phasesCount++;

    for (const l of p.lessons) {
      const lessonId = `licao_${p.order}_${l.order}`;
      const lessonRef = doc(db, 'msa_phases', phaseId, 'lessons', lessonId);

      await setDoc(lessonRef, {
        phaseId,
        name: l.name,
        description: l.description,
        order: l.order,
        type: l.type,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      lessonsCount++;
    }
  }

  return { phasesCount, lessonsCount };
}
