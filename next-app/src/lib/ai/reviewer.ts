import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function getAIReview(code: string, error: string, context: string) {
   const model = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
   });

   const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a supportive Teacher. 
Task: Review student code that failed test cases or has logic errors.
Restriction: 
1. DO NOT give the full solution.
2. Highlight exactly which line needs fixing using the tag format: [RC] Line X: Code to fix [reason] [/RC].
3. Maintain a supportive, encouraging tone.
4. Explain WHY it is wrong, but let the student fix it.`],
      ["user", `Problem Context: {context}
Student Code:
{code}

Error/Failure:
{error}

Please provide your review:`]
   ]);

   const chain = prompt.pipe(model).pipe(new StringOutputParser());

   try {
      const response = await chain.invoke({
         code,
         error,
         context,
      });
      return response;
   } catch (err) {
      console.error("AI Review failed:", err);
      return "Could not generate review at this time. Please check the logic manually.";
   }
}
