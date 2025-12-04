import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Marisonia Stok Takip" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "E-posta Doğrulama Kodu",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e40af; margin: 0;">Marisonia Stok Takip</h1>
        </div>
        
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); border-radius: 16px; padding: 40px; text-align: center; color: white;">
          <h2 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 500;">Doğrulama Kodunuz</h2>
          <div style="font-size: 48px; font-weight: 700; letter-spacing: 12px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">
            Bu kod 10 dakika içinde geçerliliğini yitirecektir.
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Bu e-postayı siz talep etmediyseniz, lütfen dikkate almayınız.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
