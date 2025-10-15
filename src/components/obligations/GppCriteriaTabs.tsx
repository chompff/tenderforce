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

  // Parse text with markdown support (images, bold, and italic)
  const parseTextWithMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentTextBlock: string[] = [];

    const parseInlineFormatting = (line: string) => {
      // Parse **bold**, *italic*, and _italic_ syntax
      // Use a more complex regex to handle both bold and italic
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let key = 0;

      while (remaining.length > 0) {
        // Try to match **bold**
        const boldMatch = remaining.match(/^(\*\*)(.*?)\*\*/);
        if (boldMatch) {
          parts.push(<strong key={key++}>{boldMatch[2]}</strong>);
          remaining = remaining.slice(boldMatch[0].length);
          continue;
        }

        // Try to match *italic* (single asterisk, not followed by another asterisk)
        const italicAsteriskMatch = remaining.match(/^(\*)([^*]+?)\*/);
        if (italicAsteriskMatch) {
          parts.push(<em key={key++}>{italicAsteriskMatch[2]}</em>);
          remaining = remaining.slice(italicAsteriskMatch[0].length);
          continue;
        }

        // Try to match _italic_ (underscore)
        const italicUnderscoreMatch = remaining.match(/^(_)([^_]+?)_/);
        if (italicUnderscoreMatch) {
          parts.push(<em key={key++}>{italicUnderscoreMatch[2]}</em>);
          remaining = remaining.slice(italicUnderscoreMatch[0].length);
          continue;
        }

        // No match, add the next character as plain text
        parts.push(remaining[0]);
        remaining = remaining.slice(1);
      }

      return parts;
    };

    const flushTextBlock = (keyPrefix: string) => {
      if (currentTextBlock.length > 0) {
        const textWithFormatting = currentTextBlock.map((line, i) => (
          <React.Fragment key={i}>
            {parseInlineFormatting(line)}
            {i < currentTextBlock.length - 1 && '\n'}
          </React.Fragment>
        ));
        elements.push(
          <div key={keyPrefix} className="whitespace-pre-line">
            {textWithFormatting}
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
            {categoryLabel} voor {currentMainTab?.label_short || currentMainTab?.label.replace(/^[\p{Emoji}\s]+/u, '') || ''}
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

  // Check which tabs have content for the current main tab
  const hasCoreCriteria = data[mainTab]?.core_criteria && data[mainTab].core_criteria.length > 0;
  const hasExtendedCriteria = data[mainTab]?.extended_criteria && data[mainTab].extended_criteria.length > 0;

  // Filter visible sub-tabs based on available content
  const visibleSubTabs = subTabs.filter(tab => {
    if (tab.key === 'core_criteria') return hasCoreCriteria;
    if (tab.key === 'extended_criteria') return hasExtendedCriteria;
    return true;
  });

  // Auto-switch to first available tab if current tab is not visible
  React.useEffect(() => {
    if (visibleSubTabs.length > 0 && !visibleSubTabs.find(t => t.key === subTab)) {
      setSubTab(visibleSubTabs[0].key);
    }
  }, [mainTab, visibleSubTabs, subTab]);

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
            {subTabs.map((tab) => {
              // Check if this tab has content
              const hasContent = tab.key === 'core_criteria' ? hasCoreCriteria : hasExtendedCriteria;

              // Don't render the tab if it has no content
              if (!hasContent) return null;

              return (
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
              );
            })}
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
