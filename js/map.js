import { familiasPoliticas } from './data.js';

export async function initBrazilMap() {
  const response = await fetch('data/br_states.geojson');
  const geoData = await response.json();

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
    .attr('class', (d) => `state state-${d.properties.sigla || d.properties.uf}`)
    .attr('fill', (d) => {
      const sigla = d.properties.sigla || d.properties.uf;
      return familiasPoliticas[sigla] ? familiasPoliticas[sigla].cor : '#f0f0f0';
    })
    .attr('stroke', '#333')
    .attr('stroke-width', 0.4)
    .on('mouseover', handleHover)
    .on('mouseout', handleOut)
    .on('click', handleClick)
    .append('title')
    .text((d) => d.properties.nome || d.properties.name || d.properties.uf);

  svg.append('g')
    .selectAll('text')
    .data(geoData.features)
    .join('text')
    .attr('x', (d) => path.centroid(d)[0])
    .attr('y', (d) => path.centroid(d)[1])
    .attr('text-anchor', 'middle')
    .attr('class', 'state-label')
    .text((d) => d.properties.sigla || d.properties.uf || '');
}

function handleHover(event) {
  d3.select(this)
    .transition()
    .duration(150)
    .attr('stroke-width', 1.8)
    .attr('filter', 'drop-shadow(2px 2px 3px rgba(0,0,0,0.2))');
}

function handleOut(event) {
  d3.select(this)
    .transition()
    .duration(150)
    .attr('stroke-width', 0.4)
    .attr('filter', null);
}

function handleClick(event, d) {
  const sigla = d.properties.sigla || d.properties.uf;
  const dados = familiasPoliticas[sigla];

  window.dispatchEvent(new CustomEvent('familiaSelected', {
    detail: {
      sigla,
      nomeEstado: d.properties.nome || d.properties.name || sigla,
      ...dados
    }
  }));
}
