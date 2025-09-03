import React, { useState } from 'react';
import { TabbedExamples } from '@/types/obligations';
import { FileText, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TabbedExamplesCardProps {
  examples: TabbedExamples;
  title?: string;
}

export const TabbedExamplesCard: React.FC<TabbedExamplesCardProps> = ({ 
  examples, 
  title = 'Toon voorbeelden' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basis' | 'ambitieus'>('basis');

  if (!examples || (!examples.basis && !examples.ambitieus)) return null;

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderExamples = (exampleList: typeof examples.basis) => {
    if (!exampleList || exampleList.length === 0) return null;

    return (
      <div className="space-y-3">
        {exampleList.map((example, index) => {
          const id = `${activeTab}-${index}`;
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {example.title && (
                    <h5 className="font-semibold text-sm text-gray-700 mb-2">
                      {example.title}
                    </h5>
                  )}
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {example.text}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(example.text, id)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Kopieer voorbeeld"
                >
                  {copiedIndex === id ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Determine which tabs are available
  const hasBasis = examples.basis && examples.basis.length > 0;
  const hasAmbitieus = examples.ambitieus && examples.ambitieus.length > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          <FileText className="h-4 w-4" />
          <span className="underline">{title}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'basis' | 'ambitieus')} className="w-full">
          <TabsList className="flex flex-row gap-1 w-full h-auto p-1 justify-start mb-4">
            {hasBasis && (
              <TabsTrigger 
                value="basis"
                className="flex items-center gap-2 px-4 py-2"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm">Basis</span>
              </TabsTrigger>
            )}
            {hasAmbitieus && (
              <TabsTrigger 
                value="ambitieus"
                className="flex items-center gap-2 px-4 py-2"
              >
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm">Ambitieus</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          {hasBasis && (
            <TabsContent value="basis" className="mt-0">
              {renderExamples(examples.basis)}
              {examples.basis && examples.basis.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    💡 Tip: De basiscriteria helpen je te voldoen aan de EED-verplichting. Kies deze variant als je vooral wilt voldoen aan de Europese regelgeving zonder aanvullende ambities.
                  </p>
                </div>
              )}
            </TabsContent>
          )}
          
          {hasAmbitieus && (
            <TabsContent value="ambitieus" className="mt-0">
              {renderExamples(examples.ambitieus)}
              {examples.ambitieus && examples.ambitieus.length > 0 && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-700">
                    💡 Tip: De ambitieuze criteria gaan verder dan de EED-verplichting en helpen je organisatie actief te sturen op circulariteit, CO₂-reductie en innovatie. Kies deze variant als je duurzaamheid centraal wilt stellen.
                  </p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CollapsibleContent>
    </Collapsible>
  );
};