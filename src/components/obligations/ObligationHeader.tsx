import React from 'react';
import { Obligation } from '@/types/obligations';
import { Badge } from '@/components/ui/badge';
import { SummaryWithToggleLinks } from './SummaryWithToggleLinks';
import { WarningAlert } from './WarningAlert';

interface ObligationHeaderProps {
  obligation: Obligation;
  onToggleLegal?: () => void;
}

export const ObligationHeader: React.FC<ObligationHeaderProps> = ({ obligation, onToggleLegal }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{obligation.title}</h2>
        <div className="flex gap-2 items-center">
          {obligation.badges.map((badge) => {
            if (badge === 'EU') {
              return (
                <img 
                  key={badge}
                  src="/eu-flag.png" 
                  alt="EU Flag" 
                  className="h-5 w-auto"
                />
              );
            } else if (badge === 'GPP') {
              return (
                <Badge 
                  key={badge} 
                  variant="outline"
                  className="text-xs"
                  style={{ backgroundColor: '#DCFCE7', color: '#166534', borderColor: '#DCFCE7' }}
                >
                  {badge}
                </Badge>
              );
            } else {
              return (
                <Badge 
                  key={badge} 
                  variant="outline"
                  className="text-xs"
                  style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', borderColor: '#DBEAFE' }}
                >
                  {badge}
                </Badge>
              );
            }
          })}
        </div>
      </div>
      <p className="text-base text-gray-700 leading-relaxed">
        <SummaryWithToggleLinks text={obligation.summary} onToggleLegal={onToggleLegal} />
      </p>
      {obligation.warnings && <WarningAlert warnings={obligation.warnings} />}
    </div>
  );
};