import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { username, email } = await req.json();

    if (!username || !email) {
      return NextResponse.json(
        { success: false, error: 'Username and email are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // ✅ ENV reads inside the handler
    const { RESEND_API_KEY, SMTP_FROM, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    // Generate 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Store code in database (upsert to handle existing records)
    await prisma.verificationCode.upsert({
      where: { email },
      update: {
        code,
        username,
        expiresAt,
      },
      create: {
        email,
        code,
        username,
        expiresAt,
      },
    });

    console.log(`📧 Verification code stored for ${email}: ${code} (expires at ${expiresAt.toISOString()})`);

    // Generate email HTML
    let emailHtml: string;
    try {
      const { render } = await import('@react-email/components');
      const VerificationCodeEmail = (await import('@/emails/verification-code')).default;
      emailHtml = await render(VerificationCodeEmail({
        username,
        verificationCode: code,
      }));
    } catch (error) {
      // Fallback HTML template
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f6f9fc;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: #000; color: white; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Welcome to LUX Cabinets & Stones!</h1>
            </div>
            <div style="padding: 32px 24px;">
              <div style="font-size: 18px; font-weight: 600; margin-bottom: 24px; color: #484848;">Hi ${username},</div>
              <div style="font-size: 16px; margin-bottom: 24px; color: #484848; line-height: 1.4;">
                Thank you for choosing LUX Cabinets & Stones! To complete your account setup, please use the verification code below:
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
        console.log('📧 Attempting to send email via Resend...');
        const { Resend } = await import('resend');
        const resend = new Resend(RESEND_API_KEY);
        await resend.emails.send({
          from: SMTP_FROM || 'LUX Cabinets & Stones <noreply@luxcabistones.com>',
          to: email,
          subject: 'Your Verification Code - LUX Cabinets & Stones',
          html: emailHtml,
        });
        console.log('✅ Email sent successfully via Resend');
        return NextResponse.json({ success: true, message: 'Verification code sent successfully' });
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
        console.log(`🔧 Development Mode - Verification code for ${email}: ${code}`);
        return NextResponse.json({
          success: true,
          message: `Email service not configured. Use this code: ${code}`,
          testCode: code,
        });
      }
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    try {
      console.log('📧 Attempting to send email via Nodemailer...');
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      await transporter.sendMail({
        from: SMTP_FROM,
        to: email,
        subject: 'Your Verification Code - LUX Cabinets & Stones',
        html: emailHtml,
      });
      console.log('✅ Email sent successfully via Nodemailer');
      return NextResponse.json({ success: true, message: 'Verification code sent successfully' });
    } catch (error) {
      console.error('❌ Nodemailer failed:', error);
      // In development, return the code for testing
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔧 Development Mode - Verification code for ${email}: ${code}`);
        return NextResponse.json({
          success: true,
          message: `Email service not configured. Use this code: ${code}`,
          testCode: code,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Send code API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
