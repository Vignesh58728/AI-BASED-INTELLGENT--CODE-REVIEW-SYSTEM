import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { Mail, Shield, Calendar } from "lucide-react";

export function Profile() {
   const { user } = useAuth();

   return (
      <div className="min-h-screen bg-black text-white p-8 space-y-8">
         {/* Requested Dashboard Text */}
         <div className="border-l-4 border-primary pl-4 mb-10">
            <h1 className="text-4xl font-black tracking-tighter uppercase">Profile Dashboard</h1>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">User Identity & Analytics Center</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile Card */}
            <Card className="lg:col-span-1 bg-zinc-900/50 border-white/5 backdrop-blur-sm">
               <CardHeader className="text-center pb-2">
                  <div className="mx-auto h-24 w-24 rounded-2xl overflow-hidden border-2 border-primary/30 mb-4">
                     <img
                        src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=0D0D0D&color=fff&size=256`}
                        alt="Profile"
                        className="h-full w-full object-cover"
                     />
                  </div>
                  <CardTitle className="text-2xl font-bold">{user?.name || 'User'}</CardTitle>
                  <p className="text-sm text-zinc-500">{user?.role || 'Developer'}</p>
               </CardHeader>
               <CardContent className="space-y-4 pt-4 text-white">
                  <div className="flex items-center gap-3 text-sm">
                     <Mail className="h-4 w-4 text-primary" />
                     <span>{user?.email || 'user@example.com'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                     <Shield className="h-4 w-4 text-primary" />
                     <span>Account Level: Silver</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                     <Calendar className="h-4 w-4 text-primary" />
                     <span>Joined: Jan 2026</span>
                  </div>
               </CardContent>
            </Card>

            {/* Placeholder for Stats/Insights that feel like "Dashboard" */}
            <div className="lg:col-span-2 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-zinc-900/50 border-white/5">
                     <CardContent className="pt-6">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Solved</div>
                        <div className="text-3xl font-black text-white">124</div>
                     </CardContent>
                  </Card>
                  <Card className="bg-zinc-900/50 border-white/5">
                     <CardContent className="pt-6">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Rank</div>
                        <div className="text-3xl font-black text-white">#420</div>
                     </CardContent>
                  </Card>
               </div>

               <Card className="bg-zinc-900/50 border-white/5 text-white">
                  <CardHeader>
                     <CardTitle>Recent Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-sm text-zinc-400">
                        Continue practicing at the **College Level** to improve your Data Structures score.
                        Your focus on Python is showing great results!
                     </p>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
