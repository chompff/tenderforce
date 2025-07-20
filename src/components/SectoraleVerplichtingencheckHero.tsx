import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete, { AutocompleteRef } from './Autocomplete';


import { useUrlStateNoRerender } from '../hooks/useUrlStateNoRerender';
import { useStealthMode } from '@/lib/utils';

interface Suggestion {
  code: string;
  description: string;
  type_aanbesteding?: string;
}

const SectoraleVerplichtingencheckHero: React.FC = () => {
  const navigate = useNavigate();
  const { isStealthMode } = useStealthMode();
  const autocompleteRef = useRef<AutocompleteRef>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'input' | 'organization' | 'private-funding' | 'estimation' | 'sectoral-assessment' | 'high-threshold'>('input');
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [selectedDescription, setSelectedDescription] = useState<string>('');
  const [organizationType, setOrganizationType] = useState<string>('');
  const [typeAanbesteding, setTypeAanbesteding] = useState<string>('');
  const [showHighThresholdWarning, setShowHighThresholdWarning] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isPrivateEnterprise, setIsPrivateEnterprise] = useState(false);
  const [privateFundingQuestion, setPrivateFundingQuestion] = useState<'pending' | 'yes' | 'no' | null>(null);
  const [showExceptionNotification, setShowExceptionNotification] = useState(false);
  const [selectedExceptionType, setSelectedExceptionType] = useState<string>('');

  const { getStateFromUrl, setStateInUrl } = useUrlStateNoRerender();

  // Intersection Observer for footer visibility
  useEffect(() => {
    const footerElement = footerRef.current;
    if (!footerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If footer is visible, hide scroll indicator
          setShowScrollIndicator(!entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
        rootMargin: '0px 0px -10% 0px' // Start fading a bit before footer is fully visible
      }
    );

    observer.observe(footerElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Restore state from URL parameters
  useEffect(() => {
    const urlState = getStateFromUrl();
    if (urlState.step) {
      if (urlState.code) {
        setSelectedCode(urlState.code);
        setSelectedDescription('Laden...');
        import('../utils/cpvLookup').then(({ getCpvName }) => {
          getCpvName(urlState.code).then(setSelectedDescription);
        });
      }
      if (urlState.org) {
        setOrganizationType(urlState.org);
        setTypeAanbesteding('Diensten');
      }
      if (urlState.step === '3') {
        setPhase('estimation');
      } else if (urlState.step === '2') {
        setPhase('organization');
      } else if (urlState.step === 'sectoral') {
        setPhase('sectoral-assessment');
      } else if (urlState.step === 'private-funding') {
        setPhase('private-funding');
      } else if (urlState.step === '4') {
        setPhase('high-threshold');
      } else {
        setPhase('input');
      }
    }
  }, []);

  // Threshold matrix based on organization type and type aanbesteding
  const getThresholdAmount = (orgType: string, aanbestedingType: string): string => {
    const thresholds: Record<string, Record<string, string>> = {
      'rijksoverheid': {
        'Werken': '€5.538.000',
        'Leveringen': '€143.000', 
        'Diensten': '€143.000',
        'Concessie': '€5.538.000'
      },
      'decentraal': {
        'Werken': '€5.538.000',
        'Leveringen': '€221.000',
        'Diensten': '€221.000', 
        'Concessie': '€5.538.000'
      },
      'publiekrechterlijk': {
        'Werken': '€5.538.000',
        'Leveringen': '€221.000',
        'Diensten': '€221.000',
        'Concessie': '€5.538.000'
      }
    };
    
    const threshold = thresholds[orgType]?.[aanbestedingType] || '€221.000';
    console.log(`💰 Threshold calculation: ${orgType} + ${aanbestedingType} = ${threshold}`);
    return threshold;
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setSelectedCode(suggestion.code);
    setSelectedDescription(suggestion.description);
    setOrganizationType('');
    setTypeAanbesteding(suggestion.type_aanbesteding || 'Diensten');
    setPhase('organization');
    setStateInUrl({ code: suggestion.code, step: '2' });
  };

  const handlePillClick = (searchTerm: string) => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setQuery(searchTerm);
    }
  };

  const handleOrganizationSelect = (organizationType: string) => {
    if (!selectedCode) return;
    setOrganizationType(organizationType);
    if (organizationType === 'private') {
      setIsPrivateEnterprise(true);
      setPrivateFundingQuestion('pending');
      setPhase('private-funding');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'private-funding' });
      return;
    }
    setIsPrivateEnterprise(false);
    setPrivateFundingQuestion(null);
    setPhase('estimation');
    setStateInUrl({ code: selectedCode, org: organizationType, step: '3' });
  };

  const handleEstimationSelect = (answer: string) => {
    if (!selectedCode || !organizationType) return;
    if (answer === 'yes') {
      setPhase('high-threshold');
      setStateInUrl({ code: selectedCode, org: organizationType, step: '4', estimation: answer });
      return;
    }
    setPhase('sectoral-assessment');
    setStateInUrl({ code: selectedCode, org: organizationType, step: 'sectoral', estimation: answer });
  };

  const handleHighThresholdSelect = (answer: string) => {
    if (!selectedCode || !organizationType) return;
    if (answer === 'yes') {
      setShowHighThresholdWarning(true);
      setStateInUrl({ code: selectedCode, org: organizationType, step: '4', estimation: answer });
      return;
    }
    // Route to sectoral assessment instead of direct to results
    setPhase('sectoral-assessment');
    setStateInUrl({ code: selectedCode, org: organizationType, step: 'sectoral', estimation: 'yes' });
  };

  const handleSectoralAssessmentSelect = (exception: string) => {
    if (!selectedCode || !organizationType) return;
    if (exception === 'none') {
      // No exception - show sectoral obligations (normal sectoral rules apply)
      sessionStorage.setItem('lastPath', `/tools/sectorale-verplichtingencheck?code=${selectedCode}&org=${organizationType}&step=sectoral`);
      navigate(`/results/${selectedCode}?org=${organizationType}&estimation=yes`);
    } else {
      // Has exception - show exception notification (no sectoral obligations apply)
      setSelectedExceptionType(exception);
      setShowExceptionNotification(true);
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'sectoral', exception: exception });
    }
  };

  const handleProgressStepClick = (step: number) => {
    if (step === 1) {
      setPhase('input');
      if (autocompleteRef.current) autocompleteRef.current.reset();
      setSelectedCode('');
      setSelectedDescription('');
      setOrganizationType('');
      setTypeAanbesteding('');
      setStateInUrl({});
    } else if (step === 2 && organizationType) {
      setPhase('organization');
      setStateInUrl({ code: selectedCode, org: organizationType, step: '2' });
    }
  };

  const ProgressBar = () => (
    <div className="mt-8">
      <div className="flex items-center justify-center space-x-2 max-w-3xl mx-auto">
        {/* Step 1 - Completed and Clickable */}
        <button 
          onClick={() => handleProgressStepClick(1)}
          className="flex items-center hover:scale-105 transition-all duration-200 group"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
          </div>
          <div className="ml-3 text-left">
            <div className="text-sm font-semibold text-green-700">Zoeken</div>
            <div className="text-xs text-green-600">Voltooid</div>
          </div>
        </button>
        
        {/* Connector 1 */}
        <div className="flex-1 max-w-20">
          <div className={`h-1 rounded-full transition-all duration-500 ${
            phase === 'estimation' || phase === 'sectoral-assessment' || phase === 'high-threshold'
              ? 'bg-green-500' 
              : phase === 'organization'
                ? 'bg-gradient-to-r from-green-500 to-orange-500'
                : 'bg-gray-200'
          }`}></div>
        </div>
        
        {/* Step 2 - Completed or Current */}
        <button 
          onClick={() => handleProgressStepClick(2)}
          className={`flex items-center transition-all duration-200 group ${organizationType ? 'hover:scale-105' : 'cursor-default'}`}
          disabled={!organizationType}
        >
          <div className="relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              phase === 'estimation' || phase === 'sectoral-assessment' || phase === 'high-threshold'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white group-hover:shadow-xl' 
                : phase === 'organization' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-200 group-hover:shadow-xl' 
                  : 'bg-gray-200 text-gray-500'
            }`}>
              {phase === 'estimation' || phase === 'sectoral-assessment' || phase === 'high-threshold' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
            </div>
            <div className={`absolute -inset-1 rounded-full opacity-20 transition-opacity ${
              phase === 'estimation' || phase === 'sectoral-assessment' || phase === 'high-threshold'
                ? 'bg-gradient-to-r from-green-400 to-emerald-400 group-hover:opacity-30' 
                : phase === 'organization' 
                  ? 'bg-gradient-to-r from-orange-400 to-amber-400 group-hover:opacity-30' 
                  : 'bg-gray-300'
            }`}></div>
          </div>
          <div className="ml-3 text-left">
            <div className={`text-sm font-semibold transition-colors ${
              phase === 'estimation' || phase === 'sectoral-assessment' || phase === 'high-threshold'
                ? 'text-green-700' 
                : phase === 'organization' 
                  ? 'text-orange-700' 
                  : 'text-gray-500'
            }`}>Organisatie</div>
            <div className={`text-xs transition-colors ${
              phase === 'estimation' || phase === 'sectoral-assessment' || phase === 'high-threshold'
                ? 'text-green-600' 
                : phase === 'organization' 
                  ? 'text-orange-600' 
                  : 'text-gray-400'
            }`}>
              {phase === 'estimation' || phase === 'sectoral-assessment' || phase === 'high-threshold' ? 'Voltooid' : phase === 'organization' ? 'Actief' : 'Wachtend'}
            </div>
          </div>
        </button>
        
        {/* Connector 2 */}
        <div className="flex-1 max-w-20">
          <div className={`h-1 rounded-full transition-all duration-500 ${
            phase === 'high-threshold'
              ? 'bg-green-500'
              : phase === 'estimation' || phase === 'sectoral-assessment'
              ? 'bg-gradient-to-r from-green-500 to-orange-500' 
              : 'bg-gray-200'
          }`}></div>
        </div>
        
        {/* Step 3 - Current or Next */}
        <button 
          onClick={() => {
            if (phase === 'high-threshold') {
              setPhase('estimation');
              setShowHighThresholdWarning(false);
            }
          }}
          className={`flex items-center transition-all duration-200 group ${
            phase === 'high-threshold' ? 'hover:scale-105 cursor-pointer' : 'cursor-default'
          }`}
          disabled={phase !== 'high-threshold' && phase !== 'estimation' && phase !== 'sectoral-assessment'}
        >
          <div className="relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              phase === 'high-threshold'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white group-hover:shadow-xl'
                : phase === 'estimation' || phase === 'sectoral-assessment'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-200' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {phase === 'high-threshold' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className={`absolute -inset-1 rounded-full opacity-20 transition-opacity ${
              phase === 'high-threshold'
                ? 'bg-gradient-to-r from-green-400 to-emerald-400 group-hover:opacity-30'
                : phase === 'estimation' || phase === 'sectoral-assessment'
                ? 'bg-gradient-to-r from-orange-400 to-amber-400' 
                : 'bg-gray-300'
            }`}></div>
          </div>
          <div className="ml-3 text-left">
            <div className={`text-sm font-semibold transition-colors ${
              phase === 'high-threshold' 
                ? 'text-green-700'
                : phase === 'estimation' || phase === 'sectoral-assessment'
                ? 'text-orange-700' 
                : 'text-gray-500'
            }`}>Drempelwaarde</div>
            <div className={`text-xs transition-colors ${
              phase === 'high-threshold' 
                ? 'text-green-600'
                : phase === 'estimation' || phase === 'sectoral-assessment'
                ? 'text-orange-600' 
                : 'text-gray-400'
            }`}>
              {phase === 'high-threshold' ? 'Voltooid' : (phase === 'estimation' || phase === 'sectoral-assessment') ? 'Actief' : 'Wachtend'}
            </div>
          </div>
        </button>

        {/* Step 4 - FSR Check - Only show when in high-threshold phase */}
        {phase === 'high-threshold' && (
          <>
            {/* Connector 3 - Only show when FSR check is relevant */}
            <div className="flex-1 max-w-20">
              <div className="h-1 rounded-full transition-all duration-500 bg-gradient-to-r from-green-500 to-orange-500"></div>
            </div>
            
            <div className="flex items-center group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-200 rounded-full flex items-center justify-center shadow-lg transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full opacity-20 transition-opacity"></div>
              </div>
              <div className="ml-3 text-left">
                <div className="text-sm font-semibold text-orange-700">FSR check</div>
                <div className="text-xs text-orange-600">Actief</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

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
          <div className="w-full text-center">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                <span className="text-blue-600">
                  EED Tool
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Controleer welke EED verplichtingen van toepassing zijn. (Europese Energie-Efficiëntierichtlijn (EU) 2023/1791)<br />
                <span className="font-bold">
                  {phase === 'input'
                    ? 'Typ hier wat je wilt aanbesteden:'
                    : phase === 'organization'
                    ? 'Tot welke organisatie behoort u?'
                    : phase === 'private-funding'
                    ? 'Wordt deze onderneming voor meer dan 50% gefinancierd met publieke middelen?'
                    : phase === 'sectoral-assessment'
                    ? 'Is er een uitzondering van toepassing?'
                    : phase === 'high-threshold'
                    ? 'Is het een geraamde waarde van €250 miljoen of meer?'
                    : `Komt je raming boven de drempelwaarde van ${getThresholdAmount(organizationType, typeAanbesteding)} uit?`
                  }
                </span>
              </p>
            </div>

            {/* Dynamic content area */}
            <div className="relative min-h-[300px]">
              {/* Input Phase */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'input' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="max-w-6xl mx-auto">
                  <div className="mb-8">
                    <Autocomplete 
                      ref={autocompleteRef}
                      placeholder="Bijv. kantoormeubilair, IT-diensten, schoonmaak..."
                      onSelect={handleSuggestionSelect}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="text-sm text-gray-500 flex items-center">Voorbeeld zoekopdrachten:</span>
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

              {/* Organization Selection Phase */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'organization' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                {/* Organization Type Buttons - Full Width */}
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-6 mb-8">
                      <button
                        onClick={() => handleOrganizationSelect('rijksoverheid')}
                        className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                      >
                        <span className="text-xl font-bold text-gray-900 block mb-3">Rijksoverheid</span>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Ministeries, uitvoerende diensten en andere rijksorganisaties die namens de Nederlandse staat aanbesteden.
                        </p>
                      </button>
                      
                      <button
                        onClick={() => handleOrganizationSelect('decentraal')}
                        className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                      >
                        <span className="text-xl font-bold text-gray-900 block mb-3">Decentraal</span>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Provincies, gemeenten, waterschappen en andere lokale overheden die zelfstandig aanbesteden binnen hun gebied.
                        </p>
                      </button>
                      
                      <button
                        onClick={() => handleOrganizationSelect('publiekrechterlijk')}
                        className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                      >
                        <span className="text-xl font-bold text-gray-900 block mb-3">Publiekrechtelijk</span>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Zorgverzekeraars, woningcorporaties en andere organisaties met een publieke taak die aanbesteden volgens de wet.
                        </p>
                      </button>

                      <button
                        onClick={() => handleOrganizationSelect('private')}
                        className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                      >
                        <span className="text-xl font-bold text-gray-900 block mb-3">Private onderneming</span>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Commerciële bedrijven of andere private organisaties die mogelijk met publieke middelen gefinancierd worden.
                        </p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back Navigation */}
                <div className="max-w-6xl mx-auto text-center">
                  <button
                    onClick={() => {
                      setPhase('input');
                      if (autocompleteRef.current) autocompleteRef.current.reset();
                      setSelectedCode('');
                      setSelectedDescription('');
                      setOrganizationType('');
                      setTypeAanbesteding('');
                      setStateInUrl({});
                    }}
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                  >
                    Vorige stap
                  </button>
                </div>
              </div>

              {/* Private Funding Question */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'private-funding' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto mb-8">
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={() => {
                            setPrivateFundingQuestion('yes');
                            setOrganizationType('publiekrechterlijk');
                            setPhase('estimation');
                            setStateInUrl({ code: selectedCode, org: 'publiekrechterlijk', step: '3' });
                          }}
                          className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                        >
                          <span className="text-xl font-bold text-gray-900 block mb-3">Ja</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            De onderneming wordt behandeld als een publiekrechtelijke instelling voor deze check.
                          </p>
                        </button>
                        <button
                          onClick={() => {
                            setPrivateFundingQuestion('no');
                            navigate(`/results/${selectedCode}?org=private&estimation=no`);
                          }}
                          className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                        >
                          <span className="text-xl font-bold text-gray-900 block mb-3">Nee</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Geen sectorale verplichtingen van toepassing.
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sectoral Assessment Phase */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'sectoral-assessment' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                {/* Show exception notification if user selected an exception */}
                {showExceptionNotification ? (
                  <div className={`w-full transition-all duration-500 ease-in-out ${showExceptionNotification ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="container mx-auto px-6 lg:px-8 pb-48 mb-12">
                      <div className="max-w-4xl mx-auto p-8 bg-orange-50 border-2 border-orange-200 rounded-xl shadow-lg">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold text-orange-900 mb-4">Uitzondering van toepassing: {selectedExceptionType}</h2>
                          <p className="text-orange-800 mb-6 leading-relaxed">
                            Voor aanbestedingen die vallen onder de categorie "{selectedExceptionType}" is de EED niet van toepassing.
                          </p>
                          <div className="bg-white border border-orange-300 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-orange-900 mb-3">Wat betekent dit?</h3>
                            <ul className="text-left text-orange-800 space-y-2">
                              <li className="flex items-start">
                                <span className="text-orange-600 mr-2">•</span>
                                Er kunnen specifieke procedures gelden voor deze categorie
                              </li>
                              <li className="flex items-start">
                                <span className="text-orange-600 mr-2">•</span>
                                De EED is niet van toepassing
                              </li>
                              <li className="flex items-start">
                                <span className="text-orange-600 mr-2">•</span>
                                Raadpleeg de relevante wetgeving voor {selectedExceptionType.toLowerCase()}
                              </li>
                              <li className="flex items-start">
                                <span className="text-orange-600 mr-2">•</span>
                                Overleg met juridisch advies indien nodig
                              </li>
                            </ul>
                          </div>
                          <a 
                            href="https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX%3A32009L0081" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors mr-4"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Meer informatie
                          </a>
                          
                          <div className="mt-4">
                            <span 
                              onClick={() => setShowExceptionNotification(false)}
                              className="text-orange-600 hover:text-orange-800 cursor-pointer transition-colors underline"
                            >
                              Terug naar vorige stap
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show sectoral assessment options
                  <div className="w-full">
                    <div className="container mx-auto px-6 lg:px-8">
                      {/* Nee button - full width at top */}
                      <div className="max-w-6xl mx-auto mb-6">
                        <button
                          onClick={() => handleSectoralAssessmentSelect('none')}
                          className="group w-full p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                        >
                          <span className="text-xl font-bold text-gray-900 block mb-3">Nee</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            De EED is volledig van toepassing. (Geen uitzondering op basis van defensie, crisis of militaire aard.)
                          </p>
                        </button>
                      </div>
                      
                      {/* Other buttons - grid layout below */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center max-w-6xl mx-auto mb-8">
                        <button
                          onClick={() => handleSectoralAssessmentSelect('defensie')}
                          className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                        >
                          <span className="text-xl font-bold text-gray-900 block mb-3">Conflict met defensie-activiteit</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Toepassing EED is strijdig met het primaire doel van een defensiegerelateerde activiteit, zoals nationale veiligheid.
                          </p>
                        </button>
                        
                        <button
                          onClick={() => handleSectoralAssessmentSelect('noodsituatie')}
                          className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                        >
                          <span className="text-xl font-bold text-gray-900 block mb-3">Noodsituatie</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Urgente aanbestedingen in noodsituaties of crisissituaties.
                          </p>
                        </button>
                        
                        <button
                          onClick={() => handleSectoralAssessmentSelect('militair')}
                          className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                        >
                          <span className="text-xl font-bold text-gray-900 block mb-3">Militair</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Aanbestedingen van militaire uitrusting of operationele benodigdheden die onder defensieactiviteiten vallen.
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Estimation Phase */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'estimation' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                {/* Estimation Buttons */}
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto mb-8">
                      <button
                        onClick={() => handleEstimationSelect('yes')}
                        className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                      >
                        <span className="text-xl font-bold text-gray-900 block mb-3">Ja</span>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          EED van toepassing
                        </p>
                      </button>
                      
                      <button
                        onClick={() => handleEstimationSelect('no')}
                        className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                      >
                        <span className="text-xl font-bold text-gray-900 block mb-3">Nee</span>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          EED niet van toepassing
                        </p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back Navigation */}
                <div className="max-w-6xl mx-auto text-center">
                  <button
                    onClick={() => {
                      setPhase('organization');
                      setStateInUrl({ code: selectedCode, org: organizationType, step: '2' });
                    }}
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                  >
                    Vorige stap
                  </button>
                </div>
              </div>

              {/* High Threshold Phase */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'high-threshold' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                {/* Show warning box if user selected ≥€250M */}
                {showHighThresholdWarning ? (
                  <div className={`w-full transition-all duration-500 ease-in-out ${showHighThresholdWarning ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="container mx-auto px-6 lg:px-8">
                      <div className="max-w-4xl mx-auto p-8 bg-red-50 border-2 border-red-200 rounded-xl shadow-lg">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold text-red-900 mb-4">Let op: melding bij de Europese Commissie vereist</h2>
                          <p className="text-red-800 mb-6 leading-relaxed">
                            Voor aanbestedingen met een geraamde waarde van €250 miljoen of meer moet u eerst een melding indienen bij de Europese Commissie.
                          </p>
                          <div className="bg-white border border-red-300 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-red-900 mb-3">Wat moet u doen?</h3>
                            <ul className="text-left text-red-800 space-y-2">
                              <li className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                Dien eerst een melding in via het officiële platform van de Europese Commissie
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                Wacht op goedkeuring voordat u verder gaat met de aanbesteding
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                Raadpleeg juridisch advies
                              </li>
                            </ul>
                          </div>
                          <a 
                            href="https://foreign-subsidies.ec.europa.eu" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Melding indienen bij EC
                          </a>
                          
                          <div className="mt-4">
                            <span 
                              onClick={() => setShowHighThresholdWarning(false)}
                              className="text-red-600 hover:text-red-800 cursor-pointer transition-colors underline"
                            >
                              Terug naar vorige stap
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="container mx-auto px-6 lg:px-8">
                      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto mb-8">
                        <button
                          onClick={() => handleHighThresholdSelect('yes')}
                          className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md text-center flex items-center justify-center"
                        >
                          <span className="text-xl font-bold text-gray-900">Ja</span>
                        </button>
                        
                        <button
                          onClick={() => handleHighThresholdSelect('no')}
                          className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center flex items-center justify-center"
                        >
                          <span className="text-xl font-bold text-gray-900">Nee</span>
                        </button>
                      </div>
                    </div>

                    {/* Back Navigation */}
                    <div className="max-w-6xl mx-auto text-center">
                      <button
                        onClick={() => {
                          setPhase('sectoral-assessment');
                          setStateInUrl({ code: selectedCode, org: organizationType, step: 'sectoral', estimation: 'yes' });
                        }}
                        className="text-blue-600 hover:text-blue-800 underline transition-colors"
                      >
                        Vorige stap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - positioned at bottom */}
        <div className={`relative z-10 pb-8 text-center scroll-hint transition-opacity duration-500 ${
          showScrollIndicator ? 'opacity-100' : 'opacity-0'
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

export default SectoraleVerplichtingencheckHero; 