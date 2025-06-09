export const getCpvName = async (code: string): Promise<string> => {
  try {
    const res = await fetch('https://raw.githubusercontent.com/chompff/CPV-Data/refs/heads/main/cpvData.json');
    
    if (!res.ok) {
      console.error('Failed to fetch CPV data:', res.status, res.statusText);
      return 'Onbekende categorie';
    }
    
    const cpvDataArray = await res.json();
    const foundItem = cpvDataArray.find((item: any) => item['CPV CODE'] === code);
    
    return foundItem ? foundItem['Omschrijving'] : 'Onbekende categorie';
  } catch (error) {
    console.error('Error fetching CPV name:', error);
    return 'Onbekende categorie';
  }
};
