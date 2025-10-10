import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Home, CheckCircle, ArrowLeft, Star, Building } from 'lucide-react';
import Confetti from '../../components/Confetti';


const getOrganizationName = (type: string) => {
  const names: Record<string, string> = {
    'rijksoverheid': 'Rijksoverheid',
    'decentraal': 'Decentraal',
    'publiekrechterlijk': 'Publiekrechterlijk',
    'ander-type-organisatie': 'Ander type organisatie',
    'wettelijke-taak': 'Met wettelijke taak',
    'anders': 'Anders',
  };
  return names[type] || type;
};

const AanbestedingsplichtCheckResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const org = searchParams.get('org');
  const userOrg = searchParams.get('userOrg'); // User's own organization
  const subsidy = searchParams.get('subsidy');
  const agreement = searchParams.get('agreement'); // Written agreement answer
  const step = searchParams.get('step'); // Current step
  const [cpvName, setCpvName] = useState('');

  // Debug log for URL params
  useEffect(() => {
     
    console.log('AanbestedingsplichtCheckResult params:', { org, userOrg, subsidy, agreement, step, search: window.location.search });
  }, [org, userOrg, subsidy, agreement, step]);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      import('../../utils/cpvLookup').then(({ getCpvName }) => {
        getCpvName(code).then(setCpvName);
      });
    }
  }, [searchParams]);

  // Determine the organizations to display
  // If userOrg exists, it's the user's own org; org is the contracting org
  // If userOrg doesn't exist, org is likely the contracting org and we show it for both
  const jouwOrganisatie = userOrg || org || 'Niet opgegeven';
  const opdrachtgevendeOrganisatie = org || 'Niet opgegeven';
  
  // Determine the third card based on the result type
  const isWrittenAgreementResult = step === 'written-agreement-result';
  const isSubsidyResult = step === 'other-org-subsidy-result';
  
  // Third card content based on result type
  const thirdCardTitle = isWrittenAgreementResult ? 'Schriftelijke overeenkomst' : 'Subsidie';
  const thirdCardValue = isWrittenAgreementResult 
    ? (agreement === 'nee' ? 'Nee' : agreement === 'ja' ? 'Ja' : 'Niet opgegeven')
    : (subsidy === 'nee' ? 'Nee, minder dan 50%' : subsidy === 'ja' ? 'Ja, meer dan 50%' : 'Niet opgegeven');
  const thirdCardSubtext = isWrittenAgreementResult 
    ? 'Is er een schriftelijke overeenkomst?'
    : 'Geeft een aanbestedingsplichtige organisatie meer dan 50% subsidie aan jouw opdrachtgever?';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <div className="container mx-auto px-6 lg:px-8 py-8 flex-1">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0ms', animationDuration: '700ms' }}>
          <button
            onClick={() => {
              const lastPath = sessionStorage.getItem('lastPath');
              if (lastPath) {
                navigate(lastPath);
              } else {
                // Fallback to default navigation based on result type
                const params = new URLSearchParams(window.location.search);
                if (isWrittenAgreementResult) {
                  params.set('step', 'written-agreement');
                } else {
                  params.set('step', 'other-org-subsidy');
                }
                navigate(`/tools/aanbestedingsplicht-check?${params.toString()}`);
              }
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Vorige stap
          </button>
        </div>

        {/* Results Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 animate-fade-in" style={{ animationDelay: '200ms', animationDuration: '1000ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Geen aanbestedingsplicht</h1>
          </div>
          {/* User Input Summary */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Uw keuzes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Jouw organisatie - Always show */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-900">Jouw organisatie</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{getOrganizationName(jouwOrganisatie)}</p>
                <p className="text-xs text-gray-600">De organisatie waar je zelf voor werkt of deze check voor invult.</p>
              </div>
              
              {/* Opdrachtgevende organisatie - Always show */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-900">Opdrachtgevende organisatie</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{getOrganizationName(opdrachtgevendeOrganisatie)}</p>
                <p className="text-xs text-gray-600">De organisatie waarvoor je de opdracht uitvoert.</p>
              </div>
              
              {/* Third card - Subsidie or Written Agreement */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-900">{thirdCardTitle}</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{thirdCardValue}</p>
                <p className="text-xs text-gray-600">{thirdCardSubtext}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Green notification */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 animate-fade-in" style={{ animationDelay: '500ms', animationDuration: '1000ms' }}>
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Goed nieuws!</h3>
              <p className="text-green-700 mt-2">
                {isWrittenAgreementResult ? (
                  <>
                    Er is geen schriftelijke overeenkomst. <br />
                    Dit betekent dat je buiten de reikwijdte van de Aanbestedingswet valt en geen aanbestedingsprocedure hoeft te volgen.
                  </>
                ) : (
                  <>
                    Je opdrachtgever ontvangt minder dan 50% subsidie van een overheidsorganisatie. <br />
                    Dit betekent dat je buiten de reikwijdte van de Aanbestedingswet valt en geen aanbestedingsprocedure hoeft te volgen.
                  </>
                )}
              </p>
              <p className="text-green-600 text-sm mt-3">
                Je kunt de opdracht uitvoeren zonder aanvullende aanbestedingsregels.
              </p>
            </div>
          </div>
          <Confetti />
        </div>
      </div>

    </div>
  );
};

export default AanbestedingsplichtCheckResult; 