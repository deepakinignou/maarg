"use client";

import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { recommendCareerPathsAction, FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/maarg/submit-button';
import { Compass, Lightbulb, User, Briefcase } from 'lucide-react';
import type { CareerPathRecommendationsOutput } from '@/ai/flows/career-path-recommendations-based-on-skills';

const initialState: FormState<CareerPathRecommendationsOutput> = {
  message: '',
};

export function CareerPath() {
  const [formState, formAction] = useFormState(recommendCareerPathsAction, initialState);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formState.message && !formState.data) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: formState.message + (formState.issues ? `\n- ${formState.issues.join('\n- ')}` : ''),
      });
    }
    if (formState.data) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [formState, toast]);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-2xl">
            <Compass className="h-6 w-6 text-primary" />
            Discover Your Career Path
          </CardTitle>
          <CardDescription>
            Tell us about your skills, interests, and what you're good at. Our AI will suggest potential career paths tailored for you.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <Label htmlFor="skills" className="flex items-center gap-2 font-semibold"><Lightbulb className="h-5 w-5 text-primary" />Your Skills</Label>
                <Textarea
                  id="skills"
                  name="skills"
                  placeholder="e.g., Python, Data Analysis, Public Speaking, Project Management"
                  rows={4}
                  required
                  defaultValue={formState.fields?.skills}
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="space-y-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <Label htmlFor="interests" className="flex items-center gap-2 font-semibold"><User className="h-5 w-5 text-primary" />Your Interests</Label>
                <Textarea
                  id="interests"
                  name="interests"
                  placeholder="e.g., I enjoy solving puzzles, building things, reading about new technology, and working in teams."
                  rows={4}
                  required
                  defaultValue={formState.fields?.interests}
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="space-y-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <Label htmlFor="aptitude" className="flex items-center gap-2 font-semibold"><Briefcase className="h-5 w-5 text-primary" />Your Aptitude</Label>
                <Textarea
                  id="aptitude"
                  name="aptitude"
                  placeholder="e.g., I'm a quick learner, good at logical reasoning, and have a knack for explaining complex topics simply."
                  rows={4}
                  required
                  defaultValue={formState.fields?.aptitude}
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton variant="accent">Recommend Career Paths</SubmitButton>
          </CardFooter>
        </form>
      </Card>
      
      {formState.data && (
        <div ref={resultsRef}>
          <Card className="bg-card/50 shadow-md animate-in fade-in-0 duration-500">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Your Recommended Career Compass</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base text-muted-foreground">{formState.data.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formState.data.careerPaths.map((path, index) => (
                  <div key={index} className="animate-in fade-in-0 zoom-in-95 duration-500" style={{ animationDelay: `${index * 100}ms`}}>
                    <Card className="h-full hover:shadow-lg transition-shadow bg-background/70">
                      <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-3 text-xl">
                          <Briefcase className="h-5 w-5 text-primary" />
                          {path}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
