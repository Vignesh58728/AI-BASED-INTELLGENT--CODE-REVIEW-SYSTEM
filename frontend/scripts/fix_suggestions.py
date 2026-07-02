path = r'd:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\shared\AIPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('Show suggestions')
print(repr(content[max(0, idx-500):idx+300]))
