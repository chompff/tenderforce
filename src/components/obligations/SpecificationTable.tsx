import React from 'react';
import { MandatorySpec, ContractualCondition } from '@/types/obligations';
import { FileCheck, ClipboardCheck } from 'lucide-react';

interface SpecificationTableProps {
  specifications?: MandatorySpec[];
  conditions?: ContractualCondition[];
  title: string;
}

export const SpecificationTable: React.FC<SpecificationTableProps> = ({ 
  specifications, 
  conditions, 
  title 
}) => {
  const items = specifications || conditions || [];
  
  if (items.length === 0) return null;

  const Icon = specifications ? FileCheck : ClipboardCheck;

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
              <th className="text-left p-3 text-xs font-semibold text-gray-700 w-20">Code</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-700">Omschrijving</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-700 w-1/3">Juridische basis</th>
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