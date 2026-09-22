import React, { useState, useEffect } from 'react';
import {
  Music,
  CheckCircle2,
  Clock,
  BookOpen,
  MessageSquare,
  Loader2,
  Award,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getStudentMethodProgress,
  listStudentMethodLessons,
} from '../../services/metodoService';
import { METODO_OFICIAL_ORGAO_CCB } from '../../data/metodosOrganistaData';
import type {
  AlunoMetodoProgressoDoc,
  MetodoLicaoDoc,
} from '../../types/metodo';

export const AlunoMetodo: React.FC = () => {
  const { userData, currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [progresso, setProgresso] = useState<AlunoMetodoProgressoDoc | null>(null);
  const [metodoLessons, setMetodoLessons] = useState<MetodoLicaoDoc[]>([]);
  const [selectedVolumeTab, setSelectedVolumeTab] = useState<number>(1);

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

  useEffect(() => {
    if (!currentUser) return;
    const fetchMetodo = async () => {
      setLoading(true);
      try {
        const [progressData, lessonsData] = await Promise.all([
          getStudentMethodProgress(currentUser.uid),
          listStudentMethodLessons(currentUser.uid),
        ]);

        setProgresso(progressData);
        setMetodoLessons(lessonsData);
        if (progressData?.volumeAtual) {
          setSelectedVolumeTab(progressData.volumeAtual);
        }
      } catch (err) {
        console.error('Erro ao buscar progresso de método:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetodo();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
        <p className="text-xs text-slate-400">Carregando plano do Método Oficial de Órgão CCB...</p>
      </div>
    );
  }

  const metodoConfig = METODO_OFICIAL_ORGAO_CCB;
  const currentVolume = metodoConfig.volumes?.find((v) => v.volume === selectedVolumeTab) || metodoConfig.volumes?.[0];

  const aptoRjm = !!progresso?.estagiosAptos?.rjm;
  const aptoCulto = !!progresso?.estagiosAptos?.culto;
  const aptoOficializacao = !!progresso?.estagiosAptos?.oficializacao;

  // Filter lessons by selected volume
  const volumeLessons = metodoLessons.filter((l) => (l.volume || 1) === selectedVolumeTab);
  const concluidasVolume = volumeLessons.filter((l) => l.status === 'Concluído' || l.progress === 100).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Método de Estudos para Órgão Eletrônico
                </h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold">
                  Edição Oficial CCB
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Volumes 1 ao 4 &bull; Acompanhamento pedagógico com sua Instrutora
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block leading-none">
                Estágio Conquistado
              </span>
              <span className="text-xs sm:text-sm font-black text-purple-700 dark:text-purple-300 mt-1 block">
                {userData?.metodoEstagioApto || progresso?.posicaoAtual || 'Iniciante'}
              </span>
            </div>
          </div>
        </div>

        {/* Aptitude Checkpoints (RJM, Culto, Oficialização) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* RJM */}
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
              aptoRjm
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                aptoRjm
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}
            >
              {aptoRjm ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block">1. RJM &amp; Ensaios</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                Volumes 1 e 2 + Jovens com pedaleira
              </span>
            </div>
          </div>

          {/* Culto Oficial */}
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
              aptoCulto
                ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                aptoCulto
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}
            >
              {aptoCulto ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block">2. Culto Oficial</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                Volume 3 + Hinário a 4 vozes com pedaleira
              </span>
            </div>
          </div>

          {/* Oficialização */}
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
              aptoOficializacao
                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                aptoOficializacao
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}
            >
              {aptoOficializacao ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block">3. Oficialização</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                Volume 4 + 480 hinos + Meia-Hora
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Volume Tabs Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {metodoConfig.volumes?.map((vol) => {
          const isSelected = selectedVolumeTab === vol.volume;
          const lessonsCount = metodoLessons.filter((l) => (l.volume || 1) === vol.volume).length;
          return (
            <button
              key={vol.volume}
              onClick={() => setSelectedVolumeTab(vol.volume)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-purple-500 dark:border-purple-400 shadow-sm ring-2 ring-purple-500/20'
                  : 'bg-slate-50/80 dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                  Volume {vol.volume}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {lessonsCount} lições
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 line-clamp-1">
                {vol.subtitulo}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Volume Overview Card */}
      {currentVolume && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  VOL. {currentVolume.volume}
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {currentVolume.nome}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {currentVolume.descricao}
              </p>
            </div>

            {currentVolume.estagioRotulo && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 shrink-0">
                <Award className="w-3.5 h-3.5" />
                Meta: {currentVolume.estagioRotulo}
              </span>
            )}
          </div>

          {/* Pedagogy Objectives */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Habilidades e Objetivos deste Volume:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              {currentVolume.objetivos.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Teacher General Guidance Note */}
          {progresso?.observacoesInstrutor && (
            <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 flex items-start gap-3 text-xs">
              <MessageSquare className="w-4 h-4 text-purple-700 dark:text-purple-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-900 dark:text-purple-200 block font-bold">
                  Orientações da sua Instrutora:
                </strong>
                <p className="text-purple-800 dark:text-purple-300 mt-0.5 leading-relaxed">
                  {progresso.observacoesInstrutor}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Registered Lessons for this Volume */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Lições Registradas no Volume {selectedVolumeTab}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {concluidasVolume} de {volumeLessons.length} lições concluídas neste volume
              </p>
            </div>
          </div>
        </div>

        {volumeLessons.length > 0 ? (
          <div className="space-y-3">
            {volumeLessons.map((lesson) => {
              const isDone = lesson.status === 'Concluído' || lesson.progress === 100;
              const isProgress = lesson.status === 'Em andamento' || lesson.progress > 0;

              return (
                <div
                  key={lesson.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-2.5 transition-colors hover:border-purple-300 dark:hover:border-purple-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-purple-700 dark:text-purple-300">
                        Pág. {lesson.numeroPagina} &bull; Lição {lesson.numeroLicao}
                      </span>
                      {lesson.titulo && (
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                          {lesson.titulo}
                        </h4>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                            : isProgress
                            ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}
                      >
                        {lesson.status} ({lesson.progress}%)
                      </span>
                      {lesson.evaluatedAt && (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                          {formatarDataBr(lesson.evaluatedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {lesson.teacherNotes && (
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                      <strong className="text-purple-700 dark:text-purple-300 block font-semibold text-[11px]">
                        Parecer da Instrutora:
                      </strong>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                        {lesson.teacherNotes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-1.5" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nenhuma lição registrada no Volume {selectedVolumeTab} ainda.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Sua instrutora registrará suas lições avaliadas aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
