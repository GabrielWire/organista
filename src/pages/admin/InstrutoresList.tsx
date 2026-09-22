import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  GraduationCap,
  ShieldCheck,
  Music,
  BookOpen,
} from 'lucide-react';
import {
  listTeachers,
  createTeacherByAdmin,
  deleteTeacherByAdmin,
} from '../../services/teacherService';
import type { UsuarioDoc } from '../../types/auth';

export const InstrutoresList: React.FC = () => {
  const [instructors, setInstructors] = useState<UsuarioDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  // Modal: Nova Instrutora
  const [modalOpen, setModalOpen] = useState(false);
  const [cadastrando, setCadastrando] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // Form: Nova Instrutora
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [novaSenha, setNovaSenha] = useState('ccb123456');

  // Feedback geral
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const data = await listTeachers();
      setInstructors(data);
    } catch (err: any) {
      console.error('Falha ao listar instrutoras:', err);
      setFeedback({ type: 'error', text: 'Falha ao carregar lista de instrutoras.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleCadastrarInstrutora = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!novoNome.trim() || !novoEmail.trim() || !novaSenha.trim()) {
      setModalError('Preencha os campos obrigatórios (Nome, E-mail e Senha).');
      return;
    }

    if (novaSenha.length < 6) {
      setModalError('A senha inicial deve ter no mínimo 6 caracteres.');
      return;
    }

    setCadastrando(true);
    try {
      await createTeacherByAdmin({
        name: novoNome.trim(),
        email: novoEmail.trim(),
        phone: novoTelefone.trim(),
        initialPassword: novaSenha,
      });

      setModalSuccess(`Instrutora ${novoNome} cadastrada com sucesso!`);
      setNovoNome('');
      setNovoEmail('');
      setNovoTelefone('');
      setNovaSenha('ccb123456');

      await fetchInstructors();

      setTimeout(() => {
        setModalSuccess('');
        setModalOpen(false);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setModalError('Este e-mail já está cadastrado no sistema.');
      } else if (err.code === 'auth/invalid-email') {
        setModalError('Formato de e-mail inválido.');
      } else {
        setModalError(err.message || 'Falha ao cadastrar instrutora.');
      }
    } finally {
      setCadastrando(false);
    }
  };

  const handleDeleteInstructor = async (instructor: UsuarioDoc) => {
    if (!confirm(`Tem certeza que deseja remover a instrutora "${instructor.name}"?`)) return;

    try {
      await deleteTeacherByAdmin(instructor.uid);
      setFeedback({ type: 'success', text: `Instrutora "${instructor.name}" removida com sucesso.` });
      await fetchInstructors();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: 'error', text: 'Erro ao remover instrutora: ' + (err?.message || 'Erro') });
    }
  };

  const instrutoresFiltrados = useMemo(() => {
    return instructors.filter((inst) => {
      if (!busca.trim()) return true;
      const q = busca.toLowerCase();
      return (
        inst.name?.toLowerCase().includes(q) ||
        inst.email?.toLowerCase().includes(q) ||
        inst.phone?.includes(q)
      );
    });
  }, [instructors, busca]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1 uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              Apenas Administradores
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-purple-700 dark:text-purple-400" />
            Gestão de Instrutoras de Órgão
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cadastre e gerencie a equipe de instrutoras de órgão responsáveis pelo acompanhamento do Método (Vol. 1 ao 4), MSA e Hinário 5.
          </p>
        </div>

        <button
          onClick={() => {
            setModalError('');
            setModalSuccess('');
            setModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Instrutora</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar instrutora por nome, e-mail ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Instructors Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-700 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Carregando lista de instrutoras...</p>
          </div>
        ) : instrutoresFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4 sm:px-6">Instrutora</th>
                  <th className="py-3.5 px-4">Contato</th>
                  <th className="py-3.5 px-4">Especialidade / Instrumento</th>
                  <th className="py-3.5 px-4">Perfil</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {instrutoresFiltrados.map((teacher) => (
                  <tr
                    key={teacher.uid}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {teacher.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                            {teacher.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            {teacher.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {teacher.phone ? (
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{teacher.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Não informado</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                          <Music className="w-3 h-3 shrink-0 text-purple-600" />
                          <span>Órgão Eletrônico (Dó)</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          <BookOpen className="w-2.5 h-2.5" />
                          Vol. 1 ao 4 &bull; MSA
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300">
                        <GraduationCap className="w-3 h-3" />
                        Instrutora
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteInstructor(teacher)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Remover Instrutora"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhuma instrutora encontrada</p>
            <p className="text-xs text-slate-400 mt-1">
              {busca
                ? 'Tente ajustar os termos de busca.'
                : 'Clique no botão acima para cadastrar a primeira instrutora de órgão.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal: Cadastrar Nova Instrutora */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-scaleIn">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Nova Instrutora</h3>
                  <p className="text-[11px] text-slate-400">Acesso pedagógico ao Portal das Organistas CCB</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCadastrarInstrutora} className="p-5 space-y-4 text-xs sm:text-sm">
              {modalError && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {modalSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{modalSuccess}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo da Instrutora *
                  </label>
                  <input
                    type="text"
                    required
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    placeholder="Ex: Irmã Maria"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail de Acesso (Login) *
                  </label>
                  <input
                    type="email"
                    required
                    value={novoEmail}
                    onChange={(e) => setNovoEmail(e.target.value)}
                    placeholder="instrutora@exemplo.com"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Telefone / WhatsApp (opcional)
                    </label>
                    <input
                      type="tel"
                      value={novoTelefone}
                      onChange={(e) => setNovoTelefone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Senha Inicial de Acesso *
                    </label>
                    <input
                      type="text"
                      required
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      placeholder="Mínimo 6 dígitos"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Instrumento Fixo */}
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 flex items-center gap-2.5">
                  <Music className="w-5 h-5 text-purple-700 dark:text-purple-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Instrumento: Órgão Eletrônico (Dó)
                    </span>
                    <span className="text-[11px] text-purple-700 dark:text-purple-300 block">
                      Habilitada para lecionar Método Volumes 1 ao 4, Hinário 5 e MSA.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cadastrando}
                  className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  {cadastrando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Criar Instrutora</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
