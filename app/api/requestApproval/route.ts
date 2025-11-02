import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email-service';
import { EventPlan } from '@/types/schemas';

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

    const { eventId } = await request.json();

    // Fetch event plan
    const { data, error } = await supabaseAdmin
      .from('event_plans')
      .select('data')
      .eq('id', eventId)
      .single();

    if (error || !data) {
      throw new Error('Event plan not found');
    }

    const eventPlan = data.data as EventPlan;

    // Send review request based on current state
    if (eventPlan.approval.state === 'awaiting_review_A') {
      await sendEmail({
        to: eventPlan.approval.companyA_contact.email,
        template: 'review_request',
        variables: {
          name: eventPlan.approval.companyA_contact.name,
          title: eventPlan.title,
          review_url: `${process.env.NEXT_PUBLIC_APP_URL}/review/${eventPlan.id}`
        }
      });
    } else if (eventPlan.approval.state === 'awaiting_review_B') {
      await sendEmail({
        to: eventPlan.approval.companyB_contact.email,
        template: 'review_request',
        variables: {
          name: eventPlan.approval.companyB_contact.name,
          title: eventPlan.title,
          review_url: `${process.env.NEXT_PUBLIC_APP_URL}/review/${eventPlan.id}`
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Request approval error:', error);
    return NextResponse.json(
      { error: 'Failed to send approval request' },
      { status: 500 }
    );
  }
}
