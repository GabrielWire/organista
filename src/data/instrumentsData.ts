// Definição e catálogo completo dos instrumentos da orquestra da CCB
// e suas escalas correspondentes com suporte à transposição

export interface Escala {
  nome: string;
  armadura: string;
  acidentes: number;
  oitavas: number;
  notas: string;
  arpejo: string;
}

export interface Instrumento {
  id: string;
  nome: string;
  categoria: 'Cordas' | 'Cordas e Teclados' | 'Madeiras' | 'Metais';
  voz: string;
  afinacao: string;
  clave: string;
  hinario: string;
  transposicaoArmadura: number; // quantos acidentes adiciona na armadura (ex: +2 para Si♭, +3 para Mi♭, +1 para Fá)
  semitons: number;
  descricao: string;
  dicaGEM: string;
  escalasRecomendadas: Escala[];
}

export const INSTRUMENTOS: Instrumento[] = [
  {
    "id": "violino",
    "nome": "Violino",
    "categoria": "Cordas",
    "voz": "Soprano",
    "afinacao": "Dó",
    "clave": "Clave de Sol",
    "hinario": "Hinário em Dó",
    "transposicaoArmadura": 0,
    "semitons": 0,
    "descricao": "Executa principalmente a voz de Soprano (melodia principal). Instrumento não transpositor.",
    "dicaGEM": "Atenção especial à afinação das cordas soltas (Sol, Ré, Lá, Mi), postura do arco, sonoridade limpa e golpes de arco (detaché e legato).",
    "escalasRecomendadas": [
      {
        "nome": "Sol Maior",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Lá Maior",
        "armadura": "3♯",
        "acidentes": 3,
        "oitavas": 2,
        "notas": "Lá, Si, Dó♯, Ré, Mi, Fá♯, Sol♯, Lá",
        "arpejo": "Lá - Dó♯ - Mi - Lá"
      },
      {
        "nome": "Dó Maior",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Ré Maior",
        "armadura": "2♯",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Ré, Mi, Fá♯, Sol, Lá, Si, Dó♯, Ré",
        "arpejo": "Ré - Fá♯ - Lá - Ré"
      },
      {
        "nome": "Si♭ Maior",
        "armadura": "2♭",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Si♭, Dó, Ré, Mi♭, Fá, Sol, Lá, Si♭",
        "arpejo": "Si♭ - Ré - Fá - Si♭"
      },
      {
        "nome": "Fá Maior",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Mi♭ Maior",
        "armadura": "3♭",
        "acidentes": 3,
        "oitavas": 2,
        "notas": "Mi♭, Fá, Sol, Lá♭, Si♭, Dó, Ré, Mi♭",
        "arpejo": "Mi♭ - Sol - Si♭ - Mi♭"
      }
    ]
  },
  {
    "id": "viola",
    "nome": "Viola",
    "categoria": "Cordas",
    "voz": "Contralto",
    "afinacao": "Dó",
    "clave": "Clave de Dó na 3ª linha",
    "hinario": "Hinário em Dó (Clave de Dó)",
    "transposicaoArmadura": 0,
    "semitons": 0,
    "descricao": "Executa a voz de Contralto. Leitura essencial na Clave de Dó na 3ª linha.",
    "dicaGEM": "Fluência na Clave de Dó na 3ª linha e afinação das cordas Dó, Sol, Ré, Lá. Manter som aveludado e sustentação harmônica.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Ré Maior",
        "armadura": "2♯",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Ré, Mi, Fá♯, Sol, Lá, Si, Dó♯, Ré",
        "arpejo": "Ré - Fá♯ - Lá - Ré"
      },
      {
        "nome": "Fá Maior",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Si♭ Maior",
        "armadura": "2♭",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Si♭, Dó, Ré, Mi♭, Fá, Sol, Lá, Si♭",
        "arpejo": "Si♭ - Ré - Fá - Si♭"
      },
      {
        "nome": "Mi♭ Maior",
        "armadura": "3♭",
        "acidentes": 3,
        "oitavas": 2,
        "notas": "Mi♭, Fá, Sol, Lá♭, Si♭, Dó, Ré, Mi♭",
        "arpejo": "Mi♭ - Sol - Si♭ - Mi♭"
      }
    ]
  },
  {
    "id": "violoncelo",
    "nome": "Violoncelo",
    "categoria": "Cordas",
    "voz": "Tenor / Baixo",
    "afinacao": "Dó",
    "clave": "Clave de Fá na 4ª linha",
    "hinario": "Hinário em Dó (Clave de Fá)",
    "transposicaoArmadura": 0,
    "semitons": 0,
    "descricao": "Executa as vozes de Tenor ou Baixo. Alicerce harmônico nas cordas.",
    "dicaGEM": "Firmeza na 1ª à 4ª posições, precisão de afinação em Dó, Sol, Ré, Lá e sonoridade profunda com arco estável.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Ré Maior",
        "armadura": "2♯",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Ré, Mi, Fá♯, Sol, Lá, Si, Dó♯, Ré",
        "arpejo": "Ré - Fá♯ - Lá - Ré"
      },
      {
        "nome": "Fá Maior",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Si♭ Maior",
        "armadura": "2♭",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Si♭, Dó, Ré, Mi♭, Fá, Sol, Lá, Si♭",
        "arpejo": "Si♭ - Ré - Fá - Si♭"
      },
      {
        "nome": "Mi♭ Maior",
        "armadura": "3♭",
        "acidentes": 3,
        "oitavas": 2,
        "notas": "Mi♭, Fá, Sol, Lá♭, Si♭, Dó, Ré, Mi♭",
        "arpejo": "Mi♭ - Sol - Si♭ - Mi♭"
      }
    ]
  },
  {
    "id": "orgao",
    "nome": "Órgão Eletrônico",
    "categoria": "Cordas e Teclados",
    "voz": "4 Vozes + Pedaleira",
    "afinacao": "Dó",
    "clave": "Sol (S/C) e Fá (T/B/Pedaleira)",
    "hinario": "Hinário em Dó",
    "transposicaoArmadura": 0,
    "semitons": 0,
    "descricao": "Tocado exclusivamente por irmãs organistas na CCB. Toca as quatro vozes corais completas e a pedaleira.",
    "dicaGEM": "Independência motora mão direita (Soprano/Contralto), mão esquerda (Tenor) e pé esquerdo (Baixo na pedaleira). Atenção aos dedilhados com passagem de 5 na mão esquerda.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Fá Maior",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Ré Maior",
        "armadura": "2♯",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Ré, Mi, Fá♯, Sol, Lá, Si, Dó♯, Ré",
        "arpejo": "Ré - Fá♯ - Lá - Ré"
      },
      {
        "nome": "Si♭ Maior",
        "armadura": "2♭",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Si♭, Dó, Ré, Mi♭, Fá, Sol, Lá, Si♭",
        "arpejo": "Si♭ - Ré - Fá - Si♭"
      },
      {
        "nome": "Lá Maior",
        "armadura": "3♯",
        "acidentes": 3,
        "oitavas": 2,
        "notas": "Lá, Si, Dó♯, Ré, Mi, Fá♯, Sol♯, Lá",
        "arpejo": "Lá - Dó♯ - Mi - Lá"
      },
      {
        "nome": "Mi♭ Maior",
        "armadura": "3♭",
        "acidentes": 3,
        "oitavas": 2,
        "notas": "Mi♭, Fá, Sol, Lá♭, Si♭, Dó, Ré, Mi♭",
        "arpejo": "Mi♭ - Sol - Si♭ - Mi♭"
      },
      {
        "nome": "Lá♭ Maior",
        "armadura": "4♭",
        "acidentes": 4,
        "oitavas": 2,
        "notas": "Lá♭, Si♭, Dó, Ré♭, Mi♭, Fá, Sol, Lá♭",
        "arpejo": "Lá♭ - Dó - Mi♭ - Lá♭"
      }
    ]
  },
  {
    "id": "flauta",
    "nome": "Flauta Transversal",
    "categoria": "Madeiras",
    "voz": "Soprano",
    "afinacao": "Dó",
    "clave": "Clave de Sol",
    "hinario": "Hinário em Dó",
    "transposicaoArmadura": 0,
    "semitons": 0,
    "descricao": "Executa a voz de Soprano. Timbre brilhante que conduz a melodia na oitava superior.",
    "dicaGEM": "Controle de embocadura e coluna de ar para afinação precisa na 2ª e 3ª oitavas, sonoridade suave nas meias-horas.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Fá Maior",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Ré Maior",
        "armadura": "2♯",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Ré, Mi, Fá♯, Sol, Lá, Si, Dó♯, Ré",
        "arpejo": "Ré - Fá♯ - Lá - Ré"
      },
      {
        "nome": "Si♭ Maior",
        "armadura": "2♭",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Si♭, Dó, Ré, Mi♭, Fá, Sol, Lá, Si♭",
        "arpejo": "Si♭ - Ré - Fá - Si♭"
      },
      {
        "nome": "Mi♭ Maior",
        "armadura": "3♭",
        "acidentes": 3,
        "oitavas": 2,
        "notas": "Mi♭, Fá, Sol, Lá♭, Si♭, Dó, Ré, Mi♭",
        "arpejo": "Mi♭ - Sol - Si♭ - Mi♭"
      }
    ]
  },
  {
    "id": "oboe",
    "nome": "Oboé",
    "categoria": "Madeiras",
    "voz": "Soprano",
    "afinacao": "Dó",
    "clave": "Clave de Sol",
    "hinario": "Hinário em Dó",
    "transposicaoArmadura": 0,
    "semitons": 0,
    "descricao": "Executa a voz de Soprano com timbre penetrante e expressivo de palheta dupla.",
    "dicaGEM": "Ajuste e controle da palheta dupla, afinação constante e sustentação delicada sem sobressair exageradamente.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Fá Maior",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Ré Maior",
        "armadura": "2♯",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Ré, Mi, Fá♯, Sol, Lá, Si, Dó♯, Ré",
        "arpejo": "Ré - Fá♯ - Lá - Ré"
      }
    ]
  },
  {
    "id": "oboe_damore",
    "nome": "Oboé d'Amore",
    "categoria": "Madeiras",
    "voz": "Soprano / Contralto",
    "afinacao": "Lá",
    "clave": "Clave de Sol",
    "hinario": "Hinário em Lá",
    "transposicaoArmadura": 3,
    "semitons": 3,
    "descricao": "Instrumento transpositor em Lá. Soa uma 3ª menor abaixo da nota escrita (+3 sustenidos na armadura).",
    "dicaGEM": "Atenção à leitura com acidentes transpostos e controle da coluna de ar.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior Escrito (Lá real)",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior Escrito (Mi real)",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      }
    ]
  },
  {
    "id": "corne_ingles",
    "nome": "Corne Inglês",
    "categoria": "Madeiras",
    "voz": "Contralto / Tenor",
    "afinacao": "Fá",
    "clave": "Clave de Sol",
    "hinario": "Hinário em Fá",
    "transposicaoArmadura": 1,
    "semitons": 7,
    "descricao": "Instrumento transpositor em Fá. Soa uma 5ª justa abaixo da nota escrita (+1 sustenido na armadura).",
    "dicaGEM": "Timbre encorpado e aveludado nas vozes intermediárias.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior Escrito (Fá real)",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior Escrito (Dó real)",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      }
    ]
  },
  {
    "id": "fagote",
    "nome": "Fagote",
    "categoria": "Madeiras",
    "voz": "Tenor / Baixo",
    "afinacao": "Dó",
    "clave": "Clave de Fá na 4ª linha",
    "hinario": "Hinário em Dó (Clave de Fá)",
    "transposicaoArmadura": 0,
    "semitons": 0,
    "descricao": "Voz grave das madeiras (Tenor/Baixo). Palheta dupla com grande expressividade.",
    "dicaGEM": "Dominar digitações com chaves no polegar da mão esquerda e emissão de notas graves suaves.",
    "escalasRecomendadas": [
      {
        "nome": "Fá Maior",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Si♭ Maior",
        "armadura": "2♭",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Si♭, Dó, Ré, Mi♭, Fá, Sol, Lá, Si♭",
        "arpejo": "Si♭ - Ré - Fá - Si♭"
      },
      {
        "nome": "Dó Maior",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      }
    ]
  },
  {
    "id": "clarinete_sib",
    "nome": "Clarinete Soprano (Si♭)",
    "categoria": "Madeiras",
    "voz": "Soprano",
    "afinacao": "Si♭",
    "clave": "Clave de Sol",
    "hinario": "Hinário em Si♭",
    "transposicaoArmadura": 2,
    "semitons": 2,
    "descricao": "Executa a voz de Soprano. Transpositor em Si♭: lê 1 tom acima (+2 sustenidos na armadura).",
    "dicaGEM": "Passagem suave entre os registros chalumeau e clarim (quebra do Si/Dó com chave de registro) e embocadura estável.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior Escrito (Si♭ real)",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior Escrito (Fá real)",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Fá Maior Escrito (Mi♭ real)",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Ré Maior Escrito (Dó real)",
        "armadura": "2♯",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Ré, Mi, Fá♯, Sol, Lá, Si, Dó♯, Ré",
        "arpejo": "Ré - Fá♯ - Lá - Ré"
      },
      {
        "nome": "Si♭ Maior Escrito (Lá♭ real)",
        "armadura": "2♭",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Si♭, Dó, Ré, Mi♭, Fá, Sol, Lá, Si♭",
        "arpejo": "Si♭ - Ré - Fá - Si♭"
      }
    ]
  },
  {
    "id": "clarinete_alto_mib",
    "nome": "Clarinete Alto (Mi♭)",
    "categoria": "Madeiras",
    "voz": "Contralto",
    "afinacao": "Mi♭",
    "clave": "Clave de Sol",
    "hinario": "Hinário em Mi♭",
    "transposicaoArmadura": 3,
    "semitons": 9,
    "descricao": "Executa a voz de Contralto. Transpositor em Mi♭ (+3 sustenidos na armadura).",
    "dicaGEM": "Sonoridade quente e encorpada no registro médio/grave.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior Escrito (Mi♭ real)",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior Escrito (Si♭ real)",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Fá Maior Escrito (Lá♭ real)",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      }
    ]
  },
  {
    "id": "clarone_sib",
    "nome": "Clarinete Baixo / Clarone (Si♭)",
    "categoria": "Madeiras",
    "voz": "Baixo",
    "afinacao": "Si♭",
    "clave": "Clave de Sol (ou Fá)",
    "hinario": "Hinário em Si♭ (Baixo) ou Dó",
    "transposicaoArmadura": 2,
    "semitons": 2,
    "descricao": "Executa a voz de Baixo. Transpositor em Si♭ grave.",
    "dicaGEM": "Apoio diafragmático para emissão clara das notas graves sem ruído excessivo de ar.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior Escrito",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior Escrito",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      }
    ]
  },
  {
    "id": "sax_soprano",
    "nome": "Saxofone Soprano (Si♭)",
    "categoria": "Madeiras",
    "voz": "Soprano",
    "afinacao": "Si♭",
    "clave": "Clave de Sol",
    "hinario": "Hinário em Si♭",
    "transposicaoArmadura": 2,
    "semitons": 2,
    "descricao": "Executa a voz de Soprano. Transpositor em Si♭ (+2 sustenidos na armadura).",
    "dicaGEM": "Atenção rigorosa à afinação no agudo. Controle de pressão na embocadura sem morder a palheta.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior Escrito (Si♭ real)",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior Escrito (Fá real)",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Fá Maior Escrito (Mi♭ real)",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Ré Maior Escrito (Dó real)",
        "armadura": "2♯",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Ré, Mi, Fá♯, Sol, Lá, Si, Dó♯, Ré",
        "arpejo": "Ré - Fá♯ - Lá - Ré"
      }
    ]
  },
  {
    "id": "sax_alto",
    "nome": "Saxofone Alto (Mi♭)",
    "categoria": "Madeiras",
    "voz": "Contralto",
    "afinacao": "Mi♭",
    "clave": "Clave de Sol",
    "hinario": "Hinário em Mi♭",
    "transposicaoArmadura": 3,
    "semitons": 9,
    "descricao": "Executa a voz de Contralto. Um dos instrumentos mais populares na CCB. Transpositor em Mi♭ (+3 sustenidos).",
    "dicaGEM": "Som suave e aveludado, sem vibrato exagerado na orquestra. Praticar bastante escalas com sustenidos.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior Escrito (Mi♭ real)",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior Escrito (Si♭ real)",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Ré Maior Escrito (Fá real)",
        "armadura": "2♯",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Ré, Mi, Fá♯, Sol, Lá, Si, Dó♯, Ré",
        "arpejo": "Ré - Fá♯ - Lá - Ré"
      },
      {
        "nome": "Lá Maior Escrito (Dó real)",
        "armadura": "3♯",
        "acidentes": 3,
        "oitavas": 2,
        "notas": "Lá, Si, Dó♯, Ré, Mi, Fá♯, Sol♯, Lá",
        "arpejo": "Lá - Dó♯ - Mi - Lá"
      },
      {
        "nome": "Fá Maior Escrito (Lá♭ real)",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      }
    ]
  },
  {
    "id": "sax_tenor",
    "nome": "Saxofone Tenor (Si♭)",
    "categoria": "Madeiras",
    "voz": "Tenor",
    "afinacao": "Si♭",
    "clave": "Clave de Sol",
    "hinario": "Hinário em Si♭",
    "transposicaoArmadura": 2,
    "semitons": 2,
    "descricao": "Executa a voz de Tenor. Transpositor em Si♭ (+2 sustenidos na armadura).",
    "dicaGEM": "Sonoridade encorpada na tessitura média. Apoio diafragmático seguro para notas graves sem estalos.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior Escrito (Si♭ real)",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior Escrito (Fá real)",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Ré Maior Escrito (Dó real)",
        "armadura": "2♯",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Ré, Mi, Fá♯, Sol, Lá, Si, Dó♯, Ré",
        "arpejo": "Ré - Fá♯ - Lá - Ré"
      },
      {
        "nome": "Fá Maior Escrito (Mi♭ real)",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      }
    ]
  },
  {
    "id": "sax_baritono",
    "nome": "Saxofone Barítono (Mi♭)",
    "categoria": "Madeiras",
    "voz": "Baixo",
    "afinacao": "Mi♭",
    "clave": "Clave de Sol",
    "hinario": "Hinário em Mi♭",
    "transposicaoArmadura": 3,
    "semitons": 9,
    "descricao": "Executa a voz de Baixo. Transpositor em Mi♭ grave (+3 sustenidos na armadura).",
    "dicaGEM": "Manter a base harmônica firme junto às tubas e violoncelos.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior Escrito (Mi♭ real)",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior Escrito (Si♭ real)",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      }
    ]
  },
  {
    "id": "trompete",
    "nome": "Trompete / Cornet / Flugelhorn",
    "categoria": "Metais",
    "voz": "Soprano",
    "afinacao": "Si♭",
    "clave": "Clave de Sol",
    "hinario": "Hinário em Si♭",
    "transposicaoArmadura": 2,
    "semitons": 2,
    "descricao": "Executa a voz de Soprano. Transpositor em Si♭ (+2 sustenidos na armadura).",
    "dicaGEM": "Tocar com dinâmica comedida (piano/mezzo-forte) para não cobrir as vozes da congregação. Ataque limpo e flexibilidade labial.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior Escrito (Si♭ real)",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior Escrito (Fá real)",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Ré Maior Escrito (Dó real)",
        "armadura": "2♯",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Ré, Mi, Fá♯, Sol, Lá, Si, Dó♯, Ré",
        "arpejo": "Ré - Fá♯ - Lá - Ré"
      },
      {
        "nome": "Fá Maior Escrito (Mi♭ real)",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Lá Maior Escrito (Sol real)",
        "armadura": "3♯",
        "acidentes": 3,
        "oitavas": 2,
        "notas": "Lá, Si, Dó♯, Ré, Mi, Fá♯, Sol♯, Lá",
        "arpejo": "Lá - Dó♯ - Mi - Lá"
      }
    ]
  },
  {
    "id": "trompa",
    "nome": "Trompa",
    "categoria": "Metais",
    "voz": "Contralto / Tenor",
    "afinacao": "Fá (ou Mi♭)",
    "clave": "Clave de Sol / Fá",
    "hinario": "Hinário em Fá",
    "transposicaoArmadura": 1,
    "semitons": 7,
    "descricao": "Executa vozes de Contralto ou Tenor. Timbre nobre que amalgama metais e madeiras.",
    "dicaGEM": "Técnica de mão direita na campana para controle de afinação e dinâmica aveludada.",
    "escalasRecomendadas": [
      {
        "nome": "Dó Maior Escrito (Fá real)",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      },
      {
        "nome": "Sol Maior Escrito (Dó real)",
        "armadura": "1♯",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Sol, Lá, Si, Dó, Ré, Mi, Fá♯, Sol",
        "arpejo": "Sol - Si - Ré - Sol"
      },
      {
        "nome": "Fá Maior Escrito (Si♭ real)",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      }
    ]
  },
  {
    "id": "trombone",
    "nome": "Trombone (de vara ou pisto)",
    "categoria": "Metais",
    "voz": "Tenor",
    "afinacao": "Dó (som real) ou Si♭",
    "clave": "Clave de Fá na 4ª linha (ou Sol)",
    "hinario": "Hinário em Dó (Clave de Fá) ou Hinário em Si♭",
    "transposicaoArmadura": 0,
    "semitons": 0,
    "descricao": "Executa principalmente a voz de Tenor. No trombone de vara, precisão milimétrica nas 7 posições.",
    "dicaGEM": "Atenção às 7 posições da vara, glissandos involuntários devem ser evitados na música sacra, afinação pura e legato bem articulado.",
    "escalasRecomendadas": [
      {
        "nome": "Si♭ Maior",
        "armadura": "2♭",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Si♭, Dó, Ré, Mi♭, Fá, Sol, Lá, Si♭",
        "arpejo": "Si♭ - Ré - Fá - Si♭"
      },
      {
        "nome": "Fá Maior",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Mi♭ Maior",
        "armadura": "3♭",
        "acidentes": 3,
        "oitavas": 2,
        "notas": "Mi♭, Fá, Sol, Lá♭, Si♭, Dó, Ré, Mi♭",
        "arpejo": "Mi♭ - Sol - Si♭ - Mi♭"
      },
      {
        "nome": "Lá♭ Maior",
        "armadura": "4♭",
        "acidentes": 4,
        "oitavas": 2,
        "notas": "Lá♭, Si♭, Dó, Ré♭, Mi♭, Fá, Sol, Lá♭",
        "arpejo": "Lá♭ - Dó - Mi♭ - Lá♭"
      },
      {
        "nome": "Dó Maior",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      }
    ]
  },
  {
    "id": "eufonio",
    "nome": "Eufônio / Bombardino",
    "categoria": "Metais",
    "voz": "Tenor / Baixo",
    "afinacao": "Si♭ (ou Dó)",
    "clave": "Clave de Fá na 4ª linha (ou Clave de Sol em Si♭)",
    "hinario": "Hinário em Dó ou Hinário em Si♭",
    "transposicaoArmadura": 0,
    "semitons": 0,
    "descricao": "Executa as vozes de Tenor ou Baixo. Timbre redondo, doce e potente.",
    "dicaGEM": "Sonoridade suave, afinação equilibrada com uso do 4º pisto/compensador nas notas graves.",
    "escalasRecomendadas": [
      {
        "nome": "Si♭ Maior",
        "armadura": "2♭",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Si♭, Dó, Ré, Mi♭, Fá, Sol, Lá, Si♭",
        "arpejo": "Si♭ - Ré - Fá - Si♭"
      },
      {
        "nome": "Fá Maior",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Mi♭ Maior",
        "armadura": "3♭",
        "acidentes": 3,
        "oitavas": 2,
        "notas": "Mi♭, Fá, Sol, Lá♭, Si♭, Dó, Ré, Mi♭",
        "arpejo": "Mi♭ - Sol - Si♭ - Mi♭"
      },
      {
        "nome": "Dó Maior",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      }
    ]
  },
  {
    "id": "tuba",
    "nome": "Tuba (Baixo)",
    "categoria": "Metais",
    "voz": "Baixo",
    "afinacao": "Si♭ ou Mi♭",
    "clave": "Clave de Fá na 4ª linha",
    "hinario": "Hinário em Dó (Clave de Fá)",
    "transposicaoArmadura": 0,
    "semitons": 0,
    "descricao": "Fundamento e sustentação rítmico-harmônica de toda a orquestra da congregação.",
    "dicaGEM": "Respiração profunda, ataques suaves sem percussão ríspida, precisão no tempo e sustentação do andamento.",
    "escalasRecomendadas": [
      {
        "nome": "Si♭ Maior",
        "armadura": "2♭",
        "acidentes": 2,
        "oitavas": 2,
        "notas": "Si♭, Dó, Ré, Mi♭, Fá, Sol, Lá, Si♭",
        "arpejo": "Si♭ - Ré - Fá - Si♭"
      },
      {
        "nome": "Fá Maior",
        "armadura": "1♭",
        "acidentes": 1,
        "oitavas": 2,
        "notas": "Fá, Sol, Lá, Si♭, Dó, Ré, Mi, Fá",
        "arpejo": "Fá - Lá - Dó - Fá"
      },
      {
        "nome": "Mi♭ Maior",
        "armadura": "3♭",
        "acidentes": 3,
        "oitavas": 2,
        "notas": "Mi♭, Fá, Sol, Lá♭, Si♭, Dó, Ré, Mi♭",
        "arpejo": "Mi♭ - Sol - Si♭ - Mi♭"
      },
      {
        "nome": "Lá♭ Maior",
        "armadura": "4♭",
        "acidentes": 4,
        "oitavas": 2,
        "notas": "Lá♭, Si♭, Dó, Ré♭, Mi♭, Fá, Sol, Lá♭",
        "arpejo": "Lá♭ - Dó - Mi♭ - Lá♭"
      },
      {
        "nome": "Dó Maior",
        "armadura": "0",
        "acidentes": 0,
        "oitavas": 2,
        "notas": "Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó",
        "arpejo": "Dó - Mi - Sol - Dó"
      }
    ]
  }
];

export function calcularTonalidadeInstrumento(acidentesReal: number, instrumento: Instrumento): { tonalidade: string; armadura: string; totalAcidentes: number } {
  // Transposição de armadura:
  // Hinário em Dó: 0
  // Hinário em Si♭: +2 sustenidos (+2 acidentes no círculo das quintas)
  // Hinário em Mi♭: +3 sustenidos (+3 acidentes)
  // Hinário em Fá: +1 sustenido (+1 acidente)
  // Hinário em Lá: +3 sustenidos
  const total = acidentesReal + instrumento.transposicaoArmadura;
  
  const mapTransposto: Record<number, { nome: string; armadura: string }> = {
    0: { nome: "Dó Maior", armadura: "0" },
    1: { nome: "Sol Maior", armadura: "1♯" },
    2: { nome: "Ré Maior", armadura: "2♯" },
    3: { nome: "Lá Maior", armadura: "3♯" },
    4: { nome: "Mi Maior", armadura: "4♯" },
    5: { nome: "Si Maior", armadura: "5♯" },
    6: { nome: "Fá♯ Maior", armadura: "6♯" },
    7: { nome: "Dó♯ Maior", armadura: "7♯" },
    8: { nome: "Sol♯ Maior", armadura: "8♯" },
    "-1": { nome: "Fá Maior", armadura: "1♭" },
    "-2": { nome: "Si♭ Maior", armadura: "2♭" },
    "-3": { nome: "Mi♭ Maior", armadura: "3♭" },
    "-4": { nome: "Lá♭ Maior", armadura: "4♭" },
    "-5": { nome: "Ré♭ Maior", armadura: "5♭" },
    "-6": { nome: "Sol♭ Maior", armadura: "6♭" },
    "-7": { nome: "Dó♭ Maior", armadura: "7♭" },
  };

  const info = mapTransposto[total] || { nome: `${total > 0 ? total + '♯' : Math.abs(total) + '♭'}`, armadura: `${Math.abs(total)}${total >= 0 ? '♯' : '♭'}` };
  return {
    tonalidade: info.nome,
    armadura: info.armadura,
    totalAcidentes: Math.abs(total)
  };
}
