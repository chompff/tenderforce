import React from 'react';
import { CheckCircle } from 'lucide-react';

interface StepsListProps {
  steps: string[];
  title?: string;
}

export const StepsList: React.FC<StepsListProps> = ({ steps, title }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-3">
      {title && (
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      )}
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-3">
            <div className="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-700">
                {index + 1}
              </span>
            </div>
            <p className="text-sm text-gray-700 pt-1 whitespace-pre-line">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};