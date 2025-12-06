import type { FC } from 'react';
import { BrickItem } from './BrickItem';
import type { Brick } from '@/types';
import { cn } from '@/lib/utils';

interface BrickListProps {
  bricks: Brick[];
  removeBrick: (id: number) => void;
  variant?: 'build' | 'burn';
}

export const BrickList: FC<BrickListProps> = ({ bricks, removeBrick, variant = 'build' }) => {
  const isBurnPile = variant === 'burn';

  if (bricks.length === 0) {
    return (
      <div className={cn(
        "text-center py-10 font-code text-muted-foreground border-2 border-dashed rounded-lg",
        isBurnPile ? "border-amber-900/40 bg-amber-900/10" : "border-secondary"
      )}>
        <p>{isBurnPile ? "// PILE EMPTY. GOOD." : "// NO BRICKS SCHEDULED."}</p>
      </div>
    );
  }

  return (
    <ul id="brick-list" className="space-y-2">
      {bricks.map((brick) => (
        <BrickItem key={brick.id} brick={brick} removeBrick={removeBrick} readOnly={isBurnPile} />
      ))}
    </ul>
  );
};
