import React, { useState } from 'react';
import { UserCheck, Mail, Phone, Music, Save, CheckCircle2, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateStudentProfile } from '../../services/studentService';

export const AlunoPerfil: React.FC = () => {
  const { userData, currentUser, refreshUserData } = useAuth();

  const [nome, setNome] = useState(userData?.name || '');
  const [telefone, setTelefone] = useState(userData?.phone || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setError('');
    setSuccess('');

    if (!nome.trim()) {
      setError('O nome não pode estar vazio.');
      return;
    }

    setSaving(true);
    try {
      await updateStudentProfile(currentUser.uid, {
        name: nome,
        phone: telefone,
        instrument: 'Órgão Eletrônico (Dó)',
      });
      await refreshUserData();
      setSuccess('Dados cadastrais atualizados com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err?.message || 'Falha ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Meu Perfil de Aluna</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mantenha seus dados atualizados para contato com sua instrutora e a equipe pedagógica
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              E-mail de Acesso
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={userData?.email || ''}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">O e-mail é o seu identificador de login e não pode ser alterado diretamente.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Telefone / WhatsApp
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Instrumento Fixo: Órgão Eletrônico */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Instrumento Oficial de Estudo
            </label>
            <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 space-y-2">
              <div className="flex items-center gap-2.5">
                <Music className="w-5 h-5 text-purple-700 dark:text-purple-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Órgão Eletrônico (Dó)
                  </span>
                  <span className="text-[11px] text-purple-700 dark:text-purple-300 block">
                    Método de Estudos para Órgão Eletrônico CCB (Volumes 1 ao 4)
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-purple-200/60 dark:border-purple-800/40 grid grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                <div>Afinação: <strong className="text-purple-700 dark:text-purple-300">Dó (Real)</strong></div>
                <div>Hinário: <strong className="text-purple-700 dark:text-purple-300">Hinário 5</strong></div>
                <div>Claves: <strong className="text-purple-700 dark:text-purple-300">Sol, Fá e Ped.</strong></div>
              </div>
            </div>
          </div>

          {/* Instrutora Designada */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Instrutora Designada
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                value={
                  userData?.instrutorNome
                    ? `${userData.instrutorNome}${userData.instrutorEmail ? ` • ${userData.instrutorEmail}` : ''}`
                    : 'Nenhuma instrutora designada no momento'
                }
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-600 dark:text-slate-300 cursor-not-allowed font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              A designação da instrutora é realizada pela administração ou equipe de ensino.
            </p>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
