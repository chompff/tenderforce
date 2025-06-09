import React from 'react';



const AlgemeneVoorwaarden: React.FC = () => {
  return (
    <>

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Algemene Voorwaarden</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-8">
                Laatst bijgewerkt: December 2024
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Algemene bepalingen</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen Tenderforce.ai, 
                  gevestigd te Kleverlaan 77, 2061 TD Bloemendaal ("Tenderforce", "wij", "ons") en de gebruiker 
                  van onze AI-gestuurde aanbestedingstools ("gebruiker", "u").
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Door gebruik te maken van onze diensten accepteert u deze voorwaarden volledig. 
                  Indien u niet akkoord gaat met deze voorwaarden, dient u het gebruik van onze platform te staken.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Dienstverlening</h2>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Aard van de diensten</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tenderforce.ai biedt AI-gestuurde tools voor aanbestedingsprofessionals, waaronder maar niet beperkt tot:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Sectorale verplichtingencheck voor aanbestedingen</li>
                  <li>Stappenslang voor compliance-processen</li>
                  <li>Juridische informatietools</li>
                  <li>Automatische analyses van aanbestedingsdocumentatie</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 AI-disclaimer</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                  <p className="text-yellow-800 font-medium">
                    Onze diensten maken gebruik van kunstmatige intelligentie. Alle gegenereerde informatie 
                    is uitsluitend informatief en vormt geen juridisch advies. Raadpleeg altijd gekwalificeerde 
                    juridische professionals voor definitieve beslissingen.
                  </p>
                </div>

                <h3 className="text-xl font-medium text-gray-900 mb-3">2.3 Beschikbaarheid</h3>
                <p className="text-gray-700 leading-relaxed">
                  Wij streven naar 99% uptime, maar kunnen geen absolute garantie geven voor continue beschikbaarheid. 
                  Onderhoud en updates kunnen tijdelijke onderbreking van diensten veroorzaken.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Gebruikersrechten en -verplichtingen</h2>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">3.1 Toegestaan gebruik</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Gebruik voor professionele aanbestedingsdoeleinden</li>
                  <li>Toegang volgens uw abonnementsniveau</li>
                  <li>Redelijk gebruik van AI-capaciteit</li>
                  <li>Naleving van alle toepasselijke wet- en regelgeving</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-3">3.2 Verboden gebruik</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Misbruik van AI-systemen voor frauduleuze doeleinden</li>
                  <li>Uploaden van malware, virussen of schadelijke code</li>
                  <li>Reverse engineering van onze AI-algoritmen</li>
                  <li>Commerciële doorverkoop zonder expliciete toestemming</li>
                  <li>Gebruik dat inbreuk maakt op intellectuele eigendomsrechten</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-3">3.3 Accountverantwoordelijkheden</h3>
                <p className="text-gray-700 leading-relaxed">
                  U bent verantwoordelijk voor het beveiligen van uw accountgegevens en alle activiteiten 
                  die onder uw account plaatsvinden. Informeer ons onmiddellijk bij vermoed misbruik.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Intellectuele eigendom</h2>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">4.1 Onze rechten</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Alle intellectuele eigendomsrechten op onze platform, AI-algoritmen, software, 
                  documentatie en merkrechten blijven eigendom van Tenderforce.ai.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">4.2 Gebruikersgegevens</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  U behoudt eigendom over uw inputgegevens. Door gebruik van onze diensten verleent u ons 
                  een beperkte licentie om uw gegevens te verwerken voor dienstverlening en (geanonimiseerde) 
                  systeemverbetering.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">4.3 AI-gegenereerde content</h3>
                <p className="text-gray-700 leading-relaxed">
                  Output gegenereerd door onze AI-systemen kan door u worden gebruikt voor uw bedrijfsdoeleinden, 
                  maar wij behouden ons het recht voor op vergelijkbare analyses voor andere gebruikers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Betaling en abonnementen</h2>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">5.1 Prijzen en facturering</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Alle prijzen zijn exclusief BTW tenzij anders vermeld. Facturering vindt maandelijks of 
                  jaarlijks plaats volgens uw gekozen abonnement.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">5.2 Automatische verlenging</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Abonnementen verlengen automatisch tenzij u 30 dagen voor afloop opzegt via uw accountinstellingen.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">5.3 Betalingsachterstand</h3>
                <p className="text-gray-700 leading-relaxed">
                  Bij betalingsachterstand kunnen wij uw toegang opschorten tot betaling is ontvangen. 
                  Na 30 dagen achterstand kunnen wij het account permanent sluiten.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Aansprakelijkheid en garanties</h2>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">6.1 Beperkte garanties</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Onze diensten worden geleverd "as is". Wij garanderen niet dat onze AI-analyses 
                  volledig, accuraat of geschikt zijn voor specifieke doeleinden.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">6.2 Aansprakelijkheidsbeperking</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Onze totale aansprakelijkheid is beperkt tot het bedrag betaald door u in de 
                  12 maanden voorafgaand aan de claim, met een maximum van €10.000.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">6.3 Uitgesloten schade</h3>
                <p className="text-gray-700 leading-relaxed">
                  Wij zijn niet aansprakelijk voor indirecte schade, gevolgschade, gemiste winsten, 
                  of schade door verkeerde AI-analyses of compliance-interpretaties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Beëindiging</h2>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">7.1 Opzegging door gebruiker</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  U kunt uw abonnement op elk moment opzeggen via uw accountinstellingen. 
                  Reeds betaalde bedragen worden niet gerestitueerd.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">7.2 Opzegging door Tenderforce</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Wij kunnen uw account beëindigen bij schending van deze voorwaarden, na schriftelijke 
                  waarschuwing en een hersteltermijn van 14 dagen.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">7.3 Gevolgen beëindiging</h3>
                <p className="text-gray-700 leading-relaxed">
                  Na beëindiging verliest u toegang tot alle diensten. Wij bewaren uw gegevens 
                  gedurende 30 dagen voor eventuele data-export, waarna definitieve verwijdering plaatsvindt.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Wijzigingen</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Wij behouden ons het recht voor deze voorwaarden te wijzigen. Belangrijke wijzigingen 
                  worden 30 dagen van tevoren gecommuniceerd via e-mail.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Continued gebruik na wijzigingen betekent acceptatie van de nieuwe voorwaarden.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Toepasselijk recht en geschillen</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden voorgelegd 
                  aan de bevoegde rechter in Haarlem, Nederland.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Wij streven ernaar geschillen eerst op te lossen via directe communicatie of mediation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>Tenderforce.ai</strong></p>
                  <p className="text-gray-700 mb-2">Kleverlaan 77, 2061 TD Bloemendaal</p>
                  <p className="text-gray-700 mb-2">Nederland</p>
                  <p className="text-gray-700 mb-2">Email: legal@tenderforce.ai</p>
                  <p className="text-gray-700 mb-2">Telefoon: +31 (0)20 123 4567</p>
                  <p className="text-gray-700">KvK nummer: [TBD]</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Slotbepalingen</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Indien een bepaling van deze voorwaarden nietig of vernietigbaar is, blijven de 
                  overige bepalingen volledig van kracht.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Deze voorwaarden vormen de volledige overeenkomst tussen partijen en vervangen 
                  alle eerdere afspraken betreffende het onderwerp.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default AlgemeneVoorwaarden; 