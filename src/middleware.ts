import { MiddlewareFn } from "type-graphql";
import { User } from "./entity/User";
import { IGraphqlContext, IJwtAuthResponse } from "./types";
import { decodeJwt } from "./utils";

export const isUserAuthenticated: MiddlewareFn<IGraphqlContext> = async (
  { context },
  next
) => {
  const {
    req: {
      headers: { authorization },
    },
  } = context;

  if (!authorization) {
    throw Error("AUTH_ERROR");
  }

  try {
    const jwtResponse = decodeJwt<IJwtAuthResponse>(authorization);

    if (typeof jwtResponse === "boolean") {
      throw Error("AUTH_ERROR");
    } else {
      const user = await User.findOneOrFail({
        where: { _id: jwtResponse._id },
        cache: true,
      });

      if (user) {
        context.user = user;
        return next();
      } else {
        throw Error("AUTH_ERROR");
      }
    }
  } catch (err) {
    throw Error("AUTH_ERROR");
  }
};
