import cpvData from '../data/cpvData.json';

export const getCpvName = async (code: string): Promise<string> => {
  try {
    const foundItem = cpvData.find((item: any) => item['CPV CODE'] === code);
    return foundItem ? foundItem['Omschrijving'] : 'Onbekende categorie';
  } catch (error) {
    console.error('Error fetching CPV name:', error);
    return 'Onbekende categorie';
  }
};
