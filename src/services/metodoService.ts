import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type {
  AlunoMetodoProgressoDoc,
  MetodoLicaoDoc,
  MetodoLicaoStatus,
  MetodoEstagioStatus,
} from '../types/metodo';

export function calculateMethodStage(estagios: {
  rjm: boolean;
  culto: boolean;
  oficializacao: boolean;
}): MetodoEstagioStatus {
  if (estagios.oficializacao) return 'Apta Oficialização';
  if (estagios.culto) return 'Apta Culto Oficial';
  if (estagios.rjm) return 'Apta RJM / Ensaio';
  return 'Iniciante';
}

/**
 * Retrieves the current organ method progress for a student.
 */
export async function getStudentMethodProgress(studentId: string): Promise<AlunoMetodoProgressoDoc | null> {
  const docRef = doc(db, 'students', studentId, 'method_progress', 'current');
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as AlunoMetodoProgressoDoc;
}

/**
 * Lists all lessons registered for a student's organ method.
 * Ordered by volume asc, page asc, then lesson number asc.
 */
export async function listStudentMethodLessons(studentId: string): Promise<MetodoLicaoDoc[]> {
  const colRef = collection(db, 'students', studentId, 'method_progress', 'current', 'lessons');
  const snap = await getDocs(colRef);
  const lessons: MetodoLicaoDoc[] = [];

  snap.forEach((d) => {
    const data = d.data() as MetodoLicaoDoc;
    lessons.push({ ...data, id: d.id });
  });

  return lessons.sort((a, b) => {
    const volA = a.volume || 1;
    const volB = b.volume || 1;
    if (volA !== volB) return volA - volB;
    if (a.numeroPagina !== b.numeroPagina) return a.numeroPagina - b.numeroPagina;
    return a.numeroLicao - b.numeroLicao;
  });
}

/**
 * Saves or updates a specific method lesson (Volume + Page + Lesson).
 * Automatically calculates latest student position and syncs users/{studentId}.
 */
export async function saveStudentMethodLesson(
  studentId: string,
  lessonData: {
    id?: string;
    metodoId: string;
    metodoNome: string;
    volume?: number;
    numeroPagina: number;
    numeroLicao: number;
    titulo?: string;
    status: MetodoLicaoStatus;
    progress: number;
    teacherNotes?: string;
    evaluatedAt?: string;
  }
): Promise<MetodoLicaoDoc> {
  const vol = Math.min(4, Math.max(1, Number(lessonData.volume) || 1));
  const pag = Math.max(1, Number(lessonData.numeroPagina) || 1);
  const lic = Math.max(1, Number(lessonData.numeroLicao) || 1);
  const lessonId = lessonData.id || `v${vol}_pag_${pag}_lic_${lic}`;

  const docRef = doc(db, 'students', studentId, 'method_progress', 'current', 'lessons', lessonId);
  const snap = await getDoc(docRef);
  const existing = snap.exists() ? (snap.data() as MetodoLicaoDoc) : null;

  const nowIso = new Date().toISOString();
  const isDone = lessonData.status === 'Concluído' || lessonData.progress === 100;
  const normProgress = Math.min(100, Math.max(0, Math.round(lessonData.progress)));

  const newDoc: MetodoLicaoDoc = {
    id: lessonId,
    studentId,
    metodoId: lessonData.metodoId || 'metodo_oficial_orgao_ccb',
    metodoNome: lessonData.metodoNome || 'Método de Estudos para Órgão Eletrônico CCB',
    volume: vol,
    numeroPagina: pag,
    numeroLicao: lic,
    titulo: (lessonData.titulo || '').trim(),
    status: lessonData.status,
    progress: normProgress,
    teacherNotes: lessonData.teacherNotes !== undefined ? lessonData.teacherNotes.trim() : (existing?.teacherNotes || ''),
    evaluatedAt: lessonData.evaluatedAt !== undefined ? lessonData.evaluatedAt : (existing?.evaluatedAt || nowIso.split('T')[0]),
    startedAt: existing?.startedAt || (lessonData.status !== 'Não iniciado' ? nowIso : null),
    completedAt: isDone ? (existing?.completedAt || nowIso) : null,
    updatedAt: serverTimestamp(),
  };

  await setDoc(docRef, newDoc, { merge: true });

  // Recalculate summary and position
  await syncMethodSummaryFromLessons(studentId, lessonData.metodoId, lessonData.metodoNome);

  return newDoc;
}

/**
 * Deletes a registered lesson and syncs summary.
 */
export async function deleteStudentMethodLesson(
  studentId: string,
  lessonId: string,
  metodoId: string,
  metodoNome: string
): Promise<void> {
  const docRef = doc(db, 'students', studentId, 'method_progress', 'current', 'lessons', lessonId);
  await deleteDoc(docRef);
  await syncMethodSummaryFromLessons(studentId, metodoId, metodoNome);
}

/**
 * Recalculates latest volume, page, lesson and updates the summary document and user profile.
 */
async function syncMethodSummaryFromLessons(
  studentId: string,
  metodoId: string,
  metodoNome: string
): Promise<void> {
  const lessons = await listStudentMethodLessons(studentId);
  const currentSummary = await getStudentMethodProgress(studentId);

  const totalCadastradas = lessons.length;
  const concluidas = lessons.filter((l) => l.status === 'Concluído' || l.progress === 100).length;

  let latestVol = 1;
  let latestPag = 1;
  let latestLic = 1;
  let posicaoString = 'Vol. 1 - Página 1, Lição 1';

  if (lessons.length > 0) {
    const activeLessons = lessons.filter((l) => l.status !== 'Não iniciado' || l.progress > 0);
    const target = activeLessons.length > 0 ? activeLessons[activeLessons.length - 1] : lessons[0];
    latestVol = target.volume || 1;
    latestPag = target.numeroPagina;
    latestLic = target.numeroLicao;
    posicaoString = `Vol. ${latestVol} - Página ${latestPag}, Lição ${latestLic}`;
  } else if (currentSummary?.posicaoAtual) {
    posicaoString = currentSummary.posicaoAtual;
    latestVol = currentSummary.volumeAtual || 1;
  }

  const progressoPercent =
    totalCadastradas > 0
      ? Math.round((concluidas / totalCadastradas) * 100)
      : (currentSummary?.progressoPercent || 0);

  const estagios = currentSummary?.estagiosAptos || { rjm: false, culto: false, oficializacao: false };
  const stageStatus = calculateMethodStage(estagios);

  const currentRef = doc(db, 'students', studentId, 'method_progress', 'current');
  await setDoc(
    currentRef,
    {
      studentId,
      metodoId: metodoId || currentSummary?.metodoId || 'metodo_oficial_orgao_ccb',
      metodoNome: metodoNome || currentSummary?.metodoNome || 'Método de Estudos para Órgão Eletrônico CCB',
      volumeAtual: latestVol,
      paginaAtual: latestPag,
      licaoAtual: latestLic,
      posicaoAtual: posicaoString,
      progressoPercent,
      totalLicoesCadastradas: totalCadastradas,
      totalLicoesConcluidas: concluidas,
      estagiosAptos: estagios,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const userRef = doc(db, 'users', studentId);
  await updateDoc(userRef, {
    metodoNome: metodoNome || currentSummary?.metodoNome || 'Método de Estudos para Órgão Eletrônico CCB',
    metodoVolume: latestVol,
    metodoPosicao: posicaoString,
    metodoProgresso: progressoPercent,
    metodoEstagioApto: stageStatus,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Updates student method configuration (aptitude checkpoints, volume, instructor notes).
 */
export async function updateStudentMethodProgress(
  studentId: string,
  data: {
    instrumentoNome?: string;
    metodoId?: string;
    metodoNome?: string;
    volumeAtual?: number;
    paginaAtual?: number;
    licaoAtual?: number;
    posicaoAtual: string;
    progressoPercent: number;
    estagiosAptos: {
      rjm: boolean;
      culto: boolean;
      oficializacao: boolean;
    };
    observacoesInstrutor?: string;
  }
): Promise<AlunoMetodoProgressoDoc> {
  const docRef = doc(db, 'students', studentId, 'method_progress', 'current');
  const stageStatus = calculateMethodStage(data.estagiosAptos);
  const progressoNormalizado = Math.min(100, Math.max(0, Math.round(data.progressoPercent || 0)));

  const updatedDoc: AlunoMetodoProgressoDoc = {
    studentId,
    instrumentoNome: data.instrumentoNome || 'Órgão Eletrônico (Dó)',
    metodoId: data.metodoId || 'metodo_oficial_orgao_ccb',
    metodoNome: data.metodoNome || 'Método de Estudos para Órgão Eletrônico CCB',
    volumeAtual: data.volumeAtual || 1,
    paginaAtual: data.paginaAtual,
    licaoAtual: data.licaoAtual,
    posicaoAtual: data.posicaoAtual.trim() || 'Vol. 1 - Lição 1',
    progressoPercent: progressoNormalizado,
    estagiosAptos: data.estagiosAptos,
    observacoesInstrutor: (data.observacoesInstrutor || '').trim(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(docRef, updatedDoc, { merge: true });

  const userRef = doc(db, 'users', studentId);
  await updateDoc(userRef, {
    metodoNome: updatedDoc.metodoNome,
    metodoVolume: updatedDoc.volumeAtual,
    metodoPosicao: updatedDoc.posicaoAtual,
    metodoProgresso: progressoNormalizado,
    metodoEstagioApto: stageStatus,
    updatedAt: serverTimestamp(),
  });

  return updatedDoc;
}
