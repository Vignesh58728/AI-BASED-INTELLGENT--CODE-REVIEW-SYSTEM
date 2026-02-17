import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
   user: any | null;
   login: (userData: any) => void;
   logout: () => void;
   isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<any | null>(() => {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
   });

   const login = (userData: any) => {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) {
         localStorage.setItem('token', userData.token);
      }
   };

   const logout = () => {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
   };

   return (
      <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
