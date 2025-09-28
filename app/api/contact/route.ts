import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, sendContactAutoReply } from '@/lib/resend';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const projectType = formData.get('projectType') as string;
    const budget = formData.get('budget') as string;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create contact data object
    const contactData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      subject: subject.trim(),
      message: message.trim(),
      projectType: projectType?.trim(),
      budget: budget?.trim(),
    };

    console.log('📧 Contact form submission:', {
      ...contactData,
      timestamp: new Date().toISOString(),
    });

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn(
        '⚠️ RESEND_API_KEY not configured - emails will not be sent'
      );
      return NextResponse.json(
        { error: 'Email service not configured. Please contact us directly.' },
        { status: 503 }
      );
    }

    try {
      // Send email to business
      const emailResult = await sendContactEmail(contactData);
      console.log('✅ Business email sent:', emailResult);

      // Send auto-reply to customer (non-blocking)
      sendContactAutoReply(contactData.email, contactData.name).catch(
        (error) => {
          console.warn('⚠️ Auto-reply failed (non-critical):', error);
        }
      );

      return NextResponse.json({
        success: true,
        message:
          'Your message has been sent successfully! We will get back to you soon.',
        messageId: emailResult.messageId,
      });
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);

      // Return a user-friendly error
      return NextResponse.json(
        {
          error:
            'Failed to send email. Please try again or contact us directly.',
          details:
            emailError instanceof Error
              ? emailError.message
              : 'Email service error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error processing contact form:', error);

    return NextResponse.json(
      {
        error: 'Failed to process contact form',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
