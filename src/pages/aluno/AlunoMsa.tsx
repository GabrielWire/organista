import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Sparkles,
  Loader2,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  listMsaPhases,
  listAllMsaLessons,
  getStudentMsaOverview,
} from '../../services/msaService';
import { resolveInstrumento } from '../../utils/instrumentUtils';
import type {
  MsaPhaseDoc,
  MsaLessonDoc,
  MsaStudentLessonProgress,
  MsaStudentOverallProgress,
} from '../../types/msa';

export const AlunoMsa: React.FC = () => {
  const { userData, currentUser } = useAuth();

  const [phases, setPhases] = useState<MsaPhaseDoc[]>([]);
  const [lessonsByPhase, setLessonsByPhase] = useState<Record<string, MsaLessonDoc[]>>({});
  const [progressMap, setProgressMap] = useState<Record<string, MsaStudentLessonProgress>>({});
  const [overall, setOverall] = useState<MsaStudentOverallProgress | null>(null);
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const formatarDataBr = (dataVal?: any) => {
    if (!dataVal) return '';
    if (typeof dataVal === 'string' && dataVal.includes('-')) {
      const parts = dataVal.split('T')[0].split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    if (dataVal?.toDate) return dataVal.toDate().toLocaleDateString('pt-BR');
    const d = new Date(dataVal);
    if (!isNaN(d.getTime())) return d.toLocaleDateString('pt-BR');
    return String(dataVal);
  };


  const inst = useMemo(() => {
    return resolveInstrumento(userData?.instrument);
  }, [userData?.instrument]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchMsa = async () => {
      setLoading(true);
      try {
        const phasesData = await listMsaPhases(false);
        setPhases(phasesData);

        const lessonsMap = await listAllMsaLessons(phasesData);
        setLessonsByPhase(lessonsMap);

        const msaData = await getStudentMsaOverview(currentUser.uid, phasesData, lessonsMap);
        setProgressMap(msaData.progressMap);
        setOverall(msaData.overall);

        // Open current phase by default
        if (msaData.overall.currentPhaseId) {
          setExpandedPhaseId(msaData.overall.currentPhaseId);
        } else if (phasesData.length > 0) {
          setExpandedPhaseId(phasesData[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMsa();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
        <p className="text-xs text-slate-400">Carregando sua jornada no MSA...</p>
      </div>
    );
  }

  const currentPhaseSummary = overall?.currentPhaseId
    ? overall.phaseSummaries[overall.currentPhaseId]
    : null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Meu MSA &bull; Método Simplificado de Aprendizagem
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {inst.nome} ({inst.afinacao})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Evolução Musical da Candidata a Organista
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Acompanhe seu avanço pelas 16 Fases do MSA avaliadas pela sua instrutora para os cultos e oficialização na CCB.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
            <Link
              to="/aluno/progresso"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ver Meus Hinos</span>
            </Link>
          </div>
        </div>

        {/* Current Phase Highlight Box */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-slate-50 to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Sua Fase Atual
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {overall?.currentPhaseName || 'Fase 1 — Fundamentos da Música'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Progresso Geral no MSA: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{overall?.generalProgress || 0}%</strong> &bull; {overall?.totalCompletedLessons || 0} de {overall?.totalLessons || 0} lições concluídas
            </p>
          </div>

          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Progresso na Fase</span>
              <span>{currentPhaseSummary?.progressPercent || 0}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-300 dark:border-slate-700">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentPhaseSummary?.progressPercent || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phases Accordion / Cards List */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <span>Grade de Fases do MSA</span>
        </h2>

        {phases.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhuma fase cadastrada no momento.</p>
            <p className="text-xs text-slate-400 mt-1">O instrutor em breve disponibilizará a grade do MSA.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {phases.map((phase) => {
              const summary = overall?.phaseSummaries[phase.id];
              const isCurrentPhase = overall?.currentPhaseId === phase.id;
              const isExpanded = expandedPhaseId === phase.id;
              const lessons = lessonsByPhase[phase.id] || [];
              const progressPercent = summary?.progressPercent || 0;
              const isDone = summary?.isCompleted;

              return (
                <div
                  key={phase.id}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-150 shadow-2xs ${
                    isCurrentPhase
                      ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-400/20'
                      : isDone
                      ? 'border-emerald-200 dark:border-emerald-800/80'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Phase Header Card */}
                  <div
                    onClick={() => setExpandedPhaseId(isExpanded ? null : phase.id)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-850/60 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <button className="p-1 text-slate-400 mt-0.5 sm:mt-0">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
                            Fase {phase.order}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {phase.name}
                          </h3>

                          {isCurrentPhase && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white shadow-2xs">
                              Fase Atual
                            </span>
                          )}

                          {isDone && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Concluída
                            </span>
                          )}
                        </div>

                        {phase.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {phase.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block">
                          {summary?.completedLessons || 0} / {summary?.totalLessons || lessons.length} lições ({progressPercent}%)
                        </span>
                        <div className="w-28 sm:w-36 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700 mt-1">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isDone ? 'bg-emerald-600' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Lessons Checklist */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 sm:p-5 space-y-2.5">
                      {lessons.length > 0 ? (
                        lessons.map((lesson) => {
                          const pDoc = progressMap[lesson.id];
                          const status = pDoc?.status || 'Não iniciado';
                          const progress = pDoc?.progress || 0;
                          const teacherNotes = pDoc?.teacherNotes;

                          return (
                            <div
                              key={lesson.id}
                              className={`p-3.5 rounded-xl border transition-all shadow-2xs ${
                                status === 'Concluído'
                                  ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80'
                                  : status === 'Em andamento'
                                  ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/80'
                                  : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-start sm:items-center gap-2.5">
                                  <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                                    status === 'Concluído'
                                      ? 'bg-emerald-600 text-white'
                                      : status === 'Em andamento'
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                                  }`}>
                                    {status === 'Concluído' ? '✓' : status === 'Em andamento' ? '→' : '○'}
                                  </span>

                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                                        #{lesson.order}
                                      </span>
                                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                        {lesson.name}
                                      </h4>
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                                        {lesson.type || 'Geral'}
                                      </span>
                                      {(pDoc?.evaluatedAt || pDoc?.completedAt) && (
                                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                          <Calendar className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                                          {formatarDataBr(pDoc?.evaluatedAt || pDoc?.completedAt)}
                                        </span>
                                      )}
                                    </div>
                                    {lesson.description && (
                                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                        {lesson.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center">
                                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs ${
                                    status === 'Concluído'
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                      : status === 'Em andamento'
                                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                  }`}>
                                    {status} ({progress}%)
                                  </span>
                                </div>
                              </div>

                              {/* Teacher Feedback Note (if present) */}
                              {teacherNotes && (
                                <div className="mt-2.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 shadow-2xs">
                                  <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-800 dark:text-amber-300">
                                      Orientação do Instrutor:
                                    </span>
                                    <p className="mt-0.5 leading-relaxed font-medium">{teacherNotes}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-400 py-3 text-center">Nenhuma lição nesta fase.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
