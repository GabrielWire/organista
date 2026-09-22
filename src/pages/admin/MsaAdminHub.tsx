import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Layers,
  Search,
  Plus,
  ArrowRight,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Music,
  X,
  Check,
} from 'lucide-react';
import { listStudents } from '../../services/studentService';
import {
  listMsaPhases,
  listAllMsaLessons,
  createMsaPhase,
  updateMsaPhase,
  deleteMsaPhase,
  createMsaLesson,
  updateMsaLesson,
  deleteMsaLesson,
  seedInitialMsaPhases,
} from '../../services/msaService';
import { INSTRUMENTOS_CATEGORIZADOS, resolveInstrumento } from '../../utils/instrumentUtils';
import type { UsuarioDoc } from '../../types/auth';
import type { MsaPhaseDoc, MsaLessonDoc } from '../../types/msa';

export const MsaAdminHub: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'acompanhamento' | 'conteudo'>('acompanhamento');

  // Data states
  const [students, setStudents] = useState<UsuarioDoc[]>([]);
  const [phases, setPhases] = useState<MsaPhaseDoc[]>([]);
  const [lessonsByPhase, setLessonsByPhase] = useState<Record<string, MsaLessonDoc[]>>({});
  const [loading, setLoading] = useState(true);

  // Filters for Students Tracking
  const [busca, setBusca] = useState('');
  const [filtroInstrumento, setFiltroInstrumento] = useState('todos');
  const [filtroFase, setFiltroFase] = useState('todos');
  const [filtroStatusProgresso, setFiltroStatusProgresso] = useState('todos');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'progresso_desc' | 'progresso_asc' | 'fase'>('fase');

  // Content Management States
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasPermissionError, setHasPermissionError] = useState(false);

  // Phase Modal State
  const [phaseModalOpen, setPhaseModalOpen] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [phaseFormName, setPhaseFormName] = useState('');
  const [phaseFormDesc, setPhaseFormDesc] = useState('');
  const [phaseFormOrder, setPhaseFormOrder] = useState<number>(1);
  const [savingPhase, setSavingPhase] = useState(false);

  // Lesson Modal State
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [lessonPhaseId, setLessonPhaseId] = useState<string>('');
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonFormName, setLessonFormName] = useState('');
  const [lessonFormDesc, setLessonFormDesc] = useState('');
  const [lessonFormType, setLessonFormType] = useState('Teoria');
  const [lessonFormOrder, setLessonFormOrder] = useState<number>(1);
  const [savingLesson, setSavingLesson] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setHasPermissionError(false);
    try {
      const [studentsData, phasesData] = await Promise.all([
        listStudents(),
        listMsaPhases(true), // Include inactive for admin
      ]);
      setStudents(studentsData);
      setPhases(phasesData);

      const lessonsMap = await listAllMsaLessons(phasesData);
      setLessonsByPhase(lessonsMap);

      // Auto expand first phase if none expanded
      if (phasesData.length > 0 && !expandedPhaseId) {
        setExpandedPhaseId(phasesData[0].id);
      }
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'permission-denied' || err?.message?.toLowerCase().includes('permission')) {
        setHasPermissionError(true);
        showFeedback('error', 'Permissão insuficiente no Firestore: atualize as Regras no Console do Firebase.');
      } else {
        showFeedback('error', 'Falha ao carregar dados do MSA: ' + (err?.message || 'Erro de conexão'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Seed Default 16 Phases
  const handleSeedPhases = async () => {
    if (!confirm('Deseja inicializar o banco de dados com as 16 Fases oficiais do MSA da CCB e suas lições padrão?')) return;
    setSeeding(true);
    try {
      const res = await seedInitialMsaPhases();
      showFeedback('success', `${res.phasesCount} Fases e ${res.lessonsCount} Lições do MSA cadastradas com sucesso!`);
      setHasPermissionError(false);
      await loadData();
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'permission-denied' || err?.message?.toLowerCase().includes('permission')) {
        setHasPermissionError(true);
        showFeedback('error', 'Permissão negada no Firestore: publique as novas regras na aba Regras do Console do Firebase.');
      } else {
        showFeedback('error', 'Falha ao inicializar fases: ' + (err?.message || 'Erro'));
      }
    } finally {
      setSeeding(false);
    }
  };

  // Save Phase (Create / Edit)
  const handleSavePhase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phaseFormName.trim()) return;
    setSavingPhase(true);
    try {
      if (editingPhaseId) {
        await updateMsaPhase(editingPhaseId, {
          name: phaseFormName,
          description: phaseFormDesc,
          order: phaseFormOrder,
        });
        showFeedback('success', 'Fase atualizada com sucesso!');
      } else {
        await createMsaPhase({
          name: phaseFormName,
          description: phaseFormDesc,
          order: phaseFormOrder,
          active: true,
        });
        showFeedback('success', 'Nova fase cadastrada com sucesso!');
      }
      setPhaseModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      showFeedback('error', 'Erro ao salvar fase.');
    } finally {
      setSavingPhase(false);
    }
  };

  // Delete Phase
  const handleDeletePhase = async (phase: MsaPhaseDoc) => {
    if (!confirm(`Tem certeza que deseja excluir a "${phase.name}" e todas as suas lições?`)) return;
    try {
      await deleteMsaPhase(phase.id);
      showFeedback('success', 'Fase excluída com sucesso!');
      await loadData();
    } catch (err) {
      console.error(err);
      showFeedback('error', 'Erro ao excluir fase.');
    }
  };

  // Toggle Phase Active
  const handleTogglePhaseActive = async (phase: MsaPhaseDoc) => {
    try {
      await updateMsaPhase(phase.id, { active: !phase.active });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Save Lesson (Create / Edit)
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonFormName.trim() || !lessonPhaseId) return;
    setSavingLesson(true);
    try {
      if (editingLessonId) {
        await updateMsaLesson(lessonPhaseId, editingLessonId, {
          name: lessonFormName,
          description: lessonFormDesc,
          type: lessonFormType,
          order: lessonFormOrder,
        });
        showFeedback('success', 'Lição atualizada com sucesso!');
      } else {
        await createMsaLesson(lessonPhaseId, {
          name: lessonFormName,
          description: lessonFormDesc,
          type: lessonFormType,
          order: lessonFormOrder,
          active: true,
        });
        showFeedback('success', 'Nova lição cadastrada com sucesso!');
      }
      setLessonModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      showFeedback('error', 'Erro ao salvar lição.');
    } finally {
      setSavingLesson(false);
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (phaseId: string, lesson: MsaLessonDoc) => {
    if (!confirm(`Deseja excluir a lição "${lesson.name}"?`)) return;
    try {
      await deleteMsaLesson(phaseId, lesson.id);
      showFeedback('success', 'Lição excluída com sucesso!');
      await loadData();
    } catch (err) {
      console.error(err);
      showFeedback('error', 'Erro ao excluir lição.');
    }
  };

  // Toggle Lesson Active
  const handleToggleLessonActive = async (phaseId: string, lesson: MsaLessonDoc) => {
    try {
      await updateMsaLesson(phaseId, lesson.id, { active: !lesson.active });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // --------------------------------------------------------------------------
  // CALCULATED METRICS & STUDENT FILTERING
  // --------------------------------------------------------------------------
  const studentsCountByPhase = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      const phaseName = s.msaCurrentPhaseName || (phases[0]?.name) || 'Fase 1';
      counts[phaseName] = (counts[phaseName] || 0) + 1;
    });
    return counts;
  }, [students, phases]);

  const totalAlunosAtivos = students.length;
  const alunosAvancando = students.filter((s) => (s.msaGeneralProgress || 0) > 0).length;
  const alunosPertoConcluir = students.filter((s) => (s.msaGeneralProgress || 0) >= 75).length;

  const alunosFiltrados = useMemo(() => {
    return students
      .filter((aluno) => {
        // Search
        if (busca.trim()) {
          const q = busca.toLowerCase();
          const matchName = aluno.name?.toLowerCase().includes(q);
          const matchEmail = aluno.email?.toLowerCase().includes(q);
          if (!matchName && !matchEmail) return false;
        }

        // Instrument
        if (filtroInstrumento !== 'todos') {
          const alunoInst = resolveInstrumento(aluno.instrument);
          const targetInst = resolveInstrumento(filtroInstrumento);
          if (alunoInst.id !== targetInst.id) return false;
        }

        // Phase
        if (filtroFase !== 'todos') {
          const currentPhaseName = aluno.msaCurrentPhaseName || (phases[0]?.name) || 'Fase 1';
          if (!currentPhaseName.toLowerCase().includes(filtroFase.toLowerCase())) return false;
        }

        // Status
        if (filtroStatusProgresso !== 'todos') {
          const prog = aluno.msaGeneralProgress || 0;
          if (filtroStatusProgresso === 'nao_iniciado' && prog > 0) return false;
          if (filtroStatusProgresso === 'em_andamento' && (prog === 0 || prog === 100)) return false;
          if (filtroStatusProgresso === 'concluido' && prog < 100) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (ordenacao === 'nome') return a.name.localeCompare(b.name);
        if (ordenacao === 'progresso_desc') return (b.msaGeneralProgress || 0) - (a.msaGeneralProgress || 0);
        if (ordenacao === 'progresso_asc') return (a.msaGeneralProgress || 0) - (b.msaGeneralProgress || 0);
        if (ordenacao === 'fase') return (a.msaCurrentPhaseOrder || 1) - (b.msaCurrentPhaseOrder || 1);
        return 0;
      });
  }, [students, busca, filtroInstrumento, filtroFase, filtroStatusProgresso, ordenacao, phases]);

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              Método Simplificado de Aprendizagem &bull; CCB
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Gestão Pedagógica MSA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Acompanhamento individual de lições, fases e gerenciamento dinâmico da grade de conteúdo.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {phases.length === 0 && (
            <button
              onClick={handleSeedPhases}
              disabled={seeding}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Carregar 16 Fases Padrão</span>
            </button>
          )}

          <button
            onClick={() => {
              setEditingPhaseId(null);
              setPhaseFormName('');
              setPhaseFormDesc('');
              setPhaseFormOrder(phases.length + 1);
              setPhaseModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Fase</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fadeIn ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300'
          }`}
        >
          {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Firestore Rules Warning Banner */}
      {hasPermissionError && (
        <div className="p-4 rounded-2xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Permissões insuficientes no Cloud Firestore</span>
          </div>
          <p className="text-xs text-amber-800/90 dark:text-amber-200 leading-relaxed">
            O Firestore na nuvem não possui as regras liberando a coleção <code>msa_phases</code>. Para corrigir:
          </p>
          <ol className="list-decimal list-inside text-xs space-y-1 text-amber-800/90 dark:text-amber-200 pl-1 font-mono">
            <li>Acesse o <strong>Firebase Console &gt; Firestore Database</strong></li>
            <li>Abra a aba <strong>Regras (Rules)</strong></li>
            <li>Substitua pelo conteúdo do arquivo <strong>firestore.rules</strong> do projeto</li>
            <li>Clique no botão azul <strong>Publicar (Publish)</strong></li>
          </ol>
          <div className="pt-1">
            <button
              onClick={() => loadData()}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
            >
              <span>Recarregar Dados</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Tabs (PrimeFaces SelectButton) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveMainTab('acompanhamento')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeMainTab === 'acompanhamento'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Acompanhamento dos Alunos ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('conteudo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeMainTab === 'conteudo'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Conteúdo Oficial: Fases & Lições ({phases.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Carregando estrutura e alunos do MSA...</p>
        </div>
      ) : activeMainTab === 'acompanhamento' ? (
        /* ==================================================================== */
        /* TAB 1: ACOMPANHAMENTO DOS ALUNOS NO MSA                              */
        /* ==================================================================== */
        <div className="space-y-5">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total de Alunos</span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono mt-1 block">
                  {totalAlunosAtivos}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Candidatos cadastrados</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Alunos em Andamento</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-500 font-mono mt-1 block">
                  {alunosAvancando}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Progresso ativo no MSA</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Próximos de Concluir</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono mt-1 block">
                  {alunosPertoConcluir}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Progresso maior que 75%</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Phase Filter Badges */}
          {phases.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Distribuição de Alunos por Fase:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setFiltroFase('todos')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filtroFase === 'todos'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Todas ({students.length})
                </button>
                {phases.map((phase) => {
                  const count = studentsCountByPhase[phase.name] || 0;
                  const isSelected = filtroFase.toLowerCase() === phase.name.toLowerCase() || filtroFase === `Fase ${phase.order}`;
                  return (
                    <button
                      key={phase.id}
                      onClick={() => setFiltroFase(isSelected ? 'todos' : `Fase ${phase.order}`)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <span>Fase {phase.order}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-indigo-800 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome do aluno..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
              />
            </div>

            {/* Instrument Filter */}
            <select
              value={filtroInstrumento}
              onChange={(e) => setFiltroInstrumento(e.target.value)}
              className="w-full md:w-52 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
            >
              <option value="todos" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Todos os instrumentos</option>
              {INSTRUMENTOS_CATEGORIZADOS.map((cat) => (
                <optgroup key={cat.categoria} label={`── ${cat.categoria} ──`} className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200 font-bold">
                  {cat.itens.map((item) => (
                    <option key={item.id} value={item.nomeExibicao} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                      {item.nomeExibicao}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Progress Status Filter */}
            <select
              value={filtroStatusProgresso}
              onChange={(e) => setFiltroStatusProgresso(e.target.value)}
              className="w-full md:w-44 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
            >
              <option value="todos" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Todos os status</option>
              <option value="nao_iniciado" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">⚪ Não iniciados (0%)</option>
              <option value="em_andamento" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">🟡 Em andamento (1-99%)</option>
              <option value="concluido" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">🟢 Concluídos (100%)</option>
            </select>

            {/* Sort */}
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as any)}
              className="w-full md:w-44 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
            >
              <option value="fase" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Por Fase Atual</option>
              <option value="nome" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Nome Alfabético</option>
              <option value="progresso_desc" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Maior Progresso</option>
              <option value="progresso_asc" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Menor Progresso</option>
            </select>
          </div>

          {/* Students Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
            {alunosFiltrados.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-3.5 px-4 sm:px-6">Aluno</th>
                      <th className="py-3.5 px-4">Instrumento Oficial</th>
                      <th className="py-3.5 px-4">Fase Atual</th>
                      <th className="py-3.5 px-4 text-center">Progresso MSA</th>
                      <th className="py-3.5 px-4 text-right">Ação Pedagógica</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {alunosFiltrados.map((aluno) => {
                      const inst = resolveInstrumento(aluno.instrument);
                      const currentPhase = aluno.msaCurrentPhaseName || (phases[0]?.name) || 'Fase 1';
                      const progress = aluno.msaGeneralProgress || 0;

                      return (
                        <tr key={aluno.uid} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors">
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                                {aluno.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                                  {aluno.name}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                                  {aluno.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
                              <Music className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                              {inst.nome}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-bold">
                              <GraduationCap className="w-3.5 h-3.5" />
                              {currentPhase}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="max-w-[140px] mx-auto">
                              <div className="flex justify-between text-[11px] font-mono font-bold mb-1 text-slate-700 dark:text-slate-300">
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700">
                                <div
                                  className="bg-indigo-600 h-full rounded-full transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <Link
                              to={`/admin/alunos/${aluno.uid}?tab=msa`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                            >
                              <span>Avaliar MSA</span>
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
              <div className="py-16 text-center">
                <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhum aluno encontrado</p>
                <p className="text-xs text-slate-400 mt-1">Ajuste os filtros de busca para encontrar candidatos.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================================================================== */
        /* TAB 2: GERENCIAMENTO DE CONTEÚDO (FASES & LIÇÕES)                    */
        /* ==================================================================== */
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              As fases e lições cadastradas aqui definem a grade oficial do <strong>Método Simplificado de Aprendizagem (MSA)</strong>.
              Novas fases ou lições podem ser adicionadas ou reordenadas a qualquer momento.
            </p>
            {phases.length === 0 && (
              <button
                onClick={handleSeedPhases}
                disabled={seeding}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white font-bold flex items-center gap-1.5 shrink-0"
              >
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Inicializar 16 Fases Padrão</span>
              </button>
            )}
          </div>

          {phases.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Nenhuma fase cadastrada no Firestore</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Clique no botão abaixo para carregar automaticamente a grade padrão das 16 fases do MSA da CCB.
              </p>
              <button
                onClick={handleSeedPhases}
                disabled={seeding}
                className="mt-4 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Carregar 16 Fases Oficiais</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {phases.map((phase) => {
                const isExpanded = expandedPhaseId === phase.id;
                const lessons = lessonsByPhase[phase.id] || [];

                return (
                  <div
                    key={phase.id}
                    className={`border rounded-2xl transition-all duration-150 overflow-hidden ${
                      phase.active === false
                        ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                    }`}
                  >
                    {/* Phase Card Header */}
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div
                        onClick={() => setExpandedPhaseId(isExpanded ? null : phase.id)}
                        className="flex items-start sm:items-center gap-3 cursor-pointer flex-1"
                      >
                        <button className="p-1 text-slate-400 mt-0.5 sm:mt-0">
                          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              Ordem {phase.order}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                              {phase.name}
                            </h3>
                            {phase.active === false && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                                Inativa
                              </span>
                            )}
                          </div>
                          {phase.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              {phase.description}
                            </p>
                          )}
                          <span className="text-[11px] text-slate-400 mt-0.5 block font-medium">
                            {lessons.length} {lessons.length === 1 ? 'lição cadastrada' : 'lições cadastradas'}
                          </span>
                        </div>
                      </div>

                      {/* Phase Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          onClick={() => {
                            setLessonPhaseId(phase.id);
                            setEditingLessonId(null);
                            setLessonFormName('');
                            setLessonFormDesc('');
                            setLessonFormType('Teoria');
                            setLessonFormOrder(lessons.length + 1);
                            setLessonModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Nova Lição</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingPhaseId(phase.id);
                            setPhaseFormName(phase.name);
                            setPhaseFormDesc(phase.description);
                            setPhaseFormOrder(phase.order);
                            setPhaseModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 cursor-pointer"
                          title="Editar Fase"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleTogglePhaseActive(phase)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 cursor-pointer"
                          title={phase.active !== false ? 'Desativar Fase' : 'Ativar Fase'}
                        >
                          {phase.active !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleDeletePhase(phase)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Excluir Fase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Lessons Table */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 sm:p-5">
                        {lessons.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                                  <th className="py-2 px-3 w-16">Ordem</th>
                                  <th className="py-2 px-3">Nome da Lição</th>
                                  <th className="py-2 px-3">Tipo</th>
                                  <th className="py-2 px-3">Descrição</th>
                                  <th className="py-2 px-3 text-right">Ações</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {lessons.map((lesson) => (
                                  <tr key={lesson.id} className="hover:bg-white dark:hover:bg-slate-900 transition-colors">
                                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">
                                      #{lesson.order}
                                    </td>
                                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                                      {lesson.name}
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                        {lesson.type || 'Geral'}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-500 line-clamp-1 max-w-xs">
                                      {lesson.description || '-'}
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                      <div className="inline-flex items-center gap-1">
                                        <button
                                          onClick={() => handleToggleLessonActive(phase.id, lesson)}
                                          className="p-1 text-slate-400 hover:text-indigo-600"
                                          title={lesson.active !== false ? 'Desativar Lição' : 'Ativar Lição'}
                                        >
                                          {lesson.active !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        </button>
                                        <button
                                          onClick={() => {
                                            setLessonPhaseId(phase.id);
                                            setEditingLessonId(lesson.id);
                                            setLessonFormName(lesson.name);
                                            setLessonFormDesc(lesson.description);
                                            setLessonFormType(lesson.type || 'Teoria');
                                            setLessonFormOrder(lesson.order);
                                            setLessonModalOpen(true);
                                          }}
                                          className="p-1 text-slate-400 hover:text-indigo-600"
                                          title="Editar Lição"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteLesson(phase.id, lesson)}
                                          className="p-1 text-slate-400 hover:text-rose-600"
                                          title="Excluir Lição"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-slate-400">
                            <p className="text-xs">Nenhuma lição cadastrada nesta fase.</p>
                            <button
                              onClick={() => {
                                setLessonPhaseId(phase.id);
                                setEditingLessonId(null);
                                setLessonFormName('');
                                setLessonFormDesc('');
                                setLessonFormType('Teoria');
                                setLessonFormOrder(1);
                                setLessonModalOpen(true);
                              }}
                              className="mt-2 text-xs text-indigo-600 font-bold hover:underline"
                            >
                              + Adicionar primeira lição
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: CRIAR / EDITAR FASE */}
      {phaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingPhaseId ? 'Editar Fase do MSA' : 'Cadastrar Nova Fase'}
              </h3>
              <button onClick={() => setPhaseModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhase} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome da Fase *
                </label>
                <input
                  type="text"
                  required
                  value={phaseFormName}
                  onChange={(e) => setPhaseFormName(e.target.value)}
                  placeholder="Ex: Fase 1 — Fundamentos da Música"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição dos Objetivos
                </label>
                <textarea
                  rows={3}
                  value={phaseFormDesc}
                  onChange={(e) => setPhaseFormDesc(e.target.value)}
                  placeholder="Objetivos pedagógicos e conteúdo abordado na fase..."
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Número de Ordem *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={phaseFormOrder}
                  onChange={(e) => setPhaseFormOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPhaseModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingPhase}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  {savingPhase ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Salvar Fase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CRIAR / EDITAR LIÇÃO */}
      {lessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingLessonId ? 'Editar Lição' : 'Adicionar Nova Lição'}
              </h3>
              <button onClick={() => setLessonModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título da Lição *
                </label>
                <input
                  type="text"
                  required
                  value={lessonFormName}
                  onChange={(e) => setLessonFormName(e.target.value)}
                  placeholder="Ex: Pulsação e Ritmo Regular"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo
                  </label>
                  <select
                    value={lessonFormType}
                    onChange={(e) => setLessonFormType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Teoria" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Teoria</option>
                    <option value="Solfejo" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Solfejo</option>
                    <option value="Ritmo" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Ritmo</option>
                    <option value="Execução" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Execução</option>
                    <option value="Geral" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ordem na Fase *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={lessonFormOrder}
                    onChange={(e) => setLessonFormOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição da Lição
                </label>
                <textarea
                  rows={3}
                  value={lessonFormDesc}
                  onChange={(e) => setLessonFormDesc(e.target.value)}
                  placeholder="Critérios de avaliação e orientações..."
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setLessonModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingLesson}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  {savingLesson ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Salvar Lição</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
