# MapaDoPoder - Context

## Visão Geral

Infográfico interativo sobre clãs políticos brasileiros. Mapa do Brasil com D3.js e GeoJSON onde cada estado mostra famílias políticas, governadores atuais, empresas relacionadas e escândalos.

## Estrutura do Projeto

- `index.html` – página principal com mapa e painel lateral
- `css/styles.css` – estilos modernos, layout responsivo
- `js/data.js` – loader do JSON de famílias políticas
- `js/map.js` – mapa D3.js com projeção Mercator
- `js/ui.js` – interações, painel de detalhes, renderização
- `data/br_states.geojson` – GeoJSON dos estados do Brasil
- `data/familias.json` – dados de famílias políticas (27 estados + DF)

## Funcionalidades

### Mapa
- Estados coloridos por partido do governador (esquerda/centro/direita)
- Hover com sombra e stroke mais grosso
- Clique abre painel de detalhes
- Labels com siglas dos estados

### Cores por Partido
- **Esquerda (vermelho #c41230)**: PT, PSB, PSOL, PCdoB, PV, Rede
- **Centro (laranja #e65c00)**: MDB, PSD, PP, PROS, Cidadania, PSDB
- **Direita (azul #0055a4)**: PL, UNIÃO, REP, DEM, NOVO, PODE

### Painel Lateral
- Governador atual (nome, partido, mandato) - no topo
- Nome do clã selecionado
- Período, membros, cargos, âncoras do poder
- Empresas relacionadas (lícitas/investigadas/ilícitas)
- Escândalos e casos notórios
- Curiosidades
- Lista de outros clãs do estado (clicável)

### Dados (familias.json)
```json
{
  "governadores_atuais": [{ uf, nome, partido, mandato, empresas_relacionadas }],
  "familias": [{
    "uf": "MA", "estado": "Maranhão", "familia": "Sarney",
    "periodo": "1965–presente", "destaque": true,
    "membros": ["José Sarney", "Roseana Sarney"],
    "cargos": ["Presidente da República", "Governador"],
    "ancoras_poder": ["Sistema Mirante (TV/Rádio)"],
    "curiosidades": "...",
    "cor_hex": "#E41A1C",
    "empresas_relacionadas": [{
      "nome": "Empresa X", "tipo": "Mídia", "relacao": "...",
      "legalidade": "Lícita", "detalhes": "...", "escandalos": ["..."]
    }]
  }]
}
```

## Deploy

GitHub Actions: https://renato0503.github.io/MapaDoPoder

## Rodar Localmente

```powershell
python -m http.server 8000
```