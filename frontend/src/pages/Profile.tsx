import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Terminal,
   Flame,
   Globe,
   Github,
   Linkedin,
   TrendingUp,
   CheckCircle,
   Award,
   Calendar,
   Camera,
   Clock,
   X,
   Upload,
   ZoomIn,
   ZoomOut,
   RefreshCw,
   Save,
   Crop as CropIcon,
   User as UserIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Cropper from "react-easy-crop";
import type { Area as CropArea } from "react-easy-crop";

// ── Canvas helper: extract cropped pixels ─────────────────────────────────────
async function getCroppedImg(imageSrc: string, pixelCrop: CropArea): Promise<string> {
   const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", reject);
      img.src = imageSrc;
   });

   // Target size for profile photo (downsampling to prevent large base64)
   const targetSize = 128;
   const canvas = document.createElement("canvas");
   canvas.width = targetSize;
   canvas.height = targetSize;
   const ctx = canvas.getContext("2d")!;

   // High quality scaling
   ctx.imageSmoothingQuality = 'high';

   ctx.drawImage(
      image,
      pixelCrop.x, pixelCrop.y,
      pixelCrop.width, pixelCrop.height,
      0, 0,
      targetSize, targetSize,
   );
   
   // Efficient profile photo size (typically ~10-15KB)
   return canvas.toDataURL("image/jpeg", 0.75);
}

export function Profile() {
   const { user, updateProfile } = useAuth();
   const [rawSrc, setRawSrc] = useState<string | null>(null);
   const [crop, setCrop] = useState({ x: 0, y: 0 });
   const [zoom, setZoom] = useState(1);
   const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
   const [isUpdating, setIsUpdating] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);

   // Stats reset to 0 as requested
   const solvedStats = [
      { label: 'Easy', solved: 0, total: 820, color: 'text-emerald-500', bg: 'bg-emerald-500' },
      { label: 'Medium', solved: 0, total: 1640, color: 'text-amber-500', bg: 'bg-amber-500' },
      { label: 'Hard', solved: 0, total: 710, color: 'text-rose-500', bg: 'bg-rose-500' },
   ];

   const gridCells = Array.from({ length: 52 * 7 });
   const intensities = ['', 'bg-orange-500/20', 'bg-orange-500/40', 'bg-orange-500/70', 'bg-orange-500'];

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = () => setRawSrc(reader.result as string);
         reader.readAsDataURL(file);
      }
   };

   const handleCropComplete = useCallback((_: CropArea, px: CropArea) => {
      setCroppedAreaPixels(px);
   }, []);

   const applyCrop = async () => {
      if (!rawSrc || !croppedAreaPixels) return;
      setIsUpdating(true);
      try {
         const croppedBase64 = await getCroppedImg(rawSrc, croppedAreaPixels);
         await updateProfile({ photo: croppedBase64 });
         setRawSrc(null);
         // SUCCESS FEEDBACK
         alert("Profile photo updated successfully!");
      } catch (error: any) {
         console.error("Failed to update profile photo:", error);
         const detail = error.response?.data?.detail 
            ? (typeof error.response.data.detail === 'string' ? error.response.data.detail : JSON.stringify(error.response.data.detail))
            : (error.message || "Connection refused");
         
         alert(`Database sync failed: ${detail}. The image might be too large for the current server configuration.`);
      } finally {
         setIsUpdating(false);
      }
   };

   return (
      <div className="min-h-screen bg-white text-slate-900 font-sans">
         {/* Crop Modal */}
         <AnimatePresence>
            {rawSrc && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl"
                  >
                     <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                        <h2 className="text-sm font-black uppercase tracking-widest text-black">Crop Profile Photo</h2>
                        <button onClick={() => setRawSrc(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                           <X size={20} />
                        </button>
                     </div>

                     <div className="relative h-80 bg-zinc-900">
                        <Cropper
                           image={rawSrc}
                           crop={crop}
                           zoom={zoom}
                           aspect={1}
                           cropShape="round"
                           onCropChange={setCrop}
                           onZoomChange={setZoom}
                           onCropComplete={handleCropComplete}
                        />
                     </div>

                     <div className="p-8 space-y-8">
                        <div className="flex items-center gap-4">
                           <ZoomOut size={16} className="text-zinc-400" />
                           <input
                              type="range"
                              value={zoom}
                              min={1}
                              max={3}
                              step={0.1}
                              onChange={(e) => setZoom(Number(e.target.value))}
                              className="flex-1 accent-black h-1 rounded-full appearance-none bg-zinc-100"
                           />
                           <ZoomIn size={16} className="text-zinc-400" />
                        </div>

                        <div className="flex gap-4">
                           <button
                              onClick={() => setRawSrc(null)}
                              className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                           >
                              Cancel
                           </button>
                           <button
                              onClick={applyCrop}
                              disabled={isUpdating}
                              className="flex-1 py-4 bg-black text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
                           >
                              {isUpdating ? 'Uploading...' : 'Save Photo'}
                           </button>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">

               {/* Left Sidebar */}
               <aside className="w-full lg:w-80 flex flex-col gap-6">
                  <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                  >
                     <div className="flex flex-col items-center text-center">
                        <div
                           className="relative group cursor-pointer mb-6"
                           onClick={() => fileInputRef.current?.click()}
                        >
                           <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-orange-500/10 p-1">
                              <img
                                 src={user?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=f3f4f6&color=000&bold=true`}
                                 alt="Profile"
                                 className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                              />
                           </div>
                           <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="text-white w-8 h-8" />
                           </div>
                           <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                           />
                        </div>

                        <h1 className="text-2xl font-black text-black tracking-tight">{user?.full_name || 'Saivignesh 1'}</h1>
                        <p className="text-slate-400 font-medium text-sm">@{user?.username || 'saivignesh475@'}</p>

                        <div className="mt-8 flex flex-col gap-4 w-full">
                           <div className="flex justify-between items-center py-3 border-b border-slate-50">
                              <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Global Rank</span>
                              <span className="font-black text-black">unranked</span>
                           </div>
                           <div className="flex justify-between items-center py-3 border-b border-slate-50">
                              <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Points</span>
                              <span className="font-black text-black">0</span>
                           </div>
                        </div>

                        <button
                           onClick={() => fileInputRef.current?.click()}
                           className="mt-8 w-full py-3 bg-black text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                        >
                           Update Photo
                        </button>
                        <button
                           onClick={() => window.open(`${import.meta.env.VITE_API_URL}/reporting/weekly-report`, '_blank')}
                           className="mt-3 w-full py-3 bg-white text-black border border-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                        >
                           <Calendar className="w-4 h-4" /> Weekly Report (PDF)
                        </button>
                     </div>
                  </motion.div>

                  {/* Social Links */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Connectivity</h3>
                     <div className="flex flex-col gap-4">
                        {[
                           { icon: Globe, label: 'website.io', href: '#' },
                           { icon: Github, label: 'github.com', href: '#' },
                           { icon: Linkedin, label: 'linkedin.com', href: '#' }
                        ].map((social, idx) => (
                           <a key={idx} href={social.href} className="flex items-center gap-4 text-sm font-bold text-slate-600 hover:text-black transition-colors group">
                              <social.icon className="w-4 h-4 text-slate-300 group-hover:text-black" />
                              {social.label}
                           </a>
                        ))}
                     </div>
                  </div>
               </aside>

               {/* Right Content */}
               <div className="flex-1 flex flex-col gap-8">

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                     >
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-8">Performance Reset</h3>
                        <div className="flex flex-col sm:flex-row items-center gap-10">
                           <div className="relative w-36 h-36 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90">
                                 <circle className="text-slate-50" cx="72" cy="72" r="64" fill="transparent" stroke="currentColor" strokeWidth="12" />
                                 <circle className="text-orange-500" cx="72" cy="72" r="64" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="402" strokeDashoffset="402" strokeLinecap="round" />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                 <span className="text-4xl font-black text-black leading-none">0</span>
                                 <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Total</span>
                              </div>
                           </div>

                           <div className="flex-1 w-full space-y-6">
                              {solvedStats.map(stat => (
                                 <div key={stat.label} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                       <span className={`text-[10px] font-black uppercase tracking-widest ${stat.color}`}>{stat.label}</span>
                                       <span className="text-xs font-black text-black">0 <span className="text-slate-300">/ {stat.total}</span></span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                       <div className="bg-zinc-200 h-full w-0" />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </motion.div>

                     {/* Detail Stats */}
                     <div className="grid grid-cols-2 gap-4">
                        {[
                           { label: 'Max Streak', value: `${user?.streak_count || 0} Days`, icon: Flame, color: 'text-orange-500' },
                           { label: 'Rating', value: '0', icon: TrendingUp, color: 'text-blue-500' },
                           { label: 'Accuracy', value: '0%', icon: CheckCircle, color: 'text-emerald-500' },
                           { label: 'Ranking', value: 'N/A', icon: Award, color: 'text-purple-500' }
                        ].map((stat, i) => (
                           <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between hover:bg-white transition-all group"
                           >
                              <div className="flex justify-between items-start">
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
                                 <stat.icon className={`w-4 h-4 ${stat.color}`} />
                              </div>
                              <span className="text-xl font-black text-black mt-4">{stat.value}</span>
                           </motion.div>
                        ))}
                     </div>
                  </div>



                  {/* Heatmap */}
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                  >
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <h3 className="text-sm font-black uppercase tracking-[0.1em] text-black">No submissions recorded yet</h3>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-300">
                           <span>LESS</span>
                           <div className="flex gap-1">
                              {intensities.map((bg, idx) => (
                                 <div key={idx} className={`w-3 h-3 rounded-sm ${bg || 'bg-slate-100'}`} />
                              ))}
                           </div>
                           <span>MORE</span>
                        </div>
                     </div>

                     <div className="overflow-x-auto no-scrollbar opacity-30">
                        <div className="flex gap-1">
                           <div className="grid grid-flow-col grid-rows-7 gap-1">
                              {gridCells.map((_, i) => (
                                 <div key={i} className="w-3 h-3 rounded-[2px] bg-slate-50" />
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </div>
         </main>
      </div>
   );
}
