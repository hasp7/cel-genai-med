/* Edições GenAI da Ciência e Letras — dados da linha temporal e dos próximos eventos.
 *
 * FONTE DE VERDADE: os YAML em `courses/<curso>/editions/` do repositório
 * marianacpais/cel-genai-healthcare-courses. Este ficheiro é uma transcrição do que lá está,
 * reduzida ao que pode ser público: data, horário, sessão e tema.
 *
 * A ESCALA NÃO ENTRA AQUI. Quem dá cada bloco fica de fora por duas razões. É a parte que mais
 * muda nos YAML, e sem verificação automática uma página pública desatualizada engana mais do
 * que informa. E publicá-la punha a escala à vista antes de as pessoas serem convidadas.
 * Quem dá o quê chega aos formadores pelo convite de calendário, gerado do mesmo YAML pelo
 * `eventos.mjs`. Zoom, Moodle, passwords e notas internas também não entram.
 *
 * Quando um YAML mudar, esta transcrição tem de ser refeita à mão. Datas e horários mexem
 * pouco — foi por isso que se optou por transcrever em vez de gerar.
 *
 * Campos de uma sessão:
 *   n       número da sessão na edição
 *   data    ISO, o dia da sessão
 *   blocos  [] por ordem; cada um { h: "16h00–18h00", tema }
 *   nota    linha curta, quando a sessão foge ao padrão (feriado antes, bloco único, etc.)
 */

const EDICOES = [
  {
    id: 'med9',
    curso: 'med',
    nome: 'GenAI:med · 9ª edição',
    sub: 'Ciência e Letras',
    horario: 'sábados · 08h30–12h30',
    sessoes: [
      { n: 1, data: '2026-09-12', blocos: [
        { h: '08h30–10h30', tema: 'Introdução à IA e ao ChatGPT' },
        { h: '10h30–12h30', tema: 'Introdução à IA e ao ChatGPT' } ] },
      { n: 2, data: '2026-09-19', blocos: [
        { h: '08h30–10h30', tema: 'Engenharia de Prompts' },
        { h: '10h30–12h30', tema: 'Engenharia de Prompts' } ] },
      { n: 3, data: '2026-09-26', nota: 'Sessão de 2H, só com o bloco 1', blocos: [
        { h: '08h30–10h30', tema: 'Impacto, Prática Clínica e o Papel do Profissional' } ] },
      { n: 4, data: '2026-10-03', blocos: [
        { h: '08h30–10h30', tema: 'DeepResearch; Escrita Científica; Detetores de IA' },
        { h: '10h30–12h30', tema: 'NotebookLM e AI Slop' } ] },
      { n: 5, data: '2026-10-10', blocos: [
        { h: '08h30–10h30', tema: 'Ética, Segurança e SOPs' },
        { h: '10h30–12h30', tema: 'Ética, Segurança e SOPs' } ] },
      { n: 6, data: '2026-10-17', blocos: [
        { h: '08h30–10h30', tema: 'Impacto Clínico e Assistentes Personalizados' },
        { h: '10h30–12h30', tema: 'Impacto Clínico e Assistentes Personalizados' } ] },
      { n: 7, data: '2026-10-24', blocos: [
        { h: '08h30–10h30', tema: 'Laboratório de Projeto' },
        { h: '10h30–12h30', tema: 'Laboratório de Projeto' } ] },
      { n: 8, data: '2026-10-31', blocos: [
        { h: '08h30–10h30', tema: 'Apresentação de Projetos Finais' },
        { h: '10h30–12h30', tema: 'Apresentação de Projetos Finais' } ] }
    ]
  },

  {
    id: 'apmgf10',
    curso: 'med',
    nome: 'GenAI:med · 10ª edição',
    sub: 'APMGF',
    horario: 'sextas · 15h00–19h00',
    sessoes: [
      { n: 1, data: '2026-09-11', blocos: [
        { h: '15h00–17h00', tema: 'Introdução à IA e ao ChatGPT' },
        { h: '17h00–19h00', tema: 'Introdução à IA e ao ChatGPT' } ] },
      { n: 2, data: '2026-09-18', blocos: [
        { h: '15h00–17h00', tema: 'Engenharia de Prompts' },
        { h: '17h00–19h00', tema: 'Engenharia de Prompts' } ] },
      { n: 3, data: '2026-09-25', nota: 'Sessão de 2H, só com o bloco 2', blocos: [
        { h: '17h00–19h00', tema: 'NotebookLM e AI Slop' } ] },
      { n: 4, data: '2026-10-02', blocos: [
        { h: '15h00–17h00', tema: 'Impacto, Prática Clínica e o Papel do Profissional' },
        { h: '17h00–19h00', tema: 'DeepResearch; Escrita Científica; Detetores de IA' } ] },
      { n: 5, data: '2026-10-09', blocos: [
        { h: '15h00–18h00', tema: 'Análise de Dados em Python e Google Colab com recurso a IA' },
        { h: '18h00–19h00', tema: 'Ética e Segurança' } ] },
      { n: 6, data: '2026-10-16', blocos: [
        { h: '15h00–17h00', tema: 'Impacto Clínico e Assistentes Personalizados' },
        { h: '17h00–19h00', tema: 'Impacto Clínico e Assistentes Personalizados' } ] },
      { n: 7, data: '2026-10-23', blocos: [
        { h: '15h00–17h00', tema: 'Laboratório de Projeto' },
        { h: '17h00–19h00', tema: 'Laboratório de Projeto' } ] },
      { n: 8, data: '2026-10-30', blocos: [
        { h: '15h00–17h00', tema: 'Apresentação de Projetos Finais' },
        { h: '17h00–19h00', tema: 'Apresentação de Projetos Finais' } ] }
    ]
  },

  {
    id: 'enf5',
    curso: 'enf',
    nome: 'GenAI:enf · 5ª edição',
    sub: 'Ciência e Letras',
    horario: 'segundas · 16h00–20h00',
    sessoes: [
      { n: 1, data: '2026-09-21', blocos: [
        { h: '16h00–18h00', tema: 'Introdução à IA e ao ChatGPT' },
        { h: '18h00–20h00', tema: 'Introdução à IA e ao ChatGPT' } ] },
      { n: 2, data: '2026-09-28', blocos: [
        { h: '16h00–18h00', tema: 'Engenharia de Prompts' },
        { h: '18h00–20h00', tema: 'Engenharia de Prompts' } ] },
      { n: 3, data: '2026-10-12', nota: '05/10 é feriado; sessão de 3H (2H + 1H)', blocos: [
        { h: '16h00–18h00', tema: 'ChatGPT Avançado e Ferramentas' },
        { h: '18h00–19h00', tema: 'ChatGPT Avançado e Ferramentas' } ] },
      { n: 4, data: '2026-10-19', blocos: [
        { h: '16h00–18h00', tema: 'Gemini, NotebookLM e Escrita Científica' },
        { h: '18h00–20h00', tema: 'Gemini, NotebookLM e Escrita Científica' } ] },
      { n: 5, data: '2026-10-26', nota: 'Bloco único de 3H', blocos: [
        { h: '16h00–19h00', tema: 'Análise de Dados em Python e Google Colab com recurso a IA' } ] },
      { n: 6, data: '2026-11-02', blocos: [
        { h: '16h00–18h00', tema: 'Laboratório de Projeto' },
        { h: '18h00–20h00', tema: 'Laboratório de Projeto' } ] },
      { n: 7, data: '2026-11-09', blocos: [
        { h: '16h00–18h00', tema: 'Ética, IA na Investigação e Escrita Científica' },
        { h: '18h00–20h00', tema: 'Ética, IA na Investigação e Escrita Científica' } ] },
      { n: 8, data: '2026-11-16', blocos: [
        { h: '16h00–18h00', tema: 'Apresentação de Projetos Finais' },
        { h: '18h00–20h00', tema: 'Apresentação de Projetos Finais' } ] }
    ]
  },

  {
    id: 'ulsba-saude1',
    curso: 'ulsba',
    nome: 'ULSBA · Gestão e Prática em Saúde',
    sub: '1ª edição',
    horario: 'terças · 14h00–18h00',
    sessoes: [
      { n: 1, data: '2026-10-06', blocos: [
        { h: '14h00–16h00', tema: 'Apresentação; Caracterização da Turma' },
        { h: '16h00–18h00', tema: 'Intro IA' } ] },
      { n: 2, data: '2026-10-13', blocos: [
        { h: '14h00–16h00', tema: 'Personalização e Design prompting' },
        { h: '16h00–18h00', tema: 'Prompt Engineering I/II' } ] },
      { n: 3, data: '2026-10-20', nota: 'Sessão de 3H, bloco 2 de 1H', blocos: [
        { h: '14h00–16h00', tema: 'Por definir' },
        { h: '16h00–17h00', tema: 'Por definir' } ] },
      { n: 4, data: '2026-10-27', nota: 'Sessão de 3H, bloco 2 de 1H', blocos: [
        { h: '14h00–16h00', tema: 'Por definir' },
        { h: '16h00–17h00', tema: 'Por definir' } ] },
      { n: 5, data: '2026-11-03', blocos: [
        { h: '14h00–16h00', tema: 'Por definir' },
        { h: '16h00–18h00', tema: 'Por definir' } ] },
      { n: 6, data: '2026-11-10', blocos: [
        { h: '14h00–16h00', tema: 'Por definir' },
        { h: '16h00–18h00', tema: 'Por definir' } ] },
      { n: 7, data: '2026-11-17', blocos: [
        { h: '14h00–16h00', tema: 'Laboratório de Projeto' },
        { h: '16h00–18h00', tema: 'Laboratório de Projeto' } ] },
      { n: 8, data: '2026-11-24', blocos: [
        { h: '14h00–16h00', tema: 'Apresentação de Projetos Finais' },
        { h: '16h00–18h00', tema: 'Apresentação de Projetos Finais' } ] }
    ]
  },

  {
    id: 'ulsba-med1',
    curso: 'ulsba',
    nome: 'ULSBA · Médicos',
    sub: '1ª edição',
    horario: 'segundas · 14h00–18h00',
    sessoes: [
      { n: 1, data: '2026-10-12', blocos: [
        { h: '14h00–16h00', tema: 'Apresentação; Caracterização da Turma' },
        { h: '16h00–18h00', tema: 'Intro IA' } ] },
      { n: 2, data: '2026-10-19', blocos: [
        { h: '14h00–16h00', tema: 'Personalização e Design prompting' },
        { h: '16h00–18h00', tema: 'Prompt Engineering I/II' } ] },
      { n: 3, data: '2026-10-26', nota: 'Sessão de 3H, bloco 2 de 1H', blocos: [
        { h: '14h00–16h00', tema: 'Por definir' },
        { h: '16h00–17h00', tema: 'Por definir' } ] },
      { n: 4, data: '2026-11-02', nota: 'Sessão de 3H, bloco 2 de 1H', blocos: [
        { h: '14h00–16h00', tema: 'Por definir' },
        { h: '16h00–17h00', tema: 'Por definir' } ] },
      { n: 5, data: '2026-11-09', blocos: [
        { h: '14h00–16h00', tema: 'Por definir' },
        { h: '16h00–18h00', tema: 'Por definir' } ] },
      { n: 6, data: '2026-11-16', blocos: [
        { h: '14h00–16h00', tema: 'Por definir' },
        { h: '16h00–18h00', tema: 'Por definir' } ] },
      { n: 7, data: '2026-11-23', blocos: [
        { h: '14h00–16h00', tema: 'Laboratório de Projeto' },
        { h: '16h00–18h00', tema: 'Laboratório de Projeto' } ] },
      { n: 8, data: '2026-11-30', blocos: [
        { h: '14h00–16h00', tema: 'Apresentação de Projetos Finais' },
        { h: '16h00–18h00', tema: 'Apresentação de Projetos Finais' } ] }
    ]
  }
];

const CURSOS = [
  { id: 'todos', rotulo: 'Todos os cursos' },
  { id: 'med',   rotulo: 'GenAI:med' },
  { id: 'enf',   rotulo: 'GenAI:enf' },
  { id: 'ulsba', rotulo: 'ULSBA' }
];
