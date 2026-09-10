# Versões

Snapshots auto-contidos em `versions/<edição>/aula-<N>/`. O deck **vivo** de cada aula está em
`aula-<N>/` na raiz. Congelar no fim de cada edição — ver o README.

Convenção de tag: `<EdiçãoID>-aula<N>-v<major>.<minor>.<patch>`
(ex.: `GenAIMed0926FM-aula1-v1.0.0`).

---

## Aula 1 — Introdução à IA e ao ChatGPT

### v0.5.0 — respiração visual (2026-09-10)
- Três **separadores de secção** (`.section-divider`, fundo petróleo): "A equipa e o curso",
  "Como são avaliados", "Datas e recursos". O componente existia na identidade e não estava
  a ser usado; é o que dá as pausas entre blocos que não se tocam.
- O slide "O projeto final" abandona as duas colunas de listas: passa a uma **barra de
  proporção 16/4**, na mesma linguagem das barras do cronograma. As cinco dimensões e a
  modulação por formato saem para slides próprios.
- "Como apresentam conta" ganha slide próprio com os números 4 / 3 / 0 em grande — é a
  informação que muda comportamento.
- "O projeto, sessão a sessão" passa a usar o componente `.process` (aulas 6, 7 e 8 ligadas
  por linha), e "Prazos e regras" fica só com as quatro regras, a respirar.
- Deck em **20 slides** por edição, com muito menos por slide.

### v0.4.0 — pré-submissão e entregáveis (2026-09-10)
- Dois slides novos entre "O projeto final" e "Prazos e regras":
  **A pré-submissão** (o que é, quando abre e fecha, as seis perguntas do quiz, e a nota
  de que as quatro primeiras já são o rascunho do relatório) e **O que se entrega**
  (relatório com as seis secções do template, apresentação, anexos).
- Conteúdo transposto de `wip/projeto-final-avaliacao/06-B-pre-submissao.md` e
  `05-A-templates.md` no repo dos cursos.
- "Prazos e regras" enxugado na coluna do projeto, que passara a repetir a pré-submissão.
- O bloco 1.1 fica em **14 slides**. Para 45 minutos é apertado: cinco são de avaliação.
  Rever depois da primeira apresentação.

### v0.3.0 — avaliação em três slides (2026-09-10)
- A secção de avaliação passa de um slide a três: **Avaliação** (mapa das componentes,
  sem pesos globais — a integração das três numa nota única está diferida para a v2 da
  pipeline), **O projeto final** (0-20, submissão 16 / apresentação 4, as cinco dimensões
  nomeadas, os quatro níveis e a modulação por formato) e **Prazos e regras**, que não
  existia.
- Pipeline nova de avaliação aplicada às duas turmas: pré-submissão abre na aula 6, é um
  quiz obrigatório no Moodle e fecha no fim da aula 7; submissão final no próprio dia da
  apresentação, na aula 8.
- Escala de classificação **deliberadamente fora do slide** — fica só como nota de orador,
  para responder se perguntarem.
- Jannine Nascimento com descrição, e o nome corrigido para "Jannine".
- **Por fechar:** Sandra Amaral e Juliano Gaspar continuam sem descrição. O tópico dedicado
  à avaliação no Moodle está por criar.

### v0.2.0 — bloco 1.1 "Apresentação do curso" (2026-09-10)
- 11 slides, a partir do deck de referência `1.1 ChatGPT - Apresentação do curso.pptx`
  (Drive, jan/2026): tópicos, coordenação, equipa formativa, objetivos, funcionamento,
  avaliação, cronograma, recursos, apresentação dos formandos, fecho.
- **Serve as duas edições no mesmo ficheiro.** `?ed=fm` → 9ª (CeL, sábados);
  `?ed=st` → 10ª (APMGF, sextas). Sem parâmetro, assume a 9ª.
  Diferem por edição: capa, equipa formativa e cronograma.
- Cronogramas gerados a partir de `courses/genai-med/editions/` no repo dos cursos.
- Equipa de cada edição resolvida pela regra do `slide_group` no `trainers.yaml`.
- **Por fechar:** Sandra Amaral, Janinne Nascimento e Juliano Gaspar aparecem sem
  descrição — falta-lhes a `headline` no `trainers.yaml`. E o slide de avaliação ainda
  reflecte o modelo antigo (ver nota do orador).

### v0.1.0 — esqueleto (2026-09-10)
- Estrutura inicial do deck: capa, agenda, separador de módulo, slide de cards, fecho.
- Serviu de exemplo de aplicação da identidade CeL; substituído pela v0.2.0.

---

## Edições

| Edição | Datas | Estado |
|---|---|---|
| `GenAIMed0926FM` (9ª, CeL) | sáb, 12/09–31/10/2026 | em curso — decks a apontar para os vivos |
| `GenAIMed0926ST` (10ª, APMGF) | sex, 11/09–30/10/2026 | em curso — decks a apontar para os vivos |

Edições anteriores (5ª a 8ª) são anteriores a este repo e não têm decks aqui.
