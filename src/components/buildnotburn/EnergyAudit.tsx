"use client";

import { useState, useMemo, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { BatteryFull, BatteryMedium, BatteryLow, BatteryWarning } from 'lucide-react';
import { cn } from '@/lib/utils';


const MAX_BRICKS_HIGH = 3;
const MAX_BRICKS_MEDIUM = 2;
const MAX_BRICKS_LOW = 1;

interface EnergyAuditProps {
    onSubmit: (maxBricks: number) => void;
}

const auditQuestions = [
    {
        id: 'sleep',
        label: '1. HOURS OF SLEEP LAST NIGHT?',
        min: 0,
        max: 12,
        step: 0.5,
    },
    {
        id: 'meetings',
        label: '2. MEETING COUNT TODAY?',
        min: 0,
        max: 10,
        step: 1,
    },
    {
        id: 'dread',
        label: '3. DREAD LEVEL (1 = EXCITED, 10 = DREADING IT)',
        min: 1,
        max: 10,
        step: 1,
    },
] as const;


export const EnergyAudit: FC<EnergyAuditProps> = ({ onSubmit }) => {
    const [answers, setAnswers] = useState({
        sleep: 8,
        meetings: 2,
        dread: 3,
    });

    const handleValueChange = (questionId: keyof typeof answers, value: number[]) => {
        setAnswers(prev => ({ ...prev, [questionId]: value[0] }));
    };

    const suggestedBricks = useMemo(() => {
        const { sleep, meetings, dread } = answers;
        // Invert dread score so high dread = low score
        const dreadScore = 11 - dread; 
        
        // Normalize scores to a 0-10 scale
        const sleepScore = (sleep / 12) * 10;
        const meetingScore = 10 - meetings;

        const totalScore = (sleepScore + meetingScore + dreadScore) / 3;

        if (totalScore > 7) return MAX_BRICKS_HIGH;
        if (totalScore > 4) return MAX_BRICKS_MEDIUM;
        return MAX_BRICKS_LOW;
    }, [answers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(suggestedBricks);
    };

    const EnergyIcon = () => {
        switch (suggestedBricks) {
            case MAX_BRICKS_HIGH: return <BatteryFull className="h-8 w-8 text-green-500" />;
            case MAX_BRICKS_MEDIUM: return <BatteryMedium className="h-8 w-8 text-yellow-500" />;
            case MAX_BRICKS_LOW: return <BatteryLow className="h-8 w-8 text-red-500" />;
            default: return <BatteryWarning className="h-8 w-8 text-gray-500" />;
        }
    }

    return (
        <Card className="max-w-xl mx-auto my-8 border-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-3xl uppercase tracking-wider">Energy Audit</CardTitle>
                <CardDescription className="font-code text-xs">V1.0 // DIAGNOSTIC TOOL</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-8 px-8 pt-4">
                    {auditQuestions.map(q => (
                        <div key={q.id}>
                            <Label className="text-sm font-bold font-code tracking-widest">{q.label}</Label>
                            <div className="flex items-center gap-4 mt-2">
                                <Slider
                                    value={[answers[q.id]]}
                                    onValueChange={(value) => handleValueChange(q.id, value)}
                                    min={q.min}
                                    max={q.max}
                                    step={q.step}
                                />
                                <span className="font-code text-primary font-bold text-2xl w-10 text-right">{answers[q.id]}</span>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-center gap-4 pt-4 text-center">
                        <EnergyIcon />
                        <div>
                             <p className="font-code text-sm text-muted-foreground">SUGGESTED DAILY CAPACITY</p>
                             <p className="font-headline text-2xl tracking-wider">{suggestedBricks} BRICK{suggestedBricks !== 1 && 'S'}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="px-8 pb-8">
                    <Button type="submit" className="w-full font-bold uppercase h-12 text-base bg-foreground text-background hover:bg-foreground/80">
                        Run Diagnostics
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};
