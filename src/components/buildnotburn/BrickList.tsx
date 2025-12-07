"use client";
import type { FC, DragEvent } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import { BrickItem } from './BrickItem';
import type { Brick } from '@/types';
import { cn } from '@/lib/utils';
import { BrickPlaceholder } from './BrickPlaceholder';
import suggestionData from '@/data/suggestions.json';

interface BrickListProps {
  bricks: Brick[];
  completeBrick?: (id: string) => void;
  burnBrick?: (id: string) => void;
  reorderBricks?: (fromId: string, toId: string) => void;
  variant?: 'build' | 'burn';
  maxBricks?: number | null;
  onPlaceholderClick?: (text: string) => void;
}

export const BrickList: FC<BrickListProps> = ({ bricks, completeBrick, burnBrick, reorderBricks, variant = 'build', maxBricks, onPlaceholderClick }) => {
  const isBurnPile = variant === 'burn';
  const dragItemId = useRef<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    // Shuffle suggestions on client-side to prevent hydration mismatch
    setSuggestions(suggestionData.sort(() => 0.5 - Math.random()));
  }, []);


  const handleDragStart = (e: DragEvent<HTMLLIElement>, id: string) => {
    dragItemId.current = id;
    setDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: DragEvent<HTMLLIElement>, id: string) => {
    if (!reorderBricks || dragItemId.current === null || dragItemId.current === id) return;
    reorderBricks(dragItemId.current, id);
  };
  
  const handleDragEnd = (e: DragEvent<HTMLLIElement>) => {
    dragItemId.current = null;
    setDragging(false);
  };

  if (bricks.length === 0 && variant === 'burn') {
    return (
      <div className={cn(
        "text-center py-10 font-code text-muted-foreground border-2 border-dashed rounded-lg",
        "border-amber-900/40 bg-amber-900/10"
      )}>
        <p>// PILE EMPTY. GOOD.</p>
      </div>
    );
  }
  
  const renderPlaceholders = () => {
    if (variant !== 'build' || !maxBricks || !onPlaceholderClick) return null;
    const placeholderCount = maxBricks > bricks.length ? maxBricks - bricks.length : 0;
    
    return Array.from({ length: placeholderCount }).map((_, index) => (
      <BrickPlaceholder 
        key={`placeholder-${index}-${suggestions[index % suggestions.length]}`}
        text={suggestions[index % suggestions.length]}
        onClick={onPlaceholderClick}
      />
    ));
  };


  return (
    <div className={cn(
      isBurnPile && "max-h-[124px] overflow-y-auto pr-1 space-y-2"
    )}>
      <ul 
        onDragOver={(e) => !isBurnPile && e.preventDefault()}
        className="space-y-2"
      >
        {bricks.map((brick) => (
          <BrickItem 
            key={brick.id} 
            brick={brick} 
            completeBrick={completeBrick!} 
            burnBrick={burnBrick}
            readOnly={isBurnPile}
            onDragStart={!isBurnPile ? handleDragStart : undefined}
            onDragEnter={!isBurnPile ? handleDragEnter : undefined}
            onDragEnd={!isBurnPile ? handleDragEnd : undefined}
            isDragging={dragging && dragItemId.current === brick.id}
          />
        ))}
        {renderPlaceholders()}
      </ul>
    </div>
  );
};
