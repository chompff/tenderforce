import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

          {/* EED CHECK BETA Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-gray-900">EED CHECK</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                BETA
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              De EED Check maakt snel inzichtelijk of - en in welke mate - de EED van toepassing is op uw voorgenomen aanbesteding.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Gebruik de EED Check in de bètafase helemaal gratis. We verzamelen feedback om de tool door te ontwikkelen en nog beter aan te laten sluiten op de praktijk.
            </p>
            <p className="text-sm text-gray-700">
              Feedback is welkom: <a href="mailto:feedback@eedcheck.eu" className="text-blue-600 hover:text-blue-800 underline">feedback@eedcheck.eu</a>
            </p>
          </div>

          {/* OVER Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">OVER</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              De tool is ontwikkeld voor aanbestedingsprofessionals die tijdig inzicht willen in EED-verplichtingen.
            </p>
          </div>

          {/* DISCLAIMER Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">DISCLAIMER</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Omdat de tool zich in bèta bevindt, kunnen functies wijzigen en zijn resultaten indicatief. Voor formele besluiten blijft juridisch advies vereist.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-gray-600">
              <span>© {currentYear} EED CHECK</span>
              <span className="hidden md:inline">•</span>
              <a href="/alle-rechten-voorbehouden" className="hover:text-blue-600 transition-colors">
                Alle rechten voorbehouden
              </a>
              <span className="hidden md:inline">•</span>
              <a href="/privacybeleid" className="hover:text-blue-600 transition-colors">
                Privacybeleid
              </a>
              <span className="hidden md:inline">•</span>
              <a href="/algemene-voorwaarden" className="hover:text-blue-600 transition-colors">
                Algemene voorwaarden
              </a>
              <span className="hidden md:inline">•</span>
              <a href="/disclaimer" className="hover:text-blue-600 transition-colors">
                Disclaimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
