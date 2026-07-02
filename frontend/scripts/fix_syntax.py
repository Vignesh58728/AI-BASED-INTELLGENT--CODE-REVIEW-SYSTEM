import os
import re

path = r'd:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\frontend\src\pages\shared\AIPage.tsx'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Based on view_file:
# 914:                               )}
# 915:                            </div>
# 916: 
# 917: 
# 918:                            </div>
# 919:                        </motion.div>

# We want to remove lines 915-918 (index 914 to 917 if 0-indexed)
# Let's verify by line content.
to_remove = []
for i, line in enumerate(lines):
    # Search around the target area
    if 914 <= i <= 918:
        if '</div>' in line or line.strip() == '':
            to_remove.append(i)

# Safety check: We only want to remove things BETWEEN line 914 (attachedFile end) and 919 (motion.div end)
new_lines = []
for i, line in enumerate(lines):
    if i == 914: # Keep 915? No, line 915 in view_file is index 914.
        new_lines.append(line)
        continue
    if 914 < i < 918: # Remove indices 915, 916, 917 (view_file lines 916, 917, 918)
        # Wait, if line 914 in view_file is index 913.
        # Line 915 is index 914.
        # ...
        pass
    else:
        new_lines.append(line)

# Let's be MORE precise.
# We want:
#                               )}
#                        </motion.div>
#                    ) : (

# Current:
#                               )}
#                            </div>
#
#
#                            </div>
#                        </motion.div>

final_content = "".join(lines)
# Regex to remove those specifically
broken_pattern = re.compile(r'(\s+\})\s+\)\s+\}\s+<\/div>\s+<\/div>\s+<\/motion\.div>', re.MULTILINE)
# Wait, let's look at the view_file again.
# 914:                               )}
# 915:                            </div>
# 918:                            </div>
# 919:                        </motion.div>

clean_pattern = re.compile(r'(\s+\})\n\s+<\/div>\n\s+\n\s+\n\s+<\/div>\n\s+<\/motion\.div>', re.MULTILINE)

# I'll just use a direct line replacement for this specific block.
start_marker = '                              )}\n'
middle_marker = '                           </div>\n'
end_marker = '                       </motion.div>\n'

fixed_content = final_content.replace('                              )}\n                           </div>\n\n\n                           </div>\n                       </motion.div>', '                              )}\n                       </motion.div>')

if fixed_content == final_content:
    # Try with slightly different spacing
    fixed_content = re.sub(r'\}\)\}\s+<\/div>\s+<\/div>\s+<\/motion\.div>', '})}\n                        </motion.div>', final_content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("Syntax fixed.")
