import React, { useState } from 'react';
import { Spec, ContractualCondition } from '@/types/obligations';
import { FileCheck, ClipboardCheck, ChevronRight, ChevronDown, FileText } from 'lucide-react';

interface SpecificationTableProps {
  specifications?: Spec[];
  conditions?: ContractualCondition[];
  title: string;
  collapsible?: boolean;
}

export const SpecificationTable: React.FC<SpecificationTableProps> = ({
  specifications,
  conditions,
  title,
  collapsible = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const items = specifications || conditions || [];

  if (items.length === 0) return null;

  const Icon = specifications ? FileCheck : ClipboardCheck;

  if (collapsible) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <FileText className="h-4 w-4" />
          Toon voorbeeld
        </button>

        {isExpanded && (
          <div className="overflow-x-auto animate-fade-in">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-3 text-xs font-semibold text-gray-700 w-20">
                    {specifications ? 'TS-CODE' : 'CV-CODE'}
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-700">
                    {specifications ? 'SPECIFICATIE' : 'CONTRACTUELE VOORWAARDE'}
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-700 w-1/3">
                    BRONVERMELDING
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono text-gray-600">{item.code}</td>
                    <td className="p-3 text-sm text-gray-700">{item.text}</td>
                    <td className="p-3 text-sm text-gray-600 italic">{item.legal_basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left p-3 text-xs font-semibold text-gray-700 w-20">
                {specifications ? 'TS-CODE' : 'CV-CODE'}
              </th>
              <th className="text-left p-3 text-xs font-semibold text-gray-700">
                {specifications ? 'SPECIFICATIE' : 'CONTRACTUELE VOORWAARDE'}
              </th>
              <th className="text-left p-3 text-xs font-semibold text-gray-700 w-1/3">
                BRONVERMELDING
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3 text-sm font-mono text-gray-600">{item.code}</td>
                <td className="p-3 text-sm text-gray-700">{item.text}</td>
                <td className="p-3 text-sm text-gray-600 italic">{item.legal_basis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};