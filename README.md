# Cursos GenAI — IA Generativa para Profissionais de Saúde

Decks e materiais dos cursos **GenAI** da [Ciência e Letras](https://github.com/hasp7):
`GenAI:med` (médicos), `GenAI:enf` (enfermeiros) e a linha ULSBA. 30 horas e 8 sessões cada.

**Site:** https://hasp7.github.io/cel-genai-med/

> O repositório chama-se `cel-genai-med` de quando só havia a linha de medicina. Se for
> renomeado, o URL do Pages muda com ele (o GitHub mantém um redireccionamento do nome antigo).

- **Coordenação:** Hélder Palheira, Mariana Canelas Pais
- **Catálogo e calendário:** os conteúdos, atividades, edições e quizzes vivem em
  [`marianacpais/cel-genai-healthcare-courses`](https://github.com/marianacpais/cel-genai-healthcare-courses).
  Este repo é só o lado publicado — os decks.
- **Identidade visual:** contexto `cel` em `claude/design-md/` no hasp-HQ. O `shared/cel-base.css`
  é uma cópia; alterações de identidade fazem-se lá e descem para aqui.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Hub: linha temporal das edições, próximos blocos, e o acesso aos decks — lista **só** as sessões já publicadas |
| `shared/edicoes.js` | Dados das edições que alimentam a linha temporal e os próximos blocos |
| `aula-N/` | Deck de um bloco (`index.html`, reveal.js). `aula-1/` é o bloco **1.1**; os blocos seguintes ficam em `aula-1-2/`, `aula-2-1/` e assim por diante |
| `shared/` | `cel-base.css` (identidade dos decks), `landing.css`, logótipo |
| `versions/` | Snapshots congelados por edição — não se mexe depois de criados |
| `VERSIONS.md` | O que mudou entre versões, e que edição viu o quê |

## O hub

A página de entrada deixou de ser um índice de decks e passou a acompanhar as turmas.
Três secções, todas filtráveis pelo seletor de curso no topo:

- **Linha temporal** — uma faixa por edição, as oito sessões no dia em que acontecem, e a marca
  de hoje. Ponto cheio é sessão dada; a que tem o contorno grosso é a seguinte.
- **Próximos blocos** — os oito blocos seguintes em todas as edições, com data, horário, tema e
  formador.
- **Decks das sessões** — a matriz de sempre, agora com uma coluna por edição publicada.

A linha temporal e os próximos blocos calculam-se em cada visita a partir da data do browser:
a página mantém-se sozinha entre edições e não precisa de ser tocada só porque passou uma semana.

**Os dados vivem em `shared/edicoes.js`**, transcritos dos YAML em `courses/*/editions/` do repo
dos cursos. A transcrição é manual até existir a skill de geração; quando um cronograma mudar,
muda-se lá também.

> **O que não entra aqui.** O site é público. Ligações de Zoom, passwords, URLs de Moodle e notas
> internas de escala ficam de fora do `edicoes.js` e de tudo o mais que seja publicado — chegam
> aos formadores pelo convite de calendário. Da escala publica-se o nome de quem dá o bloco, e
> nada além disso.

## Como trabalhar

> **O site é público.** A landing só deve listar sessões prontas a serem vistas — acrescentar a
> linha da aula N ao `index.html` é o gesto que a publica. Uma aula pode existir em `aula-N/`
> sem estar listada, mas quem souber o URL entra à mesma; para material que não pode circular,
> ver a secção de arquivo no fim.

**Enquanto a aula está viva:** editar `aula-N/index.html` directamente. O site actualiza-se no
push, e as duas edições em curso apontam para o mesmo deck.

**Etiqueta das ligações:** só a data, `<dia>/<mês>`, na qual *aquela* edição deu o bloco —
`12/09` na 9ª, `11/09` na 10ª. O bloco já está identificado na linha, portanto repeti-lo na
célula era ruído; a data é o que o formador precisa de confirmar num relance.

**Código da edição no `?ed=`.** `med9`, `apmgf10`, `enf5` — o nome da edição, não o sufixo do
`edition_id`. A 10ª de medicina e a 5ª de enfermagem acabam ambas em `ST`, por isso o sufixo não
serve para distinguir. Código desconhecido cai na primeira edição da lista.

**Um deck por bloco, não por aula.** Uma sessão de 4H tem dois blocos e cada um é um deck
próprio, listado na sua linha da landing. `aula-1/` ficou com o nome antigo por já estar
publicado; os que vierem seguem `aula-<aula>-<bloco>/`.

**No fim de uma edição, congelar:**

```bash
mkdir -p versions/GenAIMed0926FM/aula-1
cp -r aula-1/. versions/GenAIMed0926FM/aula-1/
# corrigir o caminho do CSS no snapshot (fica dois níveis mais fundo)
sed -i 's|\.\./shared/|../../../shared/|g' versions/GenAIMed0926FM/aula-1/index.html
git add . && git commit -m "freeze(GenAIMed0926FM): aula 1"
git tag GenAIMed0926FM-aula1-v1.0.0
git push --follow-tags
```

Depois, na landing, mudar o `href` dessa edição para o snapshot — a etiqueta (`aula1-12/09`)
mantém-se, muda só para onde aponta. A partir daí o deck vivo pode mudar à vontade sem alterar
o que aquela turma viu.

## Arquivar / tirar de circulação

1. `git tag` + **GitHub Release** com o deck em anexo — é o arquivo imutável, sobrevive a tudo
2. Desligar o **Pages** em *Settings → Pages* — o site morre, o conteúdo fica em git
3. Se também não quiseres o código à vista, pôr o repo **privado** (o que já desliga o Pages)

> Não existe Pages protegido por password fora do GitHub Enterprise. Se o conteúdo não puder
> ser público, o alojamento tem de ser outro (Cloudflare Pages, por exemplo).
