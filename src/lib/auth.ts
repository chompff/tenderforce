// Future Clerk Auth Integration
// This file will contain authentication utilities and configurations

export interface User {
  id: string;
  email: string;
  name: string;
  subscription?: 'free' | 'pro' | 'enterprise';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Placeholder functions for future implementation
export const useAuth = () => {
  // This will be replaced with Clerk's useAuth hook
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    signIn: () => Promise.resolve(),
    signOut: () => Promise.resolve(),
    signUp: () => Promise.resolve(),
  };
};

export const requireAuth = (component: React.ComponentType) => {
  // This will be a HOC for protected routes
  return component;
};

export const getAuthToken = (): string | null => {
  // This will return the current auth token
  return null;
}; 