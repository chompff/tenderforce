import React, { useState, useRef, useEffect } from 'react';
import { Scale, Search } from 'lucide-react';

interface LegalBasisPopupProps {
  triggerText: string;
  title: string;
  content: string;
  legalReference?: string;
}

export const LegalBasisPopup: React.FC<LegalBasisPopupProps> = ({
  triggerText,
  title,
  content,
  legalReference,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
        return <div key={lineIndex} className="h-2" />;
      }

      // Check if line is a URL (starts with www. or http)
      if (line.trim().match(/^(https?:\/\/|www\.)/)) {
        return (
          <div key={lineIndex} className="text-sm text-gray-500 mt-2">
            {line}
          </div>
        );
      }

      // Regular text
      return <div key={lineIndex}>{line}</div>;
    });
  };

  // Use Search icon for "VOORBEELD" title, otherwise use Scale
  const Icon = title === 'VOORBEELD' ? Search : Scale;

  return (
    <span className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 hover:text-blue-800 underline decoration-dotted cursor-pointer font-normal"
      >
        {triggerText}
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="absolute z-50 w-[400px] mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 left-0"
          style={{ top: '100%' }}
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 mt-0.5">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-blue-600 uppercase tracking-wide">
              {title}
            </h3>
          </div>

          {/* Content */}
          <div className="text-sm text-gray-700 leading-relaxed">
            {parseMarkdown(content)}
          </div>

          {/* Legal Reference */}
          {legalReference && (
            <p className="text-xs text-gray-500 mt-3 font-medium">
              {legalReference}
            </p>
          )}
        </div>
      )}
    </span>
  );
};
