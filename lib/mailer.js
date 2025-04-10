// lib/mailer.js

// import nodemailer from "nodemailer";

// export async function sendVerificationEmail(to, code) {
//   const testAccount = await nodemailer.createTestAccount();

//   const transporter = nodemailer.createTransport({
//     host: testAccount.smtp.host,
//     port: testAccount.smtp.port,
//     secure: testAccount.smtp.secure,
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });

//   const info = await transporter.sendMail({
//     from: '"My Shop" <no-reply@example.com>',
//     to,
//     subject: "Verify your email",
//     html: `<p>Welcome to our shop!</p><p>Your verification code is: <strong>${code}</strong></p>`,
//   });

//   console.log("📨 Email sent:", info.messageId);
//   console.log("🔗 Preview:", nodemailer.getTestMessageUrl(info));
// }

// in production

import nodemailer from "nodemailer";

export async function sendVerificationEmail(to, code) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true, // TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"My Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email",
    html: `<p>Welcome to our shop!</p><p>Your verification code is: <strong>${code}</strong></p>`,
  });

  console.log(" Email sent:", info.messageId);
}

// lib/mailer.js

export async function sendOrderPdfEmail({ to, orderId, pdfBuffer }) {
  const transporter = nodemailer.createTransport({
    host: "mail.infomaniak.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Your Order Confirmation #${orderId}`,
    text: `Hi! Your order has been placed successfully. Please find your invoice attached.`,
    attachments: [
      {
        filename: `order-summary-${orderId}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.messageId);
}
