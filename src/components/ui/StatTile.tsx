import React from 'react';

import { Card } from './Card';

export const StatTile = ({ label, value, icon: Icon, trend }: { label: string; value: string | number; icon?: React.ElementType; trend?: string }) => {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-text-muted">
        <span className="font-medium text-sm tracking-wide uppercase">{label}</span>
        {Icon && <Icon size={20} />}
      </div>
      <div className="flex items-end justify-between">
        <span className="font-mono text-3xl font-semibold text-text-main">{value}</span>
        {trend && (
          <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
};
