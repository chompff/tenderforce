import React, { useState } from 'react';
import { Obligation } from '@/types/obligations';
import { Badge } from '@/components/ui/badge';
import { SummaryWithToggleLinks } from './SummaryWithToggleLinks';
import { WarningAlert } from './WarningAlert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ObligationSection } from './ObligationSection';
import { LegalReferences } from './LegalReferences';

interface ObligationHeaderProps {
  obligation: Obligation;
  onToggleLegal?: () => void;
  isAuthenticated?: boolean;
}

// Helper function to determine border color based on obligation archetype/type
const getObligationBorderColor = (archetype: string, badges: string[]): string => {
  // Priority 1: Check archetype
  if (archetype.toLowerCase().includes('general') || archetype.toLowerCase().includes('standard')) {
    return '#9CA3AF'; // Grey for standard EED obligations (gray-400)
  }

  // Priority 2: Check for specific badge types (fallback if colors not configured)
  if (badges.includes('ENERGIELABEL')) {
    return '#065F46'; // Green for energy label
  }
  if (badges.includes('ECODESIGN')) {
    return '#7d2352'; // Purple for ecodesign
  }
  if (badges.includes('BANDEN')) {
    return '#6C6C6C'; // Gray for tires
  }
  if (badges.includes('GEBOUWEN')) {
    return '#5C4033'; // Brown for buildings
  }
  if (badges.includes('DIENSTEN')) {
    return '#008A9E'; // Teal for services
  }

  // Default: Blue
  return '#1E40AF';
};

export const ObligationHeader: React.FC<ObligationHeaderProps> = ({
  obligation,
  onToggleLegal,
  isAuthenticated = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLegalRefs, setShowLegalRefs] = useState(false);

  // Use colors from JSON if available, otherwise fall back to the helper function
  const borderColor = obligation.colors?.border || getObligationBorderColor(obligation.archetype, obligation.badges);
  const badgeTextColor = obligation.colors?.text;
  const badgeBackgroundColor = obligation.colors?.badge_background;

  // Helper function to get badge colors - uses configured colors if available, otherwise uses hardcoded defaults
  const getBadgeColors = (badge: string): { backgroundColor: string; color: string; borderColor: string } => {
    // If colors are configured in JSON, use them for all badges (except flags)
    if (badgeTextColor && badgeBackgroundColor && !['NL', 'EU'].includes(badge)) {
      return {
        backgroundColor: badgeBackgroundColor,
        color: badgeTextColor,
        borderColor: badgeBackgroundColor
      };
    }

    // Fallback to hardcoded colors if not configured
    switch (badge) {
      case 'ENERGIELABEL':
        return { backgroundColor: '#D1FAE5', color: '#065F46', borderColor: '#D1FAE5' };
      case 'ECODESIGN':
        return { backgroundColor: '#f3e4ee', color: '#7d2352', borderColor: '#f3e4ee' };
      case 'MVI':
        return { backgroundColor: '#4A9400', color: '#FFFFFF', borderColor: '#4A9400' };
      case 'GPP':
        return { backgroundColor: '#3E6B3A', color: '#FFFFFF', borderColor: '#3E6B3A' };
      case 'BANDEN':
        return { backgroundColor: '#6C6C6C', color: '#FFFFFF', borderColor: '#6C6C6C' };
      case 'DIENSTEN':
        return { backgroundColor: '#E5FAFD', color: '#008A9E', borderColor: '#E5FAFD' };
      case 'GEBOUWEN':
        return { backgroundColor: '#F4EDE6', color: '#5C4033', borderColor: '#F4EDE6' };
      case 'ALGEMEEN':
        return { backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FEF3C7' };
      default:
        return { backgroundColor: '#DBEAFE', color: '#1E40AF', borderColor: '#DBEAFE' };
    }
  };

  const toggleLegalReferences = () => {
    setShowLegalRefs(!showLegalRefs);
    if (onToggleLegal) {
      onToggleLegal();
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className="bg-gray-100 border border-gray-300 rounded-lg overflow-hidden"
        style={{ borderLeft: `8px solid ${borderColor}` }}
      >
        <CollapsibleTrigger className="w-full text-left">
          <div className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{obligation.title}</h2>
              <div className="flex gap-2 items-center flex-shrink-0">
                {obligation.badges.map((badge) => {
            if (badge === 'NL') {
              return (
                <img
                  key={badge}
                  src="/dutch-flag.png"
                  alt="Dutch Flag"
                  className="h-5 w-auto"
                />
              );
            } else if (badge === 'EU') {
              return (
                <img
                  key={badge}
                  src="/eu-flag.png"
                  alt="EU Flag"
                  className="h-5 w-auto"
                />
              );
            } else {
              const colors = getBadgeColors(badge);
              return (
                <Badge
                  key={badge}
                  variant="outline"
                  className="text-xs uppercase"
                  style={colors}
                >
                  {badge}
                </Badge>
              );
            }
          })}
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 ml-2" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
                )}
              </div>
            </div>

            {!isOpen && (
              <p className="text-base text-gray-700 leading-relaxed mt-3">
                <SummaryWithToggleLinks text={obligation.summary} onToggleLegal={toggleLegalReferences} />
              </p>
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-4 space-y-4">
            {/* Show summary when expanded */}
            <p className="text-base text-gray-700 leading-relaxed">
              <SummaryWithToggleLinks text={obligation.summary} onToggleLegal={toggleLegalReferences} />
            </p>

            {/* Warnings */}
            {obligation.warnings && <WarningAlert warnings={obligation.warnings} />}

            {/* Legal References */}
            {showLegalRefs && (
              <LegalReferences references={obligation.legal_references} />
            )}

            {/* Notes section if available */}
            {obligation.notes && obligation.notes.length > 0 && (
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-1">Let op:</p>
                <ul className="list-disc list-inside space-y-1">
                  {obligation.notes.map((note, noteIndex) => (
                    <li key={noteIndex} className="text-sm text-blue-700">{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nested Obligation Sections */}
            <div className="space-y-4 mt-4">
              {obligation.sections.map((section) => (
                <ObligationSection
                  key={section.key}
                  section={section}
                  defaultOpen={false}
                  showGppBadge={obligation.badges?.includes('GPP')}
                  legalReferences={obligation.legal_references}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>

            {/* Footer warnings if available */}
            {obligation.footer_warnings && obligation.footer_warnings.length > 0 && (
              <div className="mt-4">
                <WarningAlert warnings={obligation.footer_warnings} />
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};