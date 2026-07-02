export interface User {
   id: string;
   email: string;
   username: string;
   full_name?: string;
   bio?: string;
   lang?: string;
   photo?: string;
   role: string;
   createdAt: string;
}

export interface AuthResponse {
   user: User;
   token: string;
}
