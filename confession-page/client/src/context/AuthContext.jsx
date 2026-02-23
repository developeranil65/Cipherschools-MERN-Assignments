/**
 * @fileoverview Authentication context provider.
 * Makes the current user and auth actions (login, logout) available
 * to every component in the tree via React Context.
 */

import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../services/api";

/** @type {React.Context<{ user: object|null, loading: boolean, login: Function, logout: Function }>} */
const AuthContext = createContext(null);

/**
 * Provides authentication state and actions to child components.
 * On mount, it checks the server session for an existing login.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* Check if the user has an active session on initial page load */
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    /** Redirects the browser to the Google OAuth login route on the backend. */
    const login = () => {
        window.location.href = "http://localhost:3000/auth/google";
    };

    /** Calls the logout endpoint and clears the local user state. */
    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to access the auth context from any component.
 * @returns {{ user: object|null, loading: boolean, login: Function, logout: Function }}
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
