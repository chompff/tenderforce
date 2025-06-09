import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete, { AutocompleteRef } from './Autocomplete';


import { useUrlStateNoRerender } from '../hooks/useUrlStateNoRerender';

interface Suggestion {
  code: string;
  description: string;
}

const GunningsbriefbouwwerHero: React.FC = () => {
  const navigate = useNavigate();
  const autocompleteRef = useRef<AutocompleteRef>(null);
  const { getStateFromUrl, setStateInUrl } = useUrlStateNoRerender();

  useEffect(() => {
    const urlState = getStateFromUrl();
    if (urlState.code) {
      if (autocompleteRef.current) autocompleteRef.current.setQuery(urlState.code);
    }
  }, []);

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setStateInUrl({ code: suggestion.code });
    navigate(`/results/${suggestion.code}`);
  };

  const handlePillClick = (searchTerm: string) => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setQuery(searchTerm);
    }
  };

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
              <span className="text-blue-600">Gunningsbriefbouwer</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Stel je gunningsbrief op.<br />
              Typ hier wat je wilt aanbesteden:
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
        <div className="relative z-10 pb-8 text-center">
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

export default GunningsbriefbouwwerHero; 