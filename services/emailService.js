// Email Service
import nodemailer from "nodemailer";

export const sendEmail = async (toEmail, subject, htmlContent) => {
  try {
    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // Gmail app password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject,
      html: htmlContent,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const generateOtpEmail = (otpCode) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MedSched OTP</title>
  </head>
  <body style="margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f0f4f8;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(90deg, #007BFF 0%, #00CFFF 100%); padding: 40px 0;">
      <tr>
        <td align="center">

          <table width="700" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 15px; overflow:hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            
            <!-- Hero Header -->
            <tr>
              <td style="background-color: #007BFF; padding: 40px; text-align:center;">
                <h1 style="color:#ffffff; font-size:36px; margin:0;">MedSched</h1>
                <p style="color:#e0f0ff; font-size:18px; margin:10px 0 0 0;">Bystander Registration OTP</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 50px; color:#333333;">
                <p style="font-size:18px; margin-bottom:20px;">Hello,</p>
                <p style="font-size:16px; line-height:1.6; margin-bottom:30px;">
                  Welcome to <b>MedSched</b>! Use the OTP below to complete your registration:
                </p>

                <!-- OTP Highlight -->
                <div style="text-align:center; margin:40px 0;">
                  <span style="
                    display:inline-block;
                    font-size:40px;
                    font-weight:bold;
                    color:#007BFF;
                    background-color:#e6f0ff;
                    padding:25px 60px;
                    border-radius:12px;
                    letter-spacing:6px;
                  ">${otpCode}</span>
                </div>

                <!-- Instruction -->
                <p style="font-size:16px; text-align:center; color:#555555; margin-bottom:40px;">
                  Copy this OTP and paste it in the registration form to verify your account.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f0f4f8; text-align:center; padding:25px; color:#888888; font-size:12px;">
                © ${new Date().getFullYear()} MedSched. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};
