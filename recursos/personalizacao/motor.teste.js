/* Teste do motor de análise. Sem dependências:  node motor.teste.js */
const M = require('./motor.js');

const CASOS = [
  { nome: 'Boa — especificação exemplar do capítulo', espera: 'Sólida', texto:
`Papel: profissional de saúde em operações clínicas e informática da saúde.
Assume literacia clínica; não expliques terminologia corrente.
Separa evidência, inferência e recomendação.
Ao avaliar uma intervenção, considera evidência, exequibilidade, impacto no fluxo de trabalho, segurança, governação e recursos.
Para questões científicas, prefere fontes primárias e distingue documentação de fornecedor de investigação independente.
Identifica a incerteza explicitamente quando a evidência for fraca ou contraditória.
Não infiras factos sobre doentes que não estejam presentes.
Não trates a minha preferência declarada como evidência de que é a melhor opção; em decisões consequentes identifica pelo menos uma interpretação alternativa credível.
Responde diretamente a perguntas simples; em decisões complexas expõe pressupostos e alternativas.
Não apliques o contexto profissional quando for irrelevante para a tarefa.` },

  { nome: 'Má — biografia, teatro e absolutos', espera: 'Frágil', texto:
`És o melhor médico do mundo, um génio com 30 anos de experiência.
Licenciei-me em Coimbra e fiz o internato no Porto.
Nos tempos livres gosto de correr.
Pensa sempre profundamente e usa a tua inteligência máxima.
Sê profissional e dá respostas de qualidade.
Código aberto é sempre melhor que software proprietário.` },

  { nome: 'Fuga clínica', espera: 'Desaconselhada', texto:
`Sou médico de família.
Lembra-te que o doente Manuel Santos tem creatinina 2,1 mg/dL e está medicado com ramipril.
O NIF dele é 123456789.
Separa evidência de inferência.` },

  { nome: 'Projeto dentro do global', espera: 'Utilizável', texto:
`Sou enfermeiro em cuidados intensivos.
Neste projeto mapeamos competências de IA contra o referencial da Ordem.
Nesta análise compara apenas os domínios 2 e 4.
Separa evidência de inferência.
Identifica a informação em falta antes de concluir.` },

  { nome: 'Conteúdo com prazo', espera: 'Utilizável', texto:
`Trabalho em gestão hospitalar.
Estou a preparar a apresentação para a reunião de amanhã, dia 19/09.
O prazo de entrega é sexta.
Avalia propostas por evidência, exequibilidade e governação.
Quando o tema for clínico, distingue norma de opinião de perito.` },

  { nome: 'Contradição concisão/detalhe', espera: 'Utilizável', texto:
`Sou farmacêutica hospitalar.
Sê sempre concisa e direta ao ponto.
Dá sempre respostas detalhadas e exaustivas sobre tudo.
Usa tabelas para comparar.
Identifica pressupostos.` },


  { nome: 'FP — método clínico legítimo', espera: 'Sólida', texto:
`Sou médico internista.
Ao discutir casos clínicos, distingue factos documentados de inferência.
Ao interpretar análises, contextualiza valores como creatinina e potássio face à idade e à função renal.
Para questões terapêuticas, distingue recomendação de norma, evidência observacional e opinião de perito.
Identifica a informação em falta antes de concluir.
Não infiras factos sobre doentes que não estejam presentes.
Não trates a minha preferência como evidência; identifica pelo menos uma alternativa credível.
Quando o assunto não for clínico, não apliques o contexto profissional.
Responde diretamente a perguntas simples.` },

  { nome: 'FP — instrução de âmbito bem colocada', espera: 'Sólida', texto:
`Sou gestora de unidade de saúde.
Assume literacia em qualidade e melhoria contínua.
Separa evidência, pressupostos e recomendação.
Ao avaliar tecnologia, considera segurança clínica, impacto no fluxo de trabalho, governação de dados e recursos.
Para decisões consequentes, identifica uma interpretação alternativa credível.
Quando a evidência for fraca, di-lo em vez de suavizar.
Começa análises complexas pela conclusão.
Não apliques este enquadramento quando o tema for pessoal.` },
  { nome: 'Vazio', espera: 'vazio', texto: '' },
  { nome: 'Uma linha trivial', espera: 'Desaconselhada', texto: 'Sou médico.' }
];

let falhas = 0;
for (const c of CASOS) {
  const r = M.analisa(c.texto, { camada: 'global' });
  const t = r.total, cls = r.classificacao.grau;
  let ok;
  if (c.espera === 'vazio') ok = r.vazio;
  else ok = cls === c.espera;
  if (!ok) falhas++;
  console.log(`${ok ? '  ok  ' : ' FALHA'} ${String(t).padStart(2)}/16 ${cls.padEnd(14)}${r.classificacao.travado?'(travado) ':'          '}${c.nome}`);
  if (!ok || process.env.V) {
    const porDim = {};
    r.achados.forEach(a => (porDim[a.dimensao] = (porDim[a.dimensao]||0)+1));
    console.log('        pontos:', JSON.stringify(r.pontos));
    console.log('        achados:', r.achados.map(a=>`${a.gravidade}:${a.titulo}`).join(' | ') || '—');
  }
}
console.log(falhas ? `\n${falhas} caso(s) fora do esperado` : '\nTodos os casos dentro do esperado');
