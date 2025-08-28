'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Timer } from 'lucide-react';

type QuestionAnsweringProps = {
  questions: string[];
  onSubmit: (answers: { question: string; answer: string; timeTaken: number }[]) => void;
};

export default function QuestionAnswering({ questions, onSubmit }: QuestionAnsweringProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [times, setTimes] = useState<number[]>(Array(questions.length).fill(0));
  const [startTime, setStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentIndex]);

  const handleNext = () => {
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000);

    const newTimes = [...times];
    newTimes[currentIndex] = (newTimes[currentIndex] || 0) + timeTaken;
    setTimes(newTimes);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit(newTimes);
    }
  };

  const handleSubmit = (finalTimes: number[]) => {
    setIsSubmitting(true);
    const formattedAnswers = questions.map((q, i) => ({
      question: q,
      answer: answers[i],
      timeTaken: finalTimes[i],
    }));
    onSubmit(formattedAnswers);
  };
  
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-primary">Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl leading-snug">{questions[currentIndex]}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={answers[currentIndex]}
            onChange={handleAnswerChange}
            placeholder="Type your answer here..."
            className="min-h-[200px] text-base"
            disabled={isSubmitting}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleNext} disabled={isSubmitting || answers[currentIndex].length < 10}>
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Submit for Analysis'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
