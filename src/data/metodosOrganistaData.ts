import type { InstrumentoMetodosConfig, MetodoOpcaoDef, MetodoVolumeDef } from '../types/metodo';

/**
 * Catálogo Oficial do Método de Estudos para Órgão Eletrônico CCB (Volumes 1 ao 4)
 * Publicação Oficial da Congregação Cristã no Brasil
 */
export const METODO_OFICIAL_ORGAO_CCB: MetodoOpcaoDef = {
  id: 'metodo_oficial_orgao_ccb',
  nome: 'Método de Estudos para Órgão Eletrônico CCB',
  subtitulo: 'Volumes 1 ao 4 - Grade Oficial para Organistas da CCB',
  volumes: [
    {
      volume: 1,
      id: 'volume_1',
      nome: 'Volume 1 - Iniciação Musical ao Órgão',
      subtitulo: 'Fundamentos, Postura e Primeiras Lições a Duas Mãos',
      descricao: 'Introdução ao estudo do órgão eletrônico, digitação correta, claves de Sol e Fá, figuras musicais, toque ligado e primeiras peças a duas mãos (soprano e contralto/baixo).',
      objetivos: [
        'Postura correta ao órgão e posicionamento das mãos e dedos',
        'Leitura simultânea na Clave de Sol (Mão Direita) e Clave de Fá (Mão Esquerda)',
        'Desenvolvimento da percepção rítmica e toque legato contínuo',
        'Execução das primeiras lições preparatórias e pequenos hinos',
      ],
      totalPaginasSugeridas: 60,
    },
    {
      volume: 2,
      id: 'volume_2',
      nome: 'Volume 2 - Desenvolvimento & Introdução à Pedaleira',
      subtitulo: 'Independência das Mãos e Primeiras Notas na Pedaleira',
      descricao: 'Exercícios de coordenação motora, independência entre as mãos e início do uso da pedaleira. Estágio fundamental para aptidão na Reunião de Jovens e Menores.',
      objetivos: [
        'Coordenação motora entre mão direita, mão esquerda e pedaleira',
        'Estudo de notas na pedaleira em Clave de Fá',
        'Hinos de Jovens e Menores (431 a 480) com pedaleira',
        'Primeiros hinos da Fase 1 com acompanhamento de pedaleira',
      ],
      totalPaginasSugeridas: 70,
      estagioVinculado: 'rjm',
      estagioRotulo: 'Apta para RJM / Ensaios',
    },
    {
      volume: 3,
      id: 'volume_3',
      nome: 'Volume 3 - Técnica Intermediária & 4 Vozes com Pedaleira',
      subtitulo: 'Articulação, Escalas, Arpejos e Hinário Completo',
      descricao: 'Aprofundamento técnico, substituição de dedos em notas presas sem interromper o som, hinos a 4 vozes reais com pedaleira. Estágio de aptidão para os Cultos Oficiais.',
      objetivos: [
        'Substituição de dedos e ligaduras de expressão no órgão',
        'Execução fluente de hinos a 4 vozes com pedaleira',
        'Domínio dos hinos das Fases 1, 2 e 3 de dificuldade',
        'Controle do pedal de expressão e noções de registração sacra',
      ],
      totalPaginasSugeridas: 80,
      estagioVinculado: 'culto',
      estagioRotulo: 'Apta para Culto Oficial',
    },
    {
      volume: 4,
      id: 'volume_4',
      nome: 'Volume 4 - Aperfeiçoamento, Registração & Oficialização',
      subtitulo: 'Expressividade, Pedaleira Avançada e Hinos de Meia-Hora',
      descricao: 'Domínio interpretativo sacro, registração adequada para cada hino e momento do culto, execução com pedaleira independente em todo o Hinário 5 e hinos da Meia-Hora. Preparação para o Exame de Oficialização.',
      objetivos: [
        'Pedaleira avançada com independência total e agilidade técnica',
        'Execução segura de todos os 480 hinos do Hinário 5 (Fases 1 a 5)',
        'Execução expressiva dos hinos solenes para a Meia-Hora',
        'Conhecimento litúrgico dos momentos do culto e sonoridade sacra',
      ],
      totalPaginasSugeridas: 90,
      estagioVinculado: 'oficializacao',
      estagioRotulo: 'Apta para Oficialização',
    },
  ],
  exigencias: {
    rjm: {
      descricao: 'Volumes 1 e 2 concluídos + Hinos de Jovens (431 a 480) e hinos da Fase 1 com pedaleira.',
      observacao: 'Apta a tocar nas Reuniões de Jovens e Menores e Ensaios Locais.',
    },
    culto: {
      descricao: 'Volume 3 concluído + Domínio de hinos das Fases 1, 2 e 3 com 4 vozes e pedaleira.',
      observacao: 'Apta a tocar nos Cultos Oficiais da congregação.',
    },
    oficializacao: {
      descricao: 'Volume 4 concluído + Hinário completo (480 hinos com pedaleira) + Hinos de Meia-Hora.',
      observacao: 'Apta para o Exame de Oficialização de Organistas da CCB.',
    },
  },
};

export const CONFIG_METODOS_ORGANISTA: InstrumentoMetodosConfig = {
  instrumentoId: 'orgao',
  instrumentoNome: 'Órgão Eletrônico (Dó)',
  familia: 'Cordas',
  metodos: [METODO_OFICIAL_ORGAO_CCB],
  observacoesGerais: {
    rjm: 'Volumes 1 e 2 concluídos + Hinos de Jovens (431 a 480) com pedaleira.',
    culto: 'Volume 3 concluído + Hinário até Fase 3 a 4 vozes com pedaleira.',
    oficializacao: 'Volume 4 concluído + Hinário completo (480 hinos) com pedaleira independente + Meia-Hora.',
  },
};

export const METODOS_ORGANISTA_DATA: MetodoVolumeDef[] = METODO_OFICIAL_ORGAO_CCB.volumes || [];

