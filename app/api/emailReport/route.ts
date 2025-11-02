import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { reportData } = await request.json();

    const emailBody = `
      <h1>Your Collaboration Insights Report is Ready</h1>
      <p>Dear ${reportData.contactInfo.name},</p>
      <p>We've completed the analysis of your collaboration opportunity between <strong>${reportData.companyInsights.name}</strong> and <strong>${reportData.partnerInsights.name}</strong>.</p>
      
      <h2>Key Highlights:</h2>
      <ul>
        <li><strong>Documents Analyzed:</strong> ${reportData.companyInsights.documents.length + reportData.partnerInsights.documents.length} files</li>
        <li><strong>Total Content:</strong> ${(reportData.companyInsights.totalWords + reportData.partnerInsights.totalWords).toLocaleString()} words</li>
        <li><strong>Strategic Synergies Identified:</strong> ${reportData.collaborationInsights.synergies.length}</li>
      </ul>
      
      <p>Please log in to your Cadence Connexus dashboard to view the full interactive report and proceed with event generation.</p>
      
      <p>Best regards,<br>The Cadence Connexus Team</p>
    `;

    await sendEmail({
      to: reportData.contactInfo.email,
      template: 'custom',
      subject: 'Your Collaboration Insights Report is Ready',
      html: emailBody
    });

    if (reportData.contactInfo.collaboratorEmail) {
      await sendEmail({
        to: reportData.contactInfo.collaboratorEmail,
        template: 'custom',
        subject: 'Collaboration Insights Report - Partnership Opportunity',
        html: emailBody.replace(reportData.contactInfo.name, 'Partner')
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Email report error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
