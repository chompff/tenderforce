import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Copy, ExternalLink } from 'lucide-react';

interface GppCriterion {
  code: string;
  title?: string;
  specification: string;
  source: {
    text: string;
    url?: string;
  };
  contractual_condition?: {
    title: string;
    text: string;
  };
}

interface GppCategoryData {
  core_criteria: GppCriterion[];
  extended_criteria: GppCriterion[];
}

interface GppMainTab {
  key: string;
  label: string;
  label_short?: string;  // Label without emoji for use in table headers
  icon?: string;
}

interface GppCriteriaData {
  [key: string]: GppCategoryData;
}

interface GppCriteriaTabsProps {
  data: GppCriteriaData;
  mainTabs: GppMainTab[];
  defaultMainTab?: string;
  codeColumnHeader?: string;  // e.g., "TS-CODE" or "GC4"
  specColumnHeader?: string;  // e.g., "SPECIFICATIE"
}

export const GppCriteriaTabs: React.FC<GppCriteriaTabsProps> = ({
  data,
  mainTabs,
  defaultMainTab,
  codeColumnHeader = 'CODE',
  specColumnHeader = 'SPECIFICATIE'
}) => {
  const [mainTab, setMainTab] = useState<string>(defaultMainTab || mainTabs[0]?.key || '');
  const [subTab, setSubTab] = useState<'core_criteria' | 'extended_criteria'>('core_criteria');

  const subTabs = [
    { key: 'core_criteria' as const, label: 'Kerncriteria', color: 'bg-red-500' },
    { key: 'extended_criteria' as const, label: 'Uitgebreide criteria', color: 'bg-orange-500' }
  ];

  // Parse text with markdown support (images and bold)
  const parseTextWithMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentTextBlock: string[] = [];

    const parseBoldText = (line: string) => {
      // Parse **bold** syntax
      const parts = line.split(/(\*\*.*?\*\*)/);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    const flushTextBlock = (keyPrefix: string) => {
      if (currentTextBlock.length > 0) {
        const textWithBold = currentTextBlock.map((line, i) => (
          <React.Fragment key={i}>
            {parseBoldText(line)}
            {i < currentTextBlock.length - 1 && '\n'}
          </React.Fragment>
        ));
        elements.push(
          <div key={keyPrefix} className="whitespace-pre-line">
            {textWithBold}
          </div>
        );
        currentTextBlock = [];
      }
    };

    lines.forEach((line, index) => {
      // Check for image syntax: ![alt text](url)
      const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

      if (imageMatch) {
        // Flush any accumulated text with bold parsing
        flushTextBlock(`text-${index}`);

        // Add image
        const [, alt, src] = imageMatch;
        elements.push(
          <div key={`img-${index}`} className="my-3">
            <img src={src} alt={alt} className="max-w-full h-auto rounded border border-gray-200" />
          </div>
        );
      } else {
        currentTextBlock.push(line);
      }
    });

    // Flush remaining text with bold parsing
    flushTextBlock('text-final');

    return elements.length > 0 ? <>{elements}</> : <div className="whitespace-pre-line">{text}</div>;
  };

  const renderTable = (specs: GppCriterion[], categoryLabel: string) => {
    if (!specs || specs.length === 0) {
      return (
        <div className="text-sm text-gray-500 italic p-4">
          Geen {categoryLabel.toLowerCase()} beschikbaar
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header with copy button */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">
            {categoryLabel} voor {currentMainTab?.label_short || currentMainTab?.label.replace(/^[📋🪑♻️]\s*/, '') || ''}
          </h4>
          <button
            onClick={() => {
              const tableText = specs.map(spec =>
                `${spec.code}\t${spec.specification}\t${spec.source.text}`
              ).join('\n');
              navigator.clipboard.writeText(tableText);
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Kopieer tabel"
          >
            <Copy className="h-3 w-3" />
            <span>Kopieer</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 text-xs font-semibold text-gray-700 border-b border-gray-200 w-20">
                  {codeColumnHeader}
                </th>
                <th className="text-left p-3 text-xs font-semibold text-gray-700 border-b border-gray-200">
                  {specColumnHeader}
                </th>
                <th className="text-left p-3 text-xs font-semibold text-gray-700 border-b border-gray-200 w-1/3">
                  BRONVERMELDING
                </th>
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, index) => (
                <React.Fragment key={index}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono font-semibold text-gray-900 align-top">
                      {spec.code}
                    </td>
                    <td className="p-3 text-sm text-gray-700 align-top">
                      {spec.title && (
                        <div className="font-semibold mb-2">{spec.title}</div>
                      )}
                      <div>{parseTextWithMarkdown(spec.specification)}</div>
                      {spec.contractual_condition && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="font-semibold text-gray-900 mb-1">
                            {spec.contractual_condition.title}
                          </div>
                          <div className="text-gray-600">
                            {parseTextWithMarkdown(spec.contractual_condition.text)}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-sm align-top">
                      {spec.source.url ? (
                        <a
                          href={spec.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <span className="flex-shrink-0 mt-0.5">🇪🇺</span>
                          <span className="underline">{spec.source.text}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0 mt-0.5" />
                        </a>
                      ) : (
                        <div className="flex items-start gap-1 text-gray-600">
                          <span className="flex-shrink-0">🇪🇺</span>
                          <span>{spec.source.text}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const currentSpecs = data[mainTab]?.[subTab] || [];
  const currentMainTab = mainTabs.find(t => t.key === mainTab);

  return (
    <div className="space-y-4">
      {/* Main tabs - Product categories */}
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
        <TabsList className="flex flex-row gap-1 w-full h-auto p-1 justify-start bg-gray-100">
          {mainTabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:font-semibold"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Sub tabs - Core/Extended criteria */}
        <div className="mt-4">
          <div className="flex items-center gap-4 mb-4">
            {subTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSubTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                  subTab === tab.key
                    ? 'bg-gray-100 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${tab.color}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <TabsContent value={mainTab} className="mt-0">
            {renderTable(
              currentSpecs,
              subTab === 'core_criteria' ? 'Kerncriteria' : 'Uitgebreide criteria'
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
