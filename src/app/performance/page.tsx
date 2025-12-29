'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, orderBy, Timestamp } from 'firebase/firestore';
import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const chartConfig = {
  score: {
    label: 'Performance Score',
    color: 'hsl(var(--primary))',
  },
};

interface PerformanceRecord {
    id: string;
    userId: string;
    workoutType: string;
    performanceScore: number;
    createdAt: Timestamp;
}

export default function PerformancePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const performanceQuery = useMemoFirebase(() => {
    if (!user) return null;
    
    const sevenDaysAgo = subDays(new Date(), 7);

    return query(
      collection(firestore, `users/${user.uid}/performance_records`),
      where('createdAt', '>=', sevenDaysAgo),
      orderBy('createdAt', 'desc'),
      limit(20) // Limit to a reasonable number for the chart
    );
  }, [user, firestore]);

  const { data: records, isLoading, error } = useCollection<PerformanceRecord>(performanceQuery);

  const chartData = useMemo(() => {
    if (!records) return [];

    // Reverse to show oldest first
    const sortedRecords = [...records].reverse();

    return sortedRecords.map(record => ({
      date: format(record.createdAt.toDate(), 'MMM d'),
      score: record.performanceScore,
      workout: record.workoutType
    }));
  }, [records]);


  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Pose-to-Performance Analyzer
        </h1>
        <p className="text-muted-foreground">
          Track your workout performance scores and view your progress over time.
        </p>
      </header>

       {error && (
         <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>
            There was a problem loading your performance history. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Last 7 Days Performance</CardTitle>
          <CardDescription>
            Your performance score is calculated based on form, rep consistency, and motion efficiency from the AI Trainer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            {isLoading ? (
                <Skeleton className="h-full w-full" />
            ) : (
             <ResponsiveContainer>
                {chartData.length > 0 ? (
                    <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <XAxis
                        dataKey="date"
                        stroke="hsl(var(--foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        />
                        <YAxis
                        stroke="hsl(var(--foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                        domain={[0, 100]}
                        />
                        <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent 
                            indicator="dot" 
                            labelKey="date" 
                            formatter={(value, name, props) => {
                                if (name === 'score' && props.payload.workout) {
                                    return (
                                        <>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-semibold">{props.payload.workout}</span>
                                            <span className="text-muted-foreground">Score: {value}</span>
                                        </div>
                                        </>
                                    )
                                }
                                return value;
                            }}
                        />}
                        />
                        <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                    </BarChart>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <p className="text-lg font-semibold text-muted-foreground">No Performance Data Yet</p>
                        <p className="text-sm text-muted-foreground mt-2">Use the AI Trainer to analyze your workouts and your scores will appear here.</p>
                    </div>
                )}
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
