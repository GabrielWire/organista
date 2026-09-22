import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { UsuarioDoc } from '../types/auth';

export async function loginUser(email: string, pass: string): Promise<UsuarioDoc> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const userDocRef = doc(db, 'users', cred.user.uid);
    const snap = await getDoc(userDocRef);

    if (!snap.exists()) {
      throw new Error('Usuário autenticado, mas seu cadastro não foi encontrado no sistema.');
    }

    return snap.data() as UsuarioDoc;
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      throw new Error('E-mail ou senha incorretos. Verifique os dados digitados.');
    } else if (code === 'auth/too-many-requests') {
      throw new Error('Muitas tentativas malsucedidas. Aguarde alguns minutos e tente novamente.');
    } else if (code === 'auth/network-request-failed') {
      throw new Error('Erro de conexão com a internet. Verifique sua rede.');
    } else if (code === 'auth/invalid-email') {
      throw new Error('O formato do e-mail digitado é inválido.');
    }
    throw new Error(err?.message || 'Falha ao realizar login.');
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function resetUserPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/user-not-found') {
      throw new Error('Nenhum usuário cadastrado com este e-mail.');
    } else if (code === 'auth/invalid-email') {
      throw new Error('E-mail inválido.');
    }
    throw new Error(err?.message || 'Não foi possível enviar o e-mail de recuperação.');
  }
}

export async function getUserDoc(uid: string): Promise<UsuarioDoc | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UsuarioDoc;
}
