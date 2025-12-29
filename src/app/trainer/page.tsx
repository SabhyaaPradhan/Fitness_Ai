'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dumbbell, Bot, BarChart, ChevronRight, Camera, VideoOff, Play, Pause, MessageSquare, Send } from 'lucide-react';
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
import { getPersonalizedWorkoutFeedbackAction, suggestNextExerciseAction } from './actions';
import { PersonalizedWorkoutFeedbackOutput } from '@/ai/flows/personalized-workout-feedback';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';


const liveAnalysisSchema = z.object({
  workoutType: z.string().min(2, 'Workout type is required.'),
  targetMuscleGroups: z.string().min(2, 'Target muscle groups are required.'),
});

function LiveAnalysisTab() {
  const [feedback, setFeedback] = useState<PersonalizedWorkoutFeedbackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof liveAnalysisSchema>>({
    resolver: zodResolver(liveAnalysisSchema),
    defaultValues: {
      workoutType: 'Squat',
      targetMuscleGroups: 'Glutes, Quads, Hamstrings',
    },
  });

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
            variant: "destructive",
            title: "Camera Not Supported",
            description: "Your browser does not support camera access.",
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    return () => {
        if (analysisIntervalRef.current) {
            clearInterval(analysisIntervalRef.current);
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return null;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  }, []);

  const handleFeedback = useCallback(async (feedbackData: PersonalizedWorkoutFeedbackOutput, values: z.infer<typeof liveAnalysisSchema>) => {
    setFeedback(feedbackData);
    if (user && firestore) {
      const recordsRef = collection(firestore, `users/${user.uid}/performance_records`);
      addDocumentNonBlocking(recordsRef, {
        userId: user.uid,
        workoutType: values.workoutType,
        performanceScore: feedbackData.performanceScore,
        createdAt: serverTimestamp(),
      });
    }
  }, [user, firestore]);

  const startAnalysis = useCallback((values: z.infer<typeof liveAnalysisSchema>) => {
    setIsAnalyzing(true);
    setFeedback(null);
    
    analysisIntervalRef.current = setInterval(async () => {
      const photoDataUri = captureFrame();
      if (!photoDataUri) return;

      setIsLoading(true);
      try {
        const result = await getPersonalizedWorkoutFeedbackAction({
          workoutType: values.workoutType,
          targetMuscleGroups: values.targetMuscleGroups,
          photoDataUri: photoDataUri,
        });
        await handleFeedback(result, values);
      } catch (error) {
        console.error('Error getting feedback:', error);
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: 'Could not get feedback from the AI trainer.'
        })
      } finally {
        setIsLoading(false);
      }
    }, 5000);

  }, [captureFrame, toast, handleFeedback]);

  const stopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    setIsLoading(false);
  }, []);

  function onSubmit(values: z.infer<typeof liveAnalysisSchema>) {
    if (isAnalyzing) {
      stopAnalysis();
    } else {
      startAnalysis(values);
    }
  }

  return (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Camera className="w-6 h-6 text-primary"/> Live Workout Analysis</CardTitle>
            <CardDescription>
                Your camera feed is processed locally and frames are sent for analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="relative aspect-video bg-secondary rounded-lg flex items-center justify-center">
                <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
                
                {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-lg p-4">
                        <VideoOff className="w-12 h-12 text-destructive mb-4" />
                        <h3 className="text-lg font-semibold text-white">Camera Access Required</h3>
                        <p className="text-sm text-center text-muted-foreground">Please allow camera access in your browser to use this feature.</p>
                    </div>
                )}
                 {isAnalyzing && (
                    <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        Analyzing
                    </div>
                 )}
             </div>
          </CardContent>
          <CardFooter>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                    <FormField
                      control={form.control}
                      name="workoutType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exercise Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Squats, Push-ups" {...field} disabled={isAnalyzing}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="targetMuscleGroups"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Muscle Groups</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Glutes, Quads, Hamstrings" {...field} disabled={isAnalyzing}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={hasCameraPermission === false || isLoading} className="w-full">
                        {isAnalyzing ? (
                            <>
                                <Pause className="mr-2" /> Stop Analysis
                            </>
                        ) : (
                            <>
                                <Play className="mr-2" /> Start Analysis
                            </>
                        )}
                    </Button>
                </form>
             </Form>
          </CardFooter>
        </Card>

        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline">Personalized Feedback</CardTitle>
            <CardDescription>
              {isAnalyzing ? 'Analysis in progress...' : (feedback ? 'Here is your latest workout analysis.' : 'Feedback will appear here once you start analysis.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(isLoading && isAnalyzing) && (
              <div className="flex items-center justify-center p-8">
                  <Dumbbell className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {feedback && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <BarChart className="mr-2 h-5 w-5 text-primary" /> Performance Score: {feedback.performanceScore}/100
                  </h3>
                  <Progress value={feedback.performanceScore} className="h-3" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Dumbbell className="mr-2 h-5 w-5 text-primary" /> Form Feedback
                  </h3>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                    {feedback.formFeedback}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Dumbbell className="mr-2 h-5 w-5 text-primary" /> Rep & Intensity Feedback
                  </h3>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                    {feedback.repFeedback}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-primary" /> Motivational Message
                  </h3>
                  <p className="text-sm italic text-accent-foreground bg-accent p-3 rounded-md">
                    "{feedback.motivationalMessage}"
                  </p>
                </div>
              </div>
            )}
            {!feedback && !isAnalyzing && !isLoading && (
                <div className="text-center text-muted-foreground p-8">
                    <p>Start an analysis to get real-time feedback on your form.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function WorkoutChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState<string[]>(['Bicep Curls', 'Squats']); // Example history

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await suggestNextExerciseAction({
        userQuery: input,
        previousExercises: workoutHistory,
      });
      const assistantMessage: ChatMessage = { role: 'assistant', content: result.recommendation };
      setMessages(prev => [...prev, assistantMessage]);
      // Maybe add the recommended exercise to history if user confirms? For now, we don't.
    } catch (error) {
      console.error('Error getting suggestion:', error);
      const errorMessage: ChatMessage = { role: 'assistant', content: "Sorry, I couldn't come up with a suggestion right now." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary"/>
          Workout Chat
        </CardTitle>
        <CardDescription>
          Ask the AI trainer for suggestions on what to do next.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 bg-secondary rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Ask something like, "What should I do next?"</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && <Bot className="w-6 h-6 text-primary flex-shrink-0"/>}
              <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-3">
              <Bot className="w-6 h-6 text-primary flex-shrink-0"/>
              <div className="rounded-lg px-4 py-2 bg-background">
                <Dumbbell className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., I want to work on my abs."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              Send <Send className="ml-2"/>
            </Button>
        </form>
      </CardFooter>
    </Card>
  )

}


export default function TrainerPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">AI Trainer</h1>
        <p className="text-muted-foreground">Get real-time feedback and recommendations to perfect your workout form.</p>
      </header>
      
      <Tabs defaultValue="live-analysis">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live-analysis"><Camera className="mr-2"/>Live Analysis</TabsTrigger>
            <TabsTrigger value="workout-chat"><MessageSquare className="mr-2"/>Workout Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="live-analysis" className="mt-6">
            <LiveAnalysisTab />
        </TabsContent>
        <TabsContent value="workout-chat" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <WorkoutChatTab />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
