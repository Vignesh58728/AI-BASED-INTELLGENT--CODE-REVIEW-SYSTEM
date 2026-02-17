export interface User {
   id: string;
   email: string;
   name: string;
   avatarUrl?: string;
   role: 'student' | 'admin';
   createdAt: string;
}

export interface AuthResponse {
   user: User;
   token: string;
}
