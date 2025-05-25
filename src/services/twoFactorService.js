import speakeasy from 'speakeasy';
import nodemailer from 'nodemailer';
import qrcode from 'qrcode';

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const generateSecret = () => {
  return speakeasy.generateSecret({
    name: 'WhiskersWonderland'
  });
};

export const verifyToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1 // Allow 30 seconds clock skew
  });
};

export const generateQRCode = async (secret) => {
  try {
    return await qrcode.toDataURL(secret.otpauth_url);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your 2FA Verification Code',
    html: `
      <h1>Two-Factor Authentication</h1>
      <p>Your verification code is: <strong>${token}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}; 