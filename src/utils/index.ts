import fs from "fs-extra";
import jwt, { SignOptions } from "jsonwebtoken";
import LiveDirectory from "live-directory";
import { loggerPath, uploadPath } from "../constant";
import { JWT_SECRET } from "../env";
import { JwtPayload } from "../types";

fs.ensureFileSync(loggerPath);
fs.ensureDirSync(uploadPath);

export const toMilliseconds = (
  hours: number,
  minutes: number,
  seconds: number
): number => {
  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
};

export const LiveAssets = new LiveDirectory(uploadPath, {
  cache: {
    max_file_count: 200, // 2.5 MB * 200 = 250 MB - This means you won't go over 250 MB of cached memory for your assets
    max_file_size: 1024 * 1024 * 2.5, // 2.5 MB - Most assets will be under 2.5 MB hence they can be cached
  },
});

export const signJwt = <T extends JwtPayload>(
  data: T,
  signOptions: SignOptions
): string => {
  return jwt.sign(data, JWT_SECRET, signOptions);
};

export const decodeJwt = <T extends JwtPayload>(
  jwtToken: string
): T | boolean => {
  try {
    return jwt.verify(jwtToken, JWT_SECRET) as T;
  } catch (err) {
    return false;
  }
};
