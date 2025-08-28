'use client';

import { useState, useRef } from 'react';
import type { GenerateQAOutput } from '@/ai/flows/generate-qa';

import { generateQandA } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type GeneratorFormProps = {
  onGenerated: (data: GenerateQAOutput | null, error?: string) => void;
  setLoading: (loading: boolean) => void;
  isLoading: boolean;
};

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-accent text-white">
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Generate Q&A
    </Button>
  );
}

export default function GeneratorForm({ onGenerated, setLoading, isLoading }: GeneratorFormProps) {
  const { toast } = useToast();
  const [role, setRole] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!formRef.current) {
      setLoading(false);
      return;
    }

    const formData = new FormData(formRef.current);
    const state = await generateQandA(null, formData);

    setLoading(false);
    if (state.error) {
      const errorMsg = 
        typeof state.error === 'string' ? state.error : 
        (state.error as any).role?.[0] || 
        (state.error as any).numberOfQuestions?.[0] || 
        'An unexpected error occurred.';
      
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: errorMsg,
      });
      onGenerated(null, errorMsg);
    }
    if (state.data) {
      onGenerated(state.data as GenerateQAOutput);
      setRole('');
      setNumberOfQuestions(5);
    }
  };


  return (
    <form 
      ref={formRef} 
      onSubmit={handleFormSubmit}
      noValidate
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Job Role or Industry</Label>
            <Input
              id="role"
              name="role"
              placeholder="e.g., Software Engineer, Marketing Manager"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numberOfQuestions">Number of Questions</Label>
            <Input
              id="numberOfQuestions"
              name="numberOfQuestions"
              type="number"
              min="1"
              max="10"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
              disabled={isLoading}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton isLoading={isLoading} />
        </CardFooter>
      </Card>
    </form>
  );
}
