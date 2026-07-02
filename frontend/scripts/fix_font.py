path = r'd:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\shared\AIPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the h2 tag for the greeting with Mea Culpa font
old = 'className="text-3xl font-light text-zinc-800">'
new = 'className="text-3xl font-light text-zinc-800" style={{ fontFamily: "\'Mea Culpa\', cursive" }}>'

if old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Done! Font changed to Mea Culpa.')
else:
    # Find the exact text around the greeting
    idx = content.find('Good to see you')
    print(repr(content[max(0,idx-150):idx+100]))
