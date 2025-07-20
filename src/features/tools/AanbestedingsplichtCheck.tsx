import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete, { AutocompleteRef } from '../../components/Autocomplete';


import { useUrlStateNoRerender } from '../../hooks/useUrlStateNoRerender';
import { Home, ExternalLink } from 'lucide-react';
import Confetti from '../../components/Confetti';

interface Suggestion {
  code: string;
  description: string;
  type_aanbesteding?: string;
}

const AanbestedingsplichtCheckHero: React.FC = () => {
  const navigate = useNavigate();
  const autocompleteRef = useRef<AutocompleteRef>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'askOrgType' | 'askTenderingOrgType' | 'askSubsidy' | 'askWrittenAgreement' | 'askCounterPerformance' | 'askLegallyEnforceable' | 'askEconInterest' | 'askThreshold' | 'askCrossBorderInterest' | 'askException' | 'resultNoDuty' | 'resultTransparency' | 'resultNatRules' | 'resultDuty' | 'other-org-step' | 'other-org-subsidy' | 'other-org-subsidy-result' | 'written-agreement' | 'written-agreement-result' | 'estimation' | 'high-threshold'>('askOrgType');
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [selectedDescription, setSelectedDescription] = useState<string>('');
  const [organizationType, setOrganizationType] = useState<string>('');
  const [typeAanbesteding, setTypeAanbesteding] = useState<string>('');
  const [showHighThresholdWarning, setShowHighThresholdWarning] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const { getStateFromUrl, setStateInUrl } = useUrlStateNoRerender();

  // Intersection Observer for footer visibility
  useEffect(() => {
    const footerElement = footerRef.current;
    if (!footerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShowScrollIndicator(!entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
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
        import('../../utils/cpvLookup').then(({ getCpvName }) => {
          getCpvName(urlState.code).then(setSelectedDescription);
        });
      }
      if (urlState.org) {
        setOrganizationType(urlState.org);
        setTypeAanbesteding('Diensten');
      }
      // Robust restore logic for all step values
      switch (urlState.step) {
        case 'askOrgType':
        case 'input':
          setPhase('askOrgType');
          break;
        case 'askTenderingOrgType':
        case 'other-org-step':
          setPhase('askTenderingOrgType');
          break;
        case 'askSubsidy':
        case 'other-org-subsidy':
          setPhase('askSubsidy');
          break;
        case 'askWrittenAgreement':
        case 'written-agreement':
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
        case 'estimation':
          setPhase('askThreshold');
          break;
        case 'askCrossBorderInterest':
          setPhase('askCrossBorderInterest');
          break;
        case 'askException':
          setPhase('askException');
          break;
        case 'resultNoDuty':
        case 'other-org-subsidy-result':
        case 'written-agreement-result':
          setPhase('resultNoDuty');
          break;
        case 'resultTransparency':
          setPhase('resultTransparency');
          break;
        case 'resultNatRules':
          setPhase('resultNatRules');
          break;
        case 'resultDuty':
          setPhase('resultDuty');
          break;
        default:
          setPhase('askOrgType');
      }
    }
  }, []);

  useEffect(() => {
    if (phase === 'resultNoDuty' || phase === 'resultTransparency' || phase === 'resultNatRules' || phase === 'resultDuty') {
      // Build the results URL with all relevant parameters
      const params = new URLSearchParams();
      if (selectedCode) params.set('code', selectedCode);
      if (organizationType) params.set('org', organizationType);
      params.set('step', phase);
      
      // Store current path before navigating to results
      const currentPath = `/tools/aanbestedingsplicht-check?${params.toString()}`;
      sessionStorage.setItem('lastPath', currentPath);
      
      navigate('/tools/aanbestedingsplicht-check/result?' + params.toString(), { replace: true });
    }
  }, [phase, navigate, selectedCode, organizationType]);

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
    return threshold;
  };

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

  // askOrgType handlers
  const handleOrgTypeSelect = (organizationType: string) => {
    setOrganizationType(organizationType);
    if (organizationType === 'ander-type-organisatie') {
      setPhase('askTenderingOrgType');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askTenderingOrgType' });
    } else {
      // Government organizations go to written agreement
      setPhase('askWrittenAgreement');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askWrittenAgreement' });
    }
  };

  // askTenderingOrgType handlers  
  const handleTenderingOrgTypeSelect = (orgType: string) => {
    setOrganizationType(orgType);
    if (orgType === 'ander-type-organisatie') {
      setPhase('askSubsidy');
      setStateInUrl({ code: selectedCode, org: orgType, step: 'askSubsidy' });
    } else {
      // Government organizations go to written agreement
      setPhase('askWrittenAgreement');
      setStateInUrl({ code: selectedCode, org: orgType, step: 'askWrittenAgreement' });
    }
  };

  // askSubsidy handlers
  const handleSubsidySelect = (answer: string) => {
    if (answer === 'nee') {
      setPhase('resultNoDuty');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', subsidy: answer });
    } else {
      setPhase('askWrittenAgreement');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askWrittenAgreement', subsidy: answer });
    }
  };

  // askWrittenAgreement handlers
  const handleWrittenAgreementSelect = (answer: string) => {
    if (answer === 'nee') {
      setPhase('resultNoDuty');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', agreement: answer });
    } else {
      setPhase('askCounterPerformance');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askCounterPerformance', agreement: answer });
    }
  };

  // askCounterPerformance handlers
  const handleCounterPerformanceSelect = (answer: string) => {
    if (answer === 'nee') {
      setPhase('resultNoDuty');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', counterPerformance: answer });
    } else if (answer === 'geldbetaling') {
      setPhase('askLegallyEnforceable');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askLegallyEnforceable', counterPerformance: answer });
    } else {
      // belastingvoordeel, in-natura, anders
      setPhase('askLegallyEnforceable');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askLegallyEnforceable', counterPerformance: answer });
    }
  };

  // askLegallyEnforceable handlers
  const handleLegallyEnforceableSelect = (answer: string) => {
    if (answer === 'nee') {
      setPhase('resultNoDuty');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', enforceable: answer });
    } else {
      setPhase('askEconInterest');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askEconInterest', enforceable: answer });
    }
  };

  // askEconInterest handlers
  const handleEconInterestSelect = (answer: string) => {
    if (answer === 'nee') {
      setPhase('resultNoDuty');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', econInterest: answer });
    } else {
      setPhase('askThreshold');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askThreshold', econInterest: answer });
    }
  };

  // askThreshold handlers
  const handleThresholdSelect = (answer: string) => {
    if (answer === 'ja') {
      setPhase('askException');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askException', threshold: answer });
    } else if (answer === 'nee') {
      setPhase('askCrossBorderInterest');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askCrossBorderInterest', threshold: answer });
    } else if (answer === 'calculator') {
      // Open threshold calculator in new window
      const newWindow = window.open('http://localhost:8080/opdrachtramer', '_blank', 'noopener,noreferrer');
      if (newWindow) {
        newWindow.focus();
      }
    }
  };

  // askCrossBorderInterest handlers
  const handleCrossBorderInterestSelect = (answer: string) => {
    if (answer === 'niet-aannemelijk') {
      setPhase('resultNatRules');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNatRules', crossBorder: answer });
    } else {
      setPhase('resultTransparency');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultTransparency', crossBorder: answer });
    }
  };

  // askException handlers
  const handleExceptionSelect = (answer: string) => {
    if (answer === 'nee') {
      setPhase('resultDuty');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultDuty', exception: answer });
    } else {
      setPhase('resultNoDuty');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', exception: answer });
    }
  };

  const handleEstimationSelect = (answer: string) => {
    if (answer === 'yes') {
      setPhase('askCrossBorderInterest');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askCrossBorderInterest' });
    } else if (answer === 'no') {
      setPhase('resultNatRules');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNatRules' });
    } else if (answer === 'calculator') {
      const newWindow = window.open('http://localhost:8080/opdrachtramer', '_blank', 'noopener,noreferrer');
      if (newWindow) {
        newWindow.focus();
      }
    }
  };

  const handleHighThresholdSelect = (answer: string) => {
    if (answer === 'yes') {
      setShowHighThresholdWarning(true);
    } else {
      setPhase('askCrossBorderInterest');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askCrossBorderInterest' });
    }
  };

  const handleOrganizationSelect = (organizationType: string) => {
    setOrganizationType(organizationType);
    if (organizationType === 'anders') {
      setPhase('askTenderingOrgType');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askTenderingOrgType' });
    } else {
      // Government organizations go to written agreement
      setPhase('askWrittenAgreement');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askWrittenAgreement' });
    }
  };

  const handleOtherOrgTypeSelect = (orgType: string) => {
    setOrganizationType(orgType);
    if (orgType === 'ander-type-organisatie') {
      setPhase('askSubsidy');
      setStateInUrl({ code: selectedCode, org: orgType, step: 'askSubsidy' });
    } else {
      // Government organizations go to written agreement
      setPhase('askWrittenAgreement');
      setStateInUrl({ code: selectedCode, org: orgType, step: 'askWrittenAgreement' });
    }
  };

  const handleOtherOrgSubsidySelect = (answer: string) => {
    if (answer === 'nee') {
      setPhase('resultNoDuty');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'resultNoDuty', subsidy: answer });
    } else {
      setPhase('askCounterPerformance');
      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askCounterPerformance', subsidy: answer });
    }
  };

  const handleProgressStepClick = (step: number) => {
    if (step === 1) {
      setPhase('askOrgType');
      if (autocompleteRef.current) autocompleteRef.current.reset();
      setSelectedCode('');
      setSelectedDescription('');
      setOrganizationType('');
      setTypeAanbesteding('');
      setStateInUrl({});
    } else if (step === 2) {
      // Always allow going to step 2 if we have any progress beyond askOrgType
      if (organizationType || phase !== 'askOrgType') {
        setPhase('askTenderingOrgType');
        setStateInUrl({ code: selectedCode, org: organizationType, step: 'askTenderingOrgType' });
      }
    }
  };

  const ProgressBar = () => (
    <div className="mt-8">
      <div className="flex items-center justify-center space-x-2 max-w-4xl mx-auto">
        {/* Step 1 - Jouw organisatie - Always completed after input phase */}
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
            <div className="text-sm font-semibold text-green-700">Jouw organisatie</div>
            <div className="text-xs text-green-600">Voltooid</div>
          </div>
        </button>
        
        {/* Connector 1 */}
        <div className="flex-1 max-w-16">
          <div className={`h-1 rounded-full transition-all duration-500 ${
            phase === 'other-org-subsidy' || phase === 'other-org-subsidy-result' || phase === 'written-agreement' || phase === 'written-agreement-result' || phase === 'estimation' || phase === 'high-threshold'
              ? 'bg-green-500' 
              : phase === 'other-org-step'
                ? 'bg-gradient-to-r from-green-500 to-orange-500'
                : 'bg-gray-200'
          }`}></div>
        </div>
        
        {/* Step 2 - Opdrachtgever */}
        <button 
          onClick={() => handleProgressStepClick(2)}
          className={`flex items-center transition-all duration-200 group ${organizationType ? 'hover:scale-105' : 'cursor-default'}`}
          disabled={!organizationType}
        >
          <div className="relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              phase === 'other-org-subsidy' || phase === 'other-org-subsidy-result' || phase === 'written-agreement' || phase === 'written-agreement-result' || phase === 'estimation' || phase === 'high-threshold'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white group-hover:shadow-xl' 
                : phase === 'other-org-step' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-200 group-hover:shadow-xl' 
                  : 'bg-gray-200 text-gray-500'
            }`}>
              {phase === 'other-org-subsidy' || phase === 'other-org-subsidy-result' || phase === 'written-agreement' || phase === 'written-agreement-result' || phase === 'estimation' || phase === 'high-threshold' ? (
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
              phase === 'other-org-subsidy' || phase === 'other-org-subsidy-result' || phase === 'written-agreement' || phase === 'written-agreement-result' || phase === 'estimation' || phase === 'high-threshold'
                ? 'bg-gradient-to-r from-green-400 to-emerald-400 group-hover:opacity-30' 
                : phase === 'other-org-step' 
                  ? 'bg-gradient-to-r from-orange-400 to-amber-400 group-hover:opacity-30' 
                  : 'bg-gray-300'
            }`}></div>
          </div>
          <div className="ml-3 text-left">
            <div className={`text-sm font-semibold transition-colors ${
              phase === 'other-org-subsidy' || phase === 'other-org-subsidy-result' || phase === 'written-agreement' || phase === 'written-agreement-result' || phase === 'estimation' || phase === 'high-threshold'
                ? 'text-green-700' 
                : phase === 'other-org-step' 
                  ? 'text-orange-700' 
                  : 'text-gray-500'
            }`}>Opdrachtgever</div>
            <div className={`text-xs transition-colors ${
              phase === 'other-org-subsidy' || phase === 'other-org-subsidy-result' || phase === 'written-agreement' || phase === 'written-agreement-result' || phase === 'estimation' || phase === 'high-threshold'
                ? 'text-green-600' 
                : phase === 'other-org-step' 
                  ? 'text-orange-600' 
                  : 'text-gray-400'
            }`}>
              {phase === 'other-org-subsidy' || phase === 'other-org-subsidy-result' || phase === 'written-agreement' || phase === 'written-agreement-result' || phase === 'estimation' || phase === 'high-threshold' ? 'Voltooid' : phase === 'other-org-step' ? 'Actief' : 'Wachtend'}
            </div>
          </div>
        </button>
        
        {/* Show subsidy step only when in subsidy flow */}
        {(phase === 'other-org-subsidy' || phase === 'other-org-subsidy-result') && (
          <>
            {/* Connector 2 */}
            <div className="flex-1 max-w-16">
              <div className={`h-1 rounded-full transition-all duration-500 ${
                phase === 'other-org-subsidy-result'
                  ? 'bg-green-500'
                  : phase === 'other-org-subsidy'
                  ? 'bg-gradient-to-r from-green-500 to-orange-500' 
                  : 'bg-gray-200'
              }`}></div>
            </div>
            
            {/* Step 3 - Subsidie */}
            <div className="flex items-center group">
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  phase === 'other-org-subsidy-result'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white group-hover:shadow-xl'
                    : phase === 'other-org-subsidy'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-200' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {phase === 'other-org-subsidy-result' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  )}
                </div>
                <div className={`absolute -inset-1 rounded-full opacity-20 transition-opacity ${
                  phase === 'other-org-subsidy-result'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400 group-hover:opacity-30'
                    : phase === 'other-org-subsidy'
                    ? 'bg-gradient-to-r from-orange-400 to-amber-400' 
                    : 'bg-gray-300'
                }`}></div>
              </div>
              <div className="ml-3 text-left">
                <div className={`text-sm font-semibold transition-colors ${
                  phase === 'other-org-subsidy-result' 
                    ? 'text-green-700'
                    : phase === 'other-org-subsidy' 
                    ? 'text-orange-700' 
                    : 'text-gray-500'
                }`}>Subsidie</div>
                <div className={`text-xs transition-colors ${
                  phase === 'other-org-subsidy-result' 
                    ? 'text-green-600'
                    : phase === 'other-org-subsidy' 
                    ? 'text-orange-600' 
                    : 'text-gray-400'
                }`}>
                  {phase === 'other-org-subsidy-result' ? 'Voltooid' : phase === 'other-org-subsidy' ? 'Actief' : 'Wachtend'}
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Show threshold estimation steps only when in estimation flow */}
        {(phase === 'estimation' || phase === 'high-threshold') && (
          <>
            {/* Connector for threshold step */}
            <div className="flex-1 max-w-16">
              <div className={`h-1 rounded-full transition-all duration-500 ${
                phase === 'high-threshold'
                  ? 'bg-green-500'
                  : phase === 'estimation'
                  ? 'bg-gradient-to-r from-green-500 to-orange-500' 
                  : 'bg-gray-200'
              }`}></div>
            </div>
            
            {/* Step 3/4 - Drempelwaarde */}
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
              disabled={phase !== 'high-threshold' && phase !== 'estimation'}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  phase === 'high-threshold'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white group-hover:shadow-xl'
                    : phase === 'estimation'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-200' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {phase === 'high-threshold' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className={`absolute -inset-1 rounded-full opacity-20 transition-opacity ${
                  phase === 'high-threshold'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400 group-hover:opacity-30'
                    : phase === 'estimation'
                    ? 'bg-gradient-to-r from-orange-400 to-amber-400' 
                    : 'bg-gray-300'
                }`}></div>
              </div>
              <div className="ml-3 text-left">
                <div className={`text-sm font-semibold transition-colors ${
                  phase === 'high-threshold' 
                    ? 'text-green-700'
                    : phase === 'estimation' 
                    ? 'text-orange-700' 
                    : 'text-gray-500'
                }`}>Drempelwaarde</div>
                <div className={`text-xs transition-colors ${
                  phase === 'high-threshold' 
                    ? 'text-green-600'
                    : phase === 'estimation' 
                    ? 'text-orange-600' 
                    : 'text-gray-400'
                }`}>
                  {phase === 'high-threshold' ? 'Voltooid' : phase === 'estimation' ? 'Actief' : 'Wachtend'}
                </div>
              </div>
            </button>
            
            {/* Step 4 - FSR Check - Only show when in high-threshold phase */}
            {phase === 'high-threshold' && (
              <>
                {/* Connector 3 - Only show when FSR check is relevant */}
                <div className="flex-1 max-w-16">
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
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden flex flex-col">

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-20"></div>
        </div>
        <div className="relative z-10 flex-1 flex items-start lg:items-center justify-center px-6 lg:px-8 pt-4 lg:pt-0">
          <div className="w-full text-center">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 mt-[5vh] lg:mt-0">
                <span className="text-blue-600">Aanbestedingsplicht check</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Check of je aanbestedingsplichtig bent.<br />
                <span className="font-bold">
                  {phase === 'askOrgType'
                    ? 'Voor welk type organisatie werk je zelf?'
                    : phase === 'askTenderingOrgType'
                    ? 'Voor welk type organisatie voer je de opdracht uit?'
                    : phase === 'askSubsidy'
                    ? 'Krijgt jouw opdrachtgever >50% subsidie van een overheidsorganisatie?'
                    : phase === 'askWrittenAgreement'
                    ? 'Is er een schriftelijke overeenkomst?'
                    : phase === 'askCounterPerformance'
                    ? 'Is er een tegenprestatie van de overheid?'
                    : phase === 'askLegallyEnforceable'
                    ? 'Is de afspraak juridisch afdwingbaar?'
                    : phase === 'askEconInterest'
                    ? 'Is er een rechstreeks economisch belang voor de overheid?'
                    : phase === 'askThreshold'
                    ? 'Komt deze overheidsopdracht boven de drempelwaarde?'
                    : phase === 'askCrossBorderInterest'
                    ? 'Kunnen buitenlandse ondernemers geïnteresseerd zijn op basis van:'
                    : phase === 'askException'
                    ? 'Is er een uitzondering van toepassing?'
                    : ''
                  }
                </span>
              </p>
            </div>
            <div className="relative min-h-[300px]">
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'askOrgType' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col gap-6 mb-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <button
                          onClick={() => handleOrganizationSelect('rijksoverheid')}
                          className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                        >
                          <span className="text-xl font-bold text-gray-900 block mb-3">Rijksoverheid</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Ministeries, uitvoerende diensten en andere rijksorganisaties die namens de Nederlandse staat aanbesteden.
                          </p>
                        </button>
                        <button
                          onClick={() => handleOrganizationSelect('decentraal')}
                          className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                        >
                          <span className="text-xl font-bold text-gray-900 block mb-3">Decentraal</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Provincies, gemeenten, waterschappen en andere lokale overheden die zelfstandig aanbesteden binnen hun gebied.
                          </p>
                        </button>
                        <button
                          onClick={() => handleOrganizationSelect('publiekrechterlijk')}
                          className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                        >
                          <span className="text-xl font-bold text-gray-900 block mb-3">Publiekrechtelijk</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Zorgverzekeraars, woningcorporaties en andere organisaties met een publieke taak die aanbesteden volgens de wet.
                          </p>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <button
                          onClick={() => handleOrganizationSelect('wettelijke-taak')}
                          className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                        >
                          <span className="text-xl font-bold text-gray-900 block mb-3">Met wettelijke taak</span>
                          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                            CBR, KvK, UWV en andere rechtspersonen die op grond van de wet publieke taken uitvoeren met eigen bevoegdheden.
                          </p>
                        </button>
                        <button
                          onClick={() => handleOrganizationSelect('anders')}
                          className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                        >
                          <span className="text-xl font-bold text-gray-900 block mb-3">Ander type organisatie</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Stichtingen, verenigingen, bedrijven of samenwerkings- verbanden die twijfelen of de Aanbestedingswet geldt.
                          </p>
                        </button>
                        <div className="hidden lg:block" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'other-org-step' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col gap-6 mb-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <button onClick={() => handleOtherOrgTypeSelect('rijksoverheid')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Rijksoverheid</span>
                          <p className="text-sm text-gray-600 leading-relaxed">Ministeries, uitvoerende diensten en andere rijksorganisaties die namens de Nederlandse staat aanbesteden.</p>
                        </button>
                        <button onClick={() => handleOtherOrgTypeSelect('decentraal')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Decentraal</span>
                          <p className="text-sm text-gray-600 leading-relaxed">Provincies, gemeenten, waterschappen en andere lokale overheden die zelfstandig aanbesteden binnen hun gebied.</p>
                        </button>
                        <button onClick={() => handleOtherOrgTypeSelect('publiekrechterlijk')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Publiekrechtelijk</span>
                          <p className="text-sm text-gray-600 leading-relaxed">Zorgverzekeraars, woningcorporaties en andere organisaties met een publieke taak die aanbesteden volgens de wet.</p>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <button onClick={() => handleOtherOrgTypeSelect('wettelijke-taak')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Met wettelijke taak</span>
                          <p className="text-sm text-gray-600 leading-relaxed">CBR, KvK, UWV en andere rechtspersonen die op grond van de wet publieke taken uitvoeren met eigen bevoegdheden.</p>
                        </button>
                        <button onClick={() => handleOtherOrgTypeSelect('ander-type-organisatie')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Ander type organisatie</span>
                          <p className="text-sm text-gray-600 leading-relaxed">Stichtingen, verenigingen, bedrijven of samenwerkings- verbanden die niet onder de andere categoriën vallen.</p>
                        </button>
                        <div className="hidden lg:block" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="max-w-6xl mx-auto text-center">
                  <button
                    onClick={() => {
                      setPhase('askOrgType');
                      setStateInUrl({ code: selectedCode, step: 'askOrgType' });
                    }}
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                  >
                    Vorige stap
                  </button>
                </div>
              </div>
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'other-org-subsidy' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col gap-6 mb-8">
                      <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
                        <button onClick={() => handleOtherOrgSubsidySelect('ja')} className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">Ja</span>
                        </button>
                        <button onClick={() => handleOtherOrgSubsidySelect('nee')} className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">Nee</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="max-w-6xl mx-auto text-center">
                  <button
                    onClick={() => {
                      setPhase('askSubsidy');
                      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askSubsidy' });
                    }}
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                  >
                    Vorige stap
                  </button>
                </div>
              </div>
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'other-org-subsidy-result' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                {phase === 'other-org-subsidy-result' && <Confetti />}
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto p-8 bg-green-50 border-2 border-green-200 rounded-xl shadow-lg">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-900 mb-4">Je bent niet aanbestedingsplichting</h2>
                        <p className="text-green-800 mb-6 leading-relaxed">
                          Omdat de organisatie waarvoor je werkt niet voor meer dan 50% wordt gesubsidieerd door een aanbestedingsplichtige dienst, val je buiten de reikwijdte van de Aanbestedingswet. Je hoeft geen aanbestedingsprocedure te volgen.
                        </p>
                        <div className="flex flex-col items-center justify-center mt-6 gap-2">
                          <button
                            onClick={() => { window.location.href = '/'; }}
                            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors justify-center"
                          >
                            <Home className="w-5 h-5 mr-2" />
                            Terug naar home
                          </button>
                          <span
                            onClick={() => {
                              setPhase('other-org-subsidy');
                              setStateInUrl({ code: selectedCode, org: organizationType, step: 'other-org-subsidy' });
                            }}
                            className="text-green-600 hover:text-green-800 cursor-pointer transition-colors underline mt-4 text-center"
                          >
                            Terug naar vorige stap
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'askWrittenAgreement' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="mb-8">
                      <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button onClick={() => handleWrittenAgreementSelect('ja')} className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">Ja</span>
                        </button>
                        <button onClick={() => handleWrittenAgreementSelect('nee')} className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">Nee</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="max-w-6xl mx-auto text-center">
                  <button
                    onClick={() => {
                      setPhase('askWrittenAgreement');
                      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askWrittenAgreement' });
                    }}
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                  >
                    Vorige stap
                  </button>
                </div>
              </div>
              {/* askCounterPerformance phase */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'askCounterPerformance' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col gap-6 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <button onClick={() => handleCounterPerformanceSelect('geldbetaling')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Geldbetaling</span>
                        </button>
                        <button onClick={() => handleCounterPerformanceSelect('belastingvoordeel')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Belastingvoordeel of vrijstelling</span>
                        </button>
                        <button onClick={() => handleCounterPerformanceSelect('in-natura')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Product of dienst in natura</span>
                        </button>
                        <button onClick={() => handleCounterPerformanceSelect('anders')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Anders</span>
                        </button>
                        <button onClick={() => handleCounterPerformanceSelect('nee')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Nee</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* askLegallyEnforceable phase */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'askLegallyEnforceable' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col gap-6 mb-8">
                      <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
                        <button onClick={() => handleLegallyEnforceableSelect('ja')} className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">Ja</span>
                        </button>
                        <button onClick={() => handleLegallyEnforceableSelect('nee')} className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">Nee</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* askEconInterest phase */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'askEconInterest' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col gap-6 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <button onClick={() => handleEconInterestSelect('eigenaar')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Ja, de overheid is eigenaar van het resultaat</span>
                        </button>
                        <button onClick={() => handleEconInterestSelect('risico')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Ja, de overheid loopt (mede) financieel risico</span>
                        </button>
                        <button onClick={() => handleEconInterestSelect('openbaar')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Ja, het werk heeft een openbaar karakter</span>
                        </button>
                        <button onClick={() => handleEconInterestSelect('voordeel')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Ja, er is voordeel of betrokkenheid bij de uitvoering</span>
                        </button>
                        <button onClick={() => handleEconInterestSelect('nee')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Nee</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* askThreshold phase */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'askThreshold' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col gap-6 mb-8">
                      <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-3xl mx-auto">
                        <button onClick={() => handleThresholdSelect('ja')} className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">Ja</span>
                        </button>
                        <button onClick={() => handleThresholdSelect('nee')} className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">Nee</span>
                        </button>
                      </div>
                      <div className="text-center">
                        <button onClick={() => handleThresholdSelect('calculator')} className="group p-6 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <div className="flex items-center justify-center">
                            <ExternalLink className="w-5 h-5 mr-2" />
                            <span className="text-xl font-bold text-blue-600">Naar berekening drempelwaarde</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* askCrossBorderInterest phase */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'askCrossBorderInterest' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col gap-6 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <button onClick={() => handleCrossBorderInterestSelect('waarde')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">De waarde van de opdracht?</span>
                        </button>
                        <button onClick={() => handleCrossBorderInterestSelect('specialisatie')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">De technische kennis of specialisatie die nodig is?</span>
                        </button>
                        <button onClick={() => handleCrossBorderInterestSelect('locatie')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">De locatie van de opdracht, bijvoorbeeld dicht bij de grens?</span>
                        </button>
                        <button onClick={() => handleCrossBorderInterestSelect('niet-aannemelijk')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Niet aannemelijk</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* askException phase */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'askException' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col gap-6 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <button onClick={() => handleExceptionSelect('inhouse')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Inhouse gunning</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Je geeft de opdracht aan een eigen organisatie, bijvoorbeeld een dochterbedrijf of uitvoeringsdienst die je zelf volledig controleert.
                          </p>
                        </button>
                        <button onClick={() => handleExceptionSelect('samenwerking')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Samenwerking</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Je werkt samen met andere overheden voor een gemeenschappelijk doel.
                          </p>
                        </button>
                        <button onClick={() => handleExceptionSelect('exclusiviteit')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Exclusiviteit</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Er is een wet die bepaalt dat maar één partij dit mag doen, bijvoorbeeld een organisatie met een wettelijk monopolie.
                          </p>
                        </button>
                        <button onClick={() => handleExceptionSelect('vertrouwelijkheid')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Vertrouwelijkheid</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Het gaat om een opdracht waarbij vertrouwelijkheid of de nationale veiligheid in het geding is.
                          </p>
                        </button>
                        <button onClick={() => handleExceptionSelect('lidstaat')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Inkoop lidstaat</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Je koopt producten of diensten in bij een EU-lidstaat en die lidstaat heeft daarvoor al een aanbesteding gedaan.
                          </p>
                        </button>
                        <button onClick={() => handleExceptionSelect('uitgesloten')} className="group p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Uitgesloten dienstcontract</span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Het betreft een van de diensten als opgesomd in Artikel 2.24 van de Aanbestedingswet.
                          </p>
                        </button>
                        <button onClick={() => handleExceptionSelect('nee')} className="group p-6 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md text-center">
                          <span className="text-xl font-bold text-gray-900 block mb-3">Nee</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'written-agreement-result' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                {phase === 'written-agreement-result' && <Confetti />}
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto p-8 bg-green-50 border-2 border-green-200 rounded-xl shadow-lg">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-900 mb-4">Geen aanbestedingsplicht</h2>
                        <p className="text-green-800 mb-6 leading-relaxed">
                          Er is geen schriftelijke overeenkomst, daarom val je buiten de reikwijdte van de Aanbestedingswet. Je hoeft geen aanbestedingsprocedure te volgen.
                        </p>
                        <div className="flex flex-col items-center justify-center mt-6 gap-2">
                          <button
                            onClick={() => { window.location.href = '/'; }}
                            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors justify-center"
                          >
                            <Home className="w-5 h-5 mr-2" />
                            Terug naar home
                          </button>
                          <span
                            onClick={() => {
                              setPhase('written-agreement');
                              setStateInUrl({ code: selectedCode, org: organizationType, step: 'written-agreement' });
                            }}
                            className="text-green-600 hover:text-green-800 cursor-pointer transition-colors underline mt-4 text-center"
                          >
                            Terug naar vorige stap
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'estimation' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
                <div className="w-full">
                  <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto mb-8">
                      <button
                        onClick={() => handleEstimationSelect('yes')}
                        className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                      >
                        <span className="text-xl font-bold text-gray-900 block mb-3">Ja</span>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Voor ramingen hoger dan {getThresholdAmount(organizationType, typeAanbesteding)} moet je Europees aanbesteden.
                        </p>
                      </button>
                      <button
                        onClick={() => handleEstimationSelect('no')}
                        className="group flex-1 p-6 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                      >
                        <span className="text-xl font-bold text-gray-900 block mb-3">Nee</span>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Voor ramingen lager dan {getThresholdAmount(organizationType, typeAanbesteding)} kan je nationaal aanbesteden.
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          const newWindow = window.open('http://localhost:8080/opdrachtramer', '_blank', 'noopener,noreferrer');
                          if (newWindow) {
                            newWindow.focus();
                          }
                        }}
                        className="group flex-1 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 shadow-sm text-center"
                      >
                        <span className="text-xl font-bold text-gray-600 block mb-3">Hulp met raming?</span>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          Maak een inschatting van je ramingskosten met de ramingstool.
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="max-w-6xl mx-auto text-center">
                  <button
                    onClick={() => {
                      setPhase('askThreshold');
                      setStateInUrl({ code: selectedCode, org: organizationType, step: 'askThreshold' });
                    }}
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                  >
                    Vorige stap
                  </button>
                </div>
              </div>
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${phase === 'high-threshold' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
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
                    <div className="max-w-6xl mx-auto text-center">
                      <button
                        onClick={() => {
                          setPhase('askCrossBorderInterest');
                          setStateInUrl({ code: selectedCode, org: organizationType, step: 'askCrossBorderInterest' });
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

export default AanbestedingsplichtCheckHero; 