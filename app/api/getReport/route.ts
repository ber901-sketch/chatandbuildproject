import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reportId = searchParams.get('reportId');

    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    // Mock report data for now - in production, fetch from Supabase
    const mockReport = {
      companyA: {
        name: 'TechFlow Solutions',
        industry: 'Information Technology',
        keyOfferings: [
          'Cloud Infrastructure Management',
          'DevOps Automation Tools',
          'Cybersecurity Solutions',
          'AI-Powered Analytics Platform'
        ],
        strengths: [
          'Strong technical expertise in cloud technologies',
          'Established client base in enterprise sector',
          'Innovative product development pipeline',
          'Excellent customer retention rate (95%)'
        ]
      },
      companyB: {
        name: 'GrowthHub Marketing',
        industry: 'Marketing & Advertising',
        keyOfferings: [
          'Digital Marketing Strategy',
          'Content Creation & Management',
          'Social Media Marketing',
          'Marketing Automation'
        ],
        strengths: [
          'Creative team with award-winning campaigns',
          'Deep understanding of B2B marketing',
          'Strong ROI track record',
          'Extensive network of industry influencers'
        ]
      },
      keyTopics: [
        'Digital Transformation',
        'B2B Marketing',
        'Cloud Technology',
        'Lead Generation',
        'Customer Engagement',
        'Data Analytics',
        'Marketing Automation',
        'Cybersecurity Awareness'
      ],
      collaborationOpportunities: [
        {
          title: 'Joint Webinar Series: "Secure Your Digital Transformation"',
          description: 'Co-host a 4-part webinar series combining TechFlow\'s cybersecurity expertise with GrowthHub\'s marketing reach. Target CTOs and CMOs navigating digital transformation challenges. Each session would feature case studies, live demos, and Q&A sessions.',
          impact: 'high' as const
        },
        {
          title: 'Co-Branded Content Hub',
          description: 'Create a comprehensive resource center featuring whitepapers, case studies, and guides on implementing secure cloud solutions. GrowthHub handles content strategy and distribution while TechFlow provides technical expertise.',
          impact: 'high' as const
        },
        {
          title: 'Partner Referral Program',
          description: 'Establish a structured referral program where GrowthHub refers clients needing technical infrastructure to TechFlow, and TechFlow refers clients needing marketing support to GrowthHub. Include co-branded proposals and joint account management.',
          impact: 'medium' as const
        },
        {
          title: 'Industry Conference Co-Sponsorship',
          description: 'Co-sponsor and co-present at major industry conferences focusing on digital transformation. Share booth space, speaking slots, and networking events to maximize visibility and lead generation.',
          impact: 'medium' as const
        },
        {
          title: 'Joint Case Study Development',
          description: 'Collaborate on detailed case studies showcasing successful client transformations that involved both companies\' services. Use these for sales enablement and thought leadership.',
          impact: 'low' as const
        }
      ],
      strategicSynergies: [
        'TechFlow\'s technical solutions complement GrowthHub\'s marketing services, creating a complete digital transformation offering',
        'Both companies target similar B2B enterprise clients, enabling efficient cross-selling opportunities',
        'GrowthHub can help TechFlow improve their market positioning and lead generation, while TechFlow can provide technical infrastructure for GrowthHub\'s marketing automation needs',
        'Combined expertise allows for comprehensive client solutions spanning technology implementation and market adoption',
        'Shared commitment to innovation and customer success creates strong cultural alignment'
      ],
      targetAudience: {
        personas: [
          'Chief Technology Officers',
          'Chief Marketing Officers',
          'VP of Digital Transformation',
          'IT Directors',
          'Marketing Directors',
          'Business Development Managers'
        ],
        painPoints: [
          'Struggling to align technology investments with marketing outcomes',
          'Difficulty demonstrating ROI on digital transformation initiatives',
          'Lack of integrated approach to technology and marketing strategy',
          'Security concerns hindering digital marketing initiatives',
          'Siloed operations between IT and marketing departments'
        ],
        valueProposition: 'A unified approach to digital transformation that seamlessly integrates cutting-edge technology infrastructure with strategic marketing execution, enabling businesses to not only implement powerful solutions but also effectively communicate their value to the market and drive measurable business growth.'
      },
      recommendations: [
        'Start with a pilot webinar to test audience engagement and refine messaging before committing to a full series',
        'Develop a joint value proposition document that clearly articulates the combined offering to potential clients',
        'Create a shared CRM system or integration to track referrals and measure collaboration success',
        'Establish quarterly business reviews to assess partnership performance and identify new opportunities',
        'Consider developing a co-branded service package that bundles both companies\' offerings at a competitive price point',
        'Invest in joint sales training so both teams can effectively represent the partnership value',
        'Launch a pilot project with a mutual client to create a compelling success story for future marketing'
      ]
    };

    return NextResponse.json({ success: true, report: mockReport });
  } catch (error) {
    console.error('Get report error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}
