'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker path for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

type ResumeUploadProps = {
  onUpload: (fileText: string, numQuestions: number) => void;
  loading: boolean;
};

export default function ResumeUpload({ onUpload, loading }: ResumeUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileContent(''); // Reset content while processing

      try {
        if (file.type === 'text/plain') {
          const text = await file.text();
          setFileContent(text);
        } else if (file.type === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => (item as any).str).join(' ');
          }
          setFileContent(text);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
          const arrayBuffer = await file.arrayBuffer();
          const { value } = await mammoth.extractRawText({ arrayBuffer });
          setFileContent(value);
        } else {
          toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please upload a .txt, .pdf, .doc, or .docx file.',
          });
          resetFile();
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        toast({
          variant: 'destructive',
          title: 'File Parsing Error',
          description: 'Could not read the content of the file. Please ensure it is not corrupted.',
        });
        resetFile();
      }
    }
  };

  const handleUpload = () => {
    if (fileContent) {
      onUpload(fileContent, numQuestions);
    }
  };

  const resetFile = () => {
    setFileName(null);
    setFileContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
          Resume-Based Practice
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Upload your resume. Our AI will analyze it and generate personalized questions to help you prepare.
        </p>

        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Upload className="w-6 h-6" />
              Upload Your Resume
            </CardTitle>
            <CardDescription>Select a .txt, .pdf, .doc, or .docx file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                disabled={loading}
              />
              {fileName ? (
                <div className="flex flex-col items-center text-center">
                  <FileText className="w-12 h-12 text-primary" />
                  <p className="mt-2 font-medium">{fileName}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetFile();
                    }}
                    className="mt-2 text-sm text-destructive hover:underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="font-semibold">Click to browse or drag & drop</p>
                  <p className="text-sm text-muted-foreground mt-1">TXT, PDF, DOC, DOCX formats supported</p>
                </>
              )}
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="numQuestions">Number of Questions</Label>
              <Input
                id="numQuestions"
                type="number"
                min="1"
                max="10"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                disabled={loading}
                className="max-w-xs"
              />
            </div>
          </CardContent>
        </Card>
        <Button
          onClick={handleUpload}
          disabled={!fileContent || loading}
          size="lg"
          className="mt-6 w-full max-w-lg bg-gradient-to-r from-primary to-accent text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Questions'
          )}
        </Button>
      </div>
    </div>
  );
}
