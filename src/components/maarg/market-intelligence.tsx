"use client";

import { useEffect, useRef, useMemo } from 'react';
import { useFormState } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { analyzeMarketAction, FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubmitButton } from '@/components/maarg/submit-button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Building, MapPin, DollarSign, BrainCircuit, BarChart } from 'lucide-react';
import { ALL_ROLES } from '@/lib/data';
import type { MarketIntelligenceOutput } from '@/ai/flows/market-intelligence-flow';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const initialState: FormState<MarketIntelligenceOutput> = {
  message: '',
};

const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 0 }).format(value);
}

export function MarketIntelligence() {
  const [formState, formAction] = useFormState(analyzeMarketAction, initialState);
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

  const salaryChartData = useMemo(() => {
    if (!formState.data?.salaryData) return [];
    const { entryLevel, midLevel, seniorLevel } = formState.data.salaryData;
    return [
        { name: 'Entry-Level', salary: entryLevel },
        { name: 'Mid-Level', salary: midLevel },
        { name: 'Senior-Level', salary: seniorLevel },
    ]
  }, [formState.data?.salaryData]);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6 text-primary" />
              Market Intelligence Engine
            </CardTitle>
            <CardDescription>
              Get a real-time analysis of the job market for any role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm space-y-2">
                <Label htmlFor="role-select" className="font-semibold">Select a Role to Analyze</Label>
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
          </CardContent>
          <CardFooter>
            <SubmitButton variant="accent">Analyze Job Market</SubmitButton>
          </CardFooter>
        </form>
      </Card>

      {formState.data && (
        <div ref={resultsRef} className="space-y-8 animate-in fade-in-0 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Market Outlook</CardTitle>
                    <CardDescription>An AI-powered summary of the current landscape for this role.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{formState.data.analysisSummary}</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2 text-xl"><DollarSign className="h-5 w-5 text-primary"/>Salary Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={{}} className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height={250}>
                                <RechartsBarChart data={salaryChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip 
                                    content={<ChartTooltipContent />} 
                                    cursor={{fill: 'hsl(var(--muted))'}}
                                    formatter={(value) => formatCurrency(value as number, formState.data!.salaryData.currency)}
                                />
                                <Bar dataKey="salary" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2 text-xl"><BrainCircuit className="h-5 w-5 text-primary"/>In-Demand Skills</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {formState.data.requiredSkills.map(({skill, demand}) => (
                                <Badge key={skill} variant={demand === 'High' ? 'default' : demand === 'Medium' ? 'secondary' : 'outline'} className="text-sm">
                                    {skill}
                                    <span className={cn("ml-2 h-2 w-2 rounded-full", demand === 'High' ? 'bg-green-400' : demand === 'Medium' ? 'bg-yellow-400' : 'bg-gray-400')}></span>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2 text-xl"><Building className="h-5 w-5 text-primary"/>Top Hiring Companies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                           {formState.data.topCompanies.map(company => <li key={company} className="p-2 rounded-md bg-muted/50 font-medium">{company}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2 text-xl"><MapPin className="h-5 w-5 text-primary"/>Hot Locations</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <ul className="space-y-2">
                           {formState.data.topLocations.map(location => <li key={location} className="p-2 rounded-md bg-muted/50 font-medium">{location}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>

        </div>
      )}
    </div>
  );
}
