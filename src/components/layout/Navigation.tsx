import React, { useState, useEffect } from 'react';
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
import '../../styles/button-overlay.css';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white border-b border-gray-100 shadow-sm'
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left aligned */}
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center space-x-2">
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-gray-900 drop-shadow-sm'
              }`}>EED CHECK</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                isScrolled
                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                  : 'bg-orange-100/90 text-orange-800 border border-orange-200/90 backdrop-blur-sm'
              }`}>
                BETA
              </span>
            </div>
          </a>

          {/* Auth Links - Right aligned */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              (() => {
                const userInfo = getUserDisplayInfo(currentUser);
                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`flex items-center gap-2 ${
                          isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                        }`}
                      >
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
                  <Button
                    variant="ghost"
                    className={`text-sm font-medium ${
                      isScrolled
                        ? 'text-gray-900 hover:bg-gray-100'
                        : 'text-gray-900 hover:bg-white/10'
                    }`}
                  >
                    Inloggen
                  </Button>
                </Link>
                <Link to="/auth/register" onClick={handleAuthClick}>
                  <Button
                    className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Registreren
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 