import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import api from "@/services/api";

export function RegisterPage() {
   const [name, setName] = useState("");
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [college, setCollege] = useState("");
   const [role, setRole] = useState("student");
   const [github, setGithub] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const navigate = useNavigate();
   const { login, isAuthenticated } = useAuth();
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (isAuthenticated) {
         navigate('/explore');
      }
   }, [isAuthenticated, navigate]);

   const validateForm = () => {
      if (!name || !username || !email || !password || !confirmPassword) {
         setError("Please fill in all required fields");
         return false;
      }
      if (password !== confirmPassword) {
         setError("Passwords do not match");
         return false;
      }
      if (password.length < 6) {
         setError("Password must be at least 6 characters");
         return false;
      }
      setError(null);
      return true;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;
      setIsLoading(true);
      setError(null);

      try {
         // 1. Register user
         await api.post('/auth/register', {
            email,
            username,
            full_name: name,
            password,
            role
         });

         // 2. Login user to get token
         const loginResponse = await api.post('/auth/login', new URLSearchParams({
            username: email,
            password: password
         }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
         });

         const { access_token } = loginResponse.data;
         const payload = JSON.parse(atob(access_token.split('.')[1]));

         login({
            id: payload.sub,
            name: name,
            email: email,
            role: role,
            token: access_token,
            username: username
         });

         navigate('/explore');
      } catch (err: any) {
         console.error("Registration error:", err);
         const errorMessage = err.response?.data?.detail || "Registration failed. Please check your network or try again.";
         setError(errorMessage);
      } finally {
         setIsLoading(false);
      }
   };

   const handleGoogleSuccess = async (credentialResponse: any) => {
      setIsLoading(true);
      try {
         const response = await api.post('/auth/google/token', {
            credential: credentialResponse.credential
         });
         const { access_token } = response.data;
         const payload = JSON.parse(atob(access_token.split('.')[1]));
         login({
            id: payload.sub,
            name: payload.name || payload.email,
            email: payload.email,
            role: 'student',
            token: access_token,
            username: payload.username 
         });
         navigate('/explore');
      } catch (err: any) {
         console.error("Google sign-up error:", err);
         const errorMessage = err.response?.data?.detail || "Google sign-up failed. Please try again.";
         setError(errorMessage);
      } finally {
         setIsLoading(false);
      }
   };

   const handleGuestLogin = async () => {
      setIsLoading(true);
      setError(null);

      const guestEmail = "guest_official@aiviso.ai";
      const guestPass = "guest-password-123";
      const guestUsername = "guest_official";

      try {
         try {
            // Step 1: Attempt Login
            const response = await api.post('/auth/login', new URLSearchParams({
               username: guestEmail,
               password: guestPass
            }), {
               headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const { access_token } = response.data;
            const payload = JSON.parse(atob(access_token.split('.')[1]));
            login({
               id: payload.sub,
               name: payload.name || "Guest User",
               email: guestEmail,
               role: payload.role || 'student',
               token: access_token,
               username: payload.username || guestUsername
            });
         } catch (loginErr: any) {
            // Step 2: Try Registering if login failed
            try {
               await api.post('/auth/register', {
                  email: guestEmail,
                  username: guestUsername,
                  full_name: "Guest User",
                  password: guestPass,
                  role: "student"
               });

               // Step 3: Login after registration
               const response = await api.post('/auth/login', new URLSearchParams({
                  username: guestEmail,
                  password: guestPass
               }), {
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
               });
               const { access_token } = response.data;
               const payload = JSON.parse(atob(access_token.split('.')[1]));
               login({
                  id: payload.sub,
                  name: payload.name || "Guest User",
                  email: guestEmail,
                  role: payload.role || 'student',
                  token: access_token,
                  username: payload.username || guestUsername
               });
            } catch (regErr: any) {
               throw regErr;
            }
         }

         navigate('/explore');
      } catch (err: any) {
         console.warn("Guest login server-side failed, using local fallback mode:", err);

         login({
            id: "local-guest",
            name: "Guest User",
            email: guestEmail,
            role: 'student',
            token: "offline-guest-token",
            username: guestUsername,
            photo: null,
            isOffline: true
         });

         navigate('/explore');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div
         className="relative flex min-h-screen w-full overflow-hidden bg-black font-sans"
         style={{
            backgroundImage: `url(/pexels-marek-piwnicki-9606966.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
         }}
      >
         {/* Full page dark overlay */}
         <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

         <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 xl:px-40 py-10 min-h-screen">
            
            {/* ── Left Side: Glassmorphism Form Card ── */}
            <div className="w-full max-w-[480px] bg-[#050505]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 lg:p-10 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] mt-10 lg:mt-0">
               
               {/* Form Header */}
               <div className="flex flex-col items-center mb-8 w-full">
                  <div className="text-[26px] sm:text-3xl font-bold text-white tracking-wider whitespace-nowrap" style={{ fontFamily: "'Satisfy', cursive" }}>
                     Ai <span className="text-red-500">Code Review</span> System
                  </div>
                  <h2 className="text-[22px] font-normal text-white text-center mt-6 inline-block" style={{ fontFamily: "'Satisfy', cursive" }}>
                     <span className="border-b-[1.5px] border-white/80 pb-1 px-1">Create Account</span>
                  </h2>
               </div>

               <form onSubmit={handleSubmit} className="flex flex-col flex-1" noValidate>

                  {error && (
                     <div className="bg-red-900/40 border border-red-500/40 text-red-400 text-xs p-3 rounded-md animate-in fade-in slide-in-from-top-2 duration-300 mb-6">
                        {error}
                     </div>
                  )}

                  <div className="space-y-6 mb-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        <MaterialInput id="name" label="Full Name" value={name} onChange={setName} required />
                        <MaterialInput id="username" label="Username" value={username} onChange={setUsername} required />
                        <MaterialInput id="email" label="Email" type="email" value={email} onChange={setEmail} required />
                        <MaterialInput id="phone" label="Phone" type="tel" value={phone} onChange={setPhone} />
                     </div>
                     <MaterialInput
                        id="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={setPassword}
                        required
                        showToggle
                        isToggled={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                     />
                     <MaterialInput
                        id="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        required
                        showToggle
                        isToggled={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                     />
                  </div>

                  <div className="flex items-center mb-7">
                     <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" required className="accent-white bg-black/50 border-zinc-600 rounded-sm w-4 h-4 cursor-pointer" />
                        <span className="text-white/80 text-[15px] mt-[2px]" style={{ fontFamily: "'Satisfy', cursive" }}>I agree to Terms & Conditions.</span>
                     </label>
                  </div>

                  <button
                     type="submit"
                     disabled={isLoading}
                     className="w-full bg-white text-black h-12 rounded-[1rem] shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center text-lg mb-8 disabled:opacity-70"
                     style={{ fontFamily: "'Satisfy', cursive" }}
                  >
                     {isLoading ? "..." : "Create Account"}
                  </button>

                  <div className="relative text-center mb-8">
                     <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                     <span className="relative px-3 bg-transparent text-zinc-600 font-bold text-[9px] uppercase tracking-[0.2em]">OR</span>
                  </div>

                  {/* Social Buttons Container */}
                  <div className="flex justify-center items-center gap-6 mb-8">
                     {/* Google IconButton */}
                     <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/5 flex items-center justify-center bg-transparent hover:bg-white/5 transition-colors group">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer overflow-hidden scale-[2.5]">
                           <GoogleLogin
                              onSuccess={handleGoogleSuccess}
                              onError={() => setError('Google sign-up failed.')}
                              type="icon"
                              shape="circle"
                              size="large"
                           />
                        </div>
                        <div className="pointer-events-none group-hover:opacity-0 transition-opacity">
                           <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                 <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                                 <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                                 <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                                 <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                              </g>
                           </svg>
                        </div>
                     </div>
                     
                     <button type="button" className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center bg-transparent hover:bg-white/5 transition-colors text-zinc-500 hover:text-white">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                           <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                     </button>

                     <button type="button" className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center bg-transparent hover:bg-white/5 transition-colors text-[#0077b5]">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                           <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                     </button>
                  </div>

                  <div className="text-center mt-auto">
                     <p className="text-zinc-500 text-[13px] tracking-wide" style={{ fontFamily: "'Satisfy', cursive" }}>
                        Already have an account?{" "}
                        <Link to="/login" className="text-white hover:text-zinc-300 transition-colors ml-1 font-semibold text-lg">
                           Sign In
                        </Link>
                     </p>
                  </div>

               </form>
            </div>

            {/* ── Right Side: Text & Branding ── */}
            <div className="hidden lg:flex flex-col items-center justify-center flex-1 ml-10 xl:ml-20 text-white select-none">
               <h1 className="text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem] font-normal text-center leading-tight tracking-wide" style={{ fontFamily: "'Satisfy', cursive" }}>
                  Ai Based Intelligence <span className="text-red-500">Code Review</span> System
               </h1>
               
               <div className="flex flex-col items-center mt-12 mb-8">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="h-[1px] w-12 bg-zinc-700" />
                     <span className="text-zinc-500 text-[10px] sm:text-xs uppercase tracking-[0.4em] font-semibold">FUTURES</span>
                     <div className="h-[1px] w-12 bg-zinc-700" />
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-white text-lg lg:text-xl font-medium tracking-wide">
                     <span>Real AI</span>
                     <span>Code Review System</span>
                     <span>AI Teacher</span>
                     <span>Career Partner</span>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
}

interface MaterialInputProps {
   id: string;
   label: string;
   value: string;
   onChange: (val: string) => void;
   type?: string;
   required?: boolean;
   showToggle?: boolean;
   isToggled?: boolean;
   onToggle?: () => void;
}

function MaterialInput({ id, label, value, onChange, type = "text", required = false, showToggle = false, isToggled = false, onToggle }: MaterialInputProps) {
   return (
      <div className="relative">
         <input
            type={type}
            id={id}
            required={required}
            placeholder=" "
            className={`peer w-full h-10 bg-transparent border-b border-white/10 outline-none text-white text-sm py-2 transition-all duration-200 focus:border-white/40 ${showToggle ? 'pr-8' : ''}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
         />
         <label
            htmlFor={id}
            className="absolute left-0 top-2 text-zinc-600 text-[13px] font-medium transition-all duration-200 pointer-events-none origin-left
                       peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-white/60
                       peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-white/60"
         >
            {label}
         </label>
         {showToggle && onToggle && (
            <button
               type="button"
               onClick={onToggle}
               className="absolute right-0 top-3 text-zinc-600 hover:text-white transition-colors"
            >
               {isToggled ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
         )}
      </div>
   );
}
