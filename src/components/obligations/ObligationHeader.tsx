import React from 'react';
import { Obligation } from '@/types/obligations';
import { Badge } from '@/components/ui/badge';

interface ObligationHeaderProps {
  obligation: Obligation;
}

export const ObligationHeader: React.FC<ObligationHeaderProps> = ({ obligation }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-gray-900">{obligation.title}</h2>
        <div className="flex gap-2">
          {obligation.badges.map((badge) => (
            <Badge 
              key={badge} 
              variant={badge === 'EED' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>
      <p className="text-base text-gray-700 leading-relaxed">{obligation.summary}</p>
    </div>
  );
};