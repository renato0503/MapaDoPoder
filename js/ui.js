import { familiasPoliticas } from './data.js';
import { initBrazilMap } from './map.js';

const infoPanel = document.getElementById('info-panel');
const estadoNome = document.getElementById('estado-nome');
const familiaNome = document.getElementById('familia-nome');
const familiaPeriodo = document.getElementById('familia-periodo');
const familiaMembros = document.getElementById('familia-membros');
const familiaCargos = document.getElementById('familia-cargos');
const familiaCor = document.getElementById('familia-cor');
const legend = document.getElementById('legend');
const closeBtn = document.querySelector('.close-btn');

function atualizarPainel({ nomeEstado, familia, membros, periodo, cargos, cor }) {
  if (!familia) {
    estadoNome.textContent = 'Escolha um estado';
    familiaNome.textContent = 'Nenhum clã definido';
    familiaPeriodo.textContent = 'Sem dados';
    familiaMembros.innerHTML = '<li>Selecione um estado no mapa.</li>';
    familiaCargos.textContent = 'Sem cargos definidos';
    familiaCor.style.backgroundColor = '#d1d5db';
    infoPanel.classList.add('active');
    return;
  }

  estadoNome.textContent = nomeEstado;
  familiaNome.textContent = familia;
  familiaPeriodo.textContent = periodo;
  familiaCor.style.backgroundColor = cor;
  familiaMembros.innerHTML = membros.map((m) => `<li>${m}</li>`).join('');
  familiaCargos.textContent = cargos.join(', ');
  infoPanel.classList.add('active');
}

function gerarLegenda() {
  legend.innerHTML = '';
  Object.entries(familiasPoliticas).forEach(([sigla, dados]) => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <span class="legend-color" style="background:${dados.cor}"></span>
      <span><strong>${sigla}</strong>: ${dados.familia}</span>
    `;
    legend.appendChild(item);
  });
}

window.addEventListener('familiaSelected', (e) => {
  atualizarPainel(e.detail);
});

closeBtn.addEventListener('click', () => {
  infoPanel.classList.remove('active');
});

window.addEventListener('load', async () => {
  gerarLegenda();
  await initBrazilMap();
});
