'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type QADisplayProps = {
  questionsAndAnswers: {
    question: string;
    answer: string;
  }[];
};

export default function QADisplay({ questionsAndAnswers }: QADisplayProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {questionsAndAnswers.map((qa, index) => (
        <AccordionItem value={`item-${index}`} key={index} className="bg-card border rounded-lg px-4">
          <AccordionTrigger className="text-left font-semibold hover:no-underline">
            {qa.question}
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground pt-2">
            <p>{qa.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
