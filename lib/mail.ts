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

function getMailConfig(): MailConfig {
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
    throw new Error(
      `Missing required email environment variables: ${missing.join(', ')}`
    );
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
    throw new Error('Email service configuration error.');
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

    const mailOptions = {
      from: getMailConfig().from,
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
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error(
        'Email authentication failed. Please check EMAIL_USER and EMAIL_PASSWORD.'
      );
    } else if (error.code === 'ECONNECTION') {
      throw new Error(
        'Failed to connect to email server. Please check EMAIL_HOST and EMAIL_PORT.'
      );
    } else if (error.code === 'EMESSAGE') {
      throw new Error('Invalid email message format.');
    } else if (
      error.message.includes('Missing required email environment variables')
    ) {
      throw error; // Re-throw the specific config error
    } else {
      throw new Error('Failed to send email. Please try again later.');
    }
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
