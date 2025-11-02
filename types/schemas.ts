// CompanyProfile Schema
export interface CompanyProfile {
  id?: string;
  name: string;
  shortDescription: string;
  website?: string;
  linkedin?: string;
  socials?: string[];
  employeesEstimate?: number;
  singaporeEmployeesEstimate?: number;
  industryTags: string[];
  offerings: string[];
  goals: string[];
  docs?: Array<{
    name: string;
    text: string;
  }>;
  rawSources?: string[];
}

// EventPlan Schema
export interface EventPlan {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  tone?: string;
  objectives: string[];
  audiencePersonas?: Array<{
    role: string;
    painPoints: string[];
    valueProps: string[];
  }>;
  KPIs?: Array<{
    key: string;
    target: string;
  }>;
  agenda: Array<{
    startMin: number;
    endMin: number;
    title: string;
    speaker?: string;
    format: string;
    notes?: string;
  }>;
  deliverables?: string[];
  marketingAssets: {
    landingHero?: string;
    emailSubjects?: string[];
    emailBodies?: Array<{
      pre: string;
      post: string;
    }>;
    socialPosts?: string[];
  };
  pilotTemplate: {
    objective: string;
    metrics: string[];
    durationWeeks: number;
    pricingTiers: Array<{
      tier: string;
      priceSGD: number;
      includes: string[];
    }>;
  };
  logistics?: string[];
  speakerBriefs?: Array<{
    role: string;
    bullets: string[];
  }>;
  approval: {
    state: 'awaiting_review_A' | 'awaiting_review_B' | 'approved' | 'published';
    companyA_contact: {
      name: string;
      role: string;
      email: string;
    };
    companyB_contact: {
      name: string;
      role: string;
      email: string;
    };
    approvers?: Array<{
      company: string;
      approvedAt: string;
      approvedBy: string;
    }>;
    approvalHistory?: Array<{
      timestamp: string;
      action: string;
      by: string;
    }>;
  };
  exports?: {
    pdf?: string;
    pptx?: string;
    csv?: string;
  };
  eventbrite?: {
    eventId?: string;
    url?: string;
  };
  inferredFields?: string[];
  sourceCitations?: string[];
  createdAt: string;
  updatedAt?: string;
}
