import re
from pathlib import Path
root = Path(r"c:\Users\Renato\Documents\MapaDoPoder")
vtt_path = root / 'MRG6d9bQC8Q.pt.vtt'
md_path = root / 'transcricao_clas_poder_brasil.md'
lines = [line.strip() for line in vtt_path.read_text(encoding='utf-8').splitlines()]
blocks = []
current = []
for line in lines:
    if not line:
        if current:
            blocks.append(' '.join(current))
            current = []
        continue
    if line.startswith(('WEBVTT', 'Kind:', 'Language:')):
        continue
    if re.match(r'^\d\d:\d\d:\d\d\.\d\d\d -->', line):
        if current:
            blocks.append(' '.join(current))
            current = []
        continue
    current.append(line)
if current:
    blocks.append(' '.join(current))

def normalize(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('&gt;&gt;', '>>')
    text = text.replace('Sirney', 'Sarney').replace('Sarnei', 'Sarney')
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'\s*\[música\]\s*', ' [música] ', text)
    text = re.sub(r'[^\u0000-\u007F]+', lambda m: '' if 'เฮ' in m.group(0) else m.group(0), text)
    return text.strip()

texts = []
for block in blocks:
    t = normalize(block)
    if t and (not texts or t != texts[-1]):
        texts.append(t)

merged = [texts[0]]
for text in texts[1:]:
    prev = merged[-1]
    if prev == text:
        continue
    prev_words = prev.split()
    text_words = text.split()
    max_overlap = min(len(prev_words), len(text_words), 25)
    overlap = 0
    for k in range(max_overlap, 2, -1):
        if prev_words[-k:] == text_words[:k]:
            overlap = k
            break
    if overlap:
        merged[-1] = ' '.join(prev_words + text_words[overlap:])
    else:
        merged.append(text)

with md_path.open('w', encoding='utf-8') as f:
    f.write('# Transcrição do vídeo "Clãs do Poder do Brasil"\n\n')
    for line in merged:
        f.write(line + '\n\n')
print('Wrote', len(merged), 'lines')
