import React, { useState, useEffect } from 'react';
import { GunningscriteriaTabs as GunningscriteriaTabsType } from '@/types/obligations';
import { Award } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface GunningscriteriaTabsProps {
  criteria: GunningscriteriaTabsType;
  title?: string;
}

const tabConfig = [
  { 
    key: 'circulariteit', 
    label: 'Circulariteit', 
    color: 'bg-green-500',
    tipBg: 'bg-green-50',
    tipColor: 'text-green-700',
    tip: 'Stimuleert hergebruik en verlenging van de levensduur, in lijn met Rijksbeleid Circulaire Economie.'
  },
  { 
    key: 'milieu_impact', 
    label: 'Milieu-impact', 
    color: 'bg-blue-500',
    tipBg: 'bg-blue-50',
    tipColor: 'text-blue-700',
    tip: 'Richt zich op reductie van milieubelasting. Vereist bewijs via EPD\'s, LCA\'s of certificaten.'
  },
  { 
    key: 'sociaal', 
    label: 'Sociaal', 
    color: 'bg-purple-500',
    tipBg: 'bg-purple-50',
    tipColor: 'text-purple-700',
    tip: 'Ondersteunt eerlijk werk, veilige productieomstandigheden en inclusieve arbeid.'
  },
  { 
    key: 'kwaliteit_levensduur', 
    label: 'Kwaliteit & levensduur', 
    color: 'bg-orange-500',
    tipBg: 'bg-orange-50',
    tipColor: 'text-orange-700',
    tip: 'Verlengt de gebruiksperiode en voorkomt vervanging. Toetsing is relatief eenvoudig.'
  },
  { 
    key: 'certificering_labels', 
    label: 'Certificering & labels', 
    color: 'bg-teal-500',
    tipBg: 'bg-teal-50',
    tipColor: 'text-teal-700',
    tip: 'Vergemakkelijkt toetsing via erkende labels en borgt minimale prestaties.'
  },
  { 
    key: 'logistiek_transport', 
    label: 'Logistiek & transport', 
    color: 'bg-gray-500',
    tipBg: 'bg-gray-50',
    tipColor: 'text-gray-700',
    tip: 'Draagt bij aan emissiereductie in de keten en circulaire retourstromen.'
  }
];

export const GunningscriteriaTabs: React.FC<GunningscriteriaTabsProps> = ({ 
  criteria, 
  title = 'Gunningscriteria' 
}) => {
  const [activeTab, setActiveTab] = useState('');

  const availableTabs = criteria ? tabConfig.filter(tab => criteria[tab.key] && criteria[tab.key].length > 0) : [];

  // Set the active tab after we know we have tabs
  useEffect(() => {
    if (availableTabs.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0].key);
    }
  }, [availableTabs, activeTab]);

  if (!criteria) return null;
  if (availableTabs.length === 0) return null;

  const renderCriteriaTable = (items: Array<{
    code?: string;
    title: string;
    description: string;
    points?: string[];
    legal_basis: string;
  }>) => {
    // Check if any item has a non-empty legal_basis
    const hasLegalBasis = items.some(item => item.legal_basis && item.legal_basis.trim() !== '');

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left p-3 text-xs font-semibold text-gray-700 w-20">
                GC-code
              </th>
              <th className="text-left p-3 text-xs font-semibold text-gray-700">
                Criterium
              </th>
              {hasLegalBasis && (
                <th className="text-left p-3 text-xs font-semibold text-gray-700 w-1/3">
                  Juridische basis
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3 text-sm font-mono text-gray-600 align-top">
                  {item.code || '-'}
                </td>
                <td className="p-3 text-sm text-gray-700">
                  <div className="space-y-2">
                    <div className="font-medium">{item.title}</div>
                    <div>{item.description}</div>
                    {item.points && item.points.length > 0 && (
                      <div className="mt-2 pl-4">
                        <p className="text-xs font-medium text-gray-600 mb-1">Punten worden toegekend op basis van:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {item.points.map((point: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600">{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </td>
                {hasLegalBasis && (
                  <td className="p-3 text-sm text-gray-600 italic align-top">{item.legal_basis}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        <Award className="h-4 w-4" />
        {title}
      </h4>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-row gap-1 w-full h-auto p-1 justify-start flex-wrap">
          {availableTabs.map((tab) => (
            <TabsTrigger 
              key={tab.key} 
              value={tab.key}
              className="flex items-center gap-2 px-3 py-2"
            >
              <div className={`w-2 h-2 rounded-full ${tab.color}`} />
              <span className="text-sm">{tab.label}</span>
              <span className="text-xs text-gray-500 ml-1">
                ({criteria[tab.key].length})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {availableTabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-4">
            {renderCriteriaTable(criteria[tab.key])}
            {tab.tip && (
              <div className={`mt-4 p-3 ${tab.tipBg} rounded-lg`}>
                <p className={`text-xs ${tab.tipColor}`}>
                  💡 Tip: {tab.tip}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};