import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Phone,
  AlertCircle,
  X,
  Loader2,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { listStudents, createStudentByAdmin } from '../../services/studentService';
import { listTeachers } from '../../services/teacherService';
import type { UsuarioDoc } from '../../types/auth';
import { INSTRUMENTO_PADRAO } from '../../types/auth';

export const AlunosList: React.FC = () => {
  const { currentUser, userData, role } = useAuth();
  const isInstrutora = role === 'professor' || role === 'instrutor' || role === 'instrutora';

  const [searchParams, setSearchParams] = useSearchParams();

  const [students, setStudents] = useState<UsuarioDoc[]>([]);
  const [instructors, setInstructors] = useState<UsuarioDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tab: 'meus_alunos' vs 'todos'
  const [abaAtiva, setAbaAtiva] = useState<'meus_alunos' | 'todos'>(() => {
    return isInstrutora ? 'meus_alunos' : 'todos';
  });

  const [busca, setBusca] = useState('');
  const [filtroFase, setFiltroFase] = useState('todas');
  const [filtroVolume, setFiltroVolume] = useState('todos');
  const [filtroInstrutor, setFiltroInstrutor] = useState('todos');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'progresso_desc' | 'progresso_asc'>('nome');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [cadastrando, setCadastrando] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // Form State
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [novoInstrutorId, setNovoInstrutorId] = useState('');
  const [novaSenha, setNovaSenha] = useState('ccb123456');

  // Auto-open modal if ?novo=1 in URL
  useEffect(() => {
    if (searchParams.get('novo') === '1') {
      abrirModalNovoAluno();
      searchParams.delete('novo');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  const fetchStudents = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [studentsData, instructorsData] = await Promise.all([
        listStudents(),
        listTeachers(),
      ]);
      setStudents(studentsData);
      setInstructors(instructorsData);
    } catch (err: any) {
      console.error('Falha ao listar alunas e instrutoras:', err);
      setErrorMessage('Não foi possível carregar a lista de alunas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const abrirModalNovoAluno = () => {
    setNovoNome('');
    setNovoEmail('');
    setNovoTelefone('');
    setNovaSenha('ccb123456');
    setNovoInstrutorId(isInstrutora ? currentUser?.uid || '' : '');
    setModalError('');
    setModalSuccess('');
    setModalOpen(true);
  };

  const handleCadastrarAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setCadastrando(true);

    try {
      const selectedInstructor = instructors.find((inst) => inst.uid === novoInstrutorId);

      await createStudentByAdmin({
        name: novoNome,
        email: novoEmail,
        phone: novoTelefone,
        instrument: INSTRUMENTO_PADRAO,
        initialPassword: novaSenha,
        instrutorId: selectedInstructor ? selectedInstructor.uid : undefined,
        instrutorNome: selectedInstructor ? selectedInstructor.name : undefined,
        instrutorEmail: selectedInstructor ? selectedInstructor.email : undefined,
      });

      setModalSuccess(`Aluna ${novoNome} cadastrada com sucesso!`);
      await fetchStudents();

      setTimeout(() => {
        setModalOpen(false);
      }, 1200);
    } catch (err: any) {
      setModalError(err.message || 'Falha ao cadastrar a aluna.');
    } finally {
      setCadastrando(false);
    }
  };

  // Minhas alunas designadas
  const meusAlunosList = useMemo(() => {
    if (!currentUser) return [];
    const myUid = currentUser.uid;
    const myEmail = (currentUser.email || '').toLowerCase();
    const docEmail = (userData?.email || '').toLowerCase();

    return students.filter((s) => {
      const matchId = s.instrutorId && (s.instrutorId === myUid || s.instrutorId === userData?.uid);
      const matchEmail =
        s.instrutorEmail &&
        (s.instrutorEmail.toLowerCase() === myEmail || (docEmail && s.instrutorEmail.toLowerCase() === docEmail));
      return Boolean(matchId || matchEmail);
    });
  }, [students, currentUser, userData]);

  const listaBase = abaAtiva === 'meus_alunos' ? meusAlunosList : students;

  // Filtragem e ordenação
  const alunosFiltrados = useMemo(() => {
    let list = [...listaBase];

    // Busca textual
    if (busca.trim()) {
      const q = busca.toLowerCase().trim();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.phone?.includes(q)
      );
    }

    // Filtro por Fase Atual do Hinário
    if (filtroFase !== 'todas') {
      const f = Number(filtroFase);
      list = list.filter((s) => (s.faseHinosAtual || 1) === f);
    }

    // Filtro por Volume do Método
    if (filtroVolume !== 'todos') {
      const v = Number(filtroVolume);
      list = list.filter((s) => (s.metodoVolume || 1) === v);
    }

    // Filtro por Instrutora
    if (abaAtiva === 'todos' && filtroInstrutor !== 'todos') {
      if (filtroInstrutor === 'sem_instrutor') {
        list = list.filter((s) => !s.instrutorId && !s.instrutorNome);
      } else {
        list = list.filter((s) => s.instrutorId === filtroInstrutor);
      }
    }

    // Ordenação
    list.sort((a, b) => {
      if (ordenacao === 'nome') return a.name.localeCompare(b.name);
      if (ordenacao === 'progresso_desc') return (b.progressoGeral || 0) - (a.progressoGeral || 0);
      if (ordenacao === 'progresso_asc') return (a.progressoGeral || 0) - (b.progressoGeral || 0);
      return 0;
    });

    return list;
  }, [listaBase, busca, filtroFase, filtroVolume, filtroInstrutor, ordenacao, abaAtiva]);

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">Aviso do Sistema</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            Alunas Cadastradas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Acompanhe o desenvolvimento pedagógico das candidatas a organista (Hinário 5, Método Volumes 1 a 4 e MSA).
          </p>
        </div>

        <button
          onClick={abrirModalNovoAluno}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-purple-600/30 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Aluna</span>
        </button>
      </div>

      {/* Tabs de Seleção: Minhas Alunas vs Todas as Alunas */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setAbaAtiva('meus_alunos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            abaAtiva === 'meus_alunos'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Minhas Alunas Designadas ({meusAlunosList.length})</span>
        </button>

        <button
          onClick={() => setAbaAtiva('todos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            abaAtiva === 'todos'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Todas as Alunas ({students.length})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar aluna por nome ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-2xs"
          />
        </div>

        {/* Filter by Fase do Hinário */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
          <select
            value={filtroFase}
            onChange={(e) => setFiltroFase(e.target.value)}
            className="w-full md:w-44 px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer font-medium"
          >
            <option value="todas">Todas as Fases</option>
            <option value="1">Fase 1 (Iniciação)</option>
            <option value="2">Fase 2</option>
            <option value="3">Fase 3</option>
            <option value="4">Fase 4</option>
            <option value="5">Fase 5 (Avançada)</option>
          </select>

          {/* Filter by Volume do Método */}
          <select
            value={filtroVolume}
            onChange={(e) => setFiltroVolume(e.target.value)}
            className="w-full md:w-44 px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer font-medium"
          >
            <option value="todos">Todos os Volumes</option>
            <option value="1">Volume 1 (Iniciação)</option>
            <option value="2">Volume 2 (Pedaleira/RJM)</option>
            <option value="3">Volume 3 (Culto Oficial)</option>
            <option value="4">Volume 4 (Oficialização)</option>
          </select>

          {/* Filter by Instructor (only on 'todos' tab) */}
          {abaAtiva === 'todos' && (
            <select
              value={filtroInstrutor}
              onChange={(e) => setFiltroInstrutor(e.target.value)}
              className="w-full md:w-48 px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer font-medium"
            >
              <option value="todos">Todas as instrutoras</option>
              <option value="sem_instrutor">Sem instrutora designada</option>
              {instructors.map((inst) => (
                <option key={inst.uid} value={inst.uid}>
                  {inst.name}
                </option>
              ))}
            </select>
          )}

          {/* Sort */}
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value as any)}
            className="w-full md:w-40 px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer font-medium"
          >
            <option value="nome">Ordem Alfabética</option>
            <option value="progresso_desc">Maior Progresso</option>
            <option value="progresso_asc">Menor Progresso</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Carregando lista de alunas...</p>
          </div>
        ) : alunosFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4 sm:px-6">Aluna</th>
                  <th className="py-3.5 px-4">Fase do Hinário</th>
                  <th className="py-3.5 px-4">Método de Órgão (Vol. 1-4)</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Instrutora Designada</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Contato</th>
                  <th className="py-3.5 px-4 text-center">Progresso Hinário</th>
                  <th className="py-3.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {alunosFiltrados.map((aluno) => {
                  const isMinhaAluna =
                    currentUser &&
                    (aluno.instrutorId === currentUser.uid ||
                      (aluno.instrutorEmail &&
                        aluno.instrutorEmail.toLowerCase() === currentUser.email?.toLowerCase()));

                  return (
                    <tr key={aluno.uid} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {aluno.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                                {aluno.name}
                              </span>
                              {isMinhaAluna && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                  Sua Aluna
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                              {aluno.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300">
                          Fase {aluno.faseHinosAtual || 1}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              Vol. {aluno.metodoVolume || 1}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[140px] font-medium">
                              {aluno.metodoPosicao || 'Lição 1'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            {aluno.metodoEstagioApto || 'Iniciante'} ({aluno.metodoProgresso || 0}%)
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 hidden lg:table-cell">
                        {aluno.instrutorNome ? (
                          <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                            {aluno.instrutorNome}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Não designada</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 hidden md:table-cell">
                        {aluno.phone ? (
                          <a
                            href={`https://wa.me/55${aluno.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline text-xs flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {aluno.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                            {aluno.hinosConcluidos || 0} / 480
                          </span>
                          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                            {aluno.progressoGeral || 0}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/admin/alunos/${aluno.uid}`}
                          className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <span>Ficha da Aluna</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Nenhuma aluna encontrada</p>
            <p className="text-xs text-slate-400 mt-1">Tente ajustar os filtros ou cadastrar uma nova aluna.</p>
          </div>
        )}
      </div>

      {/* Modal: Cadastrar Nova Aluna */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Cadastrar Nova Aluna (Órgão)
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                {modalError}
              </div>
            )}
            {modalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs">
                {modalSuccess}
              </div>
            )}

            <form onSubmit={handleCadastrarAluno} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo:
                </label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Sara de Oliveira"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail de Acesso:
                  </label>
                  <input
                    type="email"
                    required
                    value={novoEmail}
                    onChange={(e) => setNovoEmail(e.target.value)}
                    placeholder="aluna@exemplo.com"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp / Telefone:
                  </label>
                  <input
                    type="tel"
                    value={novoTelefone}
                    onChange={(e) => setNovoTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instrutora Responsável:
                </label>
                <select
                  value={novoInstrutorId}
                  onChange={(e) => setNovoInstrutorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">-- Sem instrutora designada --</option>
                  {instructors.map((inst) => (
                    <option key={inst.uid} value={inst.uid}>
                      {inst.name} ({inst.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Senha Provisória:
                </label>
                <input
                  type="text"
                  required
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  A aluna poderá alterar sua senha após o primeiro acesso.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cadastrando}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  {cadastrando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Salvar Cadastro</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
