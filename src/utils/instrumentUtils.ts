import { INSTRUMENTOS, type Instrumento } from '../data/instrumentsData';

export interface InstrumentoItem {
  id: string;
  nomeExibicao: string;
  categoria: string;
  afinacao: string;
  clave: string;
}

export const INSTRUMENTOS_CATEGORIZADOS: { categoria: string; itens: InstrumentoItem[] }[] = [
  {
    categoria: 'Cordas e Teclados',
    itens: [
      { id: 'violino', nomeExibicao: 'Violino (Dó)', categoria: 'Cordas', afinacao: 'Dó', clave: 'Clave de Sol' },
      { id: 'viola', nomeExibicao: 'Viola (Dó)', categoria: 'Cordas', afinacao: 'Dó', clave: 'Clave de Dó na 3ª linha' },
      { id: 'violoncelo', nomeExibicao: 'Violoncelo (Dó)', categoria: 'Cordas', afinacao: 'Dó', clave: 'Clave de Fá na 4ª linha' },
      { id: 'orgao', nomeExibicao: 'Órgão Eletrônico (Dó)', categoria: 'Cordas e Teclados', afinacao: 'Dó', clave: 'Sol e Fá' },
    ],
  },
  {
    categoria: 'Madeiras',
    itens: [
      { id: 'flauta', nomeExibicao: 'Flauta Transversal (Dó)', categoria: 'Madeiras', afinacao: 'Dó', clave: 'Clave de Sol' },
      { id: 'oboe', nomeExibicao: 'Oboé (Dó)', categoria: 'Madeiras', afinacao: 'Dó', clave: 'Clave de Sol' },
      { id: 'oboe_damore', nomeExibicao: "Oboé d'Amore (Lá)", categoria: 'Madeiras', afinacao: 'Lá', clave: 'Clave de Sol' },
      { id: 'corne_ingles', nomeExibicao: 'Corne Inglês (Fá)', categoria: 'Madeiras', afinacao: 'Fá', clave: 'Clave de Sol' },
      { id: 'fagote', nomeExibicao: 'Fagote (Dó)', categoria: 'Madeiras', afinacao: 'Dó', clave: 'Clave de Fá na 4ª linha' },
      { id: 'clarinete_sib', nomeExibicao: 'Clarinete Soprano (Si♭)', categoria: 'Madeiras', afinacao: 'Si♭', clave: 'Clave de Sol' },
      { id: 'clarinete_alto_mib', nomeExibicao: 'Clarinete Alto (Mi♭)', categoria: 'Madeiras', afinacao: 'Mi♭', clave: 'Clave de Sol' },
      { id: 'clarone_sib', nomeExibicao: 'Clarinete Baixo / Clarone (Si♭)', categoria: 'Madeiras', afinacao: 'Si♭', clave: 'Clave de Sol / Fá' },
      { id: 'sax_soprano', nomeExibicao: 'Saxofone Soprano (Si♭)', categoria: 'Madeiras', afinacao: 'Si♭', clave: 'Clave de Sol' },
      { id: 'sax_alto', nomeExibicao: 'Saxofone Alto (Mi♭)', categoria: 'Madeiras', afinacao: 'Mi♭', clave: 'Clave de Sol' },
      { id: 'sax_tenor', nomeExibicao: 'Saxofone Tenor (Si♭)', categoria: 'Madeiras', afinacao: 'Si♭', clave: 'Clave de Sol' },
      { id: 'sax_baritono', nomeExibicao: 'Saxofone Barítono (Mi♭)', categoria: 'Madeiras', afinacao: 'Mi♭', clave: 'Clave de Sol' },
    ],
  },
  {
    categoria: 'Metais',
    itens: [
      { id: 'trompete', nomeExibicao: 'Trompete / Cornet / Flugelhorn (Si♭)', categoria: 'Metais', afinacao: 'Si♭', clave: 'Clave de Sol' },
      { id: 'trompa', nomeExibicao: 'Trompa (Fá)', categoria: 'Metais', afinacao: 'Fá', clave: 'Clave de Sol / Fá' },
      { id: 'trombone', nomeExibicao: 'Trombone (de vara ou pisto) (Dó)', categoria: 'Metais', afinacao: 'Dó', clave: 'Clave de Fá na 4ª linha' },
      { id: 'eufonio', nomeExibicao: 'Eufônio / Bombardino (Si♭/Dó)', categoria: 'Metais', afinacao: 'Si♭', clave: 'Clave de Fá na 4ª linha' },
      { id: 'tuba', nomeExibicao: 'Tuba (Baixo) (Si♭/Mi♭)', categoria: 'Metais', afinacao: 'Si♭', clave: 'Clave de Fá na 4ª linha' },
    ],
  },
];

export const TODOS_INSTRUMENTOS_OFICIAIS: string[] = INSTRUMENTOS_CATEGORIZADOS.flatMap((cat) =>
  cat.itens.map((item) => item.nomeExibicao)
);

/**
 * Resolves any raw instrument string (e.g. "Sax", "Saxofone", "sax_alto", "Saxofone Alto (Mi♭)")
 * to the exact matching Instrumento object from INSTRUMENTOS data.
 */
export function resolveInstrumento(raw?: string): Instrumento {
  if (!raw || typeof raw !== 'string') {
    return INSTRUMENTOS[0]; // Default: Violino
  }

  const str = raw.trim().toLowerCase();

  // 1. Direct match by ID
  const byId = INSTRUMENTOS.find((i) => i.id.toLowerCase() === str);
  if (byId) return byId;

  // 2. Direct match by exact name
  const byExactName = INSTRUMENTOS.find((i) => i.nome.toLowerCase() === str);
  if (byExactName) return byExactName;

  // 3. Match from INSTRUMENTOS_CATEGORIZADOS display names
  for (const cat of INSTRUMENTOS_CATEGORIZADOS) {
    for (const item of cat.itens) {
      if (item.nomeExibicao.toLowerCase() === str || str.includes(item.nomeExibicao.toLowerCase())) {
        const found = INSTRUMENTOS.find((i) => i.id === item.id);
        if (found) return found;
      }
    }
  }

  // 4. Intelligent keyword & alias resolution
  if (str.includes('sax')) {
    if (str.includes('soprano')) return INSTRUMENTOS.find((i) => i.id === 'sax_soprano') || INSTRUMENTOS[0];
    if (str.includes('tenor')) return INSTRUMENTOS.find((i) => i.id === 'sax_tenor') || INSTRUMENTOS[0];
    if (str.includes('baritono') || str.includes('barítono')) return INSTRUMENTOS.find((i) => i.id === 'sax_baritono') || INSTRUMENTOS[0];
    // Default sax when unspecified or "sax alto"
    return INSTRUMENTOS.find((i) => i.id === 'sax_alto') || INSTRUMENTOS[0];
  }

  if (str.includes('clarin') || str.includes('clarone')) {
    if (str.includes('alto')) return INSTRUMENTOS.find((i) => i.id === 'clarinete_alto_mib') || INSTRUMENTOS[0];
    if (str.includes('baixo') || str.includes('clarone')) return INSTRUMENTOS.find((i) => i.id === 'clarone_sib') || INSTRUMENTOS[0];
    return INSTRUMENTOS.find((i) => i.id === 'clarinete_sib') || INSTRUMENTOS[0];
  }

  if (str.includes('violino')) return INSTRUMENTOS.find((i) => i.id === 'violino') || INSTRUMENTOS[0];
  if (str.includes('viola')) return INSTRUMENTOS.find((i) => i.id === 'viola') || INSTRUMENTOS[0];
  if (str.includes('cel') || str.includes('cello')) return INSTRUMENTOS.find((i) => i.id === 'violoncelo') || INSTRUMENTOS[0];
  if (str.includes('flaut')) return INSTRUMENTOS.find((i) => i.id === 'flauta') || INSTRUMENTOS[0];
  if (str.includes('trompet') || str.includes('cornet') || str.includes('flugel')) return INSTRUMENTOS.find((i) => i.id === 'trompete') || INSTRUMENTOS[0];
  if (str.includes('trompa')) return INSTRUMENTOS.find((i) => i.id === 'trompa') || INSTRUMENTOS[0];
  if (str.includes('trombon')) return INSTRUMENTOS.find((i) => i.id === 'trombone') || INSTRUMENTOS[0];
  if (str.includes('bombardin') || str.includes('eufon') || str.includes('eufôn')) return INSTRUMENTOS.find((i) => i.id === 'eufonio') || INSTRUMENTOS[0];
  if (str.includes('tuba') || str.includes('baixo')) return INSTRUMENTOS.find((i) => i.id === 'tuba') || INSTRUMENTOS[0];
  if (str.includes('org') || str.includes('órg')) return INSTRUMENTOS.find((i) => i.id === 'orgao') || INSTRUMENTOS[0];
  if (str.includes('fagot')) return INSTRUMENTOS.find((i) => i.id === 'fagote') || INSTRUMENTOS[0];
  if (str.includes('corne')) return INSTRUMENTOS.find((i) => i.id === 'corne_ingles') || INSTRUMENTOS[0];
  if (str.includes('obo')) {
    if (str.includes('damore') || str.includes("d'amore")) return INSTRUMENTOS.find((i) => i.id === 'oboe_damore') || INSTRUMENTOS[0];
    return INSTRUMENTOS.find((i) => i.id === 'oboe') || INSTRUMENTOS[0];
  }

  // 5. Fallback contains search in INSTRUMENTOS
  const fallback = INSTRUMENTOS.find((i) => i.nome.toLowerCase().includes(str) || str.includes(i.nome.toLowerCase()));
  return fallback || INSTRUMENTOS[0];
}

/**
 * Checks if a teacher/instructor is qualified to teach a specific student's instrument.
 * Robust matching supporting:
 * - Direct exact matches in instruments list
 * - Resolved instrument ID comparison
 * - General instructors (when no instruments specified or marked as all)
 */
export function isInstrutorHabilitadoParaInstrumento(
  instrutor: { instruments?: string[]; instrument?: string; role?: string },
  instrumentoAluno?: string
): boolean {
  if (!instrumentoAluno) return true;

  const list = instrutor.instruments;
  if (!list || list.length === 0) {
    const rawInst = (instrutor.instrument || '').toLowerCase();
    if (rawInst.includes('todos') || rawInst.includes('geral') || rawInst === '') {
      return true;
    }
  } else {
    if (list.some((i) => i.toLowerCase().includes('todos') || i.toLowerCase().includes('geral'))) {
      return true;
    }
  }

  const studentResolved = resolveInstrumento(instrumentoAluno);

  if (list && list.length > 0) {
    return list.some((inst) => {
      if (inst.trim().toLowerCase() === instrumentoAluno.trim().toLowerCase()) return true;
      const instResolved = resolveInstrumento(inst);
      return instResolved.id === studentResolved.id;
    });
  }

  if (instrutor.instrument) {
    const instResolved = resolveInstrumento(instrutor.instrument);
    return instResolved.id === studentResolved.id;
  }

  return false;
}

