'use client';

import { useState } from 'react';
import type { GenerateQAOutput } from '@/ai/flows/generate-qa';
import GeneratorForm from '@/components/qa-generator/GeneratorForm';
import QADisplay from '@/components/qa-generator/QADisplay';

export default function QAGeneratorPage() {
  const [qaData, setQaData] = useState<GenerateQAOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneration = (data: GenerateQAOutput | null, errorMsg?: string) => {
    if (errorMsg) {
      setError(errorMsg);
      setQaData(null);
    } else if (data) {
      setQaData(data);
      setError(null);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Question & Answer Generator
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Enter a job role and get AI-generated questions with ideal answers to prepare for your interview.
          </p>
        </div>

        <GeneratorForm onGenerated={handleGeneration} setLoading={setIsLoading} isLoading={isLoading} />

        {error && <div className="mt-8 text-center text-destructive">{error}</div>}
        
        {isLoading && (
          <div className="mt-12 text-center">
            <p>Loading...</p>
          </div>
        )}

        {qaData && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">Generated Q&A</h2>
            <QADisplay questionsAndAnswers={qaData.questionsAndAnswers} />
          </div>
        )}
      </div>
    </div>
  );
}
