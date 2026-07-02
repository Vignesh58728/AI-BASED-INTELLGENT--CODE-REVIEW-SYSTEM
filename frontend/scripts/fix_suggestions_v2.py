import re
import os

path = r'd:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\shared\AIPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find the Show suggestions link block
# Looking for something like:
# {/* Show suggestions link */}
# <div className="flex justify-center -mt-2">
#    <button className="...">
#       Show suggestions
#    </button>
# </div>

pattern = r'\{/\* Show suggestions link \*/\}\s*<div className="flex justify-center -mt-2">\s*<button className="text-\[13px\] font-medium text-zinc-400 hover:text-zinc-600 transition-colors">\s*Show suggestions\s*</button>\s*</div>'

replacement = """{/* Show suggestions link */}
                            <div className="flex justify-center -mt-2">
                               <button
                                  onClick={() => setIsShowingSuggestions(!isShowingSuggestions)}
                                  className="text-[13px] font-medium text-zinc-400 hover:text-zinc-600 transition-colors flex items-center gap-1"
                               >
                                  {isShowingSuggestions ? 'Hide suggestions' : 'Show suggestions'}
                                  <ChevronDown size={13} className={`transition-transform duration-200 ${isShowingSuggestions ? 'rotate-180' : ''}`} />
                               </button>
                            </div>

                            {/* Suggestions Panel */}
                            <AnimatePresence>
                               {isShowingSuggestions && (
                                  <motion.div
                                     initial={{ opacity: 0, height: 0 }}
                                     animate={{ opacity: 1, height: 'auto' }}
                                     exit={{ opacity: 0, height: 0 }}
                                     transition={{ duration: 0.2 }}
                                     className="overflow-hidden"
                                  >
                                     <div className="pt-3 px-1">
                                        <p className="text-[10px] text-zinc-300 uppercase tracking-widest font-bold mb-3 px-1">Suggestions</p>
                                        <div className="flex flex-wrap gap-2">
                                           {suggestionPills.map((pill, idx) => (
                                              <button
                                                 key={idx}
                                                 onClick={() => {
                                                    setSearchValue(pill.prompt);
                                                    setIsShowingSuggestions(false);
                                                 }}
                                                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100 hover:bg-black hover:text-white hover:border-black text-zinc-600 text-[12px] font-medium transition-all duration-200 group"
                                              >
                                                 <span className="text-zinc-400 group-hover:text-white transition-colors">{pill.icon}</span>
                                                 {pill.label}
                                              </button>
                                           ))}
                                        </div>
                                     </div>
                                  </motion.div>
                               )}
                            </AnimatePresence>"""

new_content = re.sub(pattern, replacement, content, count=1)

if new_content != content:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated AIPage.tsx with suggestions panel.")
else:
    print("Could not find the target pattern. Please check the file content.")
    # Print a snippet to help debugging
    idx = content.find('Show suggestions')
    if idx != -1:
        print("Snippet around 'Show suggestions':")
        print(repr(content[max(0, idx-100):idx+100]))
    else:
        print("'Show suggestions' text not found at all.")
