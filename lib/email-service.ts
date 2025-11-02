import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  template?: string;
  variables?: Record<string, string>;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

export function getApprovalEmailTemplate(
  eventTitle: string,
  approverName: string,
  approvalLink: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1E4D8C; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #5EA3F2; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Plan Approval Required</h1>
          </div>
          <div class="content">
            <p>Hello ${approverName},</p>
            <p>A new event plan requires your approval:</p>
            <h2>${eventTitle}</h2>
            <p>Please review and approve the event plan by clicking the button below:</p>
            <a href="${approvalLink}" class="button">Review & Approve</a>
            <p>If you have any questions, please contact the event organizer.</p>
          </div>
          <div class="footer">
            <p>© 2024 Cadence Connexus. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getApprovalConfirmationTemplate(
  eventTitle: string,
  approverName: string,
  nextSteps: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1E4D8C; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .success { color: #28a745; font-weight: bold; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Approval Confirmed</h1>
          </div>
          <div class="content">
            <p>Hello ${approverName},</p>
            <p class="success">✓ Your approval has been recorded</p>
            <h2>${eventTitle}</h2>
            <p><strong>Next Steps:</strong></p>
            <p>${nextSteps}</p>
          </div>
          <div class="footer">
            <p>© 2024 Cadence Connexus. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
