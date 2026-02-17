"use client";

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { CodePreviewCard } from "@/components/ui/CodePreviewCard";

import { FeaturesGrid } from "@/components/ui/FeaturesGrid";
import { AivisoLogo } from "@/components/ui/AivisoLogo";
import { Safari } from "@/components/ui/Safari";
import { Iphone } from "@/components/ui/Iphone";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { BrandIcon } from "@/components/ui/BrandIcon";

export function LandingPage() {
   const navigate = useNavigate();


   return (
      <div className="bg-black min-h-screen">
         <BackgroundBeamsWithCollision className="flex-col bg-black">
            <div className="min-h-screen w-full flex flex-col items-center justify-center max-w-7xl mx-auto px-4 text-center py-20">
               {/* Main Title - Static Ultra-Premium Style */}
               <h2 className="relative z-20 flex flex-col items-center justify-center w-full text-center uppercase tracking-tight font-sans">
                  <motion.div
                     animate={{
                        y: [0, -15, 0],
                     }}
                     transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                     }}
                  >
                     <BrandIcon size={120} className="mb-8 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]" />
                  </motion.div>

                  <motion.span
                     initial={{ opacity: 0, letterSpacing: "0.2em" }}
                     animate={{ opacity: 1, letterSpacing: "0.5em" }}
                     transition={{ duration: 2, ease: "easeOut" }}
                     className="text-white/80 text-xl md:text-3xl mb-4 font-black font-sans"
                  >
                     AI BASED
                  </motion.span>

                  <motion.div
                     className="relative inline-block px-4 py-8 [filter:drop-shadow(0px_4px_8px_rgba(0,0,0,0.1))]"
                     initial="hidden"
                     animate="visible"
                     variants={{
                        visible: {
                           transition: {
                              staggerChildren: 0.1,
                           },
                        },
                     }}
                  >
                     <div className="absolute inset-0 flex items-center justify-center bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-[#363062] via-violet-600 to-[#F99417]">
                        <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black whitespace-nowrap flex flex-nowrap justify-center w-full">
                           {Array.from("INTELLIGENCE CODE REVIEW SYSTEM").map((char, i) => (
                              <motion.span
                                 key={i}
                                 variants={{
                                    hidden: { opacity: 0, y: 15, filter: "blur(8px)" },
                                    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                                 }}
                                 transition={{ duration: 0.5, ease: "easeOut" }}
                              >
                                 {char === " " ? "\u00A0" : char}
                              </motion.span>
                           ))}
                        </span>
                     </div>
                     <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-[#363062] via-violet-600 to-[#F99417]">
                        <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black whitespace-nowrap flex flex-nowrap justify-center w-full">
                           {Array.from("INTELLIGENCE CODE REVIEW SYSTEM").map((char, i) => (
                              <motion.span
                                 key={i}
                                 variants={{
                                    hidden: { opacity: 0, y: 15 },
                                    visible: { opacity: 1, y: 0 },
                                 }}
                                 transition={{ duration: 0.5, ease: "easeOut" }}
                              >
                                 {char === " " ? "\u00A0" : char}
                              </motion.span>
                           ))}
                        </span>
                     </div>
                  </motion.div>
               </h2>

               <div className="mt-16 z-20 flex flex-col items-center gap-12">
                  <div className="flex flex-col sm:flex-row items-center gap-12">
                     <button
                        onClick={() => navigate('/logo-splash')}
                        className="group relative text-[18px] text-white font-extrabold uppercase transition-colors duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:text-white/80 focus:outline-none"
                     >
                        Start Learning Now
                        <span className="absolute bottom-[-2px] left-1/2 w-0 h-[2px] bg-white transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:w-full group-hover:left-0"></span>
                     </button>
                     <button
                        className="group relative text-[18px] text-white/70 font-extrabold uppercase transition-colors duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:text-white focus:outline-none"
                     >
                        Watch Demo
                        <span className="absolute bottom-[-2px] left-1/2 w-0 h-[2px] bg-white/50 transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:w-full group-hover:left-0"></span>
                     </button>
                  </div>

                  {/* Thirukkural Integrated back into Hero for "Higher" position */}
                  <div className="mt-24 min-h-[5rem] flex items-center justify-center">
                     <p className="text-xl md:text-3xl font-bold text-white/90 text-center leading-relaxed" style={{ fontFamily: "'Outfit', system-ui" }}>
                        "தெய்வத்தான் ஆகா தெனினும் முயற்சிதன் <br />
                        மெய்வருத்தக் கூலி தரும்"
                     </p>
                  </div>
               </div>
            </div>


            {/* How It Works Section */}
            <div className="w-full z-20 pt-32 pb-40 px-4 flex flex-col items-center">
               <div className="text-center mb-16">
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter" style={{ fontFamily: "'Outfit', system-ui" }}>
                     How   it    Works
                  </h3>
                  <div className="h-1 w-24 bg-purple-500 mx-auto rounded-full blur-[1px]" />
               </div>

               <div className="w-full max-w-6xl mx-auto">
                  <Safari url="aiviso.ai/reviewer-dashboard" className="shadow-[0_0_50px_-12px_rgba(168,85,247,0.2)]">
                     {/* Decorative Accent Integrated into Safari */}
                     <div className="flex items-center justify-center py-10 bg-[#0a0a0a]">
                        <motion.div
                           initial={{ scale: 0, rotate: -45 }}
                           whileInView={{ scale: 1, rotate: 0 }}
                           viewport={{ once: true }}
                           transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                           className="relative"
                        >
                           <div className="absolute inset-0 bg-purple-500 blur-md rounded-full opacity-60 animate-pulse" />
                           <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                              <path d="M50 10 Q53 47 90 50 Q53 53 50 90 Q47 53 10 50 Q47 47 50 10 Z" fill="white" />
                           </svg>
                        </motion.div>
                     </div>
                     <CodePreviewCard />
                  </Safari>
               </div>
            </div>

            {/* AiVISO POWER Section */}
            <div className="w-full z-20 bg-black pt-28 pb-40 flex flex-col items-center">
               <div className="flex items-center gap-4 mb-16">
                  <AivisoLogo className="w-12 h-12" />
                  <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: "'Outfit', system-ui" }}>
                     AiVISO POWER
                  </h3>
               </div>


               <div className="relative group">
                  {/* Background Radial Glow */}
                  <div className="absolute -inset-20 bg-purple-500/10 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <Iphone className="scale-75 md:scale-100 relative">
                     <BorderBeam size={250} duration={12} delay={9} colorFrom="#A855F7" colorTo="#3B82F6" />

                     <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
                        {/* Brand Cluster */}
                        <div className="flex flex-col items-center gap-6 relative z-10 text-center w-full px-4 pt-12">
                           <motion.div
                              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                           >
                              <AivisoLogo className="w-24 h-24 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]" />
                           </motion.div>

                           <div className="space-y-6">
                              <div className="flex flex-col items-center">
                                 <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none" style={{ fontFamily: "'Outfit', system-ui" }}>
                                    Aiviso AI
                                 </h4>
                                 <span className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mt-2" style={{ fontFamily: "'Outfit', system-ui" }}>
                                    SOCRATIC MENTORSHIP
                                 </span>
                              </div>



                              <div className="flex flex-col items-center gap-2 pt-4">
                                 <div className="flex items-center gap-2 text-xs font-black text-white/90 uppercase tracking-tighter" style={{ fontFamily: "'Outfit', system-ui" }}>
                                    <span>SCHOOLS</span>
                                    <div className="w-1 h-1 rounded-full bg-purple-500" />
                                    <span>COLLEGES</span>
                                    <div className="w-1 h-1 rounded-full bg-purple-500" />
                                    <span>IT FIELD</span>
                                 </div>
                              </div>
                           </div>

                           {/* Decorative Bottom Bar */}
                           <div className="w-12 h-1 bg-purple-500/30 rounded-full mt-6 blur-[1px]" />
                        </div>

                        {/* Ambient Background Glow inside phone */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
                     </div>
                  </Iphone>
               </div>
            </div>

            {/* AI Capabilities Section */}
            <div className="w-full z-20 pb-40">
               <FeaturesGrid />
            </div>

         </BackgroundBeamsWithCollision>
      </div>
   );
}
