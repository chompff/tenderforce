import { ReactNode } from "react";

interface StealthLayoutProps {
  children: ReactNode;
}

const StealthLayout = ({ children }: StealthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Simple header with just the EED TOOL logo */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">EED TOOL</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
              BETA
            </span>
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