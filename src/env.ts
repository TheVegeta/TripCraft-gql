import "dotenv/config";
import { parseEnv } from "znv";
import { z } from "zod";

export const { PORT, DB_NAME, DB_PASSWORD, DB_USERNAME, JWT_SECRET } = parseEnv(
  process.env,
  {
    PORT: z.number(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    JWT_SECRET: z.string(),
  }
);
