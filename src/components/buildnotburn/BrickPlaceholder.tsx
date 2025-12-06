import { cn } from "@/lib/utils";

export const BrickPlaceholder = () => {
    return (
        <li
            className={cn(
                "group bg-card/20 border-2 border-dashed border-border/50 rounded-lg p-3 flex justify-center items-center h-[58px]",
            )}
            aria-hidden="true"
        >
            <span className="font-code text-xs text-muted-foreground/50">
                // EMPTY BRICK SLOT
            </span>
        </li>
    );
};
