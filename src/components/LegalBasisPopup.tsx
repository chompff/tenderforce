import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [positionAbove, setPositionAbove] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
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

  // Calculate popup position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popupHeight = 400; // Approximate max height
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // Determine if we should position above or below
      const shouldPositionAbove = spaceBelow < popupHeight && spaceAbove > spaceBelow;
      setPositionAbove(shouldPositionAbove);

      // Calculate position
      const top = shouldPositionAbove
        ? buttonRect.top - 8 // 8px spacing above button
        : buttonRect.bottom + 8; // 8px spacing below button

      const left = buttonRect.left;

      setPosition({ top, left });
    }
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

      // Parse bold text and links
      const parseInlineElements = (text: string) => {
        const parts: (string | JSX.Element)[] = [];
        let remaining = text;
        let keyCounter = 0;

        while (remaining.length > 0) {
          // Try to match [text](url)
          const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
          if (linkMatch) {
            const [fullMatch, linkText, url] = linkMatch;
            parts.push(
              <a
                key={`link-${lineIndex}-${keyCounter++}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {linkText}
              </a>
            );
            remaining = remaining.slice(fullMatch.length);
            continue;
          }

          // Try to match **bold**
          const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
          if (boldMatch) {
            const [fullMatch, boldText] = boldMatch;
            parts.push(<strong key={`bold-${lineIndex}-${keyCounter++}`}>{boldText}</strong>);
            remaining = remaining.slice(fullMatch.length);
            continue;
          }

          // No match, add next character
          parts.push(remaining[0]);
          remaining = remaining.slice(1);
        }

        return parts.length > 0 ? parts : text;
      };

      // Regular text with potential bold/link formatting
      return <div key={lineIndex}>{parseInlineElements(line)}</div>;
    });
  };

  // Use Search icon for "VOORBEELD" title, otherwise use Scale
  const Icon = title === 'VOORBEELD' ? Search : Scale;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 hover:text-blue-800 underline decoration-dotted cursor-pointer font-normal"
      >
        {triggerText}
      </button>

      {isOpen && createPortal(
        <div
          ref={popupRef}
          className="fixed z-[9999] w-[400px] max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 p-4"
          style={{
            top: positionAbove ? 'auto' : `${position.top}px`,
            bottom: positionAbove ? `${window.innerHeight - position.top}px` : 'auto',
            left: `${position.left}px`,
          }}
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
        </div>,
        document.body
      )}
    </>
  );
};
