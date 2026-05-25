# Contexto do Projeto MapaDoPoder

## Visão geral

Este projeto é um infográfico interativo sobre clãs políticos brasileiros. A ideia central é usar HTML/CSS/JavaScript com D3.js e GeoJSON para criar um mapa do Brasil onde cada estado mostra as principais famílias políticas e suas informações regionais.

## Estrutura atual do projeto

- `index.html` – página principal com mapa interativo
- `css/styles.css` – estilos modernos para o mapa, painel lateral, legenda e layout responsivo
- `js/data.js` – loader do JSON de famílias políticas com suporte a múltiplos clãs por estado
- `js/map.js` – lógica para carregar o GeoJSON e desenhar o mapa do Brasil com D3.js
- `js/ui.js` – interações do usuário, painel de detalhes, legenda dinâmica e suporte a múltiplos clãs
- `data/br_states.geojson` – GeoJSON dos estados do Brasil para renderizar o mapa
- `data/familias.json` – dados completos das famílias políticas (30+ clãs de diversos estados)
- `.github/workflows/deploy.yml` – workflow do GitHub Actions para deploy automático no GitHub Pages
- `README.md` – documenta a estrutura, como rodar localmente e como publicar no GitHub Pages
- `transcricao_clas_poder_brasil.md` – transcrição completa do vídeo sobre clãs do poder no Brasil

Arquivos do protótipo PWA original (manter para referência):
- `app.js`, `manifest.json`, `service-worker.js`, `data/clans.json`, `data/states.json`

## O que já foi feito

### Mapa Interativo com D3.js
- Implementação completa do mapa do Brasil usando D3.js e GeoJSON
- Projeção Mercator centralizada no Brasil
- Labels dos estados com siglas
- Efeitos de hover com sombra e stroke mais grosso
- Clique para abrir painel de detalhes

### Dados de Famílias Políticas (30+ clãs)
- **MA**: Sarney, Rocha, Lobão
- **AL**: Collor de Mello, Calheiros, Lira
- **PB**: Cunha Lima, Mota/Vanderley
- **PA**: Barbalho, Lobão
- **BA**: Magalhães (Carlismo)
- **GO**: Caiado
- **RJ**: Bolsonaro, Garotinho/Paes
- **AP**: Alcolumbre
- **RR**: Jucá
- **SE**: Franco
- **CE**: Jereissati/Queiroz
- **PR**: Ratinho (Massa)
- **TO**: Siqueira Campos
- **RN**: Maia/Alves/Rosado
- **PE**: Coelho
- **PI**: Portela/Nogueira
- **RS**: Paim/Vargas
- **SC**: Koch/Ames
- **MS**: Tebet
- **MT**: Campos/Mendes
- **RO**: Hold/Aziz
- **AC**: Vieira/Marina
- **AM**: Amazonino/Omar
- **DF**: Roriz
- **ES**: Max
- **MG**: Anastasia/Moreira/Pacheco
- **SP**: Alckmin/Bolsonaro

### Painel Lateral
- Exibição do estado selecionado
- Nome da família/clã político em destaque
- Período de atividade
- Lista de membros
- Cargos ocupados
- Âncoras do poder (TV, terra, tribunais, etc.)
- Curiosidades sobre o clã
- Lista de outros clãs do mesmo estado (quando aplicável)
- Interação para trocar entre clãs do mesmo estado

### Legenda Dinâmica
- Geração automática baseada nos dados
- Exibe apenas clãs em destaque
- Cores correspondentes a cada família
- Sigla do estado entre parênteses

### Estilos CSS
- Design moderno com gradientes
- Layout responsivo (grid que muda para coluna única em mobile)
- Animações de transição suaves
- Cards com bordas arredondadas e sombras sutis
- Tags para âncoras do poder
- Área para curiosidades em itálico
- Botão de fechar painel

### Deploy Automático
- GitHub Actions configurado para deploy automático no GitHub Pages
- Acessível em: https://renato0503.github.io/MapaDoPoder

## Deploy no GitHub Pages

O deploy é automático via GitHub Actions. A cada push para `master`, o site é publicado em:
https://renato0503.github.io/MapaDoPoder

## Como rodar localmente

```powershell
python -m http.server 8000
```

Acesse `http://localhost:8000`.

## Estrutura dos dados (familias.json)

```json
{
  "meta": { titulo, fonte, atualizado_em, nota },
  "config": { cor_padrao, cor_hover, tooltip_max_width, animacao_transicao_ms },
  "familias": [
    {
      "uf": "MA",
      "estado": "Maranhão",
      "familia": "Sarney",
      "periodo": "1965–presente",
      "destaque": true,
      "membros": ["José Sarney", "Roseana Sarney", ...],
      "cargos": ["Presidente da República", "Governador", ...],
      "ancoras_poder": ["Lei de Terras (1969)", "Sistema Mirante (TV/Rádio)", ...],
      "curiosidades": "José Ribamar mudou o nome no cartório em 1965...",
      "cor_hex": "#E41A1C"
    }
  ]
}
```

## Observações

- O campo `destaque` indica qual clã tem maior influência atual no estado
- Um estado pode ter múltiplos clãs (ex: AL tem Collor, Calheiros e Lira)
- Quando há múltiplos clãs, o painel permite alternar entre eles
- Cores são únicas por clã para facilitar identificação visual no mapa