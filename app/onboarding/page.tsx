'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft, Upload, Building2, Globe, FileText, Sparkles, CheckCircle2, User, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

type OnboardingStep = 'company-info' | 'partner-info' | 'event-details' | 'contact-details' | 'review';

interface CompanyData {
  companyName: string;
  industry: string;
  website: string;
  linkedinUrl: string;
  description: string;
  companyDocuments: File[];
  partnerCompanyName: string;
  partnerIndustry: string;
  partnerWebsite: string;
  partnerLinkedin: string;
  partnerDescription: string;
  partnerDocuments: File[];
  eventGoals: string;
  targetAudience: string;
  collaborationIdeas: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  collaboratorEmail: string;
}

const CONSUMER_EMAIL_DOMAINS = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'live.com', 'icloud.com', 'aol.com'];

const SINGAPORE_INDUSTRIES = [
  'Aerospace',
  'Agriculture & Aquaculture',
  'Arts & Entertainment',
  'Automotive',
  'Banking & Finance',
  'Biotechnology',
  'Business Services',
  'Chemicals',
  'Construction & Engineering',
  'Consulting',
  'E-commerce',
  'Education & Training',
  'Electronics & Semiconductors',
  'Energy & Utilities',
  'Environmental Services',
  'Food & Beverage',
  'Healthcare & Medical Services',
  'Hospitality & Tourism',
  'Human Resources',
  'Information Technology',
  'Insurance',
  'Legal Services',
  'Logistics & Supply Chain',
  'Manufacturing',
  'Marine & Offshore',
  'Marketing & Advertising',
  'Media & Communications',
  'Pharmaceuticals',
  'Professional Services',
  'Real Estate & Property',
  'Retail & Consumer Goods',
  'Security Services',
  'Telecommunications',
  'Transportation',
  'Wholesale Trade',
];

const ALLOWED_FILE_TYPES = [
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png'
];

const ALLOWED_MIME_TYPES = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/pdf',
  'image/jpeg',
  'image/png'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('company-info');
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const [collaboratorEmailError, setCollaboratorEmailError] = useState<string>('');
  
  const [formData, setFormData] = useState<CompanyData>({
    companyName: '',
    industry: '',
    website: '',
    linkedinUrl: '',
    description: '',
    companyDocuments: [],
    partnerCompanyName: '',
    partnerIndustry: '',
    partnerWebsite: '',
    partnerLinkedin: '',
    partnerDescription: '',
    partnerDocuments: [],
    eventGoals: '',
    targetAudience: '',
    collaborationIdeas: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    collaboratorEmail: '',
  });

  const handleInputChange = (field: keyof CompanyData, value: string | File[]) => {
    try {
      setFormData(prev => ({ ...prev, [field]: value }));
      
      if (field === 'contactEmail' && typeof value === 'string') {
        validateCorporateEmail(value, setEmailError);
      }
      if (field === 'collaboratorEmail' && typeof value === 'string') {
        validateCorporateEmail(value, setCollaboratorEmailError);
      }
    } catch (error) {
      console.error('Error updating form field:', field, error);
    }
  };

  const validateCorporateEmail = (email: string, setError: (error: string) => void): boolean => {
    if (!email) {
      setError('');
      return true;
    }

    try {
      const emailDomain = email.split('@')[1]?.toLowerCase();
      if (!emailDomain) {
        setError('Please enter a valid email address');
        return false;
      }

      if (CONSUMER_EMAIL_DOMAINS.includes(emailDomain)) {
        setError('Corporate email required (no Gmail, Hotmail, Yahoo, etc.)');
        return false;
      }

      setError('');
      return true;
    } catch (error) {
      console.error('Error validating email:', error);
      setError('Invalid email format');
      return false;
    }
  };

  const validateFile = (file: File): boolean => {
    try {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      return ALLOWED_FILE_TYPES.includes(fileExtension) && ALLOWED_MIME_TYPES.includes(file.type);
    } catch (error) {
      console.error('Error validating file:', error);
      return false;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'companyDocuments' | 'partnerDocuments') => {
    try {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files).filter(validateFile);
        
        if (newFiles.length < e.target.files.length) {
          alert('Some files were rejected. Only .doc, .ppt, .pdf, .jpg, and .png files are allowed.');
        }
        
        setFormData(prev => ({
          ...prev,
          [field]: [...prev[field], ...newFiles]
        }));
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    }
  };

  const removeFile = (index: number, field: 'companyDocuments' | 'partnerDocuments') => {
    try {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  const handleGenerateEvent = async () => {
    try {
      setIsGenerating(true);
      
      const formDataToSend = new FormData();
      
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('industry', formData.industry);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('linkedinUrl', formData.linkedinUrl);
      formDataToSend.append('description', formData.description);
      
      formData.companyDocuments.forEach((file) => {
        formDataToSend.append('companyDocuments', file);
      });
      
      formDataToSend.append('partnerCompanyName', formData.partnerCompanyName);
      formDataToSend.append('partnerIndustry', formData.partnerIndustry);
      formDataToSend.append('partnerWebsite', formData.partnerWebsite);
      formDataToSend.append('partnerLinkedin', formData.partnerLinkedin);
      formDataToSend.append('partnerDescription', formData.partnerDescription);
      
      formData.partnerDocuments.forEach((file) => {
        formDataToSend.append('partnerDocuments', file);
      });
      
      formDataToSend.append('eventGoals', formData.eventGoals);
      formDataToSend.append('targetAudience', formData.targetAudience);
      formDataToSend.append('collaborationIdeas', formData.collaborationIdeas);
      formDataToSend.append('contactName', formData.contactName);
      formDataToSend.append('contactEmail', formData.contactEmail);
      formDataToSend.append('contactPhone', formData.contactPhone);
      formDataToSend.append('collaboratorEmail', formData.collaboratorEmail);

      const response = await fetch('/api/parseDocuments', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to parse documents');
      }

      const result = await response.json();
      
      router.push(`/insights?reportId=${result.reportId}`);
    } catch (error) {
      console.error('Error generating event:', error);
      alert('Failed to generate event plan. Please try again.');
      setIsGenerating(false);
    }
  };

  const steps: Record<OnboardingStep, { title: string; icon: JSX.Element; description: string }> = {
    'company-info': {
      title: 'Your Company',
      icon: <Building2 className="w-6 h-6" />,
      description: 'Tell us about your organization',
    },
    'partner-info': {
      title: 'Partner Company',
      icon: <Globe className="w-6 h-6" />,
      description: 'Collaboration partner details',
    },
    'event-details': {
      title: 'Event Details',
      icon: <Target className="w-6 h-6" />,
      description: 'Define collaboration goals',
    },
    'contact-details': {
      title: 'Contact Info',
      icon: <User className="w-6 h-6" />,
      description: 'Your contact details',
    },
    'review': {
      title: 'Review',
      icon: <Sparkles className="w-6 h-6" />,
      description: 'Confirm and generate',
    },
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'company-info':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-lg font-heading text-brand-primary">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Acme Corporation"
                className="border-2 border-brand-border rounded-xl text-lg p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-lg font-heading text-brand-primary">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                <SelectTrigger className="border-2 border-brand-border rounded-xl text-lg p-6 h-auto">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {SINGAPORE_INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-lg font-heading text-brand-primary">Website URL *</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.yourcompany.com"
                className="border-2 border-brand-border rounded-xl text-lg p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="text-lg font-heading text-brand-primary">LinkedIn Profile</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                placeholder="https://www.linkedin.com/company/yourcompany"
                className="border-2 border-brand-border rounded-xl text-lg p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-heading text-brand-primary">Company Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Please share a detailed writeup of your company's products and services that would be of interest to a collaborative partner..."
                className="border-2 border-brand-border rounded-xl text-lg p-6 min-h-64"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-heading text-brand-primary">Supporting Documents (Optional)</Label>
              <p className="text-sm text-gray-600">Accepted formats: .doc, .ppt, .pdf, .jpg, .png</p>
              <div className="border-4 border-dashed border-brand-secondary rounded-3xl p-8 text-center bg-white/50">
                <Upload className="w-12 h-12 text-brand-secondary mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Service brochures, presentations, case studies</p>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'companyDocuments')}
                  className="hidden"
                  id="company-file-upload"
                  accept=".doc,.docx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png"
                />
                <Label htmlFor="company-file-upload" className="cursor-pointer">
                  <Button type="button" className="bg-brand-secondary hover:bg-brand-secondary/90 text-white font-bold rounded-2xl px-6 py-4 pointer-events-none">
                    Choose Files
                  </Button>
                </Label>
              </div>

              {formData.companyDocuments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-base text-brand-primary">Uploaded Files ({formData.companyDocuments.length})</h4>
                  {formData.companyDocuments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/80 p-3 rounded-xl border-2 border-brand-border">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-brand-secondary" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index, 'companyDocuments')}
                        className="text-red-600 hover:text-red-700 h-8"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'partner-info':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="partnerCompanyName" className="text-lg font-heading text-brand-primary">Partner Company Name *</Label>
              <Input
                id="partnerCompanyName"
                value={formData.partnerCompanyName}
                onChange={(e) => handleInputChange('partnerCompanyName', e.target.value)}
                placeholder="Partner Corporation"
                className="border-2 border-brand-border rounded-xl text-lg p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerIndustry" className="text-lg font-heading text-brand-primary">Industry *</Label>
              <Select value={formData.partnerIndustry} onValueChange={(value) => handleInputChange('partnerIndustry', value)}>
                <SelectTrigger className="border-2 border-brand-border rounded-xl text-lg p-6 h-auto">
                  <SelectValue placeholder="Select partner's industry" />
                </SelectTrigger>
                <SelectContent>
                  {SINGAPORE_INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerWebsite" className="text-lg font-heading text-brand-primary">Partner Website *</Label>
              <Input
                id="partnerWebsite"
                type="url"
                value={formData.partnerWebsite}
                onChange={(e) => handleInputChange('partnerWebsite', e.target.value)}
                placeholder="https://www.partnercompany.com"
                className="border-2 border-brand-border rounded-xl text-lg p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerLinkedin" className="text-lg font-heading text-brand-primary">Partner LinkedIn</Label>
              <Input
                id="partnerLinkedin"
                type="url"
                value={formData.partnerLinkedin}
                onChange={(e) => handleInputChange('partnerLinkedin', e.target.value)}
                placeholder="https://www.linkedin.com/company/partner"
                className="border-2 border-brand-border rounded-xl text-lg p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerDescription" className="text-lg font-heading text-brand-primary">Partner Company Description *</Label>
              <Textarea
                id="partnerDescription"
                value={formData.partnerDescription}
                onChange={(e) => handleInputChange('partnerDescription', e.target.value)}
                placeholder="Please share a detailed writeup of the partner company's products and services..."
                className="border-2 border-brand-border rounded-xl text-lg p-6 min-h-64"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-heading text-brand-primary">Partner Supporting Documents (Optional)</Label>
              <p className="text-sm text-gray-600">Accepted formats: .doc, .ppt, .pdf, .jpg, .png</p>
              <div className="border-4 border-dashed border-brand-secondary rounded-3xl p-8 text-center bg-white/50">
                <Upload className="w-12 h-12 text-brand-secondary mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Partner's brochures, presentations, case studies</p>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'partnerDocuments')}
                  className="hidden"
                  id="partner-file-upload"
                  accept=".doc,.docx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png"
                />
                <Label htmlFor="partner-file-upload" className="cursor-pointer">
                  <Button type="button" className="bg-brand-secondary hover:bg-brand-secondary/90 text-white font-bold rounded-2xl px-6 py-4 pointer-events-none">
                    Choose Files
                  </Button>
                </Label>
              </div>

              {formData.partnerDocuments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-base text-brand-primary">Uploaded Files ({formData.partnerDocuments.length})</h4>
                  {formData.partnerDocuments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/80 p-3 rounded-xl border-2 border-brand-border">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-brand-secondary" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index, 'partnerDocuments')}
                        className="text-red-600 hover:text-red-700 h-8"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'event-details':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="eventGoals" className="text-lg font-heading text-brand-primary">Event Goals *</Label>
              <Textarea
                id="eventGoals"
                value={formData.eventGoals}
                onChange={(e) => handleInputChange('eventGoals', e.target.value)}
                placeholder="What do you want to achieve with this collaboration event? (e.g., lead generation, brand awareness, thought leadership)"
                className="border-2 border-brand-border rounded-xl text-lg p-6 min-h-32"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="text-lg font-heading text-brand-primary">Target Audience *</Label>
              <Textarea
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="Who should attend this event? (e.g., CTOs, Marketing Directors, HR Managers, Business Owners)"
                className="border-2 border-brand-border rounded-xl text-lg p-6 min-h-32"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collaborationIdeas" className="text-lg font-heading text-brand-primary">Any Collaboration Ideas? (Optional)</Label>
              <Textarea
                id="collaborationIdeas"
                value={formData.collaborationIdeas}
                onChange={(e) => handleInputChange('collaborationIdeas', e.target.value)}
                placeholder="Share any initial thoughts on how both companies could collaborate..."
                className="border-2 border-brand-border rounded-xl text-lg p-6 min-h-32"
              />
              <p className="text-sm text-gray-600">Our AI engine will analyze all provided information to find the best mutual collaboration opportunities.</p>
            </div>
          </div>
        );

      case 'contact-details':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-lg font-heading text-brand-primary">Full Name *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                placeholder="John Doe"
                className="border-2 border-brand-border rounded-xl text-lg p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-lg font-heading text-brand-primary">Your Corporate Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="john.doe@yourcompany.com"
                className={`border-2 rounded-xl text-lg p-6 ${emailError ? 'border-red-500' : 'border-brand-border'}`}
              />
              {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="collaboratorEmail" className="text-lg font-heading text-brand-primary">Collaborator's Corporate Email (Optional)</Label>
              <Input
                id="collaboratorEmail"
                type="email"
                value={formData.collaboratorEmail}
                onChange={(e) => handleInputChange('collaboratorEmail', e.target.value)}
                placeholder="partner@partnercompany.com"
                className={`border-2 rounded-xl text-lg p-6 ${collaboratorEmailError ? 'border-red-500' : 'border-brand-border'}`}
              />
              {collaboratorEmailError && <p className="text-red-600 text-sm">{collaboratorEmailError}</p>}
              <p className="text-sm text-gray-600">If provided, the event plan PDF will be emailed to both parties</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-lg font-heading text-brand-primary">Phone Number *</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="+65 9123 4567"
                className="border-2 border-brand-border rounded-xl text-lg p-6"
              />
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <Card className="bg-white/90 border-4 border-brand-primary rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-brand-primary">Your Company</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Name:</strong> {formData.companyName}</div>
                <div><strong>Industry:</strong> {formData.industry}</div>
                <div><strong>Website:</strong> {formData.website}</div>
                {formData.linkedinUrl && <div><strong>LinkedIn:</strong> {formData.linkedinUrl}</div>}
                <div><strong>Description:</strong> {formData.description.substring(0, 150)}...</div>
                <div><strong>Documents:</strong> {formData.companyDocuments.length} file(s)</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-4 border-brand-secondary rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-brand-primary">Partner Company</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Name:</strong> {formData.partnerCompanyName}</div>
                <div><strong>Industry:</strong> {formData.partnerIndustry}</div>
                <div><strong>Website:</strong> {formData.partnerWebsite}</div>
                {formData.partnerLinkedin && <div><strong>LinkedIn:</strong> {formData.partnerLinkedin}</div>}
                <div><strong>Description:</strong> {formData.partnerDescription.substring(0, 150)}...</div>
                <div><strong>Documents:</strong> {formData.partnerDocuments.length} file(s)</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-4 border-brand-border rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-brand-primary">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Goals:</strong> {formData.eventGoals}</div>
                <div><strong>Target Audience:</strong> {formData.targetAudience}</div>
                {formData.collaborationIdeas && <div><strong>Collaboration Ideas:</strong> {formData.collaborationIdeas}</div>}
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-4 border-green-600 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-brand-primary">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Name:</strong> {formData.contactName}</div>
                <div><strong>Your Email:</strong> {formData.contactEmail}</div>
                {formData.collaboratorEmail && <div><strong>Collaborator Email:</strong> {formData.collaboratorEmail}</div>}
                <div><strong>Phone:</strong> {formData.contactPhone}</div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-brand-primary">Data Protection Notice:</strong> By submitting this form, I agree to Cadence Connexus collecting, using, and disclosing my personal data for the purpose of generating event plans and providing related services. I understand that my data will be handled in accordance with Singapore's Personal Data Protection Act 2012, and I consent to receiving email communications regarding event planning, collaboration opportunities, and follow-up activities. I may withdraw my consent at any time by contacting <a href="mailto:admin@cconnexus.com" className="text-brand-secondary underline">admin@cconnexus.com</a>.
              </p>
            </div>

            {!isGenerating ? (
              <Button
                onClick={handleGenerateEvent}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-heading font-bold text-2xl py-8 rounded-3xl shadow-lg"
              >
                <Sparkles className="mr-3 w-8 h-8" />
                Generate My Event Plan
              </Button>
            ) : (
              <div className="text-center py-12">
                <div className="animate-spin w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-2xl font-heading font-bold text-brand-primary">Analyzing your information...</p>
                <p className="text-gray-600 mt-2">Our AI is parsing documents and generating comprehensive insights.</p>
              </div>
            )}
          </div>
        );
    }
  };

  const canProceed = () => {
    try {
      switch (currentStep) {
        case 'company-info':
          return !!(formData.companyName && formData.industry && formData.website && formData.description);
        case 'partner-info':
          return !!(formData.partnerCompanyName && formData.partnerIndustry && formData.partnerWebsite && formData.partnerDescription);
        case 'event-details':
          return !!(formData.eventGoals && formData.targetAudience);
        case 'contact-details':
          return !!(
            formData.contactName && 
            formData.contactEmail && 
            formData.contactPhone && 
            !emailError && 
            validateCorporateEmail(formData.contactEmail, setEmailError) &&
            (formData.collaboratorEmail === '' || (!collaboratorEmailError && validateCorporateEmail(formData.collaboratorEmail, setCollaboratorEmailError)))
          );
        case 'review':
          return true;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error in canProceed:', error);
      return false;
    }
  };

  const stepOrder: OnboardingStep[] = ['company-info', 'partner-info', 'event-details', 'contact-details', 'review'];
  const currentStepIndex = stepOrder.indexOf(currentStep);

  return (
    <main className="relative min-h-screen bg-gray-50">
      <div className="relative z-10 min-h-screen px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="flex justify-between items-start mb-4">
              {stepOrder.map((step, index) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    <div className={`flex flex-col items-center justify-center ${index < stepOrder.length - 1 ? 'flex-1' : ''}`}>
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 mb-2 ${
                        index <= currentStepIndex 
                          ? 'bg-brand-primary border-brand-primary text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {index < currentStepIndex ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          steps[step].icon
                        )}
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-bold ${index <= currentStepIndex ? 'text-brand-primary' : 'text-gray-400'}`}>
                          {steps[step].title}
                        </p>
                      </div>
                    </div>
                    {index < stepOrder.length - 1 && (
                      <div className={`h-1 flex-1 mx-2 rounded-full ${
                        index < currentStepIndex ? 'bg-brand-primary' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-white backdrop-blur-sm border-4 border-brand-border rounded-3xl shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                {steps[currentStep].icon}
              </div>
              <CardTitle className="text-4xl font-heading font-bold text-brand-primary">
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription className="text-xl text-gray-600">
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {renderStepContent()}

              {currentStep !== 'review' && (
                <div className="flex gap-4 mt-8">
                  {currentStepIndex > 0 && (
                    <Button
                      onClick={() => setCurrentStep(stepOrder[currentStepIndex - 1])}
                      variant="outline"
                      className="flex-1 border-2 border-brand-primary text-brand-primary font-bold rounded-2xl py-6 text-lg hover:bg-brand-primary hover:text-white"
                    >
                      <ArrowLeft className="mr-2 w-5 h-5" />
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={() => setCurrentStep(stepOrder[currentStepIndex + 1])}
                    disabled={!canProceed()}
                    className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-2xl py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
