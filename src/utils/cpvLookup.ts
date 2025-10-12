import cpvData from '../data/cpvData.json';

interface CpvItem {
  'CPV CODE': string;
  'Omschrijving': string;
}

export const getCpvName = async (code: string): Promise<string> => {
  try {
    const foundItem = (cpvData as CpvItem[]).find((item) => item['CPV CODE'] === code);
    return foundItem ? foundItem['Omschrijving'] : 'Onbekende categorie';
  } catch (error) {
    console.error('Error fetching CPV name:', error);
    return 'Onbekende categorie';
  }
};
