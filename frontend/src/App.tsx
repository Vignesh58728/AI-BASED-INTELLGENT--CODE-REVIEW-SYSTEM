import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/context/ThemeContext"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { LevelProvider } from "@/context/LevelContext"
import { ProgressProvider } from "@/context/ProgressContext"

import { MainLayout } from '@/layout/MainLayout';
import { Login } from '@/pages/Login';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { LogoSplashPage } from '@/pages/auth/LogoSplashPage';
import { SchoolDashboard } from '@/pages/levels/SchoolDashboard';
import { CollegeDashboard } from '@/pages/levels/CollegeDashboard';
import { ITDashboard } from '@/pages/levels/ITDashboard';
import { BeginnerPractice } from '@/pages/school/BeginnerPractice';
import { BeginnerRush } from '@/pages/school/BeginnerRush';
import { IntermediatePractice } from '@/pages/school/IntermediatePractice';
import { AdvancedPractice } from '@/pages/school/AdvancedPractice';
import { ExamsPage } from '@/pages/school/ExamsPage';
import { ExamInterface } from '@/pages/school/ExamInterface';
import { Practice } from '@/pages/Practice';

// New Pages
import { SkillAnalysis } from '@/pages/SkillAnalysis';
import { AdminPanel } from '@/pages/AdminPanel';
import { Profile } from '@/pages/Profile';

import { DataStructuresPractice } from '@/pages/college/DataStructuresPractice';
import { AlgorithmsPractice } from '@/pages/college/AlgorithmsPractice';
import { CollegePracticePage } from '@/pages/college/CollegePracticePage';
import { CSCoreSubjects } from '@/pages/college/CSCoreSubjects';
import { LeetCodeChallenges } from '@/pages/levels/LeetCodeChallenges';

// IT Module Pages
import { FullStackPractice } from '@/pages/it/FullStackPractice';
import { CloudComputingPractice } from '@/pages/it/CloudComputingPractice';
import { SecurityPractice } from '@/pages/it/SecurityPractice';
import { ExplorePage } from '@/pages/shared/ExplorePage';

import { DiscussPage } from '@/pages/shared/DiscussPage';
import { AIPage } from '@/pages/shared/AIPage';
import { AIPracticePage } from '@/pages/shared/AIPracticePage';

import { NotificationsPage } from '@/pages/shared/NotificationsPage';
import { SettingsPage } from '@/pages/shared/SettingsPage';
import SolutionsPage from './pages/shared/SolutionsPage';


import { ReactNode } from 'react';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
   const { isAuthenticated } = useAuth();
   return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
   return (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
         <AuthProvider>
            <LevelProvider>
               <ProgressProvider>
                  <Router>
                     <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/logo-splash" element={<LogoSplashPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                           <Route path="/explore" element={<ExplorePage />} />
                           <Route path="/discuss" element={<DiscussPage />} />
                           <Route path="/skill-analysis" element={<SkillAnalysis />} />
                           <Route path="/admin" element={<AdminPanel />} />
                           <Route path="/notifications" element={<NotificationsPage />} />
                           <Route path="/settings" element={<SettingsPage />} />
                           <Route path="/solutions" element={<SolutionsPage />} />


                           <Route path="/school" element={<SchoolDashboard />} />
                           <Route path="/school/beginner" element={<BeginnerPractice />} />
                           <Route path="/school/beginner-rush" element={<BeginnerRush />} />
                           <Route path="/school/intermediate" element={<IntermediatePractice />} />
                           <Route path="/school/advanced" element={<AdvancedPractice />} />
                           <Route path="/school/exams" element={<ExamsPage />} />
                           <Route path="/practice/:id" element={<Practice />} />
                           <Route path="/exam/:id" element={<ExamInterface />} />

                           <Route path="/college" element={<CollegeDashboard />} />
                           <Route path="/college/ds" element={<DataStructuresPractice />} />
                           <Route path="/college/algorithms" element={<AlgorithmsPractice />} />
                           <Route path="/college/practice/:id" element={<CollegePracticePage />} />
                           <Route path="/college/core" element={<CSCoreSubjects />} />
                           <Route path="/it" element={<ITDashboard />} />
                           <Route path="/it/fullstack" element={<FullStackPractice />} />
                           <Route path="/it/cloud" element={<CloudComputingPractice />} />
                           <Route path="/it/security" element={<SecurityPractice />} />

                           {/* Placeholder for other routes */}
                           <Route path="/profile" element={<Profile />} />
                           <Route path="/leaderboard" element={
                              <div className="min-h-screen bg-white p-12">
                                 <h1 className="text-5xl font-black text-slate-900 mb-2" style={{fontFamily:"'Spectral',serif"}}>Leaderboard</h1>
                                 <p className="text-slate-500 text-lg mb-10">Top coders ranked by performance and points.</p>
                                 <div className="space-y-3">
                                    {['Vignesh','Vinith','Bahadoorsha','Gopal','Alex'].map((name,i) => (
                                       <div key={name} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">
                                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${i===0?'bg-yellow-400 text-white':i===1?'bg-slate-300 text-slate-800':i===2?'bg-amber-600 text-white':'bg-slate-200 text-slate-600'}`}>{i+1}</span>
                                          <span className="font-bold text-slate-900">{name}</span>
                                          <span className="ml-auto text-sm font-bold text-slate-500">{(1000-(i*127))} pts</span>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           } />
                        </Route>

                        <Route path="/ai" element={<ProtectedRoute><AIPage /></ProtectedRoute>} />
                        <Route path="/ai/practice" element={<ProtectedRoute><AIPracticePage /></ProtectedRoute>} />

                     </Routes>
                  </Router>
               </ProgressProvider>
            </LevelProvider>
         </AuthProvider>
      </ThemeProvider>
   )
}

export default App
