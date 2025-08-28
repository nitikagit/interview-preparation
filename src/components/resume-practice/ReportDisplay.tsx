'use client';

import type { AnalysisReportOutput } from '@/ai/flows/answer-analysis-report';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, BarChart, BookOpen, Clock, BrainCircuit, RotateCcw } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type ReportDisplayProps = {
  report: AnalysisReportOutput;
  onRestart: () => void;
};

const ScoreChart = ({ data, dataKey, label, color, icon: Icon }: { data: any[], dataKey: string, label: string, color: string, icon: React.ElementType }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="w-5 h-5" style={{ color }} />
        {label} Scores
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={{ [dataKey]: { label, color } }} className="h-[200px] w-full">
        <RechartsBarChart accessibilityLayer data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={4} />
        </RechartsBarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

const TimeChart = ({ data, icon: Icon }: { data: any[], icon: React.ElementType }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary"/>
            Time Taken Per Question (seconds)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ time: { label: "Time (s)", color: "hsl(var(--primary))" } }} className="h-[200px] w-full">
          <RechartsLineChart accessibilityLayer data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" nameKey="time" />} />
            <Line type="monotone" dataKey="time" stroke="var(--color-time)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-time)" }} />
          </RechartsLineChart>
        </ChartContainer>
      </CardContent>
    </Card>
);


export default function ReportDisplay({ report, onRestart }: ReportDisplayProps) {
  const { overallPerformance, questionBreakdown, overallRecommendations } = report;

  const chartData = questionBreakdown.map((q, i) => ({
    name: `Q${i + 1}`,
    question: q.question,
    vocabulary: q.vocabularyScore,
    grammar: q.grammarScore,
    relevance: q.relevanceScore,
    time: q.timeTaken,
  }));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Your Interview Analysis</h1>
        <p className="mt-2 text-lg text-muted-foreground">Here's a breakdown of your performance.</p>
      </div>

      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><BarChart />Overall Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground text-base">{overallPerformance}</p>
                 <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle />Recommendations</h4>
                    <p className="text-muted-foreground">{overallRecommendations}</p>
                 </div>
            </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScoreChart data={chartData} dataKey="vocabulary" label="Vocabulary" color="hsl(var(--chart-1))" icon={BookOpen} />
            <ScoreChart data={chartData} dataKey="grammar" label="Grammar" color="hsl(var(--chart-2))" icon={CheckCircle} />
            <ScoreChart data={chartData} dataKey="relevance" label="Relevance" color="hsl(var(--chart-3))" icon={BrainCircuit} />
            <TimeChart data={chartData} icon={Clock} />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">Detailed Question Breakdown</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {questionBreakdown.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="bg-card border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">{`Question ${index + 1}: ${item.question}`}</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <h4 className="font-semibold mb-2">Your Answer's Analysis</h4>
                  <p className="text-muted-foreground">{item.answerAnalysis}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recommendations for Improvement</h4>
                  <p className="text-muted-foreground">{item.recommendations}</p>
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
