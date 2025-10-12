import { Obligation } from '@/types/obligations';
import tyresData from './tyres.json';
import furnitureData from './furniture.json';
import ecodesignData from './ecodesign.json';
import energyLabelData from './energy-label.json';
import servicesData from './services.json';
import algemeneEedData from './algemene-eed.json';
import gppFurnitureData from './gpp-furniture.json';
import gppTextilesData from './gpp-textiles.json';
import gppRoadTransportData from './gpp-road-transport.json';
import gppRoadLightingData from './gpp-road-lighting.json';
import gppRoadDesignData from './gpp-road-design.json';
import gppPublicSpaceData from './gpp-public-space.json';
import gppPaintsData from './gpp-paints.json';
import gppOfficeBuildingsData from './gpp-office-buildings.json';
import gppImagingEquipmentData from './gpp-imaging-equipment.json';
import gppFoodCateringData from './gpp-food-catering.json';
import gppElectricityData from './gpp-electricity.json';
import gppDataCentresData from './gpp-data-centres.json';
import gppComputersData from './gpp-computers.json';
import gppCleaningData from './gpp-cleaning.json';
import standardObligationsData from './standard-obligations.json';
import buildingsData from './buildings.json';
import cpvMappingsData from '../cpv-mapping-from-csv.json';

// Type-safe obligation imports
const tyres: Obligation = tyresData as Obligation;
const furniture: Obligation = furnitureData as Obligation;
const ecodesign: Obligation = ecodesignData as Obligation;
const energyLabel: Obligation = energyLabelData as Obligation;
const services: Obligation = servicesData as Obligation;
const algemeneEed: Obligation = algemeneEedData as Obligation;
const gppFurniture: Obligation = gppFurnitureData as Obligation;
const gppTextiles: Obligation = gppTextilesData as Obligation;
const gppRoadTransport: Obligation = gppRoadTransportData as Obligation;
const gppRoadLighting: Obligation = gppRoadLightingData as Obligation;
const gppRoadDesign: Obligation = gppRoadDesignData as Obligation;
const gppPublicSpace: Obligation = gppPublicSpaceData as Obligation;
const gppPaints: Obligation = gppPaintsData as Obligation;
const gppOfficeBuildings: Obligation = gppOfficeBuildingsData as Obligation;
const gppImagingEquipment: Obligation = gppImagingEquipmentData as Obligation;
const gppFoodCatering: Obligation = gppFoodCateringData as Obligation;
const gppElectricity: Obligation = gppElectricityData as Obligation;
const gppDataCentres: Obligation = gppDataCentresData as Obligation;
const gppComputers: Obligation = gppComputersData as Obligation;
const gppCleaning: Obligation = gppCleaningData as Obligation;
const standardObligations: Obligation = standardObligationsData as Obligation;
const buildings: Obligation = buildingsData as Obligation;

// Map of obligation IDs to obligation data
export const obligations: Record<string, Obligation> = {
  tyres,
  furniture,
  ecodesign_products: ecodesign,
  energy_label: energyLabel, // Changed from energy_label_products to match CSV mapping
  services_new_products: services,
  algemene_eed: algemeneEed,
  'gpp-furniture': gppFurniture,
  'gpp-textiles': gppTextiles,
  'gpp-road-transport': gppRoadTransport,
  'gpp-road-lighting': gppRoadLighting,
  'gpp-road-design': gppRoadDesign,
  'gpp-public-space': gppPublicSpace,
  'gpp-paints': gppPaints,
  'gpp-office-buildings': gppOfficeBuildings,
  'gpp-imaging-equipment': gppImagingEquipment,
  'gpp-food-catering': gppFoodCatering,
  'gpp-electricity': gppElectricity,
  'gpp-data-centres': gppDataCentres,
  'gpp-computers': gppComputers,
  'gpp-cleaning': gppCleaning,
  standard_obligations: standardObligations,
  buildings: buildings,
};

// All CPV mappings are now stored in cpv-mapping-from-csv.json
// This includes both CSV-sourced mappings (GPP) and manual mappings (tyres, ecodesign, etc.)
// The JSON file is the single source of truth for all CPV → module mappings
export const cpvToObligationMap: Record<string, string[]> = cpvMappingsData as Record<string, string[]>;

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

  // If no specific obligations found, add algemene_eed (General EED obligations)
  // This ensures all CPV codes have at least the general EED requirements
  if (result.length === 0 && obligations.algemene_eed) {
    result.push(obligations.algemene_eed);
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