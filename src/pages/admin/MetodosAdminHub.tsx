import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Music,
  Users,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Loader2,
  Layers,
  Info,
} from 'lucide-react';
import { listStudents } from '../../services/studentService';
import { METODOS_ORGANISTA_DATA } from '../../data/metodosOrganistaData';
import type { UsuarioDoc } from '../../types/auth';

export const MetodosAdminHub: React.FC = () => {
  const [students, setStudents] = useState<UsuarioDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [busca, setBusca] = useState('');
  const [filtroVolume, setFiltroVolume] = useState('todos');
  const [filtroEstagio, setFiltroEstagio] = useState('todos');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'volume' | 'progresso_desc' | 'estagio'>('estagio');

  // Accordion for official reference rules
  const [showRulesAccordion, setShowRulesAccordion] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await listStudents();
      setStudents(data);
    } catch (err) {
      console.error('Falha ao listar alunas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Metrics
  const totalAlunas = students.length;
  const aptosRjm = useMemo(
    () => students.filter((s) => s.metodoEstagioApto && s.metodoEstagioApto !== 'Iniciante').length,
    [students]
  );
  const aptosCulto = useMemo(
    () =>
      students.filter(
        (s) => s.metodoEstagioApto === 'Apta Culto Oficial' || s.metodoEstagioApto === 'Apta Oficialização'
      ).length,
    [students]
  );
  const aptosOficializacao = useMemo(
    () => students.filter((s) => s.metodoEstagioApto === 'Apta Oficialização').length,
    [students]
  );

  // Filtered and sorted students
  const alunasFiltradas = useMemo(() => {
    return students
      .filter((aluna) => {
        if (busca.trim()) {
          const q = busca.toLowerCase();
          const matchName = aluna.name?.toLowerCase().includes(q);
          const matchEmail = aluna.email?.toLowerCase().includes(q);
          const matchMetodo = aluna.metodoNome?.toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchMetodo) return false;
        }

        if (filtroVolume !== 'todos') {
          const vol = aluna.volumeMetodoAtual || 1;
          if (vol !== Number(filtroVolume)) return false;
        }

        if (filtroEstagio !== 'todos') {
          const stage = aluna.metodoEstagioApto || 'Iniciante';
          if (filtroEstagio === 'iniciante' && stage !== 'Iniciante') return false;
          if (filtroEstagio === 'rjm' && stage !== 'Apta RJM / Ensaio') return false;
          if (filtroEstagio === 'culto' && stage !== 'Apta Culto Oficial') return false;
          if (filtroEstagio === 'oficializacao' && stage !== 'Apta Oficialização') return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (ordenacao === 'nome') return a.name.localeCompare(b.name);
        if (ordenacao === 'volume') return (b.volumeMetodoAtual || 1) - (a.volumeMetodoAtual || 1);
        if (ordenacao === 'progresso_desc') return (b.metodoProgresso || 0) - (a.metodoProgresso || 0);
        if (ordenacao === 'estagio') {
          const rank = (s?: string) => {
            if (s === 'Apta Oficialização') return 4;
            if (s === 'Apta Culto Oficial') return 3;
            if (s === 'Apta RJM / Ensaio') return 2;
            return 1;
          };
          return rank(b.metodoEstagioApto) - rank(a.metodoEstagioApto);
        }
        return 0;
      });
  }, [students, busca, filtroVolume, filtroEstagio, ordenacao]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1 uppercase tracking-wider">
              <Music className="w-3 h-3" />
              Método Oficial de Órgão Eletrônico CCB
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-purple-700 dark:text-purple-400" />
            Métodos das Organistas (Vol. 1 ao 4)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Acompanhe o progresso das alunas nos 4 Volumes oficiais e a aptidão para Ensaios, Reunião de Jovens, Culto Oficial e Oficialização.
          </p>
        </div>

        <button
          onClick={() => setShowRulesAccordion(!showRulesAccordion)}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto border border-slate-300 dark:border-slate-700"
        >
          <Info className="w-4 h-4 text-purple-700 dark:text-purple-400" />
          <span>{showRulesAccordion ? 'Ocultar Estrutura Oficial' : 'Consultar Volumes 1 ao 4'}</span>
        </button>
      </div>

      {/* Official CCB Guidelines Reference Accordion */}
      {showRulesAccordion && (
        <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 rounded-2xl p-5 shadow-sm space-y-4 animate-fadeIn">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-700" />
              <span>Estrutura Pedagógica dos 4 Volumes do Método de Estudos para Órgão Eletrônico CCB</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Critérios oficiais de progressão técnica e marcos de aptidão para cada volume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {METODOS_ORGANISTA_DATA.map((vol) => (
              <div
                key={vol.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      Volume {vol.volume}
                    </span>
                    {vol.estagioRotulo && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {vol.estagioRotulo}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{vol.nome}</h4>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold mb-2">{vol.subtitulo}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{vol.descricao}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Objetivos:
                  </span>
                  <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 list-disc list-inside">
                    {vol.objetivos.map((obj, i) => (
                      <li key={i} className="line-clamp-1">{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total de Alunas</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono mt-1 block">
              {totalAlunas}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Candidatas a organista</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Aptas para RJM</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-500 font-mono mt-1 block">
              {aptosRjm}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Reunião de Jovens / Ensaio</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Aptas Cultos Oficiais</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1 block">
              {aptosCulto}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Cultos Oficiais</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Aptas Oficialização</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
              {aptosOficializacao}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Prontas para exame</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome da aluna..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
          />
        </div>

        {/* Volume Filter */}
        <select
          value={filtroVolume}
          onChange={(e) => setFiltroVolume(e.target.value)}
          className="w-full md:w-56 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium cursor-pointer focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
        >
          <option value="todos">Todos os Volumes (1 ao 4)</option>
          <option value="1">Volume 1 - Iniciação</option>
          <option value="2">Volume 2 - Desenvolvimento & RJM</option>
          <option value="3">Volume 3 - Culto Oficial</option>
          <option value="4">Volume 4 - Oficialização</option>
        </select>

        {/* Stage Filter */}
        <select
          value={filtroEstagio}
          onChange={(e) => setFiltroEstagio(e.target.value)}
          className="w-full md:w-48 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium cursor-pointer focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
        >
          <option value="todos">Todos os estágios</option>
          <option value="iniciante">⚪ Iniciante</option>
          <option value="rjm">🟡 Apta RJM / Ensaio</option>
          <option value="culto">🔵 Apta Culto Oficial</option>
          <option value="oficializacao">🟢 Apta Oficialização</option>
        </select>

        {/* Sort */}
        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as any)}
          className="w-full md:w-44 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium cursor-pointer focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
        >
          <option value="estagio">Por Estágio Apto</option>
          <option value="nome">Nome Alfabético</option>
          <option value="volume">Por Volume</option>
          <option value="progresso_desc">Maior Progresso</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-700 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Carregando acompanhamento dos métodos...</p>
          </div>
        ) : alunasFiltradas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4 sm:px-6">Aluna</th>
                  <th className="py-3.5 px-4">Volume Atual</th>
                  <th className="py-3.5 px-4">Posição Atual</th>
                  <th className="py-3.5 px-4">Estágio de Aptidão</th>
                  <th className="py-3.5 px-4 text-center">Progresso</th>
                  <th className="py-3.5 px-4 text-right">Ação Pedagógica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {alunasFiltradas.map((aluna) => {
                  const volNum = aluna.volumeMetodoAtual || 1;
                  const metodoPos = aluna.metodoPosicao || 'Vol. 1 - Página 1';
                  const estagio = aluna.metodoEstagioApto || 'Iniciante';
                  const progress = aluna.metodoProgresso || 0;

                  return (
                    <tr key={aluna.uid} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-950 border border-purple-200 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {aluna.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                              {aluna.name}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                              {aluna.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300">
                          <Music className="w-3 h-3 text-purple-600" />
                          Volume {volNum}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {metodoPos}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            estagio === 'Apta Oficialização'
                              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : estagio === 'Apta Culto Oficial'
                              ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                              : estagio === 'Apta RJM / Ensaio'
                              ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {estagio === 'Apta Oficialização'
                            ? '🟢 Apta Oficialização'
                            : estagio === 'Apta Culto Oficial'
                            ? '🔵 Apta Culto Oficial'
                            : estagio === 'Apta RJM / Ensaio'
                            ? '🟡 Apta RJM / Ensaio'
                            : '⚪ Iniciante'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="max-w-[120px] mx-auto">
                          <div className="flex justify-between text-[11px] font-mono font-bold mb-1 text-slate-700 dark:text-slate-300">
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700">
                            <div
                              className="bg-purple-700 h-full rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/admin/alunos/${aluna.uid}?tab=metodo`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                        >
                          <span>Avaliar Método</span>
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
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhuma aluna encontrada</p>
            <p className="text-xs text-slate-400 mt-1">Ajuste os filtros de busca para visualizar candidatas.</p>
          </div>
        )}
      </div>
    </div>
  );
};
