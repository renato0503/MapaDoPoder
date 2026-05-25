import { loadFamiliasData, getClansMap, getGovernadoresMap } from './data.js';
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

const PHOTO_URLS = {
  'Reinaldo Azambuja': 'data/photos/reinaldo_azambuja.jpg',
  'Eduardo Riedel': 'data/photos/eduardo_riedel.jpg'
};

const GRAY_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%238a8a8a;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%235a5a5a;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='100' fill='url(%23grad)'/%3E%3Ccircle cx='100' cy='70' r='35' fill='%23b0b0b0'/%3E%3Cellipse cx='100' cy='160' rx='55' ry='40' fill='%23b0b0b0'/%3E%3C/svg%3E`;

function renderFamilyPhotos(membros, familia) {
  const photoContainer = document.getElementById('family-photos');
  if (!photoContainer) return;
  
  photoContainer.innerHTML = '';
  
  membros.forEach(membro => {
    const photoWrapper = document.createElement('div');
    photoWrapper.className = 'photo-item';
    
    const img = document.createElement('img');
    const photoUrl = PHOTO_URLS[membro];
    
    if (photoUrl) {
      img.src = photoUrl;
      img.alt = membro;
      img.onerror = () => {
        img.src = GRAY_AVATAR;
      };
    } else {
      img.src = GRAY_AVATAR;
      img.alt = membro + ' (sem foto)';
    }
    
    const name = document.createElement('span');
    name.className = 'photo-name';
    name.textContent = membro;
    
    photoWrapper.appendChild(img);
    photoWrapper.appendChild(name);
    photoContainer.appendChild(photoWrapper);
  });
}

function renderGovernadorInfo(governador) {
  const container = document.getElementById('governador-info');
  if (!container) return;
  
  if (!governador) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  
  container.innerHTML = `
    <div class="governador-badge">
      <span class="governador-label">🏛️ Governador Atual</span>
      <span class="governador-nome">${governador.nome}</span>
      <span class="governador-partido">${governador.partido} | ${governador.mandato}</span>
    </div>
  `;
  container.style.display = 'block';
}

function renderEmpresas(empresas) {
  const container = document.getElementById('empresas-section');
  if (!container) return;
  
  if (!empresas || empresas.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  
  const html = `
    <h4>🏢 Empresas Relacionadas (${empresas.length})</h4>
    ${empresas.map(emp => `
      <div class="empresa-card ${emp.legalidade.toLowerCase().replace(/[^a-z]/g, '')}">
        <div class="empresa-header">
          <span class="empresa-nome">${emp.nome}</span>
          <span class="empresa-tag tag-${emp.legalidade.toLowerCase().replace(/[^a-z]/g, '')}">${emp.legalidade}</span>
        </div>
        <span class="empresa-tipo">${emp.tipo}</span>
        ${emp.detalhes ? `<p class="empresa-detalhes">${emp.detalhes}</p>` : ''}
        ${emp.faturamento_anual ? `<p class="empresa-faturamento">💰 ${emp.faturamento_anual}</p>` : ''}
      </div>
    `).join('')}
  `;
  
  container.innerHTML = html;
  container.style.display = 'block';
}

function atualizarPainel({ uf, nomeEstado, grupos, gobernador }) {
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
    document.getElementById('family-photos').innerHTML = '';
    renderGovernadorInfo(null);
    renderEmpresas([]);
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
  
  renderFamilyPhotos(destaque.membros, destaque.familia);
  renderGovernadorInfo(governador);
  const allEmpresas = [
    ...(destaque.empresas_relacionadas || []),
    ...(governador?.empresas_relacionadas || [])
  ];
  renderEmpresas(allEmpresas);
  
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
          renderFamilyPhotos(selectedClan.membros, selectedClan.familia);
          const clanEmpresas = [
            ...(selectedClan.empresas_relacionadas || []),
            ...(governador?.empresas_relacionadas || [])
          ];
          renderEmpresas(clanEmpresas);
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
  window.governadoresMap = getGovernadoresMap();
  gerarLegenda(e.detail.familiasData);
});

closeBtn.addEventListener('click', () => {
  infoPanel.classList.remove('active');
});

window.addEventListener('load', async () => {
  await initBrazilMap();
});