import { NextRequest, NextResponse } from 'next/server';

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
    
    // Create contact data object
    const contactData = {
      name,
      email,
      phone,
      subject,
      message,
      projectType,
      budget,
      timestamp: new Date().toISOString(),
    };
    
    console.log('📧 Contact form submission:', contactData);
    
    // In a real implementation, you would send an email here
    // For example, using a service like SendGrid, Mailgun, etc.
    
    /*
    // Example using SendGrid
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: 'info@luxcabistones.com',
      from: 'website@luxcabistones.com',
      subject: `New Contact Form: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        Project Type: ${projectType || 'Not specified'}
        Budget: ${budget || 'Not specified'}
        
        Message:
        ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
        <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };
    
    await sgMail.send(msg);
    */
    
    // For now, we'll just simulate a successful submission
    // In a real implementation, you would send the email and handle errors
    
    return NextResponse.json({ 
      success: true,
      message: 'Contact form submitted successfully'
    });
    
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
