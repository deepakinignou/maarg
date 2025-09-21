"use client"

import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { learningPlanAction, FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ALL_ROLES } from '@/lib/data'
import { Lightbulb, BookOpen, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react'
import type { LearningPathOutput } from '@/ai/flows/learning-path-recommendation';
import { SubmitButton } from './submit-button';

const initialState: FormState<LearningPathOutput> = {
  message: '',
};

export function LearningPlan() {
  const [formState, formAction] = useFormState(learningPlanAction, initialState);
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
                <Lightbulb className="h-6 w-6 text-primary" />
                Skill-Up for Your Dream Career
            </CardTitle>
            <CardDescription>
                Select a career, input your skills, and our AI will create a personalized learning plan to bridge the gap.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                    <Label htmlFor="targetCareer" className="font-semibold">Target Career</Label>
                    <Select name="targetCareer" required>
                        <SelectTrigger id="targetCareer">
                        <SelectValue placeholder="Select a career role..." />
                        </SelectTrigger>
                        <SelectContent>
                        {ALL_ROLES.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="currentSkills" className="font-semibold">Your Current Skills</Label>
                    <Textarea
                        id="currentSkills"
                        name="currentSkills"
                        placeholder="Enter your skills, separated by commas (e.g., JavaScript, React, Leadership)"
                        rows={3}
                        required
                        defaultValue={formState.fields?.currentSkills}
                    />
                </div>
            </div>
            </CardContent>
            <CardFooter>
                <SubmitButton variant="accent">Generate Learning Plan</SubmitButton>
            </CardFooter>
        </form>
      </Card>

      {formState.data && (
        <div ref={resultsRef}>
        <Card className="animate-in fade-in-0 duration-500 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Your Custom Learning Plan</CardTitle>
            <CardDescription>{formState.data.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="font-headline text-xl mb-3 flex items-center gap-2"><AlertCircle className="text-destructive h-5 w-5"/>Essential Skills to Learn</h3>
              {formState.data.skillGaps.filter(s => s.importance === 'essential').length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formState.data.skillGaps.filter(s => s.importance === 'essential').map(skill => <Badge key={skill.skill} variant="destructive" className="text-sm">{skill.skill}</Badge>)}
                </div>
              ) : (
                <p className="text-success-foreground flex items-center gap-2 font-semibold"><CheckCircle2 className="text-success"/>You have all essential skills!</p>
              )}
            </div>

            <div>
              <h3 className="font-headline text-xl mb-3 flex items-center gap-2"><Lightbulb className="text-amber-500 h-5 w-5"/>Good-to-Have Skills</h3>
               {formState.data.skillGaps.filter(s => s.importance === 'good-to-have').length > 0 ? (
                <div className="flex flex-wrap gap-2">
                   {formState.data.skillGaps.filter(s => s.importance === 'good-to-have').map(skill => <Badge key={skill.skill} className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-sm border-amber-200">{skill.skill}</Badge>)}
                </div>
              ) : (
                <p className="text-success-foreground flex items-center gap-2 font-semibold"><CheckCircle2 className="text-success"/>You've got the nice-to-haves covered too!</p>
              )}
            </div>

            {formState.data.learningResources.length > 0 && (
              <div>
                <h3 className="font-headline text-xl mb-4 flex items-center gap-2"><BookOpen className="text-primary h-5 w-5"/>Recommended Learning Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formState.data.learningResources.map((resource, index) => (
                     <a href={resource.url} key={index} target="_blank" rel="noopener noreferrer" className="block group">
                        <Card className="h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                          <CardHeader>
                            <CardTitle className="text-base font-semibold leading-tight flex justify-between items-start">
                                {resource.title}
                                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0"/>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <span>{resource.platform} - <span className="font-semibold">{resource.type}</span></span>
                              <Badge variant="outline">{resource.forSkill}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      )}
    </div>
  )
}
