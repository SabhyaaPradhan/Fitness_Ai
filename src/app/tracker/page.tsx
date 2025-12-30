'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Repeat,
  Lightbulb,
  CalendarCog,
  AlertTriangle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { predictWorkoutSkippingAction } from './actions';
import { PredictWorkoutSkippingOutput } from '@/ai/flows/predict-workout-skipping';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  behavioralData: z.string().min(10, 'Please provide more detail.'),
  currentMotivationLevel: z.enum(['high', 'medium', 'low']),
  schedule: z.string().min(5, 'Please describe your schedule.'),
});

export default function TrackerPage() {
  const [prediction, setPrediction] =
    useState<PredictWorkoutSkippingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      behavioralData: 'Usually works out 3 times a week, but missed the last session due to work.',
      currentMotivationLevel: 'medium',
      schedule: 'Scheduled to workout today at 6 PM.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPrediction(null);
    try {
      const input = {
        behavioral_data: values.behavioralData,
        current_motivation_level: values.currentMotivationLevel,
        schedule: values.schedule,
      };
      const result = await predictWorkoutSkippingAction(input);
      setPrediction(result);
    } catch (error) {
      console.error('Error getting prediction:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">AI Fitness Habit Tracker</h1>
        <p className="text-muted-foreground">
          Predict if you might skip a workout and get motivational nudges to stay consistent.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-headline">Analyze My Habits</CardTitle>
                <CardDescription>
                  Input your data to predict your adherence to your workout schedule.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="behavioralData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Habits & History</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your recent workout patterns..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentMotivationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Motivation Level</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How motivated are you feeling?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upcoming Workout Schedule</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Leg day today at 6 PM, Cardio tomorrow morning." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Analyzing...' : 'Predict Adherence'}
                  {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline">Prediction Result</CardTitle>
             <CardDescription>
              {prediction
                ? 'Here is your adherence analysis.'
                : 'Your prediction will appear here.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <Repeat className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {prediction && (
              <div className="space-y-6">
                <Alert variant={prediction.skipPrediction ? 'destructive' : 'default'}>
                  {prediction.skipPrediction ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  <AlertTitle className="font-headline">
                    {prediction.skipPrediction ? 'High Risk of Skipping' : 'Likely to Work Out'}
                  </AlertTitle>
                  <AlertDescription>
                    {prediction.skipPrediction
                      ? "Our analysis suggests you might skip your next workout."
                      : "You're on track to complete your next scheduled workout. Keep it up!"
                    }
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-primary" /> Motivational Nudge
                  </h3>
                  <p className="text-sm text-secondary-foreground italic">
                    "{prediction.motivationNudge}"
                  </p>
                </div>
                
                {prediction.adjustedScheduleSuggestion && (
                  <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <CalendarCog className="mr-2 h-5 w-5 text-primary" /> Adjusted Schedule Suggestion
                    </h3>
                    <p className="text-sm text-secondary-foreground">
                      {prediction.adjustedScheduleSuggestion}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
