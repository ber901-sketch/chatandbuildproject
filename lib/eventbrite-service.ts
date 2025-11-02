import { EventPlan } from '@/types/schemas';

interface EventbriteEvent {
  name: { html: string };
  summary: string;
  description: { html: string };
  start: { timezone: string; utc: string };
  end: { timezone: string; utc: string };
  online_event: boolean;
  listed: boolean;
  currency: string;
  capacity: number;
  is_series: boolean;
  shareable: boolean;
  invite_only: boolean;
}

export async function createEventbriteDraft(eventPlan: EventPlan): Promise<{ eventId: string; url: string }> {
  const token = process.env.EVENTBRITE_TOKEN;
  const orgId = process.env.EVENTBRITE_ORG_ID;

  if (!token || !orgId) {
    throw new Error('Eventbrite credentials not configured');
  }

  // Calculate event duration from agenda
  const totalMinutes = eventPlan.agenda[eventPlan.agenda.length - 1]?.endMin || 120;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 30); // Default to 30 days from now
  const endDate = new Date(startDate.getTime() + totalMinutes * 60000);

  const payload: { event: EventbriteEvent } = {
    event: {
      name: {
        html: eventPlan.title
      },
      summary: eventPlan.description.substring(0, 140),
      description: {
        html: `<p>${eventPlan.description}</p><p>${eventPlan.marketingAssets.landingHero || ''}</p>`
      },
      start: {
        timezone: 'Asia/Singapore',
        utc: startDate.toISOString()
      },
      end: {
        timezone: 'Asia/Singapore',
        utc: endDate.toISOString()
      },
      online_event: true,
      listed: true,
      currency: 'SGD',
      capacity: 100,
      is_series: false,
      shareable: true,
      invite_only: false
    }
  };

  const response = await fetch(`https://www.eventbriteapi.com/v3/organizations/${orgId}/events/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Eventbrite API error: ${error}`);
  }

  const data = await response.json();
  return {
    eventId: data.id,
    url: data.url
  };
}

export async function pullParticipants(eventId: string): Promise<any[]> {
  const token = process.env.EVENTBRITE_TOKEN;

  if (!token) {
    throw new Error('Eventbrite token not configured');
  }

  const response = await fetch(`https://www.eventbriteapi.com/v3/events/${eventId}/attendees/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch participants');
  }

  const data = await response.json();
  return data.attendees || [];
}
