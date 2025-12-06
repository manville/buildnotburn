import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface BrickPlaceholderProps {
    text: string;
    onClick: (text: string) => void;
}

export const BrickPlaceholder: React.FC<BrickPlaceholderProps> = ({ text, onClick }) => {
    return (
        <li>
            <button
                onClick={() => onClick(text)}
                className={cn(
                    "group w-full bg-card/20 border-2 border-dashed border-border/50 rounded-lg p-3 flex justify-start items-center h-[58px] text-left transition-colors hover:bg-card/40 hover:border-primary/50"
                )}
                aria-label={`Add suggested brick: ${text}`}
            >
                <Plus className="h-4 w-4 text-primary/50 mr-3 transition-colors group-hover:text-primary" />
                <span className="font-code text-sm text-muted-foreground/60 transition-colors group-hover:text-foreground">
                    {text}
                </span>
            </button>
        </li>
    );
};
