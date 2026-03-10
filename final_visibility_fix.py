import os
import re

files_to_update = [
    r"d:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\shared\AIPage.tsx",
    r"d:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\components\ui\MegaMenu.tsx",
    r"d:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\levels\SchoolDashboard.tsx",
    r"d:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\levels\CollegeDashboard.tsx",
    r"d:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\levels\ITDashboard.tsx",
    r"d:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\components\layout\Header.tsx"
]

def update_file(file_path):
    if not os.path.exists(file_path):
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace primary with black for visibility on white
    content = content.replace('text-primary', 'text-black')
    content = content.replace('bg-primary', 'bg-black')
    content = content.replace('border-primary', 'border-black')
    content = content.replace('text-zinc-500', 'text-black')
    content = content.replace('text-zinc-600', 'text-black')
    content = content.replace('text-zinc-400', 'text-black')
    content = content.replace('placeholder-zinc-300', 'placeholder-zinc-500')
    content = content.replace('grayscale', '') # Remove grayscale from locked cards to keep icons visible
    
    # Gradient fixes
    content = content.replace('from-zinc-800 to-zinc-500', 'from-black to-black')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

for fp in files_to_update:
    print(f"Applying final visibility fixes to {fp}")
    update_file(fp)

print("Visibility correction complete.")
