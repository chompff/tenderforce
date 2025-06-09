import React, { useState, useEffect } from 'react';
import '../../styles/button-overlay.css';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled && !isMenuOpen
          ? 'bg-white border-b border-gray-100 shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <svg
                width="28"
                height="28"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-600"
              >
                <path
                  className="fill-current"
                  fillRule="evenodd"
                  d="M10,3c-3.87,0-7,3.13-7,7s3.13,7,7,7,7-3.13,7-7-3.13-7-7-7ZM10,13c1.66,0,3-1.34,3-3s-1.34-3-3-3-3,1.34-3,3,1.34,3,3,3Z"
                />
                <path
                  className="fill-current"
                  fillRule="evenodd"
                  d="M0,10C0,4.48,4.48,0,10,0s10,4.48,10,10-4.48,10-10,10S0,15.52,0,10ZM10,2C5.58,2,2,5.58,2,10s3.58,8,8,8,8-3.58,8-8S14.42,2,10,2Z"
                />
              </svg>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-gray-900 drop-shadow-sm'
              }`}>Tenderforce.ai</span>
            </a>

            {/* Right side: Login button and hamburger menu */}
            <div className="flex items-center space-x-4">
              {/* Login Button */}
              <a 
                href="/login" 
                className={`hidden sm:flex items-center px-3 py-1.5 text-sm font-medium transition-all duration-300 hover:opacity-75 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-gray-800 hover:text-blue-600'
                }`}
              >
                Login
              </a>

              {/* Animated Hamburger Menu Button */}
              <button
                onClick={toggleMenu}
                className={`relative w-8 h-8 hover:text-blue-600 transition-colors flex flex-col justify-center items-center gap-1 ${
                  isScrolled ? 'text-gray-600' : 'text-gray-700 drop-shadow-sm'
                }`}
              >
                {/* Top line */}
                <span
                  className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                {/* Middle line */}
                <span
                  className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'opacity-0 scale-0' : ''
                  }`}
                />
                {/* Bottom line */}
                <span
                  className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                    isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Panel - Responsive: Top slide on desktop, Side slide on mobile */}
      
      {/* Mobile Menu with Backdrop */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/20"
          onClick={toggleMenu}
        />
        
        {/* Mobile Menu */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[80vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <span className="text-lg font-semibold text-gray-900">Menu</span>
              <button
                onClick={toggleMenu}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                aria-label="Close menu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-600"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Menu Items - Mobile */}
            <div className="flex-1 px-6 py-8">
              <div className="space-y-6">
                <a 
                  href="/" 
                  className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Start
                </a>
                <a 
                  href="/over-tenderforce" 
                  className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Over Tenderforce
                </a>
                <a 
                  href="/prijzen" 
                  className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Prijzen
                </a>
                <a 
                  href="/support" 
                  className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Support
                </a>
                <a 
                  href="/kennisbank" 
                  className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Kennisbank
                </a>
                
                {/* Tools Section - Mobile */}
                <div className="space-y-3">
                  <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wider py-1">
                    JOUW AANBESTEDINGSTOOLS
                  </span>
                  <div className="space-y-2">
                    <a 
                      href="/tools/stappenslang" 
                      className="block group border-b border-gray-100 hover:border-blue-200 pb-2"
                    >
                      <div className="relative">
                        <div className="absolute top-0 right-0 text-2xl font-bold text-gray-300 opacity-30 pointer-events-none">1</div>
                        <div className="flex items-center text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 84.38 75" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 text-gray-400 group-hover:text-blue-500"
                          >
                            <path 
                              d="M73.44,7.81h-7.95c-.75-4.43-4.6-7.81-9.23-7.81h-28.12c-5.17,0-9.38,4.2-9.38,9.38v3.12c0,5.17,4.2,9.38,9.38,9.38h28.12c4.64,0,8.48-3.39,9.23-7.81h7.95c2.59,0,4.69,2.1,4.69,4.69v12.5c0,2.56-2.06,4.63-4.61,4.68l.21-.21c1.21-1.23,1.19-3.21-.04-4.42-1.23-1.21-3.21-1.19-4.42.04l-3.69,3.76c-.43-4.77-4.45-8.53-9.33-8.53h-28.12c-4.64,0-8.49,3.39-9.23,7.83-.05,0-.09-.02-.14-.02h-7.81c-6.03,0-10.94,4.91-10.94,10.94v12.5c0,6.03,4.91,10.94,10.94,10.94h1.28l-.65.66c-1.21,1.23-1.19,3.21.04,4.42.61.6,1.4.89,2.19.89s1.62-.31,2.23-.94l3.78-3.85c1.56,3,4.7,5.07,8.32,5.07h28.12c5.17,0,9.38-4.2,9.38-9.38v-3.12c0-5.17-4.2-9.38-9.38-9.38h-28.12c-4.6,0-8.43,3.33-9.22,7.71l-3.03-2.98c-1.23-1.21-3.21-1.19-4.42.04-1.21,1.23-1.19,3.21.04,4.42l.19.18h-.75c-2.59,0-4.69-2.1-4.69-4.69v-12.5c0-2.59,2.1-4.69,4.69-4.69h7.81s.09-.01.14-.02c.74,4.43,4.59,7.83,9.23,7.83h28.12c3.85,0,7.16-2.33,8.6-5.65l4.57,4.48c.61.6,1.4.89,2.19.89s1.62-.31,2.23-.94c1.21-1.23,1.19-3.21-.04-4.42l-.63-.62h.27c6.03,0,10.94-4.91,10.94-10.94v-12.5c0-6.03-4.91-10.94-10.94-10.94h0ZM59.38,12.5c0,1.72-1.4,3.12-3.12,3.12h-28.12c-1.72,0-3.12-1.4-3.12-3.12v-3.12c0-1.72,1.4-3.12,3.12-3.12h28.12c1.72,0,3.12,1.4,3.12,3.12v3.12ZM25,62.5c0-1.72,1.4-3.12,3.12-3.12h28.12c1.72,0,3.12,1.4,3.12,3.12v3.12c0,1.72-1.4,3.12-3.12,3.12h-28.12c-1.72,0-3.12-1.4-3.12-3.12v-3.12ZM59.38,39.06c0,1.72-1.4,3.12-3.12,3.12h-28.12c-1.72,0-3.12-1.4-3.12-3.12v-3.12c0-1.72,1.4-3.12,3.12-3.12h28.12c1.72,0,3.12,1.4,3.12,3.12v3.12Z" 
                              fill="currentColor"
                            />
                          </svg>
                          Stappenslang
                        </div>
                        <p className="text-sm text-gray-500 mt-1 ml-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-h-0 group-hover:max-h-10 overflow-hidden">
                          Bepaal welke stappen je aanbesteding moet nemen.
                        </p>
                      </div>
                    </a>
                    <a 
                      href="/tools/aanbestedingsplicht-check" 
                      className="block group border-b border-gray-100 hover:border-blue-200 pb-2"
                    >
                      <div className="relative">
                        <div className="absolute top-0 right-0 text-2xl font-bold text-gray-300 opacity-30 pointer-events-none">2</div>
                        <div className="flex items-center text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 group-hover:text-blue-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Aanbestedingsplicht check</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Check of je aanbestedingsplichtig bent.</p>
                      </div>
                    </a>
                    <a 
                      href="/tools/opdrachtramer" 
                      className="block group border-b border-gray-100 hover:border-blue-200 pb-2"
                    >
                      <div className="relative">
                        <div className="absolute top-0 right-0 text-2xl font-bold text-gray-300 opacity-30 pointer-events-none">3</div>
                        <div className="flex items-center text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 84.38 84.38" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 text-gray-400 group-hover:text-blue-500"
                          >
                            <path 
                              d="M9.38,84.37h45c.24,0,.48-.04.71-.09.05-.01.1-.03.15-.05.19-.05.36-.12.54-.21.02-.01.05-.02.08-.03l10.75-5.77c.64-.34,1.15-.91,1.42-1.59l15.79-39.12c1.61-4-.33-8.55-4.32-10.17l-5.8-2.34c-1.94-.78-4.06-.76-5.98.05-.78.33-1.46.8-2.09,1.35v-12.36c0-5.17-4.2-9.38-9.38-9.38h-3.12v-1.56c0-1.73-1.4-3.12-3.12-3.12s-3.12,1.4-3.12,3.12v1.56h-10.94v-1.56c0-1.73-1.4-3.12-3.12-3.12s-3.12,1.4-3.12,3.12v1.56h-10.94v-1.56c0-1.73-1.4-3.12-3.12-3.12s-3.12,1.4-3.12,3.12v1.56h-3.12C4.2,4.69,0,8.89,0,14.06v60.94c0,5.17,4.2,9.38,9.38,9.38h0ZM6.25,75V28.12h53.13v11.49l-11.64,28.85c-.27.68-.3,1.43-.08,2.12l2.42,7.54H9.38c-1.72,0-3.12-1.4-3.12-3.12h0ZM62.65,73.26l-6.45,3.46-2.24-6.97,11.27-27.93,8.7,3.51-11.27,27.93h0ZM69.32,31.68c.21-.52.62-.76.84-.85.23-.09.68-.22,1.2,0l5.8,2.34c.8.32,1.19,1.23.87,2.04l-1.75,4.35-8.7-3.51,1.75-4.35h0ZM9.38,10.93h3.12v1.56c0,1.73,1.4,3.12,3.12,3.12s3.12-1.4,3.12-3.12v-1.56h10.94v1.56c0,1.73,1.4,3.12,3.12,3.12s3.12-1.4,3.12-3.12v-1.56h10.94v1.56c0,1.73,1.4,3.12,3.12,3.12s3.12-1.4,3.12-3.12v-1.56h3.12c1.72,0,3.12,1.4,3.12,3.12v7.81H6.25v-7.81c0-1.72,1.4-3.12,3.12-3.12h0Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M17.19,42.18h31.25c1.73,0,3.12-1.4,3.12-3.12s-1.4-3.12-3.12-3.12h-31.25c-1.73,0-3.12,1.4-3.12,3.12s1.4,3.12,3.12,3.12Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M17.19,56.24h31.25c1.73,0,3.12-1.4,3.12-3.12s-1.4-3.12-3.12-3.12h-31.25c-1.73,0-3.12,1.4-3.12,3.12s1.4,3.12,3.12,3.12Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M40.63,64.06h-23.44c-1.73,0-3.12,1.4-3.12,3.12s1.4,3.12,3.12,3.12h23.44c1.73,0,3.12-1.4,3.12-3.12s-1.4-3.12-3.12-3.12Z" 
                              fill="currentColor"
                            />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Opdrachtramer</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Raam de grootte van je opdracht.</p>
                      </div>
                    </a>
                    <a 
                      href="/tools/sectorale-verplichtingencheck" 
                      className="block group border-b border-gray-100 hover:border-blue-200 pb-2"
                    >
                      <div className="relative">
                        <div className="absolute top-0 right-0 text-2xl font-bold text-gray-300 opacity-30 pointer-events-none">4</div>
                        <div className="flex items-center text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 65.62 84.38" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 text-gray-400 group-hover:text-blue-500"
                          >
                            <path 
                              d="M9.38,84.38h46.87c5.17,0,9.38-4.2,9.38-9.38V20.31c0-5.17-4.2-9.38-9.38-9.38h-6.25v-1.56c0-1.73-1.4-3.12-3.12-3.12h-5.22c-1.29-3.64-4.77-6.25-8.84-6.25s-7.55,2.61-8.84,6.25h-5.22c-1.73,0-3.12,1.4-3.12,3.12v1.56h-6.25C4.2,10.94,0,15.14,0,20.31v54.69c0,5.17,4.2,9.38,9.38,9.38ZM21.88,12.5h4.69c1.73,0,3.12-1.4,3.12-3.12s1.4-3.12,3.12-3.12,3.12,1.4,3.12,3.12,1.4,3.12,3.12,3.12h4.69v3.12h-21.88v-3.12ZM6.25,20.31c0-1.72,1.4-3.12,3.12-3.12h6.25v1.56c0,1.73,1.4,3.12,3.12,3.12h28.12c1.73,0,3.12-1.4,3.12-3.12v-1.56h6.25c1.72,0,3.12,1.4,3.12,3.12v54.69c0,1.72-1.4,3.12-3.12,3.12H9.38c-1.72,0-3.12-1.4-3.12-3.12V20.31Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M16.22,38.66c.61.61,1.41.91,2.21.91s1.6-.3,2.21-.91l5.52-5.52c1.22-1.22,1.22-3.2,0-4.42s-3.2-1.22-4.42,0l-3.32,3.31-1.11-1.11c-1.22-1.22-3.2-1.22-4.42,0s-1.22,3.2,0,4.42l3.32,3.32h0Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M16.22,54.29c.61.61,1.41.91,2.21.91s1.6-.3,2.21-.91l5.52-5.52c1.22-1.22,1.22-3.2,0-4.42s-3.2-1.22-4.42,0l-3.32,3.31-1.11-1.11c-1.22-1.22-3.2-1.22-4.42,0s-1.22,3.2,0,4.42l3.32,3.32h0Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M16.22,69.91c.61.61,1.41.91,2.21.91s1.6-.3,2.21-.91l5.52-5.52c1.22-1.22,1.22-3.2,0-4.42s-3.2-1.22-4.42,0l-3.32,3.31-1.11-1.11c-1.22-1.22-3.2-1.22-4.42,0s-1.22,3.2,0,4.42l3.32,3.32h0Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M34.38,37.5h17.19c1.73,0,3.12-1.4,3.12-3.12s-1.4-3.12-3.12-3.12h-17.19c-1.73,0-3.12,1.4-3.12,3.12s1.4,3.12,3.12,3.12Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M34.38,53.13h17.19c1.73,0,3.12-1.4,3.12-3.12s-1.4-3.12-3.12-3.12h-17.19c-1.73,0-3.12,1.4-3.12,3.12s1.4,3.12,3.12,3.12Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M34.38,68.75h17.19c1.73,0,3.12-1.4,3.12-3.12s-1.4-3.12-3.12-3.12h-17.19c-1.73,0-3.12,1.4-3.12,3.12s1.4,3.12,3.12,3.12Z" 
                              fill="currentColor"
                            />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Sectorale check</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Check welke sectorale wetgeving van toepassing is.</p>
                      </div>
                    </a>
                    <a 
                      href="/tools/gemengde-opdracht-kwalificatie" 
                      className="block group border-b border-gray-100 hover:border-blue-200 pb-2"
                    >
                      <div className="relative">
                        <div className="absolute top-0 right-0 text-2xl font-bold text-gray-300 opacity-30 pointer-events-none">5</div>
                        <div className="flex items-center text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 84.38 84.38" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 text-gray-400 group-hover:text-blue-500"
                          >
                            <path 
                              d="M75,65.63v6.25c0,6.89-5.61,12.5-12.5,12.5h-40.63c-6.89,0-12.5-5.61-12.5-12.5v-59.38c0-6.89,5.61-12.5,12.5-12.5h25c1.73,0,3.12,1.4,3.12,3.12s-1.4,3.12-3.12,3.12h-25c-3.45,0-6.25,2.8-6.25,6.25v59.38c0,3.45,2.8,6.25,6.25,6.25h40.63c3.45,0,6.25-2.8,6.25-6.25v-6.25c0-1.73,1.4-3.12,3.12-3.12s3.12,1.4,3.12,3.12ZM82.5,40.63c1.03,0,1.88-.85,1.88-1.88v-3.75c0-1.03-.85-1.88-1.88-1.88h-21.88v-6.25c0-1.03-.85-1.88-1.88-1.88h-3.75c-1.03,0-1.88.85-1.88,1.88v6.25h-21.88c-1.03,0-1.88.85-1.88,1.88v3.75c0,1.03.85,1.88,1.88,1.88h21.88v6.25c0,1.03.85,1.88,1.88,1.88h3.75c1.03,0,1.88-.85,1.88-1.88v-6.25h21.88Z" 
                              fill="currentColor"
                            />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Gemengde opdracht kwalificatie</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Check het drempelbedrag van je gemengde opdracht.</p>
                      </div>
                    </a>
                    <a 
                      href="/tools/gunningsbriefbouwer" 
                      className="block group border-b border-gray-100 hover:border-blue-200 pb-2"
                    >
                      <div className="relative">
                        <div className="absolute top-0 right-0 text-2xl font-bold text-gray-300 opacity-30 pointer-events-none">6</div>
                        <div className="flex items-center text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 65.62 84.37" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 text-gray-400 group-hover:text-blue-500"
                          >
                            <path 
                              d="M12.5,84.37h40.63c6.89,0,12.5-5.61,12.5-12.5V21.87c0-.83-.33-1.62-.91-2.21L45.96.91c-.59-.59-1.38-.91-2.21-.91H12.5C5.61,0,0,5.61,0,12.5v59.37c0,6.89,5.61,12.5,12.5,12.5h0ZM46.87,10.67l8.08,8.08h-8.08v-8.08ZM6.25,12.5c0-3.45,2.8-6.25,6.25-6.25h28.12v15.62c0,1.73,1.4,3.13,3.12,3.13h15.62v46.88c0,3.45-2.8,6.25-6.25,6.25H12.5c-3.45,0-6.25-2.8-6.25-6.25V12.5Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M27.17,61.26c-1.08,0-2.12-.63-2.62-1.58l-2.26-4.47-.86-.41-5.92,12.56c-.18.36.14.77.54.68l5.92-1.13c.23-.05.41.05.5.23l2.89,5.24c.18.36.68.32.86-.05l5.96-12.65-4.11,1.36c-.32.14-.59.23-.9.23Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M50.12,67.36l-5.92-12.6-.86.41-2.26,4.47c-.5.99-1.49,1.58-2.62,1.58-.32,0-.63-.05-.9-.14l-4.11-1.36,5.96,12.65c.18.36.68.36.86.05l2.89-5.24c.09-.18.32-.27.5-.23l5.92,1.13c.41.05.72-.36.54-.72Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M39.54,58.86l2.35-4.61c.14-.23.32-.41.54-.54l4.61-2.35c.54-.27.77-.9.59-1.45l-1.58-4.92c-.09-.23-.09-.5,0-.77l1.58-4.92c.18-.59-.09-1.17-.59-1.45l-4.61-2.35c-.23-.14-.41-.32-.54-.54l-2.35-4.52c-.27-.54-.9-.77-1.45-.59l-4.92,1.58c-.23.09-.5.09-.77,0l-4.88-1.63c-.59-.18-1.17.09-1.45.63l-2.35,4.61c-.14.23-.32.41-.54.54l-4.61,2.35c-.54.27-.81.9-.59,1.45l1.58,4.92c.09.23.09.5,0,.77l-1.58,4.92c-.18.59.09,1.17.59,1.45l4.61,2.35c.23.14.41.32.54.54l2.35,4.61c.27.54.9.77,1.45.59l4.92-1.58c.23-.09.5-.09.77,0l4.92,1.58c.54.09,1.13-.14,1.4-.68ZM32.81,53.67c-4.97,0-8.99-4.02-8.99-8.99s4.02-8.99,8.99-8.99,8.99,4.02,8.99,8.99-4.02,8.99-8.99,8.99Z" 
                              fill="currentColor"
                            />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Gunningsbriefbouwer</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Stel je gunningsbrief op.</p>
                      </div>
                    </a>
                    <a 
                      href="/tools/wezenlijke-wijzigingscheck" 
                      className="block group border-b border-gray-100 hover:border-blue-200 pb-2"
                    >
                      <div className="relative">
                        <div className="absolute top-0 right-0 text-2xl font-bold text-gray-300 opacity-30 pointer-events-none">7</div>
                        <div className="flex items-center text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 65.62 84.38" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 text-gray-400 group-hover:text-blue-500"
                          >
                            <path 
                              d="M9.38,84.38h46.87c5.17,0,9.38-4.2,9.38-9.38V20.31c0-5.17-4.2-9.38-9.38-9.38h-6.25v-1.56c0-1.73-1.4-3.12-3.12-3.12h-5.22c-1.29-3.64-4.77-6.25-8.84-6.25s-7.55,2.61-8.84,6.25h-5.22c-1.73,0-3.12,1.4-3.12,3.12v1.56h-6.25C4.2,10.94,0,15.14,0,20.31v54.69c0,5.17,4.2,9.38,9.38,9.38ZM21.88,12.5h4.69c1.73,0,3.12-1.4,3.12-3.12s1.4-3.12,3.12-3.12,3.12,1.4,3.12,3.12,1.4,3.12,3.12,3.12h4.69v3.12h-21.88v-3.12ZM6.25,20.31c0-1.72,1.4-3.12,3.12-3.12h6.25v1.56c0,1.73,1.4,3.12,3.12,3.12h28.12c1.73,0,3.12-1.4,3.12-3.12v-1.56h6.25c1.72,0,3.12,1.4,3.12,3.12v54.69c0,1.72-1.4,3.12-3.12,3.12H9.38c-1.72,0-3.12-1.4-3.12-3.12V20.31Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M32.81,53.13c1.73,0,3.12-1.4,3.12-3.12v-12.5c0-1.73-1.4-3.12-3.12-3.12s-3.12,1.4-3.12,3.12v12.5c0,1.73,1.4,3.12,3.12,3.12Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M35.94,59.38c0,4.17-6.25,4.17-6.25,0s6.25-4.17,6.25,0" 
                              fill="currentColor"
                            />
                            <path 
                              d="M32.81,71.88c12.92,0,23.44-10.52,23.44-23.44s-10.52-23.44-23.44-23.44-23.44,10.52-23.44,23.44,10.52,23.44,23.44,23.44ZM32.81,31.25c9.48,0,17.19,7.71,17.19,17.19s-7.71,17.19-17.19,17.19-17.19-7.71-17.19-17.19,7.71-17.19,17.19-17.19Z" 
                              fill="currentColor"
                            />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Wijzigingscheck</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Check of er sprake is van een wezenlijke wijziging.</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Footer with CTA - Mobile */}
            <div className="p-6 border-t border-gray-100">
              <a 
                href="/prijzen"
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg text-center"
              >
                Start je proefperiode
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className={`hidden lg:block fixed inset-0 z-40 transition-opacity duration-300 ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Desktop Backdrop */}
        <div 
          className="absolute inset-0 bg-black/20"
          onClick={toggleMenu}
        />
        
        {/* Desktop Menu Content */}
        <div className={`fixed top-0 left-0 right-0 bg-white backdrop-blur-sm rounded-b-xl transform transition-transform duration-500 ease-out ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}>
          {/* Shadow that fades in after menu expansion */}
          <div className={`absolute inset-0 rounded-b-xl transition-all duration-300 ${
            isMenuOpen ? 'delay-300 shadow-2xl' : 'shadow-none'
          } -z-10`}></div>
          
          <div className="container mx-auto px-6 lg:px-8">
            <div className={`pt-16 py-8 transition-all duration-500 ease-out ${
              isMenuOpen ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-2'
            }`}>
              {/* Desktop Layout - Hoofdpagina's top row, Tools below */}
              <div className="space-y-8">
                {/* Hoofdpagina's - Top Row */}
                <div>
                  <h3 className={`text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 transition-all duration-400 ease-out ${
                    isMenuOpen ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-1'
                  }`}>Slimmer aanbesteden</h3>
                  <div className={`grid grid-cols-5 gap-4 transition-all duration-500 ease-out ${
                    isMenuOpen ? 'opacity-100 translate-y-0 delay-400' : 'opacity-0 translate-y-2'
                  }`}>
                    <a href="/" className="block group">
                      <div className="relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 button-image-overlay button-start-image">
                        <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Start</h4>
                      </div>
                    </a>
                    <a href="/over-tenderforce" className="block group">
                      <div className="relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 button-image-overlay button-tenderforce-image">
                        <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Over Tenderforce</h4>
                      </div>
                    </a>
                    <a href="/prijzen" className="block group">
                      <div className="relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 button-image-overlay button-prijzen-image">
                        <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Prijzen</h4>
                      </div>
                    </a>
                    <a href="/support" className="block group">
                      <div className="relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 button-image-overlay button-support-image">
                        <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Support</h4>
                      </div>
                    </a>
                    <a href="/kennisbank" className="block group">
                      <div className="relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 button-image-overlay button-kennisbank-image">
                        <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Kennisbank</h4>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Tools - Bottom Section */}
                <div>
                  <h3 className={`text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 transition-all duration-400 ease-out ${
                    isMenuOpen ? 'opacity-100 translate-y-0 delay-400' : 'opacity-0 translate-y-1'
                  }`}>Jouw Aanbestedingstools</h3>
                  <div className={`grid grid-cols-3 gap-4 transition-all duration-500 ease-out ${
                    isMenuOpen ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-2'
                  }`}>
                    <a href="/tools/stappenslang" className="block group">
                      <div className="relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200">
                        <div className="absolute -bottom-2 right-2 text-8xl font-bold text-gray-300 opacity-15 pointer-events-none leading-none group-hover:text-blue-500">1</div>
                        <div className="flex items-center mb-2">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 84.38 75" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 text-gray-400 group-hover:text-blue-500"
                          >
                            <path 
                              d="M73.44,7.81h-7.95c-.75-4.43-4.6-7.81-9.23-7.81h-28.12c-5.17,0-9.38,4.2-9.38,9.38v3.12c0,5.17,4.2,9.38,9.38,9.38h28.12c4.64,0,8.48-3.39,9.23-7.81h7.95c2.59,0,4.69,2.1,4.69,4.69v12.5c0,2.56-2.06,4.63-4.61,4.68l.21-.21c1.21-1.23,1.19-3.21-.04-4.42-1.23-1.21-3.21-1.19-4.42.04l-3.69,3.76c-.43-4.77-4.45-8.53-9.33-8.53h-28.12c-4.64,0-8.49,3.39-9.23,7.83-.05,0-.09-.02-.14-.02h-7.81c-6.03,0-10.94,4.91-10.94,10.94v12.5c0,6.03,4.91,10.94,10.94,10.94h1.28l-.65.66c-1.21,1.23-1.19,3.21.04,4.42.61.6,1.4.89,2.19.89s1.62-.31,2.23-.94l3.78-3.85c1.56,3,4.7,5.07,8.32,5.07h28.12c5.17,0,9.38-4.2,9.38-9.38v-3.12c0-5.17-4.2-9.38-9.38-9.38h-28.12c-4.6,0-8.43,3.33-9.22,7.71l-3.03-2.98c-1.23-1.21-3.21-1.19-4.42.04-1.21,1.23-1.19,3.21.04,4.42l.19.18h-.75c-2.59,0-4.69-2.1-4.69-4.69v-12.5c0-2.59,2.1-4.69,4.69-4.69h7.81s.09-.01.14-.02c.74,4.43,4.59,7.83,9.23,7.83h28.12c3.85,0,7.16-2.33,8.6-5.65l4.57,4.48c.61.6,1.4.89,2.19.89s1.62-.31,2.23-.94c1.21-1.23,1.19-3.21-.04-4.42l-.63-.62h.27c6.03,0,10.94-4.91,10.94-10.94v-12.5c0-6.03-4.91-10.94-10.94-10.94h0ZM59.38,12.5c0,1.72-1.4,3.12-3.12,3.12h-28.12c-1.72,0-3.12-1.4-3.12-3.12v-3.12c0-1.72,1.4-3.12,3.12-3.12h28.12c1.72,0,3.12,1.4,3.12,3.12v3.12ZM25,62.5c0-1.72,1.4-3.12,3.12-3.12h28.12c1.72,0,3.12,1.4,3.12,3.12v3.12c0,1.72-1.4,3.12-3.12,3.12h-28.12c-1.72,0-3.12-1.4-3.12-3.12v-3.12ZM59.38,39.06c0,1.72-1.4,3.12-3.12,3.12h-28.12c-1.72,0-3.12-1.4-3.12-3.12v-3.12c0-1.72,1.4-3.12,3.12-3.12h28.12c1.72,0,3.12,1.4,3.12,3.12v3.12Z" 
                              fill="currentColor"
                            />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Stappenslang</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Bepaal welke stappen je aanbesteding moet nemen.</p>
                      </div>
                    </a>
                    
                    <a href="/tools/aanbestedingsplicht-check" className="block group">
                      <div className="relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200">
                        <div className="absolute -bottom-2 right-2 text-8xl font-bold text-gray-300 opacity-15 pointer-events-none leading-none group-hover:text-blue-500">2</div>
                        <div className="flex items-center mb-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 group-hover:text-blue-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Aanbestedingsplicht check</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Check of je aanbestedingsplichtig bent.</p>
                      </div>
                    </a>
                    
                    <a href="/tools/opdrachtramer" className="block group">
                      <div className="relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200">
                        <div className="absolute -bottom-2 right-2 text-8xl font-bold text-gray-300 opacity-15 pointer-events-none leading-none group-hover:text-blue-500">3</div>
                        <div className="flex items-center mb-2">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 84.38 84.38" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 text-gray-400 group-hover:text-blue-500"
                          >
                            <path 
                              d="M9.38,84.37h45c.24,0,.48-.04.71-.09.05-.01.1-.03.15-.05.19-.05.36-.12.54-.21.02-.01.05-.02.08-.03l10.75-5.77c.64-.34,1.15-.91,1.42-1.59l15.79-39.12c1.61-4-.33-8.55-4.32-10.17l-5.8-2.34c-1.94-.78-4.06-.76-5.98.05-.78.33-1.46.8-2.09,1.35v-12.36c0-5.17-4.2-9.38-9.38-9.38h-3.12v-1.56c0-1.73-1.4-3.12-3.12-3.12s-3.12,1.4-3.12,3.12v1.56h-10.94v-1.56c0-1.73-1.4-3.12-3.12-3.12s-3.12,1.4-3.12,3.12v1.56h-10.94v-1.56c0-1.73-1.4-3.12-3.12-3.12s-3.12,1.4-3.12,3.12v1.56h-3.12C4.2,4.69,0,8.89,0,14.06v60.94c0,5.17,4.2,9.38,9.38,9.38h0ZM6.25,75V28.12h53.13v11.49l-11.64,28.85c-.27.68-.3,1.43-.08,2.12l2.42,7.54H9.38c-1.72,0-3.12-1.4-3.12-3.12h0ZM62.65,73.26l-6.45,3.46-2.24-6.97,11.27-27.93,8.7,3.51-11.27,27.93h0ZM69.32,31.68c.21-.52.62-.76.84-.85.23-.09.68-.22,1.2,0l5.8,2.34c.8.32,1.19,1.23.87,2.04l-1.75,4.35-8.7-3.51,1.75-4.35h0ZM9.38,10.93h3.12v1.56c0,1.73,1.4,3.12,3.12,3.12s3.12-1.4,3.12-3.12v-1.56h10.94v1.56c0,1.73,1.4,3.12,3.12,3.12s3.12-1.4,3.12-3.12v-1.56h10.94v1.56c0,1.73,1.4,3.12,3.12,3.12s3.12-1.4,3.12-3.12v-1.56h3.12c1.72,0,3.12,1.4,3.12,3.12v7.81H6.25v-7.81c0-1.72,1.4-3.12,3.12-3.12h0Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M17.19,42.18h31.25c1.73,0,3.12-1.4,3.12-3.12s-1.4-3.12-3.12-3.12h-31.25c-1.73,0-3.12,1.4-3.12,3.12s1.4,3.12,3.12,3.12Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M17.19,56.24h31.25c1.73,0,3.12-1.4,3.12-3.12s-1.4-3.12-3.12-3.12h-31.25c-1.73,0-3.12,1.4-3.12,3.12s1.4,3.12,3.12,3.12Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M40.63,64.06h-23.44c-1.73,0-3.12,1.4-3.12,3.12s1.4,3.12,3.12,3.12h23.44c1.73,0,3.12-1.4,3.12-3.12s-1.4-3.12-3.12-3.12Z" 
                              fill="currentColor"
                            />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Opdrachtramer</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Raam de grootte van je opdracht.</p>
                      </div>
                    </a>
                    
                    <a href="/tools/sectorale-verplichtingencheck" className="block group">
                      <div className="relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200">
                        <div className="absolute -bottom-2 right-2 text-8xl font-bold text-gray-300 opacity-15 pointer-events-none leading-none group-hover:text-blue-500">4</div>
                        <div className="flex items-center mb-2">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 65.62 84.38" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 text-gray-400 group-hover:text-blue-500"
                          >
                            <path 
                              d="M9.38,84.38h46.87c5.17,0,9.38-4.2,9.38-9.38V20.31c0-5.17-4.2-9.38-9.38-9.38h-6.25v-1.56c0-1.73-1.4-3.12-3.12-3.12h-5.22c-1.29-3.64-4.77-6.25-8.84-6.25s-7.55,2.61-8.84,6.25h-5.22c-1.73,0-3.12,1.4-3.12,3.12v1.56h-6.25C4.2,10.94,0,15.14,0,20.31v54.69c0,5.17,4.2,9.38,9.38,9.38ZM21.88,12.5h4.69c1.73,0,3.12-1.4,3.12-3.12s1.4-3.12,3.12-3.12,3.12,1.4,3.12,3.12,1.4,3.12,3.12,3.12h4.69v3.12h-21.88v-3.12ZM6.25,20.31c0-1.72,1.4-3.12,3.12-3.12h6.25v1.56c0,1.73,1.4,3.12,3.12,3.12h28.12c1.73,0,3.12-1.4,3.12-3.12v-1.56h6.25c1.72,0,3.12,1.4,3.12,3.12v54.69c0,1.72-1.4,3.12-3.12,3.12H9.38c-1.72,0-3.12-1.4-3.12-3.12V20.31Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M16.22,38.66c.61.61,1.41.91,2.21.91s1.6-.3,2.21-.91l5.52-5.52c1.22-1.22,1.22-3.2,0-4.42s-3.2-1.22-4.42,0l-3.32,3.31-1.11-1.11c-1.22-1.22-3.2-1.22-4.42,0s-1.22,3.2,0,4.42l3.32,3.32h0Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M16.22,54.29c.61.61,1.41.91,2.21.91s1.6-.3,2.21-.91l5.52-5.52c1.22-1.22,1.22-3.2,0-4.42s-3.2-1.22-4.42,0l-3.32,3.31-1.11-1.11c-1.22-1.22-3.2-1.22-4.42,0s-1.22,3.2,0,4.42l3.32,3.32h0Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M16.22,69.91c.61.61,1.41.91,2.21.91s1.6-.3,2.21-.91l5.52-5.52c1.22-1.22,1.22-3.2,0-4.42s-3.2-1.22-4.42,0l-3.32,3.31-1.11-1.11c-1.22-1.22-3.2-1.22-4.42,0s-1.22,3.2,0,4.42l3.32,3.32h0Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M34.38,37.5h17.19c1.73,0,3.12-1.4,3.12-3.12s-1.4-3.12-3.12-3.12h-17.19c-1.73,0-3.12,1.4-3.12,3.12s1.4,3.12,3.12,3.12Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M34.38,53.13h17.19c1.73,0,3.12-1.4,3.12-3.12s-1.4-3.12-3.12-3.12h-17.19c-1.73,0-3.12,1.4-3.12,3.12s1.4,3.12,3.12,3.12Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M34.38,68.75h17.19c1.73,0,3.12-1.4,3.12-3.12s-1.4-3.12-3.12-3.12h-17.19c-1.73,0-3.12,1.4-3.12,3.12s1.4,3.12,3.12,3.12Z" 
                              fill="currentColor"
                            />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Sectorale check</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Check welke sectorale wetgeving van toepassing is.</p>
                      </div>
                    </a>
                    
                    <a href="/tools/gemengde-opdracht-kwalificatie" className="block group">
                      <div className="relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200">
                        <div className="absolute -bottom-2 right-2 text-8xl font-bold text-gray-300 opacity-15 pointer-events-none leading-none group-hover:text-blue-500">5</div>
                        <div className="flex items-center mb-2">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 84.38 84.38" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 text-gray-400 group-hover:text-blue-500"
                          >
                            <path 
                              d="M75,65.63v6.25c0,6.89-5.61,12.5-12.5,12.5h-40.63c-6.89,0-12.5-5.61-12.5-12.5v-59.38c0-6.89,5.61-12.5,12.5-12.5h25c1.73,0,3.12,1.4,3.12,3.12s-1.4,3.12-3.12,3.12h-25c-3.45,0-6.25,2.8-6.25,6.25v59.38c0,3.45,2.8,6.25,6.25,6.25h40.63c3.45,0,6.25-2.8,6.25-6.25v-6.25c0-1.73,1.4-3.12,3.12-3.12s3.12,1.4,3.12,3.12ZM82.5,40.63c1.03,0,1.88-.85,1.88-1.88v-3.75c0-1.03-.85-1.88-1.88-1.88h-21.88v-6.25c0-1.03-.85-1.88-1.88-1.88h-3.75c-1.03,0-1.88.85-1.88,1.88v6.25h-21.88c-1.03,0-1.88.85-1.88,1.88v3.75c0,1.03.85,1.88,1.88,1.88h21.88v6.25c0,1.03.85,1.88,1.88,1.88h3.75c1.03,0,1.88-.85,1.88-1.88v-6.25h21.88Z" 
                              fill="currentColor"
                            />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Gemengde opdracht kwalificatie</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Check het drempelbedrag van je gemengde opdracht.</p>
                      </div>
                    </a>
                    
                    <a href="/tools/gunningsbriefbouwer" className="block group">
                      <div className="relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200">
                        <div className="absolute -bottom-2 right-2 text-8xl font-bold text-gray-300 opacity-15 pointer-events-none leading-none group-hover:text-blue-500">6</div>
                        <div className="flex items-center mb-2">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 65.62 84.37" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 text-gray-400 group-hover:text-blue-500"
                          >
                            <path 
                              d="M12.5,84.37h40.63c6.89,0,12.5-5.61,12.5-12.5V21.87c0-.83-.33-1.62-.91-2.21L45.96.91c-.59-.59-1.38-.91-2.21-.91H12.5C5.61,0,0,5.61,0,12.5v59.37c0,6.89,5.61,12.5,12.5,12.5h0ZM46.87,10.67l8.08,8.08h-8.08v-8.08ZM6.25,12.5c0-3.45,2.8-6.25,6.25-6.25h28.12v15.62c0,1.73,1.4,3.13,3.12,3.13h15.62v46.88c0,3.45-2.8,6.25-6.25,6.25H12.5c-3.45,0-6.25-2.8-6.25-6.25V12.5Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M27.17,61.26c-1.08,0-2.12-.63-2.62-1.58l-2.26-4.47-.86-.41-5.92,12.56c-.18.36.14.77.54.68l5.92-1.13c.23-.05.41.05.5.23l2.89,5.24c.18.36.68.32.86-.05l5.96-12.65-4.11,1.36c-.32.14-.59.23-.9.23Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M50.12,67.36l-5.92-12.6-.86.41-2.26,4.47c-.5.99-1.49,1.58-2.62,1.58-.32,0-.63-.05-.9-.14l-4.11-1.36,5.96,12.65c.18.36.68.36.86.05l2.89-5.24c.09-.18.32-.27.5-.23l5.92,1.13c.41.05.72-.36.54-.72Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M39.54,58.86l2.35-4.61c.14-.23.32-.41.54-.54l4.61-2.35c.54-.27.77-.9.59-1.45l-1.58-4.92c-.09-.23-.09-.5,0-.77l1.58-4.92c.18-.59-.09-1.17-.59-1.45l-4.61-2.35c-.23-.14-.41-.32-.54-.54l-2.35-4.52c-.27-.54-.9-.77-1.45-.59l-4.92,1.58c-.23.09-.5.09-.77,0l-4.88-1.63c-.59-.18-1.17.09-1.45.63l-2.35,4.61c-.14.23-.32.41-.54.54l-4.61,2.35c-.54.27-.81.9-.59,1.45l1.58,4.92c.09.23.09.5,0,.77l-1.58,4.92c-.18.59.09,1.17.59,1.45l4.61,2.35c.23.14.41.32.54.54l2.35,4.61c.27.54.9.77,1.45.59l4.92-1.58c.23-.09.5-.09.77,0l4.92,1.58c.54.09,1.13-.14,1.4-.68ZM32.81,53.67c-4.97,0-8.99-4.02-8.99-8.99s4.02-8.99,8.99-8.99,8.99,4.02,8.99,8.99-4.02,8.99-8.99,8.99Z" 
                              fill="currentColor"
                            />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Gunningsbriefbouwer</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Stel je gunningsbrief op.</p>
                      </div>
                    </a>
                    
                    <a href="/tools/wezenlijke-wijzigingscheck" className="block group">
                      <div className="relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200">
                        <div className="absolute -bottom-2 right-2 text-8xl font-bold text-gray-300 opacity-15 pointer-events-none leading-none group-hover:text-blue-500">7</div>
                        <div className="flex items-center mb-2">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 65.62 84.38" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 text-gray-400 group-hover:text-blue-500"
                          >
                            <path 
                              d="M9.38,84.38h46.87c5.17,0,9.38-4.2,9.38-9.38V20.31c0-5.17-4.2-9.38-9.38-9.38h-6.25v-1.56c0-1.73-1.4-3.12-3.12-3.12h-5.22c-1.29-3.64-4.77-6.25-8.84-6.25s-7.55,2.61-8.84,6.25h-5.22c-1.73,0-3.12,1.4-3.12,3.12v1.56h-6.25C4.2,10.94,0,15.14,0,20.31v54.69c0,5.17,4.2,9.38,9.38,9.38ZM21.88,12.5h4.69c1.73,0,3.12-1.4,3.12-3.12s1.4-3.12,3.12-3.12,3.12,1.4,3.12,3.12,1.4,3.12,3.12,3.12h4.69v3.12h-21.88v-3.12ZM6.25,20.31c0-1.72,1.4-3.12,3.12-3.12h6.25v1.56c0,1.73,1.4,3.12,3.12,3.12h28.12c1.73,0,3.12-1.4,3.12-3.12v-1.56h6.25c1.72,0,3.12,1.4,3.12,3.12v54.69c0,1.72-1.4,3.12-3.12,3.12H9.38c-1.72,0-3.12-1.4-3.12-3.12V20.31Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M32.81,53.13c1.73,0,3.12-1.4,3.12-3.12v-12.5c0-1.73-1.4-3.12-3.12-3.12s-3.12,1.4-3.12,3.12v12.5c0,1.73,1.4,3.12,3.12,3.12Z" 
                              fill="currentColor"
                            />
                            <path 
                              d="M35.94,59.38c0,4.17-6.25,4.17-6.25,0s6.25-4.17,6.25,0" 
                              fill="currentColor"
                            />
                            <path 
                              d="M32.81,71.88c12.92,0,23.44-10.52,23.44-23.44s-10.52-23.44-23.44-23.44-23.44,10.52-23.44,23.44,10.52,23.44,23.44,23.44ZM32.81,31.25c9.48,0,17.19,7.71,17.19,17.19s-7.71,17.19-17.19,17.19-17.19-7.71-17.19-17.19,7.71-17.19,17.19-17.19Z" 
                              fill="currentColor"
                            />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Wijzigingscheck</h4>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700">Check of er sprake is van een wezenlijke wijziging.</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation; 