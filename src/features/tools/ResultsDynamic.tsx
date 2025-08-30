import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Info, CheckCircle, Building, Calculator, Star } from 'lucide-react';
import { getCpvName } from '../../utils/cpvLookup';
import Confetti from '../../components/Confetti';
import { useStealthMode } from '@/lib/utils';
import { Obligation } from '@/types/obligations';
import { ObligationService } from '@/services/obligationService';
import { ObligationHeader } from '@/components/obligations/ObligationHeader';
import { LegalReferences } from '@/components/obligations/LegalReferences';
import { ObligationSection } from '@/components/obligations/ObligationSection';

const ResultsDynamic: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isStealthMode } = useStealthMode();

  const [cpvName, setCpvName] = useState('Laden...');
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract URL parameters
  const organizationType = searchParams.get('org') || '';
  const estimationAnswer = searchParams.get('estimation') || '';

  // Add fade-in animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in {
        opacity: 0;
        animation: fade-in forwards;
        animation-fill-mode: both;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Store current path in sessionStorage before navigating to results
  useEffect(() => {
    const lastPath = sessionStorage.getItem('lastPath');
    if (!lastPath) {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/results/')) {
        sessionStorage.setItem('lastPath', `/tools/sectorale-verplichtingencheck?code=${code}&org=${organizationType}&step=3`);
      } else if (currentPath.startsWith('/tools/results/')) {
        sessionStorage.setItem('lastPath', `/tools/aanbestedingsplicht-check?code=${code}&org=${organizationType}&step=3`);
      } else {
        sessionStorage.setItem('lastPath', '/start');
      }
    }
  }, [code, organizationType]);

  // Helper functions
  const getOrganizationName = (type: string) => {
    const names: Record<string, string> = {
      'rijksoverheid': 'Rijksoverheid',
      'decentraal': 'Decentraal',
      'publiekrechterlijk': 'Publiekrechterlijk'
    };
    return names[type] || type;
  };

  const getEstimationText = (answer: string) => {
    const texts: Record<string, string> = {
      'yes': 'Ja, boven drempelwaarde',
      'no': 'Nee, onder drempelwaarde',
      'help': 'Hulp nodig met raming'
    };
    return texts[answer] || answer;
  };

  const getThresholdAmount = (orgType: string, typeAanbesteding: string): string => {
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
    
    return thresholds[orgType]?.[typeAanbesteding] || '€221.000';
  };

  // Fetch CPV name and obligations when component mounts
  useEffect(() => {
    if (code) {
      // Fetch CPV name
      getCpvName(code).then(setCpvName);
      
      // Fetch obligations for this CPV code
      setLoading(true);
      ObligationService.getObligationsByCpv(code)
        .then(data => {
          setObligations(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading obligations:', error);
          setObligations([]);
          setLoading(false);
        });
    }
  }, [code]);

  const handleBackNavigation = () => {
    const lastPath = sessionStorage.getItem('lastPath');
    if (lastPath) {
      navigate(lastPath);
    } else {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/results/')) {
        navigate(`/tools/sectorale-verplichtingencheck?code=${code}&org=${organizationType}&step=3`);
      } else if (currentPath.startsWith('/tools/results/')) {
        navigate(`/tools/aanbestedingsplicht-check?code=${code}&org=${organizationType}&step=3`);
      } else {
        navigate('/start');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 lg:px-8 pt-24 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0ms', animationDuration: '700ms' }}>
          <button
            onClick={handleBackNavigation}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Vorige stap
          </button>
        </div>

        {/* Results Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 animate-fade-in" style={{ animationDelay: '200ms', animationDuration: '1000ms' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                {estimationAnswer === 'no' ? (
                  'Geen EED verplichtingen'
                ) : obligations.length > 0 ? (
                  <>
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: '#A53434' }}></span>
                    Let op: EED Verplichtingen
                  </>
                ) : loading ? (
                  'Verplichtingen laden...'
                ) : (
                  'Resultaten'
                )}
              </h1>
              
              {/* EED Description text */}
              {estimationAnswer !== 'no' && obligations.length > 0 && (
                <p className="text-base text-gray-700 mt-3 leading-relaxed">
                  U bent verplicht om alleen producten, diensten, gebouwen en werken met hoge energie-efficiëntieprestaties in te kopen, tenzij dit technisch niet haalbaar is.
                </p>
              )}
            </div>
          </div>

          {/* User Input Summary */}
          {(organizationType || estimationAnswer) && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-gray-700" />
                Uw keuzes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CPV Selection */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-900 uppercase tracking-wide">Aanbesteding</span>
                  </div>
                  <p className="text-sm text-gray-900 font-semibold">{code}</p>
                  <p className="text-xs text-gray-600">{cpvName}</p>
                </div>

                {/* Organization Type */}
                {organizationType && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-900 uppercase tracking-wide">Organisatie</span>
                    </div>
                    <p className="text-sm text-gray-900 font-semibold">{getOrganizationName(organizationType)}</p>
                    <p className="text-xs text-gray-600">Type aanbestedende dienst</p>
                  </div>
                )}

                {/* Estimation Answer */}
                {estimationAnswer && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-900 uppercase tracking-wide">Drempelwaarde</span>
                    </div>
                    <p className="text-sm text-gray-900 font-semibold">{getEstimationText(estimationAnswer)}</p>
                    {organizationType && estimationAnswer !== 'help' && (
                      <p className="text-xs text-gray-600">Drempel: {getThresholdAmount(organizationType, 'Diensten')}</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Red Warning */}
              {estimationAnswer !== 'no' && obligations.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-red-600">⚠️</span>
                    <span>
                      <strong>Let op:</strong> Bij niet-naleving kunnen benadeelde inschrijvers bij de rechter schorsing van de gunning en/of schadevergoeding vorderen wegens onrechtmatig handelen van de aanbestedende dienst.
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Below threshold explanation */}
        {estimationAnswer === 'no' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 animate-fade-in" style={{ animationDelay: '500ms', animationDuration: '1000ms' }}>
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Goed nieuws!</h3>
                <p className="text-green-700 mt-2">
                  Je raming blijft onder de drempelwaarde van {organizationType && getThresholdAmount(organizationType, 'Diensten')}. 
                  Dit betekent dat er geen specifieke sectorale verplichtingen van toepassing zijn op je aanbesteding.
                </p>
                <p className="text-green-600 text-sm mt-3">
                  Je kunt aanbesteden volgens de nationale aanbestedingsregels zonder aanvullende sectorale wetgeving.
                </p>
              </div>
            </div>
            <Confetti />
          </div>
        )}

        {/* Dynamic Obligations Section - only show if above threshold */}
        {estimationAnswer !== 'no' && obligations.length > 0 && (
          <div className="space-y-6">
            {obligations.map((obligation, index) => (
              <div 
                key={obligation.obligation_id} 
                className="space-y-4 animate-fade-in" 
                style={{ animationDelay: `${600 + index * 200}ms`, animationDuration: '1200ms' }}
              >
                {/* Obligation Banner */}
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-6 py-4">
                  <ObligationHeader obligation={obligation} />
                  <LegalReferences references={obligation.legal_references} />
                  
                  {/* Notes section if available */}
                  {obligation.notes && obligation.notes.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium mb-1">Let op:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {obligation.notes.map((note, noteIndex) => (
                          <li key={noteIndex} className="text-sm text-blue-700">{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Render obligation sections */}
                <div className="mt-6 space-y-4">
                  {obligation.sections.map((section) => (
                    <ObligationSection 
                      key={section.key} 
                      section={section}
                      defaultOpen={false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Fallback for no obligations but above threshold */}
        {estimationAnswer !== 'no' && obligations.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 animate-fade-in" style={{ animationDelay: '500ms', animationDuration: '1000ms' }}>
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Info className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">Geen specifieke EED-verplichtingen gevonden</h3>
                <p className="text-yellow-700 mt-2">
                  Voor CPV-code {code} zijn geen specifieke EED- of GPP-verplichtingen geregistreerd. 
                  Raadpleeg de EU GPP-criteria en MVI-criteriatool voor mogelijke toepasselijke eisen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MVI Criteria Banner */}
        {estimationAnswer !== 'no' && obligations.length > 0 && (
          <div className="space-y-4 animate-fade-in mt-8" style={{ animationDelay: '1000ms', animationDuration: '1200ms' }}>
            <div className="bg-gray-100 border border-gray-300 rounded-lg px-6 py-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">NL MVI-criteria</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  MVI
                </span>
              </div>
              <p className="text-gray-700">
                Vanwege de gekozen CPV-code moet u de MVI-criteriatool gebruiken om de juiste criteria voor Maatschappelijk Verantwoord Inkopen te vinden en toe te passen. Deze criteria zijn gebaseerd op de EU-GPP-criteria. Raadpleeg <a href="https://www.mvicriteria.nl/nl/webtool" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">www.mvicriteria.nl</a>
              </p>
            </div>
          </div>
        )}

        {/* EED Disclaimer */}
        {estimationAnswer !== 'no' && obligations.length > 0 && (
          <div className="mt-6 mb-6 animate-fade-in" style={{ animationDelay: '1400ms', animationDuration: '1000ms' }}>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-yellow-800">
                  <span className="font-semibold">Let op:</span> De rapportage in TenderNed over het (niet) toepassen van het energie-efficiëntie-eerst-beginsel is verplicht voor deze aanbesteding. Op basis van artikel 2.98 Aw 2012 controleert de Europese Commissie steekproefsgewijs of uw motivering steekhoudend is.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDynamic;