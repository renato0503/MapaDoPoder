import { loadFamiliasData, getClansMap, getGovernadoresMap, getConfig } from './data.js';

export async function initBrazilMap() {
  const [geoResponse, familiasData] = await Promise.all([
    fetch('data/br_states.geojson').then(r => r.json()),
    loadFamiliasData()
  ]);
  
  const geoData = geoResponse;
  const clansMap = getClansMap();
  const governadoresMap = getGovernadoresMap();
  const config = getConfig();

  const container = document.getElementById('map-container');
  const width = 960;
  const height = 720;

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('class', 'brazil-map');

  const projection = d3.geoMercator()
    .center([-55, -15])
    .scale(780)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  svg.append('g')
    .selectAll('path')
    .data(geoData.features)
    .join('path')
    .attr('d', path)
    .attr('class', (d) => `state state-${d.properties.sigla || d.properties.UF}`)
    .attr('fill', (d) => {
      const uf = d.properties.sigla || d.properties.UF;
      const grupos = clansMap[uf] || [];
      if (grupos.length === 0) return config.cor_padrao;
      const destaque = grupos.find(g => g.destaque);
      return destaque ? destaque.cor_hex : grupos[0].cor_hex;
    })
    .attr('stroke', '#333')
    .attr('stroke-width', 0.4)
    .on('mouseover', handleHover)
    .on('mouseout', handleOut)
    .on('click', handleClick)
    .append('title')
    .text((d) => {
      const uf = d.properties.sigla || d.properties.UF;
      const nome = d.properties.nome || d.properties.name || uf;
      const grupos = clansMap[uf] || [];
      const gov = governadoresMap[uf];
      if (grupos.length === 0) return gov ? `${nome} - Governador: ${gov.nome}` : nome;
      const destaques = grupos.filter(g => g.destaque).map(g => g.familia);
      const govInfo = gov ? ` | Gov: ${gov.nome}` : '';
      return destaques.length > 0 ? `${nome}: ${destaques.join(', ')}${govInfo}` : `${nome}${govInfo}`;
    });

  svg.append('g')
    .selectAll('text')
    .data(geoData.features)
    .join('text')
    .attr('x', (d) => path.centroid(d)[0])
    .attr('y', (d) => path.centroid(d)[1])
    .attr('text-anchor', 'middle')
    .attr('class', 'state-label')
    .text((d) => d.properties.sigla || d.properties.UF || '');

  window.dispatchEvent(new CustomEvent('mapLoaded', {
    detail: { familiasData }
  }));
}

function handleHover(event, d) {
  d3.select(this)
    .transition()
    .duration(150)
    .attr('stroke-width', 1.8)
    .attr('filter', 'drop-shadow(2px 2px 3px rgba(0,0,0,0.2))');
}

function handleOut(event, d) {
  d3.select(this)
    .transition()
    .duration(150)
    .attr('stroke-width', 0.4)
    .attr('filter', null);
}

function handleClick(event, d) {
  const uf = d.properties.sigla || d.properties.UF;
  const nomeEstado = d.properties.nome || d.properties.name || uf;
  
  window.dispatchEvent(new CustomEvent('familiaSelected', {
    detail: {
      uf,
      nomeEstado,
      grupos: window.clansMap?.[uf] || [],
      gobernador: window.governadoresMap?.[uf] || null
    }
  }));
}