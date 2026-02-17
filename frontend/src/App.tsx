import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/context/ThemeContext"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { LevelProvider } from "@/context/LevelContext"
import { ProgressProvider } from "@/context/ProgressContext"

import { MainLayout } from '@/layout/MainLayout';
import { LandingPage } from '@/pages/auth/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { LevelSelectionPage } from '@/pages/levels/LevelSelectionPage';
import { LogoSplashPage } from '@/pages/auth/LogoSplashPage';
import { SchoolDashboard } from '@/pages/levels/SchoolDashboard';
import { CollegeDashboard } from '@/pages/levels/CollegeDashboard';
import { ITDashboard } from '@/pages/levels/ITDashboard';
import { BeginnerPractice } from '@/pages/school/BeginnerPractice';
import { IntermediatePractice } from '@/pages/school/IntermediatePractice';
import { AdvancedPractice } from '@/pages/school/AdvancedPractice';
import { ExamsPage } from '@/pages/school/ExamsPage';
import { ProblemSolverPage } from '@/pages/shared/ProblemSolverPage';

// College Module Pages
import { DataStructuresPractice } from '@/pages/college/DataStructuresPractice';
import { AlgorithmsPractice } from '@/pages/college/AlgorithmsPractice';
import { PlacementPreparation } from '@/pages/college/PlacementPreparation';

// IT Module Pages
import { FullStackPractice } from '@/pages/it/FullStackPractice';
import { CloudComputingPractice } from '@/pages/it/CloudComputingPractice';
import { SecurityPractice } from '@/pages/it/SecurityPractice';

// New Pages
import { ProblemsListPage } from '@/pages/shared/ProblemsListPage';
import { ExplorePage } from '@/pages/shared/ExplorePage';
import { DiscussPage } from '@/pages/shared/DiscussPage';
import { InterviewPrepPage } from '@/pages/shared/InterviewPrepPage';
import { InterviewAssessmentPage } from '@/pages/shared/InterviewAssessmentPage';
import { AIPage } from '@/pages/shared/AIPage';

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
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/logo-splash" element={<LogoSplashPage />} />
                        <Route path="/forgot-password" element={<div className="flex justify-center items-center h-screen">Forgot Password Page</div>} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                           <Route path="/dashboard" element={<LevelSelectionPage />} />
                           <Route path="/explore" element={<ExplorePage />} />
                           <Route path="/ai" element={<AIPage />} />
                           <Route path="/problems" element={<ProblemsListPage />} />
                           <Route path="/discuss" element={<DiscussPage />} />
                           <Route path="/interview/preparation" element={<InterviewPrepPage />} />
                           <Route path="/interview/assessment" element={<InterviewAssessmentPage />} />

                           <Route path="/school" element={<SchoolDashboard />} />
                           <Route path="/school/beginner" element={<BeginnerPractice />} />
                           <Route path="/school/intermediate" element={<IntermediatePractice />} />
                           <Route path="/school/advanced" element={<AdvancedPractice />} />
                           <Route path="/school/exams" element={<ExamsPage />} />
                           <Route path="/problem/:id" element={<ProblemSolverPage />} />
                           <Route path="/exam/:id" element={<div className="p-8">Exam Interface Placeholder</div>} />
                           <Route path="/college" element={<CollegeDashboard />} />
                           <Route path="/college/ds" element={<DataStructuresPractice />} />
                           <Route path="/college/algorithms" element={<AlgorithmsPractice />} />
                           <Route path="/college/placement" element={<PlacementPreparation />} />
                           <Route path="/it" element={<ITDashboard />} />
                           <Route path="/it/fullstack" element={<FullStackPractice />} />
                           <Route path="/it/cloud" element={<CloudComputingPractice />} />
                           <Route path="/it/security" element={<SecurityPractice />} />

                           {/* Placeholder for other routes */}
                           <Route path="/profile" element={<div className="p-8">Profile Page</div>} />
                           <Route path="/leaderboard" element={<div className="p-8">Leaderboard Page</div>} />
                        </Route>
                     </Routes>
                  </Router>
               </ProgressProvider>
            </LevelProvider>
         </AuthProvider>
      </ThemeProvider>
   )
}

export default App
