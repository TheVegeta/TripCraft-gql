import path from "path";

export const UPLOAD_DIR = path.resolve(process.cwd() + "/uploads");

export const ENTITY_PATH = path.resolve(__dirname + "/entities/**/*.ts");

export const __dev = process.env.NODE_ENV !== "production";
