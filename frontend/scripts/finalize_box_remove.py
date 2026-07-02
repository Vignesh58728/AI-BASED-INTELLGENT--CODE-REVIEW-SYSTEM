import os

path = r'd:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\shared\AIPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the icons (Chunk 1) - Use Zap for assistant and cleaner user icon
old_icons = """                                 <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                                    {msg.role === 'user' ? (
                                       <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-black">U</div>
                                    ) : (
                                       <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                          <img
                                             src="/artificial-intelligence.png"
                                             alt="Assistant"
                                             className="w-4 h-4 brightness-0 invert"
                                          />
                                       </div>
                                    )}
                                 </div>"""

new_icons = """                                 <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                    {msg.role === 'user' ? (
                                       <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-black border border-zinc-200">U</div>
                                    ) : (
                                       <div className="w-full h-full rounded-full bg-black flex items-center justify-center shadow-lg shadow-black/10">
                                          <Zap size={15} className="text-white" fill="white" />
                                       </div>
                                    )}
                                 </div>"""

if old_icons in content:
    content = content.replace(old_icons, new_icons, 1)

# 2. Fix the markdown style (Chunk 3) - Remove grey backgrounds from code
old_code_style = """            .markdown-content code {
               background-color: #f3f4f6;
               padding: 0.2rem 0.4rem;
               border-radius: 0.375rem;
               font-family: 'Fira Code', monospace;
               font-size: 0.875em;
               color: #ef4444;
            }
            .markdown-content pre {
               background-color: #f3f4f6;
               padding: 1rem;
               border-radius: 0.5rem;
               margin-top: 1rem;
               margin-bottom: 1rem;
               overflow-x: auto;
            }"""

new_code_style = """            .markdown-content code {
               font-family: 'Fira Code', monospace;
               font-size: 0.875em;
               color: #ef4444;
               font-weight: 500;
            }
            .markdown-content pre {
               background-color: transparent;
               border: 1px solid #f4f4f5;
               border-radius: 1.5rem;
               padding: 1.5rem;
               margin-top: 1.5rem;
               margin-bottom: 1.5rem;
               overflow-x: auto;
            }"""

if old_code_style in content:
    content = content.replace(old_code_style, new_code_style, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully removed remaining boxes and updated icons.")
