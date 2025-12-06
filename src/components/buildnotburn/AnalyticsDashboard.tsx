
'use client';
import type { FC } from 'react';
import { StatCard } from './StatCard';
import { ProductivityChart } from './ProductivityChart';
import type { AnalyticsData } from '@/lib/analytics';
import { Flame, GanttChart, TrendingUp, Zap } from 'lucide-react';

interface AnalyticsDashboardProps {
    analytics: AnalyticsData;
}

export const AnalyticsDashboard: FC<AnalyticsDashboardProps> = ({ analytics }) => {
    const { longestStreak, totalBricks, weeklyBuildBurn, dailyProductivity } = analytics;

    const buildBurnRatio = weeklyBuildBurn.built > 0 
        ? (weeklyBuildBurn.built / (weeklyBuildBurn.built + weeklyBuildBurn.burned)) * 100 
        : 0;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Longest Streak"
                    value={`${longestStreak} Days`}
                    icon={<TrendingUp className="h-6 w-6 text-primary" />}
                    description="Consecutive days you laid a brick."
                />
                <StatCard 
                    title="Total Bricks Laid"
                    value={totalBricks.toLocaleString()}
                    icon={<GanttChart className="h-6 w-6 text-green-500" />}
                    description="All completed bricks in your wall."
                />
                <StatCard 
                    title="Weekly Focus"
                    value={`${buildBurnRatio.toFixed(0)}%`}
                    icon={<Zap className="h-6 w-6 text-yellow-500" />}
                    description={`${weeklyBuildBurn.built} built vs. ${weeklyBuildBurn.burned} in progress.`}
                />
                <StatCard 
                    title="Burn Pile"
                    value={weeklyBuildBurn.burned.toLocaleString()}
                    icon={<Flame className="h-6 w-6 text-red-500" />}
                    description="Incomplete tasks from the last 7 days."
                />
            </div>

            <ProductivityChart data={dailyProductivity} />
            
        </div>
    );
}
