import nodemailer from 'nodemailer';

interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

let transporter: nodemailer.Transporter | null = null;

function getMailConfig(): MailConfig | null {
  const requiredEnvs = [
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_SECURE',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'EMAIL_FROM',
  ];

  const missing = requiredEnvs.filter((env) => !process.env[env]);
  if (missing.length > 0) {
    console.warn(`Missing email environment variables: ${missing.join(', ')}`);
    return null;
  }

  return {
    host: process.env.EMAIL_HOST!,
    port: parseInt(process.env.EMAIL_PORT!, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASSWORD!,
    from: process.env.EMAIL_FROM!,
  };
}

async function createTransporter() {
  if (transporter) {
    return transporter;
  }

  const config = getMailConfig();

  // If config is null, email is not configured
  if (!config) {
    console.warn('Email is not configured. Skipping email sending.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  // Verify connection configuration
  try {
    await transporter.verify();
    console.log('✅ Email transporter is ready to send messages');
  } catch (error) {
    console.error('❌ Error verifying email transporter:', error);
    transporter = null; // Reset transporter if verification fails
    console.warn('Email service configuration error. Skipping email sending.');
    return null;
  }

  return transporter;
}

export async function sendMail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    const transporter = await createTransporter();

    // If transporter is null, email is not configured
    if (!transporter) {
      console.warn('Email transporter not available. Skipping email sending.');
      return;
    }

    const config = getMailConfig();
    if (!config) {
      console.warn(
        'Email configuration not available. Skipping email sending.'
      );
      return;
    }

    const mailOptions = {
      from: config.from,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('📧 Email sent successfully:', {
      messageId: info.messageId,
      to,
      subject,
    });
  } catch (error: any) {
    console.error('❌ Failed to send email:', {
      to,
      subject,
      error: error.message,
      code: error.code,
    });

    // Log error but don't throw - we want the application to continue even if email fails
    console.warn('Email sending failed, but continuing execution');

    // For debugging purposes, log more details
    if (error.code === 'EAUTH') {
      console.error(
        'Email authentication failed. Please check EMAIL_USER and EMAIL_PASSWORD.'
      );
    } else if (error.code === 'ECONNECTION') {
      console.error(
        'Failed to connect to email server. Please check EMAIL_HOST and EMAIL_PORT.'
      );
    } else if (error.code === 'EMESSAGE') {
      console.error('Invalid email message format.');
    }

    // Return without throwing to allow the application to continue
    return;
  }
}

export function getPasswordResetEmailHtml(resetLink: string): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/dpeueuyjf/image/upload/v1755294936/website-banners/sdvclxxuhzbxsn7wzpwd.png" alt="LUX Cabinets & Stones Logo" style="max-width: 150px; height: auto;">
      </div>
      <h2 style="color: #0056b3; text-align: center;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>You have requested to reset your password for your LUX Cabinets & Stones account.</p>
      <p>Please click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #007bff; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Your Password</a>
      </div>
      <p>This link will expire in <strong>1 hour</strong> for security reasons. If you did not request a password reset, please ignore this email.</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Thank you,<br>The LUX Cabinets & Stones Team</p>
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
      <p style="text-align: center; font-size: 12px; color: #777;">
        This email was sent by LUX Cabinets & Stones.
        <br>
        &copy; ${new Date().getFullYear()} LUX Cabinets & Stones. All rights reserved.
      </p>
    </div>
  `;
}

export interface QuoteRequestData {
  name: string;
  email: string;
  phone?: string;
  zipCode?: string;
  notes?: string;
  productId: string;
  productName: string;
  sku?: string;
  timestamp: string;
  quoteId?: string;
  publicToken?: string;
}

export async function sendQuoteRequestNotification(
  quoteData: QuoteRequestData,
  notifyEmail: string = process.env.QUOTE_NOTIFICATION_EMAIL ||
    process.env.EMAIL_FROM ||
    ''
): Promise<void> {
  if (!notifyEmail) {
    console.warn('No notification email configured for quote requests');
    return;
  }

  const subject = `New Quote Request: ${quoteData.productName}`;
  const html = getQuoteRequestEmailHtml(quoteData);

  await sendMail(notifyEmail, subject, html);
}

export function getQuoteRequestEmailHtml(quoteData: QuoteRequestData): string {
  // Build confirmation page URL if ID and token are provided
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://luxcabinets.com';
  const confirmationUrl =
    quoteData.quoteId && quoteData.publicToken
      ? `${baseUrl}/quote-requests/${quoteData.quoteId}?token=${quoteData.publicToken}`
      : null;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/dpeueuyjf/image/upload/v1755294936/website-banners/sdvclxxuhzbxsn7wzpwd.png" alt="LUX Cabinets & Stones Logo" style="max-width: 150px; height: auto;">
      </div>
      <h2 style="color: #0056b3; text-align: center;">New Quote Request</h2>
      <p>A new quote request has been submitted:</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #0056b3;">Product Information</h3>
        <p><strong>Product Name:</strong> ${quoteData.productName}</p>
        <p><strong>Product ID:</strong> ${quoteData.productId}</p>
        ${quoteData.sku ? `<p><strong>SKU:</strong> ${quoteData.sku}</p>` : ''}
        
        <h3 style="margin-top: 20px; color: #0056b3;">Customer Information</h3>
        <p><strong>Name:</strong> ${quoteData.name}</p>
        <p><strong>Email:</strong> ${quoteData.email}</p>
        ${quoteData.phone ? `<p><strong>Phone:</strong> ${quoteData.phone}</p>` : ''}
        ${quoteData.zipCode ? `<p><strong>ZIP Code:</strong> ${quoteData.zipCode}</p>` : ''}
        
        ${
          quoteData.notes
            ? `
        <h3 style="margin-top: 20px; color: #0056b3;">Notes</h3>
        <p>${quoteData.notes}</p>
        `
            : ''
        }
        
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          <strong>Submitted:</strong> ${new Date(quoteData.timestamp).toLocaleString()}
        </p>
      </div>
      
      ${
        confirmationUrl
          ? `
      <div style="text-align: center; margin: 30px 0;">
        <p>View your quote request details and status at any time:</p>
        <a href="${confirmationUrl}" style="background-color: #007bff; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">View Your Request</a>
      </div>
      `
          : ''
      }
      
      <p>Please follow up with this customer as soon as possible.</p>
      <p>Thank you,<br>The LUX Cabinets & Stones Website</p>
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
      <p style="text-align: center; font-size: 12px; color: #777;">
        This is an automated email from the LUX Cabinets & Stones website.
        <br>
        &copy; ${new Date().getFullYear()} LUX Cabinets & Stones. All rights reserved.
      </p>
    </div>
  `;
}
