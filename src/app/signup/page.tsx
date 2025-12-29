'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Dumbbell } from 'lucide-react';
import { useAuth, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { FirebaseError } from 'firebase/app';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await initiateEmailSignUp(
        auth,
        values.email,
        values.password
      );
      
      if (userCredential && userCredential.user) {
        const userId = userCredential.user.uid;
        const [firstName, ...lastName] = values.fullName.split(' ');
        
        // Create user profile document
        const profileRef = doc(firestore, 'users', userId, 'profile', userId);
        setDocumentNonBlocking(profileRef, {
          id: userId,
          firstName: firstName,
          lastName: lastName.join(' '),
          // Add other profile fields with sensible defaults
          dateOfBirth: '',
          gender: '',
          weightGoal: '',
        }, { merge: true });

        // Create user account document
        const accountRef = doc(firestore, 'users', userId, 'account', userId);
        setDocumentNonBlocking(accountRef, {
          id: userId,
          email: values.email,
          registrationDate: serverTimestamp(),
          profileId: profileRef.id
        }, { merge: true });
      }
      // The redirect is handled by the AppShell component
    } catch (error) {
      console.error(error);
      let message = 'An unknown error occurred.';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            message = 'This email is already in use.';
            break;
          case 'auth/weak-password':
            message = 'The password is too weak.';
            break;
          default:
            message = 'Failed to create account. Please try again.';
            break;
        }
      }
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold font-headline">
              Create an Account
            </CardTitle>
          </div>
          <CardDescription>
            Start your AI-powered fitness journey today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
