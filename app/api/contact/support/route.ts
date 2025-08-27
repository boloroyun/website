import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { cookies } from 'next/headers';

// Get current user from cookies
async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth-token');

    if (!authToken) {
      return null;
    }

    const userData = JSON.parse(authToken.value);
    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Generate support email HTML template
function generateSupportEmailHtml(data: {
  customerName: string;
  customerEmail: string;
  orderId?: string;
  subject: string;
  message: string;
  userAgent?: string;
  timestamp: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Customer Support Request - LUX Cabinets & Stones</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 700px; 
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
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .header p {
            margin: 8px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content { 
            padding: 30px; 
          }
          .section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
          }
          .section:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .label {
            font-size: 14px;
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .value {
            font-size: 16px;
            color: #2d3748;
            background: #f7fafc;
            padding: 12px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
          }
          .message-content {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            white-space: pre-wrap;
            font-family: inherit;
          }
          .footer { 
            text-align: center; 
            padding: 20px; 
            background: #f8f9fa;
            color: #718096; 
            font-size: 12px; 
            border-top: 1px solid #e2e8f0;
          }
          .urgent {
            background: #fed7d7;
            color: #c53030;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Customer Support Request</h1>
            <p>New inquiry from LUX Cabinets & Stones customer</p>
          </div>
          <div class="content">
            ${data.orderId ? '<div class="urgent">⚠️ ORDER-RELATED INQUIRY - PRIORITY SUPPORT NEEDED</div>' : ''}
            
            <div class="section">
              <div class="label">Customer Information</div>
              <div class="value">
                <strong>Name:</strong> ${data.customerName}<br>
                <strong>Email:</strong> ${data.customerEmail}<br>
                <strong>Request Time:</strong> ${data.timestamp}
              </div>
            </div>

            ${
              data.orderId
                ? `
            <div class="section">
              <div class="label">Order Information</div>
              <div class="value">
                <strong>Order ID:</strong> ${data.orderId}<br>
                <strong>Order Link:</strong> <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order/${data.orderId}">View Order Details</a>
              </div>
            </div>
            `
                : ''
            }

            <div class="section">
              <div class="label">Subject</div>
              <div class="value">${data.subject}</div>
            </div>

            <div class="section">
              <div class="label">Message</div>
              <div class="message-content">${data.message}</div>
            </div>

            ${
              data.userAgent
                ? `
            <div class="section">
              <div class="label">Technical Information</div>
              <div class="value">
                <strong>Browser:</strong> ${data.userAgent}
              </div>
            </div>
            `
                : ''
            }

            <div class="section">
              <div class="label">Response Instructions</div>
              <div class="value">
                Please respond to this customer inquiry by replying directly to <strong>${data.customerEmail}</strong>.<br>
                ${data.orderId ? `<br><strong>📋 Action Required:</strong> Review order #${data.orderId} for context before responding.` : ''}
              </div>
            </div>
          </div>
          <div class="footer">
            <div>LUX Cabinets & Stones - Customer Support System</div>
            <div>© ${new Date().getFullYear()} | Generated automatically</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, message, orderId, customerName, customerEmail } = body;

    console.log('📧 Support email request received:', {
      subject,
      orderId,
      customerEmail,
      messageLength: message?.length,
    });

    // Validate required fields
    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Get current user for context
    const currentUser = await getCurrentUser();

    // Use provided customer info or fall back to current user
    const finalCustomerName =
      customerName || currentUser?.username || 'Anonymous User';
    const finalCustomerEmail =
      customerEmail || currentUser?.email || 'No email provided';

    // Get user agent for technical context
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Prepare email data
    const emailData = {
      customerName: finalCustomerName,
      customerEmail: finalCustomerEmail,
      orderId,
      subject,
      message,
      userAgent,
      timestamp: new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };

    // Generate email HTML
    const emailHtml = generateSupportEmailHtml(emailData);

    // Prepare email subject
    const emailSubject = orderId
      ? `🚨 URGENT: Order Support - ${subject} (Order #${orderId.slice(-8)})`
      : `💬 Customer Inquiry: ${subject}`;

    // Send email to support
    console.log('📧 Sending support email to info@luxcabistones.com...');
    await sendEmail({
      to: 'info@luxcabistones.com',
      subject: emailSubject,
      html: emailHtml,
    });

    console.log('✅ Support email sent successfully');

    return NextResponse.json({
      success: true,
      message:
        'Your message has been sent to our support team. We will respond within 24 hours.',
    });
  } catch (error) {
    console.error('❌ Error sending support email:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          'Failed to send support message. Please try again or contact us directly at info@luxcabistones.com',
      },
      { status: 500 }
    );
  }
}
