import React from 'react';
import { Warning } from '@/types/obligations';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface WarningAlertProps {
  warnings: Warning[];
}

export const WarningAlert: React.FC<WarningAlertProps> = ({ warnings }) => {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="space-y-3">
      {warnings.map((warning, index) => {
        const isPositive = warning.severity === 'positive';
        const isRed = warning.severity === 'red';

        return (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              isPositive
                ? 'border-[#4A9400]'
                : isRed
                ? 'bg-red-50 border-red-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}
            style={isPositive ? { backgroundColor: '#fafff4' } : undefined}
          >
            <div className="flex items-start gap-3">
              {isPositive ? (
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#4A9400' }} />
              ) : isRed ? (
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              ) : (
                <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              )}
              <p
                className={`text-sm whitespace-pre-line ${
                  isPositive ? '' : isRed ? 'text-red-800' : 'text-yellow-800'
                }`}
                style={isPositive ? { color: '#4A9400' } : undefined}
              >
                {warning.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};