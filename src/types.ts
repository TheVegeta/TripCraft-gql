import { Request, Response } from "express";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "./entities/User";

@InputType()
export class IGetById {
  @Field()
  id!: string;
}

@InputType()
export class IGoogleAuth {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field()
  photo!: string;

  @Field()
  token!: string;
}

@ObjectType()
export class IItineraryToken {
  @Field()
  code!: string;
}

@ObjectType()
export class IStatusResponse {
  @Field()
  success!: boolean;
}

@ObjectType()
export class IAuthStatusResponse {
  @Field()
  success!: boolean;

  @Field()
  data!: string;

  @Field()
  msg!: string;
}

export interface IJwtEncode {
  _id: string;
}

export interface MyContext {
  req: Request;
  res: Response;
  user: User;
}

export interface IGoogleAuthResponse {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: string;
  exp: string;
  alg: string;
  kid: string;
  typ: string;
}
