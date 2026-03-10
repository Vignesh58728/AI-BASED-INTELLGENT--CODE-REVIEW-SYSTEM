import os

files = [
    r"d:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\Login.tsx",
    r"d:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\auth\RegisterPage.tsx",
    r"d:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\auth\ForgotPasswordPage.tsx"
]

for file_path in files:
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('text-neutral-500', 'text-black')
    content = content.replace('text-black/60', 'text-black')
    content = content.replace('text-zinc-500', 'text-black')
    content = content.replace('text-zinc-400', 'text-black')
    content = content.replace('text-primary', 'text-black')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Auth pages text visibility fixed.")
