/* Motor de análise de contexto persistente — GenAI Saúde, Ciência e Letras.
 *
 * Camada 1: determinística. Corre inteiramente no browser, sem rede e sem chave.
 * Não "compreende" o texto — reconhece padrões que a documentação dos fornecedores
 * e a rubrica do capítulo identificam como problemáticos. Por isso a camada 2
 * (prompt de auditoria) existe: há problemas que só leitura semântica apanha.
 *
 * Sem dependências. Usável como <script> ou como módulo CommonJS (para os testes).
 */
(function (raiz) {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     Fontes. Cada regra aponta para a fonte que a justifica, para que
     o diagnóstico nunca seja uma opinião anónima da ferramenta.
     Levantadas a 2026-09-18.
     ───────────────────────────────────────────────────────────── */
  var FONTES = {
    claudePerso: {
      id: 'claudePerso',
      rotulo: 'Anthropic — Understanding Claude’s personalization features',
      url: 'https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features'
    },
    claudeMem: {
      id: 'claudeMem',
      rotulo: 'Anthropic — Use Claude’s chat search and memory',
      url: 'https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context'
    },
    openaiPerso: {
      id: 'openaiPerso',
      rotulo: 'OpenAI Academy — Personalizing ChatGPT',
      url: 'https://openai.com/academy/personalization/'
    },
    openaiProj: {
      id: 'openaiProj',
      rotulo: 'OpenAI — Projects in ChatGPT',
      url: 'https://help.openai.com/en/articles/10169521-projects-in-chatgpt'
    },
    capitulo: {
      id: 'capitulo',
      rotulo: 'GenAI Saúde — Personalização e Contexto Persistente (cap. do curso)',
      url: ''
    }
  };

  /* Limites de caracteres das instruções personalizadas do ChatGPT.
     Indicativos: variam por plano e a OpenAI altera-os sem aviso. */
  var ORCAMENTO = { livre: 1500, pago: 5000 };

  /* ─────────────────────────────────────────────────────────────
     Dimensões da rubrica (0–2 cada, máximo 16).
     ───────────────────────────────────────────────────────────── */
  var DIMENSOES = [
    { id: 'relevancia',   nome: 'Relevância',
      pergunta: 'O que está escrito muda mesmo o comportamento do modelo?' },
    { id: 'estabilidade', nome: 'Estabilidade',
      pergunta: 'Continuará verdadeiro daqui a seis meses?' },
    { id: 'especificidade', nome: 'Especificidade',
      pergunta: 'Diz o que fazer, de forma verificável?' },
    { id: 'ambito',       nome: 'Âmbito',
      pergunta: 'Está na camada certa — global, projeto ou tarefa?' },
    { id: 'vies',         nome: 'Controlo de viés',
      pergunta: 'Informa a decisão sem a predeterminar?' },
    { id: 'privacidade',  nome: 'Privacidade',
      pergunta: 'Persiste o mínimo, e nada que seja de terceiros?' },
    { id: 'manutencao',   nome: 'Manutenção',
      pergunta: 'É curto e auditável por outra pessoa?' },
    { id: 'seletividade', nome: 'Seletividade',
      pergunta: 'Fica adormecido quando é irrelevante?' }
  ];

  /* ─────────────────────────────────────────────────────────────
     Utilitários de texto
     ───────────────────────────────────────────────────────────── */
  function semAcentos(s) {
    return s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '') : s;
  }
  function normaliza(s) { return semAcentos(String(s || '')).toLowerCase(); }

  /* Divide em unidades analisáveis: linhas de lista ou frases. Guarda o
     deslocamento no texto original para se poder destacar o excerto. */
  function segmenta(texto) {
    var out = [], re = /[^\n]+/g, m;
    while ((m = re.exec(texto)) !== null) {
      var linha = m[0], base = m.index;
      if (!linha.trim()) continue;
      /* Uma linha curta é uma unidade; uma longa parte-se por frases. */
      if (linha.length <= 160) {
        out.push({ texto: linha, inicio: base, fim: base + linha.length });
      } else {
        var fre = /[^.;!?]+[.;!?]*/g, f;
        while ((f = fre.exec(linha)) !== null) {
          if (!f[0].trim()) continue;
          out.push({ texto: f[0], inicio: base + f.index,
                     fim: base + f.index + f[0].length });
        }
      }
    }
    return out;
  }

  function palavras(texto) {
    var m = normaliza(texto).match(/[a-z0-9]+/g);
    return m || [];
  }

  /* ─────────────────────────────────────────────────────────────
     Léxicos. Escritos sem acentos porque são comparados contra
     texto normalizado — evita falhar por o formando escrever
     "analise" em vez de "análise".
     ───────────────────────────────────────────────────────────── */

  /* Verbos que descrevem comportamento pedido ao modelo. A presença
     destes é o melhor sinal de que uma linha é instrução e não biografia. */
  var VERBOS_COMPORTAMENTO = [
    'separa', 'distingue', 'identifica', 'indica', 'assinala', 'expoe', 'expõe',
    'compara', 'avalia', 'considera', 'prioriza', 'evita', 'nao assumas',
    'pergunta', 'confirma', 'verifica', 'apresenta', 'usa', 'utiliza', 'prefere',
    'comeca', 'começa', 'estrutura', 'resume', 'explica', 'define', 'contesta',
    'questiona', 'sinaliza', 'declara', 'lista', 'ordena', 'responde',
    'nao infiras', 'nao apresentes', 'nao trates', 'nao uses', 'exige',
    'aplica', 'adota', 'mantem', 'traz', 'procura', 'analisa', 'classifica'
  ].map(semAcentos);

  /* Biografia sem consequência comportamental. */
  var MARCAS_BIOGRAFIA = [
    'anos de experiencia', 'licenciei', 'licenciatura em', 'mestrado em',
    'doutoramento em', 'formei-me', 'nasci', 'sou natural', 'vivo em',
    'moro em', 'tenho \\d+ anos', 'trabalho ha \\d+', 'desde \\d{4} que',
    'ao longo da minha carreira', 'curriculo', 'percurso profissional',
    'fiz o internato', 'especializei-me', 'sou apaixonado', 'sou fa de',
    'gosto de', 'nos tempos livres', 'sou casado', 'tenho filhos'
  ];

  /* Marcas temporais — conteúdo que envelhece. */
  var MARCAS_TEMPORAIS = [
    'hoje', 'ontem', 'amanha', 'esta semana', 'este mes', 'esta manha',
    'esta tarde', 'neste momento', 'de momento', 'atualmente estou',
    'estou a preparar', 'estou a escrever', 'ate dia', 'ate sexta',
    'ate ao fim do mes', 'prazo', 'deadline', 'entrega e a', 'proxima reuniao',
    'reuniao de', 'na segunda', 'na terca', 'na quarta', 'na quinta',
    'na sexta', 'este semestre', 'este ano letivo', 'em curso ate'
  ];
  var RE_DATA = /\b(\d{1,2}[\/\-]\d{1,2}([\/\-]\d{2,4})?|\d{4}-\d{2}-\d{2})\b/;

  /* Vaguidade — adjetivos sem conteúdo operacional. */
  var MARCAS_VAGAS = [
    'se profissional', 'sê profissional', 'se claro', 'sê claro', 'de qualidade',
    'bem feito', 'o melhor possivel', 'otimizado', 'eficiente', 'adequado',
    'apropriado', 'relevante', 'interessante', 'util', 'boa resposta',
    'respostas boas', 'de forma correta', 'como deve ser', 'com rigor',
    'inteligente', 'criativo', 'natural'
  ];

  /* Teatro de personalidade. */
  var MARCAS_TEATRO = [
    'es o melhor', 'o melhor do mundo', 'especialista mundial', 'genio',
    'maior especialista', 'guru', 'lenda', 'nivel mundial', 'classe mundial',
    'pensa profundamente', 'pensa muito', 'pensa a fundo', 'usa toda a tua',
    'inteligencia maxima', 'capacidade maxima', 'nunca pares', 'nao pares ate',
    'age como se fosses', 'finge que es', 'incorpora o papel',
    '\\d{2,} anos de experiencia', 'premiado', 'reconhecido mundialmente',
    'respira fundo', 'vidas dependem', 'e muito importante para a minha carreira'
  ];

  /* Absolutos e conclusões persistentes. */
  var MARCAS_ABSOLUTAS = [
    'sempre', 'nunca', 'em todas as respostas', 'em qualquer caso',
    'sem excecao', 'obrigatoriamente', 'jamais', 'todo e qualquer'
  ];
  var MARCAS_CONCLUSAO = [
    'e sempre melhor', 'e sempre preferivel', 'e sempre superior',
    'e a melhor opcao', 'nunca vale a pena', 'nao presta', 'e inutil',
    'deve sempre reduzir', 'e sempre mau', 'e sempre bom',
    'prefiro sempre', 'so uso', 'recuso', 'nao acredito em'
  ];
  /* Formulações que já contêm a salvaguarda — anulam o alarme de absoluto. */
  var MARCAS_SALVAGUARDA = [
    'mas quando', 'ainda assim', 'compara objetivamente', 'avalia alternativas',
    'face aos requisitos', 'sem assumir', 'nao trates a minha preferencia',
    'identifica pelo menos uma', 'interpretacao alternativa', 'contesta',
    'quando houver evidencia', 'salvo se', 'a menos que', 'exceto quando',
    'nao apliques quando', 'considera o contrario'
  ];

  /* Dados que não devem persistir. Parte vem da documentação da Anthropic,
     que enumera categorias nunca guardadas em memória. */
  /* Referências a uma pessoa concreta. Bastam por si para ser crítico. */
  var MARCAS_DOENTE = [
    'o doente', 'a doente', 'o utente', 'a utente', 'o paciente', 'a paciente',
    'este doente', 'esta doente', 'do doente', 'da doente', 'do utente',
    'numero de utente', 'n utente', 'processo clinico', 'diagnosticado com',
    'medicado com', 'toma diariamente', 'esta internado', 'teve alta',
    'a minha mae', 'o meu pai', 'o meu filho', 'a minha filha', 'o meu marido',
    'a minha mulher'
  ];
  /* Nomes de análises e exames. Só são críticos quando aparecem com um valor
     ou junto de uma referência a uma pessoa — caso contrário é vocabulário
     clínico legítimo dentro de uma instrução de método. */
  var MARCAS_ANALITO = [
    'creatinina', 'potassio', 'sodio', 'hemoglobina', 'glicemia', 'inr',
    'tensao arterial', 'leucocitos', 'plaquetas', 'biopsia', 'tac de', 'rm de',
    'ecografia de', 'hba1c', 'colesterol', 'troponina'
  ];
  var RE_VALOR_CLINICO = /\d+([.,]\d+)?\s*(mmol\/l|mg\/dl|mmhg|ui\/l|g\/dl|mg|ml|%)/i;
  var MARCAS_IDENTIFICADORES = [
    'nif', 'niss', 'numero de contribuinte', 'cartao de cidadao', 'cc numero',
    'passaporte', 'iban', 'cartao de credito', 'numero de conta', 'multibanco',
    'cadastro', 'registo criminal', 'antecedentes criminais',
    'titulo de residencia', 'autorizacao de residencia', 'estatuto de imigracao',
    'morada', 'codigo postal', 'numero de telemovel', 'contacto pessoal'
  ];
  var RE_NUM_LONGO = /\b\d{8,}\b/;

  /* Conteúdo de âmbito estreito encontrado numa especificação global. */
  var MARCAS_PROJETO = [
    'neste projeto', 'este projeto', 'no projeto', 'nesta analise',
    'nesta tarefa', 'neste relatorio', 'neste artigo', 'neste documento',
    'nesta sessao', 'nesta aula', 'para esta reuniao', 'o ficheiro anexo',
    'o documento em anexo', 'a folha de calculo', 'o capitulo 3',
    'a sessao 2', 'o modulo', 'para este cliente', 'para esta edicao'
  ];

  /* Condicionalidade — o que faz a personalização adormecer quando é irrelevante. */
  var MARCAS_CONDICIONAIS = [
    'quando', 'sempre que o tema', 'para questoes', 'para temas',
    'se a pergunta', 'caso', 'em contexto', 'no dominio', 'perante',
    'em tarefas de', 'se for', 'se se tratar', 'nao apliques', 'so quando',
    'apenas quando', 'fora deste', 'se o assunto'
  ];

  /* Recorrência — o que a documentação diz ser bom candidato a persistir. */
  var MARCAS_ESTAVEIS = [
    'sou', 'trabalho em', 'a minha area', 'o meu papel', 'por omissao',
    'por defeito', 'habitualmente', 'em regra', 'tipicamente',
    'a minha audiencia', 'escrevo para', 'uso terminologia'
  ];

  function achaMarcas(txtNorm, lista) {
    var achados = [];
    for (var i = 0; i < lista.length; i++) {
      var padrao = lista[i];
      var re = new RegExp(padrao.indexOf('\\') >= 0 ? padrao
                          : padrao.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      var m;
      while ((m = re.exec(txtNorm)) !== null) {
        achados.push({ marca: m[0], indice: m.index });
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    }
    return achados;
  }
  function temMarca(txtNorm, lista) { return achaMarcas(txtNorm, lista).length > 0; }

  /* ─────────────────────────────────────────────────────────────
     Achados
     ───────────────────────────────────────────────────────────── */
  function achado(o) {
    return {
      dimensao: o.dimensao,
      gravidade: o.gravidade,            /* 'critico' | 'aviso' | 'nota' */
      titulo: o.titulo,
      excerto: o.excerto || '',
      inicio: typeof o.inicio === 'number' ? o.inicio : -1,
      fim: typeof o.fim === 'number' ? o.fim : -1,
      porque: o.porque,
      correcao: o.correcao,
      fonte: o.fonte || null
    };
  }

  var PESO = { critico: 2, aviso: 1, nota: 0.5 };

  /* ─────────────────────────────────────────────────────────────
     Analisadores por dimensão
     ───────────────────────────────────────────────────────────── */

  function verRelevancia(segs, ctx) {
    var out = [], comportamento = 0;
    segs.forEach(function (s) {
      var n = normaliza(s.texto);
      if (temMarca(n, VERBOS_COMPORTAMENTO)) comportamento++;
      var bio = achaMarcas(n, MARCAS_BIOGRAFIA);
      if (bio.length && !temMarca(n, VERBOS_COMPORTAMENTO)) {
        out.push(achado({
          dimensao: 'relevancia', gravidade: 'aviso',
          titulo: 'Biografia sem consequência para a resposta',
          excerto: s.texto.trim(), inicio: s.inicio, fim: s.fim,
          porque: 'A documentação da Anthropic descreve as instruções de perfil como o sítio '
                + 'das abordagens e métodos preferidos, dos termos que usa e dos cenários '
                + 'típicos — não do percurso pessoal. Uma linha que não altera nenhuma '
                + 'resposta ocupa orçamento de contexto e não devolve nada.',
          correcao: 'Pergunte "que resposta muda por causa desta linha?". Se não houver '
                  + 'resposta, corte. Se houver, escreva a consequência em vez do facto: '
                  + 'em vez de "tenho 15 anos de experiência", escreva "assume literacia '
                  + 'clínica e não expliques terminologia corrente".',
          fonte: FONTES.claudePerso
        }));
      }
    });
    if (segs.length && comportamento === 0) {
      out.push(achado({
        dimensao: 'relevancia', gravidade: 'critico',
        titulo: 'Nenhuma instrução de comportamento',
        porque: 'Não há uma única linha que diga ao modelo o que fazer. Sem isso, o texto '
              + 'descreve quem é o utilizador mas não altera a forma como o trabalho é feito.',
        correcao: 'Acrescente pelo menos duas regras acionáveis, começadas por verbo: '
                + '"Separa evidência de inferência." · "Identifica a informação em falta '
                + 'antes de concluir."',
        fonte: FONTES.capitulo
      }));
    }
    return { achados: out, sinal: comportamento };
  }

  function verEstabilidade(segs) {
    var out = [];
    segs.forEach(function (s) {
      var n = normaliza(s.texto);
      var temp = achaMarcas(n, MARCAS_TEMPORAIS);
      var data = RE_DATA.test(s.texto);
      if (temp.length || data) {
        out.push(achado({
          dimensao: 'estabilidade', gravidade: 'critico',
          titulo: 'Conteúdo com prazo de validade',
          excerto: s.texto.trim(), inicio: s.inicio, fim: s.fim,
          porque: 'A OpenAI descreve a memória como útil para contexto recorrente — papel, '
                + 'projetos habituais, preferências — e o prompt como o sítio da tarefa '
                + 'concreta. Uma referência a uma data, a um prazo ou a "hoje" deixa de ser '
                + 'verdadeira depressa, e passa a enviesar respostas sem ninguém dar por isso.',
          correcao: 'Tire esta linha do que persiste e ponha-a no prompt da conversa onde '
                  + 'for precisa. Se o que quer guardar é o padrão e não o caso, escreva o '
                  + 'padrão: "quando eu indicar um prazo, propõe um plano por marcos".',
          fonte: FONTES.openaiPerso
        }));
      }
    });
    return { achados: out };
  }

  function verEspecificidade(segs) {
    var out = [];
    segs.forEach(function (s) {
      var n = normaliza(s.texto);
      var vagas = achaMarcas(n, MARCAS_VAGAS);
      if (vagas.length && palavras(s.texto).length < 14) {
        out.push(achado({
          dimensao: 'especificidade', gravidade: 'aviso',
          titulo: 'Instrução vaga — não é verificável',
          excerto: s.texto.trim(), inicio: s.inicio, fim: s.fim,
          porque: 'Termos como "profissional", "de qualidade" ou "adequado" não dizem ao '
                + 'modelo o que fazer de diferente, e não permitem verificar se foi cumprido. '
                + 'Duas pessoas leem a mesma instrução de maneiras opostas.',
          correcao: 'Troque o adjetivo pelo comportamento observável. Em vez de "sê '
                  + 'profissional", escreva o que isso significa para si: "não uses '
                  + 'exclamações, começa pela conclusão, usa tabela quando comparares '
                  + 'mais de duas opções".',
          fonte: FONTES.capitulo
        }));
      }
    });
    return { achados: out };
  }

  function verAmbito(segs, ctx) {
    var out = [];
    if (ctx.camada !== 'projeto' && ctx.camada !== 'tarefa') {
      segs.forEach(function (s) {
        var n = normaliza(s.texto);
        if (temMarca(n, MARCAS_PROJETO)) {
          out.push(achado({
            dimensao: 'ambito', gravidade: 'critico',
            titulo: 'Contexto de projeto dentro da configuração global',
            excerto: s.texto.trim(), inicio: s.inicio, fim: s.fim,
            porque: 'Os dois fornecedores separam explicitamente as camadas: a Anthropic diz '
                  + 'para usar instruções de perfil para definições que valem para todas as '
                  + 'conversas e instruções de projeto quando o contexto é de um projeto; a '
                  + 'OpenAI desenha os projetos para manter conversas, ficheiros e instruções '
                  + 'juntos, com memória limitada ao próprio projeto. Uma linha de projeto no '
                  + 'perfil contamina trabalho que nada tem a ver.',
            correcao: 'Mova esta linha para as instruções do projeto respetivo — '
                    + '"Instruções de Projeto" no Claude, instruções do projeto no ChatGPT. '
                    + 'No perfil fica só o que é verdade em qualquer conversa.',
            fonte: FONTES.claudePerso
          }));
        }
      });
    }
    return { achados: out };
  }

  function verVies(segs, ctx) {
    var out = [], salvaguardas = 0;
    segs.forEach(function (s) {
      var n = normaliza(s.texto);
      if (temMarca(n, MARCAS_SALVAGUARDA)) salvaguardas++;
      if (temMarca(n, MARCAS_CONCLUSAO) && !temMarca(n, MARCAS_SALVAGUARDA)) {
        out.push(achado({
          dimensao: 'vies', gravidade: 'critico',
          titulo: 'Conclusão persistente disfarçada de preferência',
          excerto: s.texto.trim(), inicio: s.inicio, fim: s.fim,
          porque: 'Isto não informa a análise — fecha-a. O modelo passa a ter como premissa '
                + 'aquilo que a análise seguinte devia testar, e a resposta sai coerente e '
                + 'fundamentada com a conclusão já decidida de antemão.',
          correcao: 'Declare a preferência e exija na mesma a comparação: "valorizo X, mas '
                  + 'ao comparar opções avalia-as face aos requisitos reais e diz quando '
                  + 'outra abordagem os satisfaz melhor".',
          fonte: FONTES.capitulo
        }));
      } else if (temMarca(n, MARCAS_ABSOLUTAS) && !temMarca(n, MARCAS_SALVAGUARDA)
                 && palavras(s.texto).length > 4) {
        out.push(achado({
          dimensao: 'vies', gravidade: 'nota',
          titulo: 'Absoluto sem salvaguarda',
          excerto: s.texto.trim(), inicio: s.inicio, fim: s.fim,
          porque: '"Sempre" e "nunca" retiram ao modelo a possibilidade de assinalar o caso '
                + 'em que a regra não serve — e é justamente esse o caso em que precisa de o saber.',
          correcao: 'Acrescente a condição de escape: "por omissão, …; quando o caso o '
                  + 'justificar, diz porque estás a afastar-te desta regra".'
        }));
      }
      if (temMarca(n, MARCAS_TEATRO)) {
        out.push(achado({
          dimensao: 'especificidade', gravidade: 'critico',
          titulo: 'Teatro de personalidade',
          excerto: s.texto.trim(), inicio: s.inicio, fim: s.fim,
          porque: 'Especifica encenação em vez de comportamento. Os modelos atuais inferem '
                + 'como executar a tarefa assim que o contexto, o objetivo e as restrições '
                + 'estão claros — declarar-lhes uma identidade grandiosa não acrescenta '
                + 'capacidade, só ocupa espaço.',
          correcao: 'Substitua pela instrução equivalente em comportamento: que critérios '
                  + 'aplicar, que incerteza declarar, que pressupostos expor.',
          fonte: FONTES.capitulo
        }));
      }
    });
    if (segs.length >= 4 && salvaguardas === 0) {
      out.push(achado({
        dimensao: 'vies', gravidade: 'aviso',
        titulo: 'Sem nenhuma instrução anti-viés',
        porque: 'A personalização aumenta a relevância percebida sem aumentar a exatidão. '
              + 'Se o modelo concorda repetidamente consigo, deixa de ser escrutinado — e '
              + 'nada no texto o obriga a contrariá-lo.',
        correcao: 'Acrescente uma linha, e chega: "Não trates a minha preferência declarada '
                + 'como evidência de que é a melhor opção. Em decisões consequentes, '
                + 'identifica pelo menos uma interpretação alternativa credível."',
        fonte: FONTES.capitulo
      }));
    }
    return { achados: out, sinal: salvaguardas };
  }

  function verPrivacidade(segs) {
    var out = [];
    segs.forEach(function (s) {
      var n = normaliza(s.texto);
      var refPessoa = temMarca(n, MARCAS_DOENTE);
      var refAnalito = temMarca(n, MARCAS_ANALITO);
      var temValor = RE_VALOR_CLINICO.test(s.texto);
      if (refAnalito && !refPessoa && !temValor) {
        out.push(achado({
          dimensao: 'privacidade', gravidade: 'nota',
          titulo: 'Vocabulário clínico numa instrução permanente',
          excerto: s.texto.trim(), inicio: s.inicio, fim: s.fim,
          porque: 'Aqui o termo aparece dentro de uma regra de método, e não ligado a '
                + 'ninguém em concreto — o que está correto. Fica a nota apenas porque é '
                + 'nestas linhas que costuma entrar, mais tarde, o caso concreto.',
          correcao: 'Nada a corrigir. Mantenha a regra genérica e forneça os valores na '
                  + 'conversa, quando precisar deles.',
          fonte: FONTES.claudeMem
        }));
      }
      if (refPessoa || (refAnalito && temValor)) {
        out.push(achado({
          dimensao: 'privacidade', gravidade: 'critico',
          titulo: 'Informação de doente em contexto persistente',
          excerto: s.texto.trim(), inicio: s.inicio, fim: s.fim,
          porque: 'Persistir dados de terceiros levanta, de uma vez, problemas de base legal, '
                + 'de proveniência, de atualidade e de controlo de acesso — e a interface não '
                + 'lhe mostra quando é que essa informação está a ser usada numa resposta.',
          correcao: 'Persista a preferência, não o doente. Guarde o método — "ao discutir '
                  + 'casos clínicos, distingue factos documentados de inferência" — e forneça '
                  + 'o caso na conversa, quando for preciso, pelo canal que a sua instituição '
                  + 'autorizar.',
          fonte: FONTES.claudeMem
        }));
      }
      if (temMarca(n, MARCAS_IDENTIFICADORES) || RE_NUM_LONGO.test(s.texto)) {
        out.push(achado({
          dimensao: 'privacidade', gravidade: 'critico',
          titulo: 'Identificador pessoal ou financeiro',
          excerto: s.texto.trim(), inicio: s.inicio, fim: s.fim,
          porque: 'A Anthropic documenta que há categorias que nunca são guardadas em '
                + 'memória, mesmo que o utilizador peça — números de identificação emitidos '
                + 'pelo Estado, registo criminal, números de conta bancária e situação '
                + 'migratória. Escrever isto nas instruções contorna essa proteção e coloca-o '
                + 'num campo que não foi desenhado para o guardar.',
          correcao: 'Retire o identificador. Se o número for preciso para uma tarefa, '
                  + 'forneça-o nessa conversa e não na configuração permanente.',
          fonte: FONTES.claudeMem
        }));
      }
    });
    return { achados: out };
  }

  function verManutencao(texto, segs, ctx) {
    var out = [], n = texto.length;
    var limite = ctx.orcamento || ORCAMENTO.pago;
    if (n > limite) {
      out.push(achado({
        dimensao: 'manutencao', gravidade: 'critico',
        titulo: 'Excede o orçamento de caracteres (' + n + ' de ' + limite + ')',
        porque: 'As instruções personalizadas do ChatGPT têm limite de caracteres — cerca de '
              + ORCAMENTO.livre + ' nos planos gratuitos e ' + ORCAMENTO.pago + ' nos pagos. '
              + 'Acima disso não cabe, e mesmo abaixo o texto longo tende a contradizer-se.',
        correcao: 'Corte pela ordem: primeiro a biografia, depois o que é de projeto, depois '
                + 'as regras que nunca verificou fazerem diferença.',
        fonte: FONTES.openaiPerso
      }));
    } else if (n > limite * 0.8) {
      out.push(achado({
        dimensao: 'manutencao', gravidade: 'nota',
        titulo: 'Perto do limite (' + n + ' de ' + limite + ')',
        porque: 'Ainda cabe, mas sobra pouca margem para acrescentar o que faltar.',
        correcao: 'Vale a pena rever agora o que já não usa.',
        fonte: FONTES.openaiPerso
      }));
    }
    /* Duplicação: segmentos com forte sobreposição de vocabulário. */
    for (var i = 0; i < segs.length; i++) {
      for (var j = i + 1; j < segs.length; j++) {
        var a = palavras(segs[i].texto), b = palavras(segs[j].texto);
        if (a.length < 4 || b.length < 4) continue;
        var setA = {}, comum = 0;
        a.forEach(function (w) { if (w.length > 3) setA[w] = 1; });
        b.forEach(function (w) { if (w.length > 3 && setA[w]) comum++; });
        var base = Math.min(Object.keys(setA).length, b.filter(function (w) {
          return w.length > 3; }).length);
        if (base >= 4 && comum / base >= 0.75) {
          out.push(achado({
            dimensao: 'manutencao', gravidade: 'aviso',
            titulo: 'Duas linhas dizem quase o mesmo',
            excerto: segs[j].texto.trim(), inicio: segs[j].inicio, fim: segs[j].fim,
            porque: 'Instruções redundantes crescem sem ninguém reparar e acabam por '
                  + 'divergir — a partir daí o modelo tem duas regras parecidas e '
                  + 'ligeiramente incompatíveis.',
            correcao: 'Funda as duas numa só linha. Se a diferença entre elas importa, '
                    + 'torne-a explícita.'
          }));
          j = segs.length;
        }
      }
    }
    /* Contradição concisão vs. detalhe, sem condição que as reconcilie. */
    var nt = normaliza(texto);
    var querCurto = /\b(concis|brev|curt|sucint|direta? ao ponto|sem rodeios)/.test(nt);
    var querLongo = /\b(detalhad|exaustiv|aprofundad|extenso|minucios|pormenorizad)/.test(nt);
    var condicional = /\b(quando|caso|consoante|conforme|adapta|se a pergunta|se o (tema|assunto)|para (questoes|temas|decisoes|perguntas))\b/.test(nt);
    if (querCurto && querLongo && !condicional) {
      out.push(achado({
        dimensao: 'manutencao', gravidade: 'aviso',
        titulo: 'Pede concisão e detalhe ao mesmo tempo',
        porque: 'As duas instruções estão em conflito e nada diz ao modelo qual vale em que '
              + 'caso. O resultado é imprevisível e varia de conversa para conversa.',
        correcao: 'Torne a regra condicional: "responde diretamente a perguntas simples; '
                + 'em decisões complexas expõe pressupostos, incerteza e alternativas".',
        fonte: FONTES.capitulo
      }));
    }
    return { achados: out };
  }

  function verSeletividade(segs, texto) {
    var out = [], condicionais = 0;
    segs.forEach(function (s) {
      if (temMarca(normaliza(s.texto), MARCAS_CONDICIONAIS)) condicionais++;
    });
    var nt = normaliza(texto);
    var universal = /(em todas as (respostas|conversas)|em qualquer (resposta|conversa|assunto)|independentemente do (tema|assunto)|aplica (isto )?a tudo)/.test(nt);
    if (universal) {
      out.push(achado({
        dimensao: 'seletividade', gravidade: 'aviso',
        titulo: 'Enquadramento imposto a todas as respostas',
        porque: 'Obrigar o contexto profissional a aparecer em tudo faz a personalização '
              + 'sobre-ativar: o teste da tarefa não relacionada falha, e temas sem nada a '
              + 'ver passam a vir embrulhados em linguagem de trabalho.',
        correcao: 'Acrescente a condição de repouso: "não apliques o contexto profissional '
                + 'quando for irrelevante para a tarefa".',
        fonte: FONTES.capitulo
      }));
    }
    if (segs.length >= 5 && condicionais === 0) {
      out.push(achado({
        dimensao: 'seletividade', gravidade: 'nota',
        titulo: 'Nenhuma regra condicional',
        porque: 'Todas as instruções valem sempre. Boa personalização fica adormecida quando '
              + 'não é relevante, e isso escreve-se com "quando…", "para questões de…", '
              + '"se o assunto for…".',
        correcao: 'Condicione pelo menos as regras analíticas ao domínio onde fazem sentido.',
        fonte: FONTES.capitulo
      }));
    }
    return { achados: out, sinal: condicionais };
  }

  /* ─────────────────────────────────────────────────────────────
     Pontuação: cada dimensão parte de 2 e desce com os achados.
     ───────────────────────────────────────────────────────────── */
  function pontua(achados, sinais, segs) {
    var pontos = {}, penal = {};
    DIMENSOES.forEach(function (d) { penal[d.id] = 0; });
    achados.forEach(function (a) { penal[a.dimensao] += (PESO[a.gravidade] || 1); });

    /* Uma dimensão não parte de 2 por omissão. O nível 2 tem de ser merecido
       com evidência de que o texto faz a coisa certa; sem essa evidência o
       melhor que pode obter é 1. Caso contrário um texto mau pontua alto
       apenas nas dimensões que nenhum detetor chegou a examinar. */
    var tecto = {
      relevancia:    sinais.comportamento >= 2 ? 2 : (sinais.comportamento >= 1 ? 1 : 0),
      estabilidade:  2,
      especificidade: sinais.comportamento >= 2 ? 2 : (sinais.comportamento >= 1 ? 1 : 0),
      ambito:        2,
      vies:          sinais.salvaguardas >= 1 ? 2 : 1,
      privacidade:   2,
      manutencao:    2,
      seletividade:  sinais.condicionais >= 1 ? 2 : 1
    };

    DIMENSOES.forEach(function (d) {
      pontos[d.id] = Math.max(0, Math.min(tecto[d.id], 2 - penal[d.id]));
    });

    /* Densidade de problemas: se a maioria dos segmentos tem achados, o texto
       tem um problema estrutural e não um defeito pontual. */
    var comAchado = {};
    achados.forEach(function (a) { if (a.inicio >= 0) comAchado[a.inicio] = 1; });
    var densidade = segs.length ? Object.keys(comAchado).length / segs.length : 0;
    if (densidade > 0.5) {
      pontos.manutencao = Math.min(pontos.manutencao, 1);
      pontos.relevancia = Math.min(pontos.relevancia, 1);
    }

    /* Texto demasiado curto não tem substância para avaliar. */
    if (segs.length <= 1) {
      Object.keys(pontos).forEach(function (k) { pontos[k] = Math.min(pontos[k], 1); });
    }

    Object.keys(pontos).forEach(function (k) {
      pontos[k] = Math.max(0, Math.min(2, Math.round(pontos[k])));
    });
    return pontos;
  }

  /* Classificação por pontuação, com travões. Nem todos os achados críticos
     pesam igual: um dado de doente esquecido nas instruções é de outra natureza
     que uma linha de projeto guardada no perfil. O primeiro é um problema de
     governação e não se compensa com boa redação no resto; o segundo é um erro
     de arrumação, que baixa a nota mas não desqualifica o trabalho. */
  function classifica(total, criticos) {
    var privacidade = (criticos && criticos.privacidade) || 0;
    var outros = (criticos && criticos.outros) || 0;

    var banda;
    if (total >= 14) banda = 0;
    else if (total >= 11) banda = 1;
    else if (total >= 7) banda = 2;
    else banda = 3;

    var minimo = 0, motivo = null;
    if (privacidade >= 2) {
      minimo = 3;
      motivo = 'Há ' + privacidade + ' achados críticos de privacidade. Informação de '
             + 'terceiros ou identificadores pessoais não devem persistir em configuração, '
             + 'e isso não se compensa com a qualidade do resto do texto.';
    } else if (privacidade === 1) {
      minimo = 2;
      motivo = 'Há um achado crítico de privacidade. Enquanto não for resolvido, esta '
             + 'especificação não deve ser apresentada como pronta a usar.';
    } else if (outros >= 3) {
      minimo = 2;
      motivo = 'Há ' + outros + ' achados críticos por resolver.';
    } else if (outros >= 1) {
      minimo = 1;
      motivo = outros === 1
        ? 'Há um achado crítico por resolver.'
        : 'Há ' + outros + ' achados críticos por resolver.';
    }

    var travado = minimo > banda;
    if (travado) banda = minimo; else motivo = null;

    var BANDAS = [
      { grau: 'Sólida', chave: 'solida',
        nota: 'Pronta a usar. Reveja daqui a três meses, ou quando mudar de funções.' },
      { grau: 'Utilizável', chave: 'utilizavel',
        nota: 'Funciona, mas há pontos concretos a apertar antes de a fixar.' },
      { grau: 'Frágil', chave: 'fragil',
        nota: 'Vai produzir efeitos, alguns não intencionais. Corrija os críticos primeiro.' },
      { grau: 'Desaconselhada', chave: 'ma',
        nota: 'Mais provável prejudicar do que ajudar. Vale a pena recomeçar pela estrutura.' }
    ];
    var r = BANDAS[banda];
    return { grau: r.grau, chave: r.chave, nota: r.nota,
             travado: travado, motivoTravao: motivo };
  }

  /* ─────────────────────────────────────────────────────────────
     API
     ───────────────────────────────────────────────────────────── */
  function analisa(texto, opcoes) {
    texto = String(texto == null ? '' : texto);
    var ctx = {
      camada: (opcoes && opcoes.camada) || 'global',
      orcamento: (opcoes && opcoes.orcamento) || ORCAMENTO.pago
    };
    var segs = segmenta(texto);
    var achados = [], sinais = {};

    if (!texto.trim()) {
      return {
        vazio: true, texto: texto, segmentos: [], achados: [],
        pontos: {}, total: 0, maximo: DIMENSOES.length * 2,
        classificacao: classifica(0, null), dimensoes: DIMENSOES, contexto: ctx,
        caracteres: 0
      };
    }

    var r;
    r = verRelevancia(segs, ctx);   achados = achados.concat(r.achados);
    sinais.comportamento = r.sinal;
    r = verEstabilidade(segs);      achados = achados.concat(r.achados);
    r = verEspecificidade(segs);    achados = achados.concat(r.achados);
    r = verAmbito(segs, ctx);       achados = achados.concat(r.achados);
    r = verVies(segs, ctx);         achados = achados.concat(r.achados);
    sinais.salvaguardas = r.sinal;
    r = verPrivacidade(segs);       achados = achados.concat(r.achados);
    r = verManutencao(texto, segs, ctx); achados = achados.concat(r.achados);
    r = verSeletividade(segs, texto);    achados = achados.concat(r.achados);
    sinais.condicionais = r.sinal;

    var ordem = { critico: 0, aviso: 1, nota: 2 };
    achados.sort(function (a, b) {
      return (ordem[a.gravidade] - ordem[b.gravidade]) || (a.inicio - b.inicio);
    });

    var pontos = pontua(achados, sinais, segs);
    var total = DIMENSOES.reduce(function (s, d) { return s + pontos[d.id]; }, 0);
    var criticos = { privacidade: 0, outros: 0, total: 0 };
    achados.forEach(function (a) {
      if (a.gravidade !== 'critico') return;
      criticos.total++;
      if (a.dimensao === 'privacidade') criticos.privacidade++;
      else criticos.outros++;
    });

    return {
      vazio: false, texto: texto, segmentos: segs, achados: achados,
      pontos: pontos, total: total, maximo: DIMENSOES.length * 2,
      classificacao: classifica(total, criticos), criticos: criticos,
      dimensoes: DIMENSOES,
      sinais: sinais, contexto: ctx, caracteres: texto.length
    };
  }

  /* Camada 2 — prompt de auditoria, para a segunda opinião semântica
     no chatbot do próprio formando. Sem chaves, sem rede. */
  function promptAuditoria(texto, resultado) {
    var linhas = [];
    linhas.push('Preciso que audites um texto que tenciono usar como contexto persistente '
              + 'num assistente de IA (instruções de perfil / instruções personalizadas).');
    linhas.push('');
    linhas.push('Não reescrevas já. Primeiro avalia, com a rubrica abaixo, e justifica cada nota.');
    linhas.push('');
    linhas.push('=== TEXTO A AUDITAR ===');
    linhas.push(texto.trim());
    linhas.push('=== FIM DO TEXTO ===');
    linhas.push('');
    linhas.push('Avalia cada uma destas oito dimensões de 0 a 2 (máximo 16):');
    DIMENSOES.forEach(function (d, i) {
      linhas.push((i + 1) + '. ' + d.nome + ' — ' + d.pergunta);
    });
    linhas.push('');
    linhas.push('Para cada dimensão com menos de 2, cita o excerto exato, explica que efeito '
              + 'concreto terá nas respostas futuras, e propõe uma reescrita.');
    linhas.push('');
    linhas.push('Depois aplica três testes:');
    linhas.push('• Teste da tarefa não relacionada: responde a «recomenda três plantas para '
              + 'uma varanda com sombra» como se este contexto estivesse ativo. Se o contexto '
              + 'profissional aparecer, diz que linha o fez sobre-ativar.');
    linhas.push('• Teste de âmbito: indica que linhas deviam estar em instruções de projeto '
              + 'em vez de no perfil, e porquê.');
    linhas.push('• Teste de viés: identifica qualquer preferência que funcione como conclusão '
              + 'já tomada, e mostra a análise que ela impediria.');
    linhas.push('');
    linhas.push('Termina com a versão revista, com um máximo de 300 palavras, e uma lista do '
              + 'que cortaste e porquê.');
    if (resultado && !resultado.vazio) {
      linhas.push('');
      linhas.push('Para referência, uma análise automática por regras deu '
                + resultado.total + '/' + resultado.maximo + ' ('
                + resultado.classificacao.grau + ') e levantou estes pontos — confirma-os '
                + 'ou contesta-os, não os aceites sem verificar:');
      var vistos = {};
      resultado.achados.slice(0, 8).forEach(function (a) {
        if (vistos[a.titulo]) return;
        vistos[a.titulo] = 1;
        linhas.push('- [' + a.gravidade + '] ' + a.titulo
                  + (a.excerto ? ' → «' + a.excerto.slice(0, 90) + '»' : ''));
      });
    }
    return linhas.join('\n');
  }

  raiz.MotorPersonalizacao = {
    analisa: analisa,
    promptAuditoria: promptAuditoria,
    DIMENSOES: DIMENSOES,
    FONTES: FONTES,
    ORCAMENTO: ORCAMENTO,
    _internos: { segmenta: segmenta, normaliza: normaliza, classifica: classifica }
  };
  if (typeof module === 'object' && module.exports) {
    module.exports = raiz.MotorPersonalizacao;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
