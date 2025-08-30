import { Obligation } from '@/types/obligations';
import tyresData from './tyres.json';
import furnitureData from './furniture.json';
import ecodesignData from './ecodesign.json';
import energyLabelData from './energy-label.json';
import servicesData from './services.json';

// Type-safe obligation imports
const tyres: Obligation = tyresData as Obligation;
const furniture: Obligation = furnitureData as Obligation;
const ecodesign: Obligation = ecodesignData as Obligation;
const energyLabel: Obligation = energyLabelData as Obligation;
const services: Obligation = servicesData as Obligation;

// Map of obligation IDs to obligation data
export const obligations: Record<string, Obligation> = {
  tyres,
  furniture,
  ecodesign_products: ecodesign,
  energy_label_products: energyLabel,
  services_new_products: services,
};

// Map of CPV codes to obligation IDs
// This mapping determines which obligations apply to which CPV codes
export const cpvToObligationMap: Record<string, string[]> = {
  // Tyres CPV codes
  '34350000': ['tyres'], // Tyres for heavy/light-duty vehicles
  '34351000': ['tyres'], // Tyres for motorcycles
  '34351100': ['tyres'], // Tyres for passenger cars
  '34352000': ['tyres'], // Tyres for special vehicles
  '34352100': ['tyres'], // Tyres for trucks
  '34352200': ['tyres'], // Tyres for buses
  '34352300': ['tyres'], // Tyres for aircraft
  
  // Furniture CPV codes  
  '39000000': ['furniture'], // Furniture (incl. office furniture), furnishings, domestic appliances
  '39100000': ['furniture'], // Furniture
  '39110000': ['furniture'], // Seats, chairs and related products
  '39120000': ['furniture'], // Tables, cupboards, desks and bookcases
  '39130000': ['furniture'], // Office furniture
  '39131000': ['furniture'], // Office shelving
  '39132000': ['furniture'], // Filing systems
  '39134000': ['furniture'], // Computer furniture
  '39141000': ['furniture'], // Kitchen furniture and equipment
  '39150000': ['furniture'], // Miscellaneous furniture and equipment
  '39151000': ['furniture'], // Miscellaneous furniture
  '39153000': ['furniture'], // Conference room furniture
  '39154000': ['furniture'], // Exhibition equipment
  '39155000': ['furniture'], // Library furniture
  '39156000': ['furniture'], // Lounge and reception area furniture
  
  // Ecodesign products CPV codes (energy-related products)
  '31500000': ['ecodesign_products'], // Lighting equipment and electric lamps
  '31520000': ['ecodesign_products'], // Lamps and light fittings
  '30213000': ['ecodesign_products'], // Personal computers
  '30213100': ['ecodesign_products'], // Portable computers
  '30213300': ['ecodesign_products'], // Desktop computers
  '30231000': ['ecodesign_products'], // Computer screens and consoles
  '48820000': ['ecodesign_products'], // Servers
  '39710000': ['ecodesign_products'], // Electrical domestic appliances
  '39711000': ['ecodesign_products'], // Electrical appliances for kitchen use
  '39711100': ['ecodesign_products', 'energy_label_products'], // Refrigerators and freezers (both apply)
  '39713000': ['ecodesign_products', 'energy_label_products'], // Dishwashers and dish dryers (both apply)
  '39713200': ['ecodesign_products', 'energy_label_products'], // Washing machines (both apply)
  '39713300': ['ecodesign_products'], // Dish dryers
  '39713400': ['ecodesign_products', 'energy_label_products'], // Tumble dryers (both apply)
  '39714000': ['ecodesign_products'], // Ventilation or recycling hoods
  '42512000': ['ecodesign_products'], // Air-conditioning installations
  '42512200': ['ecodesign_products', 'energy_label_products'], // Wall air-conditioning units (both apply)
  '42512300': ['ecodesign_products', 'energy_label_products'], // Room air-conditioning units (both apply)
  '42512500': ['ecodesign_products', 'energy_label_products'], // Window air-conditioning units (both apply)
  '42513000': ['ecodesign_products'], // Refrigeration equipment
  '42513200': ['ecodesign_products'], // Commercial refrigerators
  '42513220': ['ecodesign_products'], // Display refrigerators
  '42513290': ['ecodesign_products'], // Deep-freezing equipment
  '44115000': ['ecodesign_products'], // Electric motors
  '44621000': ['ecodesign_products'], // Radiators and boilers
  '44621100': ['ecodesign_products'], // Radiators
  '44621110': ['ecodesign_products'], // Central-heating radiators
  '44621200': ['ecodesign_products'], // Boilers
  '44621220': ['ecodesign_products'], // Central-heating boilers
  '09323000': ['ecodesign_products'], // Industrial heating
  
  // Energy label products CPV codes
  // Note: Some products may have both ecodesign AND energy label obligations (see above)
  '31531000': ['energy_label_products'], // Electric lamps
  '31532000': ['energy_label_products'], // Lamp parts
  '31532800': ['energy_label_products'], // Lamp arms
  '31532900': ['energy_label_products'], // Lamp posts
  '31532910': ['energy_label_products'], // Lamp posts for street lighting
  '31532920': ['energy_label_products'], // Lamp posts for motorways
  '30231100': ['energy_label_products'], // Computer terminals
  '30231200': ['energy_label_products'], // Desktop consoles
  '30231300': ['energy_label_products'], // Display screens
  '30231310': ['energy_label_products'], // Flat panel displays
  '30231320': ['energy_label_products'], // Touch screen monitors
  '32324000': ['energy_label_products'], // Televisions
  '32324100': ['energy_label_products'], // Colour televisions
  '32324200': ['energy_label_products'], // Colour-television cameras
  '32324300': ['energy_label_products'], // Television apparatus
  '32324310': ['energy_label_products'], // Television sets
  '32324400': ['energy_label_products'], // Television antennas
  '32324500': ['energy_label_products'], // Video tuners
  '32324600': ['energy_label_products'], // Digital television boxes
  '39715000': ['energy_label_products'], // Water heaters
  '39715100': ['energy_label_products'], // Electric water heaters
  '39715200': ['energy_label_products'], // Water heating equipment
  '39715210': ['energy_label_products'], // Water heating equipment, electric
  '39715220': ['energy_label_products'], // Water heating equipment, gas
  '39715230': ['energy_label_products'], // Water heating equipment, solar
  '39715240': ['energy_label_products'], // Water heating equipment, solid fuel
  '39721000': ['energy_label_products'], // Domestic cooking or heating equipment
  '39721100': ['energy_label_products'], // Domestic ovens
  '39721200': ['energy_label_products'], // Cookers
  '39221000': ['energy_label_products'], // Kitchen equipment
  '39221100': ['energy_label_products'], // Kitchenware
  '39221110': ['energy_label_products'], // Tableware
  '39221120': ['energy_label_products'], // Cups and glasses
  '39221121': ['energy_label_products'], // Cups
  '39221122': ['energy_label_products'], // Glasses
  '39221123': ['energy_label_products'], // Mugs
  
  // Services CPV codes that may involve purchasing new products
  // Cleaning services
  '90900000': ['services_new_products'], // Cleaning and sanitation services
  '90910000': ['services_new_products'], // Cleaning services
  '90911000': ['services_new_products'], // Accommodation, building and window cleaning services
  '90911200': ['services_new_products'], // Building-cleaning services
  '90911300': ['services_new_products'], // Window-cleaning services
  '90912000': ['services_new_products'], // Reservoir cleaning services
  '90913000': ['services_new_products'], // Tank and reservoir cleaning services
  '90914000': ['services_new_products'], // Car park cleaning services
  '90915000': ['services_new_products'], // Furnace and chimney cleaning services
  '90916000': ['services_new_products'], // Telephone sanitation services
  '90917000': ['services_new_products'], // Transport vehicle cleaning services
  '90918000': ['services_new_products'], // Bin-cleaning services
  '90919000': ['services_new_products'], // Office, school and office equipment cleaning services
  '90919200': ['services_new_products'], // Office-cleaning services
  '90919300': ['services_new_products'], // School-cleaning services
  
  // Maintenance and repair services
  '50000000': ['services_new_products'], // Repair and maintenance services
  '50100000': ['services_new_products'], // Repair, maintenance and associated services of vehicles and related equipment
  '50300000': ['services_new_products'], // Repair, maintenance and associated services related to personal computers
  '50310000': ['services_new_products'], // Maintenance and repair of office machinery
  '50320000': ['services_new_products'], // Repair and maintenance services of personal computers
  '50330000': ['services_new_products'], // Maintenance services of telecommunications equipment
  '50340000': ['services_new_products'], // Repair and maintenance services of audiovisual and optical equipment
  '50400000': ['services_new_products'], // Repair and maintenance services of medical and precision equipment
  '50500000': ['services_new_products'], // Repair and maintenance services for pumps, valves, taps and metal containers
  '50700000': ['services_new_products'], // Repair and maintenance services of building installations
  '50710000': ['services_new_products'], // Repair and maintenance services of electrical and mechanical building installations
  '50711000': ['services_new_products'], // Repair and maintenance services of electrical building installations
  '50712000': ['services_new_products'], // Repair and maintenance services of mechanical building installations
  '50720000': ['services_new_products'], // Repair and maintenance services of central heating
  '50730000': ['services_new_products'], // Repair and maintenance services of cooler groups
  '50740000': ['services_new_products'], // Repair and maintenance services of escalators
  '50750000': ['services_new_products'], // Lift-maintenance services
  '50760000': ['services_new_products'], // Repair and maintenance services of public toilet equipment
  '50800000': ['services_new_products'], // Miscellaneous repair and maintenance services
  
  // Facility management services
  '70330000': ['services_new_products'], // Property management services on a fee or contract basis
  '70331000': ['services_new_products'], // Housing management services
  '70331100': ['services_new_products'], // Estate management services
  '70332000': ['services_new_products'], // Maintenance services of real estate on a fee or contract basis
  '70332100': ['services_new_products'], // Management services of mechanical equipment
  '70332200': ['services_new_products'], // Management services of electrical equipment
  '70332300': ['services_new_products'], // Management services of plumbing equipment
  
  // Catering services
  '55300000': ['services_new_products'], // Restaurant and food-serving services
  '55310000': ['services_new_products'], // Restaurant waiter services
  '55311000': ['services_new_products'], // Restricted restaurant waiter services
  '55312000': ['services_new_products'], // Unrestricted restaurant waiter services
  '55320000': ['services_new_products'], // Meal-serving services
  '55321000': ['services_new_products'], // Meal-preparation services
  '55322000': ['services_new_products'], // Meal-cooking services
  '55330000': ['services_new_products'], // Cafeteria services
  '55400000': ['services_new_products'], // Beverage serving services
  '55410000': ['services_new_products'], // Bar management services
  '55500000': ['services_new_products'], // Canteen and catering services
  '55510000': ['services_new_products'], // Canteen services
  '55511000': ['services_new_products'], // Canteen and other restricted cafeteria services
  '55512000': ['services_new_products'], // Canteen management services
  '55520000': ['services_new_products'], // Catering services
  '55521000': ['services_new_products'], // Catering services for private households
  '55521100': ['services_new_products'], // Meals-on-wheels services
  '55521200': ['services_new_products'], // Meal delivery service
  '55522000': ['services_new_products'], // Catering services for transport enterprises
  '55523000': ['services_new_products'], // Catering services for other enterprises or other institutions
  '55523100': ['services_new_products'], // School-meal services
  '55524000': ['services_new_products'], // School catering services
  
  // Add more CPV to obligation mappings as needed
};

// Helper function to get obligations by CPV code
export function getObligationsByCpv(cpvCode: string): Obligation[] {
  // First try exact match
  const obligationIds = cpvToObligationMap[cpvCode];
  
  if (obligationIds) {
    return obligationIds.map(id => obligations[id]).filter(Boolean);
  }
  
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
      return parentObligationIds.map(id => obligations[id]).filter(Boolean);
    }
  }
  
  // No obligations found for this CPV code
  return [];
}

// Helper function to get a specific obligation by ID
export function getObligationById(obligationId: string): Obligation | null {
  return obligations[obligationId] || null;
}