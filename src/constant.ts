import ms from "ms";
import path from "path";
import pino from "pino";
import { z } from "zod";

const toMilliseconds = (
  hours: number,
  minutes: number,
  seconds: number
): number => {
  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
};

export const entityPath = path.resolve(__dirname + "/entity/**/*.ts");

export const loggerPath = path.resolve(process.cwd() + "/logger.log");
export const gqlPath = path.resolve(process.cwd() + "/src/gql/schema.gql");
export const uploadPath = path.resolve(process.cwd() + "/uploads");

export const max_body_length = 1024 * 1024 * 5; // 5mb size limit
export const __developement = process.env.NODE_ENV !== "production";

export const googleSignInJwtTime = ms(toMilliseconds(0, 5, 0)); // 5 min
export const jwtSignInTime = ms(toMilliseconds(24 * 28, 0, 0)); // 28 days

export const logger = pino({}, pino.destination(loggerPath));

export const fileSize = 1024 * 1024 * 2;

export const authQuery = z.object({
  authJwt: z.string(),
  success: z.string(),
});
