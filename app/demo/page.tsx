'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-brand-primary flex items-center gap-2">
              <Play className="w-6 h-6" />
              Interactive Demo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Experience the Cadence Connexus platform workflow:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Create your company profile</li>
              <li>Upload collaboration documents</li>
              <li>Invite partner organizations</li>
              <li>Review AI-generated insights</li>
              <li>Approve and publish events to Eventbrite</li>
            </ol>

            <div className="pt-4">
              <Link href="/">
                <Button className="bg-brand-primary hover:bg-brand-primary/90">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
