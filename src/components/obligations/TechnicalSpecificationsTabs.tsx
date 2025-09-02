import React, { useState } from 'react';
import { Spec } from '@/types/obligations';
import { FileCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface TechnicalSpecificationsTabsProps {
  specifications: Spec[];
  title: string;
}

type RequirementLevel = 'verplicht' | 'voorwaardelijk_verplicht' | 'aanbevolen' | 'optioneel';

const requirementLevels: { 
  key: RequirementLevel; 
  label: string; 
  ledColor: string;
} [] = [
  { key: 'verplicht', label: 'Verplicht', ledColor: 'bg-red-500' },
  { key: 'voorwaardelijk_verplicht', label: 'Voorwaardelijk verplicht', ledColor: 'bg-amber-500' },
  { key: 'aanbevolen', label: 'Aanbevolen', ledColor: 'bg-blue-500' },
  { key: 'optioneel', label: 'Optioneel', ledColor: 'bg-green-500' }
];

export const TechnicalSpecificationsTabs: React.FC<TechnicalSpecificationsTabsProps> = ({ 
  specifications, 
  title 
}) => {
  if (!specifications || specifications.length === 0) return null;

  // Group specifications by requirement level
  const groupedSpecs = specifications.reduce((acc, spec) => {
    const level = spec.requirement_level || 'verplicht';
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(spec);
    return acc;
  }, {} as Record<RequirementLevel, Spec[]>);

  // Get available levels that have specifications
  const availableLevels = requirementLevels.filter(level => groupedSpecs[level.key]);

  if (availableLevels.length === 0) return null;

  // Default to first available level
  const [activeTab, setActiveTab] = useState(availableLevels[0].key);

  const renderTable = (specs: Spec[]) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-3 text-xs font-semibold text-gray-700 w-20">
              TS-code
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-700">
              Specificatie
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-700 w-1/3">
              Bronvermelding
            </th>
          </tr>
        </thead>
        <tbody>
          {specs.map((spec, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 text-sm font-mono text-gray-600">
                {spec.code || '-'}
              </td>
              <td className="p-3 text-sm text-gray-700">{spec.text}</td>
              <td className="p-3 text-sm text-gray-600 italic">{spec.legal_basis}</td>
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
          {availableLevels.map((level) => (
            <TabsTrigger 
              key={level.key} 
              value={level.key}
              className="flex items-center gap-2 px-3 py-2"
            >
              <div className={`w-2 h-2 rounded-full ${level.ledColor}`} />
              <span className="text-sm">{level.label}</span>
              <span className="text-xs text-gray-500 ml-1">
                ({groupedSpecs[level.key].length})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {availableLevels.map((level) => (
          <TabsContent key={level.key} value={level.key} className="mt-4">
            {renderTable(groupedSpecs[level.key])}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};