"use client";

import type { FC } from 'react';
import { useState } from 'react';
import type { Brick } from '@/types';
import { BrickForm } from './BrickForm';
import { BrickList } from './BrickList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, Building } from 'lucide-react';
import { Firebreak } from './Firebreak';

interface MainWorkspaceProps {
  bricks: Brick[];
  maxBricks: number | null;
  addBrick: (text: string) => void;
  completeBrick: (id: string) => void;
  burnBrick: (id: string) => void;
  reorderBricks: (fromId: string, toId: string) => void;
  onLayMore: () => void;
}

export const MainWorkspace: FC<MainWorkspaceProps> = ({
  bricks,
  maxBricks,
  addBrick,
  completeBrick,
  burnBrick,
  reorderBricks,
  onLayMore,
}) => {
  const [newBrickText, setNewBrickText] = useState('');
  
  const handleAddBrick = (text: string) => {
    addBrick(text);
    setNewBrickText('');
  }
  
  const handlePlaceholderClick = (text: string) => {
      if (bricks.length < (maxBricks || 0)) {
        addBrick(text);
      }
  }

  const buildListBricks = bricks.filter(b => !b.isCompleted);
  const burnPileBricks = bricks.filter(b => b.isCompleted); // This seems wrong, should be another state

  const isAtCapacity = maxBricks !== null && buildListBricks.length >= maxBricks;

  if (isAtCapacity) {
    return <Firebreak onLayMore={onLayMore} />;
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <BrickForm 
        addBrick={handleAddBrick} 
        text={newBrickText} 
        setText={setNewBrickText}
        disabled={isAtCapacity}
      />
      <Tabs defaultValue="build">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="build">
            <Building className="mr-2 h-4 w-4" />
            Build List ({buildListBricks.length}/{maxBricks === 999 ? '∞' : maxBricks})
          </TabsTrigger>
          <TabsTrigger value="burn">
            <Flame className="mr-2 h-4 w-4" />
            Burn Pile
          </TabsTrigger>
        </TabsList>
        <TabsContent value="build" className="mt-4">
          <BrickList
            bricks={buildListBricks}
            completeBrick={completeBrick}
            burnBrick={burnBrick}
            reorderBricks={reorderBricks}
            variant="build"
            maxBricks={maxBricks}
            onPlaceholderClick={handlePlaceholderClick}
          />
        </TabsContent>
        <TabsContent value="burn" className="mt-4">
           <BrickList bricks={[]} variant="burn" />
           <p className="text-center font-code text-xs text-muted-foreground mt-4">Move incomplete bricks here to de-prioritize them.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};
