import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Initialize Resend (if API key is provided)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Nodemailer transporter (fallback)
const nodemailerTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  const defaultFrom =
    from ||
    `"LUX Cabinets & Stones" <${process.env.SMTP_USER || 'noreply@luxcabinetsandstones.com'}>`;

  // Try Resend first (if available)
  if (resend && process.env.RESEND_API_KEY) {
    try {
      console.log('📧 Attempting to send email via Resend...');
      const result = await resend.emails.send({
        from: defaultFrom,
        to,
        subject,
        html,
      });
      console.log('✅ Email sent successfully via Resend:', result.data?.id);
      return { success: true, provider: 'resend', id: result.data?.id };
    } catch (error) {
      console.error('❌ Resend failed:', error);
      // Fall through to nodemailer
    }
  }

  // Fallback to Nodemailer
  try {
    console.log('📧 Attempting to send email via Nodemailer...');
    const result = await nodemailerTransporter.sendMail({
      from: defaultFrom,
      to,
      subject,
      html,
    });
    console.log('✅ Email sent successfully via Nodemailer:', result.messageId);
    return { success: true, provider: 'nodemailer', id: result.messageId };
  } catch (error) {
    console.error('❌ Nodemailer failed:', error);
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export function generateVerificationEmailHtml(
  username: string,
  code: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code - LUX Cabinets & Stones</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 8px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content { 
            padding: 40px 30px; 
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #2d3748;
          }
          .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #4a5568;
          }
          .code-container { 
            background: #f7fafc; 
            border: 2px solid #667eea; 
            border-radius: 12px; 
            padding: 30px; 
            text-align: center; 
            margin: 30px 0; 
          }
          .code-label {
            font-size: 14px;
            color: #718096;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }
          .code-number { 
            font-size: 36px; 
            font-weight: 800; 
            color: #667eea; 
            letter-spacing: 8px; 
            font-family: 'Courier New', monospace;
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 30px 0; 
            color: #856404; 
          }
          .warning-title {
            font-weight: 600;
            margin-bottom: 8px;
          }
          .footer { 
            text-align: center; 
            padding: 30px; 
            background: #f8f9fa;
            color: #718096; 
            font-size: 14px; 
            border-top: 1px solid #e2e8f0;
          }
          .footer-title {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
          }
          .contact-info {
            margin-top: 15px;
          }
          @media (max-width: 600px) {
            body { padding: 10px; }
            .header, .content { padding: 30px 20px; }
            .code-number { font-size: 28px; letter-spacing: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LUX Cabinets & Stones</h1>
            <p>Your Verification Code</p>
          </div>
          <div class="content">
            <div class="greeting">Hello ${username}!</div>
            <div class="message">
              Thank you for choosing LUX Cabinets & Stones. To complete your login, please use the verification code below:
            </div>
            
            <div class="code-container">
              <div class="code-label">Your verification code is:</div>
              <div class="code-number">${code}</div>
            </div>
            
            <div class="warning">
              <div class="warning-title">Important:</div>
              This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </div>
            
            <div class="message">
              If you have any questions, feel free to contact our support team.
            </div>
            
            <div class="message">
              Best regards,<br>
              <strong>LUX Cabinets & Stones Team</strong>
            </div>
          </div>
          <div class="footer">
            <div class="footer-title">LUX Cabinets & Stones</div>
            <div>© ${new Date().getFullYear()} All rights reserved.</div>
            <div class="contact-info">
              25557 Donegal Dr, Chantilly, VA 20152<br>
              Phone: (703) 555-0123 | Email: info@luxcabinetsandstones.com
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
