/* Edições GenAI da Ciência e Letras — dados da linha temporal e dos próximos eventos.
 *
 * FONTE DE VERDADE: os YAML em `courses/<curso>/editions/` do repositório
 * marianacpais/cel-genai-healthcare-courses. Este ficheiro é uma transcrição do que lá está,
 * reduzida ao que pode ser público: data, horário, sessão, tema e formador. Zoom, Moodle,
 * password e notas internas não entram aqui nem em mais nada que seja publicado.
 *
 * Quando um YAML mudar, esta transcrição tem de ser refeita à mão até a skill de geração
 * existir (está em STATUS.md, secção Ferramentas).
 *
 * Campos de uma sessão:
 *   n       número da sessão na edição
 *   data    ISO, o dia da sessão
 *   blocos  [] por ordem; cada um { h: "16h00–18h00", tema, f: [nomes], aberto?: true }
 *           `aberto` marca o bloco cujo formador ainda não está fechado.
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
        { h: '08h30–10h30', tema: 'Introdução à IA e ao ChatGPT', f: ['Daniel Rodrigues'] },
        { h: '10h30–12h30', tema: 'Introdução à IA e ao ChatGPT', f: ['Daniel Rodrigues', 'Sandra Amaral'] } ] },
      { n: 2, data: '2026-09-19', blocos: [
        { h: '08h30–10h30', tema: 'Engenharia de Prompts', f: ['Hélder Palheira'] },
        { h: '10h30–12h30', tema: 'Engenharia de Prompts', f: ['Sandra Amaral'] } ] },
      { n: 3, data: '2026-09-26', nota: 'Sessão de 2H, só com o bloco 1', blocos: [
        { h: '08h30–10h30', tema: 'Impacto, Prática Clínica e o Papel do Profissional', f: ['Miguel Oliveira'] } ] },
      { n: 4, data: '2026-10-03', blocos: [
        { h: '08h30–10h30', tema: 'Gemini, NotebookLM e Escrita Científica', f: ['Daniel Rodrigues'] },
        { h: '10h30–12h30', tema: 'Gemini, NotebookLM e Escrita Científica', f: ['Jannine Nascimento'] } ] },
      { n: 5, data: '2026-10-10', blocos: [
        { h: '08h30–10h30', tema: 'Ética, Segurança e SOPs', f: ['Hélder Palheira'] },
        { h: '10h30–12h30', tema: 'Ética, Segurança e SOPs', f: ['Sandra Amaral'] } ] },
      { n: 6, data: '2026-10-17', blocos: [
        { h: '08h30–10h30', tema: 'Impacto Clínico e Assistentes Personalizados', f: ['Daniel Rodrigues'] },
        { h: '10h30–12h30', tema: 'Impacto Clínico e Assistentes Personalizados', f: ['Jannine Nascimento'] } ] },
      { n: 7, data: '2026-10-24', blocos: [
        { h: '08h30–10h30', tema: 'Laboratório de Projeto', f: ['Hélder Palheira'] },
        { h: '10h30–12h30', tema: 'Laboratório de Projeto', f: ['Sandra Amaral'] } ] },
      { n: 8, data: '2026-10-31', blocos: [
        { h: '08h30–10h30', tema: 'Apresentação de Projetos Finais', f: ['Sandra Amaral'] },
        { h: '10h30–12h30', tema: 'Apresentação de Projetos Finais', f: ['Hélder Palheira'] } ] }
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
        { h: '15h00–17h00', tema: 'Introdução à IA e ao ChatGPT', f: ['Hélder Palheira'] },
        { h: '17h00–19h00', tema: 'Introdução à IA e ao ChatGPT', f: ['Hélder Palheira', 'Jannine Nascimento'] } ] },
      { n: 2, data: '2026-09-18', blocos: [
        { h: '15h00–17h00', tema: 'Engenharia de Prompts', f: ['Jannine Nascimento'] },
        { h: '17h00–19h00', tema: 'Engenharia de Prompts', f: ['Sandra Amaral'] } ] },
      { n: 3, data: '2026-09-25', nota: 'Sessão de 2H, só com o bloco 2', blocos: [
        { h: '17h00–19h00', tema: 'ChatGPT Avançado e Ferramentas', f: ['Sandra Amaral'] } ] },
      { n: 4, data: '2026-10-02', blocos: [
        { h: '15h00–17h00', tema: 'Impacto, Prática Clínica e o Papel do Profissional', f: ['Miguel Oliveira'] },
        { h: '17h00–19h00', tema: 'Gemini, NotebookLM e Escrita Científica', f: ['Daniel Rodrigues'] } ] },
      { n: 5, data: '2026-10-09', nota: 'Blocos desiguais: 3H + 1H', blocos: [
        { h: '15h00–18h00', tema: 'Análise de Dados em Python e Google Colab com recurso a IA', f: ['Juliano Gaspar'] },
        { h: '18h00–19h00', tema: 'Ética, Segurança e SOPs', f: ['Jannine Nascimento'] } ] },
      { n: 6, data: '2026-10-16', blocos: [
        { h: '15h00–17h00', tema: 'Impacto Clínico e Assistentes Personalizados', f: ['Hélder Palheira'] },
        { h: '17h00–19h00', tema: 'Impacto Clínico e Assistentes Personalizados', f: ['Daniel Rodrigues'] } ] },
      { n: 7, data: '2026-10-23', blocos: [
        { h: '15h00–17h00', tema: 'Laboratório de Projeto', f: ['Jannine Nascimento'] },
        { h: '17h00–19h00', tema: 'Laboratório de Projeto', f: ['Sandra Amaral'] } ] },
      { n: 8, data: '2026-10-30', blocos: [
        { h: '15h00–17h00', tema: 'Apresentação de Projetos Finais', f: ['Hélder Palheira'], aberto: true },
        { h: '17h00–19h00', tema: 'Apresentação de Projetos Finais', f: ['Sandra Amaral'] } ] }
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
        { h: '16h00–18h00', tema: 'Introdução à IA e ao ChatGPT', f: ['Hélder Palheira'] },
        { h: '18h00–20h00', tema: 'Introdução à IA e ao ChatGPT', f: ['Hélder Palheira'] } ] },
      { n: 2, data: '2026-09-28', blocos: [
        { h: '16h00–18h00', tema: 'Engenharia de Prompts', f: ['Daniel Rodrigues'] },
        { h: '18h00–20h00', tema: 'Engenharia de Prompts', f: ['Sandra Amaral', 'Daniel Rodrigues'] } ] },
      { n: 3, data: '2026-10-12', nota: '05/10 é feriado; sessão de 3H (2H + 1H)', blocos: [
        { h: '16h00–18h00', tema: 'ChatGPT Avançado e Ferramentas', f: ['Jannine Nascimento'] },
        { h: '18h00–19h00', tema: 'ChatGPT Avançado e Ferramentas', f: ['Jannine Nascimento', 'Sandra Amaral'] } ] },
      { n: 4, data: '2026-10-19', blocos: [
        { h: '16h00–18h00', tema: 'Gemini, NotebookLM e Escrita Científica', f: ['Jannine Nascimento', 'Daniel Rodrigues'] },
        { h: '18h00–20h00', tema: 'Gemini, NotebookLM e Escrita Científica', f: ['Jannine Nascimento', 'Daniel Rodrigues'] } ] },
      { n: 5, data: '2026-10-26', nota: 'Bloco único de 3H', blocos: [
        { h: '16h00–19h00', tema: 'Análise de Dados em Python e Google Colab com recurso a IA', f: ['Juliano Gaspar'] } ] },
      { n: 6, data: '2026-11-02', blocos: [
        { h: '16h00–18h00', tema: 'Laboratório de Projeto', f: ['Daniel Rodrigues'] },
        { h: '18h00–20h00', tema: 'Laboratório de Projeto', f: ['Sandra Amaral', 'Daniel Rodrigues'] } ] },
      { n: 7, data: '2026-11-09', blocos: [
        { h: '16h00–18h00', tema: 'Ética, IA na Investigação e Escrita Científica', f: ['Jannine Nascimento'] },
        { h: '18h00–20h00', tema: 'Ética, IA na Investigação e Escrita Científica', f: ['Jannine Nascimento', 'Sandra Amaral'] } ] },
      { n: 8, data: '2026-11-16', blocos: [
        { h: '16h00–18h00', tema: 'Apresentação de Projetos Finais', f: ['Jannine Nascimento', 'Daniel Rodrigues'] },
        { h: '18h00–20h00', tema: 'Apresentação de Projetos Finais', f: ['Jannine Nascimento', 'Daniel Rodrigues'] } ] }
    ]
  },

  {
    id: 'ulsba-saude1',
    curso: 'ulsba',
    nome: 'ULSBA · Gestão e Prática em Saúde',
    sub: '1ª edição',
    horario: 'terças · 14h00–18h00',
    sessoes: [
      { n: 1, data: '2026-10-06', blocos: [ { h: '14h00–18h00', tema: 'Por definir', f: [] } ] },
      { n: 2, data: '2026-10-13', blocos: [ { h: '14h00–18h00', tema: 'Por definir', f: [] } ] },
      { n: 3, data: '2026-10-20', nota: 'Sessão de 3H', blocos: [ { h: '14h00–17h00', tema: 'Por definir', f: [] } ] },
      { n: 4, data: '2026-10-27', nota: 'Sessão de 3H', blocos: [ { h: '14h00–17h00', tema: 'Por definir', f: [] } ] },
      { n: 5, data: '2026-11-03', blocos: [ { h: '14h00–18h00', tema: 'Por definir', f: [] } ] },
      { n: 6, data: '2026-11-10', blocos: [ { h: '14h00–18h00', tema: 'Por definir', f: [] } ] },
      { n: 7, data: '2026-11-17', blocos: [ { h: '14h00–18h00', tema: 'Laboratório de Projeto', f: [] } ] },
      { n: 8, data: '2026-11-24', blocos: [ { h: '14h00–18h00', tema: 'Apresentação de Projetos Finais', f: [] } ] }
    ]
  },

  {
    id: 'ulsba-med1',
    curso: 'ulsba',
    nome: 'ULSBA · Médicos',
    sub: '1ª edição',
    horario: 'segundas · 14h00–18h00',
    sessoes: [
      { n: 1, data: '2026-10-12', blocos: [ { h: '14h00–18h00', tema: 'Por definir', f: [] } ] },
      { n: 2, data: '2026-10-19', blocos: [ { h: '14h00–18h00', tema: 'Por definir', f: [] } ] },
      { n: 3, data: '2026-10-26', nota: 'Sessão de 3H', blocos: [ { h: '14h00–17h00', tema: 'Por definir', f: [] } ] },
      { n: 4, data: '2026-11-02', nota: 'Sessão de 3H', blocos: [ { h: '14h00–17h00', tema: 'Por definir', f: [] } ] },
      { n: 5, data: '2026-11-09', blocos: [ { h: '14h00–18h00', tema: 'Por definir', f: [] } ] },
      { n: 6, data: '2026-11-16', blocos: [ { h: '14h00–18h00', tema: 'Por definir', f: [] } ] },
      { n: 7, data: '2026-11-23', blocos: [ { h: '14h00–18h00', tema: 'Laboratório de Projeto', f: [] } ] },
      { n: 8, data: '2026-11-30', blocos: [ { h: '14h00–18h00', tema: 'Apresentação de Projetos Finais', f: [] } ] }
    ]
  }
];

const CURSOS = [
  { id: 'todos', rotulo: 'Todos os cursos' },
  { id: 'med',   rotulo: 'GenAI:med' },
  { id: 'enf',   rotulo: 'GenAI:enf' },
  { id: 'ulsba', rotulo: 'ULSBA' }
];
