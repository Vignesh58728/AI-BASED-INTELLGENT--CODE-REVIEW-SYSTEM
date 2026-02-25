import { useEffect, useState } from "react";

interface FillTheBlankProps {
   problem: any;
}

interface Question {
   id: number;
   text: string;
   // full program lines — each line is either a plain string or a "blank" marker
   lines: Array<{ type: "line"; content: string } | { type: "blank_line"; before: string; after: string }>;
}

function generateQuestions(problem: any): Question[] {
   const code: string =
      problem?.template_code?.python ||
      problem?.template_code?.text ||
      "";

   if (!code) return [];

   const allLines = code.split("\n");

   const buildLinesWithBlank = (targetLineIndex: number, before: string, after: string) =>
      allLines.map((line, idx) => {
         if (idx === targetLineIndex) {
            return { type: "blank_line" as const, before, after };
         }
         return { type: "line" as const, content: line };
      });

   // Priority 1: User's placeholder __________
   for (let i = 0; i < allLines.length; i++) {
      if (allLines[i].includes("__________")) {
         const parts = allLines[i].split("__________");
         return [{
            id: 1,
            text: problem.description || "Fill in the blank:",
            lines: buildLinesWithBlank(i, parts[0], parts[1] || ""),
         }];
      }
   }

   // Fallback regex strategy
   for (let i = 0; i < allLines.length; i++) {
      const m = allLines[i].match(/^(\s*print\()(".*?"|'.*?')(\).*)$/);
      if (m) {
         return [{
            id: 1,
            text: "What string should go inside print( ) ?",
            lines: buildLinesWithBlank(i, m[1], m[3]),
         }];
      }
   }

   for (let i = 0; i < allLines.length; i++) {
      const m = allLines[i].match(/^(\s*[a-zA-Z_]\w*\s*=\s*)(.+)$/);
      if (m && !allLines[i].trim().startsWith("#") && !allLines[i].trim().startsWith("def ") && !allLines[i].trim().startsWith("class ")) {
         return [{
            id: 1,
            text: `What value should be assigned?`,
            lines: buildLinesWithBlank(i, m[1], ""),
         }];
      }
   }

   return [];
}

export function FillTheBlank({ problem }: FillTheBlankProps) {
   const [questions, setQuestions] = useState<Question[]>([]);
   const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

   useEffect(() => {
      if (problem) {
         const generated = generateQuestions(problem);
         setQuestions(generated);
         setUserAnswers({});
      }
   }, [problem?.id]);

   if (questions.length === 0) return null;

   const handleAnswerChange = (questionId: number, lineIndex: number, value: string) => {
      setUserAnswers(prev => ({
         ...prev,
         [`${questionId}-${lineIndex}`]: value
      }));
   };

   return (
      <div className="mt-8 pt-4 border-t border-white/5">
         <div className="space-y-12">
            {questions.map((q, i) => (
               <div key={q.id} className="space-y-6">
                  {/* Plain Text Question Prompt - Shifted Left */}
                  <div className="flex items-start gap-3 pl-0 py-1">
                     <span className="text-yellow-600 font-bold text-xl leading-none">Q.</span>
                     <p className="text-black text-sm font-bold leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {q.text}
                     </p>
                  </div>

                  {/* Clean Code Section - Shifted Left */}
                  <div
                     className="pl-2 py-2 space-y-3"
                     style={{
                        fontFamily: "'Fira Code', 'Courier New', monospace",
                        fontSize: "15px"
                     }}
                  >
                     {q.lines.map((lineObj, idx) => {
                        if (lineObj.type === "line") {
                           return (
                              <div key={idx} className="text-black whitespace-pre opacity-90">
                                 {lineObj.content || "\u00A0"}
                              </div>
                           );
                        }
                        return (
                           <div key={idx} className="flex items-center whitespace-pre py-1">
                              <span className="text-black font-semibold">{lineObj.before}</span>
                              <input
                                 type="text"
                                 autoFocus={i === 0 && idx === 0}
                                 value={userAnswers[`${q.id}-${idx}`] || ""}
                                 onChange={(e) => handleAnswerChange(q.id, idx, e.target.value)}
                                 placeholder="..."
                                 className="bg-white border-b-2 border-black/30 text-black px-2 py-1 focus:border-yellow-500 focus:outline-none transition-all mx-1 placeholder:text-zinc-300 rounded-sm"
                                 style={{
                                    width: "160px",
                                    fontFamily: "inherit",
                                    fontSize: "inherit"
                                 }}
                              />
                              <span className="text-black font-semibold">{lineObj.after}</span>
                           </div>
                        );
                     })}
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
