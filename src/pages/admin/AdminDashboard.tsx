import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  UserPlus,
  ArrowRight,
  Music,
  Loader2,
  GraduationCap,
  Phone,
  Mail,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { listStudents } from '../../services/studentService';
import type { UsuarioDoc } from '../../types/auth';

export const AdminDashboard: React.FC = () => {
  const { currentUser, userData, role } = useAuth();
  const isAdmin = role === 'admin';
  const isInstrutor = role === 'professor' || role === 'instrutor' || role === 'instrutora';

  const [students, setStudents] = useState<UsuarioDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tab mode: instructors default to 'meus_alunos', admins default to 'geral'
  const [viewMode, setViewMode] = useState<'meus_alunos' | 'geral'>(() => {
    return isInstrutor ? 'meus_alunos' : 'geral';
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const list = await listStudents();
        setStudents(list);
      } catch (err: any) {
        console.error('Falha ao listar alunos no dashboard:', err);
        const code = err?.code || '';
        if (code === 'permission-denied' || String(err).includes('permission')) {
          setErrorMessage(
            'Permissão negada no Firestore. Lembre-se de publicar as regras de segurança atualizadas no Firebase Console com suporte ao perfil "instrutor".'
          );
        } else {
          setErrorMessage('Não foi possível carregar a lista de alunos do banco de dados.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Update viewMode if user role loads after initial render
  useEffect(() => {
    if (isInstrutor && !isAdmin) {
      setViewMode('meus_alunos');
    }
  }, [isInstrutor, isAdmin]);

  // Alunos designados para o instrutor logado (match por uid ou email)
  const meusAlunos = useMemo(() => {
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

  // Estatísticas gerais
  const totalAlunos = students.length;
  const alunosAtivosGeral = students.filter((s) => s.progressoGeral > 0 || s.hinosEmProgresso > 0).length;
  const totalHinosEmProgresso = students.reduce((acc, s) => acc + (s.hinosEmProgresso || 0), 0);
  const totalHinosConcluidos = students.reduce((acc, s) => acc + (s.hinosConcluidos || 0), 0);

  // Estatísticas específicas do instrutor
  const totalMeusAlunos = meusAlunos.length;
  const meusAlunosAtivos = meusAlunos.filter(
    (s) => s.progressoGeral > 0 || (s.metodoProgresso || 0) > 0 || (s.msaGeneralProgress || 0) > 0
  ).length;
  const meusAlunosComMetodo = meusAlunos.filter((s) => (s.metodoProgresso || 0) > 0 || s.metodoNome).length;
  const meusAlunosComMsa = meusAlunos.filter((s) => (s.msaGeneralProgress || 0) > 0).length;

  // Top 5 alunos gerais
  const destaques = useMemo(() => {
    return [...students].sort((a, b) => b.progressoGeral - a.progressoGeral).slice(0, 5);
  }, [students]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Carregando painel de gestão pedagógica...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerta de erro do Firebase se houver */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">Aviso do Sistema</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Banner Principal Customizado */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase font-extrabold tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
              {isInstrutor ? 'Painel da Instrutora &bull; Gestão Pedagógica' : 'Área Administrativa &bull; Gestão Geral'}
            </span>
            {isInstrutor && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                Instrutora de Órgão
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1.5">
            {isInstrutor
              ? `A Paz de Deus, Instrutora ${userData?.name || currentUser?.displayName || currentUser?.email?.split('@')[0]}!`
              : 'Painel das Organistas CCB'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isInstrutor
              ? 'Acompanhe suas alunas designadas e faça a gestão das lições do Método (Vol. 1 ao 4), Fases dos Hinos e MSA.'
              : 'Acompanhe o desenvolvimento de cada candidata a organista no Hinário 5, Volumes 1 ao 4 do Método Oficial e MSA.'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            to="/admin/alunos?novo=1"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Nova Aluna</span>
          </Link>
        </div>
      </div>

      {/* Seletor de Visão (Minhas Alunas vs Visão Geral) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setViewMode('meus_alunos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            viewMode === 'meus_alunos'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Minhas Alunas Designadas ({totalMeusAlunos})</span>
        </button>

        <button
          onClick={() => setViewMode('geral')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            viewMode === 'geral'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Visão Geral das Alunas ({totalAlunos})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODO 1: MEUS ALUNOS DESIGNADOS (VISÃO PRINCIPAL DO INSTRUTOR)            */}
      {/* ========================================================================= */}
      {viewMode === 'meus_alunos' && (
        <div className="space-y-6">
          {/* KPI Cards do Instrutor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Alunos Designados
                </span>
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1 block">
                  {totalMeusAlunos}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Sob sua responsabilidade</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Alunos Ativos
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
                  {meusAlunosAtivos}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Com estudos em andamento</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Aulas de Métodos
                </span>
                <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono mt-1 block">
                  {meusAlunosComMetodo}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Com lições registradas</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Aulas de MSA
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 font-mono mt-1 block">
                  {meusAlunosComMsa}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Fases em estudo</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* LISTA DETALHADA: MEUS ALUNOS DESIGNADOS & GESTÃO DE AULAS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Meus Alunos Designados
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {meusAlunos.length} aluno(s)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Clique diretamente nas ações para lançar lições de Método, avaliar MSA ou registrar hinos.
                </p>
              </div>

              <Link
                to="/admin/alunos"
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1"
              >
                <span>Ver lista completa com filtros</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {meusAlunos.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {meusAlunos.map((aluno) => (
                  <div
                    key={aluno.uid}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-900/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    {/* Dados Básicos do Aluno */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-[240px]">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm shrink-0">
                        {aluno.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {aluno.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                          <Music className="w-3.5 h-3.5 shrink-0" />
                          <span>{aluno.instrument}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {aluno.email}
                          </span>
                          {aluno.phone && (
                            <a
                              href={`https://wa.me/55${aluno.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-emerald-600 hover:underline font-semibold"
                            >
                              <Phone className="w-3 h-3" />
                              {aluno.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progresso nos 3 Pilares Pedagógicos */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-2xl">
                      {/* Método de Instrumento */}
                      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2.5">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            Método
                          </span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                            {aluno.metodoProgresso || 0}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate font-medium">
                          {aluno.metodoPosicao || 'Não iniciado'}
                        </p>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <div
                            className="bg-purple-600 h-full rounded-full transition-all"
                            style={{ width: `${aluno.metodoProgresso || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* MSA */}
                      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2.5">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            MSA
                          </span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                            {aluno.msaGeneralProgress || 0}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate font-medium">
                          {aluno.msaCurrentPhaseName || 'Não iniciado'}
                        </p>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all"
                            style={{ width: `${aluno.msaGeneralProgress || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Hinário 5 */}
                      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2.5">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                            <Music className="w-3 h-3" />
                            Hinário 5
                          </span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                            {aluno.progressoGeral || 0}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate font-medium">
                          {aluno.hinosConcluidos || 0} / 480 concluídos
                        </p>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all"
                            style={{ width: `${aluno.progressoGeral || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* BOTÕES DE GESTÃO DE AULAS */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 justify-center">
                      <Link
                        to={`/admin/alunos/${aluno.uid}`}
                        className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Gerenciar Aulas</span>
                      </Link>

                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/alunos/${aluno.uid}?tab=metodo`}
                          title="Lançar Lições do Método"
                          className="flex-1 px-2 py-1.5 text-center text-[11px] font-bold rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors"
                        >
                          Método
                        </Link>
                        <Link
                          to={`/admin/alunos/${aluno.uid}?tab=msa`}
                          title="Acompanhar Lições do MSA"
                          className="flex-1 px-2 py-1.5 text-center text-[11px] font-bold rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                        >
                          MSA
                        </Link>
                        <Link
                          to={`/admin/alunos/${aluno.uid}?tab=hinos`}
                          title="Acompanhar Hinário"
                          className="flex-1 px-2 py-1.5 text-center text-[11px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          Hinos
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Nenhum aluno designado para você no momento
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
                  Você pode cadastrar novos alunos usando o botão abaixo (você já será pré-selecionado como instrutor), ou solicitar ao Administrador que vincule alunos ao seu perfil.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link
                    to="/admin/alunos?novo=1"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs inline-flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Cadastrar Meu Primeiro Aluno</span>
                  </Link>
                  <button
                    onClick={() => setViewMode('geral')}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Ver Todos os Alunos da Escola
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 2: VISÃO GERAL DA ORQUESTRA (KPIs GLOBAIS E DESTAQUES)               */}
      {/* ========================================================================= */}
      {viewMode === 'geral' && (
        <div className="space-y-6">
          {/* KPI Cards Globais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Total de Alunos
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono mt-1 block">
                  {totalAlunos}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Cadastrados no portal</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Alunos Ativos
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
                  {alunosAtivosGeral}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Com estudos iniciados</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Hinos em Progresso
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 font-mono mt-1 block">
                  {totalHinosEmProgresso}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Em fase de estudo</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Hinos Concluídos
                </span>
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1 block">
                  {totalHinosConcluidos}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Aptos e dominados</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Tabela de Alunos em Destaque */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Alunos em Destaque</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Progresso geral no Hinário 5</p>
              </div>
              <Link
                to="/admin/alunos"
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Ver todos os {totalAlunos} alunos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {destaques.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {destaques.map((aluno) => (
                  <div key={aluno.uid} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
                        {aluno.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                          {aluno.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                          <Music className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          <span>{aluno.instrument}</span>
                          {aluno.instrutorNome && (
                            <>
                              <span>&bull;</span>
                              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                                Instrutor: {aluno.instrutorNome}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
                          {aluno.hinosConcluidos || 0} / 480
                        </span>
                        <span className="text-[10px] text-slate-400 block">hinos concluídos</span>
                      </div>

                      <div className="w-20 sm:w-28">
                        <div className="flex justify-between text-[11px] font-mono font-bold mb-1 text-slate-700 dark:text-slate-300">
                          <span>{aluno.progressoGeral || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all"
                            style={{ width: `${aluno.progressoGeral || 0}%` }}
                          />
                        </div>
                      </div>

                      <Link
                        to={`/admin/alunos/${aluno.uid}`}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        title="Ver detalhes e gerenciar aulas"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                Nenhum aluno cadastrado ainda. Clique em "Cadastrar Novo Aluno" para iniciar.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
