import SibApiV3Sdk from '@sendinblue/client';
import crypto from 'crypto';

// Brevo Configuration
const brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();
brevoClient.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// Generate Email Verification Token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send Verification Email
export const sendVerificationEmail = async (email, verificationToken, baseUrl) => {
  const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;
  
  const sender = {
    email: 'notifications@pearnet.com',
    name: 'PearNet'
  };

  const receivers = [{ email }];

  try {
    await brevoClient.sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Verify Your PearNet Account',
      htmlContent: `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your PearNet account:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
      textContent: `Verify your PearNet account by clicking this link: ${verificationLink}`
    });
    
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send Post Notification Email
export const sendPostNotificationEmail = async (email, postDetails, baseUrl) => {
  const sender = {
    email: 'notifications@pearnet.com',
    name: 'PearNet'
  };

  const receivers = [{ email }];

  try {
    await brevoClient.sendTransacEmail({
      sender,
      to: receivers,
      subject: 'New Post on PearNet',
      htmlContent: `
        <h1>New Post Notification</h1>
        <p>A new post has been made that might interest you:</p>
        <p>Post by: ${postDetails.postedBy}</p>
        <p>Content: ${postDetails.text.substring(0, 100)}...</p>
        <a href="${baseUrl}/post/${postDetails._id}">View Post</a>
      `,
      textContent: `New post on PearNet by ${postDetails.postedBy}: ${postDetails.text.substring(0, 100)}...`
    });
    
    return true;
  } catch (error) {
    console.error('Error sending post notification:', error);
    return false;
  }
};