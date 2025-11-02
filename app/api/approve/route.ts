import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EventPlan } from '@/types/schemas';
import { canApprove, recordApproval, getNextState } from '@/lib/workflow-service';
import { sendEmail, getApprovalConfirmationTemplate } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
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

    const { eventId, approverEmail } = await request.json();

    const { data, error } = await supabaseAdmin
      .from('event_plans')
      .select('data')
      .eq('id', eventId)
      .single();

    if (error || !data) {
      throw new Error('Event plan not found');
    }

    let eventPlan = data.data as EventPlan;

    const company = canApprove(eventPlan, approverEmail);
    if (!company) {
      return NextResponse.json(
        { error: 'Not authorized to approve' },
        { status: 403 }
      );
    }

    eventPlan = recordApproval(eventPlan, company, approverEmail);

    const trigger = company === 'A' ? 'approve_A' : 'approve_B';
    const nextState = getNextState(eventPlan.approval.state, trigger);
    
    if (nextState) {
      eventPlan.approval.state = nextState as EventPlan['approval']['state'];
    }

    await supabaseAdmin
      .from('event_plans')
      .update({ data: eventPlan, updated_at: new Date().toISOString() })
      .eq('id', eventId);

    // Send confirmation email
    const nextSteps = eventPlan.approval.state === 'approved' 
      ? 'All approvals received. The event will be published to Eventbrite shortly.'
      : 'Waiting for approval from the other company.';

    await sendEmail({
      to: approverEmail,
      subject: `Approval Confirmed: ${eventPlan.eventDetails.title}`,
      html: getApprovalConfirmationTemplate(
        eventPlan.eventDetails.title,
        approverEmail,
        nextSteps
      )
    });

    return NextResponse.json({ success: true, eventPlan });
  } catch (error) {
    console.error('Approve error:', error);
    return NextResponse.json(
      { error: 'Failed to approve event plan' },
      { status: 500 }
    );
  }
}
