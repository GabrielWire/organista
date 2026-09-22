import React from 'react';
import { Award } from 'lucide-react';
import type { Hino, RegistroProgresso } from '../types';

interface Props {
  hinos: Hino[];
  registros: Record<number, RegistroProgresso>;
}

export const StatsDashboard: React.FC<Props> = ({
  hinos,
  registros,
}) => {
  const totalHinos = 480;

  let totalAprendidos = 0;
  let f1Done = 0, f2Done = 0, f3Done = 0, f4Done = 0, f5Done = 0;
  let f1Total = 0, f2Total = 0, f3Total = 0, f4Total = 0, f5Total = 0;

  hinos.forEach((h) => {
    if (h.numero > 480) return;

    const fase = h.faseDificuldade || 1;
    if (fase === 1) f1Total++;
    else if (fase === 2) f2Total++;
    else if (fase === 3) f3Total++;
    else if (fase === 4) f4Total++;
    else if (fase === 5) f5Total++;

    const reg = registros[h.numero];
    const isDone = reg?.inteiro === 'aprendido' || reg?.intro === 'aprendido';

    if (isDone) {
      totalAprendidos++;
      if (fase === 1) f1Done++;
      else if (fase === 2) f2Done++;
      else if (fase === 3) f3Done++;
      else if (fase === 4) f4Done++;
      else if (fase === 5) f5Done++;
    }
  });

  const percentTotal = Math.round((totalAprendidos / totalHinos) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 transition-colors duration-200">
      
      {/* Top metrics line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono tracking-tight">
              {totalAprendidos}
            </span>
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 font-mono">
              / {totalHinos}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800 font-bold ml-1">
              {percentTotal}% do Hinário
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Hinário 5 &bull; Órgão Eletrônico</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-slate-800">
        <div
          className="bg-gradient-to-r from-purple-500 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-300 shadow-2xs"
          style={{ width: `${percentTotal}%` }}
        />
      </div>

      {/* Phase Breakdown Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
        <div className="p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
            <span>Fase 1</span>
            <span className="font-mono">{f1Done}/{f1Total}</span>
          </div>
          <div className="w-full bg-emerald-100 dark:bg-emerald-900 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${f1Total ? Math.round((f1Done / f1Total) * 100) : 0}%` }}
            />
          </div>
        </div>

        <div className="p-2 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-teal-800 dark:text-teal-300">
            <span>Fase 2</span>
            <span className="font-mono">{f2Done}/{f2Total}</span>
          </div>
          <div className="w-full bg-teal-100 dark:bg-teal-900 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full"
              style={{ width: `${f2Total ? Math.round((f2Done / f2Total) * 100) : 0}%` }}
            />
          </div>
        </div>

        <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 dark:text-amber-300">
            <span>Fase 3</span>
            <span className="font-mono">{f3Done}/{f3Total}</span>
          </div>
          <div className="w-full bg-amber-100 dark:bg-amber-900 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{ width: `${f3Total ? Math.round((f3Done / f3Total) * 100) : 0}%` }}
            />
          </div>
        </div>

        <div className="p-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-purple-800 dark:text-purple-300">
            <span>Fase 4</span>
            <span className="font-mono">{f4Done}/{f4Total}</span>
          </div>
          <div className="w-full bg-purple-100 dark:bg-purple-900 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full"
              style={{ width: `${f4Total ? Math.round((f4Done / f4Total) * 100) : 0}%` }}
            />
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-rose-800 dark:text-rose-300">
            <span>Fase 5</span>
            <span className="font-mono">{f5Done}/{f5Total}</span>
          </div>
          <div className="w-full bg-rose-100 dark:bg-rose-900 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full"
              style={{ width: `${f5Total ? Math.round((f5Done / f5Total) * 100) : 0}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
