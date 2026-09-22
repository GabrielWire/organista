import type { InstrumentoMetodosConfig } from '../types/metodo';

/**
 * Catálogo Oficial de Métodos para Instrumentos da Congregação Cristã no Brasil (CCB)
 * Fonte: Circular Oficial de Sugestão de Métodos para Instrumentos - JAN/2018
 */
export const METODOS_INSTRUMENTOS_CONFIG: Record<string, InstrumentoMetodosConfig> = {
  // --------------------------------------------------------------------------
  // CORDAS
  // --------------------------------------------------------------------------
  violino: {
    instrumentoId: 'violino',
    instrumentoNome: 'Violino (Dó)',
    familia: 'Cordas',
    observacoesGerais: {
      rjm: 'Hinos 431 a 480 soprano no natural.',
      culto: 'Hinário completo soprano 8ª acima.',
      oficializacao: 'Hinário completo soprano 8ª acima e contralto natural.',
    },
    metodos: [
      {
        id: 'laoureux_violino',
        nome: 'N. Laoureux (Vol. 1 e 3)',
        subtitulo: 'Método Clássico Tradicional',
        exigencias: {
          rjm: { descricao: 'Vol. 1 até pág. 35' },
          culto: { descricao: 'Vol. 1 completo + Vol. 3 até pág. 15' },
          oficializacao: { descricao: 'Vol. 1 completo + Vol. 3 até pág. 24 e da pág. 44 a 53' },
        },
      },
      {
        id: 'ccb_sitt_violino',
        nome: 'Método CCB + H. Sitt (Op. 32 Vol. 1)',
        subtitulo: 'Edição Oficial CCB',
        exigencias: {
          rjm: { descricao: 'CCB até pág. 46 (lição 113) + H. Sitt Vol. 1 até lição 6' },
          culto: { descricao: 'CCB até pág. 67 (lição 162) + H. Sitt Vol. 1 até lição 14' },
          oficializacao: { descricao: 'Método CCB completo + H. Sitt Op. 32 Vol. 1 completo' },
        },
      },
      {
        id: 'britten_violino',
        nome: 'Método Facilitado (Ed. Britten)',
        subtitulo: 'Edição Britten para Violino',
        exigencias: {
          rjm: { descricao: 'Até pág. 40' },
          culto: { descricao: 'Até pág. 55' },
          oficializacao: { descricao: 'Método Facilitado Completo' },
        },
      },
    ],
  },

  viola: {
    instrumentoId: 'viola',
    instrumentoNome: 'Viola (Dó)',
    familia: 'Cordas',
    observacoesGerais: {
      rjm: 'Hinos 431 a 480 tenor no natural.',
      culto: 'Hinário completo tenor no natural.',
      oficializacao: '1ª a 3ª posições, hinário completo, tenor no natural.',
    },
    metodos: [
      {
        id: 'volmer_herfurth_viola',
        nome: 'Beginning Strings + Berta Volmer / A Tune A Day',
        subtitulo: 'Tradicional Berta Volmer',
        exigencias: {
          rjm: { descricao: 'Beginning Strings até lição VI + Berta Volmer Vol. 1 até pág. 31' },
          culto: { descricao: 'Berta Volmer Vol. 1 até pág. 62 + A Tune A Day (Herfurth) Vol. 3 até pág. 16' },
          oficializacao: { descricao: 'Berta Volmer Vol. 1 completo + A Tune A Day (Herfurth) Vol. 3 completo' },
        },
      },
      {
        id: 'britten_viola',
        nome: 'Método Facilitado (Ed. Britten)',
        subtitulo: 'Edição Britten para Viola',
        exigencias: {
          rjm: { descricao: 'Até pág. 40' },
          culto: { descricao: 'Até pág. 55' },
          oficializacao: { descricao: 'Método Facilitado Completo' },
        },
      },
    ],
  },

  violoncelo: {
    instrumentoId: 'violoncelo',
    instrumentoNome: 'Violoncelo (Dó)',
    familia: 'Cordas',
    observacoesGerais: {
      rjm: 'Hinos 431 a 480 baixo no natural.',
      culto: 'Hinário completo baixo no natural.',
      oficializacao: 'Hinário completo baixo no natural.',
    },
    metodos: [
      {
        id: 'dotzauer_violoncelo',
        nome: 'Beginning Strings + Dotzauer (Vol. 1 e 2)',
        subtitulo: 'Estudos Dotzauer',
        exigencias: {
          rjm: { descricao: 'Beginning Strings até lição VI + Dotzauer Vol. 1 até pág. 34 (lição 80)' },
          culto: { descricao: 'Dotzauer Vol. 1 completo + Dotzauer Vol. 2 até pág. 03 (lição 111)' },
          oficializacao: { descricao: 'Dotzauer Vol. 1 completo + Dotzauer Vol. 2 até pág. 19 (lição 154)' },
        },
      },
      {
        id: 'britten_violoncelo',
        nome: 'Método Facilitado (Ed. Britten)',
        subtitulo: 'Edição Britten para Violoncelo',
        exigencias: {
          rjm: { descricao: 'Até pág. 40' },
          culto: { descricao: 'Até pág. 52' },
          oficializacao: { descricao: 'Método Facilitado Completo' },
        },
      },
    ],
  },

  orgao: {
    instrumentoId: 'orgao',
    instrumentoNome: 'Órgão Eletrônico (Dó)',
    familia: 'Cordas',
    observacoesGerais: {
      rjm: 'Hinos 431 a 480 (Mão direita + Pedaleira).',
      culto: 'Hinário completo (4 vozes + Pedaleira).',
      oficializacao: 'Hinário completo com pedaleira e meia-hora.',
    },
    metodos: [
      {
        id: 'metodo_orgao_ccb',
        nome: 'Cadernos Oficiais de Órgão CCB (Volume 1 a 4)',
        subtitulo: 'Grade de Estudos Oficiais para Organistas',
        exigencias: {
          rjm: { descricao: 'Volume 1 e 2 concluídos + Hinos de Jovens' },
          culto: { descricao: 'Volume 3 até a metade + Hinário completo' },
          oficializacao: { descricao: 'Volume 1 ao 4 completos + Pedaleira independente' },
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // MADEIRAS
  // --------------------------------------------------------------------------
  flauta: {
    instrumentoId: 'flauta',
    instrumentoNome: 'Flauta Transversal (Dó)',
    familia: 'Madeiras',
    metodos: [
      {
        id: 'pares_flauta',
        nome: 'Pares',
        subtitulo: 'Estudos de Escalas e Mecanismos',
        exigencias: {
          rjm: { descricao: 'Até lição 41' },
          culto: { descricao: 'Até lição 62' },
          oficializacao: { descricao: 'Método Completo' },
        },
      },
      {
        id: 'galli_flauta',
        nome: 'Galli',
        subtitulo: 'Método de Flauta',
        exigencias: {
          rjm: { descricao: 'Até pág. 41' },
          culto: { descricao: 'Método Completo' },
          oficializacao: { descricao: 'Método Completo' },
        },
      },
      {
        id: 'almeida_dias_flauta',
        nome: 'Método Prático - Almeida Dias',
        subtitulo: 'Método Prático CCB',
        exigencias: {
          rjm: { descricao: 'Até fase 13' },
          culto: { descricao: 'Até fase 25' },
          oficializacao: { descricao: 'Método Completo' },
        },
      },
    ],
  },

  oboe: {
    instrumentoId: 'oboe',
    instrumentoNome: 'Oboé (Dó) / Oboé d\'Amore / Corne Inglês',
    familia: 'Madeiras',
    metodos: [
      {
        id: 'rubank_oboe',
        nome: 'Rubank (Elementary & Intermediate)',
        subtitulo: 'Rubank Educational Library',
        exigencias: {
          rjm: { descricao: 'Rubank Elementary Method - Completo' },
          culto: { descricao: 'Rubank Intermediate Method até pág. 16' },
          oficializacao: { descricao: 'Rubank Intermediate Method até pág. 30' },
        },
      },
      {
        id: 'giampieri_oboe',
        nome: 'Giampieri',
        subtitulo: 'Metodo Progressivo per Oboe',
        exigencias: {
          rjm: { descricao: 'Até pág. 21' },
          culto: { descricao: 'Até pág. 30' },
          oficializacao: { descricao: 'Até pág. 50' },
        },
      },
    ],
  },

  fagote: {
    instrumentoId: 'fagote',
    instrumentoNome: 'Fagote (Dó)',
    familia: 'Madeiras',
    metodos: [
      {
        id: 'giampieri_fagote',
        nome: 'Giampieri',
        subtitulo: 'Metodo Progressivo per Fagotto',
        exigencias: {
          rjm: { descricao: 'Até pág. 18' },
          culto: { descricao: 'Até pág. 26' },
          oficializacao: { descricao: 'Até pág. 43' },
        },
      },
      {
        id: 'weissenborn_fagote',
        nome: 'Weissenborn',
        subtitulo: 'Bassoon Studies',
        exigencias: {
          rjm: { descricao: 'Até Módulo 12' },
          culto: { descricao: 'Até Módulo 18' },
          oficializacao: { descricao: 'Até Módulo 22' },
        },
      },
    ],
  },

  clarinete_sib: {
    instrumentoId: 'clarinete_sib',
    instrumentoNome: 'Clarinete Soprano (Si♭)',
    familia: 'Madeiras',
    metodos: [
      {
        id: 'giampieri_clarinete',
        nome: 'Giampieri',
        subtitulo: 'Metodo Progressivo per Clarinetto',
        exigencias: {
          rjm: { descricao: 'Até pág. 28' },
          culto: { descricao: 'Até pág. 41' },
          oficializacao: { descricao: 'Até pág. 63' },
        },
      },
      {
        id: 'domingos_pecci_clarinete',
        nome: 'Domingos Pecci',
        subtitulo: 'Método para Clarinete',
        exigencias: {
          rjm: { descricao: 'Até pág. 29' },
          culto: { descricao: 'Até pág. 36' },
          oficializacao: { descricao: 'Método Completo' },
        },
      },
      {
        id: 'galper_clarinete',
        nome: 'Galper (Book 1 e 2)',
        subtitulo: 'Clarinet Method by Avrahm Galper',
        exigencias: {
          rjm: { descricao: 'Book 1 Lição 26 (Até exercício 110)' },
          culto: { descricao: 'Book 1 Completo + Book 2 até pág. 18' },
          oficializacao: { descricao: 'Book 1 Completo + Book 2 até pág. 29' },
        },
      },
      {
        id: 'nabor_pires_clarinete',
        nome: 'Nabor Pires Camargo',
        subtitulo: 'Método de Clarinete',
        exigencias: {
          rjm: { descricao: 'Até lição 26' },
          culto: { descricao: 'Até lição 36' },
          oficializacao: { descricao: 'Método Completo' },
        },
      },
    ],
  },

  clarinete_baixo: {
    instrumentoId: 'clarinete_baixo',
    instrumentoNome: 'Clarinete Alto (Mi♭) / Clarinete Baixo / Clarone (Si♭)',
    familia: 'Madeiras',
    metodos: [
      {
        id: 'giampieri_clarone',
        nome: 'Giampieri',
        subtitulo: 'Metodo Progressivo',
        exigencias: {
          rjm: { descricao: 'Até pág. 28' },
          culto: { descricao: 'Até pág. 36' },
          oficializacao: { descricao: 'Método Completo' },
        },
      },
      {
        id: 'galper_clarone',
        nome: 'Galper (Book 1 e 2)',
        subtitulo: 'Clarinet Method by Avrahm Galper',
        exigencias: {
          rjm: { descricao: 'Book 1 Lição 26 (Até exercício 110)' },
          culto: { descricao: 'Book 1 Completo + Book 2 até pág. 18' },
          oficializacao: { descricao: 'Book 1 Completo + Book 2 até pág. 29' },
        },
      },
    ],
  },

  saxofone: {
    instrumentoId: 'saxofone',
    instrumentoNome: 'Saxofone (Soprano, Alto, Tenor, Barítono)',
    familia: 'Madeiras',
    metodos: [
      {
        id: 'amadeu_russo_sax',
        nome: 'Amadeu Russo',
        subtitulo: 'Método Completo para Saxofone',
        exigencias: {
          rjm: { descricao: 'Até pág. 25' },
          culto: { descricao: 'Até pág. 40' },
          oficializacao: { descricao: 'Até pág. 55' },
        },
      },
      {
        id: 'giampieri_sax',
        nome: 'Giampieri',
        subtitulo: 'Metodo Progressivo per Saxofono',
        exigencias: {
          rjm: { descricao: 'Até pág. 21' },
          culto: { descricao: 'Até pág. 30' },
          oficializacao: { descricao: 'Até pág. 50' },
        },
      },
      {
        id: 'almeida_dias_sax',
        nome: 'Método Prático - Almeida Dias',
        subtitulo: 'Método Prático CCB para Saxofone',
        exigencias: {
          rjm: { descricao: 'Até fase 13' },
          culto: { descricao: 'Até fase 25' },
          oficializacao: { descricao: 'Método Completo' },
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // METAIS
  // --------------------------------------------------------------------------
  trompete: {
    instrumentoId: 'trompete',
    instrumentoNome: 'Trompete / Cornet / Flugelhorn (Si♭)',
    familia: 'Metais',
    metodos: [
      {
        id: 'rubank_getchel_trompete',
        nome: 'Rubank Elementary + Robert W. Getchel',
        subtitulo: 'Métodos Recomendados para Trompete',
        exigencias: {
          rjm: { descricao: 'Rubank Elementary Method Completo' },
          culto: { descricao: 'Robert W. Getchel (Second Book) ex. 65 a 94' },
          oficializacao: { descricao: 'Robert W. Getchel (Second Book) Completo' },
        },
      },
      {
        id: 'amadeu_russo_trompete',
        nome: 'Amadeu Russo',
        subtitulo: 'Método para Trompete',
        exigencias: {
          rjm: { descricao: 'Até pág. 20' },
          culto: { descricao: 'Até pág. 30' },
          oficializacao: { descricao: 'Até pág. 41' },
        },
      },
      {
        id: 'almeida_dias_trompete',
        nome: 'Método Prático - Almeida Dias',
        subtitulo: 'Método Prático CCB',
        exigencias: {
          rjm: { descricao: 'Até fase 13' },
          culto: { descricao: 'Até fase 25' },
          oficializacao: { descricao: 'Método Completo' },
        },
      },
    ],
  },

  trompa: {
    instrumentoId: 'trompa',
    instrumentoNome: 'Trompa (Fá / Si♭)',
    familia: 'Metais',
    metodos: [
      {
        id: 'rubank_trompa',
        nome: 'Rubank + Método Prático para Trompa',
        subtitulo: 'Estudos Específicos para Trompa',
        exigencias: {
          rjm: { descricao: 'Rubank Elementary completo + Método Prático para Trompa até lição 73' },
          culto: { descricao: 'Rubank Elementary completo + Rubank Intermediate completo + Método Prático até lição 105' },
          oficializacao: { descricao: 'Rubank Elementary + Rubank Intermediate completos + Método Prático Completo' },
        },
      },
    ],
  },

  trombone: {
    instrumentoId: 'trombone',
    instrumentoNome: 'Trombone / Eufônio / Bombardino',
    familia: 'Metais',
    metodos: [
      {
        id: 'rubank_trombone',
        nome: 'Rubank Elementary for Trombone',
        subtitulo: 'Rubank Educational Library',
        exigencias: {
          rjm: { descricao: 'Até pág. 24' },
          culto: { descricao: 'Até pág. 37' },
          oficializacao: { descricao: 'Até pág. 48' },
        },
      },
      {
        id: 'almeida_dias_trombone',
        nome: 'Método Prático - Almeida Dias',
        subtitulo: 'Método Prático CCB para Trombone',
        exigencias: {
          rjm: { descricao: 'Até fase 13' },
          culto: { descricao: 'Até fase 25' },
          oficializacao: { descricao: 'Método Completo' },
        },
      },
    ],
  },

  tuba: {
    instrumentoId: 'tuba',
    instrumentoNome: 'Tuba (Si♭, Dó, Mi♭, Fá)',
    familia: 'Metais',
    metodos: [
      {
        id: 'rubank_tuba',
        nome: 'Rubank Elementary for Tuba',
        subtitulo: 'Rubank Educational Library',
        exigencias: {
          rjm: { descricao: 'Até pág. 24' },
          culto: { descricao: 'Até pág. 37' },
          oficializacao: { descricao: 'Até pág. 48' },
        },
      },
      {
        id: 'almeida_dias_tuba',
        nome: 'Método Prático - Almeida Dias',
        subtitulo: 'Método Prático CCB para Tuba',
        exigencias: {
          rjm: { descricao: 'Até fase 13' },
          culto: { descricao: 'Até fase 25' },
          oficializacao: { descricao: 'Método Completo' },
        },
      },
    ],
  },
};

/**
 * Resolves the methods configuration for any instrument string.
 */
export function getMetodosConfigForInstrumento(rawInstrumento?: string): InstrumentoMetodosConfig {
  if (!rawInstrumento) return METODOS_INSTRUMENTOS_CONFIG.violino;
  const str = rawInstrumento.toLowerCase();

  if (str.includes('sax')) return METODOS_INSTRUMENTOS_CONFIG.saxofone;
  if (str.includes('clarone') || str.includes('baixo') || str.includes('alto (mi♭)')) {
    if (str.includes('clarin')) return METODOS_INSTRUMENTOS_CONFIG.clarinete_baixo;
  }
  if (str.includes('clarin')) return METODOS_INSTRUMENTOS_CONFIG.clarinete_sib;
  if (str.includes('flauta')) return METODOS_INSTRUMENTOS_CONFIG.flauta;
  if (str.includes('oboe') || str.includes('oboé') || str.includes('corne')) return METODOS_INSTRUMENTOS_CONFIG.oboe;
  if (str.includes('fagote')) return METODOS_INSTRUMENTOS_CONFIG.fagote;
  if (str.includes('trompete') || str.includes('cornet') || str.includes('flugel')) return METODOS_INSTRUMENTOS_CONFIG.trompete;
  if (str.includes('trompa')) return METODOS_INSTRUMENTOS_CONFIG.trompa;
  if (str.includes('trombone') || str.includes('euf') || str.includes('bombardino')) return METODOS_INSTRUMENTOS_CONFIG.trombone;
  if (str.includes('tuba') || str.includes('souza')) return METODOS_INSTRUMENTOS_CONFIG.tuba;
  if (str.includes('viola')) return METODOS_INSTRUMENTOS_CONFIG.viola;
  if (str.includes('cel') || str.includes('violoncelo')) return METODOS_INSTRUMENTOS_CONFIG.violoncelo;
  if (str.includes('orgao') || str.includes('órgão')) return METODOS_INSTRUMENTOS_CONFIG.orgao;

  return METODOS_INSTRUMENTOS_CONFIG.violino;
}
