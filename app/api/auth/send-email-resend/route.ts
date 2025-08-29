import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import VerificationCodeEmail from '@/emails/verification-code';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, code, username } = await request.json();

    console.log('📧 Resend email request received:', { email, username, code });

    if (!email || !code || !username) {
      return NextResponse.json(
        { success: false, error: 'Email, code, and username are required' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('Resend API key not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    console.log('📧 Sending verification email to:', email);

    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Lux Store <noreply@yourdomain.com>', // Change this to your domain
      to: [email],
      subject: `Your Lux Store verification code: ${code}`,
      react: VerificationCodeEmail({
        username,
        verificationCode: code,
      }),
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    console.log('✅ Email sent successfully:', data);
    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
      data,
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
