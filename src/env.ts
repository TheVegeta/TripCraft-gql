import { parseEnv } from "znv";
import { z } from "zod";

export const {
  PORT,
  PG_DB_NAME,
  PG_DB_PASS,
  PG_DB_USER,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_AUTH_REDIRECT_URI,
  JWT_SECRET,
} = parseEnv(process.env, {
  PORT: z.number(),
  PG_DB_NAME: z.string(),
  PG_DB_USER: z.string(),
  PG_DB_PASS: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_AUTH_REDIRECT_URI: z.string(),
  JWT_SECRET: z.string(),
});
