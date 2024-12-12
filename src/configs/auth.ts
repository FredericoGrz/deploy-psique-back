import dotenv from "dotenv";

dotenv.config();

export default {
  jwt: {
    secret: process.env.AUTH_SECRET || "00000000",
    expiresIn: process.env.JWT_EXPIRATION || "1d",
  },
};
