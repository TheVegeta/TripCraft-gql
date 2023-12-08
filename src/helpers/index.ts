import crypto from "crypto";
import fs from "fs-extra";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import LiveDirectory from "live-directory";
import path from "path";
import { JWT_SECRET } from "../utils/env";

export const uploadPath = path.resolve(process.cwd() + "/upload");

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

export const toMilliseconds = (
  hours: number,
  minutes: number,
  seconds: number
): number => {
  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
};

export const LiveAssets = new LiveDirectory(uploadPath, {
  cache: {
    max_file_count: 100,
    max_file_size: 1024 * 1024 * 2.5,
  },
});

export const getFileHash = async (filePath: string) => {
  const fileBuffer = await fs.promises.readFile(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};
