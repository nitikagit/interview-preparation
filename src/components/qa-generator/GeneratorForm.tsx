'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-gradient-to-r from-primary to-accent text-white">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Generate Q&A
    </Button>
  );
}

export default function GeneratorForm({ onGenerated, setLoading, isLoading }: GeneratorFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(generateQandA, {
    error: undefined,
    data: undefined,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      numberOfQuestions: 5,
    },
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);
  
  useEffect(() => {
    if (state.error) {
      const errorMsg = typeof state.error === 'string' ? state.error : 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: errorMsg,
      });
      onGenerated(null, errorMsg);
    }
    if (state.data) {
      onGenerated(state.data as GenerateQAOutput);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onFormAction = (formData: FormData) => {
    setLoading(true);
    formAction(formData);
  }

  return (
    <form action={onFormAction}>
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
            />
            {form.formState.errors.role && (
              <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
            )}
             {typeof state.error !== 'string' && state.error?.role && (
              <p className="text-sm text-destructive">{state.error.role[0]}</p>
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
            />
             {form.formState.errors.numberOfQuestions && (
              <p className="text-sm text-destructive">{form.formState.errors.numberOfQuestions.message}</p>
            )}
            {typeof state.error !== 'string' && state.error?.numberOfQuestions && (
              <p className="text-sm text-destructive">{state.error.numberOfQuestions[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
