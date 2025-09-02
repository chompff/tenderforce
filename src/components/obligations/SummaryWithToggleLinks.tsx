import React from 'react';

interface SummaryWithToggleLinksProps {
  text: string;
  onToggleLegal?: () => void;
}

export const SummaryWithToggleLinks: React.FC<SummaryWithToggleLinksProps> = ({ 
  text, 
  onToggleLegal 
}) => {
  // Parse text for [text](toggle:legal) pattern
  const parseText = (input: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /\[([^\]]+)\]\(toggle:legal\)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(input)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(input.substring(lastIndex, match.index));
      }

      // Add the clickable link
      const linkText = match[1];
      parts.push(
        <button
          key={match.index}
          onClick={onToggleLegal}
          className="text-blue-600 hover:text-blue-800 underline cursor-pointer inline"
          type="button"
        >
          {linkText}
        </button>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    if (lastIndex < input.length) {
      parts.push(input.substring(lastIndex));
    }

    // If no matches found, return the original text
    if (parts.length === 0) {
      return [input];
    }

    return parts;
  };

  return <>{parseText(text)}</>;
};