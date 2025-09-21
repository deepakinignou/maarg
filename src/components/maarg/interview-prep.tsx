'use client'

import { useState, useEffect, useRef } from 'react'
import { useFormState } from 'react-dom'
import { useToast } from '@/hooks/use-toast'
import { interviewPrepAction, FormState } from '@/app/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ALL_ROLES } from '@/lib/data'
import { ListChecks, Bot, Sparkles, Send, ThumbsUp, TrendingUp, Award, User, Video, CameraOff, Cpu, Smile, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { InterviewFlowOutput } from '@/ai/flows/interview-flow'
import { SubmitButton } from './submit-button'
import { useProfileStore } from '@/lib/store'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Progress } from '../ui/progress'
import Image from 'next/image'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

const initialState: FormState<InterviewFlowOutput> = {
  message: '',
};

type InterviewMessage = {
  type: 'question' | 'answer' | 'feedback' | 'report';
  text: string;
  questionContext?: string;
};

export function InterviewPrep() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [initialQuestions, setInitialQuestions] = useState<string[]>([]);
  const [conversation, setConversation] = useState<InterviewMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const [questionsState, questionsAction] = useFormState(interviewPrepAction, initialState);
  const [feedbackState, feedbackAction] = useFormState(interviewPrepAction, initialState);
  const [reportState, reportAction] = useFormState(interviewPrepAction, initialState);


  const { toast } = useToast();
  const { photo } = useProfileStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    if(isInterviewing) {
      const getCameraPermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('Camera API not supported');
            setHasCameraPermission(false);
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            setHasCameraPermission(true);

            if (videoRef.current) {
            videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
        }
      };

      getCameraPermission();
      
      return () => {
         if (videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
         }
      }
    }
  }, [isInterviewing]);

  useEffect(() => {
    if (questionsState.data?.questions) {
      setInitialQuestions(questionsState.data.questions);
      setIsInterviewing(true);
      setCurrentQuestionIndex(0);
      setConversation([{ type: 'question', text: questionsState.data.questions[0] }]);
      setShowReport(false);
    }
     if (questionsState.message && !questionsState.data && !isInterviewing) {
      toast({ variant: 'destructive', title: 'Error fetching questions' });
      setSelectedRole(null);
    }
  }, [questionsState, isInterviewing, toast]);

  useEffect(() => {
    if (feedbackState.data?.feedback && feedbackState.fields?.question) {
       setConversation(prev => [...prev, { type: 'feedback', text: feedbackState.data!.feedback!, questionContext: feedbackState.fields!.question }]);
       
       const nextIndex = currentQuestionIndex + 1;
       if (nextIndex < initialQuestions.length) {
         setCurrentQuestionIndex(nextIndex);
         setTimeout(() => {
            setConversation(prev => [...prev, {type: 'question', text: initialQuestions[nextIndex]}]);
         }, 1000);
       } else {
         setTimeout(() => {
            const finalMessage = {type: 'feedback', text: "That's the end of the questions! Click 'End & Get Report' to see your feedback dashboard."} as InterviewMessage;
            setConversation(prev => [...prev, finalMessage]);
         }, 1000);
       }
    }
     if (feedbackState.message && !feedbackState.data?.report) {
      toast({ variant: 'destructive', title: 'Error getting feedback' });
    }
  }, [feedbackState, toast, currentQuestionIndex, initialQuestions]);

  useEffect(() => {
    if (reportState.data?.report) {
        setShowReport(true);
    }
     if (reportState.message && !reportState.data?.report && isInterviewing) {
      toast({ variant: 'destructive', title: 'Error generating report' });
    }
  }, [reportState, toast, isInterviewing]);

  const handleStartInterview = (role: string) => {
    setSelectedRole(role);
    setConversation([]);
    const formData = new FormData();
    formData.append('role', role);
    questionsAction(formData);
  }

  const handleAnswerSubmit = (formData: FormData) => {
    const userAnswer = formData.get('userAnswer') as string;
    const question = formData.get('question') as string;
    
    if (userAnswer && question) {
        setConversation(prev => [...prev, { type: 'answer', text: userAnswer, questionContext: question }]);
        feedbackAction(formData);
        (document.getElementById('answer-form') as HTMLFormElement)?.reset();
    }
  }

  const handleGetReport = () => {
    const reportConversation = conversation.filter(m => m.type === 'question' || m.type === 'answer');
    const formData = new FormData();
    formData.append('role', selectedRole!);
    formData.append('conversation', JSON.stringify(reportConversation));
    reportAction(formData);
  }

  const resetInterview = () => {
    setIsInterviewing(false);
    setShowReport(false);
    setSelectedRole(null);
    setConversation([]);
    setInitialQuestions([]);
    setCurrentQuestionIndex(0);
    setHasCameraPermission(null);
  }


  if (!isInterviewing) {
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                    <ListChecks className="h-6 w-6 text-primary" />
                    AI Mock Interview
                </CardTitle>
                <CardDescription>
                    Select a role to start your AI-powered mock interview. This feature uses your camera to simulate a real video call.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="career-select-interview" className="font-semibold">Select Target Role</Label>
                    <Select onValueChange={handleStartInterview} value={selectedRole ?? ''}>
                    <SelectTrigger id="career-select-interview">
                        <SelectValue placeholder="Select a career to start..." />
                    </SelectTrigger>
                    <SelectContent>
                        {ALL_ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-card p-3 rounded-xl shadow-md">
            <h3 className="font-headline text-lg">
                Role: <span className="text-primary font-semibold">{selectedRole}</span>
            </h3>
            {currentQuestionIndex >= initialQuestions.length -1 && !showReport ? (
                <SubmitButton variant="accent" onClick={handleGetReport}>End & Get Report</SubmitButton>
            ) : (
                 <Button variant="outline" size="sm" onClick={resetInterview}>{showReport ? 'Start New Interview' : 'End Session'}</Button>
            )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="shadow-lg relative aspect-video overflow-hidden">
                      <Image src="https://picsum.photos/seed/interviewer/1280/720" layout="fill" objectFit="cover" alt="AI Interviewer" data-ai-hint="professional headshot" />
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded-lg text-xs font-semibold">AI Interviewer</div>
                  </Card>
                  <Card className="shadow-lg relative aspect-video overflow-hidden flex items-center justify-center bg-muted">
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                      {hasCameraPermission === false && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                            <CameraOff className="h-10 w-10 text-muted-foreground mb-2"/>
                            <p className="text-sm font-semibold">Camera is off</p>
                            <p className="text-xs text-muted-foreground">Please grant camera permission to use this feature.</p>
                         </div>
                      )}
                       <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded-lg text-xs font-semibold">You</div>
                  </Card>
                </div>

                <Card className="shadow-lg">
                    <CardContent className="p-0">
                        <div ref={chatContainerRef} className="h-[300px] overflow-y-auto space-y-6 p-4">
                            {conversation.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 ${msg.type === 'answer' ? 'justify-end' : 'justify-start'}`}>
                                {msg.type !== 'answer' && (
                                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                                        <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground">
                                            <Bot className="h-5 w-5" />
                                        </div>
                                    </Avatar>
                                )}
                                <div className={`max-w-md rounded-lg px-4 py-2 ${
                                    msg.type === 'question' ? 'bg-muted' : 
                                    msg.type === 'answer' ? 'bg-primary text-primary-foreground' : 
                                    'bg-card border'
                                }`}>
                                    {msg.type === 'feedback' && (
                                        <div className="font-headline text-base flex items-center gap-2 mb-2"><Sparkles className="h-5 w-5 text-accent"/> AI Feedback</div>
                                    )}
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}
                                    />
                                </div>
                                {msg.type === 'answer' && (
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={photo || undefined} />
                                        <AvatarFallback>
                                            <User className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <form id="answer-form" action={handleAnswerSubmit} className="w-full flex items-center gap-2">
                            <input type="hidden" name="role" value={selectedRole ?? ''} />
                            <input type="hidden" name="question" value={initialQuestions[currentQuestionIndex]} />
                            <Textarea
                                name="userAnswer"
                                placeholder={currentQuestionIndex < initialQuestions.length ? "Type your answer here..." : "The interview has ended."}
                                rows={1}
                                required
                                disabled={currentQuestionIndex >= initialQuestions.length || showReport}
                                className="flex-1"
                                onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    (e.target as HTMLTextAreaElement).form?.requestSubmit();
                                }
                                }}
                            />
                            <SubmitButton variant="accent" size="icon" disabled={currentQuestionIndex >= initialQuestions.length || showReport}>
                                <Send className="h-4 w-4"/>
                            </SubmitButton>
                        </form>
                    </CardFooter>
                </Card>
            </div>
            
            <div className="lg:col-span-1">
                {showReport && reportState.data?.report ? (
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-full animate-in fade-in-0">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2 text-xl">
                                <Award className="h-6 w-6 text-primary" />
                                Interview Report
                            </CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="p-4 rounded-lg bg-muted">
                                <Label className="text-md font-headline">Overall Confidence</Label>
                                <div className="flex items-center gap-4 mt-2">
                                    <Progress value={reportState.data.report.confidenceScore} className="w-full h-3"/>
                                    <span className="font-bold text-lg text-primary">{reportState.data.report.confidenceScore}%</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">{reportState.data.report.fluencyAnalysis}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted">
                                <h4 className="font-headline text-md flex items-center gap-2 mb-3"><ThumbsUp className="h-5 w-5 text-green-500"/>What Went Well</h4>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm">
                                    {reportState.data.report.strengths.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div className="p-4 rounded-lg bg-muted">
                                <h4 className="font-headline text-md flex items-center gap-2 mb-3"><TrendingUp className="h-5 w-5 text-red-500"/>Areas to Improve</h4>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm">
                                    {reportState.data.report.areasForImprovement.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                             <div className="p-4 rounded-lg bg-muted">
                                <h4 className="font-headline text-md flex items-center gap-2 mb-3"><Cpu className="h-5 w-5 text-blue-500"/>Technical Proficiency</h4>
                                <p className="text-muted-foreground text-sm">{reportState.data.report.technicalProficiency}</p>
                            </div>
                             <div className="p-4 rounded-lg bg-muted">
                                <h4 className="font-headline text-md flex items-center gap-2 mb-3"><Smile className="h-5 w-5 text-orange-400"/>Behavioral Competency</h4>
                                <p className="text-muted-foreground text-sm">{reportState.data.report.behavioralCompetency}</p>
                            </div>
                             <div className="p-4 rounded-lg bg-muted">
                                <h4 className="font-headline text-md flex items-center gap-2 mb-3"><Star className="h-5 w-5 text-yellow-400"/>STAR Method Adherence</h4>
                                <p className="text-muted-foreground text-sm">{reportState.data.report.starMethodAdherence}</p>
                            </div>
                             <div className="p-4 rounded-lg bg-muted">
                                <h4 className="font-headline text-md flex items-center gap-2 mb-3"><Sparkles className="h-5 w-5 text-accent"/>Final Summary</h4>
                                <p className="text-muted-foreground text-sm">{reportState.data.report.summary}</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                     <Card className="shadow-lg h-full flex flex-col items-center justify-center text-center p-6">
                        <Video className="h-16 w-16 text-muted-foreground/50 mb-4" />
                        <h3 className="font-headline text-lg">Interview Dashboard</h3>
                        <p className="text-muted-foreground text-sm">Your final report card will appear here after the interview.</p>
                    </Card>
                )}
            </div>
        </div>
    </div>
  )
}
