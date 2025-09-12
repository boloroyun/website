import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// Input validation schema
const EmailNotificationSchema = z.object({
  quoteId: z.string(),
  category: z.enum(['countertop', 'cabinet', 'combo']),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  zipcode: z.string().optional(),
  total: z.number().optional(),
  lineItems: z.array(
    z.object({
      label: z.string(),
      qty: z.number(),
      unitPrice: z.number(),
      total: z.number(),
      category: z.string().optional(),
    })
  ).optional(),
  images: z.array(
    z.object({
      publicId: z.string(),
      secureUrl: z.string(),
    })
  ).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify internal API token
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.INTERNAL_API_TOKEN || 'dev-token';

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      console.error('❌ Unauthorized API call to quotes/email-notification');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = EmailNotificationSchema.safeParse(body);

    if (!validatedRequest.success) {
      console.error(
        '❌ Invalid email notification request:',
        validatedRequest.error
      );
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validatedRequest.error.issues,
        },
        { status: 400 }
      );
    }

    const notificationData = validatedRequest.data;
    
    // Send email notification
    const emailSent = await sendEmailNotification(notificationData);
    
    if (!emailSent.success) {
      return NextResponse.json(
        { error: 'Failed to send email notification', details: emailSent.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Email notification sent successfully' });
  } catch (error) {
    console.error('❌ Error sending email notification:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to send email notification',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function sendEmailNotification(data: z.infer<typeof EmailNotificationSchema>) {
  try {
    // Format the email content
    const emailSubject = `New Quote Request #${data.quoteId} - ${data.category.toUpperCase()}`;
    
    let emailBody = `
      <h1>New Quote Request</h1>
      <p><strong>Quote ID:</strong> ${data.quoteId}</p>
      <p><strong>Category:</strong> ${data.category}</p>
      ${data.customerName ? `<p><strong>Customer Name:</strong> ${data.customerName}</p>` : ''}
      ${data.customerEmail ? `<p><strong>Customer Email:</strong> ${data.customerEmail}</p>` : ''}
      ${data.customerPhone ? `<p><strong>Customer Phone:</strong> ${data.customerPhone}</p>` : ''}
      ${data.zipcode ? `<p><strong>ZIP Code:</strong> ${data.zipcode}</p>` : ''}
      ${data.total ? `<p><strong>Estimated Total:</strong> $${data.total.toFixed(2)}</p>` : ''}
    `;
    
    // Add line items if available
    if (data.lineItems && data.lineItems.length > 0) {
      emailBody += `
        <h2>Quote Details</h2>
        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
      `;
      
      data.lineItems.forEach(item => {
        emailBody += `
          <tr>
            <td>${item.label}</td>
            <td>${item.qty}</td>
            <td>$${item.unitPrice.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
          </tr>
        `;
      });
      
      emailBody += `</table>`;
    }
    
    // Add images if available
    if (data.images && data.images.length > 0) {
      emailBody += `<h2>Project Images</h2>`;
      
      data.images.forEach(image => {
        emailBody += `<p><img src="${image.secureUrl}" alt="Project Image" style="max-width: 300px; height: auto;" /></p>`;
      });
    }
    
    emailBody += `
      <p>View this quote in the admin dashboard for more details.</p>
      <p>This is an automated notification from the LUX Cabinets & Stones website.</p>
    `;
    
    // Send the email using the fetch API to a transactional email service
    // For this implementation, we'll use a mock function since we don't have the actual email service credentials
    console.log('📧 Sending email notification to info@luxcabistones.com');
    console.log('Subject:', emailSubject);
    console.log('Body preview:', emailBody.substring(0, 200) + '...');
    
    // In a real implementation, you would use a service like SendGrid, Mailgun, etc.
    // For now, we'll simulate a successful email send
    
    // Example of how you would send with a real email service:
    /*
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'info@luxcabistones.com' }],
            subject: emailSubject,
          },
        ],
        from: { email: 'noreply@luxcabistones.com', name: 'LUX Website' },
        content: [
          {
            type: 'text/html',
            value: emailBody,
          },
        ],
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Email service error: ${JSON.stringify(errorData)}`);
    }
    */
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error in sendEmailNotification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error sending email' 
    };
  }
}
