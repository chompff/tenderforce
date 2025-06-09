import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { fetchSuggestions } from '../utils/mockApi';

interface Suggestion {
  code: string;
  description: string;
}

interface AutocompleteProps {
  placeholder?: string;
  onSelect?: (suggestion: Suggestion) => void;
}

export interface AutocompleteRef {
  setQuery: (query: string) => void;
  reset: () => void;
}

const Autocomplete = forwardRef<AutocompleteRef, AutocompleteProps>(({ 
  placeholder = "Type een inkooponderwerp...", 
  onSelect 
}, ref) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValidMatch, setHasValidMatch] = useState(false);
  const [dotCount, setDotCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const animationTimer = useRef<NodeJS.Timeout>();

  // Extract the base text and dots from placeholder
  const basePlaceholder = placeholder.replace('...', '');
  const hasDots = placeholder.includes('...');

  useImperativeHandle(ref, () => ({
    setQuery: (newQuery: string) => {
      setQuery(newQuery);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    reset: () => {
      setQuery('');
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      setLoading(false);
      setIsFocused(false);
      setHasValidMatch(false);
      setDotCount(0);
    }
  }), []);

  // Stable debounced fetch function
  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setHasValidMatch(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchSuggestions(searchQuery);
      setSuggestions(data.suggestions || []);
      setIsOpen(true);
      setSelectedIndex(-1);
      
      // Only set hasValidMatch if there's an exact match or very close match
      const hasExactMatch = data.suggestions && data.suggestions.some(s => 
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.includes(searchQuery)
      );
      setHasValidMatch(hasExactMatch && searchQuery.length >= 3);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setHasValidMatch(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced effect for query changes
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      getSuggestions(query);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, getSuggestions]);

  // Dot animation effect
  useEffect(() => {
    if (!hasDots || query || isFocused) {
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
      return;
    }

    const animateDots = () => {
      // Step 1: First dot (0s)
      setDotCount(1);
      animationTimer.current = setTimeout(() => {
        // Step 2: Second dot (0.5s)
        setDotCount(2);
        animationTimer.current = setTimeout(() => {
          // Step 3: Third dot (1.0s)
          setDotCount(3);
          animationTimer.current = setTimeout(() => {
            // Step 4: No dots (1.5s)
            setDotCount(0);
            animationTimer.current = setTimeout(() => {
              // Restart animation (2.0s)
              animateDots();
            }, 500); // 500ms pause
          }, 500); // 500ms for third dot
        }, 500); // 500ms for second dot
      }, 500); // 500ms for first dot
    };

    animateDots();

    return () => {
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
    };
  }, [hasDots, query, isFocused]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (suggestion: Suggestion) => {
    setQuery(`${suggestion.code} - ${suggestion.description}`);
    setIsOpen(false);
    setSelectedIndex(-1);
    setHasValidMatch(true);
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  const handleArrowClick = () => {
    if (hasValidMatch && suggestions.length > 0) {
      // Select the best match (first suggestion)
      handleSelect(suggestions[0]);
    }
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Animated placeholder component with fixed width to prevent text dancing
  const AnimatedPlaceholder = () => {
    if (!hasDots || query || isFocused) return null;
    
    return (
      <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none text-lg text-gray-400">
        <span>{basePlaceholder}</span>
        <span className="inline-block w-6 text-left">
          {'.'.repeat(dotCount)}
        </span>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={hasDots ? "" : placeholder}
          className="w-full pl-12 pr-20 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none shadow-sm"
        />
        <AnimatedPlaceholder />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          ) : (
            <div className="flex items-center gap-2">
              {hasValidMatch && (
                <button
                  onClick={handleArrowClick}
                  disabled={!hasValidMatch}
                  className="text-green-600 font-medium animate-fade-in hover:text-green-700 transition-colors duration-200 cursor-pointer"
                >
                  Check
                </button>
              )}
              <button
                onClick={handleArrowClick}
                disabled={!hasValidMatch}
                className={`transition-colors duration-200 ${
                  hasValidMatch 
                    ? 'text-green-600 cursor-pointer hover:text-green-700' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-[9999] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.code}-${index}`}
              onClick={() => handleSelect(suggestion)}
              className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                index === selectedIndex 
                  ? 'bg-blue-50 border-l-4 border-blue-500' 
                  : 'hover:bg-gray-50'
              } ${index === 0 ? 'rounded-t-xl' : ''} ${index === suggestions.length - 1 ? 'rounded-b-xl' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium flex-shrink-0">
                  {suggestion.code}
                </span>
                <span className="text-gray-800 flex-1 leading-relaxed text-left">
                  {suggestion.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && suggestions.length === 0 && !loading && (
        <div className="absolute z-[9999] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
          <p className="text-gray-500 text-center">Geen resultaten gevonden voor "{query}"</p>
        </div>
      )}
    </div>
  );
});

Autocomplete.displayName = 'Autocomplete';

export default Autocomplete;
