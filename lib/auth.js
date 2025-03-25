import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your-secret-key";

// Hash a password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare a password with its hash
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate a JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
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
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// const ACCESS_TOKEN_SECRET =
//   process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
// const REFRESH_TOKEN_SECRET =
//   process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";
// const ACCESS_TOKEN_EXPIRY = "15m"; // Short-lived access token
// const REFRESH_TOKEN_EXPIRY = "7d"; // Long-lived refresh token

// export const hashPassword = async (password) => {
//   const saltRounds = 12; // More secure than 10
//   return await bcrypt.hash(password, saltRounds);
// };

// export const comparePassword = async (password, hashedPassword) => {
//   return await bcrypt.compare(password, hashedPassword);
// };

// export const generateAccessToken = (user) => {
//   return jwt.sign(
//     {
//       id: user.id,
//       name: user.name,
//       role: user.role || "USER", // Default role
//     },
//     ACCESS_TOKEN_SECRET,
//     { expiresIn: ACCESS_TOKEN_EXPIRY }
//   );
// };

// export const generateRefreshToken = (user) => {
//   return jwt.sign(
//     { id: user.id }, // Minimal payload for refresh token
//     REFRESH_TOKEN_SECRET,
//     { expiresIn: REFRESH_TOKEN_EXPIRY }
//   );
// };

// export const verifyAccessToken = (token) => {
//   try {
//     return jwt.verify(token, ACCESS_TOKEN_SECRET);
//   } catch (error) {
//     handleTokenError(error);
//   }
// };

// export const verifyRefreshToken = (token) => {
//   try {
//     return jwt.verify(token, REFRESH_TOKEN_SECRET);
//   } catch (error) {
//     handleTokenError(error);
//   }
// };

// const handleTokenError = (error) => {
//   if (error.name === "TokenExpiredError") {
//     throw new Error("Session expired. Please log in again.");
//   }
//   throw new Error("Invalid token. Please authenticate.");
// };
