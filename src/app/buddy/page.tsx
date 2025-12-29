'use client';

import { useState } from 'react';
import { Bot, Sparkles, Send, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getMotivationalFitnessUpdateAction } from './actions';
import { MotivationalFitnessUpdateOutput } from '@/ai/flows/motivational-fitness-updates';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  guidance?: string;
};

export default function BuddyPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await getMotivationalFitnessUpdateAction({
        userMessage: input,
      });
      
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: result.motivationalMessage,
        guidance: result.personalizedGuidance,
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error getting update:', error);
      const errorMessage: ChatMessage = { role: 'assistant', content: "Sorry, I'm having a bit of trouble right now. Let's regroup in a moment!" };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Virtual Gym Buddy</h1>
        <p className="text-muted-foreground">
          Your AI companion for motivation, guidance, and a positive mindset.
        </p>
      </header>
       <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <MessageCircle className="text-primary"/> Chat With Your Buddy
            </CardTitle>
            <CardDescription>
                Tell your buddy how you're feeling or what you're up to.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[50vh] bg-secondary rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
                {messages.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <p>Say something like, "I'm feeling really tired today."</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && <Bot className="w-8 h-8 text-primary flex-shrink-0"/>}
                    <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                        <p className="text-sm italic">"{msg.content}"</p>
                        {msg.guidance && (
                            <div className="mt-3 pt-2 border-t border-accent/50">
                                <h4 className="font-semibold text-xs mb-1">Here's a tip:</h4>
                                <p className="text-sm">{msg.guidance}</p>
                            </div>
                        )}
                    </div>
                     {msg.role === 'user' && <User className="w-8 h-8 text-muted-foreground flex-shrink-0"/>}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                    <Bot className="w-8 h-8 text-primary flex-shrink-0"/>
                    <div className="rounded-lg px-4 py-2 bg-background flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
                    </div>
                    </div>
                )}
            </div>
          </CardContent>
          <CardContent>
             <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a message to your buddy..."
                disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                Send <Send className="ml-2"/>
                </Button>
            </form>
          </CardContent>
        </Card>
    </div>
  );
}
