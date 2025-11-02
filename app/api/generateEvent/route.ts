import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CompanyProfile, EventPlan } from '@/types/schemas';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client inside request handler
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const body = await request.json();
    const { companyA, companyB, organizerEmail } = body as {
      companyA: CompanyProfile;
      companyB: CompanyProfile;
      organizerEmail: string;
    };

    // Generate event plan using ChatAndBuild/OpenAI
    const prompt = `Generate a comprehensive collaboration event plan for two companies:

Company A: ${companyA.name}
- Description: ${companyA.shortDescription}
- Offerings: ${companyA.offerings.join(', ')}
- Goals: ${companyA.goals.join(', ')}

Company B: ${companyB.name}
- Description: ${companyB.shortDescription}
- Offerings: ${companyB.offerings.join(', ')}
- Goals: ${companyB.goals.join(', ')}

Create a detailed event plan with:
1. Compelling title and description
2. 3-5 clear objectives
3. Target audience personas with pain points and value propositions
4. 2-hour agenda with 6-8 sessions
5. Marketing assets (landing page hero, email subjects, social posts)
6. Pilot program template with 3 pricing tiers
7. Speaker briefs and logistics

Format the response as a JSON object matching the EventPlan schema.`;

    const aiResponse = await fetch(process.env.CHATANDBUILD_API_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHATANDBUILD_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert event planner specializing in B2B collaboration events.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!aiResponse.ok) {
      throw new Error('AI generation failed');
    }

    const aiData = await aiResponse.json();
    const generatedPlan = JSON.parse(aiData.choices[0].message.content);

    // Create EventPlan with approval workflow
    const eventPlan: EventPlan = {
      ...generatedPlan,
      id: `evt-${Date.now()}`,
      approval: {
        state: 'awaiting_review_A',
        companyA_contact: {
          name: companyA.name,
          role: 'Primary Contact',
          email: organizerEmail
        },
        companyB_contact: {
          name: companyB.name,
          role: 'Partner Contact',
          email: organizerEmail // TODO: Get from form
        },
        approvers: [],
        approvalHistory: []
      },
      createdAt: new Date().toISOString()
    };

    // Save to Supabase
    const { data, error } = await supabaseAdmin
      .from('event_plans')
      .insert({
        id: eventPlan.id,
        data: eventPlan
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Send review request to Company A
    await sendEmail({
      to: eventPlan.approval.companyA_contact.email,
      template: 'review_request',
      variables: {
        name: eventPlan.approval.companyA_contact.name,
        title: eventPlan.title,
        review_url: `${process.env.NEXT_PUBLIC_APP_URL}/review/${eventPlan.id}`
      }
    });

    return NextResponse.json({ success: true, eventPlan: data.data });
  } catch (error) {
    console.error('Generate event error:', error);
    return NextResponse.json(
      { error: 'Failed to generate event plan' },
      { status: 500 }
    );
  }
}
