'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ResumeUploadProps = {
  onUpload: (fileText: string) => void;
  loading: boolean;
};

export default function ResumeUpload({ onUpload, loading }: ResumeUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        setFileName(file.name);
        const text = await file.text();
        setFileContent(text);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'For now, we only support .txt files. Please upload your resume as a plain text file.',
        });
        resetFile();
      }
    }
  };

  const handleUpload = () => {
    if (fileContent) {
      onUpload(fileContent);
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
    <div className="flex flex-col items-center text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
        Resume-Based Practice
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
        Upload your resume as a .txt file. Our AI will analyze it and generate personalized questions to help you prepare.
      </p>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Upload className="w-6 h-6" />
            Upload Your Resume
          </CardTitle>
          <CardDescription>Please select a .txt file</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt"
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
                <p className="text-sm text-muted-foreground mt-1">TXT format only</p>
              </>
            )}
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
  );
}
