import type { FC } from 'react';
import type { Brick } from '@/types';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface BrickItemProps {
  brick: Brick;
  removeBrick: (id: number) => void;
}

export const BrickItem: FC<BrickItemProps> = ({ brick, removeBrick }) => {
  return (
    <li className="group bg-card border border-border rounded-lg p-4 flex justify-between items-center transition-colors hover:bg-secondary/50">
      <span className="font-code uppercase">{brick.text}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeBrick(brick.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary hover:bg-primary/10 font-bold uppercase text-xs"
        aria-label={`Complete task: ${brick.text}`}
      >
        <Check className="h-4 w-4 mr-1" />
        Complete
      </Button>
    </li>
  );
};
