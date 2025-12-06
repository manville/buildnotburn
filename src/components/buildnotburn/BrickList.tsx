import type { FC } from 'react';
import { BrickItem } from './BrickItem';
import type { Brick } from '@/types';

interface BrickListProps {
  bricks: Brick[];
  removeBrick: (id: number) => void;
  readOnly?: boolean;
}

export const BrickList: FC<BrickListProps> = ({ bricks, removeBrick, readOnly = false }) => {
  if (bricks.length === 0) {
    return (
      <div className="text-center py-10 font-code text-muted-foreground border-2 border-dashed border-secondary rounded-lg">
        <p>{readOnly ? "// PILE EMPTY." : "// NO BRICKS SCHEDULED."}</p>
      </div>
    );
  }

  return (
    <ul id="brick-list" className="space-y-2">
      {bricks.map((brick) => (
        <BrickItem key={brick.id} brick={brick} removeBrick={removeBrick} readOnly={readOnly} />
      ))}
    </ul>
  );
};