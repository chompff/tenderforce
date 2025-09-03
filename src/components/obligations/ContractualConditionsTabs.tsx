import React, { useState, useEffect } from 'react';
import { ContractualConditionTabs } from '@/types/obligations';
import { FileCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ContractualConditionsTabsProps {
  conditions: ContractualConditionTabs;
  title?: string;
}

const tabConfig = [
  { 
    key: 'arbeidsomstandigheden', 
    label: 'Arbeidsomstandigheden', 
    color: 'bg-blue-500',
    tipBg: 'bg-blue-50',
    tipColor: 'text-blue-700',
    tip: 'Vergemakkelijkt toetsing via erkende labels en borgt minimale prestaties.'
  },
  { 
    key: 'sociale_normen', 
    label: 'Sociale normen', 
    color: 'bg-purple-500',
    tipBg: 'bg-purple-50',
    tipColor: 'text-purple-700',
    tip: 'Helpt sociale misstanden in productieketens te vermijden.'
  },
  { 
    key: 'milieunormen', 
    label: 'Milieunormen', 
    color: 'bg-green-500',
    tipBg: 'bg-green-50',
    tipColor: 'text-green-700',
    tip: 'Vermindert milieu-impact door emissiebeperking en afvalscheiding.'
  }
];

export const ContractualConditionsTabs: React.FC<ContractualConditionsTabsProps> = ({ 
  conditions, 
  title = 'Contractuele voorwaarden' 
}) => {
  const [activeTab, setActiveTab] = useState('');

  if (!conditions) return null;

  const availableTabs = tabConfig.filter(tab => conditions[tab.key] && conditions[tab.key].length > 0);
  
  if (availableTabs.length === 0) return null;

  // Set the active tab after we know we have tabs
  useEffect(() => {
    if (availableTabs.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0].key);
    }
  }, [availableTabs, activeTab]);

  const renderConditionsTable = (items: Array<{
    code?: string;
    text: string;
    legal_basis: string;
  }>) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-3 text-xs font-semibold text-gray-700 w-20">
              Code
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-700">
              Voorwaarde
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-700 w-1/3">
              Juridische basis
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 text-sm font-mono text-gray-600">
                {item.code || '-'}
              </td>
              <td className="p-3 text-sm text-gray-700 whitespace-pre-line">{item.text}</td>
              <td className="p-3 text-sm text-gray-600 italic">{item.legal_basis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        <FileCheck className="h-4 w-4" />
        {title}
      </h4>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-row gap-1 w-full h-auto p-1 justify-start">
          {availableTabs.map((tab) => (
            <TabsTrigger 
              key={tab.key} 
              value={tab.key}
              className="flex items-center gap-2 px-3 py-2"
            >
              <div className={`w-2 h-2 rounded-full ${tab.color}`} />
              <span className="text-sm">{tab.label}</span>
              <span className="text-xs text-gray-500 ml-1">
                ({conditions[tab.key].length})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {availableTabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-4">
            {renderConditionsTable(conditions[tab.key])}
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