const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/shared/AIPage.tsx', 'utf8');

// Closing of 912 is at 1239.
// 1240 is EXTRA because 1241 is the motion.div closer.
// wait, 1242 is the } closer for (!isChatActive ? ... : ...)
// 1243 is AnimatePresence closer.
// 1244 is the 713 div closer.
// 1245 is the main closer.
// 1246 is nothing.

content = content.replace(/<\/div>\s+<\/div>\s+<\/motion\.div>\s+\)\}\s+<\/AnimatePresence>/, 
`                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>`);

fs.writeFileSync('frontend/src/pages/shared/AIPage.tsx', content);
