import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import VerificationCodeEmail from '@/emails/verification-code';

// Create reusable transporter object using environment variables
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    const { email, code, username } = await request.json();

    console.log('📧 Email send request received:', { email, username, code });

    if (!email || !code || !username) {
      return NextResponse.json(
        { success: false, error: 'Email, code, and username are required' },
        { status: 400 }
      );
    }

    // Check if email credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Debug SMTP configuration (without exposing password)
    console.log('🔧 SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      passLength: process.env.SMTP_PASS?.length,
    });

    // Create transporter
    const transporter = createTransporter();

    // Test transporter connection
    console.log('🔌 Testing SMTP connection...');
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP connection failed:', verifyError);
      return NextResponse.json(
        {
          success: false,
          error: 'SMTP connection failed',
          details: String(verifyError),
        },
        { status: 500 }
      );
    }

    // Generate HTML email using React Email
    const emailHtml = await render(
      VerificationCodeEmail({
        username,
        verificationCode: code,
      })
    );

    // Generate plain text version
    const emailText = `
Hi ${username},

Thank you for signing up with Lux Store! To complete your account setup, please use the verification code below:

Verification Code: ${code}

This code is valid for 10 minutes. If you didn't request this code, please ignore this email.

Best regards,
The Lux Store Team
    `.trim();

    // Mail options
    const mailOptions = {
      from: {
        name: 'Lux Store',
        address: process.env.SMTP_USER,
      },
      to: email,
      subject: `Your Lux Store verification code: ${code}`,
      html: emailHtml,
      text: emailText,
    };

    // Send email
    console.log(`📧 Sending verification email to: ${email}`);
    await transporter.sendMail(mailOptions);

    console.log(`✅ Verification email sent successfully to: ${email}`);
    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);

    // Return different errors based on the type
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        return NextResponse.json(
          { success: false, error: 'Invalid email credentials' },
          { status: 500 }
        );
      }
      if (error.message.includes('Connection timeout')) {
        return NextResponse.json(
          { success: false, error: 'Email service timeout' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
