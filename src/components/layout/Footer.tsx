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
                viewBox="0 0 926 851.98"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path className="fill-[#002da0]" d="M926,157.99v536c0,86.41-69.37,156.62-155.45,157.98h-120.98s-373.14.01-373.14.01h0s-120.98-.01-120.98-.01C69.37,850.61,0,780.4,0,693.99V157.99C0,71.41,69.64,1.1,155.96,0h614.08c86.32,1.1,155.96,71.41,155.96,157.99Z"/>
                <polygon className="fill-[#fdcc00]" points="463.1 123.13 473.12 152.32 503.98 152.83 479.32 171.38 488.37 200.89 463.1 183.16 437.84 200.89 446.89 171.38 422.22 152.83 453.08 152.32 463.1 123.13"/>
                <polygon className="fill-[#fdcc00]" points="205.2 383.91 215.22 413.11 246.08 413.62 221.41 432.17 230.46 461.67 205.2 443.95 179.93 461.67 188.99 432.17 164.32 413.62 195.18 413.11 205.2 383.91"/>
                <polygon className="fill-[#fdcc00]" points="238.62 252.48 248.64 281.67 279.5 282.18 254.83 300.73 263.88 330.24 238.62 312.51 213.35 330.24 222.4 300.73 197.74 282.18 228.6 281.67 238.62 252.48"/>
                <polygon className="fill-[#fdcc00]" points="333.43 159.29 343.45 188.48 374.31 188.99 349.64 207.54 358.69 237.05 333.43 219.32 308.16 237.05 317.22 207.54 292.55 188.99 323.41 188.48 333.43 159.29"/>
                <polygon className="fill-[#fdcc00]" points="687.08 252.48 677.06 281.67 646.2 282.18 670.87 300.73 661.82 330.24 687.08 312.51 712.35 330.24 703.29 300.73 727.96 282.18 697.1 281.67 687.08 252.48"/>
                <polygon className="fill-[#fdcc00]" points="238.62 512.87 248.64 542.07 279.5 542.57 254.83 561.12 263.88 590.63 238.62 572.9 213.35 590.63 222.4 561.12 197.74 542.57 228.6 542.07 238.62 512.87"/>
                <polygon className="fill-[#fdcc00]" points="687.08 512.87 677.06 542.07 646.2 542.57 670.87 561.12 661.82 590.63 687.08 572.9 712.35 590.63 703.29 561.12 727.96 542.57 697.1 542.07 687.08 512.87"/>
                <polygon className="fill-[#fdcc00]" points="592.27 159.29 582.25 188.48 551.39 188.99 576.06 207.54 567 237.05 592.27 219.32 617.53 237.05 608.48 207.54 633.15 188.99 602.29 188.48 592.27 159.29"/>
                <polygon className="fill-[#fdcc00]" points="333.43 606.06 343.45 635.25 374.31 635.76 349.64 654.31 358.69 683.82 333.43 666.09 308.16 683.82 317.22 654.31 292.55 635.76 323.41 635.25 333.43 606.06"/>
                <polygon className="fill-[#fdcc00]" points="592.27 606.06 582.25 635.25 551.39 635.76 576.06 654.31 567 683.82 592.27 666.09 617.53 683.82 608.48 654.31 633.15 635.76 602.29 635.25 592.27 606.06"/>
                <polygon className="fill-[#fdcc00]" points="722.78 383.91 732.8 413.11 763.66 413.62 739 432.17 748.05 461.67 722.78 443.95 697.52 461.67 706.57 432.17 681.9 413.62 712.76 413.11 722.78 383.91"/>
                <polygon className="fill-[#fdcc00]" points="463.1 641.83 473.12 671.02 503.98 671.53 479.32 690.08 488.37 719.59 463.1 701.86 437.84 719.59 446.89 690.08 422.22 671.53 453.08 671.02 463.1 641.83"/>
              </svg>
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
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">EED Tool</p>
                <p>Kleverlaan 77</p>
                <p>2061 TD Bloemendaal</p>
                <p>The Netherlands</p>
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
              <span>© {currentYear} Pacem Holding BV</span>
              <span>•</span>
              <span>Alle rechten voorbehouden</span>
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