import React from 'react';
import { Warning } from '@/types/obligations';
import { AlertTriangle, Info } from 'lucide-react';

interface WarningAlertProps {
  warnings: Warning[];
}

export const WarningAlert: React.FC<WarningAlertProps> = ({ warnings }) => {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="space-y-3">
      {warnings.map((warning, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border ${
            warning.severity === 'red'
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {warning.severity === 'red' ? (
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            ) : (
              <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            )}
            <p
              className={`text-sm ${
                warning.severity === 'red' ? 'text-red-800' : 'text-yellow-800'
              }`}
            >
              {warning.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};