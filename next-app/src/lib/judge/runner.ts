import vm from 'node:vm';

export interface TestCase {
   input: string;
   expectedOutput: string;
}

export interface RunResult {
   passed: boolean;
   actualOutput: string;
   error?: string;
   testCaseResults: {
      input: string;
      expected: string;
      actual: string;
      passed: boolean;
   }[];
}

export async function runCode(code: string, testCases: TestCase[]): Promise<RunResult> {
   const testCaseResults = [];
   let allPassed = true;

   for (const tc of testCases) {
      const sandbox = {
         console: {
            log: (...args: any[]) => {
               sandbox.output += args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n';
            }
         },
         output: '',
         input: tc.input,
      };

      try {
         // Basic wrapper to simulate input if needed, though usually we might just inject variables
         // For standard judge, we might want to override prompt() or use process.stdin mocks
         // Here we assume the student code can use a global 'input' variable or we wrap it

         const script = new vm.Script(`
        (function() {
          ${code}
        })()
      `);

         script.runInNewContext(sandbox, { timeout: 2000 });

         const actual = sandbox.output.trim();
         const passed = actual === tc.expectedOutput.trim();

         testCaseResults.push({
            input: tc.input,
            expected: tc.expectedOutput,
            actual: actual,
            passed,
         });

         if (!passed) allPassed = false;
      } catch (err: any) {
         allPassed = false;
         return {
            passed: false,
            actualOutput: '',
            error: err.message,
            testCaseResults: [],
         };
      }
   }

   return {
      passed: allPassed,
      actualOutput: testCaseResults[0]?.actual || '',
      testCaseResults,
   };
}
