import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateVerificationEmailHtml } from '@/lib/email';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing email configuration...');
    
    // Check environment variables
    const emailConfig = {
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_PORT: !!process.env.SMTP_PORT,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASS: !!process.env.SMTP_PASS,
      NODE_ENV: process.env.NODE_ENV,
    };
    
    console.log('📧 Email configuration:', emailConfig);
    
    // Try to generate email HTML
    const testCode = '1234';
    const testUsername = 'Test User';
    
    try {
      const emailHtml = await generateVerificationEmailHtml(testUsername, testCode);
      console.log('✅ Email HTML generated successfully');
      
      // Try to send email (this will likely fail without proper config)
      try {
        const result = await sendEmail({
          to: 'test@example.com',
          subject: 'Test Email - LUX Cabinets & Stones',
          html: emailHtml,
        });
        
        return NextResponse.json({
          success: true,
          message: 'Email sent successfully',
          config: emailConfig,
          result,
        });
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        
        return NextResponse.json({
          success: false,
          message: 'Email configuration not set up',
          config: emailConfig,
          error: emailError instanceof Error ? emailError.message : 'Unknown error',
          testCode: testCode, // Return the code for testing
        });
      }
    } catch (htmlError) {
      console.error('❌ Email HTML generation failed:', htmlError);
      
      return NextResponse.json({
        success: false,
        message: 'Email HTML generation failed',
        config: emailConfig,
        error: htmlError instanceof Error ? htmlError.message : 'Unknown error',
      });
    }
  } catch (error) {
    console.error('🚨 Test email route error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required',
      }, { status: 400 });
    }
    
    console.log(`🧪 Testing email send to: ${email}`);
    
    const testCode = Math.floor(1000 + Math.random() * 9000).toString();
    const emailHtml = await generateVerificationEmailHtml('Test User', testCode);
    
    try {
      const result = await sendEmail({
        to: email,
        subject: 'Test Verification Code - LUX Cabinets & Stones',
        html: emailHtml,
      });
      
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        testCode: process.env.NODE_ENV === 'development' ? testCode : undefined,
        result,
      });
    } catch (emailError) {
      console.error('❌ Test email failed:', emailError);
      
      return NextResponse.json({
        success: false,
        message: 'Email service not configured',
        testCode: process.env.NODE_ENV === 'development' ? testCode : undefined,
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
      });
    }
  } catch (error) {
    console.error('🚨 Test email POST error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
