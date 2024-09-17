import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./env";

export const toMilliseconds = (
  hours: number,
  minutes: number,
  seconds: number
): number => {
  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
};

export const signJwt = ({ _id }: { _id: string }, expiresIn?: string) => {
  return jwt.sign({ _id }, JWT_SECRET, { expiresIn: expiresIn || "1h" });
};

export const decodeJwt = (
  jwtToken: string
): { success: boolean; _id: string } => {
  try {
    var { _id } = jwt.verify(jwtToken, JWT_SECRET) as { _id: string };
    return { _id, success: true };
  } catch (err) {
    return { _id: "", success: false };
  }
};
