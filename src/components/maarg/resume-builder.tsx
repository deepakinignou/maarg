"use client";

import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { generateResumePointsAction, FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/maarg/submit-button';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, FileDown, Linkedin, Mail, Phone, Globe, UploadCloud, FileSymlink, StepForward } from 'lucide-react';
import type { GenerateResumeBulletPointsOutput } from '@/ai/flows/smart-resume-bullet-point-generation';

const initialState: FormState<GenerateResumeBulletPointsOutput> = {
  message: '',
};

export function ResumeBuilder() {
  const [formState, formAction] = useFormState(generateResumePointsAction, initialState);
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
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
      <div className="xl:col-span-3 space-y-6">
        <div className="flex flex-col gap-2">
            <CardTitle className="font-headline flex items-center gap-2 text-3xl">
                <Sparkles className="h-8 w-8 text-primary" />
                Smart Resume Builder
            </CardTitle>
            <p className="text-muted-foreground">Step 4 of 6: Generate achievement-oriented bullet points for your resume.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
             <Button variant="outline" className="w-full h-12" disabled><UploadCloud className="mr-2"/> Upload Existing Resume</Button>
             <Button variant="outline" className="w-full h-12" disabled><FileSymlink className="mr-2"/> Import from LinkedIn</Button>
        </div>

        <form action={formAction} className="space-y-6">
          <Card className="shadow-lg bg-card/80">
            <CardHeader>
              <Label htmlFor="experienceDescription" className="font-semibold text-lg">Your Experience</Label>
              <CardDescription>Describe a role or project. Focus on what you did and what the results were.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="experienceDescription"
                name="experienceDescription"
                placeholder="e.g., As a software engineer intern, I was responsible for fixing bugs and developing new features for the company's main web application. I worked with a team of 5 engineers and used React and Node.js."
                rows={6}
                required
                defaultValue={formState.fields?.experienceDescription}
                className="bg-background"
              />
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-card/80">
             <CardHeader>
                <Label htmlFor="jobDescription" className="font-semibold text-lg">Target Job Description</Label>
                <CardDescription>Paste the job description you're applying for to tailor your bullet points.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="jobDescription"
                name="jobDescription"
                placeholder="e.g., We are looking for a frontend developer proficient in React, passionate about creating amazing user experiences..."
                rows={6}
                required
                defaultValue={formState.fields?.jobDescription}
                className="bg-background"
              />
            </CardContent>
          </Card>
           
          <SubmitButton size="lg" className="w-full !text-lg !h-14 font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform">
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Resume Points
          </SubmitButton>
        </form>
      </div>

      <div ref={resultsRef} className="sticky top-8 xl:col-span-2">
        <Card className="shadow-2xl shadow-primary/10">
           <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-xl text-card-foreground">
                Resume Preview
              </CardTitle>
            </div>
            <div className="flex gap-2">
                <Button variant="ghost" size="icon" disabled>
                    <FileDown className="h-5 w-5" />
                    <span className="sr-only">Download PDF</span>
                </Button>
                <Button variant="ghost" size="icon" disabled>
                    <FileDown className="h-5 w-5" />
                     <span className="sr-only">Download Word</span>
                </Button>
            </div>
          </CardHeader>
          <CardContent className="min-h-[600px] rounded-lg p-6 font-sans text-sm leading-relaxed bg-white text-gray-800 shadow-inner-lg">
            {!formState.data ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-400 h-full py-16">
                    <FileText className="h-24 w-24 mb-6 opacity-20" />
                    <p className="font-medium text-gray-500">Your resume preview will appear here once you enter details.</p>
                </div>
            ) : (
                <>
                    <div className="text-center border-b border-gray-200 pb-4 mb-4">
                        <h3 className="font-bold text-3xl tracking-wider font-headline text-gray-900">YOUR NAME</h3>
                        <div className="flex justify-center items-center gap-x-3 gap-y-2 text-xs text-gray-600 mt-3 flex-wrap">
                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-gray-300 hover:bg-gray-100"><Mail className="h-4 w-4 text-gray-600"/></Button>
                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-gray-300 hover:bg-gray-100"><Phone className="h-4 w-4 text-gray-600"/></Button>
                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-gray-300 hover:bg-gray-100"><Linkedin className="h-4 w-4 text-gray-600"/></Button>
                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-gray-300 hover:bg-gray-100"><Globe className="h-4 w-4 text-gray-600"/></Button>
                        </div>
                    </div>
                    
                    <h4 className="font-bold mb-2 uppercase tracking-widest text-primary font-headline">Work Experience</h4>
                    <h5 className="font-semibold text-gray-800">Your Role | Company Name</h5>
                    <p className="text-xs text-gray-500 mb-2">City, State | Start Date - End Date</p>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-gray-700">
                        {formState.data.bulletPoints.map((point, index) => (
                            <li key={index} className="animate-in fade-in-0 duration-500" style={{ animationDelay: `${index * 150}ms` }}>{point}</li>
                        ))}
                    </ul>

                    <h4 className="font-bold mt-6 mb-2 uppercase tracking-widest text-primary font-headline">Education</h4>
                    <h5 className="font-semibold text-gray-800">Your Degree | University Name</h5>
                    <p className="text-xs text-gray-500 mb-2">City, State | Graduation Date</p>
                </>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
