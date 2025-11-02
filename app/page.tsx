import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Zap, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary">Cadence Connexus</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The collaborative platform where SMEs and consultancies co-create, approve, and publish events seamlessly
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Event Planning</h3>
            <p className="text-gray-600">Create and manage events collaboratively</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">Work together with your partners</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Approval Workflow</h3>
            <p className="text-gray-600">Streamlined approval process</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Auto-Publish</h3>
            <p className="text-gray-600">Publish to Eventbrite automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
}
