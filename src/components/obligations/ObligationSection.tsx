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
import { TabbedExamplesCard } from './TabbedExamplesCard';
import { GunningscriteriaTabs } from './GunningscriteriaTabs';
import { ContractualConditionsTabs } from './ContractualConditionsTabs';
import { SummaryWithToggleLinks } from './SummaryWithToggleLinks';

interface ObligationSectionProps {
  section: SectionType;
  defaultOpen?: boolean;
  showGppBadge?: boolean;
}

export const ObligationSection: React.FC<ObligationSectionProps> = ({ 
  section, 
  defaultOpen = false,
  showGppBadge = false
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
                {showGppBadge && section.key === 'scope' && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5"
                    style={{ backgroundColor: '#DCFCE7', color: '#166534', borderColor: '#DCFCE7' }}
                  >
                    GPP
                  </Badge>
                )}
                {section.key === 'scope' && (
                  <Badge
                    variant="outline"
                    className={`text-xs px-2 py-0.5 ${getLevelColor(section.requirement_level)}`}
                  >
                    {section.requirement_level}
                  </Badge>
                )}
                {section.key === 'technical_specs' && (
                  <Badge
                    variant="outline"
                    className={`text-xs px-2 py-0.5 ${getLevelColor(section.requirement_level)}`}
                  >
                    {section.requirement_level}
                  </Badge>
                )}
                {section.key === 'gunningscriteria' && (
                  <>
                    {showGppBadge && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5"
                        style={{ backgroundColor: '#DCFCE7', color: '#166534', borderColor: '#DCFCE7' }}
                      >
                        GPP
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 ${getLevelColor(section.requirement_level)}`}
                    >
                      {section.requirement_level}
                    </Badge>
                  </>
                )}
                {section.key === 'execution_conditions' && (
                  <>
                    {showGppBadge && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5"
                        style={{ backgroundColor: '#DCFCE7', color: '#166534', borderColor: '#DCFCE7' }}
                      >
                        GPP
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 ${getLevelColor(section.requirement_level)}`}
                    >
                      {section.requirement_level}
                    </Badge>
                  </>
                )}
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-6 border-t border-gray-100 pt-4">
            {(() => {
              // Default order if not specified
              const defaultOrder = ['intro', 'warnings', 'steps', 'example_texts', 'tabbed_examples', 'specs', 'gunningscriteria_tabs', 'contractual_conditions', 'contractual_conditions_tabs'];
              const order = section.content_order || defaultOrder;

              const contentBlocks: Record<string, React.ReactNode> = {
                intro: section.intro && (
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    <SummaryWithToggleLinks text={section.intro} />
                  </div>
                ),
                warnings: section.warnings && <WarningAlert warnings={section.warnings} />,
                steps: section.steps && (
                  <StepsList
                    steps={section.steps}
                    ordered={section.steps_ordered !== false}
                  />
                ),
                example_texts: section.example_texts && (
                  <ExampleTextCard examples={section.example_texts} />
                ),
                tabbed_examples: section.tabbed_examples && (
                  <TabbedExamplesCard examples={section.tabbed_examples} />
                ),
                specs: section.specs && (
                  <TechnicalSpecificationsTabs
                    specifications={section.specs}
                    title="Technische specificaties"
                  />
                ),
                gunningscriteria_tabs: section.gunningscriteria_tabs && (
                  <GunningscriteriaTabs
                    criteria={section.gunningscriteria_tabs}
                    title="Gunningscriteria"
                  />
                ),
                contractual_conditions: section.contractual_conditions && (
                  <SpecificationTable
                    conditions={section.contractual_conditions}
                    title="Contractuele voorwaarden"
                    collapsible={true}
                  />
                ),
                contractual_conditions_tabs: section.contractual_conditions_tabs && (
                  <ContractualConditionsTabs
                    conditions={section.contractual_conditions_tabs}
                    title="Contractuele uitvoeringsvoorwaarden"
                  />
                ),
              };

              return order.map((blockType, index) => (
                <React.Fragment key={`${blockType}-${index}`}>
                  {contentBlocks[blockType]}
                </React.Fragment>
              ));
            })()}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};