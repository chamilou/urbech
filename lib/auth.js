import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;
if (!process.env.SECRET_KEY) {
  throw new Error("Missing JWT_SECRET environment variable");
}

// Hash a password
export const hashPassword = async (password) => {
  return await bcryptjs.hash(password, 10);
};

// Compare a password with its hash
export const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

export const generateToken = (user) => {
  console.log("Generating token for user:", user); // Debug log
  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
  console.log("Generated token:", token); // Debug log
  return token;
};
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired. Please log in again.");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token. Please log in again.");
    } else {
      throw new Error("Authentication failed. Please log in again.");
    }
  }
};
