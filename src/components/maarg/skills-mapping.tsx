"use client";

import { useEffect, useState, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { mapSkillsAction, FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/maarg/submit-button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, BrainCircuit, Lightbulb, Users, BarChart } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import type { ExtractSkillsOutput } from '@/ai/flows/skills-mapping-from-academic-records';


const initialState: FormState<ExtractSkillsOutput> = {
  message: '',
};

const SKILL_CATEGORIES: Record<string, string[]> = {
  "Technical": ["python", "r", "sql", "java", "html", "css", "javascript", "react", "node", "git", "docker", "aws", "gcp", "api", "database", "typescript", "webpack", "next.js", "figma", "adobe"],
  "Analytical": ["statistic", "machine learning", "data visualization", "data analysis", "problem solving", "market research", "research"],
  "Communication": ["communication", "leadership", "teamwork", "public speaking", "collaboration", "presentation"],
  "Creative": ["design", "visual", "wireframing", "prototyping", "ux", "ui"],
  "Management": ["agile", "project management", "scrum", "planning", "organization"],
};

export function SkillsMapping() {
  const [formState, formAction] = useFormState(mapSkillsAction, initialState);
  const { toast } = useToast();
  const [chartData, setChartData] = useState<any[]>([]);
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
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [formState, toast]);
  
  useEffect(() => {
    if(formState.data) {
      const allSkills = [...formState.data.hardSkills, ...formState.data.softSkills];
      const categoryCounts = Object.keys(SKILL_CATEGORIES).reduce((acc, category) => ({ ...acc, [category]: 0 }), {});

      allSkills.forEach(skill => {
        const lowerSkill = skill.toLowerCase();
        for (const category in SKILL_CATEGORIES) {
          if (SKILL_CATEGORIES[category].some(keyword => lowerSkill.includes(keyword))) {
            (categoryCounts as Record<string, number>)[category]++;
            break; 
          }
        }
      });

      const maxCount = Math.max(...Object.values(categoryCounts as Record<string, number>));

      const newChartData = Object.entries(categoryCounts).map(([category, value]) => ({
        category,
        value,
        fullMark: Math.max(5, maxCount),
      }));
      setChartData(newChartData);
    }
  }, [formState.data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="shadow-lg border-white/10 bg-secondary/30">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-2xl">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-blue-400 to-fuchsia-500 text-transparent bg-clip-text">Map Your Skills</span>
          </CardTitle>
          <CardDescription>
            Let our AI analyze your experience to identify your key strengths. Provide details from your academic, professional, or personal projects.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
             <Card className="p-4 bg-background/50 hover:bg-background/70 transition-colors border-white/10">
              <Label htmlFor="academicRecords" className="flex items-center gap-2 font-semibold"><BookOpen className="h-5 w-5 text-primary" />Academic Records, Courses, & Certifications</Label>
              <Textarea
                id="academicRecords"
                name="academicRecords"
                placeholder="e.g., Bachelor of Science in Computer Science, GPA: 3.8. Relevant coursework: Data Structures, Algorithms, AI. Completed 'Google Data Analytics' on Coursera."
                rows={4}
                required
                defaultValue={formState.fields?.academicRecords}
                className="mt-2 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </Card>
             <Card className="p-4 bg-background/50 hover:bg-background/70 transition-colors border-white/10">
              <Label htmlFor="extracurricularActivities" className="flex items-center gap-2 font-semibold"><Users className="h-5 w-5 text-primary" />Extracurricular & Work Experience</Label>
              <Textarea
                id="extracurricularActivities"
                name="extracurricularActivities"
                placeholder="e.g., President of the Coding Club, organized monthly hackathons. Part-time web developer at a local startup."
                rows={3}
                defaultValue={formState.fields?.extracurricularActivities}
                className="mt-2 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </Card>
             <Card className="p-4 bg-background/50 hover:bg-background/70 transition-colors border-white/10">
              <Label htmlFor="projectDescriptions" className="flex items-center gap-2 font-semibold"><Lightbulb className="h-5 w-5 text-primary" />Project Descriptions</Label>
              <Textarea
                id="projectDescriptions"
                name="projectDescriptions"
                placeholder="e.g., Developed a sentiment analysis tool for Twitter data using Python and NLTK. Created a personal portfolio website with React."
                rows={4}
                defaultValue={formState.fields?.projectDescriptions}
                className="mt-2 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </Card>
          </CardContent>
          <CardFooter>
            <SubmitButton variant="accent">Analyze My Skills</SubmitButton>
          </CardFooter>
        </form>
      </Card>

      <div ref={resultsRef} className="sticky top-24">
        <Card className="shadow-md border-white/10 bg-secondary/30">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl">
              <BarChart className="h-6 w-6 text-primary" />
              <span className="bg-gradient-to-r from-blue-400 to-fuchsia-500 text-transparent bg-clip-text">Your Skill Profile</span>
            </CardTitle>
            <CardDescription>
              Here's what we found. This profile highlights your strengths across different areas.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {!formState.data ? (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-16">
                <BrainCircuit className="h-16 w-16 mb-4 opacity-30 animate-pulse" />
                <p>Your skill analysis will appear here once you submit your details.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 animate-in fade-in-0 duration-500">
                <ChartContainer config={{}} className="min-h-[250px] w-full">
                  <RadarChart data={chartData}>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <PolarGrid gridType="polygon" className="stroke-white/20"/>
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={30} domain={[0, chartData[0]?.fullMark || 5]} tick={false} axisLine={false} />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="hsl(var(--accent))"
                      fill="hsl(var(--accent))"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ChartContainer>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg font-headline mb-2">Hard Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {formState.data.hardSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm bg-blue-900/50 text-blue-200 border-blue-400/30 hover:bg-blue-900">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg font-headline mt-4 mb-2">Soft Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {formState.data.softSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm bg-fuchsia-900/50 text-fuchsia-200 border-fuchsia-400/30 hover:bg-fuchsia-900">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
