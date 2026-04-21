// context/AuthContext.tsx
// Reads JWT from localStorage/sessionStorage and provides user info globally
// No changes to your auth flow — just reads what's already there

import { createContext, useContext, useState, useEffect } from "react";

interface AuthUser {
    id:        string;
    email:     string;
    role:      "user" | "admin";
    firstName?: string;
    lastName?:  string;
}

interface AuthContextType {
    user:      AuthUser | null;
    isLoggedIn: boolean;
    logout:    () => void;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user:        null,
    isLoggedIn:  false,
    logout:      () => {},
    refreshUser: () => {},
});

// Helper: decode JWT payload 
const decodeToken = (token: string): AuthUser | null => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        
        return {
            id:        payload.id    || payload._id || "",
            email:     payload.email || "",
            role:      payload.role  || "user",
            firstName: payload.firstName || "",
            lastName:  payload.lastName  || "",
        };
        
    } catch {
        return null;
    }
};

// Helper: get token from storage 
const getToken = (): string | null =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

// Provider 
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    const refreshUser = () => {
        const token = getToken();
        if (token) {
            const decoded = decodeToken(token);
            setUser(decoded);
        } else {
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            logout,
            refreshUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook
export const useAuth = () => useContext(AuthContext);
