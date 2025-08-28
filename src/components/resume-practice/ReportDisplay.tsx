'use client';

import type { AnalysisReportOutput } from '@/ai/flows/answer-analysis-report';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CheckCircle, BarChart, BookOpen, Clock, BrainCircuit, RotateCcw, PieChart } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, Label as RechartsLabel, Pie, PieChart as RechartsPieChart, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

type ReportDisplayProps = {
  report: AnalysisReportOutput;
  onRestart: () => void;
};

const ScoreChart = ({ data, dataKey, label, color, icon: Icon, average }: { data: any[], dataKey: string, label: string, color: string, icon: React.ElementType, average: number }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="w-5 h-5" style={{ color }} />
        {label} Scores
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={{ [dataKey]: { label, color } }} className="h-[200px] w-full">
        <RechartsBarChart accessibilityLayer data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={4} />
          <ReferenceLine y={average} stroke="hsl(var(--foreground))" strokeDasharray="3 3">
            <RechartsLabel value={`Avg: ${average.toFixed(0)}`} position="right" fill="hsl(var(--muted-foreground))" fontSize={12} />
          </ReferenceLine>
        </RechartsBarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

const TimeChart = ({ data, icon: Icon, average }: { data: any[], icon: React.ElementType, average: number }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary"/>
            Time Taken Per Question (seconds)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ time: { label: "Time (s)", color: "hsl(var(--primary))" } }} className="h-[200px] w-full">
          <RechartsLineChart accessibilityLayer data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" nameKey="time" />} />
            <Line type="monotone" dataKey="time" stroke="var(--color-time)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-time)" }} />
            <ReferenceLine y={average} stroke="hsl(var(--foreground))" strokeDasharray="3 3">
                <RechartsLabel value={`Avg: ${average.toFixed(0)}s`} position="right" fill="hsl(var(--muted-foreground))" fontSize={12} />
            </ReferenceLine>
          </RechartsLineChart>
        </ChartContainer>
      </CardContent>
    </Card>
);

const AverageScorePieChart = ({ data, chartConfig }: { data: any[], chartConfig: any }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <PieChart className="w-5 h-5" />
        Average Score Distribution
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <RechartsPieChart>
          <Tooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={data} dataKey="score" nameKey="metric" innerRadius={50}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent />} />
        </RechartsPieChart>
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
  
  const calculateAverage = (key: keyof (typeof chartData)[0]) => {
      if (chartData.length === 0) return 0;
      const total = chartData.reduce((acc, item) => acc + (item[key] as number), 0);
      return total / chartData.length;
  };
  
  const avgVocabulary = calculateAverage('vocabulary');
  const avgGrammar = calculateAverage('grammar');
  const avgRelevance = calculateAverage('relevance');
  const avgTime = calculateAverage('time');

  const pieChartData = [
    { metric: "Vocabulary", score: avgVocabulary, fill: "hsl(var(--chart-1))" },
    { metric: "Grammar", score: avgGrammar, fill: "hsl(var(--chart-2))" },
    { metric: "Relevance", score: avgRelevance, fill: "hsl(var(--chart-3))" },
  ];

  const pieChartConfig = {
    Vocabulary: { label: "Vocabulary", color: "hsl(var(--chart-1))" },
    Grammar: { label: "Grammar", color: "hsl(var(--chart-2))" },
    Relevance: { label: "Relevance", color: "hsl(var(--chart-3))" },
  };

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
            <AverageScorePieChart data={pieChartData} chartConfig={pieChartConfig} />
            <TimeChart data={chartData} icon={Clock} average={avgTime}/>
            <ScoreChart data={chartData} dataKey="vocabulary" label="Vocabulary" color="hsl(var(--chart-1))" icon={BookOpen} average={avgVocabulary} />
            <ScoreChart data={chartData} dataKey="grammar" label="Grammar" color="hsl(var(--chart-2))" icon={CheckCircle} average={avgGrammar} />
            <ScoreChart data={chartData} dataKey="relevance" label="Relevance" color="hsl(var(--chart-3))" icon={BrainCircuit} average={avgRelevance} />
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
