'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Zap, Bot, ChevronsRight, Timer, ArrowUp, ArrowDown, Heart, Weight, Hourglass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getSmartAssistantFeedbackAction } from './actions';
import { SmartAssistantOutput } from '@/ai/flows/smart-assistant-flow';
import { Textarea } from '@/components/ui/textarea';


const formSchema = z.object({
  workoutType: z.string().min(2, 'Workout type is required.'),
  currentSet: z.coerce.number().min(1, 'Set number must be at least 1.'),
  repCount: z.coerce.number().min(1, 'Rep count must be at least 1.'),
  heartRate: z.coerce.number().optional(),
  timeUnderTension: z.coerce.number().optional(),
  weightLifted: z.string().optional(),
  perceivedExertion: z.string().min(3, 'Please describe your exertion level.'),
});

export default function AssistantPage() {
  const [feedback, setFeedback] = useState<SmartAssistantOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workoutType: 'Bench Press',
      currentSet: 1,
      repCount: 8,
      heartRate: 135,
      timeUnderTension: 32,
      weightLifted: '150 lbs',
      perceivedExertion: 'Felt challenging, but the last rep was solid.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFeedback(null);
    try {
      const result = await getSmartAssistantFeedbackAction(values);
      setFeedback(result);
    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setIsLoading(false);
    }
    form.setValue('currentSet', values.currentSet + 1);
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Smart Gym Assistant</h1>
        <p className="text-muted-foreground">
          Simulating an IoT-powered workout with real-time intensity and rest guidance.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-headline">Your Current Set</CardTitle>
                <CardDescription>
                  Enter your performance for the set you just completed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="workoutType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bench Press" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentSet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Set Number</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reps Completed</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <h3 className="text-sm font-medium text-muted-foreground pt-4 border-t">Simulated Sensor Data</h3>
                 <div className="grid grid-cols-3 gap-4">
                     <FormField
                        control={form.control}
                        name="heartRate"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1"><Heart className="w-4 h-4"/> Heart Rate</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="135" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="timeUnderTension"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1"><Hourglass className="w-4 h-4"/> Tension (s)</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="32" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="weightLifted"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1"><Weight className="w-4 h-4"/> Weight</FormLabel>
                            <FormControl>
                            <Input placeholder="150 lbs" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                 </div>
                <FormField
                  control={form.control}
                  name="perceivedExertion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How did that feel? (Perceived Exertion)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Easy, challenging, very hard" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Analyzing...' : 'Finish Set & Get Guidance'}
                  {!isLoading && <ChevronsRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Bot className="text-primary"/> Real-time Guidance
            </CardTitle>
            <CardDescription>
              {feedback
                ? "Here's the recommendation for your next set."
                : 'Your guidance will appear here after you complete a set.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <Zap className="h-8 w-8 animate-pulse text-primary" />
              </div>
            )}
            {feedback && (
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center text-sm text-muted-foreground">
                        Intensity Recommendation
                    </h3>
                    <p className="text-base font-medium">
                        {feedback.intensityRecommendation.includes('ncrease') ? <ArrowUp className="inline-block mr-2 h-5 w-5 text-green-500"/> : feedback.intensityRecommendation.includes('ecrease') || feedback.intensityRecommendation.includes('educe') ? <ArrowDown className="inline-block mr-2 h-5 w-5 text-red-500"/> : null}
                        {feedback.intensityRecommendation}
                    </p>
                </div>
                 <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center text-sm text-muted-foreground">
                        <Timer className="mr-2 h-5 w-5"/> Suggested Rest
                    </h3>
                    <p className="text-base font-medium">
                        {feedback.restSuggestion}
                    </p>
                </div>
                 <div className="p-4 bg-accent rounded-lg">
                    <p className="text-base font-medium text-accent-foreground italic">
                        "{feedback.motivationalNudge}"
                    </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
