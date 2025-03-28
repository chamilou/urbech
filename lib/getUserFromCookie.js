import { cookies } from "next/headers";
import { verifyToken } from "./auth"; // Adjust if you export it differently

export async function getUserFromCookie() {
  try {
    const cookieStore = cookies();
    const token = cookies().get("token")?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    console.log(decoded);
    return decoded; // typically contains id, name, role, email, etc.
  } catch (error) {
    console.error("Failed to verify token from cookie:", error);
    return null;
  }
}
