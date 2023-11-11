import stringify from "fast-json-stable-stringify";
import fs from "fs-extra";
import { StatusCodes } from "http-status-codes";
import jwt, { SignOptions } from "jsonwebtoken";
import LiveDirectory from "live-directory";
import polka, { ErrorHandler, IError, Request, Response } from "polka";
import { logger, loggerPath, uploadPath } from "../constant";
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

export const onError: ErrorHandler<Request> = (
  err: string | IError,
  req: Request,
  res: Response,
  next: VoidFunction
) => {
  logger.error(err);
  res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  res.end("Internal Server Error.");
};

export const megabytesToBytes = (megabytes: number) => {
  return megabytes * 1024 * 1024;
};

export const Router = () => polka({ onError });

export const sendJson = <T>(res: Response, data: T) => {
  res.setHeader("content-type", "application/json");
  res.end(stringify(data));
};

export const handleRedirect = (
  url: string,
  res: Response,
  status: number | null = null
) => {
  res
    .writeHead(status || StatusCodes.MOVED_PERMANENTLY, {
      location: url,
    })
    .end();
};
