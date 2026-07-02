const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/shared/AIPage.tsx', 'utf8');

// The problematic snippet:
/*
1237:                               )}
1238:                                                    </div>
1239:                      </motion.div>
*/

content = content.replace(/\)\}\s+<\/div>\s+<\/motion\.div>/, 
`                               )}
                     </motion.div>`);

// wait, I used this before and it failed?
// Ah! I see. The problem is the indentation on 1238 is NOT what I thought?
// No, it's just that the regex is too strict on whitespaces maybe?
// Let's use `\s+` everywhere.

content = content.replace(/\)\}\s+<\/div>\s+<\/motion\.div>/, 
`                               )}
                     </motion.div>`);

// TRY AGAIN with a different pattern.
const pattern = /\)\}\s+<div[^>]*>\s+<\/div>\s+<\/motion\.div>/; // No, it's NOT an empty div. It's just a closer.

content = content.replace(/\)\}\s+<\/div>\s+<\/motion\.div>/, 
`                               )}
                     </motion.div>`);

// I'll use a MORE BRUTE FORCE APPROACH.
const pos = content.indexOf('                               )}\n                                                    </div>\n                      </motion.div>');
if (pos !== -1) {
    console.log("Found it!");
    const part1 = content.substring(0, pos);
    const middle = '                               )}\n                     </motion.div>';
    const part2 = content.substring(pos + '                               )}\n                                                    </div>\n                      </motion.div>'.length);
    content = part1 + middle + part2;
} else {
    console.log("Exact match failed, trying broader regex");
    content = content.replace(/\)\}\s+<\/div>\s+<\/motion\.div>/, 
`                               )}
                     </motion.div>`);
}

fs.writeFileSync('frontend/src/pages/shared/AIPage.tsx', content);
