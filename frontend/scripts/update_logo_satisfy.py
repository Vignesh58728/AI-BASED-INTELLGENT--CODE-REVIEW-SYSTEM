import os
import re

path = r'd:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\shared\AIPage.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target the branding block we just created
# It has text-6xl md:text-8xl lg:text-9xl font-[900]...
pattern = re.compile(r'<h1 className="text-6xl md:text-8xl lg:text-9xl font-\[900\].*?MIND.*?ARC.*?</h1>', re.DOTALL)

# New replacement: Smaller, Satisfy font
replacement = '''<h1 className="text-4xl md:text-5xl lg:text-6xl text-black select-none text-center" style={{ fontFamily: "'Satisfy', cursive" }}>
                                 MIND <span className="text-zinc-300">ARC</span>
                              </h1>'''

new_content = pattern.sub(replacement, content)

if new_content != content:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("AIPage.tsx branding updated to Satisfy font.")
else:
    print("Could not find the branding block to replace.")
