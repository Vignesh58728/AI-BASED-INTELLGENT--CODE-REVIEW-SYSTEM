import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";

export function ForgotPasswordPage() {
   const [email, setEmail] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [isSubmitted, setIsSubmitted] = useState(false);

   const validateEmail = (email: string) => {
      return /\S+@\S+\.\S+/.test(email);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!email) {
         setError("Please enter your email address");
         return;
      }

      if (!validateEmail(email)) {
         setError("Please enter a valid email address");
         return;
      }

      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
         setIsLoading(false);
         setIsSubmitted(true);
      }, 1500);
   };

   return (
      <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-white">
         <div className="w-full max-w-[550px] bg-white rounded-2xl p-16 shadow-[0_10px_50px_rgba(0,0,0,0.06)] relative z-10 m-4 overflow-hidden border border-neutral-100 transition-all duration-500">

            <HeaderSection />

            {!isSubmitted ? (
               <form onSubmit={handleSubmit} className="flex flex-col space-y-10" noValidate>
                  <div className="text-center space-y-2">
                     <h2 className="text-2xl font-normal text-black tracking-tight">Forgot Password?</h2>
                     <p className="text-black text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                     </p>
                  </div>

                  {error && (
                     <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-md animate-in fade-in slide-in-from-top-2 duration-300">
                        {error}
                     </div>
                  )}

                  <div className="space-y-6">
                     {/* Material Input: Email */}
                     <div className="group relative">
                        <div className="relative">
                           <input
                              type="email"
                              id="email"
                              required
                              placeholder=" "
                              className="peer w-full h-12 bg-transparent border-b-2 border-neutral-200 outline-none text-black text-base py-2 transition-all duration-200 focus:border-primary"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                           />
                           <label
                              htmlFor="email"
                              className="absolute left-0 top-3 text-black text-base transition-all duration-200 pointer-events-none origin-left 
                                         peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-black
                                         peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-black"
                           >
                              Email Address
                           </label>
                           <Mail className="absolute right-0 top-3 text-neutral-300 w-5 h-5" />
                           <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-focus-within:w-full"></div>
                        </div>
                     </div>
                  </div>

                  <button
                     type="submit"
                     disabled={isLoading}
                     className="relative w-full bg-black text-white font-bold h-12 rounded-md shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center group"
                  >
                     <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"></div>
                     {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : (
                        "SEND RESET LINK"
                     )}
                  </button>

                  <div className="text-center pt-2">
                     <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-black hover:text-black transition-colors text-sm font-medium"
                     >
                        <ArrowLeft size={16} />
                        Back to Login
                     </Link>
                  </div>
               </form>
            ) : (
               <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-black mb-2">
                     <Mail size={40} />
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-2xl font-bold text-black">Check your email</h2>
                     <p className="text-black">
                        We've sent a password reset link to <span className="text-black font-semibold">{email}</span>.
                     </p>
                  </div>
                  <p className="text-sm text-neutral-400">
                     Didn't receive the email? Check your spam folder or{" "}
                     <button
                        onClick={() => setIsSubmitted(false)}
                        className="text-black font-semibold hover:underline"
                     >
                        try again
                     </button>
                  </p>
                  <Link
                     to="/login"
                     className="w-full bg-black text-white font-bold h-12 rounded-md flex items-center justify-center hover:bg-black/90 transition-all"
                  >
                     RETURN TO LOGIN
                  </Link>
               </div>
            )}
         </div>
      </div>
   );
}

function HeaderSection() {
   return (
      <div className="flex flex-col items-center mb-10">
         <h1 className="text-xl md:text-2xl font-bold text-black tracking-[0.2em] uppercase text-center" style={{ fontFamily: "'Syncopate', sans-serif" }}>
            AI BASED CODE REVIEW SYSTEM
         </h1>
      </div>
   );
}
