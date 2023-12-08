import ms from "ms";
import path from "path";
import { toMilliseconds } from "../helpers";

export const __CWD = process.cwd();

export const __dev = process.env.NODE_ENV !== "production";

export const max_body_length = 1024 * 1024 * 5; // 5mb size limit

export const ensureDir = ["upload", "src/gql"];

export const entityPath = path.resolve(__dirname + "/entity/**/*.ts");

export const gqlPath = path.resolve(process.cwd() + "/src/gql/schema.gql");

export const googleSignInJwtTime = ms(toMilliseconds(0, 5, 0)); // 5 min

export const jwtSignInTime = ms(toMilliseconds(24 * 28, 0, 0)); // 28 days
