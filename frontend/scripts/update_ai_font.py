import os
import re

path = r'd:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\shared\AIPage.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Broadly replace font-['Poppins'] and font-['Syncopate'] references
content = content.replace("font-['Poppins']", "font-sans")
content = content.replace("font-['Syncopate']", "font-sans")

# 2. Specifically target the MIND ARC branding block
# We look for the <h1> that contains MIND and ARC
branding_pattern = re.compile(r'<h1 className="[^"]*font-sans.*?>\s*MIND <br/>\s*<span className="text-zinc-400">ARC</span>\s*</h1>', re.DOTALL)

# Since we already replaced font-['Syncopate'] with font-sans, our regex will match it.
# However, if the spacing is different, let's be more flexible.
branding_pattern_flexible = re.compile(r'<h1[^>]*>.*?MIND.*?ARC.*?</h1>', re.DOTALL)

replacement = '''<h1 className="text-6xl md:text-8xl lg:text-9xl font-[900] tracking-tighter text-black select-none uppercase leading-[0.8] text-center flex flex-col items-center">
                                 <span className="block">MIND</span>
                                 <span className="block text-zinc-300">ARC</span>
                                 <div className="h-1.5 w-16 bg-black rounded-full mt-8" />
                              </h1>'''

# Replace the first instance (the landing page logo)
content = branding_pattern_flexible.sub(replacement, content, count=1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("AIPage.tsx font and branding updated.")
