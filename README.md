# GenAI:med — IA Generativa para Profissionais de Saúde (Médicos)

Decks e materiais do curso **GenAI:med** da [Ciência e Letras](https://github.com/hasp7).
30 horas, 8 sessões.

**Site:** https://hasp7.github.io/cel-genai-med/

- **Coordenação:** Hélder Palheira, Mariana Canelas Pais
- **Catálogo e calendário:** os conteúdos, atividades, edições e quizzes vivem em
  [`marianacpais/cel-genai-healthcare-courses`](https://github.com/marianacpais/cel-genai-healthcare-courses).
  Este repo é só o lado publicado — os decks.
- **Identidade visual:** contexto `cel` em `claude/design-md/` no hasp-HQ. O `shared/cel-base.css`
  é uma cópia; alterações de identidade fazem-se lá e descem para aqui.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Ponto de acesso dos formadores — lista **só** as sessões já publicadas |
| `aula-N/` | Deck de um bloco (`index.html`, reveal.js). `aula-1/` é o bloco **1.1**; os blocos seguintes ficam em `aula-1-2/`, `aula-2-1/` e assim por diante |
| `shared/` | `cel-base.css` (identidade dos decks), `landing.css`, logótipo |
| `versions/` | Snapshots congelados por edição — não se mexe depois de criados |
| `VERSIONS.md` | O que mudou entre versões, e que edição viu o quê |

## Como trabalhar

> **O site é público.** A landing só deve listar sessões prontas a serem vistas — acrescentar a
> linha da aula N ao `index.html` é o gesto que a publica. Uma aula pode existir em `aula-N/`
> sem estar listada, mas quem souber o URL entra à mesma; para material que não pode circular,
> ver a secção de arquivo no fim.

**Enquanto a aula está viva:** editar `aula-N/index.html` directamente. O site actualiza-se no
push, e as duas edições em curso apontam para o mesmo deck.

**Etiqueta das ligações:** `aula<bloco>-<dia>/<mês>`, com a data em que *aquela* edição deu a
sessão — `aula1.1-12/09` na 9ª, `aula1.1-11/09` na 10ª. É o que permite ao formador confirmar
num relance que está a abrir o deck do bloco e do dia certos.

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
