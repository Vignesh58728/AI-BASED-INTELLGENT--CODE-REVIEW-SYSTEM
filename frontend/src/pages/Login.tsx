import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { GoogleLogin } from "@react-oauth/google";
import api from "@/services/api";
import { notificationService } from "@/services/notificationService";

export function Login() {
   const [usernameOrEmail, setUsernameOrEmail] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const { login, isAuthenticated } = useAuth();
   const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const validateForm = () => {
      if (!usernameOrEmail) {
         setError("Please enter your email or username");
         return false;
      }
      if (password.length < 6) {
         setError("Password must be at least 6 characters");
         return false;
      }
      setError(null);
      return true;
   };

   useEffect(() => {
      if (isAuthenticated) {
         navigate('/explore');
      }
   }, [isAuthenticated, navigate]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;
      setIsLoading(true);
      setError(null);

      try {
         // Real login call
         const response = await api.post('/auth/login', new URLSearchParams({
            username: usernameOrEmail,
            password: password
         }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
         });

         const { access_token } = response.data;
         const payload = JSON.parse(atob(access_token.split('.')[1]));

         login({
            id: payload.sub,
            name: payload.name || payload.email || usernameOrEmail,
            email: payload.email || usernameOrEmail,
            role: payload.role || 'student',
            token: access_token,
            username: payload.username,
            photo: payload.photo
         });

         notificationService.triggerLoginEvent();
         navigate('/explore');
      } catch (err: any) {
         setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
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
               username: payload.username || guestUsername,
               photo: payload.photo
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
               // Even if registration fails (e.g. server down or already exists but login failed), 
               // we'll jump to the catch block and use Local Fallback.
               throw regErr;
            }
         }

         notificationService.triggerLoginEvent();
         navigate('/explore');
      } catch (err: any) {
         console.warn("Guest login server-side failed, using local fallback mode:", err);

         // RESILIENT FALLBACK: Grant local guest session anyway
         // This ensures the user "ulla poganum" (enters) no matter what.
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

         notificationService.triggerLoginEvent();
         navigate('/explore');
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
         // Decode token for user info
         const payload = JSON.parse(atob(access_token.split('.')[1]));
         login({
            id: payload.sub,
            name: payload.name || payload.email,
            email: payload.email,
            role: payload.role || 'student',
            token: access_token,
            username: payload.username,
            photo: payload.photo
         });
         notificationService.triggerLoginEvent();
         navigate('/explore');
      } catch (err: any) {
         console.error("Google login error:", err);
         const errorMessage = err.response?.data?.detail || "Google login failed. Please try again.";
         setError(errorMessage);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-white">
         <div className="w-full max-w-[550px] bg-white rounded-2xl p-16 shadow-[0_10px_50px_rgba(0,0,0,0.06)] relative z-10 m-4 overflow-hidden border border-neutral-100 transition-all duration-500">

            <HeaderSection />

            <form onSubmit={handleSubmit} className="flex flex-col space-y-10" noValidate>
               <h2 className="text-2xl font-normal text-black text-center tracking-tight">Sign in</h2>

               {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-md animate-in fade-in slide-in-from-top-2 duration-300">
                     {error}
                  </div>
               )}

               <div className="space-y-6">
                  {/* Material Input: Email/Username */}
                  <div className="group relative">
                     <div className="relative">
                        <input
                           type="text"
                           id="usernameOrEmail"
                           required
                           placeholder=" "
                           className="peer w-full h-12 bg-transparent border-b-2 border-neutral-200 outline-none text-black text-base py-2 transition-all duration-200 focus:border-primary"
                           value={usernameOrEmail}
                           onChange={(e) => setUsernameOrEmail(e.target.value)}
                        />
                        <label
                           htmlFor="usernameOrEmail"
                           className="absolute left-0 top-3 text-black text-base transition-all duration-200 pointer-events-none origin-left 
                                      peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-black
                                      peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-black"
                        >
                           Email or Username
                        </label>
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-focus-within:w-full"></div>
                     </div>
                  </div>

                  {/* Material Input: Password */}
                  <div className="group relative">
                     <div className="relative">
                        <input
                           type={showPassword ? "text" : "password"}
                           id="password"
                           required
                           placeholder=" "
                           className="peer w-full h-12 bg-transparent border-b-2 border-neutral-200 outline-none text-black text-base py-2 pr-10 transition-all duration-200 focus:border-primary"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                        />
                        <label
                           htmlFor="password"
                           className="absolute left-0 top-3 text-black text-base transition-all duration-200 pointer-events-none origin-left
                                      peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-black
                                      peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-black"
                        >
                           Password
                        </label>
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-0 top-3 text-neutral-400 hover:text-black transition-colors p-1 rounded-full hover:bg-neutral-50"
                           aria-label="Toggle password visibility"
                        >
                           {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>

                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-focus-within:w-full"></div>
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer group text-black">
                     <div className="relative w-4 h-4 rounded border-2 border-neutral-300 group-hover:border-primary overflow-hidden transition-colors">
                        <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="invisible peer-checked:visible absolute inset-0 bg-primary flex items-center justify-center p-0.5">
                           <svg className="text-white w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                              <path d="M20 6L9 17l-5-5" />
                           </svg>
                        </div>
                     </div>
                     <span>Stay signed in</span>
                  </label>
                  <Link to="/forgot-password" className="text-black font-medium uppercase tracking-wider text-[11px] hover:text-black/80 transition-colors">
                     Forgot password?
                  </Link>
               </div>

               <div className="space-y-4">
                  <button
                     type="submit"
                     disabled={isLoading}
                     className="relative w-full bg-black text-white font-bold h-12 rounded-md shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center group uppercase tracking-widest text-xs"
                  >
                     <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"></div>
                     {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : (
                        "SIGN IN"
                     )}
                  </button>

                  <div className="flex flex-col items-center">
                     <button
                        type="button"
                        onClick={handleGuestLogin}
                        disabled={isLoading}
                        className="text-black font-black uppercase tracking-[0.2em] text-[10px] py-3 px-6 border-2 border-black rounded-md hover:bg-black hover:text-white transition-all duration-300 w-full"
                     >
                        Enter as Guest
                     </button>
                  </div>
               </div>

               <div className="relative text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200"></div></div>
                  <span className="relative px-3 bg-white text-black text-xs uppercase tracking-widest font-medium">OR</span>
               </div>

               <div className="grid grid-cols-1 gap-3">
                  {/* Real Google OAuth button */}
                  <div className="w-full [&>div]:w-full [&>div>div]:w-full [&_iframe]:w-full">
                     <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google login failed. Please try again.')}
                        width="100%"
                        shape="rectangular"
                        size="large"
                        text="continue_with"
                        logo_alignment="left"
                     />
                  </div>
                  <SocialButton provider="github" />
               </div>

               <div className="text-center pt-4">
                  <p className="text-black text-sm">
                     Don't have an account?{" "}
                     <Link to="/register" className="text-black font-black uppercase tracking-wider text-xs border-b-2 border-black pb-0.5 hover:text-black/70 hover:border-black/70 transition-all ml-1">
                        Create account
                     </Link>
                  </p>
               </div>
            </form>
         </div>
      </div>
   );
}

function HeaderSection() {
   return (
      <div className="flex flex-col items-center mb-10">
         <h1 className="text-xl md:text-2xl font-bold text-black tracking-[0.2em] uppercase text-center" style={{ fontFamily: "'Syncopate', sans-serif" }}>
            MIND ARC
         </h1>
      </div>
   );
}

function SocialButton({ provider, onGoogleSuccess }: { provider: 'google' | 'github', onGoogleSuccess?: (cred: any) => void }) {
   const isGoogle = provider === 'google';

   if (isGoogle && onGoogleSuccess) {
      return (
         <div className="w-full">
            <div
               style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  width: '100%',
                  height: '48px',
                  border: '1px solid #d4d4d4',
                  borderRadius: '6px',
                  background: 'white',
                  color: '#404040',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
               }}
               className="hover:bg-neutral-50 hover:border-neutral-400"
            >
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
               </svg>
               <span>Continue with Google</span>
            </div>
            {/* Real invisible GoogleLogin trigger */}
            <div className="absolute opacity-0 pointer-events-none">
               {/* GoogleLogin provides credential (id_token) via onSuccess */}
            </div>
         </div>
      );
   }

   return (
      <button
         type="button"
         className="flex items-center justify-center gap-3 w-full h-12 border border-neutral-300 rounded-md bg-white text-neutral-700 font-medium transition-all hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100 px-4"
      >
         <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.292 24 17.8 24 12.5 24 5.87 18.627.5 12 .5z" />
         </svg>
         <span className="text-sm font-semibold">Continue with GitHub</span>
      </button>
   );
}
