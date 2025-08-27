import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface VerificationCodeEmailProps {
  username: string;
  verificationCode: string;
}

export const VerificationCodeEmail = ({
  username = 'there',
  verificationCode = '1234',
}: VerificationCodeEmailProps) => (
  <Html>
    <Head />
    <Preview>Your verification code: {verificationCode}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={h1}>Welcome to Lux Store!</Heading>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {username},</Text>

          <Text style={paragraph}>
            Thank you for signing up with Lux Store! To complete your account
            setup, please use the verification code below:
          </Text>

          {/* Verification Code */}
          <Section style={codeContainer}>
            <Text style={codeText}>{verificationCode}</Text>
          </Section>

          <Text style={paragraph}>
            This code is valid for 10 minutes. If you didn't request this code,
            please ignore this email.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Best regards,
            <br />
            The Lux Store Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '560px',
};

const header = {
  padding: '32px 24px',
  textAlign: 'center' as const,
  backgroundColor: '#000000',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const content = {
  padding: '32px 24px',
};

const greeting = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '0 0 24px',
  fontWeight: '600',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '0 0 24px',
};

const codeContainer = {
  backgroundColor: '#f4f4f4',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
  textAlign: 'center' as const,
  border: '2px dashed #d1d1d1',
};

const codeText = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#000000',
  letterSpacing: '8px',
  margin: '0',
  fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const footer = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#898989',
  margin: '0',
};

export default VerificationCodeEmail;
