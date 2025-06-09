import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Autocomplete, { AutocompleteRef } from './Autocomplete';
import Confetti from './Confetti';

interface Suggestion {
  code: string;
  description: string;
  type_aanbesteding?: string;
}

type Phase = 'askOrgType' | 'askTenderingOrgType' | 'askSubsidy' | 'askWrittenAgreement' | 'askCounterPerformance' | 'askLegallyEnforceable' | 'askEconInterest' | 'askThreshold' | 'askCrossBorderInterest' | 'askException';

const AanbestedingsplichtCheckHeroNew: React.FC = () => {
  const navigate = useNavigate();
  const autocompleteRef = useRef<AutocompleteRef>(null);
  const [phase, setPhase] = useState<Phase>('askOrgType');
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [selectedDescription, setSelectedDescription] = useState<string>('');
  const [organizationType, setOrganizationType] = useState<string>('');
  const [typeAanbesteding, setTypeAanbesteding] = useState<string>('Diensten');

  // URL state management
  const setStateInUrl = (state: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(state).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Restore state from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlState = {
      code: params.get('code'),
      org: params.get('org'),
      step: params.get('step'),
    };

    if (urlState.code) {
      setSelectedCode(urlState.code);
      import('../utils/cpvLookup').then(({ getCpvName }) => {
        getCpvName(urlState.code).then(setSelectedDescription);
      });
    }
    if (urlState.org) {
      setOrganizationType(urlState.org);
      setTypeAanbesteding('Diensten');
    }

    // Set phase based on step
    switch (urlState.step) {
      case 'askTenderingOrgType':
        setPhase('askTenderingOrgType');
        break;
      case 'askSubsidy':
        setPhase('askSubsidy');
        break;
      case 'askWrittenAgreement':
        setPhase('askWrittenAgreement');
        break;
      case 'askCounterPerformance':
        setPhase('askCounterPerformance');
        break;
      case 'askLegallyEnforceable':
        setPhase('askLegallyEnforceable');
        break;
      case 'askEconInterest':
        setPhase('askEconInterest');
        break;
      case 'askThreshold':
        setPhase('askThreshold');
        break;
      case 'askCrossBorderInterest':
        setPhase('askCrossBorderInterest');
        break;
      case 'askException':
        setPhase('askException');
        break;
      default:
        setPhase('askOrgType');
    }
  }, []);

  // Navigation to results
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const step = params.get('step');
    
    if (step?.startsWith('result')) {
      navigate('/aanbestedingsplicht-check/result?' + params.toString(), { replace: true });
    }
  }, [navigate]);

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setSelectedCode(suggestion.code);
    setSelectedDescription(suggestion.description);
    setOrganizationType('');
    setTypeAanbesteding(suggestion.type_aanbesteding || 'Diensten');
    setPhase('askOrgType');
    setStateInUrl({ code: suggestion.code, step: 'askOrgType' });
  };

  const handlePillClick = (searchTerm: string) => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setQuery(searchTerm);
    }
  };

  // Handler functions for each phase
  const handleOrgTypeSelect = (orgType: string) => {
    setOrganizationType(orgType);
    if (orgType === 'ander-type-organisatie') {
      setPhase('askTenderingOrgType');
      setStateInUrl({ code: selectedCode, org: orgType, step: 'askTenderingOrgType' });
    } else {
      setPhase('askWrittenAgreement');
      setStateInUrl({ code: selectedCode, org: orgType, step: 'askWrittenAgreement' });
    }
  };

  const handleTenderingOrgTypeSelect = (orgType: string) => {
    setOrganizationType(orgType);
    if (orgType === 'ander-type-organisatie') {
      setPhase('askSubsidy');
      setStateInUrl({ code: selectedCode, org: orgType, step: 'askSubsidy' });
    } else {
      setPhase('askWrittenAgreement');
      setStateInUrl({ code: selectedCode, org: orgType, step: 'askWrittenAgreement' });
    }
  };

  const handleSubsidySelect = (answer: string) => {
    if (answer === 'nee') {
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', subsidy: answer });
    } else {
      setPhase('askWrittenAgreement');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askWrittenAgreement', subsidy: answer });
    }
  };

  const handleWrittenAgreementSelect = (answer: string) => {
    if (answer === 'nee') {
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', agreement: answer });
    } else {
      setPhase('askCounterPerformance');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askCounterPerformance', agreement: answer });
    }
  };

  const handleCounterPerformanceSelect = (answer: string) => {
    if (answer === 'nee') {
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', counterPerformance: answer });
    } else {
      setPhase('askLegallyEnforceable');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askLegallyEnforceable', counterPerformance: answer });
    }
  };

  const handleLegallyEnforceableSelect = (answer: string) => {
    if (answer === 'nee') {
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', enforceable: answer });
    } else {
      setPhase('askEconInterest');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askEconInterest', enforceable: answer });
    }
  };

  const handleEconInterestSelect = (answer: string) => {
    if (answer === 'nee') {
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', econInterest: answer });
    } else {
      setPhase('askThreshold');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askThreshold', econInterest: answer });
    }
  };

  const handleThresholdSelect = (answer: string) => {
    if (answer === 'ja') {
      setPhase('askException');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askException', threshold: answer });
    } else if (answer === 'nee') {
      setPhase('askCrossBorderInterest');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askCrossBorderInterest', threshold: answer });
    } else if (answer === 'calculator') {
      const newWindow = window.open('http://localhost:8080/opdrachtramer', '_blank', 'noopener,noreferrer');
      if (newWindow) {
        newWindow.focus();
      }
    }
  };

  const handleCrossBorderInterestSelect = (answer: string) => {
    if (answer === 'niet-aannemelijk') {
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNatRules', crossBorder: answer });
    } else {
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultTransparency', crossBorder: answer });
    }
  };

  const handleExceptionSelect = (answer: string) => {
    if (answer === 'nee') {
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultDuty', exception: answer });
    } else {
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', exception: answer });
    }
  };

  const getQuestionText = () => {
    switch (phase) {
      case 'askOrgType':
        return 'Voor welk type organisatie werk je zelf?';
      case 'askTenderingOrgType':
        return 'Voor welk type organisatie voer je de opdracht uit?';
      case 'askSubsidy':
        return 'Krijgt jouw opdrachtgever >50% subsidie van een overheidsorganisatie?';
      case 'askWrittenAgreement':
        return 'Is er een schriftelijke overeenkomst?';
      case 'askCounterPerformance':
        return 'Is er een tegenprestatie van de overheid?';
      case 'askLegallyEnforceable':
        return 'Is de afspraak juridisch afdwingbaar?';
      case 'askEconInterest':
        return 'Is er een rechstreeks economisch belang voor de overheid?';
      case 'askThreshold':
        return 'Komt deze overheidsopdracht boven de drempelwaarde?';
      case 'askCrossBorderInterest':
        return 'Kunnen buitenlandse ondernemers geïnteresseerd zijn op basis van:';
      case 'askException':
        return 'Is er een uitzondering van toepassing?';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <div className="container mx-auto px-6 lg:px-8 py-8 flex-1">
        {/* Back button */}
        {phase !== 'askOrgType' && (
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => {
                // Logic to go back to previous step
                if (phase === 'askTenderingOrgType') setPhase('askOrgType');
                else if (phase === 'askSubsidy') setPhase('askTenderingOrgType');
                else if (phase === 'askWrittenAgreement') {
                  if (organizationType === 'ander-type-organisatie') {
                    setPhase('askSubsidy');
                  } else {
                    setPhase('askOrgType');
                  }
                }
                // Add more back navigation logic as needed
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Terug naar vorige stap
            </button>
          </div>
        )}

        {/* Title and question */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            <span className="text-blue-600">Aanbestedingsplicht check</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Check of je aanbestedingsplichtig bent.<br />
            <span className="font-bold">{getQuestionText()}</span>
          </p>
        </div>

        {/* Phase-specific content */}
        <div className="max-w-6xl mx-auto">
          {/* askOrgType phase */}
          {phase === 'askOrgType' && (
            <div>
              {!selectedCode && (
                <div className="mb-8">
                  <Autocomplete
                    ref={autocompleteRef}
                    onSuggestionSelect={handleSuggestionSelect}
                    placeholder="Zoek op CPV code of omschrijving..."
                  />
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {['Advisering', 'Software', 'Onderhoud', 'Schoonmaak', 'Beveiliging', 'Catering'].map((pill) => (
                      <button
                        key={pill}
                        onClick={() => handlePillClick(pill)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedCode && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <button onClick={() => handleOrgTypeSelect('rijksoverheid')} className="org-button">
                    <span className="text-xl font-bold text-gray-900 block mb-3">Rijksoverheid</span>
                    <p className="text-sm text-gray-600">Ministeries, uitvoerende diensten en andere rijksorganisaties.</p>
                  </button>
                  <button onClick={() => handleOrgTypeSelect('decentraal')} className="org-button">
                    <span className="text-xl font-bold text-gray-900 block mb-3">Decentraal</span>
                    <p className="text-sm text-gray-600">Provincies, gemeenten, waterschappen en andere lokale overheden.</p>
                  </button>
                  <button onClick={() => handleOrgTypeSelect('publiekrechterlijk')} className="org-button">
                    <span className="text-xl font-bold text-gray-900 block mb-3">Publiekrechtelijk</span>
                    <p className="text-sm text-gray-600">Zorgverzekeraars, woningcorporaties en andere organisaties met publieke taak.</p>
                  </button>
                  <button onClick={() => handleOrgTypeSelect('wettelijke-taak')} className="org-button">
                    <span className="text-xl font-bold text-gray-900 block mb-3">Met wettelijke taak</span>
                    <p className="text-sm text-gray-600">CBR, KvK, UWV en andere rechtspersonen met publieke taken.</p>
                  </button>
                  <button onClick={() => handleOrgTypeSelect('ander-type-organisatie')} className="org-button">
                    <span className="text-xl font-bold text-gray-900 block mb-3">Ander type organisatie</span>
                    <p className="text-sm text-gray-600">Stichtingen, verenigingen, bedrijven die twijfelen over de Aanbestedingswet.</p>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* askTenderingOrgType phase */}
          {phase === 'askTenderingOrgType' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <button onClick={() => handleTenderingOrgTypeSelect('rijksoverheid')} className="org-button">
                <span className="text-xl font-bold text-gray-900 block mb-3">Rijksoverheid</span>
                <p className="text-sm text-gray-600">Ministeries, uitvoerende diensten en andere rijksorganisaties.</p>
              </button>
              <button onClick={() => handleTenderingOrgTypeSelect('decentraal')} className="org-button">
                <span className="text-xl font-bold text-gray-900 block mb-3">Decentraal</span>
                <p className="text-sm text-gray-600">Provincies, gemeenten, waterschappen en andere lokale overheden.</p>
              </button>
              <button onClick={() => handleTenderingOrgTypeSelect('publiekrechterlijk')} className="org-button">
                <span className="text-xl font-bold text-gray-900 block mb-3">Publiekrechtelijk</span>
                <p className="text-sm text-gray-600">Zorgverzekeraars, woningcorporaties en andere organisaties met publieke taak.</p>
              </button>
              <button onClick={() => handleTenderingOrgTypeSelect('wettelijke-taak')} className="org-button">
                <span className="text-xl font-bold text-gray-900 block mb-3">Met wettelijke taak</span>
                <p className="text-sm text-gray-600">CBR, KvK, UWV en andere rechtspersonen met publieke taken.</p>
              </button>
              <button onClick={() => handleTenderingOrgTypeSelect('ander-type-organisatie')} className="org-button">
                <span className="text-xl font-bold text-gray-900 block mb-3">Ander type organisatie</span>
                <p className="text-sm text-gray-600">Stichtingen, verenigingen, bedrijven die niet onder andere categoriën vallen.</p>
              </button>
            </div>
          )}

          {/* askSubsidy phase */}
          {phase === 'askSubsidy' && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              <button onClick={() => handleSubsidySelect('ja')} className="simple-button">
                <span className="text-xl font-bold text-gray-900">Ja</span>
              </button>
              <button onClick={() => handleSubsidySelect('nee')} className="simple-button">
                <span className="text-xl font-bold text-gray-900">Nee</span>
              </button>
            </div>
          )}

          {/* askWrittenAgreement phase */}
          {phase === 'askWrittenAgreement' && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              <button onClick={() => handleWrittenAgreementSelect('ja')} className="simple-button">
                <span className="text-xl font-bold text-gray-900">Ja</span>
              </button>
              <button onClick={() => handleWrittenAgreementSelect('nee')} className="simple-button">
                <span className="text-xl font-bold text-gray-900">Nee</span>
              </button>
            </div>
          )}

          {/* askCounterPerformance phase */}
          {phase === 'askCounterPerformance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <button onClick={() => handleCounterPerformanceSelect('geldbetaling')} className="counter-perf-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Geldbetaling</span>
              </button>
              <button onClick={() => handleCounterPerformanceSelect('belastingvoordeel')} className="counter-perf-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Belastingvoordeel of vrijstelling</span>
              </button>
              <button onClick={() => handleCounterPerformanceSelect('in-natura')} className="counter-perf-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Product of dienst in natura</span>
              </button>
              <button onClick={() => handleCounterPerformanceSelect('anders')} className="counter-perf-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Anders</span>
              </button>
              <button onClick={() => handleCounterPerformanceSelect('nee')} className="counter-perf-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Nee</span>
              </button>
            </div>
          )}

          {/* askLegallyEnforceable phase */}
          {phase === 'askLegallyEnforceable' && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              <button onClick={() => handleLegallyEnforceableSelect('ja')} className="simple-button">
                <span className="text-xl font-bold text-gray-900">Ja</span>
              </button>
              <button onClick={() => handleLegallyEnforceableSelect('nee')} className="simple-button">
                <span className="text-xl font-bold text-gray-900">Nee</span>
              </button>
            </div>
          )}

          {/* askEconInterest phase */}
          {phase === 'askEconInterest' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <button onClick={() => handleEconInterestSelect('eigenaar')} className="econ-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Ja, de overheid is eigenaar van het resultaat</span>
              </button>
              <button onClick={() => handleEconInterestSelect('risico')} className="econ-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Ja, de overheid loopt (mede) financieel risico</span>
              </button>
              <button onClick={() => handleEconInterestSelect('openbaar')} className="econ-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Ja, het werk heeft een openbaar karakter</span>
              </button>
              <button onClick={() => handleEconInterestSelect('voordeel')} className="econ-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Ja, er is voordeel of betrokkenheid bij de uitvoering</span>
              </button>
              <button onClick={() => handleEconInterestSelect('nee')} className="econ-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Nee</span>
              </button>
            </div>
          )}

          {/* askThreshold phase */}
          {phase === 'askThreshold' && (
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button onClick={() => handleThresholdSelect('ja')} className="simple-button">
                  <span className="text-xl font-bold text-gray-900">Ja</span>
                </button>
                <button onClick={() => handleThresholdSelect('nee')} className="simple-button">
                  <span className="text-xl font-bold text-gray-900">Nee</span>
                </button>
              </div>
              <div className="text-center mt-4">
                <button onClick={() => handleThresholdSelect('calculator')} className="calculator-button">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  <span className="text-lg font-bold text-blue-600">Naar berekening drempelwaarde</span>
                </button>
              </div>
            </div>
          )}

          {/* askCrossBorderInterest phase */}
          {phase === 'askCrossBorderInterest' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <button onClick={() => handleCrossBorderInterestSelect('waarde')} className="cross-border-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">De waarde van de opdracht?</span>
              </button>
              <button onClick={() => handleCrossBorderInterestSelect('specialisatie')} className="cross-border-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">De technische kennis of specialisatie die nodig is?</span>
              </button>
              <button onClick={() => handleCrossBorderInterestSelect('locatie')} className="cross-border-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">De locatie van de opdracht, bijvoorbeeld dicht bij de grens?</span>
              </button>
              <button onClick={() => handleCrossBorderInterestSelect('niet-aannemelijk')} className="cross-border-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Niet aannemelijk</span>
              </button>
            </div>
          )}

          {/* askException phase */}
          {phase === 'askException' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              <button onClick={() => handleExceptionSelect('inhouse')} className="exception-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Inhouse gunning</span>
                <p className="text-sm text-gray-600">Je geeft de opdracht aan een eigen organisatie, bijvoorbeeld een dochterbedrijf of uitvoeringsdienst die je zelf volledig controleert.</p>
              </button>
              <button onClick={() => handleExceptionSelect('samenwerking')} className="exception-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Samenwerking</span>
                <p className="text-sm text-gray-600">Je werkt samen met andere overheden voor een gemeenschappelijk doel.</p>
              </button>
              <button onClick={() => handleExceptionSelect('exclusiviteit')} className="exception-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Exclusiviteit</span>
                <p className="text-sm text-gray-600">Er is een wet die bepaalt dat maar één partij dit mag doen, bijvoorbeeld een organisatie met een wettelijk monopolie.</p>
              </button>
              <button onClick={() => handleExceptionSelect('vertrouwelijkheid')} className="exception-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Vertrouwelijkheid</span>
                <p className="text-sm text-gray-600">Het gaat om een opdracht waarbij vertrouwelijkheid of de nationale veiligheid in het geding is.</p>
              </button>
              <button onClick={() => handleExceptionSelect('lidstaat')} className="exception-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Inkoop lidstaat</span>
                <p className="text-sm text-gray-600">Je koopt producten of diensten in bij een EU-lidstaat en die lidstaat heeft daarvoor al een aanbesteding gedaan.</p>
              </button>
              <button onClick={() => handleExceptionSelect('uitgesloten')} className="exception-button">
                <span className="text-lg font-bold text-gray-900 block mb-2">Uitgesloten dienstcontract</span>
                <p className="text-sm text-gray-600">Het betreft een van de diensten als opgesomd in Artikel 2.24 van de Aanbestedingswet.</p>
              </button>
              <button onClick={() => handleExceptionSelect('nee')} className="exception-button bg-gray-50">
                <span className="text-lg font-bold text-gray-900 block mb-2">Nee</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .org-button {
          @apply group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center;
        }
        .simple-button {
          @apply group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center;
        }
        .counter-perf-button {
          @apply p-4 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center;
        }
        .econ-button {
          @apply p-4 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center;
        }
        .cross-border-button {
          @apply p-4 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center;
        }
        .exception-button {
          @apply p-4 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-left;
        }
        .calculator-button {
          @apply inline-flex items-center px-6 py-3 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 shadow-sm text-center;
        }
      `}</style>
    </div>
  );
};

export default AanbestedingsplichtCheckHeroNew; 