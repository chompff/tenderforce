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
            if (badge === 'NL') {
              return (
                <img
                  key={badge}
                  src="/dutch-flag.png"
                  alt="Dutch Flag"
                  className="h-5 w-auto"
                />
              );
            } else if (badge === 'EU') {
              return (
                <img
                  key={badge}
                  src="/eu-flag.png"
                  alt="EU Flag"
                  className="h-5 w-auto"
                />
              );
            } else if (badge === 'ENERGIELABEL') {
              return (
                <Badge
                  key={badge}
                  variant="outline"
                  className="text-xs uppercase"
                  style={{ backgroundColor: '#D1FAE5', color: '#065F46', borderColor: '#D1FAE5' }}
                >
                  {badge}
                </Badge>
              );
            } else if (badge === 'ECODESIGN') {
              return (
                <Badge
                  key={badge}
                  variant="outline"
                  className="text-xs uppercase"
                  style={{ backgroundColor: '#f3e4ee', color: '#7d2352', borderColor: '#f3e4ee' }}
                >
                  {badge}
                </Badge>
              );
            } else if (badge === 'MVI') {
              return (
                <Badge
                  key={badge}
                  variant="outline"
                  className="text-xs uppercase"
                  style={{ backgroundColor: '#4A9400', color: '#FFFFFF', borderColor: '#4A9400' }}
                >
                  {badge}
                </Badge>
              );
            } else if (badge === 'GPP') {
              return (
                <Badge
                  key={badge}
                  variant="outline"
                  className="text-xs uppercase"
                  style={{ backgroundColor: '#3E6B3A', color: '#FFFFFF', borderColor: '#3E6B3A' }}
                >
                  {badge}
                </Badge>
              );
            } else if (badge === 'BANDEN') {
              return (
                <Badge
                  key={badge}
                  variant="outline"
                  className="text-xs uppercase"
                  style={{ backgroundColor: '#6C6C6C', color: '#FFFFFF', borderColor: '#6C6C6C' }}
                >
                  {badge}
                </Badge>
              );
            } else if (badge === 'DIENSTEN') {
              return (
                <Badge
                  key={badge}
                  variant="outline"
                  className="text-xs uppercase"
                  style={{ backgroundColor: '#E5FAFD', color: '#008A9E', borderColor: '#E5FAFD' }}
                >
                  {badge}
                </Badge>
              );
            } else if (badge === 'GEBOUWEN') {
              return (
                <Badge
                  key={badge}
                  variant="outline"
                  className="text-xs uppercase"
                  style={{ backgroundColor: '#F4EDE6', color: '#5C4033', borderColor: '#F4EDE6' }}
                >
                  {badge}
                </Badge>
              );
            } else if (badge === 'ALGEMEEN') {
              return (
                <Badge
                  key={badge}
                  variant="outline"
                  className="text-xs uppercase"
                  style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FEF3C7' }}
                >
                  {badge}
                </Badge>
              );
            } else {
              return (
                <Badge
                  key={badge}
                  variant="outline"
                  className="text-xs uppercase"
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