import { UploadedFile } from "express-fileupload";
import { Request } from "polka";
import { AuthType } from "./entity/User";

export interface IGoogleAuthResponse {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface IJwtAuthResponse {
  _id: string;
  email: string;
  name: string;
  picture: string;
  authType: AuthType;
}

export type JwtPayload = {
  [key: string]: any;
};

export interface ICustomResponse extends Request {
  files: { [key: string]: UploadedFile };
}
