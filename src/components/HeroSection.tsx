import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete, { AutocompleteRef } from './Autocomplete';



interface Suggestion {
  code: string;
  description: string;
}

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const autocompleteRef = useRef<AutocompleteRef>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [isFooterInView, setIsFooterInView] = useState(false);

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    console.log('Selected:', suggestion);
    navigate(`/results/${suggestion.code}`);
  };

  const handlePillClick = (searchTerm: string) => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setQuery(searchTerm);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterInView(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden flex flex-col">

        
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-20"></div>
        </div>

        {/* Main content - flex-1 to fill remaining space */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              De kortste route naar<br /><span className="text-blue-600">een complete aanbesteding</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Automatiseer structuur, inhoud én documentatie met Tenderforce.<br />
              <strong>Typ hier wat je wilt aanbesteden:</strong>
            </p>

            <div className="mb-8">
              <Autocomplete 
                ref={autocompleteRef}
                placeholder="Bijv. kantoormeubilair, IT-diensten, schoonmaak..."
                onSelect={handleSuggestionSelect}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-gray-500 flex items-center">Populaire zoekopdrachten:</span>
              <button 
                onClick={() => handlePillClick('Kantoormeubilair')}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                Kantoormeubilair
              </button>
              <button 
                onClick={() => handlePillClick('IT-diensten')}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                IT-diensten
              </button>
              <button 
                onClick={() => handlePillClick('Bouwwerkzaamheden')}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                Bouwwerkzaamheden
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator - positioned at bottom */}
        <div className={`relative z-10 pb-8 text-center transition-opacity duration-500 ${
          isFooterInView ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="text-gray-400">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm">Scroll voor meer informatie</span>
              <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      

    </>
  );
};

export default HeroSection;
