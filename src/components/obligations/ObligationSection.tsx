import React, { useState } from 'react';
import { ObligationSection as SectionType } from '@/types/obligations';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { WarningAlert } from './WarningAlert';
import { StepsList } from './StepsList';
import { ExampleTextCard } from './ExampleTextCard';
import { SpecificationTable } from './SpecificationTable';
import { TechnicalSpecificationsTabs } from './TechnicalSpecificationsTabs';

interface ObligationSectionProps {
  section: SectionType;
  defaultOpen?: boolean;
}

export const ObligationSection: React.FC<ObligationSectionProps> = ({ 
  section, 
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'verplicht':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'aanbevolen':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <CollapsibleTrigger className="w-full">
          <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                {section.title}
              </h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-0.5 ${getLevelColor(section.requirement_level)}`}
                >
                  {section.requirement_level}
                </Badge>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            {!isOpen && section.intro && (
              <p className="text-sm text-gray-600 mt-2 text-left line-clamp-2 whitespace-pre-line">
                {section.intro}
              </p>
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-6 border-t border-gray-100 pt-4">
            {/* Introduction */}
            {section.intro && (
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {section.intro}
              </div>
            )}

            {/* Warnings */}
            {section.warnings && <WarningAlert warnings={section.warnings} />}

            {/* Steps */}
            {section.steps && (
              <StepsList steps={section.steps} title="Neem de volgende stappen:" />
            )}

            {/* Example Texts */}
            {section.example_texts && (
              <ExampleTextCard 
                examples={section.example_texts} 
              />
            )}

            {/* Technical Specifications */}
            {section.specs && (
              <TechnicalSpecificationsTabs
                specifications={section.specs}
                title="Technische specificaties"
              />
            )}

            {/* Contractual Conditions */}
            {section.contractual_conditions && (
              <SpecificationTable
                conditions={section.contractual_conditions}
                title="Contractuele voorwaarden"
              />
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};