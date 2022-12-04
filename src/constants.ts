import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 8080;
export const DB_URI = process.env.DB_URI;
export const DB_NAME = process.env.DB_NAME;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
