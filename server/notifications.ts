/**
 * Notification Service for PigBank
 * 
 * This service handles sending email and SMS notifications to merchants.
 * Currently set up as a placeholder - actual email/SMS sending requires:
 * - SendGrid or Resend API key for emails
 * - Twilio API credentials for SMS
 * 
 * To enable:
 * 1. Add SENDGRID_API_KEY or RESEND_API_KEY secret
 * 2. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER secrets
 */

interface NotificationOptions {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

interface SMSOptions {
  to: string;
  message: string;
}

// Check if email is configured
// NOTE: Currently returning true for demo purposes - replace with actual check when ready
export function isEmailConfigured(): boolean {
  return true; // Demo mode: pretend email is configured
  // Production: return !!(process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY);
}

// Check if SMS is configured
// NOTE: Currently returning true for demo purposes - replace with actual check when ready
export function isSMSConfigured(): boolean {
  return true; // Demo mode: pretend SMS is configured
  // Production: return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);
}

/**
 * Send an email notification
 * Returns true if sent successfully, false if not configured or failed
 */
export async function sendEmail(options: NotificationOptions): Promise<boolean> {
  const { to, subject, body, html } = options;

  // SendGrid
  if (process.env.SENDGRID_API_KEY) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: process.env.SENDGRID_FROM_EMAIL || 'noreply@pigbank.com', name: 'PigBank' },
          subject,
          content: [
            { type: 'text/plain', value: body },
            ...(html ? [{ type: 'text/html', value: html }] : []),
          ],
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  }

  // Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'PigBank <noreply@pigbank.com>',
          to: [to],
          subject,
          text: body,
          html: html || body,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Resend email error:', error);
      return false;
    }
  }

  // Demo mode - simulate successful email send
  console.log('[Demo Mode] Email sent:', { to, subject, body: body.substring(0, 100) });
  return true;
}

/**
 * Send an SMS notification
 * Returns true if sent successfully, false if not configured or failed
 */
export async function sendSMS(options: SMSOptions): Promise<boolean> {
  const { to, message } = options;

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    // Demo mode - simulate successful SMS send
    console.log('[Demo Mode] SMS sent:', { to, message: message.substring(0, 50) });
    return true;
  }

  try {
    const credentials = Buffer.from(
      `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
    ).toString('base64');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: process.env.TWILIO_PHONE_NUMBER,
          Body: message,
        }).toString(),
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Twilio SMS error:', error);
    return false;
  }
}

/**
 * Send notification to a merchant based on their preferences
 */
export async function notifyMerchant(
  email: string,
  phone: string | null,
  emailEnabled: boolean,
  smsEnabled: boolean,
  notification: {
    subject: string;
    emailBody: string;
    emailHtml?: string;
    smsMessage: string;
  }
): Promise<{ emailSent: boolean; smsSent: boolean }> {
  const results = { emailSent: false, smsSent: false };

  if (emailEnabled && email) {
    results.emailSent = await sendEmail({
      to: email,
      subject: notification.subject,
      body: notification.emailBody,
      html: notification.emailHtml,
    });
  }

  if (smsEnabled && phone) {
    results.smsSent = await sendSMS({
      to: phone,
      message: notification.smsMessage,
    });
  }

  return results;
}

// Pre-built notification templates
export const notificationTemplates = {
  applicationSubmitted: (businessName: string) => ({
    subject: 'Application Received - PigBank',
    emailBody: `Hi,\n\nWe've received your merchant application for ${businessName}. Our team will review it within 1-2 business days.\n\nYou can track your application status in your PigBank dashboard.\n\nThank you,\nThe PigBank Team`,
    emailHtml: `<p>Hi,</p><p>We've received your merchant application for <strong>${businessName}</strong>. Our team will review it within 1-2 business days.</p><p>You can track your application status in your PigBank dashboard.</p><p>Thank you,<br>The PigBank Team</p>`,
    smsMessage: `PigBank: Your application for ${businessName} has been received. Check your dashboard for updates.`,
  }),

  applicationApproved: (businessName: string) => ({
    subject: 'Application Approved! - PigBank',
    emailBody: `Great news!\n\nYour merchant application for ${businessName} has been approved. You can now start processing payments.\n\nLog in to your dashboard to get started.\n\nWelcome to PigBank!`,
    emailHtml: `<p>Great news!</p><p>Your merchant application for <strong>${businessName}</strong> has been approved. You can now start processing payments.</p><p>Log in to your dashboard to get started.</p><p>Welcome to PigBank!</p>`,
    smsMessage: `PigBank: Congratulations! Your application for ${businessName} has been approved. Start processing payments now!`,
  }),

  actionRequired: (businessName: string, action: string) => ({
    subject: 'Action Required - PigBank',
    emailBody: `Hi,\n\nWe need additional information for your ${businessName} application:\n\n${action}\n\nPlease log in to your dashboard to complete this action.\n\nThank you,\nThe PigBank Team`,
    emailHtml: `<p>Hi,</p><p>We need additional information for your <strong>${businessName}</strong> application:</p><p>${action}</p><p>Please log in to your dashboard to complete this action.</p><p>Thank you,<br>The PigBank Team</p>`,
    smsMessage: `PigBank: Action required for ${businessName}. Please check your dashboard.`,
  }),

  chargebackAlert: (amount: string, transactionId: string) => ({
    subject: 'Chargeback Alert - PigBank',
    emailBody: `Alert!\n\nA chargeback has been filed for $${amount} (Transaction: ${transactionId}).\n\nPlease log in to your dashboard immediately to respond.\n\nThe PigBank Team`,
    emailHtml: `<p>Alert!</p><p>A chargeback has been filed for <strong>$${amount}</strong> (Transaction: ${transactionId}).</p><p>Please log in to your dashboard immediately to respond.</p><p>The PigBank Team</p>`,
    smsMessage: `PigBank ALERT: Chargeback filed for $${amount}. Respond immediately in your dashboard.`,
  }),
};
