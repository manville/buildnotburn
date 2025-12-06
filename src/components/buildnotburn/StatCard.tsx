
import type { FC, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: ReactNode;
}

export const StatCard: FC<StatCardProps> = ({ title, value, description, icon }) => {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase font-code tracking-wider text-muted-foreground">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-4xl font-bold font-headline">{value}</div>
            <p className="text-xs text-muted-foreground pt-1">{description}</p>
        </CardContent>
    </Card>
  );
};
