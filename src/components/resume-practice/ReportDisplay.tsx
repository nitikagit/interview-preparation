'use client';

import type { AnalysisReportOutput } from '@/ai/flows/answer-analysis-report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, BarChart, BookOpen, Clock, BrainCircuit, RotateCcw } from 'lucide-react';

type ReportDisplayProps = {
  report: AnalysisReportOutput;
  onRestart: () => void;
};

const ScoreIndicator = ({ label, score, icon: Icon }: { label: string; score: number, icon: React.ElementType }) => {
    let progressColor = 'bg-green-500';
    if (score < 75) progressColor = 'bg-yellow-500';
    if (score < 50) progressColor = 'bg-red-500';

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                <span className="ml-auto font-bold text-foreground">{score}/100</span>
            </div>
            <Progress value={score} className="h-2 [&>*]:bg-primary" />
        </div>
    )
};


export default function ReportDisplay({ report, onRestart }: ReportDisplayProps) {
  const { overallPerformance, questionBreakdown, overallRecommendations } = report;

  const averageScores = questionBreakdown.reduce(
    (acc, q) => {
      acc.vocabulary += q.vocabularyScore;
      acc.grammar += q.grammarScore;
      acc.relevance += q.relevanceScore;
      return acc;
    },
    { vocabulary: 0, grammar: 0, relevance: 0 }
  );

  const numQuestions = questionBreakdown.length;
  const avgVocab = Math.round(averageScores.vocabulary / numQuestions);
  const avgGrammar = Math.round(averageScores.grammar / numQuestions);
  const avgRelevance = Math.round(averageScores.relevance / numQuestions);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Your Interview Analysis</h1>
        <p className="mt-2 text-lg text-muted-foreground">Here's a breakdown of your performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/>Overall Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{overallPerformance}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CheckCircle className="text-primary"/>Overall Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{overallRecommendations}</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Average Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <ScoreIndicator label="Vocabulary" score={avgVocab} icon={BookOpen} />
            <ScoreIndicator label="Grammar" score={avgGrammar} icon={CheckCircle} />
            <ScoreIndicator label="Relevance" score={avgRelevance} icon={BrainCircuit} />
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">Question Breakdown</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {questionBreakdown.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="bg-card border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">{item.question}</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div>
                  <h4 className="font-semibold mb-2">Answer Analysis</h4>
                  <p className="text-muted-foreground">{item.answerAnalysis}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  <p className="text-muted-foreground">{item.recommendations}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                    <ScoreIndicator label="Vocabulary" score={item.vocabularyScore} icon={BookOpen} />
                    <ScoreIndicator label="Grammar" score={item.grammarScore} icon={CheckCircle} />
                    <ScoreIndicator label="Relevance" score={item.relevanceScore} icon={BrainCircuit} />
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground p-2 rounded-md bg-secondary/50">
                        <Clock className="w-4 h-4" />
                        <span>Time Taken:</span>
                        <span className="ml-auto font-bold text-foreground">{item.timeTaken}s</span>
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="text-center pt-6">
        <Button onClick={onRestart} size="lg" variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Practice Again
        </Button>
      </div>
    </div>
  );
}
