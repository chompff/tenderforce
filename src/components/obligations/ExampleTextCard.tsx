import React, { useState } from 'react';
import { ExampleText } from '@/types/obligations';
import { Copy, Check, FileText, ChevronRight, ChevronDown } from 'lucide-react';

interface ExampleTextCardProps {
  examples: ExampleText[];
  title?: string;
}

export const ExampleTextCard: React.FC<ExampleTextCardProps> = ({ examples, title }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!examples || examples.length === 0) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const parseMarkdown = (text: string) => {
    // Split by lines to handle images
    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
      // Check for image syntax: ![alt text](url)
      const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        const [, alt, src] = imageMatch;
        return (
          <div key={lineIndex} className="my-4">
            <img src={src} alt={alt} className="max-w-full h-auto rounded border border-gray-200" />
          </div>
        );
      }

      // Handle empty lines as spacing
      if (line.trim() === '') {
        return <div key={lineIndex} className="h-4" />;
      }

      // Simple parser for **bold** text
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const parsedLine = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      });

      return <div key={lineIndex}>{parsedLine}</div>;
    });
  };

  return (
    <div className="space-y-3">
      {title && (
        <h4 className="text-sm font-semibold text-gray-900">
          {title}
        </h4>
      )}
      {examples.map((example, index) => (
        <div key={index} className="space-y-2">
          <button
            onClick={() => toggleExpanded(index)}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {expandedIndex === index ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <FileText className="h-4 w-4" />
            {example.label}
          </button>

          {expandedIndex === index && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm text-gray-700 flex-1">
                  {parseMarkdown(example.text)}
                </div>
                <button
                  onClick={() => handleCopy(example.text, index)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                  title="Kopieer tekst"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Gekopieerd</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Kopieer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};