import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
   user: any | null;
   setUser: (userData: any) => void;
   login: (userData: any) => void;
   logout: () => void;
   updateProfile: (userData: any) => Promise<void>;
   isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { authApi } from '@/services/authService';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUserState] = useState<any | null>(() => {
      // Clear legacy localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      try {
         const savedUser = sessionStorage.getItem('user');
         return savedUser ? JSON.parse(savedUser) : null;
      } catch (error) {
         console.error("Error parsing user from sessionStorage:", error);
         sessionStorage.removeItem('user');
         return null;
      }
   });

   const setUser = (userData: any) => {
      setUserState(userData);
      if (userData) {
         sessionStorage.setItem('user', JSON.stringify(userData));
      } else {
         sessionStorage.removeItem('user');
      }
   };

   const login = (userData: any) => {
      setUser(userData);
      if (userData.token) {
         sessionStorage.setItem('token', userData.token);
      }
   };

   const logout = () => {
      setUser(null);
      sessionStorage.removeItem('token');
   };

   const updateProfile = async (userData: any) => {
      try {
         const updatedUser = await authApi.updateProfile(userData);
         // Keep the token if it exists in the current user state
         const newUserState = { ...user, ...updatedUser };
         setUser(newUserState);
      } catch (error) {
         console.error("Failed to update profile", error);
         throw error;
      }
   };

   return (
      <AuthContext.Provider value={{ user, setUser, login, logout, updateProfile, isAuthenticated: !!user }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};
