import sgMail from "@sendgrid/mail";

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY is not defined in environment variables");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL =
  process.env.SENDGRID_FROM_EMAIL || "noreply@halohair-lounge.site";
const FROM_NAME = process.env.SENDGRID_FROM_NAME || "Halo Hair Lounge";

interface SendVerificationEmailParams {
  to: string;
  name: string;
  verificationCode: string;
  verificationLink: string;
}

export async function sendVerificationEmail({
  to,
  name,
  verificationCode,
  verificationLink,
}: SendVerificationEmailParams) {
  const msg = {
    to,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    subject: "Verify Your Email - Halo Hair Lounge",
    text: `Hello ${name},\n\nThank you for signing up at Halo Hair Lounge!\n\nYour verification code is: ${verificationCode}\n\nOr click this link to verify your email:\n${verificationLink}\n\nThis code will expire in 24 hours.\n\nIf you didn't create an account, please ignore this email.\n\nBest regards,\nHalo Hair Lounge Team`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f0f9ff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Halo Hair Lounge</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #0f172a; font-size: 24px; font-weight: bold;">Welcome, ${name}! 👋</h2>
              
              <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                Thank you for signing up at Halo Hair Lounge! We're excited to have you join our community.
              </p>
              
              <p style="margin: 0 0 30px; color: #475569; font-size: 16px; line-height: 1.6;">
                To complete your registration and access your account, please verify your email address using the code below:
              </p>
              
              <!-- Verification Code Box -->
              <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; color: #0c4a6e; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                <p style="margin: 0; color: #0369a1; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${verificationCode}</p>
              </div>
              
              <p style="margin: 0 0 25px; color: #475569; font-size: 16px; line-height: 1.6; text-align: center;">
                Or click the button below to verify instantly:
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(14, 165, 233, 0.3);">
                  Verify Email Address
                </a>
              </div>
              
              <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
                <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                  ⏰ This code will expire in <strong>24 hours</strong>.
                </p>
                <p style="margin: 0; color: #64748b; font-size: 14px;">
                  🔒 If you didn't create an account, please ignore this email.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #0ea5e9;">Halo Hair Lounge Team</strong>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                © ${new Date().getFullYear()} Halo Hair Lounge. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Verification email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

interface SendWelcomeEmailParams {
  to: string;
  name: string;
}

export async function sendWelcomeEmail({ to, name }: SendWelcomeEmailParams) {
  const msg = {
    to,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    subject: "Welcome to Halo Hair Lounge! 💇‍♀️",
    text: `Hello ${name},\n\nWelcome to Halo Hair Lounge! Your email has been verified successfully.\n\nYou can now:\n- Book appointments\n- Browse our services\n- Shop premium hair products\n- Manage your account\n\nVisit us at: ${process.env.NEXT_PUBLIC_APP_URL}\n\nBest regards,\nHalo Hair Lounge Team`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Halo Hair Lounge</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f0f9ff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Welcome to Halo Hair Lounge! 💇‍♀️</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #0f172a; font-size: 24px; font-weight: bold;">Hello ${name}! 🎉</h2>
              
              <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                Your email has been verified successfully! You're now part of the Halo Hair Lounge family.
              </p>
              
              <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0 0 15px; color: #0c4a6e; font-size: 16px; font-weight: bold;">What you can do now:</p>
                <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
                  <li>📅 Book your next hair appointment</li>
                  <li>✂️ Explore our premium services</li>
                  <li>🛍️ Shop exclusive hair care products</li>
                  <li>👤 Manage your profile and preferences</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL
                }" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(14, 165, 233, 0.3);">
                  Get Started
                </a>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #0ea5e9;">Halo Hair Lounge Team</strong>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                © ${new Date().getFullYear()} Halo Hair Lounge. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Welcome email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
}

interface SendPasswordResetEmailParams {
  to: string;
  name: string;
  resetToken: string;
  resetLink: string;
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetToken,
  resetLink,
}: SendPasswordResetEmailParams) {
  const msg = {
    to,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    subject: "Reset Your Password - Halo Hair Lounge",
    text: `Hello ${name},\n\nWe received a request to reset your password.\n\nYour password reset code is: ${resetToken}\n\nOr click this link to reset your password:\n${resetLink}\n\nThis code will expire in 1 hour.\n\nIf you didn't request a password reset, please ignore this email or contact us if you have concerns.\n\nBest regards,\nHalo Hair Lounge Team`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f0f9ff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Reset Your Password</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #0f172a; font-size: 24px; font-weight: bold;">Hello ${name}! 👋</h2>
              
              <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your Halo Hair Lounge account.
              </p>
              
              <p style="margin: 0 0 30px; color: #475569; font-size: 16px; line-height: 1.6;">
                Use the code below to reset your password:
              </p>
              
              <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; color: #0c4a6e; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Reset Code</p>
                <p style="margin: 0; color: #0369a1; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${resetToken}</p>
              </div>
              
              <p style="margin: 0 0 25px; color: #475569; font-size: 16px; line-height: 1.6; text-align: center;">
                Or click the button below to reset your password directly:
              </p>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(14, 165, 233, 0.3);">
                  Reset Password
                </a>
              </div>
              
              <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
                <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                  ⏰ This code will expire in <strong>1 hour</strong>.
                </p>
                <p style="margin: 0; color: #64748b; font-size: 14px;">
                  🔒 If you didn't request a password reset, please ignore this email or contact us if you have concerns.
                </p>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #0ea5e9;">Halo Hair Lounge Team</strong>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                © ${new Date().getFullYear()} Halo Hair Lounge. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Password reset email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}
