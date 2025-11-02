import { NextRequest, NextResponse } from 'next/server';
import { pullParticipants } from '@/lib/eventbrite-service';

export async function POST(request: NextRequest) {
  try {
    const { eventbriteId } = await request.json();

    if (!eventbriteId) {
      return NextResponse.json(
        { error: 'Eventbrite ID required' },
        { status: 400 }
      );
    }

    const participants = await pullParticipants(eventbriteId);

    return NextResponse.json({ 
      success: true, 
      participants,
      count: participants.length 
    });
  } catch (error) {
    console.error('Pull participants error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}
