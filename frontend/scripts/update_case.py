import os
import re

path = r'd:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\shared\AIPage.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target exactly the branding we just made
# Use regex to be flexible about indentation and exactly how it is rendered
pattern = re.compile(r'MIND <span className="text-zinc-300">ARC</span>')
replacement = 'Mind <span className="text-zinc-300">Arc</span>'

new_content = pattern.sub(replacement, content)

if new_content != content:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("AIPage.tsx branding updated to Title Case.")
else:
    print("MIND ARC pattern not found.")
