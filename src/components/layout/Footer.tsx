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
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">EED TOOL</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                  BETA
                </span>
              </div>
            </a>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
              Tool voor aanbestedingsprofessionals om hun EED en GPP verplichtingen in kaart te brengen. 
              Vereenvoudig compliance en verhoog efficiëntie in uw aanbestedingsprocessen.
              <br /><br />
              Feedback is welkom: <a href="mailto:feedback@eedtool.eu" className="text-blue-600 hover:text-blue-800 underline">feedback@eedtool.eu</a>
            </p>
          </div>

          {/* Over Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Over
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Pacem Holding B.V.</p>
                <p className="leading-relaxed">Ons team bestaat uit ervaren ontwikkelaars en experts in Europese regelgeving. Samen zorgen wij dat u voldoet aan de laatste verplichtingen.</p>
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
            </div>
          </div>

          {/* Disclaimer */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Disclaimer
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Deze tool is in BETA. 
              Resultaten zijn niet rechtsgeldig en vervangen geen professioneel juridisch advies. 
              Raadpleeg altijd een gekwalificeerde jurist voor definitieve beslissingen.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>© {currentYear} Chömpff</span>
              <span>•</span>
              <span>Alle rechten voorbehouden</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="https://www.linkedin.com/in/sharon-ch%C3%B6mpff/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
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