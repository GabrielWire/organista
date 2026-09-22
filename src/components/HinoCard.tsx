import React from 'react';
import { Check } from 'lucide-react';
import type { Hino, RegistroProgresso } from '../types';

interface Props {
  hino: Hino;
  registro?: RegistroProgresso;
  onToggleAprendido: (hinoNumero: number) => void;
}

export const HinoCard: React.FC<Props> = ({
  hino,
  registro,
  onToggleAprendido,
}) => {
  const isAprendido = registro?.inteiro === 'aprendido' || registro?.intro === 'aprendido';
  const fase = hino.faseDificuldade || 1;

  // Fase badges styling
  const getFaseBadge = () => {
    switch (fase) {
      case 1:
        return {
          label: 'Fase 1',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
          dot: 'bg-emerald-500',
        };
      case 2:
        return {
          label: 'Fase 2',
          bg: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
          dot: 'bg-teal-500',
        };
      case 3:
        return {
          label: 'Fase 3',
          bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
          dot: 'bg-amber-500',
        };
      case 4:
        return {
          label: 'Fase 4',
          bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
          dot: 'bg-purple-500',
        };
      case 5:
        return {
          label: 'Fase 5',
          bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
          dot: 'bg-rose-500',
        };
      default:
        return {
          label: `Fase ${fase}`,
          bg: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          dot: 'bg-slate-500',
        };
    }
  };

  const badge = getFaseBadge();
  const isJovens = hino.numero >= 431 && hino.numero <= 480;

  return (
    <button
      onClick={() => onToggleAprendido(hino.numero)}
      title={`${hino.numero}. ${hino.titulo}
Fase de Dificuldade: Fase ${fase}
Tonalidade: ${hino.tonalidadeEfeito} (${hino.armadura === '0' ? '0♮' : hino.armadura})
Compasso: ${hino.compasso}
${hino.meiaHora ? 'Sugestão para Meia-Hora\n' : ''}${isJovens ? 'Hino de Jovens e Menores\n' : ''}${isAprendido ? 'Status: Aprendido / Concluído' : 'Status: Em estudo / Não iniciado'}`}
      className={`relative flex flex-col items-center justify-between p-2 sm:p-2.5 rounded-xl border transition-all duration-150 select-none text-center group cursor-pointer active:scale-95 ${
        isAprendido
          ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-400 dark:border-purple-500 shadow-2xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500/60 hover:shadow-xs hover:-translate-y-0.5'
      }`}
    >
      {/* Top row: Fase Indicator & Checkbox */}
      <div className="w-full flex items-center justify-between">
        <span
          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border leading-none flex items-center gap-1 ${badge.bg}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          F{fase}
        </span>

        <div
          className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
            isAprendido
              ? 'bg-purple-600 border-purple-600 text-white shadow-2xs'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-transparent group-hover:border-purple-400'
          }`}
        >
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
      </div>

      {/* Center: Hymn Number */}
      <div className="my-1">
        <span
          className={`text-xl sm:text-2xl font-black font-mono tracking-tight leading-none transition-colors ${
            isAprendido
              ? 'text-purple-800 dark:text-purple-300'
              : 'text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400'
          }`}
        >
          {hino.numeroExibicao || hino.numero}
        </span>
      </div>

      {/* Bottom: Accidentals Box & Badges */}
      <div className="w-full flex items-center justify-center gap-1">
        <span
          className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded border ${
            isAprendido
              ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          {hino.armadura === '0' ? '0♮' : hino.armadura}
        </span>

        {hino.meiaHora && (
          <span
            className="w-2 h-2 rounded-full bg-sky-500 shrink-0"
            title="Sugestão para Meia-Hora"
          />
        )}

        {isJovens && (
          <span
            className="w-2 h-2 rounded-full bg-amber-400 shrink-0"
            title="Hino de Jovens e Menores"
          />
        )}
      </div>
    </button>
  );
};
