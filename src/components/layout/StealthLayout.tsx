import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut } from 'lucide-react';
import { getUserDisplayInfo } from '@/lib/userUtils';

interface StealthLayoutProps {
  children: ReactNode;
}

const StealthLayout = ({ children }: StealthLayoutProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAuthClick = () => {
    // Store the current URL for redirect after authentication
    sessionStorage.setItem('redirectAfterAuth', location.pathname + location.search);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Simple header with EED CHECK logo and auth links */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo - Left aligned */}
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">EED CHECK</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                BETA
              </span>
            </div>

            {/* Auth Links - Right aligned */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                (() => {
                  const userInfo = getUserDisplayInfo(currentUser);
                  return (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
                          <Avatar className="w-8 h-8">
                            {userInfo.hasPhoto && userInfo.photoURL && (
                              <AvatarImage src={userInfo.photoURL} alt={userInfo.displayName} />
                            )}
                            <AvatarFallback className="bg-blue-600 text-white text-sm">
                              {userInfo.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900">
                            {userInfo.displayName}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{userInfo.displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {currentUser.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Uitloggen</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                })()

              ) : (
                <>
                  <Link to="/auth/login" onClick={handleAuthClick}>
                    <Button variant="ghost" className="text-sm font-medium text-gray-900 hover:bg-gray-100">
                      Inloggen
                    </Button>
                  </Link>
                  <Link to="/auth/register" onClick={handleAuthClick}>
                    <Button className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white">
                      Registreren
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default StealthLayout; 