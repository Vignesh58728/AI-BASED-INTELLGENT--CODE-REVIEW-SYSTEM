import re
import os

path = r'd:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\shared\AIPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the Font Import
old_import = "@import url('https://fonts.googleapis.com/css2?family=Mea+Culpa&display=swap');"
new_import = """@import url('https://fonts.googleapis.com/css2?family=Mea+Culpa&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Yellowtail&display=swap');"""

if old_import in content:
    content = content.replace(old_import, new_import, 1)

# Replace the Greeting UI
# Search for the h2 with Mea Culpa
old_h2 = '<h2 className="text-3xl font-light text-zinc-800" style={{ fontFamily: "\'Mea Culpa\', cursive" }}>'
new_h2 = '<h2 className="text-4xl font-light text-zinc-800" style={{ fontFamily: "\'Yellowtail\', cursive" }}>'

# Also update the name part to use the one the user specified (SAIVIGNESH) or just bold it
old_span = 'Good to see you, <span className="font-bold">{user?.name?.split(\' \')[0]}</span>.'
new_span = 'Good to see you, <span className="font-bold">{user?.name?.toUpperCase() || \'SAIVIGNESH\'}</span>.'

if old_h2 in content:
    content = content.replace(old_h2, new_h2, 1)
    if old_span in content:
        content = content.replace(old_span, new_span, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated font to Yellowtail and name to SAIVIGNESH.")
