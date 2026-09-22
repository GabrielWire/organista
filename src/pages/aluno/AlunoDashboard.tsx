import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Music,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AlunoDashboard: React.FC = () => {
  const { userData } = useAuth();

  const totalHinos = 480;
  const hinosConcluidos = userData?.hinosConcluidos || 0;
  const progressoGeral = userData?.progressoGeral || 0;

  const f1Done = userData?.hinosConcluidosFase1 || 0;
  const f2Done = userData?.hinosConcluidosFase2 || 0;
  const f3Done = userData?.hinosConcluidosFase3 || 0;
  const f4Done = userData?.hinosConcluidosFase4 || 0;
  const f5Done = userData?.hinosConcluidosFase5 || 0;
  const faseAtual = userData?.faseHinosAtual || 1;

  const msaPhaseName = userData?.msaCurrentPhaseName || 'Fase 1 — Fundamentos da Música';
  const msaProgress = userData?.msaGeneralProgress || 0;

  const metodoVolume = userData?.metodoVolume || 1;
  const metodoPosicao = userData?.metodoPosicao || 'Vol. 1 - Lição 1';
  const metodoProgresso = userData?.metodoProgresso || 0;
  const metodoEstagio = userData?.metodoEstagioApto || 'Iniciante';

  const getMetodoBadgeColor = (status: string) => {
    switch (status) {
      case 'Apta Oficialização':
      case 'Apto Oficialização':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'Apta Culto Oficial':
      case 'Apto Culto Oficial':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'Apta RJM / Ensaio':
      case 'Apto RJM / Ensaio':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
              Candidata a Organista &bull; CCB
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Órgão Eletrônico (Dó)
            </span>
            {userData?.instrutorNome && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                Instrutora: {userData.instrutorNome}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            A Paz de Deus, {userData?.name || 'Aluna'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Acompanhe seu avanço no Método Oficial de Órgão (Volumes 1 ao 4), nas 5 Fases de Dificuldade dos hinos e no MSA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
          <Link
            to="/aluno/metodo"
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Music className="w-4 h-4" />
            <span>Meu Método</span>
          </Link>
          <Link
            to="/aluno/progresso"
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Meus Hinos</span>
          </Link>
          <Link
            to="/aluno/msa"
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Meu MSA</span>
          </Link>
        </div>
      </div>

      {/* 3 Main Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1: Método de Órgão (Vol. 1 ao 4) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                <Music className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getMetodoBadgeColor(metodoEstagio)}`}>
                {metodoEstagio}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                Método Oficial CCB
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Volumes 1 ao 4
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Posição atual: <strong className="text-purple-600 dark:text-purple-400">{metodoPosicao}</strong>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Volume Atual:</span>
                <span className="font-bold font-mono text-purple-700 dark:text-purple-300">Volume {metodoVolume}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Progresso Geral:</span>
                <span className="font-bold font-mono text-purple-700 dark:text-purple-300">{metodoProgresso}%</span>
              </div>
            </div>
          </div>

          <Link
            to="/aluno/metodo"
            className="w-full py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Ver Lições do Método</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Pillar 2: Hinos (5 Fases de Dificuldade) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                Fase {faseAtual} em foco
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                Hinário 5 (Organistas)
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                480 Hinos em 5 Fases
              </h2>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                  {hinosConcluidos} / {totalHinos}
                </span>
                <span className="text-xs text-slate-400 font-mono">({progressoGeral}%)</span>
              </div>
            </div>

            {/* Quick phases progress */}
            <div className="grid grid-cols-5 gap-1 pt-1 text-[10px] text-center">
              <div className="p-1 rounded bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-bold">F1</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{f1Done}/66</span>
              </div>
              <div className="p-1 rounded bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-bold">F2</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{f2Done}/94</span>
              </div>
              <div className="p-1 rounded bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-bold">F3</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{f3Done}/123</span>
              </div>
              <div className="p-1 rounded bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-bold">F4</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{f4Done}/104</span>
              </div>
              <div className="p-1 rounded bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-bold">F5</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{f5Done}/93</span>
              </div>
            </div>
          </div>

          <Link
            to="/aluno/progresso"
            className="w-full py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Acessar Hinário por Fases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Pillar 3: MSA (Teoria e Solfejo) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                Fases 1 a 16
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                Teoria &bull; Solfejo &bull; Ritmo
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                MSA Musical
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {msaPhaseName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Progresso no MSA:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{msaProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${msaProgress}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            to="/aluno/msa"
            className="w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Estudar MSA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
