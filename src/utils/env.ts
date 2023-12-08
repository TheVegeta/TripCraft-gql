import { parseEnv } from "znv";
import { z } from "zod";

export const {
  DB_NAME,
  DB_PASS,
  DB_USER,
  PORT,
  GOOGLE_AUTH_REDIRECT_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET,
} = parseEnv(process.env, {
  PORT: z.number().min(1),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  GOOGLE_AUTH_REDIRECT_URI: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  JWT_SECRET: z.string(),
});
