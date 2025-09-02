import React, { useState } from 'react';
import { ExampleText } from '@/types/obligations';
import { Copy, Check, FileText, ChevronRight, ChevronDown } from 'lucide-react';

interface ExampleTextCardProps {
  examples: ExampleText[];
  title?: string;
}

export const ExampleTextCard: React.FC<ExampleTextCardProps> = ({ examples, title }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!examples || examples.length === 0) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
      >
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <FileText className="h-4 w-4" />
        Toon voorbeeld
      </button>
      
      {isExpanded && (
        <div className="space-y-3 animate-fade-in">
          {title && (
            <h4 className="text-sm font-semibold text-gray-900">
              {title}
            </h4>
          )}
          {examples.map((example, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h5 className="text-sm font-medium text-gray-900">
                  {example.label}
                </h5>
                <button
                  onClick={() => handleCopy(example.text, index)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
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
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {example.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};