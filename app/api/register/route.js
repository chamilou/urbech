import prisma from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request) {
  const { name, email, password } = await request.json();

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return Response.json({ message: "User registered successfully", user });
}
