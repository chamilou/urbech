// import prisma from "@/lib/db";
// import { hashPassword } from "@/lib/auth";
// import { sendVerificationEmail } from "@/lib/mailer";
// const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
// export async function POST(request) {
//   const { name, email, password } = await request.json();
//   const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     auth: {
//       user: process.env.ETHEREAL_USER,
//       pass: process.env.ETHEREAL_PASS,
//     },
//   });
//   const hashedPassword = await hashPassword(password);

//   const user = await prisma.user.create({
//     data: {
//       name,
//       email,
//       password: hashedPassword,
//       verificationCode: code,
//       isVerified: false,
//     },
//   });
//   await sendVerificationEmail(email, code);
//   return Response.json({ message: "User registered successfully", user });
// }
import nodemailer from "nodemailer";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mailer";

const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

export async function POST(request) {
  const { name, email, password } = await request.json();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER,
      pass: process.env.ETHEREAL_PASS,
    },
  });

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verificationCode: code,
      isVerified: false,
    },
  });

  await sendVerificationEmail(email, code);

  return Response.json({ message: "User registered successfully", user });
}
