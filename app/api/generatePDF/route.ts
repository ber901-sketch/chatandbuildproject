import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { reportData } = await request.json();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #222; }
          h1 { color: #1E4D8C; font-size: 32px; margin-bottom: 10px; }
          h2 { color: #1E4D8C; font-size: 24px; margin-top: 30px; border-bottom: 2px solid #5EA3F2; padding-bottom: 5px; }
          h3 { color: #1E4D8C; font-size: 18px; margin-top: 20px; }
          .section { margin-bottom: 30px; }
          .badge { display: inline-block; background: #5EA3F2; color: white; padding: 5px 10px; border-radius: 15px; margin: 5px; font-size: 12px; }
          .document { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 8px; }
          ul { line-height: 1.8; }
          .timestamp { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>Collaboration Insights Report</h1>
        <p class="timestamp">Generated on ${new Date(reportData.timestamp).toLocaleString()}</p>
        
        <div class="section">
          <h2>${reportData.companyInsights.name}</h2>
          <p><strong>Industry:</strong> ${reportData.companyInsights.industry}</p>
          <p>${reportData.companyInsights.description}</p>
          
          <h3>Documents Analyzed (${reportData.companyInsights.documents.length})</h3>
          ${reportData.companyInsights.documents.map((doc: any) => `
            <div class="document">
              <strong>${doc.filename}</strong> - ${doc.wordCount} words
            </div>
          `).join('')}
          
          <h3>Key Topics</h3>
          <div>
            ${reportData.companyInsights.keyTopics.map((topic: string) => `<span class="badge">${topic}</span>`).join('')}
          </div>
        </div>
        
        <div class="section">
          <h2>${reportData.partnerInsights.name}</h2>
          <p><strong>Industry:</strong> ${reportData.partnerInsights.industry}</p>
          <p>${reportData.partnerInsights.description}</p>
          
          <h3>Documents Analyzed (${reportData.partnerInsights.documents.length})</h3>
          ${reportData.partnerInsights.documents.map((doc: any) => `
            <div class="document">
              <strong>${doc.filename}</strong> - ${doc.wordCount} words
            </div>
          `).join('')}
          
          <h3>Key Topics</h3>
          <div>
            ${reportData.partnerInsights.keyTopics.map((topic: string) => `<span class="badge">${topic}</span>`).join('')}
          </div>
        </div>
        
        <div class="section">
          <h2>Collaboration Opportunities</h2>
          
          <h3>Strategic Synergies</h3>
          <ul>
            ${reportData.collaborationInsights.synergies.map((s: string) => `<li>${s}</li>`).join('')}
          </ul>
          
          <h3>Target Audience</h3>
          <div>
            ${reportData.collaborationInsights.targetAudience.map((a: string) => `<span class="badge">${a}</span>`).join('')}
          </div>
          
          <h3>Event Goals</h3>
          <ul>
            ${reportData.collaborationInsights.eventGoals.map((g: string) => `<li>${g}</li>`).join('')}
          </ul>
          
          <h3>Recommendations</h3>
          <p><strong>Format:</strong> ${reportData.collaborationInsights.recommendedFormat}</p>
          <p><strong>Estimated Attendance:</strong> ${reportData.collaborationInsights.estimatedAttendees}</p>
        </div>
      </body>
      </html>
    `;

    const pdfResponse = await fetch('https://api.html2pdf.app/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: htmlContent,
        format: 'A4',
        printBackground: true,
      })
    });

    if (!pdfResponse.ok) {
      throw new Error('PDF generation service failed');
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="collaboration-insights-${reportData.reportId}.pdf"`
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
