import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl uppercase tracking-wider text-primary">
            Build, Not Burn
          </DialogTitle>
          <DialogDescription className="font-code text-xs">
            The Sustainable System for Long-Term Creators.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          <div className="space-y-6 font-body text-foreground/90">
            <section>
              <h3 className="font-headline text-xl text-primary mb-2">THE CORE PHILOSOPHY</h3>
              <p>We are taught that exhaustion is a trophy. We are told that if we aren’t suffering, we aren’t succeeding. This is the "Burn" mindset. It treats your energy like a cheap commodity to be used up every single day.</p>
              <p className="mt-2">The "Build" mindset is different. It prioritizes assets over activity. It asks: "What can I do today that will still be valuable a year from now?"</p>
              <p className="mt-2">This is a filtering system designed to protect your most valuable resource: your ability to create.</p>
            </section>
            
            <section>
              <h3 className="font-headline text-xl text-primary mb-2">THE 3-BRICK RULE</h3>
              <p>The biggest mistake high-performers make is overestimating what they can do in a day and underestimating what they can do in a year.</p>
              <p className="mt-2">The Rule: You are allowed to lay only a few Bricks per day, based on your energy. A "Brick" is a task that moves a major project forward. It requires deep focus. If you lay perfect bricks every day, you will build a wall.</p>
               <p className="mt-2">The constraint forces you to prioritize before you start working, not while you are drowning in work.</p>
            </section>
            
            <section>
              <h3 className="font-headline text-xl text-primary mb-2">ARE YOU BUILDING OR BURNING?</h3>
              <p>
                <span className="font-bold text-amber-500">🔥 Burning (The Gravel):</span> These tasks maintain the status quo. They feel productive because they are "busy," but they vanish as soon as you do them. Examples: Answering non-critical emails, Slack scrolling, organizing files, "researching" without output.
              </p>
              <p className="mt-2">
                <span className="font-bold text-primary">🏗️ Building (The Bricks):</span> These tasks compound. They create assets that work for you while you sleep. Examples: Writing code, recording a video, drafting a proposal, automating a manual process.
              </p>
            </section>

            <section>
              <h3 className="font-headline text-xl text-primary mb-2">HOW TO USE THE APP</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li><span className="font-bold">Check Your Energy:</span> Be honest. Your energy determines your capacity. Match your workload to your state.</li>
                <li><span className="font-bold">The Build List:</span> Write down your Bricks. Be specific. "Code the landing page hero section" is a good brick.</li>
                <li><span className="font-bold">The Burn Pile:</span> If a new urgent task appears, move an existing Brick to the Burn Pile to make room. This forces prioritization.</li>
                <li><span className="font-bold">The Firebreak:</span> When your bricks are laid, take a break. A mental firebreak stops work stress from spreading into your personal life. Then decide if you are truly done for the day.</li>
              </ol>
            </section>

             <p className="text-center font-bold text-primary pt-4">"If you don't prioritize your life, someone else will."</p>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
