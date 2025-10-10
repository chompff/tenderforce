import React, { useState } from 'react';
import { ObligationSection as SectionType, LegalReference } from '@/types/obligations';
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
import { GppCriteriaTabs } from './GppCriteriaTabs';

interface ObligationSectionProps {
  section: SectionType;
  defaultOpen?: boolean;
  showGppBadge?: boolean;
  legalReferences?: LegalReference[];
}

export const ObligationSection: React.FC<ObligationSectionProps> = ({
  section,
  defaultOpen = false,
  showGppBadge = false,
  legalReferences = []
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'verplicht':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'optioneel':
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
                    className={`text-xs px-2 py-0.5 uppercase ${getLevelColor(section.requirement_level)}`}
                  >
                    {section.requirement_level}
                  </Badge>
                )}
                {section.key === 'technical_specs' && (
                  <>
                    {section.badges?.map((badge) => {
                      if (badge === 'ENERGIELABEL') {
                        return (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="text-xs px-2 py-0.5 uppercase"
                            style={{ backgroundColor: '#D1FAE5', color: '#065F46', borderColor: '#D1FAE5' }}
                          >
                            {badge}
                          </Badge>
                        );
                      } else if (badge === 'ECODESIGN') {
                        return (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="text-xs px-2 py-0.5 uppercase"
                            style={{ backgroundColor: '#f3e4ee', color: '#7d2352', borderColor: '#f3e4ee' }}
                          >
                            {badge}
                          </Badge>
                        );
                      } else if (badge === 'BANDEN') {
                        return (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="text-xs px-2 py-0.5 uppercase"
                            style={{ backgroundColor: '#6C6C6C', color: '#FFFFFF', borderColor: '#6C6C6C' }}
                          >
                            {badge}
                          </Badge>
                        );
                      } else if (badge === 'GEBOUWEN') {
                        return (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="text-xs px-2 py-0.5 uppercase"
                            style={{ backgroundColor: '#F4EDE6', color: '#5C4033', borderColor: '#F4EDE6' }}
                          >
                            {badge}
                          </Badge>
                        );
                      } else if (badge === 'ALGEMEEN') {
                        return (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="text-xs px-2 py-0.5 uppercase"
                            style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FEF3C7' }}
                          >
                            {badge}
                          </Badge>
                        );
                      }
                      return null;
                    })}
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 uppercase ${getLevelColor(section.requirement_level)}`}
                    >
                      {section.requirement_level}
                    </Badge>
                  </>
                )}
                {section.key === 'gunningscriteria' && (
                  <>
                    {showGppBadge && (
                      <>
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                          style={{ backgroundColor: '#D4F1F4', color: '#0B5563', borderColor: '#D4F1F4' }}
                        >
                          MVI
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                          style={{ backgroundColor: '#DCFCE7', color: '#166534', borderColor: '#DCFCE7' }}
                        >
                          GPP
                        </Badge>
                      </>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 uppercase ${getLevelColor(section.requirement_level)}`}
                    >
                      {section.requirement_level}
                    </Badge>
                  </>
                )}
                {section.key === 'execution_conditions' && (
                  <>
                    {section.badges?.map((badge) => {
                      if (badge === 'ENERGIELABEL') {
                        return (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="text-xs px-2 py-0.5 uppercase"
                            style={{ backgroundColor: '#D1FAE5', color: '#065F46', borderColor: '#D1FAE5' }}
                          >
                            {badge}
                          </Badge>
                        );
                      } else if (badge === 'ECODESIGN') {
                        return (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="text-xs px-2 py-0.5 uppercase"
                            style={{ backgroundColor: '#f3e4ee', color: '#7d2352', borderColor: '#f3e4ee' }}
                          >
                            {badge}
                          </Badge>
                        );
                      } else if (badge === 'BANDEN') {
                        return (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="text-xs px-2 py-0.5 uppercase"
                            style={{ backgroundColor: '#6C6C6C', color: '#FFFFFF', borderColor: '#6C6C6C' }}
                          >
                            {badge}
                          </Badge>
                        );
                      } else if (badge === 'DIENSTEN') {
                        return (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="text-xs px-2 py-0.5 uppercase"
                            style={{ backgroundColor: '#E5FAFD', color: '#008A9E', borderColor: '#E5FAFD' }}
                          >
                            {badge}
                          </Badge>
                        );
                      } else if (badge === 'GEBOUWEN') {
                        return (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="text-xs px-2 py-0.5 uppercase"
                            style={{ backgroundColor: '#F4EDE6', color: '#5C4033', borderColor: '#F4EDE6' }}
                          >
                            {badge}
                          </Badge>
                        );
                      } else if (badge === 'ALGEMEEN') {
                        return (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="text-xs px-2 py-0.5 uppercase"
                            style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FEF3C7' }}
                          >
                            {badge}
                          </Badge>
                        );
                      }
                      return null;
                    })}
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
                      className={`text-xs px-2 py-0.5 uppercase ${getLevelColor(section.requirement_level)}`}
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
              const defaultOrder = ['intro', 'warnings', 'steps', 'example_texts', 'additional_warnings', 'tabbed_examples', 'gpp_specs', 'gpp_criteria_tabs', 'specs', 'gunningscriteria_tabs', 'contractual_conditions', 'contractual_conditions_tabs'];
              const order = section.content_order || defaultOrder;

              const contentBlocks: Record<string, React.ReactNode> = {
                intro: section.intro && (
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    <SummaryWithToggleLinks text={section.intro} />
                  </div>
                ),
                warnings: section.warnings && <WarningAlert warnings={section.warnings} />,
                additional_warnings: section.additional_warnings && <WarningAlert warnings={section.additional_warnings} />,
                steps: section.steps && (
                  <StepsList
                    steps={section.steps}
                    title={section.steps_title}
                    ordered={section.steps_ordered !== false}
                    legalReferences={legalReferences}
                  />
                ),
                example_texts: section.example_texts && (
                  <ExampleTextCard
                    examples={section.example_texts}
                    defaultExpanded={section.key === 'technical_specs'}
                  />
                ),
                tabbed_examples: section.tabbed_examples && (
                  <TabbedExamplesCard examples={section.tabbed_examples} />
                ),
                gpp_specs: section.gpp_specs && (
                  <GppCriteriaTabs
                    data={section.gpp_specs.data}
                    mainTabs={section.gpp_specs.main_tabs}
                    defaultMainTab={section.gpp_specs.default_main_tab}
                    codeColumnHeader="TS-CODE"
                    specColumnHeader="SPECIFICATIE"
                  />
                ),
                gpp_criteria_tabs: section.gpp_criteria_tabs && (
                  <GppCriteriaTabs
                    data={section.gpp_criteria_tabs.data}
                    mainTabs={section.gpp_criteria_tabs.main_tabs}
                    defaultMainTab={section.gpp_criteria_tabs.default_main_tab}
                    codeColumnHeader={section.gpp_criteria_tabs.code_column_header || 'CODE'}
                    specColumnHeader={section.gpp_criteria_tabs.spec_column_header || 'SPECIFICATIE'}
                  />
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
                    collapsible={section.key !== 'execution_conditions'}
                  />
                ),
                contractual_conditions_tabs: section.contractual_conditions_tabs && (
                  <ContractualConditionsTabs
                    conditions={section.contractual_conditions_tabs}
                    title="Contractuele uitvoeringsvoorwaarden"
                  />
                ),
                product_links: section.product_links && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {section.product_links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url || '#'}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        target={link.url ? '_blank' : undefined}
                        rel={link.url ? 'noopener noreferrer' : undefined}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ),
                additional_steps: section.additional_steps && (
                  <StepsList
                    steps={section.additional_steps}
                    ordered={section.steps_ordered !== false}
                    startNumber={(section.steps?.length || 0) + 1}
                    legalReferences={legalReferences}
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