"use client";

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Edit3 } from 'lucide-react';
import { useProfileStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';


export function Profile() {
    const { name, email, photo, setName, setEmail, setPhoto } = useProfileStore();
    const [currentName, setCurrentName] = useState(name);
    const [currentEmail, setCurrentEmail] = useState(email);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
                toast({
                  title: "Photo Updated",
                  description: "Your profile picture has been changed.",
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setName(currentName);
        setEmail(currentEmail);
        toast({
            title: "Profile Saved",
            description: "Your profile details have been updated successfully.",
        });
    }

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                    <User className="h-6 w-6 text-primary" />
                    Edit Your Profile
                </CardTitle>
                <CardDescription>
                    Update your personal information and profile picture.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            <Avatar className="h-32 w-32 border-4 border-primary/20 group-hover:border-primary/50 transition-colors">
                                <AvatarImage src={photo || undefined} alt="User Avatar" />
                                <AvatarFallback className="h-32 w-32">
                                    <User className="h-16 w-16" />
                                </AvatarFallback>
                            </Avatar>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="icon" 
                                className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-background/80 group-hover:bg-primary group-hover:text-primary-foreground"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Edit3 className="h-4 w-4"/>
                            </Button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handlePhotoUpload}
                        />
                    </div>

                    <div className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="name" className="font-semibold">Full Name</Label>
                            <Input
                                id="name"
                                value={currentName}
                                onChange={(e) => setCurrentName(e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-semibold">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={currentEmail}
                                onChange={(e) => setCurrentEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" variant="accent">Save Changes</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
