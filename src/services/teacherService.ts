import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, firebaseConfig } from '../config/firebase';
import type { UsuarioDoc } from '../types/auth';
import { INSTRUMENTO_PADRAO } from '../types/auth';

/**
 * Lists all registered instructors in the system (roles: instrutora, instrutor, professor).
 */
export async function listTeachers(): Promise<UsuarioDoc[]> {
  const colRef = collection(db, 'users');
  const snap = await getDocs(colRef);
  const teachers: UsuarioDoc[] = [];

  snap.forEach((d) => {
    const data = d.data() as UsuarioDoc;
    if (data.role === 'instrutora' || data.role === 'instrutor' || data.role === 'professor') {
      teachers.push({
        ...data,
        uid: d.id,
        instrument: data.instrument || INSTRUMENTO_PADRAO,
      });
    }
  });

  return teachers.sort((a, b) => a.name.localeCompare(b.name));
}

export const listInstructors = listTeachers;

/**
 * Creates a new instructor account in Firebase Auth and creates their Firestore record.
 * Uses an isolated secondary app instance to preserve the current admin session.
 */
export async function createTeacherByAdmin(data: {
  name: string;
  email: string;
  phone: string;
  initialPassword: string;
}): Promise<UsuarioDoc> {
  const secondaryApp = initializeApp(firebaseConfig, `createTeacher_${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      data.email.trim(),
      data.initialPassword
    );
    const newUid = cred.user.uid;

    await signOut(secondaryAuth);
    await deleteApp(secondaryApp);

    const newTeacherDoc: UsuarioDoc = {
      uid: newUid,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      instrument: INSTRUMENTO_PADRAO,
      role: 'instrutora',
      totalHinos: 480,
      hinosConcluidos: 0,
      hinosEmProgresso: 0,
      progressoGeral: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', newUid), newTeacherDoc);
    return newTeacherDoc;
  } catch (err: any) {
    try {
      await deleteApp(secondaryApp);
    } catch {}
    throw err;
  }
}

export const createInstructorByAdmin = createTeacherByAdmin;

/**
 * Deletes an instructor's record.
 * Note: Only admins can perform this.
 */
export async function deleteTeacherByAdmin(teacherUid: string): Promise<void> {
  await deleteDoc(doc(db, 'users', teacherUid));
}

export const deleteInstructorByAdmin = deleteTeacherByAdmin;
