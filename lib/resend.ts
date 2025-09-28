import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  projectType?: string;
  budget?: string;
}

export async function sendContactEmail(data: ContactEmailData) {
  try {
    const { name, email, phone, subject, message, projectType, budget } = data;

    // Create HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; padding: 8px; background: white; border-radius: 4px; border-left: 4px solid #667eea; }
            .message-box { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #667eea; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 New Contact Form Submission</h1>
              <p>LUX Cabinets & Stones Website</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              ${
                phone
                  ? `
              <div class="field">
                <div class="label">📞 Phone:</div>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              `
                  : ''
              }
              
              <div class="field">
                <div class="label">📋 Subject:</div>
                <div class="value">${subject}</div>
              </div>
              
              ${
                projectType
                  ? `
              <div class="field">
                <div class="label">🏗️ Project Type:</div>
                <div class="value">${projectType}</div>
              </div>
              `
                  : ''
              }
              
              ${
                budget
                  ? `
              <div class="field">
                <div class="label">💰 Budget Range:</div>
                <div class="value">${budget}</div>
              </div>
              `
                  : ''
              }
              
              <div class="field">
                <div class="label">💬 Message:</div>
                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
              </div>
              
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
              
              <p style="font-size: 12px; color: #666;">
                📅 Submitted: ${new Date().toLocaleString()}<br>
                🌐 Source: LUX Cabinets & Stones Website Contact Form
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create plain text version
    const textContent = `
New Contact Form Submission - LUX Cabinets & Stones

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Subject: ${subject}
${projectType ? `Project Type: ${projectType}` : ''}
${budget ? `Budget Range: ${budget}` : ''}

Message:
${message}

---
Submitted: ${new Date().toLocaleString()}
Source: LUX Cabinets & Stones Website Contact Form
    `;

    // Send email using Resend
    const result = await resend.emails.send({
      from: 'LUX Cabinets & Stones <noreply@luxcabistones.com>',
      to: ['info@luxcabistones.com'],
      replyTo: email, // Allow direct reply to customer
      subject: `🏠 New Contact: ${subject}`,
      html: htmlContent,
      text: textContent,
    });

    console.log('✅ Contact email sent successfully:', result);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('❌ Failed to send contact email:', error);
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Send auto-reply to customer
export async function sendContactAutoReply(
  customerEmail: string,
  customerName: string
) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Thank You for Contacting LUX Cabinets & Stones</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .contact-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .contact-item { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏠 LUX Cabinets & Stones</div>
              <h1>Thank You for Your Message!</h1>
            </div>
            <div class="content">
              <p>Dear ${customerName},</p>
              
              <p>Thank you for contacting LUX Cabinets & Stones! We've received your message and our team will review it shortly.</p>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>📧 We typically respond within 24 hours</li>
                <li>📞 For urgent matters, feel free to call us directly</li>
                <li>🏠 Schedule a free consultation at your convenience</li>
              </ul>
              
              <div class="contact-info">
                <h3>📞 Contact Information</h3>
                <div class="contact-item"><strong>Main:</strong> <a href="tel:+15713350118">(571) 335-0118</a></div>
                <div class="contact-item"><strong>Emergency:</strong> <a href="tel:+15715858345">(571) 585-8345</a></div>
                <div class="contact-item"><strong>Email:</strong> <a href="mailto:info@luxcabistones.com">info@luxcabistones.com</a></div>
                <div class="contact-item"><strong>Address:</strong> 4005 Westfax Dr, Unit M, Chantilly, VA 20151</div>
              </div>
              
              <p>We look forward to helping you transform your space with our premium cabinets and stone surfaces!</p>
              
              <p>Best regards,<br>
              <strong>The LUX Cabinets & Stones Team</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Thank You for Contacting LUX Cabinets & Stones!

Dear ${customerName},

Thank you for contacting LUX Cabinets & Stones! We've received your message and our team will review it shortly.

What happens next?
- We typically respond within 24 hours
- For urgent matters, feel free to call us directly
- Schedule a free consultation at your convenience

Contact Information:
Main: (571) 335-0118
Emergency: (571) 585-8345
Email: info@luxcabistones.com
Address: 4005 Westfax Dr, Unit M, Chantilly, VA 20151

We look forward to helping you transform your space with our premium cabinets and stone surfaces!

Best regards,
The LUX Cabinets & Stones Team
    `;

    const result = await resend.emails.send({
      from: 'LUX Cabinets & Stones <noreply@luxcabistones.com>',
      to: [customerEmail],
      subject: '🏠 Thank you for contacting LUX Cabinets & Stones',
      html: htmlContent,
      text: textContent,
    });

    console.log('✅ Auto-reply sent successfully:', result);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('❌ Failed to send auto-reply:', error);
    // Don't throw error for auto-reply failure - it's not critical
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
