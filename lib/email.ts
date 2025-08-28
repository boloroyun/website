// Lazy initialization - no top-level imports that create instances
let resendInstance: any = null;
let nodemailerTransporter: any = null;

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
  if (process.env.RESEND_API_KEY) {
    try {
      console.log('📧 Attempting to send email via Resend...');

      // Lazy load Resend
      if (!resendInstance) {
        const { Resend } = await import('resend');
        resendInstance = new Resend(process.env.RESEND_API_KEY);
      }

      const result = await resendInstance.emails.send({
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

  // Environment validation for Nodemailer
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('Email service not configured properly');
  }

  // Fallback to Nodemailer - lazy initialization
  try {
    console.log('📧 Attempting to send email via Nodemailer...');

    if (!nodemailerTransporter) {
      const nodemailer = await import('nodemailer');
      nodemailerTransporter = nodemailer.default.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });
    }

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

export async function generateVerificationEmailHtml(
  username: string,
  code: string
): Promise<string> {
  try {
    // Try to use React Email if available
    const { render } = await import('@react-email/components');
    const VerificationCodeEmail = (await import('@/emails/verification-code')).default;
    
    return await render(VerificationCodeEmail({
      username,
      verificationCode: code,
    }));
  } catch (error) {
    console.log('React Email not available, using fallback HTML template');
    
    // Fallback HTML template
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
              background-color: #f6f9fc;
            }
            .container {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              max-width: 560px;
              margin: 0 auto;
            }
            .header { 
              background: #000000; 
              color: white; 
              padding: 32px 24px; 
              text-align: center; 
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
            }
            .content { 
              padding: 32px 24px; 
            }
            .greeting {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 24px;
              color: #484848;
            }
            .message {
              font-size: 16px;
              margin-bottom: 24px;
              color: #484848;
              line-height: 1.4;
            }
            .code-container { 
              background: #f4f4f4; 
              border: 2px dashed #d1d1d1; 
              border-radius: 8px; 
              padding: 24px; 
              text-align: center; 
              margin: 32px 0; 
            }
            .code-number { 
              font-size: 32px; 
              font-weight: bold; 
              color: #000000; 
              letter-spacing: 8px; 
              margin: 0;
              font-family: Monaco, Consolas, "Lucida Console", monospace;
            }
            .footer { 
              font-size: 14px;
              line-height: 1.4;
              color: #898989;
              margin: 32px 0 0 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Lux Store!</h1>
            </div>
            <div class="content">
              <div class="greeting">Hi ${username},</div>
              <div class="message">
                Thank you for signing up with Lux Store! To complete your account setup, please use the verification code below:
              </div>
              
              <div class="code-container">
                <div class="code-number">${code}</div>
              </div>
              
              <div class="message">
                This code is valid for 10 minutes. If you didn't request this code, please ignore this email.
              </div>
              
              <div class="footer">
                Best regards,<br>
                The Lux Store Team
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
