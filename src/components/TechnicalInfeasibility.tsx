import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CircleSlash } from 'lucide-react';

export const TechnicalInfeasibility: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-4">
      <p className="text-sm text-gray-700 leading-relaxed">
        De EED hoeft niet te worden toegepast wanneer het aantoonbaar is dat voldoen aan het energie-efficiëntie-eerstbeginsel technisch niet haalbaar is.{' '}
        <button
          onClick={() => setIsOpen(true)}
          className="text-blue-600 hover:text-blue-800 underline transition-colors font-medium"
        >
          Toon uitleg
        </button>
      </p>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CircleSlash className="h-6 w-6 text-blue-600" />
              Technische niet-haalbaarheid
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              De EED hoeft niet te worden toegepast wanneer het aantoonbaar is dat voldoen aan het energie-efficiëntie-eerstbeginsel technisch niet haalbaar is.
            </p>

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
                De investering die nodig is om de EED-verplichting na te komen, is aantoonbaar buitensporig in verhouding tot de verwachte baten. Dit moet worden onderbouwd met een levenscycluskostenanalyse of gelijkwaardig bewijs.
              </p>
            </div>

            {/* Point 4 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                4. Goed gedocumenteerde uitzonderingssituaties
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                De technische niet-haalbaarheid moet objectief, controleerbaar en gedocumenteerd zijn. Bijvoorbeeld via een technisch rapport, berekeningen, marktvergelijkingen of een verklaring van een deskundige.
              </p>
            </div>

            {/* Legal Reference */}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 italic">
                C(2024) 3744 Final
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
