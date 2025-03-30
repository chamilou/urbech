// lib/mailer.js

import nodemailer from "nodemailer";

export async function sendVerificationEmail(to, code) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"My Shop" <no-reply@example.com>',
    to,
    subject: "Verify your email",
    html: `<p>Welcome to our shop!</p><p>Your verification code is: <strong>${code}</strong></p>`,
  });

  console.log("📨 Email sent:", info.messageId);
  console.log("🔗 Preview:", nodemailer.getTestMessageUrl(info));
}
