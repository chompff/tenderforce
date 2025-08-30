import React from 'react';



const Disclaimer: React.FC = () => {
  return (
    <>

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Disclaimer</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-8">
                Laatst bijgewerkt: Juli 2025
              </p>

              <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-bold text-red-800 mb-3">⚠️ Belangrijke waarschuwing</h2>
                <p className="text-red-700 leading-relaxed">
                  De informatie en analyses gegenereerd door EED Check zijn uitsluitend bedoeld voor informatieve doeleinden. 
                  Deze output vormt <strong>GEEN juridisch advies</strong> en kan niet worden beschouwd als definitieve 
                  compliance-informatie voor aanbestedingsprocedures.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aard van de dienstverlening</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  EED Check is een informatietool die gebruikers helpt bij het identificeren van 
                  potentieel relevante wet- en regelgeving voor aanbestedingsprocedures. Onze systemen:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Analyseren input op basis van data en procedures</li>
                  <li>Genereren suggesties en analyses die kunnen bevatten fouten of onvolledigheden</li>
                  <li>Werken met informatie die mogelijk niet de meest recente ontwikkelingen weergeeft</li>
                  <li>Kunnen geen rekening houden met specifieke lokale interpretaties of jurisprudentie</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Beperkingen van geautomatiseerde tools</h2>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Technische beperkingen</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Geen garantie op volledigheid:</strong> Tools kunnen relevante informatie missen of overzien</li>
                  <li><strong>Mogelijke inaccuracies:</strong> Systematische fouten kunnen voorkomen</li>
                  <li><strong>Verouderde informatie:</strong> Kennisbank reflecteert mogelijk niet de laatste wijzigingen</li>
                  <li><strong>Contextlimitaties:</strong> Tools begrijpen niet altijd de volledige complexiteit van situaties</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Juridische complexiteit</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Aanbestedingsrecht is een complex juridisch domein waarin:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Lokale interpretaties kunnen afwijken van algemene regels</li>
                  <li>Jurisprudentie continu evolueert</li>
                  <li>Specifieke omstandigheden unieke benaderingen vereisen</li>
                  <li>Multi-level governance (EU, nationaal, regionaal) complex samenspel creëert</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Geen vervanging voor professioneel advies</h2>
                
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Dringend advies</h3>
                  <p className="text-blue-700 leading-relaxed">
                    Raadpleeg altijd gekwalificeerde juridische professionals, aanbestedingsadviseurs of compliance-experts 
                    voordat u definitieve beslissingen neemt op basis van EED Check analyses.
                  </p>
                </div>

                <h3 className="text-xl font-medium text-gray-900 mb-3">3.1 Wanneer professioneel advies noodzakelijk is</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Bij complexe of hoogwaardige aanbestedingen</li>
                  <li>Wanneer er twijfels zijn over toepasselijke regelgeving</li>
                  <li>Bij internationale of grensoverschrijdende procedures</li>
                  <li>Voor definitieve compliance-beslissingen</li>
                  <li>Bij geschillen of juridische procedures</li>
                  <li>Wanneer specifieke sectorregulering van toepassing kan zijn</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-3">3.2 Typen professionals te raadplegen</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Advocaten gespecialiseerd in aanbestedingsrecht</li>
                  <li>Certified aanbestedingsadviseurs</li>
                  <li>Compliance officers met procurement expertise</li>
                  <li>Sectorspecifieke regelgevingsexperts</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Gebruikersverantwoordelijkheden</h2>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">4.1 Due diligence</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Gebruikers zijn verplicht om:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Tool-gegenereerde informatie te verifiëren via onafhankelijke bronnen</li>
                  <li>Recente ontwikkelingen in relevante wetgeving te controleren</li>
                  <li>Specifieke omstandigheden van hun situatie mee te nemen</li>
                  <li>Professioneel advies in te winnen voor belangrijke beslissingen</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-3">4.2 Risico-acceptatie</h3>
                <p className="text-gray-700 leading-relaxed">
                  Door gebruik te maken van EED Check erkent u dat alle beslissingen gebaseerd op onze analyses 
                  voor uw eigen risico zijn en dat u volledig verantwoordelijk bent voor de gevolgen van die beslissingen.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Uitsluiting van aansprakelijkheid</h2>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">5.1 Algemene uitsluiting</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  EED Check wijst alle aansprakelijkheid af voor:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Onjuiste, onvolledige of verouderde informatie in analyses</li>
                  <li>Schade voortvloeiend uit verkeerde interpretatie van gegenereerde content</li>
                  <li>Gemiste deadlines of procedures door verkeerde compliance-informatie</li>
                  <li>Financiële verliezen door verkeerde aanbestedingsbeslissingen</li>
                  <li>Juridische procedures of boetes wegens non-compliance</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-3">5.2 Specifieke uitsluitingen</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Regelgevingswijzigingen:</strong> Wij zijn niet verantwoordelijk voor schade door recente wijzigingen in wet- en regelgeving</li>
                  <li><strong>Technische storingen:</strong> Platform downtime of systeemfouten</li>
                  <li><strong>Derde partijen:</strong> Acties of adviezen van externe professionals</li>
                  <li><strong>Gebruikersfouten:</strong> Verkeerde input of misinterpretatie van output</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Kennisbronnen en referenties</h2>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">6.1 Databronnen</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Onze systemen zijn gebaseerd op publiek beschikbare informatie, inclusief:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Europese en Nederlandse aanbestedingswetgeving</li>
                  <li>Jurisprudentie en rechtspraak</li>
                  <li>Officiële guidance en interpretaties</li>
                  <li>Academische en professionele literatuur</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-3">6.2 Update frequentie</h3>
                <p className="text-gray-700 leading-relaxed">
                  Wij streven ernaar onze kennisbank regelmatig bij te werken, maar kunnen geen garanties geven 
                  over de frequentie of volledigheid van updates. Belangrijke wijzigingen in wetgeving kunnen 
                  enige tijd vergen voordat zij in onze systemen zijn verwerkt.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Aanbevolen best practices</h2>
                
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Optimaal gebruik van EED Check</h3>
                  <ul className="list-decimal list-inside text-green-700 space-y-2">
                    <li>Gebruik EED Check als startpunt voor uw onderzoek, niet als eindpunt</li>
                    <li>Verifieer alle gegenereerde informatie via officiële bronnen</li>
                    <li>Raadpleeg professionals voor complexe of kritieke beslissingen</li>
                    <li>Houd rekening met recente ontwikkelingen in uw sector</li>
                    <li>Documenteer uw due diligence proces voor audit doeleinden</li>
                    <li>Bouw voldoende tijd in voor verificatie en professioneel advies</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact en vragen</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Voor vragen over deze disclaimer of de beperkingen van onze dienstverlening:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>EED Check Support</strong></p>
                  <p className="text-gray-700 mb-2">Email: support@eedtool.eu</p>
                  <p className="text-gray-700 mb-2">Telefoon: +31 (0)20 123 4567</p>
                  <p className="text-gray-700">
                    <strong>Let op:</strong> Ons support team kan geen juridisch advies verstrekken en zal u doorverwijzen 
                    naar gekwalificeerde professionals voor specifieke compliance-vragen.
                  </p>
                </div>
              </section>

              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  Door gebruik te maken van EED Check bevestigt u dat u deze disclaimer heeft gelezen, 
                  begrepen en accepteert, en dat u zich bewust bent van de beperkingen van 
                  geautomatiseerde juridische informatietools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Disclaimer; 