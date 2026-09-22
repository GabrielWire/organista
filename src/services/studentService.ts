import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, firebaseConfig } from '../config/firebase';
import type { UsuarioDoc, HinoProgressoDoc, StatusProgresso, InstrumentoOficial } from '../types/auth';
import { INSTRUMENTO_PADRAO } from '../types/auth';
import { HINOS_DATA } from '../data/hinosData';

// Map of hymn number to its Fase (1 to 5)
const HINO_FASE_MAP: Record<number, number> = {};
HINOS_DATA.forEach((h) => {
  HINO_FASE_MAP[h.numero] = h.faseDificuldade;
});

/**
 * Lists all students/alunas with efficient aggregated fields in the user document.
 * Cost: only 1 read per student document!
 */
export async function listStudents(): Promise<UsuarioDoc[]> {
  const colRef = collection(db, 'users');
  const snap = await getDocs(colRef);
  const students: UsuarioDoc[] = [];

  snap.forEach((d) => {
    const data = d.data() as UsuarioDoc;
    if (data.role === 'aluna' || data.role === 'aluno') {
      students.push({ ...data, uid: d.id });
    }
  });

  return students.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Retrieves a single student's profile.
 */
export async function getStudentById(uid: string): Promise<UsuarioDoc | null> {
  const d = await getDoc(doc(db, 'users', uid));
  if (!d.exists()) return null;
  return { ...(d.data() as UsuarioDoc), uid: d.id };
}

/**
 * Updates editable fields of student profile (allowed for the student herself).
 */
export async function updateStudentProfile(
  uid: string,
  fields: { name: string; phone: string; instrument?: InstrumentoOficial }
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    name: fields.name.trim(),
    phone: fields.phone.trim(),
    instrument: fields.instrument || INSTRUMENTO_PADRAO,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Assigns or updates the designated instructor for a student.
 */
export async function assignStudentInstructor(
  studentUid: string,
  instrutor: { id: string; name: string; email: string } | null
): Promise<void> {
  const userRef = doc(db, 'users', studentUid);
  await updateDoc(userRef, {
    instrutorId: instrutor ? instrutor.id : null,
    instrutorNome: instrutor ? instrutor.name : null,
    instrutorEmail: instrutor ? instrutor.email : null,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Registers a new student through Firebase Authentication and creates their Firestore record.
 * Uses a secondary app instance so the currently logged-in Admin is NOT signed out!
 */
export async function createStudentByAdmin(studentData: {
  name: string;
  email: string;
  phone: string;
  instrument?: InstrumentoOficial;
  initialPassword: string;
  instrutorId?: string;
  instrutorNome?: string;
  instrutorEmail?: string;
}): Promise<UsuarioDoc> {
  // Use a secondary App instance to isolate the new user creation session
  const secondaryApp = initializeApp(firebaseConfig, `createStudent_${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      studentData.email.trim(),
      studentData.initialPassword
    );
    const newUid = cred.user.uid;

    await signOut(secondaryAuth);
    await deleteApp(secondaryApp);

    const newStudentDoc: UsuarioDoc = {
      uid: newUid,
      name: studentData.name.trim(),
      email: studentData.email.trim().toLowerCase(),
      phone: studentData.phone.trim(),
      instrument: studentData.instrument || INSTRUMENTO_PADRAO,
      role: 'aluna',
      instrutorId: studentData.instrutorId || undefined,
      instrutorNome: studentData.instrutorNome || undefined,
      instrutorEmail: studentData.instrutorEmail || undefined,
      totalHinos: 480,
      hinosConcluidos: 0,
      hinosEmProgresso: 0,
      progressoGeral: 0,
      faseHinosAtual: 1,
      hinosConcluidosFase1: 0,
      hinosConcluidosFase2: 0,
      hinosConcluidosFase3: 0,
      hinosConcluidosFase4: 0,
      hinosConcluidosFase5: 0,
      metodoNome: 'Método de Estudos para Órgão Eletrônico CCB',
      metodoVolume: 1,
      metodoPosicao: 'Vol. 1 - Lição 1',
      metodoProgresso: 0,
      metodoEstagioApto: 'Iniciante',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', newUid), newStudentDoc);
    return newStudentDoc;
  } catch (err: any) {
    try {
      await deleteApp(secondaryApp);
    } catch {}
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      throw new Error('Já existe uma usuária cadastrada com este e-mail.');
    } else if (code === 'auth/weak-password') {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    } else if (code === 'auth/invalid-email') {
      throw new Error('E-mail em formato inválido.');
    }
    throw new Error(err?.message || 'Falha ao cadastrar a aluna.');
  }
}

/**
 * Retrieves the progress of all registered hymns for a given student.
 */
export async function getStudentProgressMap(studentUid: string): Promise<Record<number, HinoProgressoDoc>> {
  const colRef = collection(db, 'students', studentUid, 'progress');
  const snap = await getDocs(colRef);
  const map: Record<number, HinoProgressoDoc> = {};

  snap.forEach((d) => {
    const data = d.data() as HinoProgressoDoc;
    map[data.hinoId] = data;
  });

  return map;
}

/**
 * Updates the progress of a specific hymn for a student and updates the aggregated
 * summary on `users/{studentUid}`, including Phase distribution.
 */
export async function updateHymnProgress(
  studentUid: string,
  hinoId: number,
  hinoName: string,
  status: StatusProgresso,
  progress: number,
  allHymnsMap: Record<number, HinoProgressoDoc>,
  observacoes?: string,
  details?: { maoDireita?: boolean; maoEsquerda?: boolean; pedaleira?: boolean }
): Promise<{
  hinosConcluidos: number;
  hinosEmProgresso: number;
  progressoGeral: number;
  faseHinosAtual: number;
  hinosConcluidosFase1: number;
  hinosConcluidosFase2: number;
  hinosConcluidosFase3: number;
  hinosConcluidosFase4: number;
  hinosConcluidosFase5: number;
  faseStats: { f1: number; f2: number; f3: number; f4: number; f5: number };
}> {
  const hymnRef = doc(db, 'students', studentUid, 'progress', String(hinoId));
  const fase = HINO_FASE_MAP[hinoId] || 1;

  const newDoc: HinoProgressoDoc = {
    hinoId,
    name: hinoName,
    faseDificuldade: fase,
    status,
    progress: Math.min(100, Math.max(0, Math.round(progress))),
    maoDireita: details?.maoDireita !== undefined ? details.maoDireita : true,
    maoEsquerda: details?.maoEsquerda !== undefined ? details.maoEsquerda : true,
    pedaleira: details?.pedaleira !== undefined ? details.pedaleira : true,
    updatedAt: serverTimestamp(),
    observacoes: observacoes || '',
  };

  await setDoc(hymnRef, newDoc, { merge: true });

  // Update in-memory map to recalculate student aggregate metrics immediately
  const updatedMap = {
    ...allHymnsMap,
    [hinoId]: newDoc,
  };

  const totalHinos = 480;
  let concluidos = 0;
  let emProgresso = 0;
  let f1Done = 0, f2Done = 0, f3Done = 0, f4Done = 0, f5Done = 0;

  Object.values(updatedMap).forEach((h) => {
    const isDone = h.status === 'Concluído' || h.progress === 100;
    const isPartial = h.status === 'Em progresso' || h.status === 'Em aprendizado' || h.progress > 0;
    const hFase = HINO_FASE_MAP[h.hinoId] || h.faseDificuldade || 1;

    if (isDone) {
      concluidos++;
      if (hFase === 1) f1Done++;
      else if (hFase === 2) f2Done++;
      else if (hFase === 3) f3Done++;
      else if (hFase === 4) f4Done++;
      else if (hFase === 5) f5Done++;
    } else if (isPartial) {
      emProgresso++;
    }
  });

  const progressoGeral = Math.round((concluidos / totalHinos) * 100);

  // Determine current active phase for the student
  let faseAtual = 1;
  if (f1Done >= 60) faseAtual = 2;
  if (f1Done >= 66 && f2Done >= 85) faseAtual = 3;
  if (f2Done >= 94 && f3Done >= 110) faseAtual = 4;
  if (f3Done >= 123 && f4Done >= 95) faseAtual = 5;

  // Denormalized update on user doc for instant zero-cost dashboard loading!
  const userRef = doc(db, 'users', studentUid);
  await updateDoc(userRef, {
    hinosConcluidos: concluidos,
    hinosEmProgresso: emProgresso,
    progressoGeral,
    faseHinosAtual: faseAtual,
    hinosConcluidosFase1: f1Done,
    hinosConcluidosFase2: f2Done,
    hinosConcluidosFase3: f3Done,
    hinosConcluidosFase4: f4Done,
    hinosConcluidosFase5: f5Done,
    updatedAt: serverTimestamp(),
  });

  return {
    hinosConcluidos: concluidos,
    hinosEmProgresso: emProgresso,
    progressoGeral,
    faseHinosAtual: faseAtual,
    hinosConcluidosFase1: f1Done,
    hinosConcluidosFase2: f2Done,
    hinosConcluidosFase3: f3Done,
    hinosConcluidosFase4: f4Done,
    hinosConcluidosFase5: f5Done,
    faseStats: { f1: f1Done, f2: f2Done, f3: f3Done, f4: f4Done, f5: f5Done },
  };
}
