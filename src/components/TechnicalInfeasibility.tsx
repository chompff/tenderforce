import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const TechnicalInfeasibility: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="space-y-4">
        {/* Header */}
        <h3 className="text-lg font-semibold text-gray-900">
          Technische niet-haalbaarheid
        </h3>

        {/* Introduction */}
        <p className="text-sm text-gray-700 leading-relaxed">
          De EED hoeft niet te worden toegepast wanneer het aantoonbaar is dat voldoen aan het energie-efficiëntie-eerstbeginsel technisch niet haalbaar is.
        </p>

        {/* Expandable Section */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
        >
          {isExpanded ? 'Verberg uitleg' : 'Toon uitleg'}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {isExpanded && (
          <div className="space-y-4 pt-2">
            {/* Point 1 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                1. Bewezen afwezigheid van beschikbare technologie
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Er is geen technologie op de markt die binnen de relevante plannings- en uitvoeringsperiode de vereiste energieprestatie kan realiseren. Alleen geldig als kan worden aangetoond dat ook met redelijk beschikbare technieken het vereiste prestatieniveau niet haalbaar is.
              </p>
            </div>

            {/* Point 2 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                2. Onverenigbaarheid met cruciale eisen of context
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                De toepassing van de vereiste maatregel botst met wezenlijke technische, veiligheids- of erfgoedvereisten van het project. Denk aan brandveiligheid, structurele integriteit of bescherming van cultureel erfgoed.
              </p>
            </div>

            {/* Point 3 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                3. Onevenredige meerkosten
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                De investering die nodig is om de EED-verplichting na te komen, is aantoonbaar buitensporig in verhouding tot de verwachte baten, zelfs wanneer onderbouwd met een levenscycluskostenanalyse of gelijkwaardig bewijs.
              </p>
            </div>

            {/* Point 4 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                4. Goed gedocumenteerde uitzonderingssituaties
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                De technische niet-haalbaarheid is aantoonbaar, controleerbaar en gedocumenteerd zijn. Bijvoorbeeld via een technisch rapport, berekeningen, marktvergelijkingen of een verklaring van een deskundige.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
