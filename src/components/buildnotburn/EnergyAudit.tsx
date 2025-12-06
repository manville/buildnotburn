"use client";

import { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { AuditAnswers } from '@/types';

interface EnergyAuditProps {
    onSubmit: (answers: AuditAnswers) => void;
}

const auditQuestions = [
    {
        id: 'sleep',
        label: 'How much sleep did you get?',
        options: [
            { label: '8+ Hours (High Energy)', value: 1 },
            { label: '6-7 Hours (Medium Energy)', value: 2 },
            { label: '<6 Hours (Low Energy)', value: 3 },
        ],
    },
    {
        id: 'meetings',
        label: 'How many meetings today?',
        options: [
            { label: '0-1 (High Energy)', value: 1 },
            { label: '2-3 (Medium Energy)', value: 2 },
            { label: '4+ (Low Energy)', value: 3 },
        ],
    },
    {
        id: 'dread',
        label: 'What is your project dread level?',
        options: [
            { label: 'Low (High Energy)', value: 1 },
            { label: 'Medium (Medium Energy)', value: 2 },
            { label: 'High (Low Energy)', value: 3 },
        ],
    },
] as const;


export const EnergyAudit: FC<EnergyAuditProps> = ({ onSubmit }) => {
    const [answers, setAnswers] = useState<AuditAnswers>({
        sleep: 1,
        meetings: 1,
        dread: 1,
    });

    const handleValueChange = (questionId: keyof AuditAnswers, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(answers);
    };

    return (
        <Card className="max-w-xl mx-auto my-8 border-primary/50">
            <CardHeader>
                <CardTitle className="font-headline text-3xl uppercase text-primary">Energy Audit</CardTitle>
                <CardDescription className="font-code">Determine your daily capacity before building.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    {auditQuestions.map(q => (
                        <div key={q.id}>
                            <Label className="text-lg font-headline font-bold">{q.label}</Label>
                            <RadioGroup
                                value={answers[q.id].toString()}
                                onValueChange={(value) => handleValueChange(q.id, value)}
                                className="mt-2 space-y-1 font-code"
                            >
                                {q.options.map(opt => (
                                    <div key={opt.value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={opt.value.toString()} id={`${q.id}-${opt.value}`} />
                                        <Label htmlFor={`${q.id}-${opt.value}`}>{opt.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full font-bold uppercase">
                        Unlock Today's Bricks
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};