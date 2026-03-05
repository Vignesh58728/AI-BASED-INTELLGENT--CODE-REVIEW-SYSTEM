import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
   RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
   LineChart, Line, CartesianGrid, Area, AreaChart,
} from "recharts";
import {
   Mail, Shield, Calendar, Trophy, Zap, Code2, Target,
   TrendingUp, Star, Award, BookOpen, Clock, Flame,
   ChevronRight, CheckCircle2, BarChart2, Activity,
   Pencil, RotateCcw, X, Save, AlertTriangle, User, FileText,
   Camera, Upload, Crop, ZoomIn, ZoomOut, RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
   const canvas = document.createElement("canvas");
   canvas.width = pixelCrop.width;
   canvas.height = pixelCrop.height;
   const ctx = canvas.getContext("2d")!;
   ctx.drawImage(
      image,
      pixelCrop.x, pixelCrop.y,
      pixelCrop.width, pixelCrop.height,
      0, 0,
      pixelCrop.width, pixelCrop.height,
   );
   return canvas.toDataURL("image/jpeg", 0.92);
}

// ── Mock Analytics Data ────────────────────────────────────────────────────────
const skillRadarData = [
   { subject: "Arrays", A: 88 },
   { subject: "Strings", A: 74 },
   { subject: "DP", A: 55 },
   { subject: "Graphs", A: 62 },
   { subject: "Trees", A: 79 },
   { subject: "Sorting", A: 91 },
];

const weeklyActivity = [
   { day: "Mon", problems: 4 },
   { day: "Tue", problems: 7 },
   { day: "Wed", problems: 2 },
   { day: "Thu", problems: 9 },
   { day: "Fri", problems: 5 },
   { day: "Sat", problems: 12 },
   { day: "Sun", problems: 6 },
];

const scoreHistory = [
   { month: "Sep", score: 420 },
   { month: "Oct", score: 510 },
   { month: "Nov", score: 480 },
   { month: "Dec", score: 620 },
   { month: "Jan", score: 730 },
   { month: "Feb", score: 810 },
];

const langStats = [
   { name: "Python", pct: 0 },
   { name: "JavaScript", pct: 0 },
   { name: "Java", pct: 0 },
   { name: "C++", pct: 0 },
];

const badges = [
   { icon: Flame, label: "7-Day Streak", color: "#f97316" },
   { icon: Trophy, label: "Top 10%", color: "#facc15" },
   { icon: Code2, label: "100 Problems", color: "#6366f1" },
   { icon: Star, label: "AI Reviewer", color: "#ec4899" },
   { icon: Zap, label: "Speed Coder", color: "#22d3ee" },
   { icon: Award, label: "First Review", color: "#a3e635" },
];

const defaultActivity = [
   { title: "Binary Search on Rotated Array", difficulty: "Hard", status: "Solved", time: "2h ago", score: 92 },
   { title: "Merge K Sorted Lists", difficulty: "Medium", status: "Reviewed", time: "5h ago", score: 78 },
   { title: "Coin Change DP", difficulty: "Medium", status: "Solved", time: "1d ago", score: 85 },
   { title: "Trie Autocomplete", difficulty: "Hard", status: "Attempted", time: "2d ago", score: 60 },
   { title: "Graph BFS/DFS", difficulty: "Easy", status: "Solved", time: "3d ago", score: 97 },
];

const difficultyColors: Record<string, string> = {
   Easy: "text-emerald-400 bg-emerald-400/10",
   Medium: "text-amber-400 bg-amber-400/10",
   Hard: "text-rose-400 bg-rose-400/10",
};
const statusColors: Record<string, string> = {
   Solved: "text-emerald-400",
   Reviewed: "text-violet-400",
   Attempted: "text-amber-400",
};

// ── Default stats (used for reset) ────────────────────────────────────────────
const defaultStats = { solved: 124, acceptance: 74, rank: 420, streak: 7 };

// ── Reusable Stat Card ─────────────────────────────────────────────────────────
function StatCard({
   icon: Icon, label, value, sub, color = "#6366f1",
}: {
   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
   label: string; value: string | number; sub?: string; color?: string;
}) {
   return (
      <motion.div
         initial={{ opacity: 0, y: 16 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4 }}
         className="relative rounded-2xl p-0 h-full overflow-hidden bg-zinc-900/60 border border-white/5 hover:border-white/10 transition-all p-5 flex flex-col gap-3"
      >
         <div className="flex items-center justify-between relative z-10 block w-full">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
               style={{ background: `${color}22` }}>
               <Icon className="w-4 h-4" style={{ color }} />
            </div>
         </div>
         <div className="text-4xl font-black text-white tracking-tight relative z-10">{value}</div>
         {sub && <div className="text-xs text-zinc-500 relative z-10">{sub}</div>}
         <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20 z-0 pointer-events-none"
            style={{ background: color }} />
      </motion.div>
   );
}

// ── Section Wrapper ────────────────────────────────────────────────────────────
function Section({
   title, icon: Icon, children,
}: {
   title: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; children: React.ReactNode;
}) {
   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="rounded-2xl p-6 h-full bg-zinc-900/60 border border-white/5 overflow-hidden"
      >
         <div className="relative z-10 h-full flex flex-col w-full">
            <div className="flex items-center gap-2 mb-5">
               <Icon className="w-4 h-4 text-violet-400" />
               <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300">{title}</h2>
            </div>
            {children}
         </div>
      </motion.div>
   );
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
   if (!active || !payload?.length) return null;
   return (
      <div className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white shadow-xl">
         <div className="text-zinc-400 mb-1">{label}</div>
         <div className="font-bold">{payload[0].value}</div>
      </div>
   );
}

// ── Crop Modal ────────────────────────────────────────────────────────────────
function CropModal({
   open, imageSrc, onClose, onCropped,
}: {
   open: boolean;
   imageSrc: string;
   onClose: () => void;
   onCropped: (b64: string) => void;
}) {
   const [crop, setCrop] = useState({ x: 0, y: 0 });
   const [zoom, setZoom] = useState(1);
   const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
   const [applying, setApplying] = useState(false);

   const handleApply = async () => {
      if (!croppedAreaPixels) return;
      setApplying(true);
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropped(cropped);
      setApplying(false);
      onClose();
   };

   return (
      <AnimatePresence>
         {open && (
            <>
               <motion.div
                  key="crop-backdrop"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
               />
               <motion.div
                  key="crop-modal"
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }}
                  transition={{ type: "spring", damping: 22, stiffness: 280 }}
                  className="fixed inset-0 z-[70] flex items-center justify-center p-4"
               >
                  <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                     {/* Header */}
                     <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                           <div className="w-7 h-7 rounded-lg bg-violet-600/20 flex items-center justify-center">
                              <Crop className="w-3.5 h-3.5 text-violet-400" />
                           </div>
                           <h2 className="text-sm font-bold text-white">Crop Photo</h2>
                        </div>
                        <button onClick={onClose}
                           className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                           <X className="w-4 h-4 text-zinc-400" />
                        </button>
                     </div>

                     {/* Crop area */}
                     <div className="relative bg-zinc-950" style={{ height: 300 }}>
                        <Cropper
                           image={imageSrc}
                           crop={crop}
                           zoom={zoom}
                           aspect={1}
                           cropShape="round"
                           showGrid={false}
                           onCropChange={setCrop}
                           onZoomChange={setZoom}
                           onCropComplete={(_: CropArea, px: CropArea) => setCroppedAreaPixels(px)}
                           style={{
                              containerStyle: { background: "#09090b" },
                              cropAreaStyle: {
                                 border: "2px solid #7c3aed",
                                 boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)",
                              },
                           }}
                        />
                     </div>

                     {/* Zoom slider */}
                     <div className="flex items-center gap-3 px-5 py-4 border-t border-white/5 bg-zinc-900/60">
                        <ZoomOut className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                        <input
                           type="range" min={1} max={3} step={0.05}
                           value={zoom}
                           onChange={e => setZoom(Number(e.target.value))}
                           className="flex-1 h-1.5 rounded-full accent-violet-500 cursor-pointer"
                        />
                        <ZoomIn className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                        <button
                           onClick={() => { setCrop({ x: 0, y: 0 }); setZoom(1); }}
                           className="ml-1 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                           title="Reset"
                        >
                           <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                        </button>
                     </div>

                     {/* Actions */}
                     <div className="flex gap-3 px-5 pb-5">
                        <button
                           onClick={onClose}
                           className="flex-1 py-2.5 text-sm font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={handleApply}
                           disabled={applying}
                           className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold
                                      text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-60
                                      rounded-xl shadow-lg shadow-violet-900/40 transition-all"
                        >
                           {applying ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                           ) : (
                              <Crop className="w-3.5 h-3.5" />
                           )}
                           Apply Crop
                        </button>
                     </div>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
   );
}

// ── Photo Upload Zone (routes through CropModal) ──────────────────────────────
function PhotoUploadZone({
   photo, onPhoto,
}: {
   photo: string | null;
   onPhoto: (b64: string) => void;
}) {
   const inputRef = useRef<HTMLInputElement>(null);
   const [dragging, setDragging] = useState(false);
   const [rawSrc, setRawSrc] = useState<string | null>(null);  // image waiting to be cropped

   const openCrop = useCallback((file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = e => {
         const result = e.target?.result as string;
         if (result) setRawSrc(result);   // opens CropModal
      };
      reader.readAsDataURL(file);
   }, []);

   const onDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) openCrop(file);
   }, [openCrop]);

   return (
      <>
         {/* Crop modal – shown when a raw image is loaded */}
         <CropModal
            open={!!rawSrc}
            imageSrc={rawSrc || ""}
            onClose={() => setRawSrc(null)}
            onCropped={b64 => { onPhoto(b64); setRawSrc(null); }}
         />

         <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
               cursor-pointer transition-all duration-200 overflow-hidden
               ${dragging
                  ? "border-violet-400 bg-violet-500/10"
                  : "border-white/10 bg-zinc-800/40 hover:border-violet-500/50 hover:bg-violet-500/5"
               }`}
            style={{ height: 160 }}
         >
            <input
               ref={inputRef}
               type="file"
               accept="image/*"
               className="hidden"
               onChange={e => { const f = e.target.files?.[0]; if (f) openCrop(f); e.target.value = ""; }}
            />

            {photo ? (
               <>
                  <img src={photo} alt="profile" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                     <Camera className="w-6 h-6 text-white mb-1" />
                     <span className="text-xs font-semibold text-white">Change &amp; Crop</span>
                  </div>
               </>
            ) : (
               <>
                  <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center mb-3">
                     <Upload className="w-5 h-5 text-violet-400" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-300">Upload &amp; Crop Photo</p>
                  <p className="text-xs text-zinc-500 mt-1">Drag &amp; drop or click to browse</p>
                  <p className="text-xs text-zinc-600 mt-0.5">JPG, PNG, WebP · Max 5 MB</p>
               </>
            )}
         </div>
      </>
   );
}

// ── Edit Profile Modal ─────────────────────────────────────────────────────────
function EditProfileModal({
   open, onClose, profile, photo, onSave, onPhotoSave,
}: {
   open: boolean;
   onClose: () => void;
   photo: string | null;
   profile: { name: string; bio: string; role: string; lang: string };
   onSave: (p: { name: string; bio: string; role: string; lang: string }) => Promise<void>;
   onPhotoSave: (b64: string) => Promise<void>;
}) {
   const [form, setForm] = useState(profile);
   const [localPhoto, setLocalPhoto] = useState<string | null>(photo);
   const [saving, setSaving] = useState(false);

   const inputBase =
      "w-full bg-zinc-800/80 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 transition-colors";

   return (
      <AnimatePresence>
         {open && (
            <>
               {/* Backdrop */}
               <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
               />
               {/* Modal */}
               <motion.div
                  key="modal"
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }}
                  transition={{ type: "spring", damping: 22, stiffness: 280 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
               >
                  <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                     {/* Header */}
                     <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/90">
                        <div className="flex items-center gap-2">
                           <div className="w-7 h-7 rounded-lg bg-violet-600/20 flex items-center justify-center">
                              <Pencil className="w-3.5 h-3.5 text-violet-400" />
                           </div>
                           <h2 className="text-sm font-bold text-white">Edit Profile</h2>
                        </div>
                        <button onClick={onClose}
                           className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                           <X className="w-4 h-4 text-zinc-400" />
                        </button>
                     </div>

                     {/* Body */}
                     <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
                        {/* ── Photo Upload ── */}
                        <div className="space-y-1.5">
                           <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                              <Camera className="w-3 h-3" /> Profile Photo
                           </label>
                           <PhotoUploadZone photo={localPhoto} onPhoto={setLocalPhoto} />
                           {localPhoto && (
                              <button
                                 onClick={() => setLocalPhoto(null)}
                                 className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors mt-1"
                              >
                                 <X className="w-3 h-3" /> Remove photo
                              </button>
                           )}
                        </div>

                        {/* Avatar preview row */}
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-zinc-800/40 border border-white/5">
                           <div className="w-10 h-10 rounded-xl overflow-hidden border border-violet-500/30 flex-shrink-0">
                              <img
                                 src={localPhoto ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || "User")}&background=1a1028&color=c4b5fd&size=80&bold=true`
                                 }
                                 alt="avatar preview"
                                 className="w-full h-full object-cover"
                              />
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-white">{form.name || "Your Name"}</p>
                              <p className="text-xs text-zinc-500">
                                 {localPhoto ? "Custom photo selected" : "Auto-generated from name"}
                              </p>
                           </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-1.5">
                           <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                              <User className="w-3 h-3" /> Display Name
                           </label>
                           <input
                              className={inputBase}
                              placeholder="Your name"
                              value={form.name}
                              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                           />
                        </div>

                        {/* Bio */}
                        <div className="space-y-1.5">
                           <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                              <FileText className="w-3 h-3" /> Bio
                           </label>
                           <textarea
                              rows={2}
                              className={`${inputBase} resize-none`}
                              placeholder="Tell us about yourself…"
                              value={form.bio}
                              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                           />
                        </div>

                        {/* Role */}
                        <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-1.5">
                              <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                 <Shield className="w-3 h-3" /> Role
                              </label>
                              <select
                                 className={`${inputBase} cursor-pointer`}
                                 value={form.role}
                                 onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                              >
                                 {["Student", "Developer", "Researcher", "Educator", "Other"].map(r => (
                                    <option key={r} value={r} className="bg-zinc-900">{r}</option>
                                 ))}
                              </select>
                           </div>
                           <div className="space-y-1.5">
                              <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                 <Code2 className="w-3 h-3" /> Preferred Lang
                              </label>
                              <select
                                 className={`${inputBase} cursor-pointer`}
                                 value={form.lang}
                                 onChange={e => setForm(f => ({ ...f, lang: e.target.value }))}
                              >
                                 {["Python", "JavaScript", "Java", "C++", "Go", "Rust"].map(l => (
                                    <option key={l} value={l} className="bg-zinc-900">{l}</option>
                                 ))}
                              </select>
                           </div>
                        </div>
                     </div>

                     {/* Footer */}
                     <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
                        <button
                           onClick={onClose}
                           disabled={saving}
                           className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           Cancel
                        </button>
                        <button
                           disabled={saving}
                           onClick={async () => {
                              setSaving(true);
                              try {
                                 await onSave(form);
                                 if (localPhoto && localPhoto !== photo) {
                                    await onPhotoSave(localPhoto);
                                 }
                                 onClose();
                              } finally {
                                 setSaving(false);
                              }
                           }}
                           className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-violet-600
                                      hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                           {saving ? "Saving..." : "Save Changes"}
                        </button>
                     </div>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
   );
}

// ── Reset Confirmation Modal ───────────────────────────────────────────────────
function ResetModal({
   open, onClose, onConfirm,
}: {
   open: boolean; onClose: () => void; onConfirm: () => void;
}) {
   return (
      <AnimatePresence>
         {open && (
            <>
               <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
               />
               <motion.div
                  key="modal"
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 20 }}
                  transition={{ type: "spring", damping: 22, stiffness: 280 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
               >
                  <div className="w-full max-w-sm bg-zinc-900 border border-rose-500/20 rounded-2xl shadow-2xl overflow-hidden">
                     {/* Icon */}
                     <div className="flex flex-col items-center px-6 pt-8 pb-4 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
                           <AlertTriangle className="w-7 h-7 text-rose-400" />
                        </div>
                        <h2 className="text-lg font-black text-white mb-2">Reset Progress?</h2>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                           This will clear all your analytics, streak, rank, and solved-problem data.
                           <br />
                           <span className="text-rose-400 font-semibold">This action cannot be undone.</span>
                        </p>
                     </div>

                     {/* Checklist of what will be reset */}
                     <div className="mx-6 mb-5 rounded-xl bg-zinc-800/50 border border-white/5 divide-y divide-white/5">
                        {["Problems Solved → 0", "Day Streak → 0", "Global Rank → unranked", "AI Review Scores → cleared"].map(item => (
                           <div key={item} className="flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-400">
                              <X className="w-3 h-3 text-rose-500 flex-shrink-0" />
                              {item}
                           </div>
                        ))}
                     </div>

                     {/* Actions */}
                     <div className="flex gap-3 px-6 pb-6">
                        <button
                           onClick={onClose}
                           className="flex-1 py-2.5 text-sm font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={() => { onConfirm(); onClose(); }}
                           className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold
                                       text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-900/40 transition-all"
                        >
                           <RotateCcw className="w-3.5 h-3.5" />
                           Yes, Reset
                        </button>
                     </div>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
   );
}

// ── Main Profile Component ─────────────────────────────────────────────────────
export function Profile() {
   const { user, updateProfile } = useAuth();

   // UI state
   const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "history">("overview");
   const [editOpen, setEditOpen] = useState(false);
   const [resetOpen, setResetOpen] = useState(false);

   // Editable profile fields (seeded from auth user)
   const [profileData, setProfileData] = useState({
      name: user?.full_name || user?.username || "User",
      bio: user?.bio || "",
      role: user?.role || "Developer",
      lang: user?.lang || "Python",
   });

   // Uploaded photo — from DB state, no longer localStorage
   const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(
      () => user?.photo || null
   );

   const handlePhotoSave = async (b64: string) => {
      try {
         await updateProfile({ photo: b64 });
         setUploadedPhoto(b64);
      } catch (error) {
         console.error("Failed to save photo", error);
      }
   };

   // Stats that can be reset
   const [stats, setStats] = useState(defaultStats);
   const [recentActivity, setRecentActivity] = useState(defaultActivity);

   const tabs = [
      { id: "overview", label: "Overview", icon: Activity },
      { id: "analytics", label: "Analytics", icon: BarChart2 },
      { id: "history", label: "History", icon: Clock },
   ] as const;

   // Save profile handler – syncs back to auth context via API
   const handleSave = async (updated: typeof profileData) => {
      try {
         await updateProfile({
            full_name: updated.name,
            bio: updated.bio,
            role: updated.role,
            lang: updated.lang
         });
         setProfileData(updated);
      } catch (error) {
         console.error("Failed to save profile", error);
      }
   };

   // Reset progress handler
   const handleReset = () => {
      setStats({ solved: 0, acceptance: 0, rank: 9999, streak: 0 });
      setRecentActivity([]);
   };

   return (
      <div className="min-h-screen bg-black text-white">

         {/* ── Modals ─────────────────────────────────────────────────────────── */}
         <EditProfileModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            profile={profileData}
            photo={uploadedPhoto}
            onSave={handleSave}
            onPhotoSave={handlePhotoSave}
         />
         <ResetModal
            open={resetOpen}
            onClose={() => setResetOpen(false)}
            onConfirm={handleReset}
         />

         {/* ── Hero Banner ─────────────────────────────────────────────────── */}
         <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-950 via-indigo-950 to-black" />
            <div className="absolute inset-0"
               style={{
                  backgroundImage: "linear-gradient(rgba(99,102,241,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.12) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
               }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
         </div>

         <div className="max-w-7xl mx-auto px-6 pb-16">
            {/* ── Profile Header ──────────────────────────────────────────────── */}
            <div className="relative -mt-16 flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
               {/* Avatar */}
               <div className="relative">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-violet-500/50 shadow-2xl shadow-violet-900/40">
                     <img
                        src={uploadedPhoto ||
                           `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=1a1028&color=c4b5fd&size=256&bold=true`
                        }
                        alt="Avatar"
                        className="w-full h-full object-cover"
                     />
                  </div>
                  {/* Camera overlay – quick re-upload */}
                  <button
                     onClick={() => setEditOpen(true)}
                     className="absolute bottom-1 right-1 w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center
                                shadow-lg hover:bg-violet-500 transition-all"
                  >
                     <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
               </div>

               <div className="flex-1">
                  <h1 className="text-3xl font-black tracking-tight">{profileData.name}</h1>
                  {profileData.bio && (
                     <p className="text-sm text-zinc-400 mt-1 max-w-md">{profileData.bio}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-zinc-400">
                     <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {user?.email || "user@example.com"}
                     </span>
                     <span className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-violet-400" />
                        {profileData.role}
                     </span>
                     <span className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                        {profileData.lang}
                     </span>
                     <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Joined Jan 2026
                     </span>
                  </div>
               </div>

               {/* Action buttons */}
               <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Edit Profile */}
                  <motion.button
                     whileHover={{ scale: 1.03 }}
                     whileTap={{ scale: 0.97 }}
                     onClick={() => setEditOpen(true)}
                     className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                                bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30 transition-all"
                  >
                     <Pencil className="w-4 h-4" />
                     Edit Profile
                  </motion.button>

                  {/* Reset / Restart */}
                  <motion.button
                     whileHover={{ scale: 1.03 }}
                     whileTap={{ scale: 0.97 }}
                     onClick={() => setResetOpen(true)}
                     className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                                bg-zinc-800 hover:bg-zinc-700 text-white border border-rose-500/20 hover:border-rose-500/40 transition-all"
                  >
                     <RotateCcw className="w-4 h-4 text-rose-400" />
                     Restart
                  </motion.button>

                  {/* Level badge */}
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                     <Trophy className="w-4 h-4 text-violet-400" />
                     <span className="text-sm font-bold text-violet-300">Silver</span>
                  </div>
               </div>
            </div>

            {/* ── Tab Navigation ──────────────────────────────────────────────── */}
            <div className="flex items-center gap-1 p-1 bg-zinc-900/80 border border-white/5 rounded-xl mb-8 w-fit">
               {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                     key={id}
                     onClick={() => setActiveTab(id)}
                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                        ${activeTab === id
                           ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                           : "text-zinc-400 hover:text-white hover:bg-white/5"
                        }`}
                  >
                     <Icon className="w-4 h-4" />
                     {label}
                  </button>
               ))}
            </div>

            {/* ── OVERVIEW TAB ──────────────────────────────────────────────────── */}
            {activeTab === "overview" && (
               <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <StatCard icon={CheckCircle2} label="Problems Solved" value={stats.solved} sub="+12 this week" color="#22c55e" />
                     <StatCard icon={Target} label="Acceptance Rate" value={`${stats.acceptance}%`} sub="Above average" color="#6366f1" />
                     <StatCard icon={Trophy} label="Global Rank" value={stats.rank === 9999 ? "—" : `#${stats.rank}`} sub="Top 8%" color="#facc15" />
                     <StatCard icon={Flame} label="Day Streak" value={stats.streak} sub="Best: 21 days" color="#f97316" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     {/* Skill Radar */}
                     <Section title="Skill Radar" icon={Activity}>
                        <ResponsiveContainer width="100%" height={260}>
                           <RadarChart data={skillRadarData} outerRadius={90}>
                              <PolarGrid stroke="rgba(255,255,255,0.06)" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 600 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                              <Radar name="Skills" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} strokeWidth={2} />
                           </RadarChart>
                        </ResponsiveContainer>
                     </Section>

                     {/* Language Breakdown */}
                     <Section title="Languages Used" icon={Code2}>
                        <div className="space-y-4 mt-2">
                           {langStats.map(({ name, pct }) => (
                              <div key={name}>
                                 <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span className="text-zinc-300">{name}</span>
                                    <span className="text-zinc-500">{pct}%</span>
                                 </div>
                                 <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                                    <motion.div
                                       initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                       transition={{ duration: 1, ease: "easeOut" }}
                                       className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
                                    />
                                 </div>
                              </div>
                           ))}
                        </div>
                        <div className="mt-6 pt-5 border-t border-white/5">
                           <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Difficulty Distribution</div>
                           <div className="flex gap-3">
                              {[
                                 { label: "Easy", count: 58, color: "bg-emerald-500" },
                                 { label: "Medium", count: 47, color: "bg-amber-500" },
                                 { label: "Hard", count: 19, color: "bg-rose-500" },
                              ].map(({ label, count, color }) => (
                                 <div key={label} className="flex-1 rounded-xl bg-zinc-800/60 p-3 text-center">
                                    <div className={`w-2 h-2 rounded-full ${color} mx-auto mb-2`} />
                                    <div className="text-xl font-black text-white">{count}</div>
                                    <div className="text-xs text-zinc-500">{label}</div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </Section>

                     {/* Badges */}
                     <Section title="Achievements" icon={Award}>
                        <div className="grid grid-cols-2 gap-3">
                           {badges.map(({ icon: Icon, label, color }) => (
                              <motion.div
                                 key={label} whileHover={{ scale: 1.04 }}
                                 className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-white/5 bg-zinc-800/40 cursor-default"
                              >
                                 <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${color}22` }}>
                                    <Icon className="w-5 h-5" style={{ color }} />
                                 </div>
                                 <span className="text-xs font-semibold text-zinc-300 text-center leading-tight px-2">{label}</span>
                              </motion.div>
                           ))}
                        </div>
                     </Section>
                  </div>

                  {/* Recent Activity */}
                  <Section title="Recent Activity" icon={Clock}>
                     {recentActivity.length === 0 ? (
                        <div className="flex flex-col items-center py-10 text-zinc-600">
                           <RotateCcw className="w-8 h-8 mb-3" />
                           <p className="text-sm font-semibold">Progress was reset</p>
                           <p className="text-xs mt-1">Start solving problems to see activity here.</p>
                        </div>
                     ) : (
                        <div className="space-y-2">
                           {recentActivity.map((item) => (
                              <motion.div
                                 key={item.title} whileHover={{ x: 4 }}
                                 className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default"
                              >
                                 <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${statusColors[item.status]}`} />
                                 <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-white truncate">{item.title}</div>
                                    <div className="text-xs text-zinc-500">{item.time}</div>
                                 </div>
                                 <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${difficultyColors[item.difficulty]}`}>
                                    {item.difficulty}
                                 </span>
                                 <div className="flex items-center gap-1 text-xs font-bold text-violet-400 min-w-[40px] justify-end">
                                    <Star className="w-3 h-3" />{item.score}
                                 </div>
                                 <ChevronRight className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                              </motion.div>
                           ))}
                        </div>
                     )}
                  </Section>
               </div>
            )}

            {/* ── ANALYTICS TAB ────────────────────────────────────────────────── */}
            {activeTab === "analytics" && (
               <div className="space-y-8">
                  <Section title="Rating Progress (6 Months)" icon={TrendingUp}>
                     <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={scoreHistory}>
                           <defs>
                              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.5} />
                                 <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                           <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                           <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                           <Tooltip content={<CustomTooltip />} />
                           <Area type="monotone" dataKey="score" stroke="#7c3aed" fill="url(#scoreGrad)" strokeWidth={2.5} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </Section>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <Section title="Weekly Problems Solved" icon={BarChart2}>
                        <ResponsiveContainer width="100%" height={220}>
                           <BarChart data={weeklyActivity} barCategoryGap="35%">
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                              <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="problems" fill="#6d28d9" radius={[6, 6, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </Section>

                     <Section title="AI Review Score Distribution" icon={Zap}>
                        <ResponsiveContainer width="100%" height={220}>
                           <LineChart data={[
                              { review: "R1", score: 72 }, { review: "R2", score: 65 },
                              { review: "R3", score: 80 }, { review: "R4", score: 78 },
                              { review: "R5", score: 91 }, { review: "R6", score: 85 },
                              { review: "R7", score: 92 }, { review: "R8", score: 88 },
                           ]}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                              <XAxis dataKey="review" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                              <YAxis domain={[50, 100]} tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                              <Tooltip content={<CustomTooltip />} />
                              <Line type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={2.5} dot={{ fill: "#ec4899", strokeWidth: 2, r: 4 }} />
                           </LineChart>
                        </ResponsiveContainer>
                     </Section>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <StatCard icon={BookOpen} label="Topics Covered" value="18" sub="out of 32 topics" color="#22d3ee" />
                     <StatCard icon={Clock} label="Total Time" value="142h" sub="Coding time" color="#a78bfa" />
                     <StatCard icon={TrendingUp} label="Avg AI Score" value="84" sub="Out of 100" color="#f472b6" />
                     <StatCard icon={Star} label="Reviews Done" value="31" sub="+5 this month" color="#34d399" />
                  </div>
               </div>
            )}

            {/* ── HISTORY TAB ─────────────────────────────────────────────────── */}
            {activeTab === "history" && (
               <div className="space-y-4">
                  <Section title="All Problem History" icon={Clock}>
                     {recentActivity.length === 0 ? (
                        <div className="flex flex-col items-center py-10 text-zinc-600">
                           <RotateCcw className="w-8 h-8 mb-3" />
                           <p className="text-sm font-semibold">No history — progress was reset</p>
                           <p className="text-xs mt-1">Solve problems to start building history.</p>
                        </div>
                     ) : (
                        <div className="space-y-1">
                           {[
                              ...recentActivity,
                              { title: "Sliding Window Maximum", difficulty: "Hard", status: "Solved", time: "4d ago", score: 88 },
                              { title: "House Robber II", difficulty: "Medium", status: "Solved", time: "5d ago", score: 90 },
                              { title: "Valid Parentheses", difficulty: "Easy", status: "Solved", time: "6d ago", score: 100 },
                              { title: "Jump Game", difficulty: "Medium", status: "Attempted", time: "7d ago", score: 55 },
                              { title: "Min Stack", difficulty: "Easy", status: "Solved", time: "8d ago", score: 95 },
                              { title: "Word Break", difficulty: "Hard", status: "Reviewed", time: "9d ago", score: 76 },
                           ].map((item, i) => (
                              <motion.div
                                 key={i}
                                 initial={{ opacity: 0, x: -12 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ duration: 0.3, delay: i * 0.04 }}
                                 className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default group"
                              >
                                 <span className="text-xs font-bold text-zinc-600 w-5">{i + 1}</span>
                                 <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${statusColors[item.status]}`} />
                                 <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-white truncate group-hover:text-violet-200 transition-colors">
                                       {item.title}
                                    </div>
                                    <div className="text-xs text-zinc-500">{item.time}</div>
                                 </div>
                                 <span className={`text-xs font-semibold ${statusColors[item.status]}`}>{item.status}</span>
                                 <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${difficultyColors[item.difficulty]}`}>
                                    {item.difficulty}
                                 </span>
                                 <div className="flex items-center gap-1 text-xs font-bold text-violet-400 w-[48px] justify-end">
                                    <Star className="w-3 h-3" />{item.score}
                                 </div>
                              </motion.div>
                           ))}
                        </div>
                     )}
                  </Section>
               </div>
            )}
         </div>
      </div>
   );
}
