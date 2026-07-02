export interface CheckResult {
   passed: boolean;
   message?: string;
   type?: 'Hard Coding' | 'Requirement not met' | 'Unnecessary code';
}

export function runStrictChecks(code: string, requirements: {
   testCases: { input: string; expectedOutput: string }[];
   requiredFunctions?: string[];
}): CheckResult {

   // 1. Detect Hardcoding
   // If the code contains the expected output strings verbatim (especially for non-trivial outputs)
   for (const tc of requirements.testCases) {
      const expected = tc.expectedOutput.trim();
      if (expected.length > 2) { // Avoid false positives on single digits
         // Check if the expected output is assigned or logged directly without logic
         // This is a naive regex-based check; a more advanced one would use AST
         const escaped = expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
         const hardcodeRegex = new RegExp(`['"\`]${escaped}['"\`]`, 'i');
         if (hardcodeRegex.test(code)) {
            return { passed: false, type: 'Hard Coding', message: 'Do not hardcode the expected outputs.' };
         }
      }
   }

   // 2. Check required functions
   if (requirements.requiredFunctions) {
      for (const func of requirements.requiredFunctions) {
         if (!code.includes(`function ${func}`) && !code.includes(`${func} =`) && !code.includes(`${func}:`)) {
            return { passed: false, type: 'Requirement not met', message: `Required function "${func}" is missing.` };
         }
      }
   }

   // 3. Detect unnecessary lines (e.g., massive comments or repetitive prints)
   const lines = code.split('\n');
   if (lines.length > 200 && code.length > 5000) { // Arbitrary thresholds for "unnecessary"
      return { passed: false, type: 'Unnecessary code', message: 'Code is too verbose or contains unnecessary lines.' };
   }

   return { passed: true };
}

export function shouldReview(code: string, result: { passed: boolean; actualOutput: string }): 'no_correct' | 'no_meaningless' | 'proceed' {
   if (result.passed) return 'no_correct';

   const cleanCode = code.replace(/\s/g, '');
   if (cleanCode.length < 20 || cleanCode === '') return 'no_meaningless';

   return 'proceed';
}
