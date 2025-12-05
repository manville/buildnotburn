import { useState, type FC, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BrickFormProps {
  addBrick: (text: string) => void;
}

export const BrickForm: FC<BrickFormProps> = ({ addBrick }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addBrick(text);
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 p-2 bg-card border border-border rounded-lg"
      aria-label="Add new brick"
    >
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ADD A NEW BRICK..."
        className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 font-code placeholder:text-muted-foreground/50 text-base"
        autoComplete="off"
      />
      <Button type="submit" variant="default" size="sm" className="font-bold uppercase">
        <Plus className="h-4 w-4 mr-2" />
        Add
      </Button>
    </form>
  );
};
