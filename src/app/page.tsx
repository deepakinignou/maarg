
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BrainCircuit, Briefcase, FileText, GraduationCap, LineChart, ListChecks, Target, Search, TrendingUp, Users, GalleryVertical, Zap, Handshake } from 'lucide-react';
import Link from 'next/link';


const features = [
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: 'Skills Mapping',
    description: 'Analyze your background to identify key strengths.',
  },
  {
    icon: <Briefcase className="h-8 w-8" />,
    title: 'Career Paths',
    description: 'Discover career paths tailored to your profile.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: 'Learning Plan',
    description: 'Get a personalized plan to bridge skill gaps.',
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'Resume Builder',
    description: 'Generate AI-powered resume bullet points.',
  },
  {
    icon: <ListChecks className="h-8 w-8" />,
    title: 'Interview Prep',
    description: 'Practice with AI and get instant feedback.',
  },
  {
    icon: <LineChart className="h-8 w-8" />,
    title: 'Demand Forecast',
    description: 'See which skills will be in demand tomorrow.',
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: 'Job Matching',
    description: 'Let AI find the perfect job openings for your skillset.',
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: 'Market Intelligence',
    description: 'Get real-time analysis on salaries, top companies, and locations.',
  },
   {
    icon: <Users className="h-8 w-8" />,
    title: 'Mentor Connect',
    description: 'Find and connect with mentors in your desired field.',
  },
  {
    icon: <GalleryVertical className="h-8 w-8" />,
    title: 'Portfolio Builder',
    description: 'Showcase your projects with a professional portfolio.',
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Networking Assistant',
    description: 'Get AI-driven suggestions for professional networking.',
  },
  {
    icon: <Handshake className="h-8 w-8" />,
    title: 'Salary Navigator',
    description: 'Tools and insights for salary negotiation.',
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background text-foreground selection:bg-primary/20">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-fuchsia-900/20 to-background z-0"></div>
      
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
           <Target className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline bg-gradient-to-r from-blue-400 to-fuchsia-500 text-transparent bg-clip-text">Maarg</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button variant="accent" asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full z-10">
        <section className="container mx-auto flex flex-col items-center justify-center space-y-6 py-20 text-center md:py-32">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-gradient-to-br from-gray-300 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent">
            Navigate Your Career with AI Precision
          </h1>
          <p className="max-w-2xl text-muted-foreground md:text-xl">
            Maarg is your AI-powered co-pilot for career success. Map your skills, discover personalized career paths, and get the guidance you need to land your dream job.
          </p>
          <div className="space-x-4">
            <Button size="lg" variant="accent" asChild>
              <Link href="/login">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section id="features" className="container mx-auto py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">A Full-Stack Career Toolkit</h2>
            <p className="md:text-lg text-muted-foreground mt-2">Everything you need to go from learning to earning.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="animate-in fade-in-0 duration-500" style={{ animationDelay: `${index * 100}ms`}}>
                <Card className="h-full bg-card/60 backdrop-blur-sm border-white/10 hover:border-primary/50 hover:bg-card/80 transition-all hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg">{feature.icon}</div>
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </main>

       <footer className="w-full border-t border-white/10 py-6 text-center text-sm text-muted-foreground z-10">
        <p>"Every skill you map brings you closer to your dream career."</p>
      </footer>
    </div>
  );
}
