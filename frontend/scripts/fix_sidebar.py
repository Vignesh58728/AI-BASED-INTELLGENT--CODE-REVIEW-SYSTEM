import os
import re

files = [
    'Profile.tsx',
    'shared/SolutionsPage.tsx',
    'shared/DiscussPage.tsx',
    'shared/SettingsPage.tsx',
    'shared/NotificationsPage.tsx',
    'SkillAnalysis.tsx'
]

base_dir = r"d:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages"

def remove_dark_classes(match):
    # This function is called with the entire <aside> block match
    block = match.group(0)
    
    # 1. Replace the specific background class on the <aside> tag body to "bg-white"
    block = re.sub(r'bg-slate-50/80\s+dark:bg-slate-900/80', 'bg-white', block)
    # Re-replace just in case SkillAnalysis has bg-white already
    block = re.sub(r'bg-white\s+dark:bg-slate-900/80', 'bg-white', block)
    
    # 2. Globally inside the <aside> block, strip any class starting with "dark:"
    block = re.sub(r'\s*dark:[a-zA-Z0-9/\-]+', '', block)
    
    # 3. Strip extra spaces created by regex
    block = re.sub(r'\s+', ' ', block)
    
    # To keep code somewhat readable structurally, we won't flatten it perfectly but since it's just classes, flattening might look bad in Git diffs.
    # Instead of flattening whole block simply by the space rule above, let's just do regex replaces on the block string directly!
    return block

def process_file(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The sidebar <aside> tag
    pattern = re.compile(r'<aside\s+className="h-screen w-72.*?</aside>', re.DOTALL)
    
    def replacer(m):
        block = m.group(0)
        # First fix sidebar background specifically
        block = block.replace("bg-slate-50/80 dark:bg-slate-900/80", "bg-white")
        block = block.replace("bg-white dark:bg-slate-900/80", "bg-white")
        
        # Now remove all dark classes precisely
        block = re.sub(r'\bdark:[a-zA-Z0-9/\-]+\b', '', block)
        
        # Clean up repeated spaces inside classes (optional)
        block = re.sub(r' {2,}', ' ', block)
        return block

    new_content = pattern.sub(replacer, content)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    else:
        print(f"No changes for {file_path}")

for filename in files:
    process_file(os.path.join(base_dir, filename))
