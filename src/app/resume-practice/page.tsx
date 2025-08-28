'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { ResumeQuestionGeneratorOutput } from '@/ai/flows/resume-question-generator';
import type { AnalysisReportOutput } from '@/ai/flows/answer-analysis-report';
import ResumeUpload from '@/components/resume-practice/ResumeUpload';
import QuestionAnswering from '@/components/resume-practice/QuestionAnswering';
import ReportDisplay from '@/components/resume-practice/ReportDisplay';
import { generateResumeQuestions, analyzeSubmittedAnswers } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

type Step = 'upload' | 'answering' | 'analyzing' | 'report';

export default function ResumePracticePage() {
  const [step, setStep] = useState<Step>('upload');
  const [resumeText, setResumeText] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [report, setReport] = useState<AnalysisReportOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleResumeUpload = async (fileText: string, numQuestions: number) => {
    setLoading(true);
    setResumeText(fileText);
    const formData = new FormData();
    formData.append('resumeText', fileText);
    formData.append('numberOfQuestions', numQuestions.toString());

    const result = await generateResumeQuestions(null, formData);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Questions',
        description: typeof result.error === 'string' ? result.error : 'Please check your resume and try again.',
      });
      setLoading(false);
      return;
    }

    const questionData = result.data as ResumeQuestionGeneratorOutput;
    setQuestions(questionData.questions);
    setStep('answering');
    setLoading(false);
  };

  const handleAnswersSubmit = async (answers: { question: string; answer: string; timeTaken: number }[]) => {
    setStep('analyzing');
    const result = await analyzeSubmittedAnswers({ answers, resume: resumeText });

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description: 'We couldn\'t analyze your answers. Please try again.',
      });
      setStep('answering'); // Go back to answering step
      return;
    }

    setReport(result.data as AnalysisReportOutput);
    setStep('report');
  };
  
  const handleRestart = () => {
    setStep('upload');
    setResumeText('');
    setQuestions([]);
    setReport(null);
  };


  const renderStep = () => {
    switch (step) {
      case 'upload':
        return <ResumeUpload onUpload={handleResumeUpload} loading={loading} />;
      case 'answering':
        return <QuestionAnswering questions={questions} onSubmit={handleAnswersSubmit} />;
      case 'analyzing':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-2xl font-semibold text-foreground">Analyzing your answers...</h2>
            <p className="text-muted-foreground mt-2">The Gennie is hard at work generating your performance report.</p>
          </div>
        );
      case 'report':
        return report && <ReportDisplay report={report} onRestart={handleRestart} />;
      default:
        return <ResumeUpload onUpload={handleResumeUpload} loading={loading} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {renderStep()}
      </div>
    </div>
  );
}
