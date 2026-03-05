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

// IT Module Pages
import { FullStackPractice } from '@/pages/it/FullStackPractice';
import { CloudComputingPractice } from '@/pages/it/CloudComputingPractice';
import { SecurityPractice } from '@/pages/it/SecurityPractice';
import { ExplorePage } from '@/pages/shared/ExplorePage';

import { DiscussPage } from '@/pages/shared/DiscussPage';
import { AIPage } from '@/pages/shared/AIPage';
import { AIPracticePage } from '@/pages/shared/AIPracticePage';


import { ReactNode } from 'react';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
   const { isAuthenticated } = useAuth();
   return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
   return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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


                           <Route path="/school" element={<SchoolDashboard />} />
                           <Route path="/school/beginner" element={<BeginnerPractice />} />
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
                           <Route path="/leaderboard" element={<div className="p-8">Leaderboard Page</div>} />
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
