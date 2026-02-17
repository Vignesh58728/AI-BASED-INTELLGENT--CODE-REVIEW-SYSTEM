import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { BrandIcon } from "@/components/ui/BrandIcon"

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
   const navigate = useNavigate();
   const { login } = useAuth();
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (password !== confirmPassword) {
         alert("Passwords do not match");
         return;
      }
      setIsLoading(true);
      // Simulate register
      setTimeout(() => {
         login({
            id: '2',
            name,
            email,
            role,
            token: 'dummy-jwt-token',
            metadata: { username, phone, college, github }
         });
         navigate('/dashboard');
         setIsLoading(false);
      }, 1000);
   };

   return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-[#c9d6ff] bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] overflow-y-auto relative font-['Montserrat',sans-serif]">

         <Card className="w-full max-w-2xl bg-white border-none shadow-[0_5px_15px_rgba(0,0,0,0.35)] relative z-10 rounded-[30px] mx-4 overflow-hidden">
            <CardHeader className="space-y-1 pb-2">
               <div className="mb-4 text-center flex flex-col items-center">
                  <BrandIcon size={70} className="mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]" dark={false} />
                  <h1 className="text-2xl font-bold text-black tracking-[0.2em] uppercase" style={{ fontFamily: "'Syncopate', sans-serif" }}>
                     Aiviso <span className="text-black">AI</span>
                  </h1>
               </div>
               <CardTitle className="text-3xl font-bold text-center uppercase tracking-tighter text-[#333]">Create Account</CardTitle>

               {/* Social Icons Section from Template */}
               <div className="flex justify-center gap-3 py-4">
                  <a href="#" className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-colors"><i className="fa-brands fa-google"></i></a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-colors"><i className="fa-brands fa-facebook-f"></i></a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-colors"><i className="fa-brands fa-github"></i></a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-colors"><i className="fa-brands fa-linkedin-in"></i></a>
               </div>

               <CardDescription className="text-center text-[12px] text-neutral-500 uppercase tracking-wider font-medium">
                  or use your email for registration
               </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
               <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <Label htmlFor="name" className="text-black font-semibold text-xs ml-1">Full Name</Label>
                        <Input
                           id="name"
                           type="text"
                           placeholder="Name"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           required
                           className="bg-[#eee] border-none text-black placeholder:text-neutral-400 focus:ring-2 focus:ring-black/5 h-10 rounded-lg"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label htmlFor="username" className="text-black font-semibold text-xs ml-1">Username</Label>
                        <Input
                           id="username"
                           type="text"
                           placeholder="Username"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           required
                           className="bg-[#eee] border-none text-black placeholder:text-neutral-400 focus:ring-2 focus:ring-black/5 h-10 rounded-lg"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label htmlFor="email" className="text-black font-semibold text-xs ml-1">Email Address</Label>
                        <Input
                           id="email"
                           type="email"
                           placeholder="Email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                           className="bg-[#eee] border-none text-black placeholder:text-neutral-400 focus:ring-2 focus:ring-black/5 h-10 rounded-lg"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label htmlFor="phone" className="text-black font-semibold text-xs ml-1">Phone Number</Label>
                        <Input
                           id="phone"
                           type="tel"
                           placeholder="Phone"
                           value={phone}
                           onChange={(e) => setPhone(e.target.value)}
                           className="bg-[#eee] border-none text-black placeholder:text-neutral-400 focus:ring-2 focus:ring-black/5 h-10 rounded-lg"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label htmlFor="college" className="text-black font-semibold text-xs ml-1">College / Organization</Label>
                        <Input
                           id="college"
                           type="text"
                           placeholder="Organization"
                           value={college}
                           onChange={(e) => setCollege(e.target.value)}
                           className="bg-[#eee] border-none text-black placeholder:text-neutral-400 focus:ring-2 focus:ring-black/5 h-10 rounded-lg"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label htmlFor="role" className="text-black font-semibold text-xs ml-1">Primary Role</Label>
                        <select
                           id="role"
                           value={role}
                           onChange={(e) => setRole(e.target.value)}
                           className="w-full h-10 px-3 rounded-lg bg-[#eee] border-none text-black focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                        >
                           <option value="student">Student</option>
                           <option value="professional">Professional</option>
                           <option value="other">Other</option>
                        </select>
                     </div>
                     <div className="space-y-1 md:col-span-2">
                        <Label htmlFor="github" className="text-black font-semibold text-xs ml-1">GitHub Profile URL</Label>
                        <Input
                           id="github"
                           type="url"
                           placeholder="GitHub URL"
                           value={github}
                           onChange={(e) => setGithub(e.target.value)}
                           className="bg-[#eee] border-none text-black placeholder:text-neutral-400 focus:ring-2 focus:ring-black/5 h-10 rounded-lg"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label htmlFor="password" title="Password" className="text-black font-semibold text-xs ml-1">Password</Label>
                        <Input
                           id="password"
                           type="password"
                           placeholder="Password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                           className="bg-[#eee] border-none text-black focus:ring-2 focus:ring-black/5 h-10 rounded-lg"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label htmlFor="confirm-password" title="Confirm Password" className="text-black font-semibold text-xs ml-1">Confirm Password</Label>
                        <Input
                           id="confirm-password"
                           type="password"
                           placeholder="Confirm"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           required
                           className="bg-[#eee] border-none text-black focus:ring-2 focus:ring-black/5 h-10 rounded-lg"
                        />
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="flex flex-col gap-4 mt-6 pb-10">
                  <Button className="w-full bg-[#512da8] bg-gradient-to-r from-[#5c6bc0] to-[#512da8] text-white font-bold h-12 rounded-xl tracking-[1px] uppercase text-xs shadow-lg transition-all active:scale-[0.98] border-none" type="submit" disabled={isLoading}>
                     {isLoading ? "Signing Up..." : "Sign Up"}
                  </Button>
                  <div className="text-center text-sm text-[#333]">
                     Already joined?{" "}
                     <Link to="/login" className="font-bold text-[#512da8] hover:underline ml-1">
                        Sign In
                     </Link>
                  </div>
               </CardFooter>
            </form>
         </Card>

         {/* Background Decoration */}
         <div className="absolute bottom-6 w-full text-center z-0">
            <p className="text-black/20 text-[10px] tracking-[0.4em] font-light uppercase select-none">
               Aiviso AI Security Protocol
            </p>
         </div>
      </div>
   )
}
