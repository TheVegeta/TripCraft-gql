import axios from "axios";
import _ from "lodash";
import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../entities/User";
import {
  IAuthStatusResponse,
  IGoogleAuth,
  IGoogleAuthResponse,
} from "../types";
import { signJwt } from "../utils";

@Resolver()
export class AuthResolver {
  @Mutation(() => IAuthStatusResponse)
  async signInWithGoogle(
    @Arg("options") options: IGoogleAuth
  ): Promise<IAuthStatusResponse> {
    try {
      const { id, token } = options;

      const response = await axios<IGoogleAuthResponse>({
        method: "get",
        url: "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token,
        withCredentials: true,
      });

      const findUser = await User.findOne({
        where: { email: _.toLower(response.data.email) },
      });

      if (findUser) {
        return {
          data: signJwt({ _id: findUser._id }, "28d"),
          msg: "Token created and user authenticated.",
          success: true,
        };
      } else {
        const newUser = new User();

        newUser.googleId = id;
        newUser.name = response.data.name;
        newUser.email = _.toLower(response.data.email);
        newUser.picture = response.data.picture;

        await newUser.save();

        newUser.createdBy = newUser;

        await newUser.save();

        return {
          data: signJwt({ _id: newUser._id }, "28d"),
          msg: "Token created and user authenticated.",
          success: true,
        };
      }
    } catch (err) {
      return {
        data: "",
        msg: "Authentication failed.",
        success: true,
      };
    }
  }
}
