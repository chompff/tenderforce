import React from 'react';
import { LegalReference } from '@/types/obligations';
import { ExternalLink, Scale } from 'lucide-react';

interface LegalReferencesProps {
  references: LegalReference[];
}

export const LegalReferences: React.FC<LegalReferencesProps> = ({ references }) => {
  if (!references || references.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <Scale className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm font-semibold text-blue-900">Juridische bronnen</h3>
      </div>
      <div className="space-y-2">
        {references.map((ref, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <div className="flex-1">
              <span className="font-medium text-sm text-blue-900">{ref.label}</span>
              {ref.citation && (
                <span className="text-sm text-gray-600"> - {ref.citation}</span>
              )}
              {ref.url && (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 ml-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Bekijk</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};