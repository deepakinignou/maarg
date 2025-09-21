"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MessageCircle, Send, Sparkles, X, Bot } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { chatAction } from '@/app/actions';
import type { ChatMessage } from '@/ai/schemas/chatbot-schemas';
import { useToast } from '@/hooks/use-toast';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);
  
  const handleFormSubmit = async (formData: FormData) => {
    const prompt = formData.get('prompt') as string;
    if (!prompt) return;

    setIsPending(true);
    const newConversation = [...conversation, { role: 'user' as const, content: prompt }];
    setConversation(newConversation);
    
    formRef.current?.reset();
    inputRef.current?.focus();

    const result = await chatAction({
      history: newConversation.slice(0, -1), // Send history BEFORE the new prompt
      prompt,
    });

    if ('error' in result) {
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: result.error,
        });
        setConversation(prev => prev.slice(0, -1)); // remove user message on error
    } else {
         setConversation((prev) => [
            ...prev,
            { role: 'model', content: result.response },
        ]);
    }
    setIsPending(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute bottom-full right-0 mb-4"
            >
              <Card className="w-[380px] h-[550px] shadow-2xl shadow-primary/20 flex flex-col bg-card/80 backdrop-blur-lg border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-6 w-6"/>
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="font-headline text-xl">AI Career Coach</CardTitle>
                        <CardDescription className="flex items-center gap-1.5 text-xs">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Online
                        </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                    <X className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
                    {conversation.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Sparkles className="h-10 w-10 mb-4 opacity-50"/>
                            <p className="font-medium">Welcome to Maarg!</p>
                            <p className="text-sm">How can I help you navigate your career today?</p>
                        </div>
                    )}
                    {conversation.map((msg, index) => (
                        <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' && "justify-end")}>
                            {msg.role === 'model' && (
                                <Avatar className="h-8 w-8 border-2 border-primary/50">
                                <AvatarFallback className="bg-primary text-primary-foreground text-sm"><Bot/></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "max-w-xs rounded-lg px-4 py-2 text-sm",
                                msg.role === 'user'
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}>
                                <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }}/>
                            </div>
                        </div>
                    ))}
                    {isPending && (
                        <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 border-2 border-primary/50">
                                <AvatarFallback className="bg-primary text-primary-foreground text-sm"><Bot/></AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-2">
                                <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-0"></span>
                                <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></span>
                                <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <form
                    ref={formRef}
                    action={handleFormSubmit}
                    className="w-full flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      name="prompt"
                      placeholder="Ask a question..."
                      className="flex-1 bg-transparent focus:outline-none text-sm disabled:opacity-50"
                      disabled={isPending}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isPending) {
                          e.preventDefault();
                          formRef.current?.requestSubmit();
                        }
                      }}
                    />
                    <Button type="submit" size="icon" variant="ghost" className="h-8 w-8" disabled={isPending}>
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3, ease: 'easeOut' }}
        >
            <Button onClick={() => setIsOpen(!isOpen)} variant="accent" size="lg" className="rounded-full h-16 w-16 shadow-lg">
                {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
            </Button>
        </motion.div>
      </div>
    </>
  );
}
