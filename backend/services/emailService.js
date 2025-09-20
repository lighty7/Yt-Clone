const nodemailer = require("nodemailer");
require("dotenv").config();

// Validate email configuration
const validateEmailConfig = () => {
  const requiredVars = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required email configuration: ${missing.join(", ")}`
    );
  }
};

// Create transporter with error handling
const createTransporter = () => {
  try {
    validateEmailConfig();

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Add connection timeout and retry settings
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
    });
  } catch (error) {
    console.error("❌ Email configuration error:", error.message);
    throw new Error("Email service is not properly configured");
  }
};

// Test email connection
const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email service connection verified");
    return true;
  } catch (error) {
    console.error("❌ Email service connection failed:", error.message);
    return false;
  }
};

// Send verification email with retry logic
const sendVerificationEmail = async (
  email,
  name,
  verificationToken,
  retryCount = 0
) => {
  const maxRetries = 3;

  try {
    // Validate inputs
    if (!email || !name || !verificationToken) {
      throw new Error("Missing required parameters for email sending");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const transporter = createTransporter();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: {
        name: "YouTube Clone",
        address: process.env.SMTP_USER,
      },
      to: email,
      subject: "Verify Your Email - YouTube Clone",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to YouTube Clone!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for signing up! To complete your registration and start using our platform, 
              please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If the button doesn't work, you can also copy and paste this link into your browser:
            </p>
            
            <p style="color: #667eea; font-size: 14px; word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px;">
              ${verificationUrl}
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              This verification link will expire in 24 hours. If you didn't create an account, 
              please ignore this email.
            </p>
          </div>
          
          <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 YouTube Clone. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(
      `❌ Error sending verification email (attempt ${retryCount + 1}):`,
      error.message
    );

    // Retry logic for transient errors
    if (
      retryCount < maxRetries &&
      (error.code === "ECONNECTION" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ENOTFOUND" ||
        error.message.includes("timeout"))
    ) {
      console.log(
        `🔄 Retrying email send (attempt ${retryCount + 2}/${
          maxRetries + 1
        })...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 * (retryCount + 1))
      ); // Exponential backoff
      return sendVerificationEmail(
        email,
        name,
        verificationToken,
        retryCount + 1
      );
    }

    return {
      success: false,
      error: error.message,
      code: error.code || "UNKNOWN_ERROR",
    };
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, name) => {
  try {
    // Validate inputs
    if (!email || !name) {
      throw new Error("Missing required parameters for welcome email");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "YouTube Clone",
        address: process.env.SMTP_USER,
      },
      to: email,
      subject: "Welcome to YouTube Clone! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to YouTube Clone!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your email has been successfully verified! You can now enjoy all the features of our platform.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/dashboard" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                Go to Dashboard
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Thank you for joining us! We're excited to have you on board.
            </p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.message);
    return {
      success: false,
      error: error.message,
      code: error.code || "UNKNOWN_ERROR",
    };
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  testEmailConnection,
  validateEmailConfig,
};
