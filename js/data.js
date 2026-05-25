let familiasData = null;
let clansMap = {};
let governadoresMap = {};

export async function loadFamiliasData() {
  if (familiasData) return familiasData;
  
  const response = await fetch('data/familias.json');
  familiasData = await response.json();
  
  clansMap = {};
  governadoresMap = {};
  
  familiasData.familias.forEach(f => {
    if (!clansMap[f.uf]) {
      clansMap[f.uf] = [];
    }
    clansMap[f.uf].push(f);
  });
  
  if (familiasData.governadores_atuais) {
    familiasData.governadores_atuais.forEach(g => {
      governadoresMap[g.uf] = g;
    });
  }
  
  return familiasData;
}

export function getClansByUF(uf) {
  return clansMap[uf] || [];
}

export function getClansMap() {
  return clansMap;
}

export function getGovernadoresMap() {
  return governadoresMap;
}

export function getConfig() {
  return familiasData?.config || {
    cor_padrao: '#e0e0e0',
    cor_hover: '#b0b0b0'
  };
}

export function getMeta() {
  return familiasData?.meta || {};
}