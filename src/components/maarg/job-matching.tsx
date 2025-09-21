"use client";

import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { findJobsAction, FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/maarg/submit-button';
import { Badge } from '@/components/ui/badge';
import { Search, Briefcase, Building, MapPin, CheckCircle2, ExternalLink } from 'lucide-react';
import type { JobMatchingOutput } from '@/ai/schemas/job-matching-schemas';

const initialState: FormState<JobMatchingOutput> = {
  message: '',
};

export function JobMatching() {
  const [formState, formAction] = useFormState(findJobsAction, initialState);
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
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl">
              <Search className="h-6 w-6 text-primary" />
              AI Job Matchmaker
            </CardTitle>
            <CardDescription>
              Enter your skills, and our AI will find job openings that are a perfect fit for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="skills" className="font-semibold">Your Skills</Label>
              <Textarea
                id="skills"
                name="skills"
                placeholder="e.g., TypeScript, Next.js, Tailwind CSS, SQL, Communication"
                rows={3}
                required
                defaultValue={formState.fields?.skills}
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton variant="accent">Find My Dream Job</SubmitButton>
          </CardFooter>
        </form>
      </Card>

      {formState.data && (
        <div ref={resultsRef} className="space-y-6">
          <div className="text-center">
              <h2 className="text-2xl font-bold font-headline">AI-Curated Opportunities</h2>
              <p className="text-muted-foreground">{formState.data.summary}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formState.data.jobs.map((job, index) => (
              <div key={index} className="animate-in fade-in-0 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
              <a href={job.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
                <Card className="h-full bg-card/60 hover:border-primary transition-all group-hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-start justify-between">
                      {job.title}
                       <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                        <span className="flex items-center gap-1.5"><Building className="h-4 w-4"/>{job.company}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4"/>{job.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                    <div>
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-success"/>Matching Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {job.matchingSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
