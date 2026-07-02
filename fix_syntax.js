const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/shared/AIPage.tsx', 'utf8');

// 1. Remove the extra div after landing send button
// Original: 810: </div>, 811: nothing (already removed by me), 812: button
// Wait, I already removed it.

// 2. Remove extra div at 834
// It looks like:
// 831: </div> (closes 753)
// 832: empty
// 833: empty
// 834: </div> (EXTRA)
// 835: </motion.div>
content = content.replace(/<\/div>\s+\s+<\/div>\s+<\/motion\.div>\s+\) : \(/g, '</div>\n                       </motion.div>\n                    ) : (');

// 3. Remove extra div at 1110
// It looks like:
// 1109: </div>
// 1110: </div> (EXTRA)
// 1111: </motion.div>
content = content.replace(/<\/div>\s+<\/div>\s+<\/div>\s+<\/motion\.div>\s+\)}\s+<\/AnimatePresence>/g, '</div>\n                        </motion.div>\n                     )}\n                </AnimatePresence>');

fs.writeFileSync('frontend/src/pages/shared/AIPage.tsx', content);
