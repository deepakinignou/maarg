"use client";

import { useEffect, useState, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { forecastSkillsDemandAction, FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { SubmitButton } from '@/components/maarg/submit-button';
import { ALL_ROLES } from '@/lib/data';
import { LineChart, Sparkles } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { SkillsDemandForecastOutput } from '@/ai/flows/skills-demand-forecasting-for-data-science';

const initialState: FormState<SkillsDemandForecastOutput> = {
  message: '',
};

const mockChartData = [
  { skill: 'AI/ML', demand: 95 },
  { skill: 'Cloud', demand: 90 },
  { skill: 'Cybersecurity', demand: 85 },
  { skill: 'Data Analytics', demand: 82 },
  { skill: 'DevOps', demand: 78 },
];

export function DemandForecasting() {
  const [formState, formAction] = useFormState(forecastSkillsDemandAction, initialState);
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState(3);
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
            <LineChart className="h-6 w-6 text-primary" />
            Skills Demand Forecast
          </CardTitle>
          <CardDescription>
            Look into the future. See which skills are projected to be in high demand for your chosen career path.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role-select" className="font-semibold">Select a Role</Label>
                <Select name="role" required>
                  <SelectTrigger id="role-select">
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
                <Label htmlFor="timeframeYears" className="font-semibold">Select Timeframe: {timeframe} years</Label>
                <Slider
                  id="timeframeYears"
                  name="timeframeYears"
                  min={1}
                  max={10}
                  step={1}
                  value={[timeframe]}
                  onValueChange={(value) => setTimeframe(value[0])}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton variant="accent">Forecast Trends</SubmitButton>
          </CardFooter>
        </form>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start" ref={resultsRef}>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Future Trends Dashboard (Illustrative)</CardTitle>
            <CardDescription>An overview of projected skill demand across tech.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="skill" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltipContent />} cursor={false} />
                  <Bar dataKey="demand" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-xl"><Sparkles className="h-5 w-5 text-accent" />AI-Driven Forecast</CardTitle>
            <CardDescription>Your personalized forecast based on your selection.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center">
            {!formState.data ? (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                <LineChart className="h-12 w-12 mb-4 opacity-50" />
                <p>Your forecast will appear here.</p>
              </div>
            ) : (
               <div className="prose prose-sm dark:prose-invert max-w-none animate-in fade-in-0 duration-500">
                  <p>{formState.data.forecast}</p>
               </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
