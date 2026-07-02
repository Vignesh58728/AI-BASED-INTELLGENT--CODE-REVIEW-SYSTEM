const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/shared/AIPage.tsx', 'utf8');

// The problematic snippet:
/*
1238:                               )}
1239:                                                    </div>
1240:                      </motion.div>
*/

content = content.replace(/\)\}\s+<\/div>\s+<\/motion\.div>/, 
`                               )}
                     </motion.div>`);

fs.writeFileSync('frontend/src/pages/shared/AIPage.tsx', content);
