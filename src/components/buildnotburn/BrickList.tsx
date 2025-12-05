import type { FC } from 'react';
import { BrickItem } from './BrickItem';
import type { Brick } from '@/types';

interface BrickListProps {
  bricks: Brick[];
  removeBrick: (id: number) => void;
}

export const BrickList: FC<BrickListProps> = ({ bricks, removeBrick }) => {
  if (bricks.length === 0) {
    return (
      <div className="text-center py-10 font-code text-muted-foreground">
        <p>// ALL BRICKS LAID. SYSTEM IDLE.</p>
      </div>
    );
  }

  return (
    <ul id="brick-list" className="space-y-2 mt-4">
      {bricks.map((brick) => (
        <BrickItem key={brick.id} brick={brick} removeBrick={removeBrick} />
      ))}
    </ul>
  );
};
