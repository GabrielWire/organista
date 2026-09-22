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
  MetodoCadastradoDoc,
} from '../types/metodo';

/**
 * Standard default catalog of methods available for CCB organists.
 * Includes the core Official CCB Method (Vol. 1 ao 4) and standard supplementary methods
 * (Burgmüller, Hanon, Czerny, Pozzoli, Pedaleira, Beyer).
 */
export const DEFAULT_METHODS_CATALOG: MetodoCadastradoDoc[] = [
  {
    id: 'metodo_oficial_orgao_ccb',
    nome: 'Método de Estudos para Órgão Eletrônico CCB',
    subtitulo: 'Volumes 1 ao 4 - Grade Oficial para Organistas da CCB',
    autor: 'Congregação Cristã no Brasil',
    categoria: 'Oficial CCB',
    descricao:
      'Método base e obrigatório para os marcos eclesiásticos da CCB: Iniciação, Reunião de Jovens, Culto Oficial e Oficialização.',
    tipoDivisao: 'volumes',
    totalItensEstimado: 4,
    estagioSugerido: 'Oficialização',
    isOficial: true,
  },
  {
    id: 'burgmuller_op100',
    nome: 'Burgmüller Op. 100',
    subtitulo: '25 Estudos Fáceis e Progressivos',
    autor: 'Friedrich Burgmüller',
    categoria: 'Técnica e Dedilhado',
    descricao:
      'Estudos melódicos fundamentais para desenvolvimento de fraseado, dinâmica e agilidade digital (ex: A Candura, Pastoral, Inquietude).',
    tipoDivisao: 'licoes',
    totalItensEstimado: 25,
    estagioSugerido: 'RJM / Ensaio',
    isOficial: false,
  },
  {
    id: 'hanon_virtuoso',
    nome: 'C. L. Hanon - O Pianista Virtuoso',
    subtitulo: '60 Exercícios Preparatórios de Agilidade e Dedos Iguais',
    autor: 'Charles-Louis Hanon',
    categoria: 'Técnica e Dedilhado',
    descricao:
      'Exercícios essenciais de aquecimento diário, independência do 4º e 5º dedos, firmeza e articulação precisa das mãos.',
    tipoDivisao: 'licoes',
    totalItensEstimado: 60,
    estagioSugerido: 'Livre / Todos os Níveis',
    isOficial: false,
  },
  {
    id: 'czerny_op599',
    nome: 'Czerny Op. 599',
    subtitulo: 'Primeiro Mestre de Piano / Teclado',
    autor: 'Carl Czerny',
    categoria: 'Técnica e Dedilhado',
    descricao:
      'Exercícios clássicos progressivos de leitura simultânea em claves de Sol e Fá, escalas, acordes e precisão métrica.',
    tipoDivisao: 'licoes',
    totalItensEstimado: 100,
    estagioSugerido: 'Iniciante',
    isOficial: false,
  },
  {
    id: 'pedaleira_florencio',
    nome: 'Estudos de Pedaleira para Órgão',
    subtitulo: 'Independência dos Pés, Ponta e Calcanhar',
    autor: 'Repertório Sacro para Órgão',
    categoria: 'Pedaleira',
    descricao:
      'Exercícios práticos para domínio do pedalier de órgão: ponta, calcanhar, substituição de pés e execução de baixos contínuos.',
    tipoDivisao: 'licoes',
    totalItensEstimado: 20,
    estagioSugerido: 'RJM / Ensaio',
    isOficial: false,
  },
  {
    id: 'pozzoli_solfejo',
    nome: 'Pozzoli - Guia Teórico-Prático',
    subtitulo: 'Ditados e Solfejos Rítmicos e Melódicos',
    autor: 'Ettore Pozzoli',
    categoria: 'Teoria e Solfejo',
    descricao:
      'Desenvolvimento do ritmo, percepção auditiva e solfejo em compassos simples e compostos, reforçando os estudos do MSA.',
    tipoDivisao: 'licoes',
    totalItensEstimado: 40,
    estagioSugerido: 'Iniciante',
    isOficial: false,
  },
  {
    id: 'beyer_op101',
    nome: 'F. Beyer Op. 101',
    subtitulo: 'Escola Preliminar para Teclado e Órgão',
    autor: 'Ferdinand Beyer',
    categoria: 'Técnica e Dedilhado',
    descricao:
      'Método tradicional com lições melódicas elementares para firmeza de toque e primeiras noções de acompanhamento.',
    tipoDivisao: 'licoes',
    totalItensEstimado: 106,
    estagioSugerido: 'Iniciante',
    isOficial: false,
  },
];

/**
 * Lists all available methods in the system.
 * Merges Firestore custom methods (`custom_methods` collection) with default catalog.
 * Custom methods saved in Firestore take priority.
 */
export async function listAllAvailableMethods(): Promise<MetodoCadastradoDoc[]> {
  try {
    const colRef = collection(db, 'custom_methods');
    const snap = await getDocs(colRef);

    const firestoreMethods: MetodoCadastradoDoc[] = [];
    snap.forEach((d) => {
      const data = d.data() as MetodoCadastradoDoc;
      firestoreMethods.push({ ...data, id: d.id });
    });

    // Map by ID
    const mergedMap = new Map<string, MetodoCadastradoDoc>();

    // Add defaults first
    DEFAULT_METHODS_CATALOG.forEach((m) => {
      mergedMap.set(m.id, m);
    });

    // Merge / overwrite with Firestore
    firestoreMethods.forEach((m) => {
      mergedMap.set(m.id, m);
    });

    const allMethods = Array.from(mergedMap.values());

    // Sort: Official CCB first, then custom/supplementary by name
    return allMethods.sort((a, b) => {
      if (a.isOficial && !b.isOficial) return -1;
      if (!a.isOficial && b.isOficial) return 1;
      return a.nome.localeCompare(b.nome);
    });
  } catch (err) {
    console.warn('Falha ao carregar custom_methods do Firestore, usando catálogo padrão:', err);
    return DEFAULT_METHODS_CATALOG;
  }
}

/**
 * Registers a new custom method created by an Examinadora, Instrutora or Admin.
 */
export async function createCustomMethod(
  methodData: Omit<MetodoCadastradoDoc, 'id'>,
  customId?: string
): Promise<MetodoCadastradoDoc> {
  const cleanId =
    customId ||
    methodData.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 40) + `_${Date.now().toString().slice(-4)}`;

  const docRef = doc(db, 'custom_methods', cleanId);
  const newDoc: MetodoCadastradoDoc = {
    ...methodData,
    id: cleanId,
    isOficial: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(docRef, newDoc);
  return newDoc;
}

/**
 * Updates an existing custom method.
 */
export async function updateCustomMethod(
  methodId: string,
  methodData: Partial<MetodoCadastradoDoc>
): Promise<void> {
  const docRef = doc(db, 'custom_methods', methodId);
  await setDoc(
    docRef,
    {
      ...methodData,
      id: methodId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Deletes a custom method.
 */
export async function deleteCustomMethod(methodId: string): Promise<void> {
  const docRef = doc(db, 'custom_methods', methodId);
  await deleteDoc(docRef);
}

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
 * Retrieves the current organ method progress summary for a student.
 */
export async function getStudentMethodProgress(studentId: string): Promise<AlunoMetodoProgressoDoc | null> {
  const docRef = doc(db, 'students', studentId, 'method_progress', 'current');
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as AlunoMetodoProgressoDoc;
}

/**
 * Lists all lessons registered for a student's organ methods.
 * Can be optionally filtered by metodoId.
 * Ordered by volume asc, page asc, then lesson number asc.
 */
export async function listStudentMethodLessons(
  studentId: string,
  metodoIdFilter?: string
): Promise<MetodoLicaoDoc[]> {
  const colRef = collection(db, 'students', studentId, 'method_progress', 'current', 'lessons');
  const snap = await getDocs(colRef);
  let lessons: MetodoLicaoDoc[] = [];

  snap.forEach((d) => {
    const data = d.data() as MetodoLicaoDoc;
    lessons.push({ ...data, id: d.id });
  });

  if (metodoIdFilter && metodoIdFilter !== 'todos') {
    lessons = lessons.filter((l) => l.metodoId === metodoIdFilter);
  }

  return lessons.sort((a, b) => {
    const volA = a.volume || 1;
    const volB = b.volume || 1;
    if (volA !== volB) return volA - volB;
    if (a.numeroPagina !== b.numeroPagina) return a.numeroPagina - b.numeroPagina;
    return a.numeroLicao - b.numeroLicao;
  });
}

/**
 * Saves or updates a specific method lesson.
 * Supports multi-method keys (e.g. burgmuller_op100_v1_p5_l3 or v1_pag_15_lic_3).
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

  const cleanMetodoKey = (lessonData.metodoId || 'metodo_oficial_orgao_ccb').replace(/[^a-zA-Z0-9_-]/g, '_');
  const lessonId = lessonData.id || `${cleanMetodoKey}_v${vol}_pag_${pag}_lic_${lic}`;

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

    if (target.metodoId === 'metodo_oficial_orgao_ccb' || !target.metodoId) {
      posicaoString = `Vol. ${latestVol} - Página ${latestPag}, Lição ${latestLic}`;
    } else {
      posicaoString = `${target.metodoNome} - Pág. ${latestPag}, Lição ${latestLic}`;
    }
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
