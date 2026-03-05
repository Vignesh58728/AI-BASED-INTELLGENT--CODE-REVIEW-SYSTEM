import { NextRequest, NextResponse } from 'next/server';
import { runCode, TestCase } from '@/lib/judge/runner';
import { runStrictChecks, shouldReview } from '@/lib/judge/checker';
import { getAIReview } from '@/lib/ai/reviewer';

export async function POST(req: NextRequest) {
   try {
      const { code, problemContext, testCases, requiredFunctions } = await req.json();

      if (!code || !testCases) {
         return NextResponse.json({ error: 'Missing code or test cases' }, { status: 400 });
      }

      // 1. Strict Code Checking
      const strictCheck = runStrictChecks(code, { testCases, requiredFunctions });
      if (!strictCheck.passed) {
         return NextResponse.json({
            status: 'rejected',
            type: strictCheck.type,
            message: strictCheck.message,
         });
      }

      // 2. Run in Sandbox
      const runResult = await runCode(code, testCases as TestCase[]);

      // 3. Review Necessity Chain
      const action = shouldReview(code, runResult);

      let aiReview = null;
      if (action === 'proceed') {
         aiReview = await getAIReview(
            code,
            runResult.error || `Failed test cases: ${runResult.testCaseResults.filter(r => !r.passed).length}`,
            problemContext
         );
      }

      return NextResponse.json({
         status: runResult.passed ? 'passed' : 'failed',
         runResult,
         aiReview,
         reviewStatus: action,
      });

   } catch (error: any) {
      console.error('Submission error:', error);
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
   }
}
