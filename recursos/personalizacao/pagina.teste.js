/* Teste de interface. Corre a página num DOM simulado e exercita os fluxos.
 *
 *   npm install jsdom && node pagina.teste.js
 *
 * O motor tem teste próprio, sem dependências: node motor.teste.js
 */
let JSDOM;
try { ({ JSDOM } = require('jsdom')); }
catch (e) {
  console.error('Falta o jsdom. Corra:  npm install jsdom');
  process.exit(2);
}
const fs = require('fs');
const DIR = __dirname + '/';

const erros = [];
const dom = new JSDOM(fs.readFileSync(DIR + 'index.html', 'utf8'), {
  runScripts: 'outside-only', url: 'https://hasp7.github.io/cel-genai-med/recursos/personalizacao/'
});
const w = dom.window;
w.addEventListener('error', e => erros.push('window error: ' + e.message));
// localStorage existe no jsdom; clipboard não.
w.navigator.clipboard = undefined;
w.alert = m => erros.push('alert: ' + m);
w.confirm = () => true;
w.HTMLElement.prototype.scrollIntoView = function(){};

try {
  w.eval(fs.readFileSync(DIR + 'motor.js', 'utf8'));
  const inline = fs.readFileSync(DIR + 'index.html', 'utf8');
  const js = inline.slice(inline.lastIndexOf('<script>') + 8, inline.lastIndexOf('</script>'));
  w.eval(js);
} catch (e) { erros.push('arranque: ' + e.message + '\n' + e.stack.split('\n').slice(0,3).join('\n')); }

const d = w.document;
const $ = s => d.querySelector(s);
const $$ = s => [...d.querySelectorAll(s)];

function check(nome, cond, extra) {
  console.log(`${cond ? '  ok  ' : ' FALHA'} ${nome}${cond ? '' : ' — ' + (extra||'')}`);
  if (!cond) erros.push(nome);
}

check('7 secções construídas', $$('.sec').length === 7, $$('.sec').length);
check('textareas presentes', $$('.sec textarea').length === 7);
check('blocos de saída ChatGPT', $$('#saida .bloco').length === 3, $$('#saida .bloco').length);
check('lista de fontes preenchida', $$('#lista-fontes li').length >= 4);
check('camada 2 escondida no arranque', $('#camada2').hidden);

// escrever numa secção dispara avisos
const ta = $('#ta-a');
ta.value = 'Tenho 30 anos de experiência e licenciei-me em Coimbra.';
ta.dispatchEvent(new w.Event('input'));
check('aviso de biografia aparece', $$('#av-a li').length > 0, $$('#av-a li').length);
check('secção marcada como preenchida', $('#sec-a').classList.contains('preenchida'));
check('saída do perfil recebe o texto', ($('#saida pre')||{textContent:''}).textContent.includes('Coimbra'));

// trocar de fornecedor
$$('.aba').find(a => a.getAttribute('data-forn') === 'claude').dispatchEvent(new w.Event('click'));
check('aba Claude muda os blocos',
  $$('#saida .bloco-cab h4').map(h=>h.textContent).join('|').includes('Instruções para o Claude'),
  $$('#saida .bloco-cab h4').map(h=>h.textContent).join('|'));

// avaliar
$('#avaliar-texto').value = `Sou médico de família.
Lembra-te que o doente Manuel tem creatinina 2,1 mg/dL.
Separa evidência de inferência.`;
$('#btn-analisar').dispatchEvent(new w.Event('click'));
check('placar desenhado', !!$('#resultado .placar'));
check('8 barras de dimensão', $$('#resultado .dim').length === 8, $$('#resultado .dim').length);
check('achado crítico listado', $$('#resultado .achado.g-critico').length > 0);
check('fonte com link', !!$('#resultado .achado .fonte a'));
check('camada 2 revelada', !$('#camada2').hidden);
check('prompt de auditoria gerado', $('#prompt-auditoria').textContent.length > 400,
  $('#prompt-auditoria').textContent.length);
check('prompt inclui o texto auditado',
  $('#prompt-auditoria').textContent.includes('Separa evidência de inferência'));

// botão avaliar-o-que-construí
$('#btn-avaliar-construido').dispatchEvent(new w.Event('click'));
check('modo muda para avaliar', $('#tab-avaliar').getAttribute('aria-selected') === 'true');
check('texto do perfil copiado para o avaliador',
  $('#avaliar-texto').value.includes('Coimbra'));

// persistência
check('gravou em localStorage', !!w.localStorage.getItem('cel-personalizacao-v1'));

// limpar
$('#btn-limpar').dispatchEvent(new w.Event('click'));
check('limpou as secções', $('#ta-a').value === '');

console.log(erros.length ? `\n${erros.length} problema(s):\n` + erros.join('\n')
                         : '\nPágina corre sem erros.');
process.exit(erros.length ? 1 : 0);
