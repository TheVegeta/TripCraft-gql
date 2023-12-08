import { Request, Response } from "hyper-express";
import { AuthType, User } from "./entity/User";

export interface IGqlContext {
  req: Request;
  res: Response;
  user: User;
}

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
