import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Zap, Shield, Users, ArrowLeft } from 'lucide-react';

const PrijzenPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const navigate = useNavigate();

  const features = {
    gratis: [
      "Basis zoekopdrachten",
      "Beperkte resultaten",
      "Community support",
      "Basis CPV-categorieën"
    ],
    pro: [
      "Onbeperkte zoekopdrachten",
      "Volledige sectorale verplichtingen",
      "Gedetailleerde compliance-uitleg",
      "Praktische voorbeelden",
      "Download mogelijkheden",
      "E-mail support",
      "Maandelijkse updates",
      "API toegang (basis)"
    ],
    enterprise: [
      "Alles van Pro",
      "Aangepaste integraties",
      "Dedicated account manager",
      "Prioriteitssupport",
      "Training en onboarding",
      "SLA garanties",
      "Bulk gebruikersbeheer",
      "Uitgebreide API toegang"
    ]
  };

  const pricing = {
    pro: {
      monthly: 39,
      annual: 29
    },
    enterprise: {
      monthly: 149,
      annual: 99
    }
  };

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-6 lg:px-8 py-24">
          {/* Header */}
          <div className="flex items-center gap-4 mb-12">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Terug
            </button>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Kies uw <span className="text-blue-600">EED TOOL</span> plan
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Start gratis en upgrade wanneer u meer functionaliteit nodig heeft. 
              Alle plannen bevatten een 14-daagse gratis proefperiode.
            </p>
            
            {/* Annual/Monthly Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Maandelijks
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  className={`${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Jaarlijks
              </span>
              {isAnnual && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  25% korting
                </span>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratis</h3>
                <p className="text-gray-600 mb-6">Perfect om te beginnen</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">€0</span>
                  <span className="text-gray-600">/maand</span>
                </div>
                <button className="w-full bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium mb-8">
                  Huidige plan
                </button>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 mb-3">Inclusief:</h4>
                {features.gratis.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Meest populair
                </span>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <p className="text-gray-600 mb-6">Voor professionals</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    €{isAnnual ? pricing.pro.annual : pricing.pro.monthly}
                  </span>
                  <span className="text-gray-600">/maand</span>
                  {isAnnual && (
                    <div className="text-sm text-gray-500 line-through">
                      €{pricing.pro.monthly}/maand
                    </div>
                  )}
                </div>
                <a
                  href="/support"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center inline-block"
                >
                  Start je proefperiode
                </a>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 mb-3">Alles van Gratis, plus:</h4>
                {features.pro.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">Voor grote organisaties</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    €{isAnnual ? pricing.enterprise.annual : pricing.enterprise.monthly}
                  </span>
                  <span className="text-gray-600">/maand</span>
                  {isAnnual && (
                    <div className="text-sm text-gray-500 line-through">
                      €{pricing.enterprise.monthly}/maand
                    </div>
                  )}
                </div>
                <button className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium mb-8">
                  Contact opnemen
                </button>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 mb-3">Alles van Pro, plus:</h4>
                {features.enterprise.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-8">Vertrouwd door aanbestedingsprofessionals</p>
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm">99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="text-sm">500+ Klanten</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span className="text-sm">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Veelgestelde vragen
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Kan ik op elk moment opzeggen?
                  </h3>
                  <p className="text-gray-600">
                    Ja, u kunt uw abonnement op elk moment opzeggen. Er zijn geen lange termijncontracten.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Wat gebeurt er na de gratis proefperiode?
                  </h3>
                  <p className="text-gray-600">
                    Na 14 dagen wordt uw account automatisch omgezet naar het gekozen plan. 
                    U kunt op elk moment tijdens de proefperiode opzeggen.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Zijn er extra kosten?
                  </h3>
                  <p className="text-gray-600">
                    Nee, de getoonde prijzen zijn alles-inclusief. Er zijn geen verborgen kosten of setup fees.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Kan ik van plan wisselen?
                  </h3>
                  <p className="text-gray-600">
                    Ja, u kunt op elk moment upgraden of downgraden. 
                    Wijzigingen gaan direct in en worden pro-rato gefactureerd.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-20 text-center bg-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Klaar om uw aanbestedingsprocessen te transformeren?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start vandaag nog met uw gratis proefperiode. Geen verplichtingen.
            </p>
            <div className="text-center">
              <a
                href="/support"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg inline-block"
              >
                Start je proefperiode
              </a>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default PrijzenPage; 