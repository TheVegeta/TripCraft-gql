import * as jwt from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { User } from "./entities/User";
import { JWT_SECRET } from "./env";
import { IJwtEncode, MyContext } from "./types";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const {
    req: {
      headers: { authorization },
    },
  } = context;

  if (!authorization) {
    throw Error("AUTH_ERROR");
  }

  try {
    const token = jwt.verify(authorization, JWT_SECRET) as IJwtEncode;
    const user = await User.findOneOrFail({
      where: { _id: token._id },
    });

    if (user) {
      context.user = user;
      return next();
    } else {
      throw Error("AUTH_ERROR");
    }
  } catch (err) {
    throw Error("AUTH_ERROR");
  }
};
