"use client";
import { useEffect, useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SkillsMapping } from "@/components/maarg/skills-mapping";
import { CareerPath } from "@/components/maarg/career-path";
import { LearningPlan } from "@/components/maarg/learning-plan";
import { ResumeBuilder } from "@/components/maarg/resume-builder";
import { InterviewPrep } from "@/components/maarg/interview-prep";
import { DemandForecasting } from "@/components/maarg/demand-forecasting";
import { Profile } from '@/components/maarg/profile';
import { JobMatching } from '@/components/maarg/job-matching';
import { MarketIntelligence } from '@/components/maarg/market-intelligence';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('skills');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
      } else {
        setActiveTab('skills');
      }
    };

    // Initial check
    handleHashChange();

    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="skills" className="mt-0">
          <SkillsMapping />
        </TabsContent>
        <TabsContent value="careers" className="mt-0">
          <CareerPath />
        </TabsContent>
        <TabsContent value="learning" className="mt-0">
          <LearningPlan />
        </TabsContent>
        <TabsContent value="resume" className="mt-0">
          <ResumeBuilder />
        </TabsContent>
        <TabsContent value="interviews" className="mt-0">
          <InterviewPrep />
        </TabsContent>
        <TabsContent value="trends" className="mt-0">
          <DemandForecasting />
        </TabsContent>
         <TabsContent value="jobs" className="mt-0">
          <JobMatching />
        </TabsContent>
        <TabsContent value="market-intel" className="mt-0">
          <MarketIntelligence />
        </TabsContent>
        <TabsContent value="profile" className="mt-0">
          <Profile />
        </TabsContent>
      </Tabs>
  );
}
