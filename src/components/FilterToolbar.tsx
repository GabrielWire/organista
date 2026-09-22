import React, { useMemo } from 'react';
import { Search, X, ArrowUpDown, RotateCcw, Filter } from 'lucide-react';
import type { Hino } from '../types';

export interface FiltrosState {
  busca: string;
  fase: string; // 'todas' | '1' | '2' | '3' | '4' | '5'
  dificuldade: string;
  acidentes: string;
  categoria: string;
  status: string;
  ordenacao: 'numero_asc' | 'numero_desc' | 'fase_asc' | 'fase_desc' | 'acidentes_asc' | 'acidentes_desc';
}

interface Props {
  filtros: FiltrosState;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosState>>;
  totalFiltrados: number;
  totalHinos: number;
  onResetFiltros: () => void;
  hinos: Hino[];
}

export const FilterToolbar: React.FC<Props> = ({
  filtros,
  setFiltros,
  totalFiltrados,
  totalHinos,
  onResetFiltros,
  hinos,
}) => {
  const isFiltered =
    filtros.busca !== '' ||
    filtros.fase !== 'todas' ||
    filtros.dificuldade !== 'todas' ||
    filtros.acidentes !== 'todos' ||
    filtros.categoria !== 'todas' ||
    filtros.status !== 'todos' ||
    filtros.ordenacao !== 'numero_asc';

  // Dynamic accidentals counting in concert pitch (Dó)
  const opcoesAcidentes = useMemo(() => {
    const counts: Record<string, number> = {};
    hinos.forEach((h) => {
      let key = '0';
      if (h.acidentes < 0) key = `${Math.abs(h.acidentes)}b`;
      else if (h.acidentes > 0) key = `${h.acidentes}s`;
      counts[key] = (counts[key] || 0) + 1;
    });

    const ordemBemois = ['1b', '2b', '3b', '4b', '5b', '6b', '7b'];
    const ordemSustenidos = ['1s', '2s', '3s', '4s', '5s', '6s', '7s'];

    const labelsBemois: Record<string, string> = {
      '1b': '1 Bemol (1♭)',
      '2b': '2 Bemóis (2♭)',
      '3b': '3 Bemóis (3♭)',
      '4b': '4 Bemóis (4♭)',
      '5b': '5 Bemóis (5♭)',
      '6b': '6 Bemóis (6♭)',
      '7b': '7 Bemóis (7♭)',
    };

    const labelsSustenidos: Record<string, string> = {
      '1s': '1 Sustenido (1♯)',
      '2s': '2 Sustenidos (2♯)',
      '3s': '3 Sustenidos (3♯)',
      '4s': '4 Sustenidos (4♯)',
      '5s': '5 Sustenidos (5♯)',
      '6s': '6 Sustenidos (6♯)',
      '7s': '7 Sustenidos (7♯)',
    };

    const bemois = ordemBemois
      .filter((k) => counts[k] && counts[k] > 0)
      .map((k) => ({ valor: k, label: `${labelsBemois[k]} (${counts[k]} hinos)` }));

    const sustenidos = ordemSustenidos
      .filter((k) => counts[k] && counts[k] > 0)
      .map((k) => ({ valor: k, label: `${labelsSustenidos[k]} (${counts[k]} hinos)` }));

    const naturalCount = counts['0'] || 0;

    return { naturalCount, bemois, sustenidos };
  }, [hinos]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 transition-colors duration-200">
      
      {/* Quick Phase Tabs (Pills) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 mr-1 text-[11px] uppercase tracking-wider">
          <Filter className="w-3 h-3" /> Fases:
        </span>
        {[
          { id: 'todas', label: 'Todas as Fases' },
          { id: '1', label: 'Fase 1 (66)' },
          { id: '2', label: 'Fase 2 (94)' },
          { id: '3', label: 'Fase 3 (123)' },
          { id: '4', label: 'Fase 4 (104)' },
          { id: '5', label: 'Fase 5 (93)' },
        ].map((tab) => {
          const isSelected = filtros.fase === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFiltros((prev) => ({ ...prev, fase: tab.id }))}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* InputText */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por número (ex: 247) ou título..."
            value={filtros.busca}
            onChange={(e) => setFiltros((prev) => ({ ...prev, busca: e.target.value }))}
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-2xs"
          />
          {filtros.busca && (
            <button
              onClick={() => setFiltros((prev) => ({ ...prev, busca: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filtros.ordenacao}
              onChange={(e) => setFiltros((prev) => ({ ...prev, ordenacao: e.target.value as any }))}
              className="w-full pl-8.5 pr-8 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm appearance-none focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 cursor-pointer transition-all shadow-2xs"
            >
              <option value="numero_asc" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Número crescente (1 → 480)</option>
              <option value="numero_desc" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Número decrescente (480 → 1)</option>
              <option value="fase_asc" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Fase de Dificuldade (Fase 1 → 5)</option>
              <option value="fase_desc" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Fase de Dificuldade (Fase 5 → 1)</option>
              <option value="acidentes_asc" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Menos acidentes (0 → 7)</option>
              <option value="acidentes_desc" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Mais acidentes (7 → 0)</option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={onResetFiltros}
              title="Limpar filtros"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors shrink-0 flex items-center gap-1 text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Additional Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
        
        {/* 1. Armaduras / Acidentes */}
        <div>
          <label className="block text-[11px] font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1">
            Armadura de Clave (Órgão)
          </label>
          <select
            value={filtros.acidentes}
            onChange={(e) => setFiltros((prev) => ({ ...prev, acidentes: e.target.value }))}
            className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-purple-200 dark:border-purple-800/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-2xs font-medium cursor-pointer"
          >
            <option value="todos" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
              Todas as armaduras ({totalHinos} hinos)
            </option>

            {opcoesAcidentes.naturalCount > 0 && (
              <option value="0" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                0 acidentes (♮ Natural) ({opcoesAcidentes.naturalCount} hinos)
              </option>
            )}
            
            {opcoesAcidentes.bemois.length > 0 && (
              <optgroup label="── Bemóis (♭) ──" className="bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300 font-bold">
                {opcoesAcidentes.bemois.map((opt) => (
                  <option key={opt.valor} value={opt.valor} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            )}

            {opcoesAcidentes.sustenidos.length > 0 && (
              <optgroup label="── Sustenidos (♯) ──" className="bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300 font-bold">
                {opcoesAcidentes.sustenidos.map((opt) => (
                  <option key={opt.valor} value={opt.valor} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        {/* 2. Categoria */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            Seção do Hinário
          </label>
          <select
            value={filtros.categoria}
            onChange={(e) => setFiltros((prev) => ({ ...prev, categoria: e.target.value }))}
            className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-2xs font-medium cursor-pointer"
          >
            <option value="todas" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Todas as seções</option>
            <option value="culto" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Culto Oficial (1 - 430)</option>
            <option value="jovens" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Jovens e Menores (431 - 480)</option>
            <option value="meia_hora" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Sugestão Meia-Hora</option>
            <option value="coros" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Coros Avulsos (1 - 6)</option>
          </select>
        </div>

        {/* 3. Status de Estudo */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            Status da Aluna
          </label>
          <select
            value={filtros.status}
            onChange={(e) => setFiltros((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-2xs font-medium cursor-pointer"
          >
            <option value="todos" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Todos os hinos</option>
            <option value="aprendido" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">✅ Já Aprendidos</option>
            <option value="nao_iniciado" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">⏳ Em Estudo / Não iniciados</option>
          </select>
        </div>

      </div>

      {/* Counter summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 pt-1">
        <span>
          Exibindo <strong className="text-purple-600 dark:text-purple-400 font-bold">{totalFiltrados}</strong> de {totalHinos} hinos
        </span>
        {isFiltered && (
          <span className="text-[11px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 font-semibold">
            Filtros ativos
          </span>
        )}
      </div>

    </div>
  );
};
