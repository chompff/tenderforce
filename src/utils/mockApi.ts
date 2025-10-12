export interface Suggestion {
  code: string;
  description: string;
  type_aanbesteding?: string;
}

interface CpvDataItem {
  'CPV CODE': string;
  'Omschrijving': string;
  'type_aanbesteding'?: string;
}

export const fetchSuggestions = async (query: string): Promise<{ suggestions: Suggestion[] }> => {
  console.log('🔍 fetchSuggestions called with query:', query);
  
  try {
    console.log('📡 Fetching data from GitHub...');
    const res = await fetch('https://raw.githubusercontent.com/chompff/CPV-Data/refs/heads/main/cpvData.json');
    
    if (!res.ok) {
      console.error('❌ Failed to fetch CPV data:', res.status, res.statusText);
      throw new Error('Failed to fetch data');
    }
    
    console.log('✅ Data fetched successfully, parsing JSON...');
    const cpvDataArray = await res.json();
    console.log('📊 Data parsed, total items:', cpvDataArray.length);
    
    if (cpvDataArray.length > 0) {
      console.log('🔍 First item sample:', cpvDataArray[0]);
      console.log('🔍 Available fields:', Object.keys(cpvDataArray[0]));
    }
    
    // Filter the data based on the query
    const filtered = (cpvDataArray as CpvDataItem[]).filter((item) => {
      // Use the correct field names from the actual dataset
      const code = item['CPV CODE'];
      const description = item['Omschrijving'];

      if (!description || !code) {
        // Only log a few examples to avoid spam
        if (Math.random() < 0.01) {
          console.log('⚠️ Skipping invalid item (sample):', item);
        }
        return false;
      }

      const queryLower = query.toLowerCase();
      const descriptionMatch = description.toLowerCase().includes(queryLower);
      const codeMatch = code.toLowerCase().includes(queryLower);

      return descriptionMatch || codeMatch;
    }).map((item) => ({
      code: item['CPV CODE'],
      description: item['Omschrijving'],
      type_aanbesteding: item['type_aanbesteding']
    })).slice(0, 50); // Limit to 50 results for performance
    
    console.log(`✨ Found ${filtered.length} matches for query: "${query}"`);
    if (filtered.length > 0) {
      console.log('🎯 First few results:', filtered.slice(0, 3));
    }
    
    return { suggestions: filtered };
  } catch (error) {
    console.error('💥 Error in fetchSuggestions:', error);
    return { suggestions: [] };
  }
};
