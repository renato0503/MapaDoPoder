# Contexto do Projeto MapaDoPoder

## Visão geral

Este projeto é um infográfico interativo sobre clãs políticos brasileiros. A ideia central é usar HTML/CSS/JavaScript com D3.js e GeoJSON para criar um mapa do Brasil onde cada estado mostra as principais famílias políticas, seus membros, conexões empresariais e o governador atual.

## Estrutura atual do projeto

- `index.html` – página principal com mapa interativo
- `css/styles.css` – estilos modernos para o mapa, painel lateral, legenda, fotos, empresas e layout responsivo
- `js/data.js` – loader do JSON de famílias políticas com suporte a múltiplos clãs por estado e mapa de governadores
- `js/map.js` – lógica para carregar o GeoJSON e desenhar o mapa do Brasil com D3.js
- `js/ui.js` – interações do usuário, painel de detalhes, legenda dinâmica, suporte a múltiplos clãs, renderização de fotos e empresas
- `data/br_states.geojson` – GeoJSON dos estados do Brasil para renderizar o mapa
- `data/familias.json` – dados completos das famílias políticas (clãs de todos os 27 estados), governadores atuais e empresas relacionadas
- `data/photos/` – diretório com fotos dos políticos (quando disponíveis)
- `.github/workflows/deploy.yml` – workflow do GitHub Actions para deploy automático no GitHub Pages
- `README.md` – documenta a estrutura, como rodar localmente e como publicar no GitHub Pages
- `transcricao_clas_poder_brasil.md` – transcrição completa do vídeo sobre clãs do poder no Brasil
- `escrita.md` – guia de estilo de escrita acadêmica (padrão APA 7ª edição) para o conteúdo textual

Arquivos do protótipo PWA original (manter para referência):
- `app.js`, `manifest.json`, `service-worker.js`, `data/clans.json`, `data/states.json`

## O que já foi feito

### Mapa Interativo com D3.js
- Implementação completa do mapa do Brasil usando D3.js e GeoJSON
- Projeção Mercator centralizada no Brasil
- Labels dos estados com siglas
- Efeitos de hover com sombra e stroke mais grosso
- Clique para abrir painel de detalhes
- Tooltip mostra nome do clã e do governador atual

### Dados de Famílias Políticas (clãs por estado)
- **MA**: Sarney, Rocha, Lobão
- **AL**: Collor de Mello, Calheiros, Lira
- **PB**: Cunha Lima, Mota/Vanderley
- **PA**: Barbalho, Lobão
- **BA**: Magalhães (Carlismo)
- **GO**: Caiado
- **RJ**: Bolsonaro, Garotinho, Paes
- **AP**: Alcolumbre
- **RR**: Jucá
- **SE**: Franco
- **CE**: Jereissati
- **PR**: Ratinho (Massa)
- **TO**: Siqueira Campos
- **RN**: Maia, Alves, Rosado
- **PE**: Coelho
- **PI**: Portela, Nogueira, Dias
- **RS**: Paim, Vargas
- **SC**: Amin
- **MS**: Azambuja/Riedel, Tebet, Trad, Puccinelli
- **MT**: Campos, Mendes
- **RO**: Raupp, Cassol
- **AC**: Viana, Marina Silva
- **AM**: Amazonino, Virgílio, Omar
- **DF**: Roriz
- **ES**: Max
- **MG**: Anastasia, Pacheco, Moreira
- **SP**: Alckmin, Bolsonaro

### Sistema de Fotos dos Políticos
- Implementação do `imageService.js` que busca fotos via Wikipedia API
- Fallback para avatar genérico quando foto não disponível
- Exibição de fotos circulares no painel lateral
- Fotos hospedadas localmente em `data/photos/` quando baixadas
- Nomes dos membros rotulados abaixo das fotos

### Painel Lateral
- Exibição do estado selecionado
- Nome da família/clã político em destaque
- Badge do governador atual com partido e mandato
- Período de atividade
- Lista de membros com fotos circulares
- Cargos ocupados
- Âncoras do poder (TV, terra, tribunais, etc.)
- Seção de empresas relacionadas com classificação (Lícita/Investigada/Ilícita)
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
- Estilos para galeria de fotos (`family-photos`, `photo-item`)
- Badge do inúmerador com gradiente
- Cards de empresas com bordas coloridas por status

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
  "governadores_atuais": [
    {
      "uf": "MA",
      "nome": "Carlos Brandão",
      "partido": "PSB",
      "mandato": "2023-2026",
      "vice": "Vanderlei Masson",
      "familia_politica": "Aliado Sarney",
      "empresas_relacionadas": []
    }
  ],
  "familias": [
    {
      "uf": "MA",
      "estado": "Maranhão",
      "familia": "Sarney",
      "periodo": "1965–presente",
      "destaque": true,
      "governador_atual": "Carlos Brandão",
      "partido_governador": "PSB",
      "relacao_governador": "Aliado político",
      "membros": ["José Sarney", "Roseana Sarney", ...],
      "cargos": ["Presidente da República", "Governador", ...],
      "ancoras_poder": ["Lei de Terras (1969)", "Sistema Mirante (TV/Rádio)", ...],
      "curiosidades": "José Ribamar alterou o nome civil em 1965...",
      "cor_hex": "#E41A1C",
      "empresas_relacionadas": [
        {
          "nome": "Sistema Mirante de Comunicação",
          "tipo": "Mídia/TV/Rádio",
          "relacao": "Propriedade familiar",
          "legalidade": "Lícita",
          "detalhes": "Afiliada Globo, fundada em 1987...",
          "faturamento_anual": "R$ 150 milhões (estimado)"
        }
      ]
    }
  ]
}
```

## Observações

- O campo `destaque` indica qual clã tem maior influência atual no estado
- Um estado pode ter múltiplos clãs (ex: AL tem Collor, Calheiros e Lira)
- Quando há múltiplos clãs, o painel permite alternar entre eles
- Cores são únicas por clã para facilitar identificação visual no mapa
- Fotos são buscadas via Wikipedia API ou usam fallback SVG quando não disponíveis
- O arquivo `escrita.md` contém o padrão de escrita acadêmica a ser seguido para textos descritivos
- Governadores atuais são الذين mandato 2023-2026
- Empresas relacionadas são classificadas como Lícita, Investigada ou Ilícita