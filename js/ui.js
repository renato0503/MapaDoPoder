import { loadFamiliasData, getClansMap } from './data.js';
import { initBrazilMap } from './map.js';

const infoPanel = document.getElementById('info-panel');
const estadoNome = document.getElementById('estado-nome');
const familiaNome = document.getElementById('familia-nome');
const familiaPeriodo = document.getElementById('familia-periodo');
const familiaMembros = document.getElementById('familia-membros');
const familiaCargos = document.getElementById('familia-cargos');
const familiaCor = document.getElementById('familia-cor');
const familiaAncoras = document.getElementById('familia-ancoras');
const familiaCuriosidades = document.getElementById('familia-curiosidades');
const clansList = document.getElementById('clans-list');
const legend = document.getElementById('legend');
const closeBtn = document.querySelector('.close-btn');

let currentClans = [];

function atualizarPainel({ uf, nomeEstado, grupos }) {
  currentClans = grupos;
  
  if (grupos.length === 0) {
    estadoNome.textContent = nomeEstado;
    familiaNome.textContent = 'Nenhum clã definido';
    familiaPeriodo.textContent = 'Sem dados';
    familiaMembros.innerHTML = '<li>Este estado ainda não tem dados de clãs políticos no infográfico.</li>';
    familiaCargos.textContent = 'Sem cargos definidos';
    familiaAncoras.innerHTML = '';
    familiaCuriosidades.textContent = '';
    familiaCor.style.backgroundColor = '#d1d5db';
    clansList.innerHTML = '';
    infoPanel.classList.add('active');
    return;
  }

  estadoNome.textContent = nomeEstado;
  
  const destaque = grupos.find(g => g.destaque) || grupos[0];
  
  familiaNome.textContent = destaque.familia;
  familiaPeriodo.textContent = destaque.periodo;
  familiaCor.style.backgroundColor = destaque.cor_hex;
  familiaMembros.innerHTML = destaque.membros.map(m => `<li>${m}</li>`).join('');
  familiaCargos.textContent = destaque.cargos.join(', ');
  familiaAncoras.innerHTML = destaque.ancoras_poder.map(a => `<span class="anchor-tag">${a}</span>`).join('');
  familiaCuriosidades.textContent = destaque.curiosidades;
  
  if (grupos.length > 1) {
    clansList.innerHTML = '<h4>Outros clãs neste estado:</h4>' + 
      grupos.filter(g => !g.destaque).map(g => `
        <div class="clan-mini" data-uf="${uf}" data-familia="${g.familia}" style="border-left: 4px solid ${g.cor_hex}">
          <strong>${g.familia}</strong> (${g.periodo})<br>
          <small>${g.membros.slice(0, 3).join(', ')}</small>
        </div>
      `).join('');
    
    clansList.querySelectorAll('.clan-mini').forEach(el => {
      el.addEventListener('click', () => {
        const familiaName = el.dataset.familia;
        const selectedClan = grupos.find(g => g.familia === familiaName);
        if (selectedClan) {
          familiaNome.textContent = selectedClan.familia;
          familiaPeriodo.textContent = selectedClan.periodo;
          familiaCor.style.backgroundColor = selectedClan.cor_hex;
          familiaMembros.innerHTML = selectedClan.membros.map(m => `<li>${m}</li>`).join('');
          familiaCargos.textContent = selectedClan.cargos.join(', ');
          familiaAncoras.innerHTML = selectedClan.ancoras_poder.map(a => `<span class="anchor-tag">${a}</span>`).join('');
          familiaCuriosidades.textContent = selectedClan.curiosidades;
        }
      });
    });
  } else {
    clansList.innerHTML = '';
  }
  
  infoPanel.classList.add('active');
}

function gerarLegenda(familiasData) {
  legend.innerHTML = '';
  const clansMap = getClansMap();
  
  const seen = new Set();
  Object.entries(clansMap).forEach(([uf, grupos]) => {
    grupos.forEach(g => {
      if (g.destaque && !seen.has(g.familia)) {
        seen.add(g.familia);
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
          <span class="legend-color" style="background:${g.cor_hex}; border-radius: 50%; width: 12px; height: 12px; display: inline-block; margin-right: 6px;"></span>
          <span><strong>${g.familia}</strong> <span style="opacity: 0.6">(${uf})</span></span>
        `;
        legend.appendChild(item);
      }
    });
  });
}

window.addEventListener('familiaSelected', (e) => {
  atualizarPainel(e.detail);
});

window.addEventListener('mapLoaded', (e) => {
  window.clansMap = getClansMap();
  gerarLegenda(e.detail.familiasData);
});

closeBtn.addEventListener('click', () => {
  infoPanel.classList.remove('active');
});

window.addEventListener('load', async () => {
  await initBrazilMap();
});