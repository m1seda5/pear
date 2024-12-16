import crypto from 'crypto';
import SibApiV3Sdk from 'sib-api-v3-sdk';

export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function sendVerificationEmail(email, verificationToken, baseUrl) {
  try {
    // Configure Brevo API client
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "Verify Your Pear Network Account";
    sendSmtpEmail.htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
            <h1 style="color: #333;">Email Verification</h1>
            <p style="color: #666;">Thank you for signing up on Pear Network!</p>
            <p style="color: #666;">To complete your registration, please click the button below:</p>
            <a href="${baseUrl}/verify-email?token=${verificationToken}" 
               style="display: inline-block; background-color: #4CAF50; color: white; 
                      padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
            <p style="color: #999; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;
    sendSmtpEmail.sender = { 
      "name": "Pear Network", 
      "email": "noreply@pearnetwork.com" 
    };
    sendSmtpEmail.to = [{ "email": email }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Verification email sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}