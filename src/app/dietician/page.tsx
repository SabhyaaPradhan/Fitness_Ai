'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Salad, ChefHat, ShoppingCart, Info, ChevronRight, Search, Database } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { recommendDietPlanAction } from './actions';
import { DietPlanOutput } from '@/ai/flows/diet-plan-recommendations';
import { FoodNutritionOutput } from '@/ai/flows/food-nutrition-flow';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  bmi: z.coerce.number().min(10, 'BMI seems too low.').max(50, 'BMI seems too high.'),
  weightGoal: z.enum(['lose weight', 'maintain weight', 'gain weight']),
  dietaryPreferences: z.string().min(2, 'Dietary preferences are required.'),
  userHistory: z.string().optional(),
});

function DietPlanTab() {
  const [plan, setPlan] = useState<DietPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bmi: 22.5,
      weightGoal: 'maintain weight',
      dietaryPreferences: 'None',
      userHistory: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPlan(null);
    try {
      const input = {
        bmi: values.bmi,
        weight_goal: values.weightGoal,
        dietary_preferences: values.dietaryPreferences,
        user_history: values.userHistory,
      };
      const result = await recommendDietPlanAction(input);
      setPlan(result);
    } catch (error) {
      console.error("Error getting diet plan:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Your Details</CardTitle>
              <CardDescription>
                Provide your information to generate a custom diet plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="bmi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Mass Index (BMI)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weightGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight Goal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your weight goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lose weight">Lose Weight</SelectItem>
                        <SelectItem value="maintain weight">Maintain Weight</SelectItem>
                        <SelectItem value="gain weight">Gain Weight</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dietaryPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Preferences</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Vegetarian, Gluten-free" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diet History (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any previous diets, allergies, or foods you dislike." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Generating Plan...' : 'Generate Diet Plan'}
                {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card className="sticky top-20">
        <CardHeader>
          <CardTitle className="font-headline">Your Personalized Diet Plan</CardTitle>
          <CardDescription>
            {plan
              ? 'Your custom plan is ready. See tabs below for details.'
              : 'Your plan will be shown here once generated.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Salad className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {plan && (
            <Tabs defaultValue="plan" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="plan"><ChefHat className="w-4 h-4 mr-2" />Plan</TabsTrigger>
                <TabsTrigger value="grocery"><ShoppingCart className="w-4 h-4 mr-2"/>Grocery List</TabsTrigger>
                <TabsTrigger value="nutrition"><Info className="w-4 h-4 mr-2"/>Nutrition</TabsTrigger>
              </TabsList>
              <TabsContent value="plan" className="mt-4 p-4 bg-secondary rounded-md max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-secondary-foreground">{plan.diet_plan}</pre>
              </TabsContent>
              <TabsContent value="grocery" className="mt-4 p-4 bg-secondary rounded-md max-h-96 overflow-y-auto">
                 <pre className="whitespace-pre-wrap text-sm text-secondary-foreground">{plan.grocery_list}</pre>
              </TabsContent>
              <TabsContent value="nutrition" className="mt-4 p-4 bg-secondary rounded-md max-h-96 overflow-y-auto">
                 <pre className="whitespace-pre-wrap text-sm text-secondary-foreground">{plan.nutritional_information}</pre>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


const foodDbSchema = z.object({
  foodName: z.string().min(2, 'Please enter a food name.'),
});

function FoodDatabaseTab() {
  const [foodData, setFoodData] = useState<FoodNutritionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof foodDbSchema>>({
    resolver: zodResolver(foodDbSchema),
    defaultValues: {
      foodName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof foodDbSchema>) {
    setIsLoading(true);
    setFoodData(null);
    try {
      const response = await fetch("http://localhost:10001/api/food-nutrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ food_name: values.foodName }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch food nutrition data");
      }

      const result = await response.json();
      setFoodData(result);
    } catch (error) {
      console.error("Error getting food nutrition:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-headline">Search Food</CardTitle>
                <CardDescription>
                  Look up nutritional information for any food item.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="foodName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Apple, Grilled Chicken Breast" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Searching...' : 'Get Nutrition Info'}
                  <Search className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline">Nutritional Information</CardTitle>
            <CardDescription>
              {foodData ? `Details for ${foodData.foodName}.` : 'Results will appear here.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <Salad className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {foodData && (
              <div className="space-y-4">
                <div className="flex justify-between items-baseline p-3 bg-secondary rounded-lg">
                    <span className="text-sm font-medium text-secondary-foreground">Calories</span>
                    <span className="font-bold text-lg">{foodData.calories}</span>
                </div>
                <div className="flex justify-between items-baseline p-3 bg-secondary rounded-lg">
                    <span className="text-sm font-medium text-secondary-foreground">Protein</span>
                    <span className="font-bold text-lg">{foodData.protein}</span>
                </div>
                <div className="flex justify-between items-baseline p-3 bg-secondary rounded-lg">
                    <span className="text-sm font-medium text-secondary-foreground">Carbohydrates</span>
                    <span className="font-bold text-lg">{foodData.carbs}</span>
                </div>
                <div className="flex justify-between items-baseline p-3 bg-secondary rounded-lg">
                    <span className="text-sm font-medium text-secondary-foreground">Fats</span>
                    <span className="font-bold text-lg">{foodData.fats}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}


export default function DieticianPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">AI Dietician</h1>
        <p className="text-muted-foreground">
          Get personalized diet plans, grocery lists, and nutritional info tailored to your goals.
        </p>
      </header>
       <Tabs defaultValue="diet-plan">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="diet-plan"><ChefHat className="mr-2"/>Diet Plan Generator</TabsTrigger>
            <TabsTrigger value="food-database"><Database className="mr-2"/>Food Database</TabsTrigger>
        </TabsList>
        <TabsContent value="diet-plan" className="mt-6">
          <DietPlanTab />
        </TabsContent>
        <TabsContent value="food-database" className="mt-6">
          <FoodDatabaseTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
