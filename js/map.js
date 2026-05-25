import { loadFamiliasData, getClansMap, getGovernadoresMap, getConfig } from './data.js';

const partyColors = {
  'PT': '#c41230',
  'PSB': '#ed1414',
  'PCdoB': '#d20000',
  'PV': '#009a44',
  'Rede': '#008b9a',
  'Solidariedade': '#26c9ff',
  'PSOL': '#dd1144',
  'PCB': '#990000',
  'UP': '#8b0000',
  
  'MDB': '#e65c00',
  'PSD': '#f6b026',
  'PP': '#f97316',
  'PROS': '#ff8c00',
  'MDB': '#cc4400',
  'Cidadania': '#ffaa00',
  
  'PL': '#0055a4',
  'UNIÃO': '#1e3a5f',
  'Republicans': '#003366',
  'PSL': '#1f4962',
  'DEM': '#2e7eb9',
  'NOVO': '#1e4d8c',
  'PODE': '#1a3a6b',
  'Patriota': '#0d2b4a',
  'DC': '#1a4a7a',
  'Avante': '#2a5a8a',
  'PMN': '#cc9900',
  'PROS': '#0066a2'
};

function getPartyColor(partido) {
  return partyColors[partido] || '#888888';
}

export { getPartyColor };

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
      const gov = governadoresMap[uf];
      if (gov) return getPartyColor(gov.partido);
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
      const gov = governadoresMap[uf];
      if (gov) return `${nome}\n${gov.nome} (${gov.partido})`;
      const grupos = clansMap[uf] || [];
      if (grupos.length === 0) return nome;
      const destaques = grupos.filter(g => g.destaque).map(g => g.familia);
      return destaques.length > 0 ? `${nome}: ${destaques.join(', ')}` : nome;
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

  // renderGovernadorMarkers(svg, geoData, governadoresMap, path);
  renderEmpresaOrbits(svg, geoData, clansMap, governadoresMap, path);

  window.dispatchEvent(new CustomEvent('mapLoaded', {
    detail: { familiasData }
  }));
}

function renderGovernadorMarkers(svg, geoData, governadoresMap, path) {
  const markersGroup = svg.append('g').attr('class', 'governadores-layer');
  
  geoData.features.forEach(d => {
    const uf = d.properties.sigla || d.properties.UF;
    const gov = governadoresMap[uf];
    if (!gov) return;
    
    const centroid = path.centroid(d);
    const x = centroid[0];
    const y = centroid[1];
    
    const marker = markersGroup.append('g')
      .attr('class', 'governador-marker')
      .attr('transform', `translate(${x}, ${y})`);
    
    marker.append('circle')
      .attr('r', 10)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('fill', getPartyColor(gov.partido))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
    
    marker.append('text')
      .attr('x', 0)
      .attr('y', 4)
      .text(gov.partido.substring(0, 3))
      .attr('fill', '#fff')
      .attr('font-size', '8px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none');
    
    marker.append('title')
      .text(`Gov ${gov.nome} (${gov.partido})`);
  });
}

function renderEmpresaOrbits(svg, geoData, clansMap, governadoresMap, path) {
  const orbitsGroup = svg.append('g').attr('class', 'empresas-layer');
  const tooltip = d3.select('#map-container').append('div')
    .attr('class', 'empresa-tooltip')
    .style('display', 'none');
  
  const empresasMap = new Map();
  
  Object.entries(clansMap).forEach(([uf, grupos]) => {
    grupos.forEach(g => {
      if (g.empresas_relacionadas && g.empresas_relacionadas.length > 0) {
        g.empresas_relacionadas.forEach(emp => {
          if (!empresasMap.has(emp.nome)) {
            empresasMap.set(emp.nome, { ...emp, uf: uf, familia: g.familia });
          }
        });
      }
    });
  });
  
  Object.entries(governadoresMap).forEach(([uf, gov]) => {
    if (gov.empresas_relacionadas && gov.empresas_relacionadas.length > 0) {
      gov.empresas_relacionadas.forEach(emp => {
        if (!empresasMap.has(emp.nome + '_gov')) {
          empresasMap.set(emp.nome + '_gov', { ...emp, uf: uf, familia: 'Governador' });
        }
      });
    }
  });
  
  const empresas = Array.from(empresasMap.values()).slice(0, 60);
  
  geoData.features.forEach(d => {
    const uf = d.properties.sigla || d.properties.UF;
    const centroid = path.centroid(d);
    const baseX = centroid[0];
    const baseY = centroid[1];
    
    const stateEmpresas = empresas.filter(e => e.uf === uf);
    
    stateEmpresas.forEach((emp, i) => {
      const angle = (2 * Math.PI * i) / stateEmpresas.length;
      const radius = 22;
      const x = baseX + radius * Math.cos(angle);
      const y = baseY + radius * Math.sin(angle);
      
      const classe = emp.legalidade.toLowerCase().replace(/[^a-z]/g, '') || 'investigada';
      
      const empresaGroup = orbitsGroup.append('g')
        .attr('class', `empresa-orbit ${classe}`)
        .attr('transform', `translate(${x}, ${y})`);
      
      empresaGroup.append('line')
        .attr('x1', baseX - x)
        .attr('y1', baseY - y)
        .attr('x2', 0)
        .attr('y2', 0);
      
      empresaGroup.append('circle')
        .attr('r', emp.legalidade === 'Ilícita' ? 5 : 4)
        .attr('cx', 0)
        .attr('cy', 0);
      
      empresaGroup.on('mouseover', (event) => {
        tooltip.style('display', 'block')
          .html(`
            <div class="emp-nome">${emp.nome}</div>
            <div class="emp-tipo">${emp.tipo || ''}</div>
            <div style="opacity: 0.7; margin-top: 4px;">${emp.relacao || ''}</div>
            <span class="emp-tag" style="background: ${emp.legalidade === 'Lícita' ? '#10b981' : emp.legalidade === 'Investigada' ? '#f59e0b' : '#ef4444'}">${emp.legalidade}</span>
          `);
      })
      .on('mousemove', (event) => {
        const containerRect = document.getElementById('map-container').getBoundingClientRect();
        tooltip.style('left', (event.clientX - containerRect.left + 15) + 'px')
          .style('top', (event.clientY - containerRect.top - 10) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });
    });
  });
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