import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // ✅ ENV reads inside the handler
    const {
      RESEND_API_KEY,
      SMTP_FROM,
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
    } = process.env;

    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Find existing verification code
    const storedData = await prisma.verificationCode.findUnique({
      where: { email },
    });

    if (!storedData) {
      return NextResponse.json(
        {
          success: false,
          error: 'No verification code found. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // Generate new 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Update code in database
    await prisma.verificationCode.update({
      where: { email },
      data: { code, expiresAt },
    });

    console.log(`🔄 New verification code generated for ${email}: ${code}`);

    // Generate email HTML
    let emailHtml: string;
    try {
      const { render } = await import('@react-email/components');
      const VerificationCodeEmail = (await import('@/emails/verification-code'))
        .default;
      emailHtml = await render(
        VerificationCodeEmail({
          username: storedData.username,
          verificationCode: code,
        })
      );
    } catch (error) {
      // Fallback HTML template
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f6f9fc;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: #000; color: white; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">New Verification Code - LUX Cabinets & Stones</h1>
            </div>
            <div style="padding: 32px 24px;">
              <div style="font-size: 18px; font-weight: 600; margin-bottom: 24px; color: #484848;">Hi ${storedData.username},</div>
              <div style="font-size: 16px; margin-bottom: 24px; color: #484848; line-height: 1.4;">
                Here's your new verification code:
              </div>
              <div style="background: #f4f4f4; border: 2px dashed #d1d1d1; border-radius: 8px; padding: 24px; text-align: center; margin: 32px 0;">
                <div style="font-size: 32px; font-weight: bold; color: #000; letter-spacing: 8px; font-family: monospace; margin: 0;">${code}</div>
              </div>
              <div style="font-size: 16px; margin-bottom: 24px; color: #484848; line-height: 1.4;">
                This code is valid for 10 minutes. If you didn't request this code, please ignore this email.
              </div>
              <div style="font-size: 14px; line-height: 1.4; color: #898989; margin: 32px 0 0 0;">
                Best regards,<br>The LUX Cabinets & Stones Team
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Prefer Resend if RESEND_API_KEY exists, else fall back to Gmail SMTP
    if (RESEND_API_KEY) {
      try {
        console.log('📧 Attempting to resend email via Resend...');
        const { Resend } = await import('resend');
        const resend = new Resend(RESEND_API_KEY);
        await resend.emails.send({
          from:
            SMTP_FROM || 'LUX Cabinets & Stones <noreply@luxcabistones.com>',
          to: email,
          subject: 'New Verification Code - LUX Cabinets & Stones',
          html: emailHtml,
        });
        console.log('✅ Email resent successfully via Resend');
        return NextResponse.json({
          success: true,
          message: 'New verification code sent successfully',
        });
      } catch (error) {
        console.error('❌ Resend failed:', error);
        // Fall through to nodemailer
      }
    }

    // Fallback to Gmail SMTP
    const nodemailer = (await import('nodemailer')).default;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
      console.error('❌ Email service not configured properly');
      // In development, return the code for testing
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `🔧 Development Mode - New verification code for ${email}: ${code}`
        );
        return NextResponse.json({
          success: true,
          message: `Email service not configured. Use this code: ${code}`,
          testCode: code,
        });
      }
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    try {
      console.log('📧 Attempting to resend email via Nodemailer...');
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      await transporter.sendMail({
        from: SMTP_FROM,
        to: email,
        subject: 'New Verification Code - LUX Cabinets & Stones',
        html: emailHtml,
      });
      console.log('✅ Email resent successfully via Nodemailer');
      return NextResponse.json({
        success: true,
        message: 'New verification code sent successfully',
      });
    } catch (error) {
      console.error('❌ Nodemailer failed:', error);
      // In development, return the code for testing
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `🔧 Development Mode - New verification code for ${email}: ${code}`
        );
        return NextResponse.json({
          success: true,
          message: `Email service not configured. Use this code: ${code}`,
          testCode: code,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Resend code API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
