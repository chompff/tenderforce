import React, { useState, useEffect, useRef } from 'react';

const Footer: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('nl');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'nl', name: 'Nederland', flag: 'https://flagcdn.com/w20/nl.png' },
    { code: 'en', name: 'United Kingdom', flag: 'https://flagcdn.com/w20/gb.png' },
    { code: 'de', name: 'Deutschland', flag: 'https://flagcdn.com/w20/de.png' },
    { code: 'fr', name: 'France', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'es', name: 'España', flag: 'https://flagcdn.com/w20/es.png' },
    { code: 'it', name: 'Italia', flag: 'https://flagcdn.com/w20/it.png' },
    { code: 'pl', name: 'Polska', flag: 'https://flagcdn.com/w20/pl.png' },
    { code: 'sv', name: 'Sverige', flag: 'https://flagcdn.com/w20/se.png' },
    { code: 'da', name: 'Danmark', flag: 'https://flagcdn.com/w20/dk.png' },
    { code: 'fi', name: 'Suomi', flag: 'https://flagcdn.com/w20/fi.png' },
  ];

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);
  const currentYear = new Date().getFullYear();

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Company Info - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity w-fit">
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
              <span className="text-xl font-bold text-gray-900">Tenderforce.ai</span>
            </a>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
              AI-gestuurde tools voor aanbestedingsprofessionals. 
              Vereenvoudig compliance en verhoog efficiëntie in uw aanbestedingsprocessen.
            </p>
            
            {/* Language Switcher */}
            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Beschikbaar in alle EU-landen
              </p>
              <div className="relative w-full max-w-xs" ref={dropdownRef}>
                {/* Custom Dropdown Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between text-sm bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedLang?.flag} 
                      alt={selectedLang?.name}
                      className="w-5 h-auto"
                    />
                    <span>{selectedLang?.name}</span>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Custom Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageSelect(lang.code)}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                      >
                        <img 
                          src={lang.flag} 
                          alt={lang.name}
                          className="w-5 h-auto"
                        />
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">Tenderforce.ai</p>
              <div className="space-y-1">
                <p>Kleverlaan 77</p>
                <p>2061 TD Bloemendaal</p>
                <p>The Netherlands</p>
              </div>
              <div className="pt-2">
                <a href="mailto:info@tenderforce.ai" className="text-blue-600 hover:text-blue-700 transition-colors">
                  info@tenderforce.ai
                </a>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Juridisch
            </h3>
            <div className="space-y-3">
              <a href="/privacybeleid" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Privacybeleid
              </a>
              <a href="/algemene-voorwaarden" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Algemene Voorwaarden
              </a>
              <a href="/disclaimer" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Disclaimer
              </a>
              <a href="/support" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Support
              </a>
            </div>
          </div>

          {/* AI Disclaimer */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              AI Disclaimer
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Deze tool gebruikt kunstmatige intelligentie voor informatiedoeleinden. 
              Resultaten zijn niet rechtsgeldig en vervangen geen professioneel juridisch advies. 
              Raadpleeg altijd een gekwalificeerde jurist voor definitieve beslissingen.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>© {currentYear} Tenderforce.ai</span>
              <span>•</span>
              <span>Alle rechten voorbehouden</span>
              <span>•</span>
              <span className="flex items-center space-x-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-green-500">
                  <circle cx="12" cy="12" r="10" fill="currentColor"/>
                </svg>
                <span>Powered by AI</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 