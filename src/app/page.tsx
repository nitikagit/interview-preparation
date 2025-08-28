import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, MessagesSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
          Welcome to Interview Gennie
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your personal AI-powered coach to ace your next interview. Choose a mode below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link href="/resume-practice" className="group">
          <Card className="h-full hover:shadow-primary/20 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Resume Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Upload your resume to get a tailored set of interview questions. Practice your answers and receive a detailed performance analysis report.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/qa-generator" className="group">
          <Card className="h-full hover:shadow-accent/20 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex-row items-center gap-4">
               <div className="bg-accent/10 p-3 rounded-full">
                <MessagesSquare className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-2xl font-bold">Q&A Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Specify a job role or industry, and generate a list of common questions with ideal answers. Perfect for studying and preparation.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
