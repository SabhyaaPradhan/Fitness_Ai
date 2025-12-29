'use client';

import { useEffect, useState, useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, Timestamp } from 'firebase/firestore';
import { format, subDays, startOfDay } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


const chartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--primary))',
  },
};

interface UserAccount {
  id: string;
  email: string;
  registrationDate: Timestamp; 
}


export default function AdminAnalyticsPage() {
  const firestore = useFirestore();

  const accountsQuery = useMemoFirebase(
    () => query(collectionGroup(firestore, 'account')),
    [firestore]
  );
  
  const { data: accounts, isLoading: isLoadingAccounts, error: accountsError } = useCollection<UserAccount>(accountsQuery);

  const monthlySignups = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = monthNames.map(month => ({ month, users: 0 }));

    if (accounts) {
        accounts.forEach(account => {
            if (account.registrationDate && account.registrationDate.toDate) {
                const registrationMonth = account.registrationDate.toDate().getMonth(); // 0-11
                if (monthlyData[registrationMonth]) {
                    monthlyData[registrationMonth].users++;
                }
            }
        });
    }
    return monthlyData;
  }, [accounts]);
  
  const dailySignups = useMemo(() => {
    const dailyData: { day: string; users: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        dailyData.push({ day: format(date, 'EEE'), users: 0 });
    }

    if(accounts) {
        accounts.forEach(account => {
            if (account.registrationDate && account.registrationDate.toDate) {
                const registrationDate = startOfDay(account.registrationDate.toDate());
                for (let i = 0; i < 7; i++) {
                    const checkDate = startOfDay(subDays(today, i));
                    if (registrationDate.getTime() === checkDate.getTime()) {
                        const dayIndex = 6 - i;
                        if(dailyData[dayIndex]) {
                           dailyData[dayIndex].users++;
                        }
                        break; 
                    }
                }
            }
        });
    }
    return dailyData;
  }, [accounts]);


  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Admin Analytics
        </h1>
        <p className="text-muted-foreground">
          An overview of user activity and application growth.
        </p>
      </header>

      {accountsError && (
         <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Analytics</AlertTitle>
          <AlertDescription>
            There was a problem loading user data. This may be due to a missing Firestore index. Please check the browser console or Firebase Emulator logs for an index creation link.
             <pre className="mt-2 text-xs bg-black/20 p-2 rounded-md overflow-x-auto">
              <code>{accountsError.message}</code>
             </pre>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
            <CardTitle className="font-headline">Monthly New Users</CardTitle>
            <CardDescription>
                A look at the number of new user sign-ups per month.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
               {isLoadingAccounts ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer>
                <BarChart data={monthlySignups} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        stroke="hsl(var(--foreground))"
                        fontSize={12}
                    />
                    <YAxis
                        stroke="hsl(var(--foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                        allowDecimals={false}
                    />
                    <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="users" fill="var(--color-users)" radius={4} />
                </BarChart>
                </ResponsiveContainer>
               )}
            </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle className="font-headline">Daily New Users (Last 7 Days)</CardTitle>
            <CardDescription>
                A summary of new user sign-ups over the last week.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                {isLoadingAccounts ? <Skeleton className="h-full w-full" /> : (
                    <ResponsiveContainer>
                    <BarChart data={dailySignups} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--foreground))"
                            fontSize={12}
                        />
                        <YAxis
                            stroke="hsl(var(--foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                            allowDecimals={false}
                        />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="users" fill="var(--color-users)" radius={4} />
                    </BarChart>
                    </ResponsiveContainer>
                )}
            </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
