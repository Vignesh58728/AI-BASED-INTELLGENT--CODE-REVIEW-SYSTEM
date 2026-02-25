/**
 * Offline Executor Utility
 * Handles client-side code execution for Python (via Skulpt), JavaScript (Native), and Java (Simulated).
 */

declare const Sk: any;

export interface ExecutionResult {
   output: string;
   error: string;
   status: 'success' | 'error' | 'timeout';
}

export const offlineExecutor = {
   execute: async (code: string, language: string): Promise<ExecutionResult> => {
      switch (language.toLowerCase()) {
         case 'python':
            return executePython(code);
         case 'javascript':
            return executeJavaScript(code);
         case 'java':
            return executeJava(code);
         default:
            return {
               output: '',
               error: `Offline support for ${language} is not yet available.`,
               status: 'error'
            };
      }
   }
};

/**
 * Python Execution using Skulpt
 */
function executePython(code: string): Promise<ExecutionResult> {
   return new Promise((resolve) => {
      let output = '';

      // Config Skulpt
      if (typeof Sk === 'undefined') {
         resolve({ output: '', error: 'Python runtime (Skulpt) not loaded.', status: 'error' });
         return;
      }

      Sk.configure({
         output: (text: string) => { output += text; },
         read: (x: string) => {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
               throw new Error("File not found: '" + x + "'");
            }
            return Sk.builtinFiles["files"][x];
         },
      });

      try {
         const promise = Sk.misceval.asyncToPromise(() => {
            return Sk.importMainWithBody("<stdin>", false, code, true);
         });

         promise.then(
            () => resolve({ output, error: '', status: 'success' }),
            (err: any) => resolve({ output, error: err.toString(), status: 'error' })
         );
      } catch (e: any) {
         resolve({ output, error: e.toString(), status: 'error' });
      }
   });
}

/**
 * JavaScript Execution using Function Constructor
 */
function executeJavaScript(code: string): ExecutionResult {
   let output = '';
   const originalLog = console.log;

   // Intercept console.log
   console.log = (...args: any[]) => {
      output += args.map(arg =>
         typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ') + '\n';
   };

   try {
      // Wrap in IIFE to allow 'return' at top level if needed, but usually just eval
      new Function(code)();
      return { output, error: '', status: 'success' };
   } catch (e: any) {
      return { output, error: e.toString(), status: 'error' };
   } finally {
      console.log = originalLog;
   }
}

/**
 * Java Simulation Logic
 * Handles common Java patterns for student learning without a real JVM.
 */
function executeJava(code: string): ExecutionResult {
   let output = '';
   const lines = code.split('\n');
   const variables: Record<string, any> = {};

   try {
      for (let line of lines) {
         line = line.trim();
         if (!line || line.startsWith('//') || line.startsWith('import ') || line.startsWith('public class ') || line.startsWith('package ')) continue;

         // Handle System.out.println
         const printMatch = line.match(/System\.out\.println\((.*)\);/);
         if (printMatch) {
            let expression = printMatch[1].trim();
            // Basic expression evaluation (naive string parsing)
            if (expression.startsWith('"') && expression.endsWith('"')) {
               output += expression.slice(1, -1) + '\n';
            } else {
               // Check variables or simple math
               try {
                  // Basic simulation: only supports simple var names for now
                  const val = eval(expression.replace(/[a-zA-Z_]\w*/g, (m) => variables[m] !== undefined ? variables[m] : m));
                  output += val + '\n';
               } catch {
                  output += `[SIMULATION ERROR] Could not evaluate: ${expression}\n`;
               }
            }
            continue;
         }

         // Handle variable assignment (int x = 10;)
         const varMatch = line.match(/(int|double|String|float|long|boolean)\s+([a-zA-Z_]\w*)\s*=\s*([^;]+);/);
         if (varMatch) {
            const name = varMatch[2];
            const valExpr = varMatch[3].trim();
            try {
               variables[name] = eval(valExpr);
            } catch {
               variables[name] = valExpr.replace(/"/g, '');
            }
         }
      }

      if (!output && lines.length > 5) {
         output = "[JAVA SIMULATOR] Code recognized but no 'System.out.println' statements produced output.";
      }

      return { output: output || "Process finished with exit code 0", error: '', status: 'success' };
   } catch (e: any) {
      return { output: 'Simulation partially failed.', error: e.toString(), status: 'error' };
   }
}
