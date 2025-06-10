import React, { useState, useRef, useEffect } from 'react';
import { useUser, useOrganization, useClerk } from "@clerk/clerk-react";
import { ChevronDown, LayoutDashboard, Building2, Plus, User, LogOut, Settings } from 'lucide-react';
import { useOrganizationData } from '@/hooks/useOrganizationData';

interface UserDropdownProps {
  isScrolled: boolean;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isSignedIn } = useUser();
  const { organization } = useOrganization();
  const { orgName } = useOrganizationData();
  const { signOut, openUserProfile, openCreateOrganization } = useClerk();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isSignedIn || !user) {
    return null;
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleCreateOrgClick = () => {
    openCreateOrganization();
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button */}
        <button
          onClick={toggleDropdown}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            isScrolled 
              ? 'text-gray-700 hover:bg-gray-100 hover:text-blue-600' 
              : 'text-gray-800 hover:bg-white/10 hover:text-blue-600'
          } ${isOpen ? 'bg-gray-100 text-blue-600' : ''}`}
        >
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
            {user.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt={user.fullName || 'User'} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span>{user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}</span>
            )}
          </div>
          
          {/* User Name and Organization */}
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium">
              {user.fullName || user.firstName || 'User'}
            </div>
            {orgName && (
              <div className="text-xs text-gray-500 truncate max-w-32">
                {orgName}
              </div>
            )}
          </div>
          
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {/* User Profile Section */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-medium flex-shrink-0">
                  {user.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt={user.fullName || 'User'} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span>{user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-gray-900 truncate">
                    {user.fullName || user.firstName || 'User'}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {user.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="py-2">
              <a
                href="/tender-dashboard"
                className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Tender Dashboard</span>
              </a>
            </div>

            {/* Organization Section */}
            <div className="border-t border-gray-100">
              <div className="p-3">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Organisatie
                </div>
                
                {/* Current Organization */}
                {organization ? (
                  <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg mb-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {organization.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Actieve organisatie
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mb-2 p-2">
                    Geen organisatie geselecteerd
                  </div>
                )}



                {/* Create Organization Button */}
                <button
                  onClick={handleCreateOrgClick}
                  className="w-full flex items-center space-x-3 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-dashed border-gray-300 hover:border-blue-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nieuwe organisatie aanmaken</span>
                </button>
              </div>
            </div>

            {/* Account Actions */}
            <div className="border-t border-gray-100 py-2">
              <button
                className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                onClick={() => {
                  openUserProfile();
                  setIsOpen(false);
                }}
              >
                <Settings className="w-4 h-4" />
                <span>Account instellingen</span>
              </button>
              
              <button
                className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>Uitloggen</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </>
  );
};

export default UserDropdown; 