
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Flame, GanttChart, Brick, Building } from "lucide-react";
import { Separator } from "../ui/separator";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickGuideItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex gap-4 items-start">
        <div className="text-primary mt-1">{icon}</div>
        <div>
            <h4 className="font-bold font-code uppercase">{title}</h4>
            <p className="text-sm text-foreground/80">{description}</p>
        </div>
    </div>
)


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
                <h3 className="font-headline text-xl text-primary mb-3">SYSTEM OVERVIEW</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <QuickGuideItem icon={<Building className="h-5 w-5"/>} title="Build List" description="Your priority tasks for today. Limited by your daily energy audit." />
                    <QuickGuideItem icon={<Flame className="h-5 w-5"/>} title="Burn Pile" description="Tasks that are de-prioritized. Move a brick here to make room for something new." />
                    <QuickGuideItem icon={<Check className="h-5 w-5"/>} title="Complete Brick" description="Marks a task as done and adds it to your permanent wall." />
                    <QuickGuideItem icon={<GanttChart className="h-5 w-5"/>} title="The Wall" description="Your visual history of completed work. Proof of your consistent effort." />
                </div>
            </section>

            <Separator />

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

             <p className="text-center font-bold text-primary pt-4">"If you don't prioritize your life, someone else will."</p>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

    