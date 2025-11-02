# Cadence Connexus Platform

**Where Collaboration Finds Its Rhythm**

A comprehensive platform enabling SMEs and consultancies to co-create, approve, and publish joint event plans automatically to Eventbrite.

## 🚀 Features

- **AI-Powered Event Generation**: Upload company profiles and generate complete event plans with one click
- **Dual Approval Workflow**: Two-party approval system with email notifications
- **Eventbrite Integration**: Automatic draft creation and participant sync
- **Master Plan Templates**: Professional event documentation with 9 structured sections
- **Export Capabilities**: PDF plans, PPTX decks, and participant CSV exports
- **Email Automation**: Review requests, approval notices, and post-event follow-ups

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth
- **AI**: ChatAndBuild/OpenAI API
- **Email**: SendGrid or SMTP
- **Events**: Eventbrite API
- **Payments**: Stripe (optional)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Eventbrite API token and organization ID
- SendGrid API key or SMTP credentials
- ChatAndBuild/OpenAI API key

## 🔧 Installation

1. **Clone and install dependencies**:
```bash
npx create-next-app@latest cadence-connexus
cd cadence-connexus
npm install
```

2. **Configure environment variables**:
Copy `.env.local` and fill in your credentials:
- Supabase URL and keys
- ChatAndBuild/OpenAI API key
- Eventbrite token and org ID
- Email service credentials

3. **Deploy Supabase schema**:
Run the SQL migrations in your Supabase dashboard:
- `supabase_schema.sql` (creates tables)
- `permissions.policies.sql` (sets up RLS)

4. **Start development server**:
```bash
npm run dev
```

## 📁 Project Structure

```
app/
├── api/                    # API routes
│   ├── generateEvent/      # AI event generation
│   ├── requestApproval/    # Send review emails
│   ├── approve/            # Record approvals
│   ├── createEventbriteDraft/  # Eventbrite integration
│   └── pullParticipants/   # Sync attendees
├── onboarding/             # Company profile collection
├── dashboard/              # Event management
└── review/                 # Approval interface

lib/
├── supabase.ts             # Client-side Supabase
├── supabase-server.ts      # Server-side Supabase (service role)
├── email-service.ts        # Email templates and sending
├── eventbrite-service.ts   # Eventbrite API wrapper
├── workflow-service.ts     # Approval state machine
└── template-renderer.ts    # Master plan generation

types/
└── schemas.ts              # TypeScript interfaces
```

## 🔐 Security

- **Row Level Security (RLS)**: Multi-tenant data isolation
- **Service Role**: Delete operations restricted to server-side only
- **Email Verification**: Approval links with secure tokens
- **Environment Variables**: All secrets in `.env.local`

## 🌊 Approval Workflow

1. **Draft** → Generate event plan from company profiles
2. **Awaiting Review A** → Company A receives email to review
3. **Awaiting Review B** → After A approves, Company B reviews
4. **Approved** → Both parties approved, ready for Eventbrite
5. **Published** → Event created on Eventbrite

## 📧 Email Templates

- **Review Request**: Sent when approval is needed
- **Approved Notice**: Sent when both parties approve
- **Post-Event Follow-Up**: Sent after event with resources

## 🎯 API Endpoints

- `POST /api/generateEvent` - Generate event plan from profiles
- `POST /api/requestApproval` - Send review email
- `POST /api/approve` - Record approval and transition state
- `POST /api/createEventbriteDraft` - Create Eventbrite event
- `POST /api/pullParticipants` - Sync attendees from Eventbrite

## 🚢 Deployment

Deploy to Vercel:
```bash
npm i -g vercel
vercel
```

Configure environment variables in Vercel dashboard.

## 📄 License

Proprietary - Cadence Connexus Platform

## 🤝 Support

For questions or issues, contact: support@cadenceconnexus.com
