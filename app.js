const stateGrid = document.getElementById('stateGrid');
const details = document.getElementById('details');
const searchInput = document.getElementById('searchInput');
const installButton = document.getElementById('installButton');

let clans = [];
let states = [];
let deferredPrompt = null;
let activeState = null;

async function loadData() {
  const [clanRes, stateRes] = await Promise.all([
    fetch('data/clans.json'),
    fetch('data/states.json'),
  ]);

  clans = await clanRes.json();
  states = await stateRes.json();
}

function renderStates(filter = '') {
  stateGrid.innerHTML = '';
  const normalizedSearch = filter.trim().toLowerCase();

  const matches = states.filter((state) => {
    const inState = state.name.toLowerCase().includes(normalizedSearch);
    const inClan = state.clans.some((clanId) => {
      const clan = clans.find((row) => row.id === clanId);
      return clan && clan.name.toLowerCase().includes(normalizedSearch);
    });
    return normalizedSearch === '' || inState || inClan;
  });

  matches.forEach((state) => {
    const card = document.createElement('article');
    card.className = 'state-card';
    card.dataset.state = state.code;
    card.innerHTML = `
      <h3>${state.name} (${state.code})</h3>
      <p>${state.description}</p>
    `;
    card.addEventListener('click', () => showState(state.code));
    stateGrid.appendChild(card);
  });

  if (matches.length === 0) {
    stateGrid.innerHTML = '<p>Nenhum estado encontrado. Tente outra palavra-chave.</p>';
  }
}

function showState(code) {
  activeState = states.find((state) => state.code === code);
  document.querySelectorAll('.state-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.state === code);
  });

  if (!activeState) {
    details.innerHTML = '<h2>Informações</h2><p>Selecione um estado para ver detalhes.</p>';
    return;
  }

  const regionClans = activeState.clans.map((id) => clans.find((clan) => clan.id === id));

  details.innerHTML = `
    <h2>${activeState.name}</h2>
    <p>${activeState.details}</p>
    <h3>Clãs históricos</h3>
    <ul>
      ${regionClans
        .map(
          (clan) => `
          <li>
            <strong>${clan.name}</strong>: ${clan.summary}
            <p><em>Base:</em> ${clan.base}</p>
          </li>`
        )
        .join('')}
    </ul>
    <h3>Cidades-chave</h3>
    <ul>
      ${activeState.cities.map((city) => `<li>${city}</li>`).join('')}
    </ul>
  `;
}

window.addEventListener('load', async () => {
  await loadData();
  renderStates();
  registerServiceWorker();
});

searchInput.addEventListener('input', () => renderStates(searchInput.value));

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const choiceResult = await deferredPrompt.userChoice;
  if (choiceResult.outcome === 'accepted') {
    console.log('App instalado');
  }
  deferredPrompt = null;
  installButton.hidden = true;
});

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch((error) => {
      console.warn('Falha no registro do service worker:', error);
    });
  }
}
