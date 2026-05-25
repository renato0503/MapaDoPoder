# Famílias que Governam o Brasil

Projeto de visualização interativa em **HTML / CSS / JavaScript** para criar um mapa do Brasil com dados de famílias políticas.

## Estrutura do projeto

```
MapaDoPoder/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   ├── map.js
│   └── ui.js
├── data/
│   └── br_states.geojson
├── .github/workflows/
│   └── deploy.yml
├── manifest.json
├── service-worker.js
└── transcricao_clas_poder_brasil.md
```

## Como funciona

- `js/data.js`: dados das famílias políticas e cores.
- `js/map.js`: carrega o GeoJSON brasileiro e desenha o mapa com D3.
- `js/ui.js`: atualiza o painel lateral, gera a legenda e cuida das interações.
- `data/br_states.geojson`: GeoJSON dos estados do Brasil.
- `css/styles.css`: estilização moderna e responsiva.

## Rodando localmente

1. Abra o projeto em um terminal.
2. Execute um servidor local:

```powershell
python -m http.server 8000
```

3. Acesse `http://localhost:8000`.

## Deploy no GitHub Pages

### Deploy manual

1. Crie um repositório no GitHub.
2. Faça commit e push do projeto.
3. Vá em **Settings → Pages**.
4. Selecione `Branch: main` e `/root` como pasta.
5. Salve e acesse o link do site.

### GitHub Actions

O arquivo `.github/workflows/deploy.yml` já está configurado para publicar o site automaticamente quando você fizer push para `main`.

## Recursos úteis

- GeoJSON Brasil (estados): `data/br_states.geojson`
- D3.js v7: usado para desenhar o mapa e detectar cliques.
- GitHub Pages: hospedagem estática gratuita.

## Próximos passos

- Expandir os dados de todas as 27 unidades federativas.
- Adicionar filtros e modos de comparação.
- Incluir timeline de cargos e evolução dos clãs.
- Polir o layout mobile e o painel de detalhes.
