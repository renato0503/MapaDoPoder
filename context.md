# Contexto do Projeto MapaDoPoder

## Visão geral

Este projeto é um protótipo de um infográfico interativo sobre clãs políticos brasileiros. A ideia central é usar HTML/CSS/JavaScript para criar um mapa do Brasil onde cada estado mostra as principais famílias políticas e suas informações regionais.

O projeto contém duas linhas de trabalho:
- Protótipo original em PWA com `app.js`, `styles.css`, `manifest.json`, `service-worker.js` e dados em `data/clans.json` e `data/states.json`.
- Nova implementação de mapa interativo usando D3.js e GeoJSON, com estrutura modular em `js/data.js`, `js/map.js` e `js/ui.js`.

## Estrutura atual do projeto

- `index.html` – página principal atualizada para carregar o novo mapa interativo.
- `css/styles.css` – estilos modernos para o mapa, painel lateral, legenda e layout responsivo.
- `js/data.js` – dados das famílias políticas por estado e cores para o mapa.
- `js/map.js` – lógica para carregar o GeoJSON e desenhar o mapa do Brasil com D3.
- `js/ui.js` – interações do usuário, painel de detalhes e legenda dinâmica.
- `data/br_states.geojson` – GeoJSON dos estados do Brasil baixado para renderizar o mapa.
- `.github/workflows/deploy.yml` – workflow do GitHub Actions para deploy no GitHub Pages.
- `README.md` – documenta a nova estrutura, como rodar localmente e como publicar no GitHub Pages.
- `transcricao_clas_poder_brasil.md` – transcrição do vídeo sobre clãs do poder no Brasil.

Além disso, o projeto ainda mantém arquivos do protótipo PWA original:
- `app.js` – lógica de estado e pesquisa para cards de estados.
- `manifest.json` – configuração de PWA.
- `service-worker.js` – cache offline.
- `data/clans.json` e `data/states.json` – dados originais usados pelo protótipo PWA.

## O que já foi feito

- Criado o novo mapa interativo baseado em GeoJSON e D3.js.
- Adicionado dados iniciais de famílias políticas para os estados: MA, AL, PA, PB, BA, GO, RJ.
- Montado painel lateral com seleção de estado e detalhes de clã.
- Construída legenda dinâmica de famílias políticas.
- Configurada estrutura de pastas `css/`, `js/`, `data/` e `.github/workflows/`.
- Concluído o download do GeoJSON `br_states.geojson` para uso offline.
- Atualizado o README com instruções de execução local e deploy.
- Documentado o projeto em `context.md`.

## O que ainda deve ser feito

- Completar os dados para todos os 27 estados brasileiros.
- Remover ou integrar a implementação PWA antiga se não for mais necessária.
- Adicionar interações mais avançadas, como zoom, tooltip customizado e filtros por clã.
- Ajustar o painel para exibir múltiplos clãs por estado de maneira clara.
- Validar a compatibilidade mobile do mapa e do painel lateral.
- Adicionar gráficos, timelines ou comparações de poder político por família.
- Configurar testes básicos e revisão de acessibilidade.
- Fazer deploy efetivo no GitHub Pages e validar o endereço final.

## Observações

- O projeto ainda está em fase de protótipo: a base de mapas e os dados iniciais existem, mas o conteúdo ainda é parcial.
- A combinação de PWA antigo e nova estrutura pode ser um ponto de limpeza futura.
- O foco imediato é completar os dados e finalizar a experiência de navegação no mapa.
