'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRef } from 'react';
import type { GenerateQAOutput } from '@/ai/flows/generate-qa';

import { generateQandA } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  role: z.string().min(2, { message: 'Role must be at least 2 characters.' }),
  numberOfQuestions: z.coerce
    .number()
    .min(1, { message: 'Please generate at least 1 question.' })
    .max(10, { message: 'You can generate a maximum of 10 questions.' }),
});

type FormValues = z.infer<typeof formSchema>;

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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      numberOfQuestions: 5,
    },
    mode: 'onSubmit'
  });

  const formRef = useRef<HTMLFormElement>(null);
  
  const handleFormSubmit = async (values: FormValues) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('role', values.role);
    formData.append('numberOfQuestions', values.numberOfQuestions.toString());

    const state = await generateQandA(null, formData);

    setLoading(false);
    if (state.error) {
      const errorMsg = typeof state.error === 'string' 
        ? state.error 
        : (state.error as any).role?.[0] || (state.error as any).numberOfQuestions?.[0] || 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: errorMsg,
      });
      onGenerated(null, errorMsg);
    }
    if (state.data) {
      onGenerated(state.data as GenerateQAOutput);
      form.reset();
    }
  };


  return (
    <div>
      <form 
        ref={formRef} 
        onSubmit={form.handleSubmit(handleFormSubmit)}
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
                placeholder="e.g., Software Engineer, Marketing Manager"
                {...form.register('role')}
                disabled={isLoading}
              />
              {form.formState.errors.role && (
                <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfQuestions">Number of Questions</Label>
              <Input
                id="numberOfQuestions"
                type="number"
                min="1"
                max="10"
                {...form.register('numberOfQuestions')}
                disabled={isLoading}
              />
               {form.formState.errors.numberOfQuestions && (
                <p className="text-sm text-destructive">{form.formState.errors.numberOfQuestions.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton isLoading={isLoading} />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
