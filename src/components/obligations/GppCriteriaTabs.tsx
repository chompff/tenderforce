import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Copy, ExternalLink } from 'lucide-react';
import { LegalBasisPopup } from '../LegalBasisPopup';

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
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);

  const subTabs = [
    { key: 'core_criteria' as const, label: 'Kerncriteria', color: 'bg-red-500' },
    { key: 'extended_criteria' as const, label: 'Uitgebreide criteria', color: 'bg-orange-500' }
  ];

  // Parse popups first (before splitting by lines) since they can span multiple lines
  const parsePopups = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Look for [text](popup:...)
      const bracketIndex = remaining.indexOf('[');
      if (bracketIndex === -1) {
        // No more popups, add remaining text
        if (remaining.length > 0) {
          parts.push(remaining);
        }
        break;
      }

      // Add text before the bracket
      if (bracketIndex > 0) {
        parts.push(remaining.substring(0, bracketIndex));
      }

      // Find the closing ] for link text
      const linkTextEnd = remaining.indexOf(']', bracketIndex + 1);
      if (linkTextEnd === -1 || remaining[linkTextEnd + 1] !== '(') {
        // Not a valid link, add the [ and continue
        parts.push(remaining[bracketIndex]);
        remaining = remaining.slice(bracketIndex + 1);
        continue;
      }

      const linkText = remaining.substring(bracketIndex + 1, linkTextEnd);
      const actionStart = linkTextEnd + 2;

      // Find matching closing parenthesis, counting nested ones
      let parenCount = 1;
      let actionEnd = actionStart;
      while (actionEnd < remaining.length && parenCount > 0) {
        if (remaining[actionEnd] === '(') parenCount++;
        else if (remaining[actionEnd] === ')') parenCount--;
        if (parenCount > 0) actionEnd++;
      }

      if (parenCount !== 0) {
        // No matching closing paren, not a valid link
        parts.push(remaining[bracketIndex]);
        remaining = remaining.slice(bracketIndex + 1);
        continue;
      }

      const action = remaining.substring(actionStart, actionEnd);

      if (action.startsWith('popup:')) {
        // Parse popup parameters: popup:title||content||reference
        const popupData = action.substring(6); // Remove 'popup:' prefix
        const parts_split = popupData.split('||');
        const title = parts_split[0] || '';
        const content = parts_split[1] || '';
        const reference = parts_split[2] || '';

        parts.push(
          <LegalBasisPopup
            key={`popup-${key++}`}
            triggerText={linkText}
            title={title}
            content={content}
            legalReference={reference}
          />
        );
      } else if (action.startsWith('http://') || action.startsWith('https://')) {
        // Regular external link
        parts.push(
          <a
            key={`link-${key++}`}
            href={action}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer inline"
          >
            {linkText}
          </a>
        );
      } else {
        // Unknown link format, treat as text
        parts.push(remaining.substring(bracketIndex, actionEnd + 1));
      }

      remaining = remaining.slice(actionEnd + 1);
    }

    return parts;
  };

  // Parse text with markdown support (images, bold, and italic)
  const parseTextWithMarkdown = (text: string) => {
    // First, parse popups since they can span multiple lines
    const popupParsedParts = parsePopups(text);

    // Now we need to process the parts, but keep inline elements on the same line
    // We'll rebuild the text with placeholders for React elements
    const reactElements: { [key: string]: React.ReactElement } = {};
    let textWithPlaceholders = '';
    let elementCounter = 0;

    popupParsedParts.forEach((part) => {
      if (React.isValidElement(part)) {
        // Store the React element and use a placeholder
        const placeholder = `__REACT_ELEMENT_${elementCounter}__`;
        reactElements[placeholder] = part;
        textWithPlaceholders += placeholder;
        elementCounter++;
      } else {
        // It's a string, add it directly
        textWithPlaceholders += part as string;
      }
    });

    // Now parse the text with placeholders for markdown
    const lines = textWithPlaceholders.split('\n');
    const elements: React.ReactNode[] = [];
    let currentTextBlock: string[] = [];

    const parseInlineFormatting = (line: string): React.ReactNode[] => {
      // Parse **bold**, *italic*, _italic_, and replace placeholders with React elements
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let key = 0;

      while (remaining.length > 0) {
        // Try to match placeholder for React element
        const placeholderMatch = remaining.match(/^__REACT_ELEMENT_(\d+)__/);
        if (placeholderMatch) {
          const placeholder = placeholderMatch[0];
          if (reactElements[placeholder]) {
            parts.push(React.cloneElement(reactElements[placeholder], { key: `react-el-${key++}` }));
          }
          remaining = remaining.slice(placeholder.length);
          continue;
        }

        // Try to match **bold**
        const boldMatch = remaining.match(/^(\*\*)(.*?)\*\*/);
        if (boldMatch) {
          parts.push(<strong key={key++}>{parseInlineFormatting(boldMatch[2])}</strong>);
          remaining = remaining.slice(boldMatch[0].length);
          continue;
        }

        // Try to match *italic* (single asterisk, not followed by another asterisk)
        const italicAsteriskMatch = remaining.match(/^(\*)([^*]+?)\*/);
        if (italicAsteriskMatch) {
          parts.push(<em key={key++}>{parseInlineFormatting(italicAsteriskMatch[2])}</em>);
          remaining = remaining.slice(italicAsteriskMatch[0].length);
          continue;
        }

        // Try to match _italic_ (underscore)
        const italicUnderscoreMatch = remaining.match(/^(_)([^_]+?)_/);
        if (italicUnderscoreMatch) {
          parts.push(<em key={key++}>{parseInlineFormatting(italicUnderscoreMatch[2])}</em>);
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

    // Parse markdown tables and formulas
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // Check for image syntax: ![alt text](url)
      const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

      // Check for formula block: ```formula
      const isFormulaStart = line.trim() === '```formula';

      // Check if this line looks like a table header (contains |)
      const isTableLine = line.trim().startsWith('|') && line.trim().endsWith('|');

      if (isFormulaStart) {
        // Parse formula block
        flushTextBlock(`text-${i}`);

        i++; // Skip the ```formula line
        const formulaContent: string[] = [];

        // Collect formula lines until we hit ```
        while (i < lines.length && lines[i].trim() !== '```') {
          formulaContent.push(lines[i]);
          i++;
        }

        if (formulaContent.length > 0) {
          // Parse formula text to handle subscripts (e.g., E_m becomes E with subscript m)
          const parseFormula = (text: string) => {
            const parts: React.ReactNode[] = [];
            const regex = /([A-Z]+)_([a-z]+|[a-z]+)/g;
            let lastIndex = 0;
            let match;
            let keyCounter = 0;

            while ((match = regex.exec(text)) !== null) {
              // Add text before the subscript
              if (match.index > lastIndex) {
                parts.push(<span key={`text-${keyCounter++}`}>{text.substring(lastIndex, match.index)}</span>);
              }
              // Add variable with subscript
              parts.push(
                <span key={`var-${keyCounter++}`}>
                  <i>{match[1]}</i>
                  <sub>{match[2]}</sub>
                </span>
              );
              lastIndex = regex.lastIndex;
            }

            // Add remaining text
            if (lastIndex < text.length) {
              parts.push(<span key={`text-${keyCounter++}`}>{text.substring(lastIndex)}</span>);
            }

            return parts.length > 0 ? parts : text;
          };

          const formulaText = formulaContent.join('\n');
          elements.push(
            <div key={`formula-${i}`} className="my-4 text-center">
              <div className="inline-block bg-gray-50 border border-gray-200 rounded px-6 py-4">
                <div className="text-xl font-serif" style={{ letterSpacing: '0.05em' }}>
                  {parseFormula(formulaText)}
                </div>
              </div>
            </div>
          );
        }

        i++; // Skip the closing ```
      } else if (imageMatch) {
        // Flush any accumulated text with bold parsing
        flushTextBlock(`text-${i}`);

        // Add image
        const [, alt, src] = imageMatch;
        elements.push(
          <div key={`img-${i}`} className="my-3">
            <img src={src} alt={alt} className="max-w-full h-auto rounded border border-gray-200" />
          </div>
        );
        i++;
      } else if (isTableLine && i + 1 < lines.length && lines[i + 1].trim().match(/^\|[\s\-:]+\|/)) {
        // This is a table! Flush text block first
        flushTextBlock(`text-${i}`);

        // Parse the table
        const tableLines: string[] = [];
        let j = i;

        // Collect all table lines
        while (j < lines.length && lines[j].trim().startsWith('|') && lines[j].trim().endsWith('|')) {
          tableLines.push(lines[j]);
          j++;
        }

        if (tableLines.length >= 2) {
          // Parse header
          const headerCells = tableLines[0]
            .split('|')
            .slice(1, -1)
            .map(cell => cell.trim());

          // Parse rows (skip the separator line at index 1)
          const rows = tableLines.slice(2).map(row =>
            row.split('|')
              .slice(1, -1)
              .map(cell => cell.trim())
          );

          // Render table
          elements.push(
            <div key={`table-${i}`} className="my-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    {headerCells.map((cell, idx) => (
                      <th key={idx} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        {parseInlineFormatting(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {row.map((cell, cellIdx) => {
                        // Parse HTML breaks and convert to React elements
                        const cellParts = cell.split(/<br\s*\/?>/i);
                        return (
                          <td key={cellIdx} className="border border-gray-300 px-4 py-2">
                            {cellParts.map((part, partIdx) => (
                              <React.Fragment key={partIdx}>
                                {parseInlineFormatting(part)}
                                {partIdx < cellParts.length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        i = j;
      } else {
        currentTextBlock.push(line);
        i++;
      }
    }

    // Flush remaining text with bold parsing
    flushTextBlock('text-final');

    return elements.length > 0 ? <>{elements}</> : <div className="whitespace-pre-line">{textWithPlaceholders}</div>;
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

  // Auto-scroll active tab into view when it changes
  React.useEffect(() => {
    if (tabsContainerRef.current) {
      const activeTab = tabsContainerRef.current.querySelector(`[data-state="active"]`);
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [mainTab]);

  // Hide main tabs if there's only one tab
  const showMainTabs = mainTabs.length > 1;

  return (
    <div className="space-y-4">
      {/* Main tabs - Product categories */}
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
        {showMainTabs && (
          <TabsList ref={tabsContainerRef} className="flex flex-row gap-1 w-full h-auto p-1 justify-start bg-gray-100 overflow-x-auto flex-nowrap no-scrollbar">
            {mainTabs.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:font-semibold flex-shrink-0"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        {/* Sub tabs - Core/Extended criteria */}
        <div className={showMainTabs ? "mt-4" : ""}>
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
