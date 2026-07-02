const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/shared/AIPage.tsx', 'utf8');

// Identify the specific sequence of tags that is causing the problem.
// From view_file 736:
/*
1232:                                  </div>
1233:                               </div>
1234:                               {attachedFileName && (
...
1242:                               )}
1243:                            </div>
1244:                         </div>
1245:                        </motion.div>
*/

// I'll replace the first set of tags with only what's needed for the bar.
// bar ends at 1232. 1233 closes the absolute wrapper. 
// However, in the slim bar I added, there are only TWO divs to close.

const search1 = '                                 </button>\n                                  </div>\n                               </div>\n                               {attachedFileName && (';
// Wait, my view_file had:
/*
1231:                                        {isGeneratingImage || isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowUp size={22} strokeWidth={2.5} />}
1232:                                     </button>
1233:                                  </div>
1234:                               </div>
1235:                               {attachedFileName && (
*/

// I'll use a more direct replacement.
const badSnippet = `                                 </button>
                                  </div>
                               </div>
                               {attachedFileName && (`;

// Let's check the EXACT indentation in the file.
// Actually, I'll just look for {attachedFileName && ( and fix BEFORE and AFTER it.

content = content.replace(/<\/button>\s+<\/div>\s+<\/div>\s+<\/div>\{attachedFileName && \(/, 
`                                 </button>
                              </div>
                           </div>
                           {attachedFileName && (`);

content = content.replace(/\)\}\s+<\/div>\s+<\/div>\s+<\/motion\.div>/, 
`                        )}
                     </motion.div>`);

fs.writeFileSync('frontend/src/pages/shared/AIPage.tsx', content);
