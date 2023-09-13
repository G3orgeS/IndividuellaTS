import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the authentication context
interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

// Create an authentication context with an initial value of undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
    children: ReactNode;
}

// AuthProvider component manages the authentication state
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Keep track of the login status

    // Simulate a login action
    const login = () => {
        setIsLoggedIn(true);
    };

    // Simulate a logout action
    const logout = () => {
        setIsLoggedIn(false);
    };

    // Create the context value to be provided to children
    const contextValue: AuthContextType = {
        isLoggedIn,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access the authentication context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
