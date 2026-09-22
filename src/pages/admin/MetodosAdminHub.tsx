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
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  BookMarked,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { listStudents } from '../../services/studentService';
import { METODOS_ORGANISTA_DATA } from '../../data/metodosOrganistaData';
import {
  listAllAvailableMethods,
  createCustomMethod,
  updateCustomMethod,
  deleteCustomMethod,
} from '../../services/metodoService';
import type { UsuarioDoc } from '../../types/auth';
import type {
  MetodoCadastradoDoc,
  MetodoCategoria,
  MetodoTipoDivisao,
  MetodoEstagioSugerido,
} from '../../types/metodo';

export const MetodosAdminHub: React.FC = () => {
  const { currentUser, role } = useAuth();

  // Top Section Tab: 'alunas' | 'catalogo'
  const [hubTab, setHubTab] = useState<'alunas' | 'catalogo'>('alunas');

  // Students state
  const [students, setStudents] = useState<UsuarioDoc[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // Filters for Students
  const [busca, setBusca] = useState('');
  const [filtroVolume, setFiltroVolume] = useState('todos');
  const [filtroEstagio, setFiltroEstagio] = useState('todos');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'volume' | 'progresso_desc' | 'estagio'>('estagio');

  // Accordion for official reference rules
  const [showRulesAccordion, setShowRulesAccordion] = useState(false);

  // Methods Catalog state
  const [metodosCatalogo, setMetodosCatalogo] = useState<MetodoCadastradoDoc[]>([]);
  const [loadingCatalogo, setLoadingCatalogo] = useState(false);
  const [buscaMetodo, setBuscaMetodo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');

  // Modal State for Registering / Editing a Method
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<MetodoCadastradoDoc | null>(null);
  const [savingMethod, setSavingMethod] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Fields
  const [formNome, setFormNome] = useState('');
  const [formSubtitulo, setFormSubtitulo] = useState('');
  const [formAutor, setFormAutor] = useState('');
  const [formCategoria, setFormCategoria] = useState<MetodoCategoria>('Técnica e Dedilhado');
  const [formTipoDivisao, setFormTipoDivisao] = useState<MetodoTipoDivisao>('licoes');
  const [formTotalItens, setFormTotalItens] = useState<number | string>(25);
  const [formEstagioSugerido, setFormEstagioSugerido] = useState<MetodoEstagioSugerido>('RJM / Ensaio');
  const [formDescricao, setFormDescricao] = useState('');

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const data = await listStudents();
      setStudents(data);
    } catch (err) {
      console.error('Falha ao listar alunas:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchCatalogo = async () => {
    setLoadingCatalogo(true);
    try {
      const data = await listAllAvailableMethods();
      setMetodosCatalogo(data);
    } catch (err) {
      console.error('Falha ao listar catálogo de métodos:', err);
    } finally {
      setLoadingCatalogo(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCatalogo();
  }, []);

  // Open Modal to Create New Method
  const handleOpenCreateModal = () => {
    setEditingMethod(null);
    setFormNome('');
    setFormSubtitulo('');
    setFormAutor('');
    setFormCategoria('Técnica e Dedilhado');
    setFormTipoDivisao('licoes');
    setFormTotalItens(25);
    setFormEstagioSugerido('RJM / Ensaio');
    setFormDescricao('');
    setModalOpen(true);
  };

  // Open Modal to Edit Existing Method
  const handleOpenEditModal = (metodo: MetodoCadastradoDoc) => {
    setEditingMethod(metodo);
    setFormNome(metodo.nome);
    setFormSubtitulo(metodo.subtitulo || '');
    setFormAutor(metodo.autor || '');
    setFormCategoria(metodo.categoria || 'Técnica e Dedilhado');
    setFormTipoDivisao(metodo.tipoDivisao || 'licoes');
    setFormTotalItens(metodo.totalItensEstimado || 25);
    setFormEstagioSugerido(metodo.estagioSugerido || 'RJM / Ensaio');
    setFormDescricao(metodo.descricao || '');
    setModalOpen(true);
  };

  // Save (Create or Update) Method
  const handleSaveMethodForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome.trim()) return;

    setSavingMethod(true);
    try {
      if (editingMethod) {
        // Update
        await updateCustomMethod(editingMethod.id, {
          nome: formNome.trim(),
          subtitulo: formSubtitulo.trim() || undefined,
          autor: formAutor.trim() || undefined,
          categoria: formCategoria,
          tipoDivisao: formTipoDivisao,
          totalItensEstimado: Number(formTotalItens) || undefined,
          estagioSugerido: formEstagioSugerido,
          descricao: formDescricao.trim() || undefined,
        });

        setFeedback({ type: 'success', text: `Método "${formNome.trim()}" atualizado com sucesso!` });
      } else {
        // Create
        await createCustomMethod({
          nome: formNome.trim(),
          subtitulo: formSubtitulo.trim() || undefined,
          autor: formAutor.trim() || undefined,
          categoria: formCategoria,
          tipoDivisao: formTipoDivisao,
          totalItensEstimado: Number(formTotalItens) || undefined,
          estagioSugerido: formEstagioSugerido,
          descricao: formDescricao.trim() || undefined,
          criadoPor: currentUser
            ? {
                uid: currentUser.uid,
                nome: currentUser.displayName || 'Examinadora / Instrutora',
                role: role || 'examinadora',
              }
            : undefined,
        });

        setFeedback({ type: 'success', text: `Novo método "${formNome.trim()}" cadastrado com sucesso no catálogo!` });
      }

      setModalOpen(false);
      await fetchCatalogo();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: 'error', text: 'Erro ao salvar método: ' + (err?.message || 'Erro') });
    } finally {
      setSavingMethod(false);
    }
  };

  // Delete Custom Method
  const handleDeleteCustomMethod = async (metodo: MetodoCadastradoDoc) => {
    if (metodo.isOficial) {
      alert('O Método Oficial CCB é a diretriz oficial da igreja e não pode ser removido.');
      return;
    }

    if (!window.confirm(`Tem certeza de que deseja remover o método "${metodo.nome}" do catálogo?`)) {
      return;
    }

    try {
      await deleteCustomMethod(metodo.id);
      setFeedback({ type: 'success', text: `Método "${metodo.nome}" removido com sucesso.` });
      await fetchCatalogo();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: 'error', text: 'Erro ao remover método: ' + (err?.message || 'Erro') });
    }
  };

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

  // Filtered Methods in Catalog
  const metodosFiltrados = useMemo(() => {
    return metodosCatalogo.filter((m) => {
      if (buscaMetodo.trim()) {
        const q = buscaMetodo.toLowerCase();
        const matchName = m.nome.toLowerCase().includes(q);
        const matchSub = m.subtitulo?.toLowerCase().includes(q);
        const matchAutor = m.autor?.toLowerCase().includes(q);
        if (!matchName && !matchSub && !matchAutor) return false;
      }

      if (filtroCategoria !== 'todas') {
        if (m.categoria !== filtroCategoria) return false;
      }

      return true;
    });
  }, [metodosCatalogo, buscaMetodo, filtroCategoria]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1 uppercase tracking-wider">
              <Music className="w-3 h-3" />
              Gestão de Métodos &bull; Examinadoras &amp; Instrutoras
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-purple-700 dark:text-purple-400" />
            Métodos de Estudo para Organistas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cadastre novos métodos pedagógicos (Burgmüller, Hanon, Czerny, Pedaleira) e acompanhe a evolução das alunas nos 4 Volumes oficiais.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {hubTab === 'catalogo' && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Método</span>
            </button>
          )}

          {hubTab === 'alunas' && (
            <button
              onClick={() => setShowRulesAccordion(!showRulesAccordion)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer border border-slate-300 dark:border-slate-700"
            >
              <Info className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              <span>{showRulesAccordion ? 'Ocultar Estrutura Oficial' : 'Consultar Volumes 1 ao 4'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <Info className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Section Tabs Switcher (Alunas vs Catálogo) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setHubTab('alunas')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            hubTab === 'alunas'
              ? 'bg-purple-700 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Acompanhamento das Alunas ({students.length})</span>
        </button>

        <button
          onClick={() => setHubTab('catalogo')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            hubTab === 'catalogo'
              ? 'bg-purple-700 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>Catálogo de Métodos ({metodosCatalogo.length})</span>
        </button>
      </div>

      {hubTab === 'catalogo' ? (
        /* ==================================================================== */
        /* ABA 2: CATÁLOGO DE MÉTODOS (CADASTRO E GERENCIAMENTO POR EXAMINADORAS) */
        /* ==================================================================== */
        <div className="space-y-5">
          {/* Header Banner for Methods Catalog */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Diversidade Pedagógica para as Organistas
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Catálogo de Métodos de Estudo
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                As candidatas podem trazer métodos complementares que estudam (Burgmüller, Hanon, Czerny, Pozzoli, etc.).
                Cadastre aqui novos métodos para que fiquem disponíveis na avaliação de cada aluna.
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer active:scale-95 shrink-0 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Cadastrar Novo Método</span>
            </button>
          </div>

          {/* Filters for Catalog */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar método por nome, autor ou subtítulo..."
                value={buscaMetodo}
                onChange={(e) => setBuscaMetodo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
              />
            </div>

            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium cursor-pointer focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
            >
              <option value="todas">Todas as Categorias</option>
              <option value="Oficial CCB">Oficial CCB</option>
              <option value="Técnica e Dedilhado">Técnica e Dedilhado</option>
              <option value="Pedaleira">Pedaleira</option>
              <option value="Teoria e Solfejo">Teoria e Solfejo</option>
              <option value="Repertório Complementar">Repertório Complementar</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {/* Catalog Grid */}
          {loadingCatalogo ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-700 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Carregando catálogo de métodos...</p>
            </div>
          ) : metodosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metodosFiltrados.map((metodo) => (
                <div
                  key={metodo.id}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                    metodo.isOficial
                      ? 'border-purple-300 dark:border-purple-800/80 bg-purple-50/20 dark:bg-purple-950/10'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                          metodo.isOficial
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                            : metodo.categoria === 'Pedaleira'
                            ? 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : metodo.categoria === 'Teoria e Solfejo'
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {metodo.categoria}
                      </span>

                      {metodo.estagioSugerido && (
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          {metodo.estagioSugerido}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {metodo.nome}
                    </h3>

                    {metodo.subtitulo && (
                      <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                        {metodo.subtitulo}
                      </p>
                    )}

                    {metodo.autor && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Autor / Origem: <span className="font-semibold text-slate-700 dark:text-slate-300">{metodo.autor}</span>
                      </p>
                    )}

                    {metodo.descricao && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed pt-1">
                        {metodo.descricao}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="capitalize">
                        {metodo.tipoDivisao === 'volumes'
                          ? 'Volumes'
                          : metodo.tipoDivisao === 'paginas'
                          ? 'Páginas'
                          : 'Lições / Exercícios'}
                      </span>
                      {metodo.totalItensEstimado ? <span>({metodo.totalItensEstimado} itens)</span> : null}
                    </div>

                    {!metodo.isOficial ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(metodo)}
                          title="Editar informações do método"
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-purple-600 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomMethod(metodo)}
                          title="Remover do catálogo"
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300">
                        Padrão Oficial
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhum método encontrado</p>
              <p className="text-xs text-slate-400 mt-1">Ajuste os filtros de busca ou cadastre um novo método.</p>
              <button
                onClick={handleOpenCreateModal}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Primeiro Método</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ==================================================================== */
        /* ABA 1: ACOMPANHAMENTO DAS ALUNAS NOS MÉTODOS                        */
        /* ==================================================================== */
        <div className="space-y-6">
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
            {loadingStudents ? (
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
      )}

      {/* ==================================================================== */}
      {/* MODAL: CADASTRAR OU EDITAR MÉTODO (EXAMINADORAS & INSTRUTORAS)        */}
      {/* ==================================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {editingMethod ? 'Editar Método de Estudo' : 'Cadastrar Novo Método de Estudo'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Disponibilize novos livros e cadernos para que examinadoras e instrutoras possam avaliar alunas.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveMethodForm} className="p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nome do Método / Livro <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="Ex: Burgmüller Op. 100, Hanon - O Pianista Virtuoso, Czerny Op. 599..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
                  />
                </div>

                {/* Subtítulo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subtítulo / Edição:
                  </label>
                  <input
                    type="text"
                    value={formSubtitulo}
                    onChange={(e) => setFormSubtitulo(e.target.value)}
                    placeholder="Ex: 25 Estudos Fáceis e Progressivos"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
                  />
                </div>

                {/* Autor */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Autor / Compositor:
                  </label>
                  <input
                    type="text"
                    value={formAutor}
                    onChange={(e) => setFormAutor(e.target.value)}
                    placeholder="Ex: Friedrich Burgmüller, C. L. Hanon..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Categoria Pedagógica:
                  </label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value as MetodoCategoria)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="Técnica e Dedilhado">Técnica e Dedilhado</option>
                    <option value="Pedaleira">Pedaleira</option>
                    <option value="Teoria e Solfejo">Teoria e Solfejo</option>
                    <option value="Repertório Complementar">Repertório Complementar</option>
                    <option value="Oficial CCB">Oficial CCB</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Forma de Divisão */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Forma de Divisão:
                  </label>
                  <select
                    value={formTipoDivisao}
                    onChange={(e) => setFormTipoDivisao(e.target.value as MetodoTipoDivisao)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="licoes">Por Lições / Exercícios / Estudos</option>
                    <option value="paginas">Por Páginas</option>
                    <option value="volumes">Por Volumes / Cadernos</option>
                  </select>
                </div>

                {/* Total de Itens Estimado */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Estimado de Lições / Páginas:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formTotalItens}
                    onChange={(e) => setFormTotalItens(e.target.value)}
                    placeholder="Ex: 25"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
                  />
                </div>

                {/* Estágio Sugerido */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Estágio Recomendado de Aplicação:
                  </label>
                  <select
                    value={formEstagioSugerido}
                    onChange={(e) => setFormEstagioSugerido(e.target.value as MetodoEstagioSugerido)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="RJM / Ensaio">RJM / Ensaio</option>
                    <option value="Culto Oficial">Culto Oficial</option>
                    <option value="Oficialização">Oficialização</option>
                    <option value="Livre / Todos os Níveis">Livre / Todos os Níveis</option>
                  </select>
                </div>

                {/* Descrição */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Orientações Pedagógicas &amp; Objetivos do Método:
                  </label>
                  <textarea
                    rows={3}
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    placeholder="Descreva o propósito deste método: desenvolvimento de independência das mãos, dedilhado rápido, toque legato, estudos de pedaleira..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={savingMethod}
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  {savingMethod ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{editingMethod ? 'Salvar Alterações' : 'Cadastrar Método'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
