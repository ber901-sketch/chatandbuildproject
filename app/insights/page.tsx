'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Upload, FileText, Download } from 'lucide-react';

export default function InsightsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [partnerCompanyName, setPartnerCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please upload at least one document',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('companyName', companyName);
      formData.append('partnerCompanyName', partnerCompanyName);
      formData.append('contactEmail', contactEmail);

      const response = await fetch('/api/parseDocuments', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process documents');

      const data = await response.json();

      toast({
        title: 'Success!',
        description: 'Your insights report has been generated and sent to your email.',
      });

      // Reset form
      setFiles([]);
      setCompanyName('');
      setPartnerCompanyName('');
      setContactEmail('');
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process documents. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-brand-primary flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Generate Collaboration Insights Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Your Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your company name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="partnerCompanyName">Partner Company Name</Label>
                  <Input
                    id="partnerCompanyName"
                    value={partnerCompanyName}
                    onChange={(e) => setPartnerCompanyName(e.target.value)}
                    placeholder="Enter partner company name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="files">Upload Documents</Label>
                  <div className="mt-2">
                    <Input
                      id="files"
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      accept=".doc,.docx,.pdf,.ppt,.pptx"
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Supported formats: Word (.doc, .docx), PDF (.pdf), PowerPoint (.ppt, .pptx)
                    </p>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {files.map((file, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">What you'll receive:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• AI-powered analysis of collaboration patterns</li>
                  <li>• Key insights and recommendations</li>
                  <li>• Professional PDF report</li>
                  <li>• Delivered directly to your email</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-brand-primary hover:bg-brand-primary/90"
              >
                {isProcessing ? (
                  <>Processing Documents...</>
                ) : (
                  <>
                    <Download className="mr-2 w-4 h-4" />
                    Generate Insights Report
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
