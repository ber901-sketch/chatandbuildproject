import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EventPlan } from '@/types/schemas';
import { createEventbriteDraft } from '@/lib/eventbrite-service';

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

    // Check if both parties approved
    if (eventPlan.approval.state !== 'approved') {
      return NextResponse.json(
        { error: 'Event plan not yet approved by both parties' },
        { status: 400 }
      );
    }

    // Create Eventbrite draft
    const { eventId: eventbriteId, url } = await createEventbriteDraft(eventPlan);

    // Update event plan with Eventbrite details
    eventPlan.eventbrite = {
      eventId: eventbriteId,
      url
    };
    eventPlan.approval.state = 'published';
    eventPlan.updatedAt = new Date().toISOString();

    await supabaseAdmin
      .from('event_plans')
      .update({ data: eventPlan, updated_at: eventPlan.updatedAt })
      .eq('id', eventId);

    return NextResponse.json({ 
      success: true, 
      eventbriteId, 
      url 
    });
  } catch (error) {
    console.error('Create Eventbrite draft error:', error);
    return NextResponse.json(
      { error: 'Failed to create Eventbrite draft' },
      { status: 500 }
    );
  }
}
