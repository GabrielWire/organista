import React, { useState, useEffect, useMemo } from 'react';
import { StatsDashboard } from '../../components/StatsDashboard';
import { FilterToolbar } from '../../components/FilterToolbar';
import type { FiltrosState } from '../../components/FilterToolbar';
import { HinoCard } from '../../components/HinoCard';
import { EscalasView } from '../../components/EscalasView';
import { HINOS_DATA } from '../../data/hinosData';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentProgressMap, updateHymnProgress } from '../../services/studentService';
import type { HinoProgressoDoc, StatusProgresso } from '../../types/auth';
import type { RegistroProgresso } from '../../types';
import { BookOpen, ChevronDown, Loader2, Music, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AlunoProgresso: React.FC = () => {
  const { currentUser, refreshUserData } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<number, HinoProgressoDoc>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hinos' | 'escalas'>('hinos');
  const [visibleCount, setVisibleCount] = useState(60);

  const [filtros, setFiltros] = useState<FiltrosState>({
    busca: '',
    fase: 'todas',
    dificuldade: 'todas',
    acidentes: 'todos',
    categoria: 'todas',
    status: 'todos',
    ordenacao: 'numero_asc',
  });

  useEffect(() => {
    if (!currentUser) return;
    const fetchProgress = async () => {
      try {
        const map = await getStudentProgressMap(currentUser.uid);
        setProgressMap(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [currentUser]);

  // Convert Firestore progress to component format
  const registrosFormat: Record<number, RegistroProgresso> = useMemo(() => {
    const res: Record<number, RegistroProgresso> = {};
    Object.entries(progressMap).forEach(([hId, doc]) => {
      const isConcluido = doc.status === 'Concluído' || doc.progress === 100;
      res[Number(hId)] = {
        intro: isConcluido ? 'aprendido' : 'nao_iniciado',
        inteiro: isConcluido ? 'aprendido' : 'nao_iniciado',
        atualizadoEm: doc.updatedAt,
      };
    });
    return res;
  }, [progressMap]);

  // Handle study progress toggle
  const handleToggleAprendido = async (hinoNumero: number) => {
    if (!currentUser) return;

    const currentDoc = progressMap[hinoNumero];
    const isCurrentlyLearned = currentDoc?.status === 'Concluído' || currentDoc?.progress === 100;

    const nextStatus: StatusProgresso = isCurrentlyLearned ? 'Não iniciado' : 'Concluído';
    const nextProgress = isCurrentlyLearned ? 0 : 100;

    const hino = HINOS_DATA.find((h) => h.numero === hinoNumero);
    const hinoTitulo = hino ? hino.titulo : `Hino ${hinoNumero}`;

    // Optimistic UI update
    setProgressMap((prev) => ({
      ...prev,
      [hinoNumero]: {
        hinoId: hinoNumero,
        name: hinoTitulo,
        faseDificuldade: hino?.faseDificuldade || 1,
        status: nextStatus,
        progress: nextProgress,
        maoDireita: true,
        maoEsquerda: true,
        pedaleira: true,
      },
    }));

    try {
      await updateHymnProgress(
        currentUser.uid,
        hinoNumero,
        hinoTitulo,
        nextStatus,
        nextProgress,
        progressMap,
        undefined,
        { maoDireita: true, maoEsquerda: true, pedaleira: true }
      );
      if (refreshUserData) {
        await refreshUserData();
      }
    } catch (err) {
      console.error('Falha ao atualizar hino:', err);
      // Rollback on error
      if (currentDoc) {
        setProgressMap((prev) => ({ ...prev, [hinoNumero]: currentDoc }));
      } else {
        setProgressMap((prev) => {
          const clone = { ...prev };
          delete clone[hinoNumero];
          return clone;
        });
      }
    }
  };

  const handleResetFiltros = () => {
    setFiltros({
      busca: '',
      fase: 'todas',
      dificuldade: 'todas',
      acidentes: 'todos',
      categoria: 'todas',
      status: 'todos',
      ordenacao: 'numero_asc',
    });
  };

  // Filtered and Sorted Hymns
  const hinosFiltrados = useMemo(() => {
    let list = [...HINOS_DATA];

    // 1. Search filter
    if (filtros.busca.trim()) {
      const q = filtros.busca.trim().toLowerCase();
      list = list.filter(
        (h) =>
          String(h.numero).includes(q) ||
          (h.numeroExibicao && h.numeroExibicao.toLowerCase().includes(q)) ||
          h.titulo.toLowerCase().includes(q) ||
          h.tonalidadeEfeito.toLowerCase().includes(q)
      );
    }

    // 2. Fase de Dificuldade
    if (filtros.fase !== 'todas') {
      const numFase = Number(filtros.fase);
      list = list.filter((h) => h.numero <= 480 && h.faseDificuldade === numFase);
    }

    // 3. Accidentals in Concert Pitch
    if (filtros.acidentes !== 'todos') {
      if (filtros.acidentes === '0') {
        list = list.filter((h) => h.acidentes === 0);
      } else if (filtros.acidentes.endsWith('b')) {
        const num = Number(filtros.acidentes.replace('b', ''));
        list = list.filter((h) => h.acidentes === -num);
      } else if (filtros.acidentes.endsWith('s')) {
        const num = Number(filtros.acidentes.replace('s', ''));
        list = list.filter((h) => h.acidentes === num);
      }
    }

    // 4. Section / Category
    if (filtros.categoria !== 'todas') {
      if (filtros.categoria === 'culto') list = list.filter((h) => h.numero <= 430);
      else if (filtros.categoria === 'jovens') list = list.filter((h) => h.numero >= 431 && h.numero <= 480);
      else if (filtros.categoria === 'meia_hora') list = list.filter((h) => h.meiaHora);
      else if (filtros.categoria === 'coros') list = list.filter((h) => h.numero > 480);
    }

    // 5. Study status
    if (filtros.status !== 'todos') {
      list = list.filter((h) => {
        const isDone = progressMap[h.numero]?.status === 'Concluído' || progressMap[h.numero]?.progress === 100;
        if (filtros.status === 'aprendido') return isDone;
        if (filtros.status === 'nao_iniciado') return !isDone;
        return true;
      });
    }

    // 6. Sorting
    list.sort((a, b) => {
      switch (filtros.ordenacao) {
        case 'numero_asc':
          return a.numero - b.numero;
        case 'numero_desc':
          return b.numero - a.numero;
        case 'fase_asc': {
          const diffFase = (a.faseDificuldade || 1) - (b.faseDificuldade || 1);
          if (diffFase !== 0) return diffFase;
          return a.numero - b.numero;
        }
        case 'fase_desc': {
          const diffFase = (b.faseDificuldade || 1) - (a.faseDificuldade || 1);
          if (diffFase !== 0) return diffFase;
          return a.numero - b.numero;
        }
        case 'acidentes_asc': {
          const qA = Math.abs(a.acidentes);
          const qB = Math.abs(b.acidentes);
          if (qA !== qB) return qA - qB;
          return a.numero - b.numero;
        }
        case 'acidentes_desc': {
          const qA = Math.abs(a.acidentes);
          const qB = Math.abs(b.acidentes);
          if (qA !== qB) return qB - qA;
          return a.numero - b.numero;
        }
        default:
          return a.numero - b.numero;
      }
    });

    return list;
  }, [filtros, progressMap]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-400">Carregando seu repertório de hinos...</p>
      </div>
    );
  }

  // Current instrument info for organ
  const instrumentoOrganista = {
    id: 'orgao',
    nome: 'Órgão Eletrônico',
    afinacao: 'Dó (Tom Real)',
    hinario: 'Claves de Sol e Fá + Pedaleira',
    transposicaoArmadura: 0,
    dicaGEM: 'Execute o soprano e contralto com a mão direita, tenor com a mão esquerda e baixo na pedaleira com toque legato.',
    escalasRecomendadas: [
      'Dó Maior / Lá menor',
      'Sol Maior / Mi menor',
      'Fá Maior / Ré menor',
      'Ré Maior / Si menor',
      'Si♭ Maior / Sol menor',
      'Lá Maior / Fá♯ menor',
      'Mi♭ Maior / Dó menor',
      'Mi Maior / Dó♯ menor',
      'Lá♭ Maior / Fá menor',
    ],
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Organist Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors duration-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" />
                Órgão Eletrônico (Dó)
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Hinário 5 &bull; <strong className="text-slate-800 dark:text-slate-200">480 Hinos em 5 Fases</strong>
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">&bull;</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Soprano, Contralto, Tenor e Pedaleira
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
              <span className="font-semibold text-purple-600 dark:text-purple-400">Orientação Pedagógica: </span>
              Acompanhe seu avanço pelas 5 Fases Oficiais de dificuldade da CCB. Clique no hino para marcar o estudo concluído.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <Link
              to="/aluno/metodo"
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <span>Ver Meu Método (Vol. 1-4)</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Tab Selection: Hinos vs Escalas */}
        <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setActiveTab('hinos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'hinos'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Hinário 5 por Fases (480 Hinos)</span>
          </button>

          <button
            onClick={() => setActiveTab('escalas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'escalas'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Escalas no Órgão ({instrumentoOrganista.escalasRecomendadas.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'escalas' ? (
        <EscalasView
          instrumento={instrumentoOrganista as any}
          onOpenInstrumentModal={() => {}}
        />
      ) : (
        <>
          <StatsDashboard
            hinos={HINOS_DATA}
            registros={registrosFormat}
          />

          <FilterToolbar
            filtros={filtros}
            setFiltros={setFiltros}
            totalFiltrados={hinosFiltrados.length}
            totalHinos={HINOS_DATA.length}
            onResetFiltros={handleResetFiltros}
            hinos={HINOS_DATA}
          />

          {hinosFiltrados.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-2.5">
                {hinosFiltrados.slice(0, visibleCount).map((hino) => (
                  <HinoCard
                    key={hino.numero}
                    hino={hino}
                    registro={registrosFormat[hino.numero]}
                    onToggleAprendido={handleToggleAprendido}
                  />
                ))}
              </div>

              {visibleCount < hinosFiltrados.length && (
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 pb-8">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 60)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Mostrar mais 60 hinos
                  </button>
                  <button
                    onClick={() => setVisibleCount(hinosFiltrados.length)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all active:scale-95 shadow-2xs cursor-pointer"
                  >
                    Mostrar todos ({hinosFiltrados.length})
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhum hino encontrado</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Ajuste os filtros de fase, acidentes ou busca para exibir os hinos do repertório.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
