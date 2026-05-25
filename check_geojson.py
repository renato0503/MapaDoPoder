import urllib.request
urls = ['https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/master/geojson/br-states.json','https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/master/geojson/geojs-100-br-states.json','https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/master/geojson/br-states.geojson','https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/master/geojson/geojs-100-mun.json']
for url in urls:
    try:
        print('TRY', url)
        with urllib.request.urlopen(url, timeout=15) as r:
            data = r.read(100).decode('utf-8', errors='ignore')
            print('OK', url, data[:80])
            break
    except Exception as e:
        print('ERR', url, e)

