import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart,
  Bot,
  Dumbbell,
  Map,
  Repeat,
  Salad,
  Zap,
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
import { PlaceHolderImages } from '@/lib/placeholder-images';

const featureCards = [
  {
    title: 'AI Trainer',
    description:
      'Get feedback on your workout form, rep consistency, and performance.',
    href: '/trainer',
    icon: Dumbbell,
    image: PlaceHolderImages.find((img) => img.id === 'trainer-card'),
  },
  {
    title: 'Smart Gym Assistant',
    description:
      'Simulates an IoT-integrated workout with real-time intensity and rest recommendations.',
    href: '/assistant',
    icon: Zap,
    image: PlaceHolderImages.find((img) => img.id === 'assistant-card'),
  },
  {
    title: 'AI Dietician',
    description:
      'Get personalized diet plans, grocery lists, and nutritional tracking.',
    href: '/dietician',
    icon: Salad,
    image: PlaceHolderImages.find((img) => img.id === 'dietician-card'),
  },
  {
    title: 'Virtual Gym Buddy',
    description:
      'Your AI companion for motivation, guidance, and emotional support.',
    href: '/buddy',
    icon: Bot,
    image: PlaceHolderImages.find((img) => img.id === 'buddy-card'),
  },
  {
    title: 'AI Habit Tracker',
    description:
      'Predicts workout skipping and provides motivational nudges to stay on track.',
    href: '/tracker',
    icon: Repeat,
    image: PlaceHolderImages.find((img) => img.id === 'tracker-card'),
  },
  {
    title: 'Performance Analyzer',
    description: 'View weekly progress reports and get a score on your workout efficiency.',
    href: '/performance',
    icon: BarChart,
    image: PlaceHolderImages.find((img) => img.id === 'performance-card'),
  },
  {
    title: 'Gym Recommender',
    description: 'Suggests nearby gyms and workout programs based on your goals and location.',
    href: '/recommender',
    icon: Map,
    image: PlaceHolderImages.find((img) => img.id === 'recommender-card'),
  },
];

export default function DashboardPage() {
  const heroImage = PlaceHolderImages.find(
    (img) => img.id === 'hero-dashboard'
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-white shadow-lg">
            Welcome to Trivion Technology
          </h1>
          <p className="mt-2 text-lg md:text-xl text-white/90 max-w-2xl">
            Your all-in-one AI ecosystem to understand, adapt, and enhance your
            fitness journey.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((feature) => (
          <Card
            key={feature.title}
            className="flex flex-col hover:shadow-lg transition-shadow"
          >
            {feature.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={feature.image.imageUrl}
                  alt={feature.image.description}
                  fill
                  className="object-cover rounded-t-lg"
                  data-ai-hint={feature.image.imageHint}
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <feature.icon className="w-6 h-6 text-primary" />
                {feature.title}
              </CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow" />
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={feature.href}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
