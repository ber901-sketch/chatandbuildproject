'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Check } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            plan: 'free',
          },
        },
      });

      if (error) throw error;

      // Redirect to dashboard after successful signup
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during signup');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (plan: string) => {
    if (plan === 'free') {
      // Scroll to signup form
      document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
    } else if (plan === 'pro') {
      // Redirect to Stripe
      window.location.href = 'https://buy.stripe.com/test_your_stripe_link';
    } else if (plan === 'enterprise') {
      // Pre-filled email
      window.location.href = 'mailto:admin@cconnexus.com?subject=Enquiry%20for%20Enterprise%20Custom%20build';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Image 
            src="https://cdn.chatandbuild.com/users/68fd30c39e722f65f5050e6d/cadence-1762008653424-304836065-1762008653424-540213043.png"
            alt="Cadence Connexus"
            width={200}
            height={60}
            className="h-12 w-auto mx-auto mb-6 brightness-0 invert"
          />
          <h1 className="text-5xl font-heading font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-white/90">
            Start with our Free Plan and upgrade anytime
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="border-4 border-brand-border relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1">
              Start Here
            </Badge>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-heading text-brand-primary">Free</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold text-brand-primary">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <CardDescription className="text-base mt-2">Perfect for trying out the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>1 event per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Dual approval workflow</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Email notifications</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleBuyNow('free')}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-heading font-bold"
              >
                Start Free Today
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-4 border-brand-primary relative shadow-xl scale-105">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-primary text-white px-4 py-1">
              Most Popular
            </Badge>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-heading text-brand-primary">Pro</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold text-brand-primary">$12</span>
                <span className="text-gray-600">/month</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">or $100/year (save $44)</div>
              <CardDescription className="text-base mt-2">All of Free, plus...</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="font-bold">Unlimited events</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="font-bold">AI-powered event planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Advanced analytics & insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>API access</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleBuyNow('pro')}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-heading font-bold"
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-4 border-brand-border">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-heading text-brand-primary">Enterprise</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold text-brand-primary">Custom</span>
              </div>
              <CardDescription className="text-base mt-2">All of Pro, plus...</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="font-bold">White-label branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="font-bold">Custom templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>SLA guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Training & onboarding</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleBuyNow('enterprise')}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-heading font-bold"
              >
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Signup Form */}
        <Card id="signup-form" className="max-w-md mx-auto border-4 border-brand-border">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading text-brand-primary">Start Free Today</CardTitle>
            <CardDescription className="text-base">No credit card required</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-heading font-bold"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Free Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-brand-primary hover:underline font-bold">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
