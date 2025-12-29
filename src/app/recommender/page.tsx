
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Map, Building2, Trophy, Zap, Search } from 'lucide-react';
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
import { getGymRecommendationsAction } from './actions';
import { GymRecommenderOutput } from '@/ai/schemas/gym-recommender-schemas';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  goals: z.string().min(3, 'Please describe your goals.'),
  location: z.string().min(2, 'Location is required.'),
  preferences: z.string().optional(),
  history: z.string().optional(),
});

export default function RecommenderPage() {
  const [recommendations, setRecommendations] =
    useState<GymRecommenderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goals: 'Lose weight and build cardio fitness',
      location: 'New York, NY',
      preferences: 'Group classes, yoga',
      history: 'I used to go to a CrossFit gym but found it too intense. Enjoyed a free trial of a yoga class.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await getGymRecommendationsAction(values);
      setRecommendations(result);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const getIcon = (type: 'Gym' | 'Workout Program' | 'Fitness Challenge') => {
    switch (type) {
      case 'Gym':
        return <Building2 className="w-6 h-6 text-primary" />;
      case 'Workout Program':
        return <Zap className="w-6 h-6 text-primary" />;
      case 'Fitness Challenge':
        return <Trophy className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Gym &amp; Planner Recommender
        </h1>
        <p className="text-muted-foreground">
          Find the best gyms, programs, and challenges near you.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-headline">Find Your Fit</CardTitle>
                <CardDescription>
                  Tell us what you're looking for, and we'll find the best options for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Fitness Goals</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Build muscle, improve flexibility" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., City, State or Zip Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferences (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Swimming pool, 24/7 access, yoga" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout History (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe activities you've liked or disliked in the past." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Searching...' : 'Find Recommendations'}
                  <Search className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline">Your Recommendations</CardTitle>
            <CardDescription>
              {recommendations
                ? 'Here are some options we found for you.'
                : 'Your results will appear here.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <Map className="h-8 w-8 animate-pulse text-primary" />
              </div>
            )}
            {recommendations && (
              <div className="space-y-4">
                {recommendations.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-secondary rounded-lg flex items-start gap-4">
                    <div className="flex-shrink-0">{getIcon(rec.type)}</div>
                    <div className="flex-grow">
                      <h3 className="font-semibold">{rec.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{rec.type}</p>
                      <p className="text-sm mt-1">{rec.description}</p>
                      {rec.location && <p className="text-xs text-muted-foreground mt-2">Location: {rec.location}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
