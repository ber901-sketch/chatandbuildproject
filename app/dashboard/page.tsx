'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Eye, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-brand-primary mb-2">
            Your Dashboard
          </h1>
          <p className="text-xl text-gray-600">Manage your collaboration events</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Events</p>
                  <p className="text-3xl font-bold text-brand-primary">3</p>
                </div>
                <Calendar className="w-10 h-10 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Attendees</p>
                  <p className="text-3xl font-bold text-brand-primary">127</p>
                </div>
                <Users className="w-10 h-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Views</p>
                  <p className="text-3xl font-bold text-brand-primary">291</p>
                </div>
                <Eye className="w-10 h-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-brand-primary">1</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-heading text-brand-primary">
                Your Events
              </CardTitle>
              <Link href="/onboarding">
                <Button className="bg-brand-primary hover:bg-brand-primary/90">
                  Create New Event
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Your events will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
