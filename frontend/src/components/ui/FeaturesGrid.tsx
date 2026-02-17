"use client";

import { CardBody, CardContainer, CardItem } from "./3d-card";

interface Feature {
   title: string;
   desc: string;
}

const features: Feature[] = [
   { title: "AI Pair Programmer", desc: "Real-time code suggestions while typing (Logic focused)." },
   { title: "Automated Unit Tests", desc: "AI generates comprehensive test cases for your code." },
   { title: "Explain My Code", desc: "Get human-readable summaries of complex logic." },
   { title: "AI Code Linting", desc: "Intelligent style and convention enforcement." },
   { title: "Complexity Analysis", desc: "Automated Big-O notation calculation (O(N), O(Log N))." },
   { title: "AI Debugger", desc: "Predicts likely locations of crashes or logical bugs." },
   { title: "Auto-Fix Suggestions", desc: "One-click 'Apply Fix' for detected bugs." },
   { title: "AI Language Converter", desc: "Instantly migrate code between languages (e.g., Python to Go)." },
   { title: "Intelligent Refactoring", desc: "Suggests cleaner ways to write complex structures." },
   { title: "AI Interviewer", desc: "Asks follow-up technical questions after submissions." },
   { title: "AI Voice Mentor", desc: "Natural language voice feedback on code quality." },
   { title: "Plagiarism AI", desc: "Deep structural analysis to detect copied solutions." },
   { title: "Custom AI Training", desc: "Teach the AI your specific project style and rules." },
   { title: "Dataset Generator", desc: "Generates mock data (JSON/CSV) for testing." },
   { title: "AI Skill Pathing", desc: "Dynamically adjusts curriculum based on user progress." },
   { title: "Semantic Search", desc: "Find problems using concepts vs keywords." },
   { title: "AI Doc Generator", desc: "Automatically writes professional Docstrings and READMEs." },
   { title: "Edge Case Predictor", desc: "Suggests missed inputs (empty strings, nulls, overflows)." },
   { title: "AI Code Reviewer", desc: "Line-by-line comments like a Senior Engineer." },
   { title: "Performance Bottleneck AI", desc: "Identifies slow functions and suggests optimizations." },
   { title: "Interactive Tutorials", desc: "Step-by-step guidance where AI gives hints, not answers." },
   { title: "AI Resume Parser", desc: "Tailors profile highlights based on performance." },
   { title: "SQL Query Optimizer", desc: "Suggestions for indexing and join improvements." },
   { title: "AI Regex Generator", desc: "Convert descriptions to complex Regex patterns." },
   { title: "Accessibility AI", desc: "Suggests UI improvements for accessibility standards." },
   { title: "AI Error Decoder", desc: "Simplifies complex compiler errors into plain English." },
   { title: "Predictive Analytics", desc: "Forecasts when you'll be 'Ready for Hire' status." },
   { title: "Code Simplifier", desc: "Reduces bloated code without changing behavior." },
];

export function FeaturesGrid() {
   return (
      <div className="w-full max-w-7xl mx-auto py-32 px-4 relative">
         <div className="text-center mb-24">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter" style={{ fontFamily: "'Outfit', system-ui" }}>
               AI    Super powers
            </h3>
            <div className="h-1 w-24 bg-purple-500 mx-auto rounded-full blur-[1px]" />
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {features.map((feature, i) => (
               <CardContainer key={i} className="inter-var">
                  <CardBody className="group relative p-8 rounded-2xl bg-[#080808] border border-white/5 hover:border-purple-500/30 transition-all duration-300 w-full min-h-[160px] flex flex-col justify-center">
                     {/* Glow Effect on Hover */}
                     <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl" />

                     <div className="relative z-10">
                        <CardItem
                           translateZ="60"
                           className="text-lg font-black text-white mb-3 uppercase tracking-tight group-hover:text-purple-300 transition-colors"
                           style={{ fontFamily: "'Outfit', system-ui" }}
                        >
                           {feature.title}
                        </CardItem>

                        <CardItem
                           translateZ="40"
                           as="p"
                           className="text-sm text-white/40 leading-relaxed font-bold"
                           style={{ fontFamily: "'Outfit', system-ui" }}
                        >
                           {feature.desc}
                        </CardItem>
                     </div>
                  </CardBody>
               </CardContainer>
            ))}
         </div>
      </div>
   );
}
