import React from 'react';
import { LegalBasisPopup } from '../LegalBasisPopup';

interface SummaryWithToggleLinksProps {
  text: string;
  onToggleLegal?: () => void;
}

export const SummaryWithToggleLinks: React.FC<SummaryWithToggleLinksProps> = ({
  text,
  onToggleLegal
}) => {
  // Parse text for [text](toggle:legal) and [text](popup:title||content||reference) patterns
  const parseText = (input: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Manual parsing to handle nested parentheses properly
    let i = 0;
    while (i < input.length) {
      // Look for opening bracket
      if (input[i] === '[') {
        const linkTextStart = i + 1;
        const linkTextEnd = input.indexOf(']', linkTextStart);

        if (linkTextEnd === -1) {
          i++;
          continue;
        }

        const linkText = input.substring(linkTextStart, linkTextEnd);

        // Check if followed by (
        if (input[linkTextEnd + 1] === '(') {
          const actionStart = linkTextEnd + 2;

          // Find the matching closing parenthesis, counting nested ones
          let parenCount = 1;
          let actionEnd = actionStart;
          while (actionEnd < input.length && parenCount > 0) {
            if (input[actionEnd] === '(') parenCount++;
            else if (input[actionEnd] === ')') parenCount--;
            if (parenCount > 0) actionEnd++;
          }

          if (parenCount === 0) {
            // Add any text before this match
            if (i > lastIndex) {
              parts.push(input.substring(lastIndex, i));
            }

            const action = input.substring(actionStart, actionEnd);

            if (action === 'toggle:legal') {
              // Add the toggle legal references button
              parts.push(
                <button
                  key={i}
                  onClick={onToggleLegal}
                  className="text-blue-600 hover:text-blue-800 underline cursor-pointer inline"
                  type="button"
                >
                  {linkText}
                </button>
              );
            } else if (action.startsWith('popup:')) {
              // Parse popup parameters: popup:title||content||reference
              const popupData = action.substring(6); // Remove 'popup:' prefix
              const parts_split = popupData.split('||');
              const title = parts_split[0] || '';
              const content = parts_split[1] || '';
              const reference = parts_split[2] || '';

              parts.push(
                <LegalBasisPopup
                  key={i}
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
                  key={i}
                  href={action}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline cursor-pointer inline"
                >
                  {linkText}
                </a>
              );
            }

            lastIndex = actionEnd + 1;
            i = actionEnd + 1;
            continue;
          }
        }
      }
      i++;
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