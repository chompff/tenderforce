import { Obligation } from '@/types/obligations';
import tyresData from './tyres.json';
import furnitureData from './furniture.json';
import ecodesignData from './ecodesign.json';
import energyLabelData from './energy-label.json';
import servicesData from './services.json';
import algemeneEedData from './algemene-eed.json';
import gppFurnitureData from './gpp-furniture.json';
import standardObligationsData from './standard-obligations.json';
import buildingsData from './buildings.json';

// Type-safe obligation imports
const tyres: Obligation = tyresData as Obligation;
const furniture: Obligation = furnitureData as Obligation;
const ecodesign: Obligation = ecodesignData as Obligation;
const energyLabel: Obligation = energyLabelData as Obligation;
const services: Obligation = servicesData as Obligation;
const algemeneEed: Obligation = algemeneEedData as Obligation;
const gppFurniture: Obligation = gppFurnitureData as Obligation;
const standardObligations: Obligation = standardObligationsData as Obligation;
const buildings: Obligation = buildingsData as Obligation;

// Map of obligation IDs to obligation data
export const obligations: Record<string, Obligation> = {
  tyres,
  furniture,
  ecodesign_products: ecodesign,
  energy_label_products: energyLabel,
  services_new_products: services,
  algemene_eed: algemeneEed,
  'gpp-furniture': gppFurniture,
  standard_obligations: standardObligations,
  buildings: buildings,
};

// Map of CPV codes to obligation IDs
// This mapping determines which obligations apply to which CPV codes
export const cpvToObligationMap: Record<string, string[]> = {
  // Algemene EED verplichtingen
  '90510000-5': ['algemene_eed'], // Afvoer van huisvuil en behandeling van afval

  // Buildings CPV codes
  '45000000-7': ['buildings'], // Bouwwerkzaamheden

  // Tyres CPV codes (with full codes including hyphens)
  '34350000-5': ['tyres'], // Banden voor normale en zware voertuigen
  // '34351000-2': ['tyres'], // Banden voor normale auto's
  // '34351100-3': ['tyres'], // Banden voor motorvoertuigen
  // '34352000-9': ['tyres'], // Banden voor zwaar gebruik
  // '34352100-0': ['tyres'], // Banden voor vrachtwagens
  // '34352200-1': ['tyres'], // Banden voor autobussen
  // '34352300-2': ['tyres'], // Banden voor landbouwmachines
  
  // Furniture CPV codes (with full codes including hyphens)
  // '39000000-2': ['furniture'], // Meubelen (inclusief kantoormeubelen), inrichting, huishoudapparaten
  // '39100000-3': ['furniture'], // Meubelen
  // '39110000-6': ['furniture'], // Zitplaatsen, stoelen en aanverwante producten
  // '39111000-3': ['furniture'], // Zitplaatsen
  // '39111100-4': ['furniture'], // Draaistoelen
  // '39111200-5': ['furniture'], // Theaterstoelen
  // '39111300-6': ['furniture'], // Kantoorstoelen
  // '39112000-0': ['furniture'], // Stoelen
  // '39112100-1': ['furniture'], // Eetstoelen
  // '39113000-7': ['furniture'], // Diverse zitplaatsen en stoelen
  // '39113100-8': ['furniture'], // Fauteuils
  // '39113200-9': ['furniture'], // Banken
  // '39113300-0': ['furniture'], // Tuinbanken
  // '39113400-1': ['furniture'], // Canapés
  // '39113500-2': ['furniture'], // Poufs
  // '39113600-3': ['furniture'], // Bankjes
  // '39113700-4': ['furniture'], // Voetsteunen
  // '39114000-4': ['furniture'], // Onderdelen van zitplaatsen
  // '39114100-5': ['furniture'], // Kussens
  // '39120000-9': ['furniture'], // Tafels, kasten, bureaus en boekenkasten
  // '39121000-6': ['furniture'], // Bureaus en tafels
  // '39121100-7': ['furniture'], // Bureaus
  // '39121200-8': ['furniture'], // Tafels
  // '39122000-3': ['furniture'], // Kasten, boekenkasten, rekken
  // '39122100-4': ['furniture'], // Kasten
  // '39122200-5': ['furniture'], // Boekenkasten
  '39130000-2': ['gpp-furniture'], // Kantoormeubelen
  // '39131000-9': ['furniture'], // Kantoorstellingen
  // '39131100-0': ['furniture'], // Archiefstellingen
  // '39132000-6': ['furniture'], // Archiefsystemen
  // '39132100-7': ['furniture'], // Archiefkasten
  // '39132200-8': ['furniture'], // Hangmappensystemen
  // '39132300-9': ['furniture'], // Kartotheken
  // '39132400-0': ['furniture'], // Ladenkastjes
  // '39132500-1': ['furniture'], // Roterende archiefkasten
  // '39133000-3': ['furniture'], // Displayeenheden
  // '39134000-0': ['furniture'], // Computermeubelen
  // '39134100-1': ['furniture'], // Computertafels
  // '39135000-7': ['furniture'], // Sorteertafels
  // '39135100-8': ['furniture'], // Postsorteerkasten
  // '39136000-4': ['furniture'], // Kleerhaken
  // '39137000-1': ['furniture'], // Waterfonteinen
  // '39140000-5': ['furniture'], // Huishoudelijk meubilair
  // '39141000-2': ['furniture'], // Keukenmeubelen en -uitrusting
  // '39141100-3': ['furniture'], // Rekken
  // '39141200-4': ['furniture'], // Werkbladen
  // '39141300-5': ['furniture'], // Inbouwkasten
  // '39141400-6': ['furniture'], // Keukenkastjes
  // '39141500-7': ['furniture'], // Afzuigkappen
  // '39142000-9': ['furniture'], // Tuinmeubelen
  // '39143000-6': ['furniture'], // Slaapkamer-, eetkamer- en woonkamermeubelen
  // '39143100-7': ['furniture'], // Slaapkamermeubelen
  // '39143110-0': ['furniture'], // Bedden en beddengoed
  // '39143111-7': ['furniture'], // Wasslijnen
  // '39143112-4': ['furniture'], // Matrassen
  // '39143113-1': ['furniture'], // Diverse bedden
  // '39143120-3': ['furniture'], // Kleerkasten
  // '39143121-0': ['furniture'], // Kledingkasten
  // '39143122-7': ['furniture'], // Hangkasten
  // '39143123-4': ['furniture'], // Toilettafels
  // '39143200-8': ['furniture'], // Eetkamermeubelen
  // '39143210-1': ['furniture'], // Eettafels
  // '39143300-9': ['furniture'], // Woonkamermeubelen
  // '39143310-2': ['furniture'], // Salontafels
  // '39144000-3': ['furniture'], // Badkamermeubelen
  // '39150000-8': ['furniture'], // Diverse meubelen en uitrusting
  // '39151000-5': ['furniture'], // Diverse meubelen
  // '39151100-6': ['furniture'], // Stellingen voor algemeen gebruik
  // '39151200-7': ['furniture'], // Werktafels
  // '39151300-8': ['furniture'], // Modulair meubilair
  // '39153000-2': ['furniture'], // Conferentiezaalmeubelen
  // '39153100-3': ['furniture'], // Draaitafels
  // '39154000-6': ['furniture'], // Tentoonstellingsmateriaal
  // '39154100-7': ['furniture'], // Tentoonstellingsstands
  // '39155000-3': ['furniture'], // Bibliotheekmeubelen
  // '39155100-4': ['furniture'], // Bibliotheekuitrusting
  // '39156000-0': ['furniture'], // Lounge- en ontvangstmeubelen
  
  // Ecodesign products CPV codes (energy-related products with full codes)
  // '31500000-7': ['ecodesign_products'], // Verlichtingsapparatuur en elektrische lampen
  // '31520000-7': ['ecodesign_products'], // Lampen en verlichtingstoestellen
  '30213000-5': ['ecodesign_products'], // Personal computers
  // '30213100-6': ['ecodesign_products'], // Draagbare computers
  // '30213300-8': ['ecodesign_products'], // Desktopcomputers
  // '30231000-7': ['ecodesign_products'], // Computerschermen en -consoles
  // '48820000-2': ['ecodesign_products'], // Servers
  // '39710000-2': ['ecodesign_products'], // Elektrische huishoudelijke apparaten
  // '39711000-9': ['ecodesign_products'], // Elektrische apparaten voor keukengebruik
  // '39711100-0': ['ecodesign_products', 'energy_label_products'], // Koelkasten en diepvriezers
  // '39713000-3': ['ecodesign_products', 'energy_label_products'], // Vaatwasmachines
  // '39713200-5': ['ecodesign_products', 'energy_label_products'], // Wasmachines
  // '39713300-6': ['ecodesign_products'], // Afwasdrogers
  // '39713400-7': ['ecodesign_products', 'energy_label_products'], // Droogtrommel
  // '39714000-0': ['ecodesign_products'], // Ventilatie- of recyclingkappen
  // '42512000-8': ['ecodesign_products'], // Airconditioninginstallaties
  // '42512200-0': ['ecodesign_products', 'energy_label_products'], // Muur-airconditioningtoestellen
  // '42512300-1': ['ecodesign_products', 'energy_label_products'], // Airconditioningtoestellen voor kamers
  // '42512500-3': ['ecodesign_products', 'energy_label_products'], // Raam-airconditioningtoestellen
  // '42513000-5': ['ecodesign_products'], // Koelapparatuur
  // '42513200-7': ['ecodesign_products'], // Commerciële koelkasten
  // '42513220-3': ['ecodesign_products'], // Displaykoelkasten
  // '42513290-4': ['ecodesign_products'], // Diepvriesapparatuur
  // '44115000-7': ['ecodesign_products'], // Elektromotoren
  // '44621000-0': ['ecodesign_products'], // Radiatoren en ketels
  // '44621100-1': ['ecodesign_products'], // Radiatoren
  // '44621110-4': ['ecodesign_products'], // Centrale-verwarmingsradiatoren
  // '44621200-2': ['ecodesign_products'], // Ketels
  // '44621220-8': ['ecodesign_products'], // Centrale-verwarmingsketels
  // '09323000-9': ['ecodesign_products'], // Stadsverwarming
  
  // Energy label products CPV codes (with full codes)
  // Note: Some products may have both ecodesign AND energy label obligations (see above)
  // '31531000-0': ['energy_label_products'], // Elektrische lampen
  // '31532000-4': ['energy_label_products'], // Onderdelen van lampen
  // '31532800-2': ['energy_label_products'], // Lamparmen
  // '31532900-3': ['energy_label_products'], // Lantaarnpalen
  // '31532910-6': ['energy_label_products'], // Lantaarnpalen voor straatverlichting
  // '31532920-9': ['energy_label_products'], // Lantaarnpalen voor snelwegen
  // '30231100-8': ['energy_label_products'], // Computerterminals
  // '30231200-9': ['energy_label_products'], // Desktopconsoles
  '30231300-0': ['energy_label_products'], // Beeldschermen
  // '30231310-3': ['energy_label_products'], // Platte beeldschermen
  // '30231320-6': ['energy_label_products'], // Touchscreenmonitoren
  // '32324000-7': ['energy_label_products'], // Televisietoestellen
  // '32324100-8': ['energy_label_products'], // Kleurentelevisietoestellen
  // '32324200-9': ['energy_label_products'], // Kleurentelevisiecamera's
  // '32324300-0': ['energy_label_products'], // Televisieapparatuur
  // '32324310-3': ['energy_label_products'], // Televisietoestellen
  // '32324400-1': ['energy_label_products'], // Televisieantennes
  // '32324500-2': ['energy_label_products'], // Videotuners
  // '32324600-3': ['energy_label_products'], // Digitale-televisietoestellen
  // '39715000-3': ['energy_label_products'], // Warmwatertoestellen
  // '39715100-4': ['energy_label_products'], // Elektrische warmwatertoestellen
  // '39715200-5': ['energy_label_products'], // Warmwateruitrusting
  // '39715210-8': ['energy_label_products'], // Elektrische warmwateruitrusting
  // '39715220-1': ['energy_label_products'], // Warmwateruitrusting op gas
  // '39715230-4': ['energy_label_products'], // Warmwateruitrusting op zonne-energie
  // '39715240-7': ['energy_label_products'], // Warmwateruitrusting op vaste brandstof
  // '39721000-2': ['energy_label_products'], // Huishoudelijke kook- of verwarmingsapparatuur
  // '39721100-3': ['energy_label_products'], // Huishoudovens
  // '39721200-4': ['energy_label_products'], // Fornuizen
  // '39221000-7': ['energy_label_products'], // Keukenuitrusting
  // '39221100-8': ['energy_label_products'], // Keukengerei
  // '39221110-1': ['energy_label_products'], // Tafelgerei
  // '39221120-4': ['energy_label_products'], // Kopjes en glazen
  // '39221121-1': ['energy_label_products'], // Kopjes
  // '39221122-8': ['energy_label_products'], // Glazen
  // '39221123-5': ['energy_label_products'], // Mokken
  
  // Services CPV codes that may involve purchasing new products (with full codes)
  // Cleaning services
  '90900000-6': ['services_new_products'], // Schoonmaak- en sanitaire diensten
  // '90910000-9': ['services_new_products'], // Schoonmaakdiensten
  // '90911000-6': ['services_new_products'], // Schoonmaak van accommodatie, gebouwen en ramen
  // '90911200-8': ['services_new_products'], // Schoonmaak van gebouwen
  // '90911300-9': ['services_new_products'], // Schoonmaak van ramen
  // '90912000-3': ['services_new_products'], // Schoonmaak van reservoirs
  // '90913000-0': ['services_new_products'], // Schoonmaak van tanks en reservoirs
  // '90914000-7': ['services_new_products'], // Schoonmaak van parkeergarages
  // '90915000-4': ['services_new_products'], // Schoonmaak van ovens en schoorstenen
  // '90916000-1': ['services_new_products'], // Ontsmetting van telefoons
  // '90917000-8': ['services_new_products'], // Schoonmaak van transportvoertuigen
  // '90918000-5': ['services_new_products'], // Schoonmaak van vuilnisbakken
  // '90919000-2': ['services_new_products'], // Schoonmaak van kantoren, scholen en kantoorapparatuur
  // '90919200-4': ['services_new_products'], // Schoonmaak van kantoren
  // '90919300-5': ['services_new_products'], // Schoonmaak van scholen
  
  // Maintenance and repair services (with full codes)
  // '50000000-5': ['services_new_products'], // Reparatie- en onderhoudsdiensten
  // '50100000-6': ['services_new_products'], // Reparatie, onderhoud en aanverwante diensten voor voertuigen
  // '50300000-8': ['services_new_products'], // Reparatie, onderhoud en aanverwante diensten voor computers
  // '50310000-1': ['services_new_products'], // Onderhoud en reparatie van kantoormachines
  // '50320000-4': ['services_new_products'], // Reparatie- en onderhoudsdiensten voor personal computers
  // '50330000-7': ['services_new_products'], // Onderhoudsdiensten voor telecommunicatieapparatuur
  // '50340000-0': ['services_new_products'], // Reparatie- en onderhoudsdiensten voor audiovisuele en optische apparatuur
  // '50400000-9': ['services_new_products'], // Reparatie- en onderhoudsdiensten voor medische en precisieapparatuur
  // '50500000-0': ['services_new_products'], // Reparatie- en onderhoudsdiensten voor pompen, kleppen, kranen en metalen containers
  // '50700000-2': ['services_new_products'], // Reparatie- en onderhoudsdiensten voor gebouwinstallaties
  // '50710000-5': ['services_new_products'], // Reparatie- en onderhoudsdiensten voor elektrische en mechanische gebouwinstallaties
  // '50711000-2': ['services_new_products'], // Reparatie- en onderhoudsdiensten voor elektrische gebouwinstallaties
  // '50712000-9': ['services_new_products'], // Reparatie- en onderhoudsdiensten voor mechanische gebouwinstallaties
  // '50720000-8': ['services_new_products'], // Reparatie- en onderhoudsdiensten voor centrale verwarming
  // '50730000-1': ['services_new_products'], // Reparatie- en onderhoudsdiensten voor koelinstallaties
  // '50740000-4': ['services_new_products'], // Reparatie- en onderhoudsdiensten voor roltrappen
  // '50750000-7': ['services_new_products'], // Onderhoudsdiensten voor liften
  // '50760000-0': ['services_new_products'], // Reparatie- en onderhoudsdiensten voor openbare toiletten
  // '50800000-3': ['services_new_products'], // Diverse reparatie- en onderhoudsdiensten
  
  // Facility management services (with full codes)
  // '70330000-3': ['services_new_products'], // Beheer van onroerend goed tegen vergoeding of op contractbasis
  // '70331000-0': ['services_new_products'], // Huisvestingsbeheer
  // '70331100-1': ['services_new_products'], // Beheer van onroerend goed
  // '70332000-7': ['services_new_products'], // Onderhoud van onroerend goed tegen vergoeding of op contractbasis
  // '70332100-8': ['services_new_products'], // Beheer van mechanische uitrusting
  // '70332200-9': ['services_new_products'], // Beheer van elektrische uitrusting
  // '70332300-0': ['services_new_products'], // Beheer van loodgietersuitrusting
  
  // Catering services (with full codes)
  // '55300000-3': ['services_new_products'], // Restaurant- en voedselverstrekking
  // '55310000-6': ['services_new_products'], // Bediening in restaurants
  // '55311000-3': ['services_new_products'], // Beperkte bediening in restaurants
  // '55312000-0': ['services_new_products'], // Onbeperkte bediening in restaurants
  // '55320000-9': ['services_new_products'], // Maaltijdverstrekking
  // '55321000-6': ['services_new_products'], // Maaltijdbereiding
  // '55322000-3': ['services_new_products'], // Koken van maaltijden
  // '55330000-2': ['services_new_products'], // Cafetariadiensten
  // '55400000-4': ['services_new_products'], // Verstrekking van dranken
  // '55410000-7': ['services_new_products'], // Barbeheer
  // '55500000-5': ['services_new_products'], // Kantine- en cateringdiensten
  // '55510000-8': ['services_new_products'], // Kantinediensten
  // '55511000-5': ['services_new_products'], // Kantine- en andere beperkte cafetariadiensten
  // '55512000-2': ['services_new_products'], // Kantinebeheer
  // '55520000-1': ['services_new_products'], // Cateringdiensten
  // '55521000-8': ['services_new_products'], // Cateringdiensten voor particuliere huishoudens
  // '55521100-9': ['services_new_products'], // Tafeltje-dekje-diensten
  // '55521200-0': ['services_new_products'], // Maaltijdbezorging
  '55522000-5': ['algemene_eed'], // Cateringdiensten voor vervoersondernemingen
  // '55523000-2': ['services_new_products'], // Cateringdiensten voor andere ondernemingen of instellingen
  // '55523100-3': ['services_new_products'], // Schoolmaaltijddiensten
  // '55524000-9': ['services_new_products'], // Schoolcateringdiensten
  
  // Add more CPV to obligation mappings as needed
};

// Helper function to get obligations by CPV code
export function getObligationsByCpv(cpvCode: string): Obligation[] {
  let result: Obligation[] = [];

  // First try exact match
  const obligationIds = cpvToObligationMap[cpvCode];

  if (obligationIds) {
    result = obligationIds.map(id => obligations[id]).filter(Boolean);
  } else {
    // If no exact match, try parent codes (remove last digit repeatedly)
    let parentCode = cpvCode;
    while (parentCode.length > 2) {
      // Remove last character if it's a digit
      if (parentCode[parentCode.length - 1] !== '0') {
        parentCode = parentCode.slice(0, -1) + '0';
      } else {
        parentCode = parentCode.slice(0, -1);
      }

      const parentObligationIds = cpvToObligationMap[parentCode];
      if (parentObligationIds) {
        result = parentObligationIds.map(id => obligations[id]).filter(Boolean);
        break;
      }
    }
  }

  // Always append standard_obligations if there are any obligations
  if (result.length > 0 && obligations.standard_obligations) {
    result.push(obligations.standard_obligations);
  }

  return result;
}

// Helper function to get a specific obligation by ID
export function getObligationById(obligationId: string): Obligation | null {
  return obligations[obligationId] || null;
}