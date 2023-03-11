export interface AuthResponse { 
    token: string;
    user: { 
        name: string; 
        email: string; 
        role: "client" | "admin"|'super-user'|'SEO' 
    }; 
}